use std::{
    sync::Arc,
    time::{Duration, Instant},
};

use chrono::{DateTime, Utc};
use dashmap::DashMap;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use tokio::sync::Semaphore;
use uuid::Uuid;

use crate::{config::Config, error::ApiError, metrics::Metrics};

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub config: Config,
    pub metrics: Metrics,
    pub capacity: Arc<Semaphore>,
    limiter: Arc<RateLimiter>,
    sessions: Arc<DashMap<String, CachedSession>>,
}

#[derive(Clone)]
struct CachedSession {
    id: Uuid,
    expires_at: DateTime<Utc>,
}

struct RateWindow {
    started: Instant,
    count: u32,
}

struct RateLimiter {
    windows: DashMap<String, RateWindow>,
}

impl AppState {
    pub fn new(pool: PgPool, config: Config, metrics: Metrics) -> Self {
        Self {
            capacity: Arc::new(Semaphore::new(config.max_in_flight_requests)),
            pool,
            config,
            metrics,
            limiter: Arc::new(RateLimiter {
                windows: DashMap::new(),
            }),
            sessions: Arc::new(DashMap::new()),
        }
    }

    pub fn rate_limit_allows(&self, key: String, limit: u32) -> bool {
        if limit == 0 {
            return true;
        }

        let now = Instant::now();
        if self.limiter.windows.len() >= 90_000 {
            self.limiter
                .windows
                .retain(|_, value| now.duration_since(value.started) < Duration::from_secs(60));
            if self.limiter.windows.len() >= 100_000 && !self.limiter.windows.contains_key(&key) {
                return false;
            }
        }
        let mut entry = self.limiter.windows.entry(key).or_insert(RateWindow {
            started: now,
            count: 0,
        });
        if now.duration_since(entry.started) >= Duration::from_secs(1) {
            entry.started = now;
            entry.count = 0;
        }
        if entry.count >= limit {
            return false;
        }
        entry.count += 1;
        true
    }

    pub fn cache_session(&self, token_hash: String, id: Uuid, expires_at: DateTime<Utc>) {
        if self.sessions.len() >= 100_000 {
            let now = Utc::now();
            self.sessions.retain(|_, value| value.expires_at > now);
            if self.sessions.len() >= 100_000 {
                return;
            }
        }
        self.sessions
            .insert(token_hash, CachedSession { id, expires_at });
    }

    pub async fn authenticate(&self, authorization: Option<&str>) -> Result<Uuid, ApiError> {
        let token = authorization
            .and_then(|value| value.strip_prefix("Bearer "))
            .filter(|value| (32..=160).contains(&value.len()))
            .ok_or(ApiError::Unauthorized)?;
        let hash = token_hash(token);
        let cache_key = hex::encode(hash);
        if let Some(cached) = self.sessions.get(&cache_key) {
            if cached.expires_at > Utc::now() {
                return Ok(cached.id);
            }
            drop(cached);
            self.sessions.remove(&cache_key);
        }

        let record = sqlx::query_as::<_, (Uuid, DateTime<Utc>)>(
            "SELECT id, expires_at FROM demo_sessions WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()",
        )
        .bind(hash.as_slice())
        .fetch_optional(&self.pool)
        .await?;

        let (id, expires_at) = record.ok_or(ApiError::Unauthorized)?;
        self.cache_session(cache_key, id, expires_at);
        Ok(id)
    }
}

pub fn token_hash(token: &str) -> [u8; 32] {
    Sha256::digest(token.as_bytes()).into()
}

pub fn rate_limit_key(authorization: Option<&str>, peer: &str) -> String {
    match authorization.and_then(|value| value.strip_prefix("Bearer ")) {
        Some(token) => format!("token:{}", hex::encode(token_hash(token))),
        None => format!("peer:{peer}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hashes_are_stable_and_do_not_reveal_tokens() {
        let first = token_hash("demo-secret-token-value-that-is-long-enough");
        let second = token_hash("demo-secret-token-value-that-is-long-enough");
        assert_eq!(first, second);
        assert_ne!(
            hex::encode(first),
            "demo-secret-token-value-that-is-long-enough"
        );
    }

    #[test]
    fn authenticated_rate_limit_keys_do_not_include_bearer_tokens() {
        let token = "demo-secret-token-value-that-is-long-enough";
        let key = rate_limit_key(Some(&format!("Bearer {token}")), "127.0.0.1");
        assert!(!key.contains(token));
        assert!(key.starts_with("token:"));
    }
}
