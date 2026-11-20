-- Collaborator – Grow Together
-- PostgreSQL schema (Supabase)
-- Run in the Supabase dashboard: SQL Editor → paste this file → Run.
-- Then run db/seed.sql the same way.
-- No CREATE DATABASE / USE statements: Supabase already provides the
-- database, and the SQL Editor runs against it.

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('offer', 'need')),
  sector VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  provider_name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listings_type ON listings (type);
CREATE INDEX IF NOT EXISTS idx_listings_sector ON listings (sector);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings (location);
CREATE INDEX IF NOT EXISTS idx_listings_title ON listings (title);
CREATE INDEX IF NOT EXISTS idx_listings_description ON listings (description);
CREATE INDEX IF NOT EXISTS idx_listings_provider_name ON listings (provider_name);

CREATE TABLE IF NOT EXISTS connect_requests (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  requester_name VARCHAR(150) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connect_listing ON connect_requests (listing_id);
