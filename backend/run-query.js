import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'lynx-study.db');
const db = new Database(dbPath);

console.log('🔧 Ejecutando query...\n');

try {
    // 👇 ESCRIBE TU QUERY AQUÍ
    const result = db.prepare(`
        UPDATE registrations
        SET mfa_enabled = 1
        WHERE participant_id = ?
    `).run('participant_123');

    console.log('✅ Query ejecutada exitosamente');
    console.log('Filas modificadas:', result.changes);

    // Ver los resultados (opcional)
    const rows = db.prepare('SELECT * FROM registrations WHERE participant_id = ?').all('participant_123');
    console.log('\nResultado:', rows);

} catch (error) {
    console.error('❌ Error:', error.message);
} finally {
    db.close();
}
