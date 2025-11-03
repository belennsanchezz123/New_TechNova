import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'lynx-study.db');
const db = new Database(dbPath);

console.log('🔄 Migrando tablas para agregar UNIQUE constraint...\n');

try {
    db.exec('BEGIN TRANSACTION');

    // Migrar tabla registrations
    console.log('📋 Migrando tabla registrations...');
    db.exec(`
        -- Crear nueva tabla con constraint
        CREATE TABLE registrations_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            service TEXT NOT NULL,
            password_strength TEXT,
            mfa_enabled INTEGER DEFAULT 0,
            participant_id TEXT NOT NULL UNIQUE,
            password_reuse_count INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        );

        -- Copiar datos (elimina duplicados, mantiene el más reciente)
        INSERT INTO registrations_new
        SELECT * FROM registrations
        WHERE id IN (
            SELECT MAX(id)
            FROM registrations
            GROUP BY participant_id
        );

        -- Eliminar tabla antigua y renombrar
        DROP TABLE registrations;
        ALTER TABLE registrations_new RENAME TO registrations;

        -- Recrear índices
        CREATE INDEX idx_username_service ON registrations(username, service);
        CREATE INDEX idx_participant ON registrations(participant_id);
    `);

    // Migrar tabla breach_checks
    console.log('📋 Migrando tabla breach_checks...');
    db.exec(`
        -- Crear nueva tabla con constraint
        CREATE TABLE breach_checks_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            participant_id TEXT NOT NULL UNIQUE,
            breach_count INTEGER DEFAULT 0,
            paste_count INTEGER DEFAULT 0,
            breaches_data TEXT,
            checked_at TEXT DEFAULT (datetime('now'))
        );

        -- Copiar datos (elimina duplicados, mantiene el más reciente)
        INSERT INTO breach_checks_new
        SELECT * FROM breach_checks
        WHERE id IN (
            SELECT MAX(id)
            FROM breach_checks
            GROUP BY participant_id
        );

        -- Eliminar tabla antigua y renombrar
        DROP TABLE breach_checks;
        ALTER TABLE breach_checks_new RENAME TO breach_checks;

        -- Recrear índices
        CREATE INDEX idx_breach_email ON breach_checks(email);
        CREATE INDEX idx_breach_participant ON breach_checks(participant_id);
    `);

    db.exec('COMMIT');

    console.log('\n✅ Migración completada exitosamente!');
    console.log('\nAhora cada participant_id es ÚNICO en ambas tablas.');

} catch (error) {
    db.exec('ROLLBACK');
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
} finally {
    db.close();
}
