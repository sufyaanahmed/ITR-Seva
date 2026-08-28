use std::{env, net::SocketAddr, time::Duration};

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub api_addr: SocketAddr,
    pub internal_addr: SocketAddr,
    pub database_max_connections: u32,
    pub database_min_connections: u32,
    pub database_acquire_timeout: Duration,
    pub request_timeout: Duration,
    pub max_in_flight_requests: usize,
    pub rate_limit_per_second: u32,
    pub session_rate_limit_per_second: u32,
    pub status_rate_limit_per_second: u32,
    pub session_ttl: Duration,
    pub allowed_origins: Vec<String>,
    pub run_migrations: bool,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        let database_url =
            env::var("DATABASE_URL").map_err(|_| "DATABASE_URL is required".to_owned())?;

        let database_max_connections = parse("DATABASE_MAX_CONNECTIONS", 32)?;
        let database_min_connections = parse("DATABASE_MIN_CONNECTIONS", 2)?;
        if database_min_connections > database_max_connections {
            return Err("DATABASE_MIN_CONNECTIONS cannot exceed DATABASE_MAX_CONNECTIONS".into());
        }

        Ok(Self {
            database_url,
            api_addr: parse("API_ADDR", "127.0.0.1:3000".parse().unwrap())?,
            internal_addr: parse("INTERNAL_ADDR", "127.0.0.1:9090".parse().unwrap())?,
            database_max_connections,
            database_min_connections,
            database_acquire_timeout: Duration::from_millis(parse(
                "DATABASE_ACQUIRE_TIMEOUT_MS",
                500,
            )?),
            request_timeout: Duration::from_millis(parse("REQUEST_TIMEOUT_MS", 3_000)?),
            max_in_flight_requests: parse("MAX_IN_FLIGHT_REQUESTS", 512)?,
            rate_limit_per_second: parse("RATE_LIMIT_PER_SECOND", 2_000)?,
            session_rate_limit_per_second: parse("SESSION_RATE_LIMIT_PER_SECOND", 100)?,
            status_rate_limit_per_second: parse("STATUS_RATE_LIMIT_PER_SECOND", 30)?,
            session_ttl: Duration::from_secs(parse::<u64>("SESSION_TTL_SECONDS", 7_200)?),
            allowed_origins: env::var("ALLOWED_ORIGINS")
                .unwrap_or_else(|_| "http://localhost:8080,http://127.0.0.1:8080".into())
                .split(',')
                .map(str::trim)
                .filter(|item| !item.is_empty())
                .map(ToOwned::to_owned)
                .collect(),
            run_migrations: parse_bool("RUN_MIGRATIONS", true)?,
        })
    }
}

fn parse<T>(name: &str, default: T) -> Result<T, String>
where
    T: std::str::FromStr,
    T::Err: std::fmt::Display,
{
    match env::var(name) {
        Ok(value) => value
            .parse()
            .map_err(|error| format!("invalid {name}: {error}")),
        Err(_) => Ok(default),
    }
}

fn parse_bool(name: &str, default: bool) -> Result<bool, String> {
    match env::var(name) {
        Ok(value) => match value.to_ascii_lowercase().as_str() {
            "true" | "1" | "yes" => Ok(true),
            "false" | "0" | "no" => Ok(false),
            _ => Err(format!("invalid {name}: expected true or false")),
        },
        Err(_) => Ok(default),
    }
}
