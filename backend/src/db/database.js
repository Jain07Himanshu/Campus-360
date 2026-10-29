const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'campus360.db');
const SCHEMA_PATH = path.join(__dirname, '../../..', 'database', 'schema.sql');
const SEED_PATH = path.join(__dirname, '../../..', 'database', 'seed.sql');

// Initialize persistent SQLite Database
const db = new DatabaseSync(DB_PATH);

function initDatabase() {
  try {
    // Check if tables already exist
    const checkTable = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='users'").get();
    
    if (!checkTable || checkTable.count === 0) {
      console.log('⚡ Initializing database schema from schema.sql...');
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
      db.exec(schemaSql);

      console.log('🌱 Seeding initial records from seed.sql...');
      const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
      db.exec(seedSql);

      console.log('✅ SQLite Database successfully initialized and seeded at:', DB_PATH);
    } else {
      console.log('📁 SQLite Database already exists at:', DB_PATH);
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// SQL helper methods
const query = {
  all: (sql, params = []) => {
    const stmt = db.prepare(sql);
    const rows = Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
    return rows.map(r => ({ ...r }));
  },
  get: (sql, params = []) => {
    const stmt = db.prepare(sql);
    const row = Array.isArray(params) ? stmt.get(...params) : stmt.get(params);
    return row ? { ...row } : null;
  },
  run: (sql, params = []) => {
    const stmt = db.prepare(sql);
    return Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
  },
  exec: (sql) => db.exec(sql),
  db
};

module.exports = { db, initDatabase, query };
