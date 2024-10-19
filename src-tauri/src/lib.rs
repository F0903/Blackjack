mod app_commands;
mod backend_error;
mod db;
mod utils;

pub use backend_error::Result;

use db::{DbError, SqliteDb};
use tauri::Manager;
use utils::AsyncLazyCell;

struct AppState {
    db: AsyncLazyCell<SqliteDb, DbError>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(AppState {
                db: AsyncLazyCell::new(|| Box::pin(SqliteDb::new("blackjack.db"))),
            });
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            db::tables::players::commands::player_update_balance,
            db::tables::players::commands::player_get_balance,
            app_commands::show_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running application");
}
