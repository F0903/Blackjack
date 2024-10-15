use crate::Result;

use super::PlayersTable;

#[tauri::command]
pub async fn player_update_balance(
    state: tauri::State<'_, crate::AppState>,
    player_id: u32,
    new_bal: i32,
) -> Result<()> {
    let players = PlayersTable::on(state.db.get().await?).await?;
    players.update_balance(player_id, new_bal).await?;
    Ok(())
}
