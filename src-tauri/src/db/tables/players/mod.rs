pub mod commands;

use crate::db::{error::Result, MySqlDb};

pub struct PlayersTable<'a> {
    db: &'a MySqlDb,
}

impl<'a> PlayersTable<'a> {
    pub async fn on(db: &'a MySqlDb) -> Result<Self> {
        let me = Self { db };
        Ok(me)
    }

    pub async fn update_balance(&self, player_id: u32, new_bal: i32) -> Result<()> {
        sqlx::query!(
            "UPDATE players SET balance = ? WHERE id = ?",
            new_bal,
            player_id
        )
        .execute(self.db.get_pool())
        .await?;
        Ok(())
    }

    pub async fn get_balance(&self, player_id: u32) -> Result<i32> {
        let bal = sqlx::query!("SELECT balance FROM players WHERE id = ?", player_id)
            .fetch_one(self.db.get_pool())
            .await?
            .balance;
        return Ok(bal);
    }
}
