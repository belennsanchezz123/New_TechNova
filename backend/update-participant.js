import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'lynx-study.db');
const db = new Database(dbPath);

const [,, username, participantId] = process.argv;

if (!username || !participantId) {
    console.error('Usage: node update-participant.js <username> <participantId>');
    process.exit(1);
}

try {
    const info = db.prepare('UPDATE registrations SET participant_id = ? WHERE username = ?').run(participantId, username);
    console.log(`Updated ${info.changes} row(s).`);
    const row = db.prepare('SELECT id, username, participant_id, created_at FROM registrations WHERE username = ?').get(username);
    console.table(row || {});
} catch (err) {
    console.error('Error updating participant_id:', err.message);
} finally {
    db.close();
}
