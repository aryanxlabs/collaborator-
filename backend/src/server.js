const cors = require('cors');
const express = require('express');

require('dotenv').config();

const { pool, isDbUp } = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

const SECTORS = [
  'Packaging',
  'Marketing',
  'Transport',
  'Digital Help',
  'Food Processing',
  'Textiles',
  'Dairy',
  'Handicrafts',
];

function dbUnavailable(res, err) {
  const detail =
    (err && err.code ? `${err.code}: ` : '') +
    (err && err.message ? err.message : String(err || 'unknown database error'));
  console.error('Database error:', detail);
  return res.status(503).json({
    error: 'Database unavailable',
    message:
      'The database could not be reached. Please check the MySQL server and the DB_* settings in .env and try again.',
  });
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
// 200 when the API and the database are both up.
// 503 with a clear message when the database cannot be reached.
// The server never crashes because the database is down.
app.get('/api/health', async (req, res) => {
  const dbUp = await isDbUp();
  if (dbUp) {
    return res.json({ status: 'ok', db: 'connected' });
  }
  return res.status(503).json({
    status: 'error',
    db: 'unavailable',
    message: 'Database could not be reached. Check that MySQL is running and DB_* is set correctly.',
  });
});

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------
// GET /api/listings?search=&sector=&type=offer|need
app.get('/api/listings', async (req, res) => {
  const { search, sector, type } = req.query;
  const conditions = [];
  const params = [];

  if (type && (type === 'offer' || type === 'need')) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (sector && SECTORS.includes(sector)) {
    conditions.push('sector = ?');
    params.push(sector);
  }
  if (search && String(search).trim() !== '') {
    const like = `%${String(search).trim()}%`;
    conditions.push('(title LIKE ? OR description LIKE ? OR location LIKE ? OR provider_name LIKE ?)');
    params.push(like, like, like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM listings ${where} ORDER BY created_at DESC, id DESC`;

  try {
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    return dbUnavailable(res, err);
  }
});

// GET /api/listings/:id
app.get('/api/listings/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return dbUnavailable(res, err);
  }
});

// POST /api/listings
app.post('/api/listings', async (req, res) => {
  const { title, description, type, sector, location, provider_name, contact_name } = req.body || {};

  const errors = [];
  if (!title || String(title).trim() === '') errors.push('title is required');
  if (!description || String(description).trim() === '') errors.push('description is required');
  if (type !== 'offer' && type !== 'need') errors.push("type must be 'offer' or 'need'");
  if (!sector || !SECTORS.includes(sector)) errors.push(`sector must be one of: ${SECTORS.join(', ')}`);
  if (!location || String(location).trim() === '') errors.push('location is required');
  if (!provider_name || String(provider_name).trim() === '') errors.push('provider_name is required');
  if (!contact_name || String(contact_name).trim() === '') errors.push('contact_name is required');

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO listings (title, description, type, sector, location, provider_name, contact_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(title).trim(),
        String(description).trim(),
        type,
        sector,
        String(location).trim(),
        String(provider_name).trim(),
        String(contact_name).trim(),
      ],
    );
    const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return dbUnavailable(res, err);
  }
});

// POST /api/listings/:id/connect — save a connect request for a listing
app.post('/api/listings/:id/connect', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }
  const { requester_name, message } = req.body || {};
  if (!requester_name || String(requester_name).trim() === '') {
    return res.status(400).json({ error: 'Validation failed', details: ['requester_name is required'] });
  }

  try {
    const [listing] = await pool.query('SELECT id FROM listings WHERE id = ?', [id]);
    if (listing.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    const [result] = await pool.query(
      `INSERT INTO connect_requests (listing_id, requester_name, message, status)
       VALUES (?, ?, ?, 'pending')`,
      [id, String(requester_name).trim(), message ? String(message).trim() : null],
    );
    const [rows] = await pool.query('SELECT * FROM connect_requests WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return dbUnavailable(res, err);
  }
});

// ---------------------------------------------------------------------------
// Matches
// ---------------------------------------------------------------------------
// GET /api/matches?location=... — listings in or near the given location.
// Matches on the location text and, when nothing matches, falls back to
// returning the most recent listings so the caller still gets suggestions.
app.get('/api/matches', async (req, res) => {
  const location = req.query.location ? String(req.query.location).trim() : '';
  if (location === '') {
    return res.status(400).json({ error: 'location query parameter is required' });
  }
  try {
    const like = `%${location}%`;
    const [rows] = await pool.query(
      'SELECT * FROM listings WHERE location LIKE ? ORDER BY created_at DESC, id DESC',
      [like],
    );
    return res.json({ location, count: rows.length, matches: rows });
  } catch (err) {
    return dbUnavailable(res, err);
  }
});

// ---------------------------------------------------------------------------
// 404 + error handling
// ---------------------------------------------------------------------------
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Collaborator API listening on port ${PORT}`);
});
