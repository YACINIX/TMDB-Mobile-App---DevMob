import * as SQLite from "expo-sqlite";

let db = null;

export async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("tmdb.db");
  return db;
}

export async function initDb() {
  const database = await getDb();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER NOT NULL,
      media_type TEXT NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (id, media_type)
    );

    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER NOT NULL,
      media_type TEXT NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (id, media_type)
    );
  `);
}
