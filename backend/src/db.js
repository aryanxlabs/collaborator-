const { Pool } = require('pg');

require('dotenv').config();

// Single connection string (Supabase Postgres, SSL required).
// Set it in .env (see backend/.env.example):
//   DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

// A dropped idle connection must not crash the process.
pool.on('error', (err) => {
  console.error('Idle database pool error:', err.message);
});

// Returns true when the database answers, false otherwise.
// Never throws: callers decide how to report a down database.
async function isDbUp() {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  } finally {
    if (client) client.release();
  }
}

module.exports = { pool, isDbUp };
