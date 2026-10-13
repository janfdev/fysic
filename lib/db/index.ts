import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

const dbPath = path.join(process.cwd(), "aura.db");
const sqlite = new Database(dbPath, { timeout: 10000 });

// Enable WAL mode for fast concurrency
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("busy_timeout = 10000");

// Ensure tables exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS playlist_tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS play_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    thumbnail_url TEXT,
    played_at INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite, { schema });

// Seed initial default playlists if empty
const existingPlaylists = sqlite.prepare("SELECT COUNT(*) as count FROM playlists").get() as { count: number };
if (existingPlaylists.count === 0) {
  const now = Date.now();
  sqlite.exec(`
    INSERT INTO playlists (id, user_id, title, description, cover_url, created_at, updated_at)
    VALUES 
    ('p1', 'user-demo', 'Fokus Koding Santai', 'Playlist terkurasi tanpa batasan acak. Pemutaran sequential berurutan otomatis.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80', ${now}, ${now}),
    ('p2', 'user-demo', 'Indie Lofi Sore', 'Daftar putar melodi tenang dan synth untuk teman berkegiatan.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80', ${now}, ${now});

    INSERT INTO playlist_tracks (playlist_id, youtube_id, title, artist, album, thumbnail_url, duration_seconds, sort_order, created_at)
    VALUES
    ('p1', '612644', 'Lofi Study Flow', 'Chill Resonance', 'Midnight Sessions Vol. 1', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80', 45, 0, ${now}),
    ('p1', '612643', 'Subtle Beats & Rain', 'Quiet Moments', 'Atmosphere', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80', 38, 1, ${now}),
    ('p1', '612642', 'Warm Acoustic Horizon', 'Nusantara Indie', 'Senja di Cirebon', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&auto=format&fit=crop&q=80', 52, 2, ${now}),
    ('p1', '612641', 'Night Drive Synth', 'Retro Wave ID', 'Jalur Pantura Synth', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=120&auto=format&fit=crop&q=80', 40, 3, ${now}),

    ('p2', '612643', 'Subtle Beats & Rain', 'Quiet Moments', 'Atmosphere', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80', 38, 0, ${now}),
    ('p2', '612642', 'Warm Acoustic Horizon', 'Nusantara Indie', 'Senja di Cirebon', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&auto=format&fit=crop&q=80', 52, 1, ${now});
  `);
}
