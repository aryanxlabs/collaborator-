-- Collaborator – Grow Together
-- Row Level Security for the anon (public) role.
-- Run ONCE, after db/schema.sql, in the Supabase dashboard SQL Editor.
--
-- The site has no sign-in: visitors read listings, post listings and
-- send connect requests as the anonymous role, so the policies below
-- allow exactly those three actions and nothing else. UPDATE and DELETE
-- are not allowed for anon on either table, and connect_requests rows
-- cannot be read by anon at all.
--
-- (Enabling RLS without these policies would block the site completely,
-- and leaving RLS off would leave the tables open to any write.)

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE connect_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can read listings (the public showcase).
DROP POLICY IF EXISTS "Public can read listings" ON listings;
CREATE POLICY "Public can read listings"
  ON listings FOR SELECT
  TO anon
  USING (true);

-- Anyone can post a listing.
DROP POLICY IF EXISTS "Public can post listings" ON listings;
CREATE POLICY "Public can post listings"
  ON listings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anyone can send a connect request for a listing.
DROP POLICY IF EXISTS "Public can send connect requests" ON connect_requests;
CREATE POLICY "Public can send connect requests"
  ON connect_requests FOR INSERT
  TO anon
  WITH CHECK (true);
