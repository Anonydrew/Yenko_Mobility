-- Yenko Mobility schema (SQLite). Keep in sync with schema.mysql.sql.
-- All timestamps are UTC, stored as 'YYYY-MM-DD HH:MM:SS'.

CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE COLLATE NOCASE,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    excerpt      TEXT NOT NULL DEFAULT '',
    body         TEXT NOT NULL DEFAULT '',
    cover_image  TEXT NULL,
    status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TEXT NULL,
    category_id  INTEGER NOT NULL REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category_id);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    topic      TEXT NOT NULL DEFAULT 'general',
    campus     TEXT NULL,
    message    TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions (created_at);

CREATE TABLE IF NOT EXISTS rate_limit_hits (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    bucket     TEXT NOT NULL,
    key_hash   TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_lookup ON rate_limit_hits (bucket, key_hash, created_at);

-- Editable site content stored as JSON documents (e.g. the pricing configuration).
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
