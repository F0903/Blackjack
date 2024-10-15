use sqlx::{migrate, mysql::MySqlPoolOptions, MySqlPool};

use super::error::Result;

pub struct MySqlDb {
    pool: MySqlPool,
}

impl MySqlDb {
    pub async fn new(url: &str) -> Result<Self> {
        let pool = MySqlPoolOptions::new()
            .max_connections(10)
            .min_connections(1)
            .connect(url)
            .await?;
        migrate!("./migrations").run(&pool).await?;
        Ok(Self { pool })
    }

    pub fn get_pool(&self) -> &MySqlPool {
        &self.pool
    }
}
