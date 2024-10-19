use crate::backend_error::Result;

#[tauri::command]
pub async fn show_window(window: tauri::Window) -> Result<()> {
    window.show()?;
    Ok(())
}
