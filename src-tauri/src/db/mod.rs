mod error;
mod my_sql_db;

pub mod tables;

pub use error::DbError;
pub use my_sql_db::MySqlDb;
