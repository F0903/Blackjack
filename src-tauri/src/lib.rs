mod backend_error;
mod db;
mod models;
mod utils;

pub use backend_error::Result;

use db::{DbError, MySqlDb};
use tauri::Manager;
use utils::AsyncLazyCell;

struct AppState {
    db: AsyncLazyCell<MySqlDb, DbError>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(AppState {
                db: AsyncLazyCell::new(|| Box::pin(MySqlDb::new(env!("DATABASE_URL")))),
            });
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            db::tables::players::commands::player_update_balance
        ])
        .run(tauri::generate_context!())
        .expect("error while running application");
}
