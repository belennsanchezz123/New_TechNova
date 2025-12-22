import db from './database.js';

console.log('\n=== REGISTRATIONS TABLE ===\n');
const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
console.table(registrations);

console.log('\n=== BREACH CHECKS TABLE ===\n');
const breaches = db.prepare('SELECT * FROM breach_checks ORDER BY checked_at DESC').all();
console.table(breaches);

console.log('\n=== SESSION METRICS ===\n');
const metrics = db.prepare('SELECT * FROM session_metrics ORDER BY recorded_at DESC').all();
console.table(metrics);

console.log('\n=== STATISTICS ===');
const stats = db.prepare(`
    SELECT
        COUNT(*) as total_registrations,
        COUNT(DISTINCT participant_id) as unique_participants,
        COUNT(DISTINCT username) as unique_usernames
    FROM registrations
`).get();
console.table(stats);

db.close();
