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
            s1_default_password_flag        INTEGER,
            s1_drive_password_strength      TEXT,
            s1_events_password_strength     TEXT,
            s1_password_reused              REAL,
            s1_mfa_enabled                  INTEGER,
            s1_mfa_method_primary           TEXT,
            s1_mfa_method_backup            TEXT,
            s1_mfa_email_alt                INTEGER,
            s1_teams_camera_allowed         INTEGER,
            s1_teams_microphone_allowed     INTEGER,
            s1_time_seconds                 INTEGER,

            s2_manual_lock_screen           INTEGER,
            s2_time_seconds                 INTEGER,

            s3_phishing_clicked             REAL,
            s3_phishing_reported            REAL,
            s3_phishing_false_positives     INTEGER,
            s3_phishing_report_reasons      TEXT,
            s3_credential_compromised       INTEGER,
            s3_secure_data_transmission     TEXT,
            s3_time_seconds                 INTEGER,

            s4_browser_warning_response     TEXT,
            s4_cookie_consent               TEXT,
            s4_clicked_dangerous_link       INTEGER,
            s4_extensions_disabled_pct      REAL,
            s4_warnings_heeded_pct          REAL,
            s4_cookie_accepted_pct          REAL,
            s4_cookie_consent_by_site       TEXT,
            s4_cookie_risk_score            REAL,
            s4_dangerous_links_clicked_pct  REAL,
            s4_time_seconds                 INTEGER,

            s5_personal_data_fields_shared  INTEGER,
            s5_third_party_app_authorized   INTEGER,
            s5_time_seconds                 INTEGER,

            s6_shared_birth_date            INTEGER,
            s6_shared_phone                 INTEGER,
            s6_shared_social_media          INTEGER,
            s6_shared_city                  INTEGER,
            s6_time_seconds                 INTEGER,

            s7_used_encryption              INTEGER,
            s7_secure_disposal_used         INTEGER,
            s7_deleted_final_report         INTEGER,
            s7_time_seconds                 INTEGER,

            s8_consented_email_check        INTEGER,
            s8_breach_count                 INTEGER,
            s8_time_seconds                 INTEGER,

            s9_time_seconds                 INTEGER,
            s10_time_seconds                INTEGER,

            ue_accepted_fake_update         INTEGER,
            ue_teams_password_reused        INTEGER,

            session_total_time_seconds      INTEGER,
            session_started_at              TEXT,
            session_completed_at            TEXT,
            recorded_at                     TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS ai_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            participant_id TEXT,
            user_prompt TEXT,
            ai_response TEXT,
            trap_value TEXT,
            trap_label TEXT,
            user_final_text TEXT,
            trap_repeated INTEGER,
            created_at TEXT DEFAULT (datetime('now')),
            finalized_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_ai_interactions_session ON ai_interactions(session_id);
        CREATE INDEX IF NOT EXISTS idx_ai_interactions_participant ON ai_interactions(participant_id);
    `);
    console.log('✅ Tabla participant_metrics creada (o ya existía).');

    // Añadir columnas nuevas si la tabla ya existía (ALTER TABLE no soporta IF NOT EXISTS)
    const newColumns = [
        { name: 's4_extensions_disabled_pct', type: 'REAL' },
        { name: 's4_warnings_heeded_pct', type: 'REAL' },
        { name: 's4_cookie_accepted_pct', type: 'REAL' },
        { name: 's4_cookie_consent_by_site', type: 'TEXT' },
        { name: 's4_cookie_risk_score', type: 'REAL' },
        { name: 's4_dangerous_links_clicked_pct', type: 'REAL' },
        { name: 's3_phishing_false_positives', type: 'INTEGER' },
        { name: 's3_phishing_report_reasons', type: 'TEXT' },
        { name: 's1_default_password_flag', type: 'INTEGER' },
        { name: 's1_time_seconds', type: 'INTEGER' },
        { name: 's2_time_seconds', type: 'INTEGER' },
        { name: 's3_time_seconds', type: 'INTEGER' },
        { name: 's4_time_seconds', type: 'INTEGER' },
        { name: 's5_time_seconds', type: 'INTEGER' },
        { name: 's6_time_seconds', type: 'INTEGER' },
        { name: 's7_time_seconds', type: 'INTEGER' },
        { name: 's8_time_seconds', type: 'INTEGER' },
        { name: 's9_time_seconds', type: 'INTEGER' },
        { name: 's10_time_seconds', type: 'INTEGER' },
        { name: 'session_total_time_seconds', type: 'INTEGER' },
    ];

    for (const col of newColumns) {
        try {
            db.exec(`ALTER TABLE participant_metrics ADD COLUMN ${col.name} ${col.type}`);
            console.log(`   ✅ Columna añadida: ${col.name}`);
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log(`   ℹ️  Columna ya existe: ${col.name}`);
            } else {
                throw e;
            }
        }
    }

    // Verificar estructura
    const info = db.prepare("PRAGMA table_info(participant_metrics)").all();
    console.log(`\n   Columnas totales: ${info.length}`);
    info.forEach(col => {
        console.log(`   - ${col.name.padEnd(40)} ${col.type}`);
    });

    console.log('\n✅ Migración completada con éxito.');
} catch (error) {
    console.error('❌ Error en la migración:', error.message);
} finally {
    db.close();
}
