// migrate-wide-metrics.js
// Crea la tabla participant_metrics si no existe (ya está en database.js,
// pero este script permite ejecutar la migración de forma explícita
// sobre una base de datos existente sin perder datos).

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

console.log('🔧 Aplicando migración: tabla participant_metrics...\n');

try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS participant_metrics (
            participant_id TEXT PRIMARY KEY,

            s1_wifi_public                 INTEGER,
            s1_mail_password_strength       TEXT,
            s1_drive_password_strength      TEXT,
            s1_events_password_strength     TEXT,
            s1_password_reused              INTEGER,
            s1_mfa_enabled                  INTEGER,
            s1_mfa_method_primary           TEXT,
            s1_mfa_method_backup            TEXT,
            s1_mfa_email_alt                INTEGER,
            s1_teams_camera_allowed         INTEGER,
            s1_teams_microphone_allowed     INTEGER,

            s2_manual_lock_screen           INTEGER,

            s3_phishing_clicked             INTEGER,
            s3_phishing_reported            INTEGER,
            s3_credential_compromised       INTEGER,
            s3_secure_data_transmission     TEXT,

            s4_browser_warning_response     TEXT,
            s4_cookie_consent               TEXT,
            s4_clicked_dangerous_link       INTEGER,

            s5_personal_data_fields_shared  INTEGER,
            s5_third_party_app_authorized   INTEGER,

            s6_shared_birth_date            INTEGER,
            s6_shared_phone                 INTEGER,
            s6_shared_social_media          INTEGER,
            s6_shared_city                  INTEGER,

            s7_used_encryption              INTEGER,
            s7_secure_disposal_used         INTEGER,
            s7_deleted_final_report         INTEGER,

            s8_consented_email_check        INTEGER,
            s8_breach_count                 INTEGER,

            ue_accepted_fake_update         INTEGER,
            ue_teams_password_reused        INTEGER,

            session_started_at              TEXT,
            session_completed_at            TEXT,
            recorded_at                     TEXT DEFAULT (datetime('now'))
        );
    `);
    console.log('✅ Tabla participant_metrics creada (o ya existía).');

    // Verificar estructura
    const info = db.prepare("PRAGMA table_info(participant_metrics)").all();
    console.log(`   Columnas: ${info.length}`);
    info.forEach(col => {
        console.log(`   - ${col.name.padEnd(40)} ${col.type}`);
    });

    console.log('\n✅ Migración completada con éxito.');
} catch (error) {
    console.error('❌ Error en la migración:', error.message);
} finally {
    db.close();
}
