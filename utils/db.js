// utils/db.js
const path   = require('path');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

// Open (or create) the DB file
const dbPath = path.resolve(__dirname, '../orders.db');
const db     = new sqlite3.Database(dbPath, err => {
  if (err) console.error('❌ DB Connection Error:', err);
  else     console.log('✅ Connected to orders.db');
});

// Promisify the methods we need
const run = promisify(db.run.bind(db));    // for INSERT/UPDATE/DELETE
const get = promisify(db.get.bind(db));    // for fetching a single row
const all = promisify(db.all.bind(db));    // for fetching multiple rows

// Initialize the orders table
(async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id         TEXT    PRIMARY KEY,
      userId     TEXT    NOT NULL,
      item       TEXT    NOT NULL,
      quantity   INTEGER NOT NULL,
      status     TEXT    NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ orders table ready');
})();

module.exports = { run, get, all };
