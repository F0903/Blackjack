use super::error::Result;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};

pub struct SqliteDb {
    pool: SqlitePool,
}

impl SqliteDb {
    pub async fn new(database_file: &str) -> Result<Self> {
        let pool = SqlitePool::connect_with(
            SqliteConnectOptions::new()
                .filename(database_file)
                .create_if_missing(true),
        )
        .await?;
        sqlx::migrate!("./migrations").run(&pool).await?;
        Ok(Self { pool })
    }

    pub const fn get_pool(&self) -> &SqlitePool {
        &self.pool
    }
}
