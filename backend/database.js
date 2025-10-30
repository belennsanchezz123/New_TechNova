import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'lynx-study.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

const initDB = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            service TEXT NOT NULL,
            password_strength TEXT,
            mfa_enabled INTEGER DEFAULT 0,
            participant_id TEXT,
            password_reuse_count INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_username_service ON registrations(username, service);
        CREATE INDEX IF NOT EXISTS idx_participant ON registrations(participant_id);

        CREATE TABLE IF NOT EXISTS breach_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            participant_id TEXT,
            breach_count INTEGER DEFAULT 0,
            paste_count INTEGER DEFAULT 0,
            breaches_data TEXT,
            checked_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_breach_email ON breach_checks(email);
        CREATE INDEX IF NOT EXISTS idx_breach_participant ON breach_checks(participant_id);
    `);
};

initDB();

export default db;
