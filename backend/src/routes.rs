use std::collections::HashSet;

use axum::{
    Json,
    extract::{Path, State},
    http::{HeaderMap, HeaderValue, StatusCode, header},
    response::{IntoResponse, Response},
};
use chrono::{Duration as ChronoDuration, Utc};
use serde_json::{Value, json};
use uuid::Uuid;

use crate::{
    error::ApiError,
    models::{
        ApplicationRow, ApplicationView, CreateApplication, CreateSession, DocumentStored,
        PutDocument, SessionCreated, ShowcaseCompletion, StatusEvent, StatusView, SubmissionResult,
        SubmitApplication, UpdateApplication, validate_application, validate_document,
        validate_document_input,
    },
    state::{AppState, token_hash},
};

const REFERENCE_ETAG: &str = "\"visa-reference-2026-08-27-v1\"";

pub async fn live() -> Json<Value> {
    Json(json!({"status": "alive"}))
}

pub async fn ready(State(state): State<AppState>) -> Result<Json<Value>, ApiError> {
    sqlx::query_scalar::<_, i32>("SELECT 1")
        .fetch_one(&state.pool)
        .await?;
    Ok(Json(json!({
        "status": "ready",
        "database": "available",
        "pool_size": state.pool.size(),
        "pool_idle": state.pool.num_idle(),
    })))
}

pub async fn metrics(State(state): State<AppState>) -> Result<Response, ApiError> {
    let body = state.metrics.render().map_err(|_| ApiError::Internal)?;
    Ok((
        [(
            header::CONTENT_TYPE,
            "text/plain; version=0.0.4; charset=utf-8",
        )],
        body,
    )
        .into_response())
}

pub async fn reference_categories(headers: HeaderMap) -> Response {
    if headers
        .get(header::IF_NONE_MATCH)
        .and_then(|value| value.to_str().ok())
        == Some(REFERENCE_ETAG)
    {
        return StatusCode::NOT_MODIFIED.into_response();
    }

    let mut response = Json(json!({
        "ruleset_id": "reviewed-2026-08-27-v1",
        "reviewed_at": "2026-08-27",
        "demo_only": true,
        "application_types": ["evisa", "afghan", "voa", "regular"],
        "warning": "Verify live eligibility and requirements with the official Government of India portal.",
    })).into_response();
    response
        .headers_mut()
        .insert(header::ETAG, HeaderValue::from_static(REFERENCE_ETAG));
    response.headers_mut().insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("public, max-age=300, stale-while-revalidate=3600"),
    );
    response
}

pub async fn create_session(
    State(state): State<AppState>,
    Json(payload): Json<CreateSession>,
) -> Result<Response, ApiError> {
    let label = payload
        .client_label
        .unwrap_or_else(|| "browser-demo".into());
    let label = label.trim();
    if label.is_empty() || label.len() > 80 || label.chars().any(char::is_control) {
        return Err(ApiError::Invalid(
            "client_label must contain 1-80 printable characters".into(),
        ));
    }

    let id = Uuid::now_v7();
    let token = format!(
        "demo_{}{}",
        Uuid::new_v4().simple(),
        Uuid::new_v4().simple()
    );
    let hash = token_hash(&token);
    let ttl = ChronoDuration::from_std(state.config.session_ttl).map_err(|_| ApiError::Internal)?;
    let expires_at = Utc::now() + ttl;

    sqlx::query("INSERT INTO demo_sessions (id, token_hash, client_label, expires_at) VALUES ($1, $2, $3, $4)")
        .bind(id)
        .bind(hash.as_slice())
        .bind(label)
        .bind(expires_at)
        .execute(&state.pool)
        .await?;
    state.cache_session(hex::encode(hash), id, expires_at);

    let mut response = (
        StatusCode::CREATED,
        Json(SessionCreated { token, expires_at }),
    )
        .into_response();
    response
        .headers_mut()
        .insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
    Ok(response)
}

pub async fn create_application(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<CreateApplication>,
) -> Result<(StatusCode, Json<ApplicationView>), ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    validate_application(&payload.application_type, &payload.data).map_err(ApiError::Invalid)?;

    let id = Uuid::now_v7();
    let reference = format!(
        "VSL-DEMO-{}-{}",
        Utc::now().format("%Y%m%d"),
        &Uuid::new_v4().simple().to_string()[..12].to_ascii_uppercase()
    );
    let mut transaction = state.pool.begin().await?;
    enforce_application_quota(&mut transaction, session_id).await?;
    let row = sqlx::query_as::<_, ApplicationRow>(
        "INSERT INTO applications (id, session_id, reference, application_type, data) \
         VALUES ($1, $2, $3, $4, $5) \
         RETURNING id, reference, application_type, status::text AS status, version, data, created_at, updated_at, submitted_at",
    )
    .bind(id)
    .bind(session_id)
    .bind(&reference)
    .bind(&payload.application_type)
    .bind(&payload.data)
    .fetch_one(&mut *transaction)
    .await?;

    sqlx::query("INSERT INTO application_status_history (application_id, status, detail) VALUES ($1, 'DRAFT', 'Synthetic draft created')")
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    sqlx::query("INSERT INTO audit_events (session_id, application_id, action) VALUES ($1, $2, 'application.created')")
        .bind(session_id)
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;

    Ok((StatusCode::CREATED, Json(row.into())))
}

pub async fn get_application(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> Result<Json<ApplicationView>, ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    let row = fetch_application(&state, session_id, id)
        .await?
        .ok_or(ApiError::NotFound)?;
    Ok(Json(row.into()))
}

pub async fn update_application(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateApplication>,
) -> Result<Json<ApplicationView>, ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    let application_type = payload
        .data
        .get("application_type")
        .and_then(Value::as_str)
        .unwrap_or_default();
    validate_application(application_type, &payload.data).map_err(ApiError::Invalid)?;
    if payload.version < 1 {
        return Err(ApiError::Invalid("version must be positive".into()));
    }

    let row = sqlx::query_as::<_, ApplicationRow>(
        "UPDATE applications SET data = $1, version = version + 1, updated_at = now() \
         WHERE id = $2 AND session_id = $3 AND version = $4 AND status = 'DRAFT' AND application_type = $5 \
         RETURNING id, reference, application_type, status::text AS status, version, data, created_at, updated_at, submitted_at",
    )
    .bind(&payload.data)
    .bind(id)
    .bind(session_id)
    .bind(payload.version)
    .bind(application_type)
    .fetch_optional(&state.pool)
    .await?;

    match row {
        Some(row) => Ok(Json(row.into())),
        None => {
            let current = sqlx::query_as::<_, (String, String, i32)>(
                "SELECT application_type, status::text, version FROM applications WHERE id = $1 AND session_id = $2",
            )
            .bind(id)
            .bind(session_id)
            .fetch_optional(&state.pool)
            .await?
            .ok_or(ApiError::NotFound)?;
            if current.0 != application_type {
                Err(ApiError::Invalid(
                    "data.application_type cannot change after a draft is created".into(),
                ))
            } else {
                Err(ApiError::Conflict)
            }
        }
    }
}

pub async fn put_document(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Json(payload): Json<PutDocument>,
) -> Result<Json<DocumentStored>, ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    validate_document(&payload).map_err(ApiError::Invalid)?;

    if payload.expected_version < 1 {
        return Err(ApiError::Invalid(
            "expected_version must be positive".into(),
        ));
    }

    let mut transaction = state.pool.begin().await?;
    let application = sqlx::query_as::<_, (String, i32)>(
        "SELECT status::text, version FROM applications WHERE id = $1 AND session_id = $2 FOR UPDATE",
    )
    .bind(id)
    .bind(session_id)
    .fetch_optional(&mut *transaction)
    .await?
    .ok_or(ApiError::NotFound)?;
    if application.0 != "DRAFT" {
        return Err(ApiError::Invalid(
            "documents can be changed only while the application is a draft".into(),
        ));
    }
    if application.1 != payload.expected_version {
        return Err(ApiError::Conflict);
    }

    sqlx::query(
        "INSERT INTO document_metadata (id, application_id, kind, media_type, size_bytes, sha256_hex) \
         VALUES ($1, $2, $3, $4, $5, $6) \
         ON CONFLICT (application_id, kind) DO UPDATE SET media_type = EXCLUDED.media_type, size_bytes = EXCLUDED.size_bytes, sha256_hex = EXCLUDED.sha256_hex, created_at = now()",
    )
    .bind(Uuid::now_v7())
    .bind(id)
    .bind(&payload.kind)
    .bind(&payload.media_type)
    .bind(payload.size_bytes)
    .bind(&payload.sha256_hex)
    .execute(&mut *transaction)
    .await?;
    let version = sqlx::query_scalar::<_, i32>(
        "UPDATE applications SET version = version + 1, updated_at = now() WHERE id = $1 RETURNING version",
    )
    .bind(id)
    .fetch_one(&mut *transaction)
    .await?;
    sqlx::query("INSERT INTO audit_events (session_id, application_id, action) VALUES ($1, $2, 'document.updated')")
        .bind(session_id)
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;

    Ok(Json(DocumentStored { version }))
}

pub async fn submit_application(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Json(payload): Json<SubmitApplication>,
) -> Result<Json<SubmissionResult>, ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    let idempotency_key = headers
        .get("idempotency-key")
        .and_then(|value| value.to_str().ok())
        .filter(|value| {
            (8..=128).contains(&value.len())
                && value
                    .chars()
                    .all(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_' | '.'))
        })
        .ok_or(ApiError::IdempotencyKeyRequired)?;
    let route = format!("applications/{id}/submit");
    let lock_key = format!("{session_id}:{route}:{idempotency_key}");

    let mut transaction = state.pool.begin().await?;
    sqlx::query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))")
        .bind(&lock_key)
        .execute(&mut *transaction)
        .await?;

    if let Some((response_body,)) = sqlx::query_as::<_, (Value,)>(
        "SELECT response_body FROM idempotency_records WHERE session_id = $1 AND route = $2 AND idempotency_key = $3 AND expires_at > now()",
    )
    .bind(session_id)
    .bind(&route)
    .bind(idempotency_key)
    .fetch_optional(&mut *transaction)
    .await? {
        transaction.commit().await?;
        let response = serde_json::from_value(response_body).map_err(|_| ApiError::Internal)?;
        return Ok(Json(response));
    }

    let existing = sqlx::query_as::<_, (String, String, i32)>(
        "SELECT reference, status::text, version FROM applications WHERE id = $1 AND session_id = $2 FOR UPDATE",
    )
    .bind(id)
    .bind(session_id)
    .fetch_optional(&mut *transaction)
    .await?
    .ok_or(ApiError::NotFound)?;
    if existing.1 != "DRAFT" {
        return Err(ApiError::Invalid("only a draft can be submitted".into()));
    }
    if payload.expected_version < 1 || existing.2 != payload.expected_version {
        return Err(ApiError::Conflict);
    }

    let (version, submitted_at) = sqlx::query_as::<_, (i32, chrono::DateTime<Utc>)>(
        "UPDATE applications SET status = 'SUBMITTED', version = version + 1, submitted_at = now(), updated_at = now() \
         WHERE id = $1 RETURNING version, submitted_at",
    )
    .bind(id)
    .fetch_one(&mut *transaction)
    .await?;
    let result = SubmissionResult {
        id,
        reference: existing.0,
        status: "SUBMITTED".into(),
        version,
        submitted_at,
    };
    let result_json = serde_json::to_value(&result).map_err(|_| ApiError::Internal)?;

    sqlx::query("INSERT INTO application_status_history (application_id, status, detail) VALUES ($1, 'SUBMITTED', 'Synthetic application committed for showcase processing')")
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    sqlx::query("INSERT INTO outbox_events (id, aggregate_id, event_type, payload) VALUES ($1, $2, 'application.submitted', $3)")
        .bind(Uuid::now_v7())
        .bind(id)
        .bind(json!({"application_id": id, "reference": result.reference}))
        .execute(&mut *transaction)
        .await?;
    sqlx::query("INSERT INTO audit_events (session_id, application_id, action) VALUES ($1, $2, 'application.submitted')")
        .bind(session_id)
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    sqlx::query(
        "INSERT INTO idempotency_records (session_id, route, idempotency_key, response_status, response_body) VALUES ($1, $2, $3, 200, $4)",
    )
    .bind(session_id)
    .bind(&route)
    .bind(idempotency_key)
    .bind(result_json)
    .execute(&mut *transaction)
    .await?;
    transaction.commit().await?;
    state.metrics.submissions.inc();

    Ok(Json(result))
}

pub async fn create_showcase_completion(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<ShowcaseCompletion>,
) -> Result<Json<SubmissionResult>, ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    let idempotency_key = idempotency_key(&headers)?;
    validate_application(&payload.application_type, &payload.data).map_err(ApiError::Invalid)?;
    if payload.documents.len() > 32 {
        return Err(ApiError::Invalid(
            "at most 32 document metadata records are accepted".into(),
        ));
    }
    let mut document_kinds = HashSet::with_capacity(payload.documents.len());
    for document in &payload.documents {
        validate_document_input(document).map_err(ApiError::Invalid)?;
        if !document_kinds.insert(document.kind.as_str()) {
            return Err(ApiError::Invalid(
                "document kinds must be unique within a completion".into(),
            ));
        }
    }

    let route = "showcase-completions";
    let lock_key = format!("{session_id}:{route}:{idempotency_key}");
    let mut transaction = state.pool.begin().await?;
    sqlx::query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))")
        .bind(&lock_key)
        .execute(&mut *transaction)
        .await?;
    if let Some((response_body,)) = sqlx::query_as::<_, (Value,)>(
        "SELECT response_body FROM idempotency_records WHERE session_id = $1 AND route = $2 AND idempotency_key = $3 AND expires_at > now()",
    )
    .bind(session_id)
    .bind(route)
    .bind(idempotency_key)
    .fetch_optional(&mut *transaction)
    .await?
    {
        transaction.commit().await?;
        return Ok(Json(serde_json::from_value(response_body).map_err(|_| ApiError::Internal)?));
    }
    enforce_application_quota(&mut transaction, session_id).await?;

    let id = Uuid::now_v7();
    let reference = format!(
        "VSL-DEMO-{}-{}",
        Utc::now().format("%Y%m%d"),
        &Uuid::new_v4().simple().to_string()[..12].to_ascii_uppercase()
    );
    let (version, submitted_at) = sqlx::query_as::<_, (i32, chrono::DateTime<Utc>)>(
        "INSERT INTO applications (id, session_id, reference, application_type, status, version, data, submitted_at) \
         VALUES ($1, $2, $3, $4, 'SUBMITTED', 2, $5, now()) RETURNING version, submitted_at",
    )
    .bind(id)
    .bind(session_id)
    .bind(&reference)
    .bind(&payload.application_type)
    .bind(&payload.data)
    .fetch_one(&mut *transaction)
    .await?;
    for document in &payload.documents {
        sqlx::query(
            "INSERT INTO document_metadata (id, application_id, kind, media_type, size_bytes, sha256_hex) VALUES ($1, $2, $3, $4, $5, $6)",
        )
        .bind(Uuid::now_v7())
        .bind(id)
        .bind(&document.kind)
        .bind(&document.media_type)
        .bind(document.size_bytes)
        .bind(&document.sha256_hex)
        .execute(&mut *transaction)
        .await?;
    }
    for (status, detail) in [
        ("DRAFT", "Synthetic draft created atomically"),
        (
            "SUBMITTED",
            "Synthetic application committed for showcase processing",
        ),
    ] {
        sqlx::query("INSERT INTO application_status_history (application_id, status, detail) VALUES ($1, $2::application_status, $3)")
            .bind(id)
            .bind(status)
            .bind(detail)
            .execute(&mut *transaction)
            .await?;
    }
    let result = SubmissionResult {
        id,
        reference,
        status: "SUBMITTED".into(),
        version,
        submitted_at,
    };
    let result_json = serde_json::to_value(&result).map_err(|_| ApiError::Internal)?;
    sqlx::query("INSERT INTO outbox_events (id, aggregate_id, event_type, payload) VALUES ($1, $2, 'application.submitted', $3)")
        .bind(Uuid::now_v7()).bind(id).bind(json!({"application_id": id, "reference": result.reference})).execute(&mut *transaction).await?;
    sqlx::query("INSERT INTO audit_events (session_id, application_id, action) VALUES ($1, $2, 'showcase.completed')")
        .bind(session_id).bind(id).execute(&mut *transaction).await?;
    sqlx::query("INSERT INTO idempotency_records (session_id, route, idempotency_key, response_status, response_body) VALUES ($1, $2, $3, 200, $4)")
        .bind(session_id).bind(route).bind(idempotency_key).bind(result_json).execute(&mut *transaction).await?;
    transaction.commit().await?;
    state.metrics.submissions.inc();
    Ok(Json(result))
}

pub async fn application_status(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> Result<Json<StatusView>, ApiError> {
    let session_id = authenticate(&state, &headers).await?;
    if !state.rate_limit_allows(
        format!("status:session:{session_id}"),
        state.config.status_rate_limit_per_second,
    ) {
        state.metrics.rate_limit_rejections.inc();
        return Err(ApiError::RateLimited);
    }
    let application = sqlx::query_as::<_, (String, String, chrono::DateTime<Utc>)>(
        "SELECT reference, status::text, updated_at FROM applications WHERE id = $1 AND session_id = $2",
    )
    .bind(id)
    .bind(session_id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ApiError::NotFound)?;
    let events = sqlx::query_as::<_, StatusEvent>(
        "SELECT status::text AS status, detail, created_at FROM application_status_history WHERE application_id = $1 ORDER BY created_at, id",
    )
    .bind(id)
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(StatusView {
        id,
        reference: application.0,
        status: application.1,
        updated_at: application.2,
        events,
    }))
}

async fn fetch_application(
    state: &AppState,
    session_id: Uuid,
    id: Uuid,
) -> Result<Option<ApplicationRow>, ApiError> {
    Ok(sqlx::query_as::<_, ApplicationRow>(
        "SELECT id, reference, application_type, status::text AS status, version, data, created_at, updated_at, submitted_at \
         FROM applications WHERE id = $1 AND session_id = $2",
    )
    .bind(id)
    .bind(session_id)
    .fetch_optional(&state.pool)
    .await?)
}

async fn authenticate(state: &AppState, headers: &HeaderMap) -> Result<Uuid, ApiError> {
    state
        .authenticate(
            headers
                .get(header::AUTHORIZATION)
                .and_then(|value| value.to_str().ok()),
        )
        .await
}

fn idempotency_key(headers: &HeaderMap) -> Result<&str, ApiError> {
    headers
        .get("idempotency-key")
        .and_then(|value| value.to_str().ok())
        .filter(|value| {
            (8..=128).contains(&value.len())
                && value
                    .chars()
                    .all(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_' | '.'))
        })
        .ok_or(ApiError::IdempotencyKeyRequired)
}

async fn enforce_application_quota(
    transaction: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    session_id: Uuid,
) -> Result<(), ApiError> {
    sqlx::query("SELECT pg_advisory_xact_lock(hashtextextended($1, 1))")
        .bind(session_id.to_string())
        .execute(&mut **transaction)
        .await?;
    let count =
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM applications WHERE session_id = $1")
            .bind(session_id)
            .fetch_one(&mut **transaction)
            .await?;
    if count >= 100 {
        return Err(ApiError::QuotaExceeded);
    }
    Ok(())
}
