use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct CreateSession {
    pub client_label: Option<String>,
}

#[derive(Serialize)]
pub struct SessionCreated {
    pub token: String,
    pub expires_at: DateTime<Utc>,
}

#[derive(Deserialize)]
pub struct CreateApplication {
    pub application_type: String,
    pub data: Value,
}

#[derive(Deserialize)]
pub struct UpdateApplication {
    pub version: i32,
    pub data: Value,
}

#[derive(Deserialize)]
pub struct PutDocument {
    pub kind: String,
    pub media_type: String,
    pub size_bytes: i32,
    pub sha256_hex: String,
}

#[derive(Debug, FromRow)]
pub struct ApplicationRow {
    pub id: Uuid,
    pub reference: String,
    pub application_type: String,
    pub status: String,
    pub version: i32,
    pub data: Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub submitted_at: Option<DateTime<Utc>>,
}

#[derive(Serialize)]
pub struct ApplicationView {
    pub id: Uuid,
    pub reference: String,
    pub application_type: String,
    pub status: String,
    pub version: i32,
    pub data: Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub submitted_at: Option<DateTime<Utc>>,
}

impl From<ApplicationRow> for ApplicationView {
    fn from(row: ApplicationRow) -> Self {
        Self {
            id: row.id,
            reference: row.reference,
            application_type: row.application_type,
            status: row.status,
            version: row.version,
            data: row.data,
            created_at: row.created_at,
            updated_at: row.updated_at,
            submitted_at: row.submitted_at,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubmissionResult {
    pub id: Uuid,
    pub reference: String,
    pub status: String,
    pub version: i32,
    pub submitted_at: DateTime<Utc>,
}

#[derive(Serialize, FromRow)]
pub struct StatusEvent {
    pub status: String,
    pub detail: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize)]
pub struct StatusView {
    pub id: Uuid,
    pub reference: String,
    pub status: String,
    pub updated_at: DateTime<Utc>,
    pub events: Vec<StatusEvent>,
}

pub fn validate_application(application_type: &str, data: &Value) -> Result<(), String> {
    if !["evisa", "afghan", "voa", "regular"].contains(&application_type) {
        return Err("application_type must be evisa, afghan, voa, or regular".into());
    }
    let object = data
        .as_object()
        .ok_or_else(|| "data must be a JSON object".to_owned())?;
    if object.get("demo_only").and_then(Value::as_bool) != Some(true) {
        return Err("only synthetic records explicitly marked demo_only=true are accepted".into());
    }
    if object.get("application_type").and_then(Value::as_str) != Some(application_type) {
        return Err("data.application_type must match application_type".into());
    }
    if object.len() > 200 {
        return Err("data contains too many fields".into());
    }
    Ok(())
}

pub fn validate_document(document: &PutDocument) -> Result<(), String> {
    if document.kind.is_empty()
        || document.kind.len() > 64
        || !document
            .kind
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_'))
    {
        return Err("kind must contain 1-64 letters, numbers, hyphens, or underscores".into());
    }
    if !["application/pdf", "image/jpeg", "image/png"].contains(&document.media_type.as_str()) {
        return Err("media_type must be application/pdf, image/jpeg, or image/png".into());
    }
    if !(1..=10_485_760).contains(&document.size_bytes) {
        return Err("size_bytes must be between 1 and 10485760".into());
    }
    if document.sha256_hex.len() != 64
        || !document
            .sha256_hex
            .chars()
            .all(|c| c.is_ascii_hexdigit() && !c.is_ascii_uppercase())
    {
        return Err("sha256_hex must be 64 lowercase hexadecimal characters".into());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn rejects_non_synthetic_applications() {
        assert!(validate_application("evisa", &json!({"application_type": "evisa"})).is_err());
    }

    #[test]
    fn accepts_matching_synthetic_applications() {
        assert!(
            validate_application(
                "evisa",
                &json!({"application_type": "evisa", "demo_only": true})
            )
            .is_ok()
        );
    }

    #[test]
    fn validates_document_hash_and_type() {
        let document = PutDocument {
            kind: "passport_bio".into(),
            media_type: "application/pdf".into(),
            size_bytes: 1024,
            sha256_hex: "a".repeat(64),
        };
        assert!(validate_document(&document).is_ok());
    }
}
