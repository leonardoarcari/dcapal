use std::fmt::Debug;

use axum::response::IntoResponse;
use config::ConfigError;
use deadpool_redis::PoolError;
use hyper::StatusCode;
use redis::RedisError;
use tracing::error;

use crate::domain::entity::{AssetId, MarketId};

#[derive(thiserror::Error)]
pub enum DcaError {
    #[error("{0}")]
    Generic(String),
    #[error("Bad Request: {0}")]
    BadRequest(String),
    #[error("Price for market '{0}/{1}' not available")]
    PriceNotAvailable(AssetId, AssetId),
    #[error("Market '{0}' not found")]
    MarketNotFound(MarketId),
    #[error("Failed to store in Repository: {0}")]
    RepositoryStoreFailure(String),
    #[error("{0}")]
    StartupFailure(String, #[source] anyhow::Error),
    #[error("Failed to parse config")]
    Config(#[from] ConfigError),
    #[error("Invalid log file path: {0}")]
    InvalidLogPath(String),
    #[error("Invalid log file path: {0}")]
    InvalidLogPath2(String, #[source] std::io::Error),
    #[error("Failed to deserialized into {1}: {0}")]
    JsonDeserializationFailure(String, String, #[source] serde_json::Error),
    #[error("Failed to obtain Redis connection")]
    RedisPool(#[from] PoolError),
    #[error(transparent)]
    Redis(#[from] RedisError),
    #[error("Third-party API reqwest failed")]
    Reqwest(#[from] reqwest::Error),
}

impl Debug for DcaError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(format_args!("{}", self))?;

        for e in self.iter_sources() {
            f.write_fmt(format_args!(" -- Caused by: {}", e))?;
        }

        Ok(())
    }
}

impl DcaError {
    pub fn iter_sources(&self) -> ErrorIter {
        ErrorIter {
            current: (self as &dyn std::error::Error).source(),
        }
    }
}

pub type Result<T> = std::result::Result<T, DcaError>;

impl IntoResponse for DcaError {
    fn into_response(self) -> axum::response::Response {
        error!("{:?}", &self);
        match self {
            DcaError::BadRequest(_) => {
                (StatusCode::BAD_REQUEST, format!("{}", self)).into_response()
            }
            DcaError::PriceNotAvailable(_, _) => {
                (StatusCode::NOT_FOUND, format!("{}", self)).into_response()
            }
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response(),
        }
    }
}

#[derive(Copy, Clone, Debug)]
pub struct ErrorIter<'a> {
    current: Option<&'a (dyn std::error::Error + 'static)>,
}

impl<'a> Iterator for ErrorIter<'a> {
    type Item = &'a (dyn std::error::Error + 'static);

    fn next(&mut self) -> Option<Self::Item> {
        let current = self.current;
        self.current = self.current.and_then(std::error::Error::source);
        current
    }
}
