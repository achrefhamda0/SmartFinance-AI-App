-- SmartFinance AI — schéma initial
-- MySQL 8.0+ / MariaDB 10.6+
--
--   mysql -u root -p < db/schema.sql

CREATE DATABASE IF NOT EXISTS smartfinance
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smartfinance;

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(80)  NOT NULL,
  last_name     VARCHAR(80)  NOT NULL,
  company       VARCHAR(160) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  role          ENUM('company', 'cabinet', 'finance') NOT NULL DEFAULT 'company',
  password_hash VARCHAR(255) NOT NULL,
  plan          VARCHAR(40)  NOT NULL DEFAULT 'essai',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS organizations (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  name       VARCHAR(160) NOT NULL,
  siren      VARCHAR(20)  NULL,
  country    CHAR(2)      NOT NULL DEFAULT 'FR',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_organizations_user (user_id),
  CONSTRAINT fk_organizations_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS fiscal_years (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  label          VARCHAR(20) NOT NULL,
  starts_on      DATE NOT NULL,
  ends_on        DATE NOT NULL,
  currency       CHAR(3) NOT NULL DEFAULT 'EUR',
  status         ENUM('open', 'closed', 'locked') NOT NULL DEFAULT 'open',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_fiscal_year (organization_id, label),
  CONSTRAINT fk_fiscal_years_organization FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS imports (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fiscal_year_id  BIGINT UNSIGNED NOT NULL,
  filename        VARCHAR(255) NOT NULL,
  source          ENUM('fec', 'fecf', 'balance', 'journal', 'liasse', 'erp', 'api') NOT NULL,
  status          ENUM('pending', 'processing', 'done', 'failed') NOT NULL DEFAULT 'pending',
  entries_count   INT UNSIGNED NOT NULL DEFAULT 0,
  checksum        CHAR(64) NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_imports_year (fiscal_year_id),
  CONSTRAINT fk_imports_fiscal_year FOREIGN KEY (fiscal_year_id) REFERENCES fiscal_years (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS anomalies (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fiscal_year_id BIGINT UNSIGNED NOT NULL,
  import_id     BIGINT UNSIGNED NULL,
  severity      ENUM('high', 'medium', 'low') NOT NULL,
  label         VARCHAR(190) NOT NULL,
  detail        TEXT NULL,
  confidence    DECIMAL(4, 3) NOT NULL,
  status        ENUM('open', 'confirmed', 'dismissed') NOT NULL DEFAULT 'open',
  detected_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_anomalies_year_status (fiscal_year_id, status),
  CONSTRAINT fk_anomalies_fiscal_year FOREIGN KEY (fiscal_year_id) REFERENCES fiscal_years (id) ON DELETE CASCADE,
  CONSTRAINT fk_anomalies_import FOREIGN KEY (import_id) REFERENCES imports (id) ON DELETE SET NULL
) ENGINE = InnoDB;