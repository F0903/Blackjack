pub mod commands;

use crate::db::{error::Result, sqlite_db::SqliteDb};

pub struct PlayersTable<'a> {
    db: &'a SqliteDb,
}

impl<'a> PlayersTable<'a> {
    pub async fn on(db: &'a SqliteDb) -> Result<Self> {
        Ok(Self { db })
    }

    pub async fn update_balance(&self, player_id: u32, new_bal: i32) -> Result<()> {
        let pool = self.db.get_pool();
        sqlx::query!(
            "UPDATE players SET balance = ? WHERE id = ?",
            new_bal,
            player_id
        )
        .execute(pool)
        .await?;
        Ok(())
    }

    pub async fn get_balance(&self, player_id: u32) -> Result<i64> {
        let bal = sqlx::query!("SELECT balance FROM players WHERE id = ?", player_id)
            .fetch_one(self.db.get_pool())
            .await?
            .balance;
        return Ok(bal);
    }
}
