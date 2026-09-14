-- SeedBay database schema — MySQL 8 / MariaDB on Krystal (cPanel > MySQL Databases).
--
-- Run this once against a fresh database. Everything the site stores lives here;
-- there is no other backend.

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP    NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One-time magic-link tokens. Only the hash is stored, so a database leak does
-- not hand anyone a working login link.
CREATE TABLE IF NOT EXISTS login_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL,
  token_hash CHAR(64)     NOT NULL UNIQUE,
  expires_at DATETIME     NOT NULL,
  used_at    DATETIME     NULL DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_login_tokens_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions are server-side; the cookie carries only a random id.
CREATE TABLE IF NOT EXISTS sessions (
  id         CHAR(64)  PRIMARY KEY,
  user_id    INT       NOT NULL,
  expires_at DATETIME  NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seeds (
  id             CHAR(36)     PRIMARY KEY,
  user_id        INT          NULL,
  title          VARCHAR(200) NOT NULL,
  variety        VARCHAR(200) NULL,
  category       VARCHAR(40)  NOT NULL DEFAULT 'Other',
  quantity       VARCHAR(100) NULL,
  description    TEXT         NOT NULL,
  is_free        TINYINT(1)   NOT NULL DEFAULT 1,
  price          VARCHAR(40)  NULL,
  contact_method VARCHAR(20)  NOT NULL DEFAULT 'Email',
  contact_value  VARCHAR(255) NOT NULL,
  location       VARCHAR(120) NULL,
  image          VARCHAR(120) NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at     DATETIME     NULL DEFAULT NULL,
  active         TINYINT(1)   NOT NULL DEFAULT 1,
  INDEX idx_seeds_created  (created_at DESC),
  INDEX idx_seeds_category (category),
  INDEX idx_seeds_active   (active, expires_at),
  INDEX idx_seeds_user     (user_id),
  CONSTRAINT fk_seeds_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS suggestions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NULL,
  feedback_type VARCHAR(40)  NOT NULL,
  message       TEXT         NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
