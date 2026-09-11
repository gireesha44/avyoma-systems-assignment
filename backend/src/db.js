import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tasks.db');

const verboseSqlite = sqlite3.verbose();
export const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err.message);
  } else {
    console.log(` Connected to SQLite database at ${dbPath}`);
  }
});

// Initialize database schema
export const initDb = () => {
  return new Promise((resolve, reject) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        dueDate TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating tasks table:', err.message);
        reject(err);
      } else {
        console.log(' Tasks table ready');
        // Seed initial sample task if empty
        db.get('SELECT COUNT(*) as count FROM tasks', [], (countErr, row) => {
          if (!countErr && row && row.count === 0) {
            const seedQuery = `
              INSERT INTO tasks (title, description, status, priority, dueDate)
              VALUES 
                ('Complete Task Manager Project', 'Build REST API, React UI, SQLite integration, and write documentation.', 'pending', 'high', date('now', '+2 days')),
                ('Review Code & Write Tests', 'Ensure input validation, error handling, and clean project layout.', 'pending', 'medium', date('now', '+1 days')),
                ('Setup Environment', 'Install Node.js dependencies and configure development scripts.', 'completed', 'low', date('now'))
            `;
            db.run(seedQuery, () => console.log(' Sample tasks seeded'));
          }
          resolve();
        });
      }
    });
  });
};

// Helper promises for SQLite queries
export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};
