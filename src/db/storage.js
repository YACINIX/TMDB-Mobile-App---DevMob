import { getDb, initDb } from "./db";

export async function ensureDbReady() {
  await initDb();
}

// ---------- Favorites ----------
export async function addFavorite(item) {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO favorites (id, media_type, title, poster_path) VALUES (?, ?, ?, ?)",
    item.id,
    item.media_type,
    item.title,
    item.poster_path ?? null
  );
}

export async function removeFavorite(id, media_type) {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM favorites WHERE id = ? AND media_type = ?",
    id,
    media_type
  );
}

export async function listFavorites() {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM favorites ORDER BY created_at DESC");
}

export async function isFavorite(id, media_type) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    "SELECT 1 FROM favorites WHERE id = ? AND media_type = ? LIMIT 1",
    id,
    media_type
  );
  return rows.length > 0;
}

// ---------- Watchlist ----------
export async function addWatchlist(item) {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO watchlist (id, media_type, title, poster_path) VALUES (?, ?, ?, ?)",
    item.id,
    item.media_type,
    item.title,
    item.poster_path ?? null
  );
}

export async function removeWatchlist(id, media_type) {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM watchlist WHERE id = ? AND media_type = ?",
    id,
    media_type
  );
}

export async function listWatchlist() {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM watchlist ORDER BY created_at DESC");
}

export async function isWatchlist(id, media_type) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    "SELECT 1 FROM watchlist WHERE id = ? AND media_type = ? LIMIT 1",
    id,
    media_type
  );
  return rows.length > 0;
}
