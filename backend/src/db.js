const mysql = require('mysql2/promise');

require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'collaborator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Returns true when the database answers, false otherwise.
// Never throws: callers decide how to report a down database.
async function isDbUp() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { pool, isDbUp };
