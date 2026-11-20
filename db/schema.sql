-- Collaborator – Grow Together
-- MySQL 8.0 schema
-- Run:  mysql -u <user> -p < db/schema.sql
-- Then:  mysql -u <user> -p collaborator < db/seed.sql

CREATE DATABASE IF NOT EXISTS collaborator
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE collaborator;

CREATE TABLE IF NOT EXISTS listings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('offer', 'need') NOT NULL,
  sector VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  provider_name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_listings_type (type),
  INDEX idx_listings_sector (sector),
  INDEX idx_listings_location (location),
  FULLTEXT INDEX idx_listings_search (title, description, provider_name)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS connect_requests (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id INT UNSIGNED NOT NULL,
  requester_name VARCHAR(150) NOT NULL,
  message TEXT NULL,
  status ENUM('pending', 'accepted', 'declined') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_connect_listing (listing_id),
  CONSTRAINT fk_connect_listing
    FOREIGN KEY (listing_id)
    REFERENCES listings (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
