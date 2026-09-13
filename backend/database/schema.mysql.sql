-- Yenko Mobility schema (MySQL 8 / MariaDB 10.5+). Keep in sync with schema.sqlite.sql.
-- All timestamps are UTC.

CREATE TABLE IF NOT EXISTS admin_users (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email         VARCHAR(191) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(80)  NOT NULL,
    slug        VARCHAR(100) NOT NULL,
    description VARCHAR(500) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name),
    UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title        VARCHAR(200) NOT NULL,
    slug         VARCHAR(191) NOT NULL,
    excerpt      VARCHAR(500) NOT NULL DEFAULT '',
    body         MEDIUMTEXT   NOT NULL,
    cover_image  VARCHAR(500) NULL,
    status       ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    published_at DATETIME     NULL,
    category_id  INT UNSIGNED NOT NULL,
    created_at   DATETIME     NOT NULL,
    updated_at   DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_posts_slug (slug),
    KEY idx_posts_status_published (status, published_at),
    KEY idx_posts_category (category_id),
    CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name       VARCHAR(120) NOT NULL,
    email      VARCHAR(191) NOT NULL,
    topic      VARCHAR(30)  NOT NULL DEFAULT 'general',
    campus     VARCHAR(120) NULL,
    message    TEXT         NOT NULL,
    created_at DATETIME     NOT NULL,
    PRIMARY KEY (id),
    KEY idx_contact_submissions_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_limit_hits (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    bucket     VARCHAR(40) NOT NULL,
    key_hash   CHAR(64)    NOT NULL,
    created_at DATETIME    NOT NULL,
    PRIMARY KEY (id),
    KEY idx_rate_limit_hits_lookup (bucket, key_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Editable site content stored as JSON documents (e.g. the pricing configuration).
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(64) NOT NULL,
    value       MEDIUMTEXT  NOT NULL,
    updated_at  DATETIME    NOT NULL,
    PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
