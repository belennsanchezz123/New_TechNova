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
            participant_id TEXT NOT NULL UNIQUE,
            password_reuse_count INTEGER DEFAULT 0,
            totp_secret TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            completed_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_username_service ON registrations(username, service);
        CREATE INDEX IF NOT EXISTS idx_participant ON registrations(participant_id);

        CREATE TABLE IF NOT EXISTS breach_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            participant_id TEXT NOT NULL UNIQUE,
            breach_count INTEGER DEFAULT 0,
            paste_count INTEGER DEFAULT 0,
            breaches_data TEXT,
            checked_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_breach_email ON breach_checks(email);
        CREATE INDEX IF NOT EXISTS idx_breach_participant ON breach_checks(participant_id);

        CREATE TABLE IF NOT EXISTS questionnaire_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_id TEXT NOT NULL UNIQUE,
            q1_1 INTEGER,
            q1_2 INTEGER,
            q2_1 TEXT,
            q2_2 TEXT,
            q3_1 TEXT,
            q3_2 TEXT,
            q4_1 TEXT,
            q4_2 TEXT,
            q5_1 TEXT,
            q5_2 TEXT,
            answers_json TEXT,
            submitted_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_questionnaire_participant ON questionnaire_responses(participant_id);

        -- ============================================================
        --  TABLA PRINCIPAL DE MÉTRICAS (una fila por participante)
        --
        --  Convención de tipos:
        --    INTEGER  → booleano: 1 = sí, 0 = no, NULL = no aplica
        --    TEXT     → categórico / valor libre
        --    REAL     → numérico continuo
        --
        --  Prefijos de columna:
        --    s1_ → Escenario 1: Account Creation & WiFi
        --    s2_ → Escenario 2: Lock Screen
        --    s3_ → Escenario 3: Email & Phishing
        --    s4_ → Escenario 4: Web Browsing
        --    s5_ → Escenario 5: AI / Chat RRHH
        --    s6_ → Escenario 6: Profile & Apps
        --    s7_ → Escenario 7: File Cleanup
        --    s9_ → Escenario 9: Questionnaire behaviour
        --    ue_ → Unexpected Events (cross-scenario)
        -- ============================================================
        CREATE TABLE IF NOT EXISTS participant_metrics (
            participant_id TEXT PRIMARY KEY,

            -- ── Escenario 0: Políticas de Uso ────────────────────────
            s0_policy_acceptance_time_seconds INTEGER,
            s1_wifi_public                 INTEGER,    -- 1=pública, 0=corporativa
            s1_mail_password_strength       TEXT,       -- 'Weak' | 'Medium' | 'Strong'
            s1_default_password_flag        INTEGER,    -- 1=acepta sugerida, 0=la cambia
            s1_drive_password_strength      TEXT,
            s1_events_password_strength     TEXT,
            s1_password_reused              REAL,       -- 0.0–1.0 similitud promedio entre pares
            s1_mfa_enabled                  INTEGER,    -- 1=sí, 0=no
            s1_mfa_method_primary           TEXT,       -- 'SMS' | 'App' | 'Email' | 'None'
            s1_mfa_method_backup            TEXT,
            s1_mfa_email_alt                INTEGER,    -- 1=puso email alternativo
            s1_teams_camera_allowed         INTEGER,    -- 1=sí, 0=no, NULL=no vió
            s1_teams_microphone_allowed     INTEGER,
            s1_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 1

            -- ── Escenario 2: Bloqueo de pantalla ─────────────────────
            s2_manual_lock_screen           INTEGER,    -- 1=bloqueó, 0=no
            s2_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 2

            -- ── Escenario 3: Email y Phishing ─────────────────────────
            s3_phishing_clicked             REAL,       -- 0.0–1.0 % enlaces phishing clicados
            s3_phishing_reported            REAL,       -- 0.0–1.0 % phishing reportados correctamente
            s3_phishing_false_positives     INTEGER,    -- nº de correos legítimos reportados como phishing
            s3_phishing_report_reasons      TEXT,       -- JSON: {"mensaje2":"...","mensaje6":"..."}
            s3_credential_compromised       INTEGER,    -- 1=sí, 0=no
            s3_secure_data_transmission     TEXT,       -- 'Secure' | 'Insecure' | 'Not Set'
            s3_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 3

            -- ── Escenario 4: Navegación web ───────────────────────────
            s4_browser_warning_response     TEXT,       -- 'Ignored' | 'Heeded' | 'Not Encountered'
            s4_cookie_consent               TEXT,       -- 'Accepted All' | 'Rejected' | 'Customized' | NULL
            s4_clicked_dangerous_link       INTEGER,    -- 1=sí, 0=no
            s4_extensions_disabled_pct      REAL,       -- % extensiones sospechosas desactivadas (0-100)
            s4_warnings_heeded_pct          REAL,       -- % avisos de seguridad atendidos (0-100)
            s4_cookie_accepted_pct          REAL,       -- % banners donde aceptó todas las cookies (0-100)
            s4_cookie_consent_by_site       TEXT,       -- JSON por sitio: {"official":"reject",...}
            s4_cookie_risk_score            REAL,       -- score de riesgo por decisiones de cookies (0-100)
            s4_dangerous_links_clicked_pct  REAL,       -- % enlaces peligrosos clicados (0-100)
            s4_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 4

            -- ── Escenario 5: Chat RRHH / AI ───────────────────────────
            s5_personal_data_fields_shared  INTEGER,    -- nº de campos de datos personales revelados
            s5_third_party_app_authorized   INTEGER,    -- 1=autorizó, 0=rechazó, NULL=no llegó
            s5_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 5

            -- ── Escenario 6: Perfil profesional ───────────────────────
            s6_shared_birth_date            INTEGER,    -- 1=sí, 0=no
            s6_shared_phone                 INTEGER,
            s6_shared_social_media          INTEGER,
            s6_shared_city                  INTEGER,
            s6_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 6

            -- ── Escenario 7: Limpieza de archivos ─────────────────────
            s7_used_encryption              INTEGER,    -- 1=sí, 0=no
            s7_secure_disposal_used         INTEGER,    -- 1=sí, 0=no
            s7_deleted_final_report         INTEGER,    -- 1=sí, 0=no
            s7_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 7

            -- ── Escenario 9: Cuestionario final ───────────────────────
            s9_time_seconds                 INTEGER,    -- tiempo acumulado en escenario 9

            -- ── Escenario 10: Cierre ───────────────────────────────────
            s10_time_seconds                INTEGER,    -- tiempo acumulado en escenario 10

            -- ── Unexpected Events (cross-scenario) ───────────────────
            ue_accepted_fake_update         INTEGER,    -- 1=aceptó update falso, 0=rechazó
            ue_teams_password_reused        INTEGER,    -- 1=sí, 0=no
            ue_update_action                TEXT,       -- 'Restart' | 'Postpone_15m' etc.
            ue_update_response_time         INTEGER,    -- segundos hasta acción
            ue_update_postpone_count        INTEGER,    -- nº de veces pospuesto
            ue_update_postpone_delay_mins   INTEGER,    -- minutos elegidos

            -- ── Timestamps ───────────────────────────────────────────
            session_total_time_seconds      INTEGER,
            session_started_at              TEXT,
            session_completed_at            TEXT,
            recorded_at                     TEXT DEFAULT (datetime('now'))
        );

        -- Mantener session_metrics como log de eventos en crudo (auditoría)
        CREATE TABLE IF NOT EXISTS session_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            scenario TEXT,
            metric_name TEXT NOT NULL,
            metric_value TEXT,
            recorded_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY(session_id) REFERENCES registrations(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_metrics_session ON session_metrics(session_id);

        -- Historial de interacciones con IA (escenario 5)
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
            finalized_at TEXT,
            FOREIGN KEY(session_id) REFERENCES registrations(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_ai_interactions_session ON ai_interactions(session_id);
        CREATE INDEX IF NOT EXISTS idx_ai_interactions_participant ON ai_interactions(participant_id);
    `);
};

initDB();

// Migración para añadir totp_secret a bases de datos existentes
try {
    db.exec('ALTER TABLE registrations ADD COLUMN totp_secret TEXT;');
    console.log('✅ Columna totp_secret añadida a registrations (migración exitosa).');
} catch (err) {
    if (!err.message.includes('duplicate column name')) {
        console.warn('⚠️ Nota sobre migración de base de datos:', err.message);
    }
}

// Migración: columnas de actualización (taskbar events)
const migrateColumn = (table, col, type) => {
    try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type};`);
    } catch (err) {
        if (!err.message.includes('duplicate column name')) {
            console.warn(`⚠️ Migración ${table}.${col}:`, err.message);
        }
    }
};

migrateColumn('participant_metrics', 'ue_update_action',              'TEXT');
migrateColumn('participant_metrics', 'ue_update_response_time',       'INTEGER');
migrateColumn('participant_metrics', 'ue_update_postpone_count',      'INTEGER');
migrateColumn('participant_metrics', 'ue_update_postpone_delay_mins', 'INTEGER');

// Migración: escenario 0 (políticas de uso)
migrateColumn('participant_metrics', 's0_policy_acceptance_time_seconds', 'INTEGER');

// Migración: questionnaire_responses (answers_json añadido posteriormente)
migrateColumn('questionnaire_responses', 'answers_json', 'TEXT');

// Migración: notas (bloc de notas)
migrateColumn('participant_metrics', 'notes_used',                    'INTEGER');
migrateColumn('participant_metrics', 'notes_had_content_at_end',      'INTEGER');
migrateColumn('participant_metrics', 'notes_cleared_before_end',      'INTEGER');
migrateColumn('participant_metrics', 'notes_open_at_end',             'INTEGER');
migrateColumn('participant_metrics', 'notes_file_saved',              'INTEGER');
migrateColumn('participant_metrics', 'notes_file_deleted_before_end', 'INTEGER');

console.log('✅ Migraciones de participant_metrics aplicadas.');

export default db;
