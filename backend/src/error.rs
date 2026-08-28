use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use tracing::error;

#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("authentication is required")]
    Unauthorized,
    #[error("the requested record was not found")]
    NotFound,
    #[error("{0}")]
    Invalid(String),
    #[error("the draft was changed by another request")]
    Conflict,
    #[error("Idempotency-Key is required for this operation")]
    IdempotencyKeyRequired,
    #[error("the service is at its safe concurrency limit")]
    Overloaded,
    #[error("the request rate is too high")]
    RateLimited,
    #[error("the demo session has reached its application limit")]
    QuotaExceeded,
    #[error("the database is temporarily unavailable")]
    Database(#[source] sqlx::Error),
    #[error("internal server error")]
    Internal,
}

#[derive(Serialize)]
struct ErrorEnvelope {
    error: ErrorBody,
}

#[derive(Serialize)]
struct ErrorBody {
    code: &'static str,
    message: String,
    retryable: bool,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, code, retryable) = match &self {
            Self::Unauthorized => (StatusCode::UNAUTHORIZED, "unauthorized", false),
            Self::NotFound => (StatusCode::NOT_FOUND, "not_found", false),
            Self::Invalid(_) => (StatusCode::UNPROCESSABLE_ENTITY, "invalid_request", false),
            Self::Conflict => (StatusCode::CONFLICT, "version_conflict", true),
            Self::IdempotencyKeyRequired => {
                (StatusCode::BAD_REQUEST, "idempotency_key_required", false)
            }
            Self::Overloaded => (StatusCode::SERVICE_UNAVAILABLE, "overloaded", true),
            Self::RateLimited => (StatusCode::TOO_MANY_REQUESTS, "rate_limited", true),
            Self::QuotaExceeded => (StatusCode::TOO_MANY_REQUESTS, "quota_exceeded", false),
            Self::Database(_) => (
                StatusCode::SERVICE_UNAVAILABLE,
                "database_unavailable",
                true,
            ),
            Self::Internal => (StatusCode::INTERNAL_SERVER_ERROR, "internal_error", false),
        };

        if let Self::Database(source) = &self {
            error!(error = %source, "database operation failed");
        }

        let mut response = (
            status,
            Json(ErrorEnvelope {
                error: ErrorBody {
                    code,
                    message: self.to_string(),
                    retryable,
                },
            }),
        )
            .into_response();
        if retryable {
            response
                .headers_mut()
                .insert("retry-after", "1".parse().unwrap());
        }
        if status == StatusCode::UNAUTHORIZED {
            response.headers_mut().insert(
                "www-authenticate",
                "Bearer realm=\"visa-showcase\"".parse().unwrap(),
            );
        }
        response
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(value: sqlx::Error) -> Self {
        Self::Database(value)
    }
}
