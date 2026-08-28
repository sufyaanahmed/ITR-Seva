mod config;
mod error;
mod metrics;
mod models;
mod routes;
mod state;
mod worker;

use std::{
    net::SocketAddr,
    time::{Duration, Instant},
};

use axum::{
    Router,
    extract::{ConnectInfo, DefaultBodyLimit, Request, State},
    http::{HeaderName, HeaderValue, Method, StatusCode, header},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::{get, post, put},
};
use config::Config;
use error::ApiError;
use metrics::Metrics;
use sqlx::{Executor, postgres::PgPoolOptions};
use state::AppState;
use tokio::{net::TcpListener, sync::broadcast};
use tower_http::{
    catch_panic::CatchPanicLayer,
    compression::CompressionLayer,
    cors::{AllowOrigin, CorsLayer},
    request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer},
    sensitive_headers::SetSensitiveHeadersLayer,
    timeout::TimeoutLayer,
    trace::TraceLayer,
};
use tracing::{info, warn};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .json()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("visa_seva_api=info,tower_http=info")),
        )
        .with_current_span(false)
        .init();

    let config = Config::from_env().map_err(|message| format!("configuration error: {message}"))?;
    let pool = PgPoolOptions::new()
        .max_connections(config.database_max_connections)
        .min_connections(config.database_min_connections)
        .acquire_timeout(config.database_acquire_timeout)
        .idle_timeout(Some(Duration::from_secs(300)))
        .max_lifetime(Some(Duration::from_secs(1_800)))
        .after_connect(|connection, _| Box::pin(async move {
            connection.execute("SET statement_timeout = '2500ms'; SET lock_timeout = '500ms'; SET idle_in_transaction_session_timeout = '3000ms';").await?;
            Ok(())
        }))
        .connect(&config.database_url)
        .await?;

    if config.run_migrations {
        sqlx::migrate!().run(&pool).await?;
    }

    let metrics = Metrics::new()?;
    let state = AppState::new(pool, config.clone(), metrics);
    let public_app = public_router(state.clone())?;
    let internal_app = internal_router(state.clone());
    let public_listener = TcpListener::bind(config.api_addr).await?;
    let internal_listener = TcpListener::bind(config.internal_addr).await?;
    info!(address = %config.api_addr, "public API listening");
    info!(address = %config.internal_addr, "local operator API listening");

    let (shutdown_tx, _) = broadcast::channel::<()>(1);
    let mut public_shutdown = shutdown_tx.subscribe();
    let mut internal_shutdown = shutdown_tx.subscribe();
    tokio::spawn(worker::run(state, shutdown_tx.subscribe()));
    let signal_tx = shutdown_tx.clone();
    tokio::spawn(async move {
        shutdown_signal().await;
        let _ = signal_tx.send(());
    });

    let public_server = axum::serve(
        public_listener,
        public_app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(async move {
        let _ = public_shutdown.recv().await;
    });
    let internal_server =
        axum::serve(internal_listener, internal_app).with_graceful_shutdown(async move {
            let _ = internal_shutdown.recv().await;
        });
    tokio::try_join!(public_server, internal_server)?;
    info!("shutdown complete");
    Ok(())
}

fn public_router(state: AppState) -> Result<Router, Box<dyn std::error::Error>> {
    let allowed_origins = state
        .config
        .allowed_origins
        .iter()
        .map(|origin| origin.parse::<HeaderValue>())
        .collect::<Result<Vec<_>, _>>()?;
    let request_id_header = HeaderName::from_static("x-request-id");
    let timeout = state.config.request_timeout;

    let router = Router::new()
        .route(
            "/api/v1/reference/visa-categories",
            get(routes::reference_categories),
        )
        .route("/api/v1/sessions", post(routes::create_session))
        .route("/api/v1/applications", post(routes::create_application))
        .route(
            "/api/v1/showcase-completions",
            post(routes::create_showcase_completion),
        )
        .route(
            "/api/v1/applications/{id}",
            get(routes::get_application).patch(routes::update_application),
        )
        .route(
            "/api/v1/applications/{id}/documents",
            put(routes::put_document),
        )
        .route(
            "/api/v1/applications/{id}/submit",
            post(routes::submit_application),
        )
        .route(
            "/api/v1/applications/{id}/status",
            get(routes::application_status),
        )
        .fallback(not_found)
        .layer(DefaultBodyLimit::max(1_048_576))
        .layer(CompressionLayer::new())
        .layer(
            CorsLayer::new()
                .allow_origin(AllowOrigin::list(allowed_origins))
                .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::PUT])
                .allow_headers([
                    header::AUTHORIZATION,
                    header::CONTENT_TYPE,
                    HeaderName::from_static("idempotency-key"),
                    request_id_header.clone(),
                ])
                .max_age(Duration::from_secs(600)),
        )
        .layer(TimeoutLayer::with_status_code(
            StatusCode::REQUEST_TIMEOUT,
            timeout,
        ))
        .layer(CatchPanicLayer::new())
        .layer(SetSensitiveHeadersLayer::new(std::iter::once(
            header::AUTHORIZATION,
        )))
        .layer(PropagateRequestIdLayer::new(request_id_header.clone()))
        .layer(SetRequestIdLayer::new(request_id_header, MakeRequestUuid))
        .layer(TraceLayer::new_for_http())
        .layer(middleware::from_fn_with_state(
            state.clone(),
            measure_requests,
        ))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            enforce_rate_limit,
        ))
        .layer(middleware::from_fn_with_state(state.clone(), shed_overload))
        .with_state(state);
    Ok(router)
}

fn internal_router(state: AppState) -> Router {
    Router::new()
        .route("/internal/live", get(routes::live))
        .route("/internal/ready", get(routes::ready))
        .route("/internal/metrics", get(routes::metrics))
        .fallback(not_found)
        .with_state(state)
}

async fn not_found() -> impl IntoResponse {
    ApiError::NotFound
}

async fn shed_overload(State(state): State<AppState>, request: Request, next: Next) -> Response {
    let Ok(_permit) = state.capacity.clone().try_acquire_owned() else {
        state.metrics.overload_rejections.inc();
        return ApiError::Overloaded.into_response();
    };
    next.run(request).await
}

async fn enforce_rate_limit(
    State(state): State<AppState>,
    request: Request,
    next: Next,
) -> Response {
    let peer = request
        .extensions()
        .get::<ConnectInfo<SocketAddr>>()
        .map(|info| info.0.ip().to_string())
        .unwrap_or_else(|| "unknown".into());
    let path = request.uri().path();
    let (scope, limit) = if path == "/api/v1/sessions" {
        ("sessions", state.config.session_rate_limit_per_second)
    } else if path.ends_with("/status") {
        ("status", state.config.status_rate_limit_per_second)
    } else {
        ("general", state.config.rate_limit_per_second)
    };
    // Always apply the peer ceiling before authentication. Otherwise an attacker
    // can rotate fake bearer tokens to manufacture unlimited limiter identities.
    let key = format!("{scope}:peer:{peer}");
    if !state.rate_limit_allows(key, limit) {
        state.metrics.rate_limit_rejections.inc();
        return ApiError::RateLimited.into_response();
    }
    next.run(request).await
}

async fn measure_requests(State(state): State<AppState>, request: Request, next: Next) -> Response {
    let method = request.method().as_str().to_owned();
    let authenticated_request = request.headers().contains_key(header::AUTHORIZATION);
    let started = Instant::now();
    state.metrics.in_flight.inc();
    let mut response = next.run(request).await;
    if authenticated_request {
        response
            .headers_mut()
            .insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
    }
    state.metrics.in_flight.dec();
    let status = response.status().as_str().to_owned();
    state
        .metrics
        .requests
        .with_label_values(&[method.as_str(), status.as_str()])
        .inc();
    state
        .metrics
        .request_duration
        .with_label_values(&[method.as_str()])
        .observe(started.elapsed().as_secs_f64());
    response
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };
    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install SIGTERM handler")
            .recv()
            .await;
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! { _ = ctrl_c => {}, _ = terminate => {} }
    warn!("shutdown requested; draining accepted requests");
}
