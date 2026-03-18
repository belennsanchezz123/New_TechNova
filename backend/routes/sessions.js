import express from 'express';
import db from '../database.js';
import { getExporter, getAvailableFormats } from '../utils/exporters/ExporterFactory.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// ══════════════════════════════════════════════════════════════════════
// RUTAS PÚBLICAS — usadas por los participantes (NO requieren JWT)
// ══════════════════════════════════════════════════════════════════════
export function setupSessionRoutes() {
    const router = express.Router();
    
    // RUTA PARA INICIAR SESIÓN (Al aceptar políticas o registrar servicio)
    router.post('/start', async (req, res) => {
        try {
            const { sessionId, userIdentifier, service, participantId, passwordStrength, passwordReuseCount } = req.body;

            // 1. Validar identificador
            const pid = participantId || userIdentifier;
            if (!pid) {
                return res.status(400).json({ success: false, error: 'Se requiere participantId o userIdentifier' });
            }

            // 2. Buscar si ya existe la sesión explícitamente por sessionId
            // Esto evita que si dos navegadores usan "P001", uno machaque al otro (P001)
            if (sessionId) {
                const existing = db.prepare(`
                    SELECT id, username, service, participant_id, created_at, 
                           COALESCE(participant_id, username) AS user_identifier
                    FROM registrations
                    WHERE id = ?
                    LIMIT 1
                `).get(sessionId);

                if (existing) {
                    console.log(`Sesión recuperada por ID explícito: ${sessionId} (Participant: ${existing.participant_id})`);
                    
                    db.prepare(`
                    UPDATE registrations 
                    SET created_at = datetime('now'), completed_at = NULL 
                    WHERE id = ?
                    `).run(existing.id);

                    // Si además estamos registrando un servicio real
                    if (service && service !== 'initial_setup') {
                        // Si ya tiene un nombre de usuario real (!= P00X), no lo machacamos.
                        // Usamos existing.participant_id para comprobarlo, ya que \`pid\` podría ser genérico ("P001")
                        const isPreviousIdReal = existing.username && existing.username !== existing.participant_id;
                        const newUsername = isPreviousIdReal ? existing.username : (userIdentifier || pid);

                        db.prepare(`
                        UPDATE registrations 
                        SET username = ?, service = ?, password_strength = ?, password_reuse_count = ?
                        WHERE id = ?
                        `).run(newUsername, service, passwordStrength || 'pending', passwordReuseCount || 0, existing.id);
                    }

                    // Recuperar el objeto actualizado para devolverlo con la estructura correcta
                    const updatedSession = db.prepare(`
                        SELECT id, username, participant_id, service, created_at AS started_at, 
                        COALESCE(participant_id, username) AS user_identifier 
                        FROM registrations WHERE id = ?
                    `).get(existing.id);

                    return res.json({ success: true, session: updatedSession, created: false });
                }
            }

            // 3. Crear nueva sesión si no hay un sessionId o no se encontró
            // Aseguramos que el PID sea único en base de datos aunque dos ingresen "P001"
            let finalPid = pid;
            let counter = 1;
            while (db.prepare('SELECT id FROM registrations WHERE participant_id = ?').get(finalPid)) {
                finalPid = `${pid}_${counter}`;
                counter++;
            }

            // Importante: Rellenamos campos 'NOT NULL' con valores por defecto si vienen vacíos
            const finalUsername = finalPid; 
            const finalService = service || 'initial_setup';
            const finalStrength = passwordStrength || 'pending';

            const insert = db.prepare(`
                INSERT INTO registrations (username, service, password_strength, mfa_enabled, participant_id, password_reuse_count)
                VALUES (?, ?, ?, 0, ?, ?)
            `);

            const result = insert.run(
                finalUsername,
                finalService,
                finalStrength,
                finalPid,
                passwordReuseCount || 0
            );

            // 4. Recuperar el objeto recién creado para devolverlo al frontend
            const newSession = db.prepare(`
                SELECT id, username, participant_id, service, created_at AS started_at, 
                COALESCE(participant_id, username) AS user_identifier 
                FROM registrations WHERE id = ?
            `).get(result.lastInsertRowid);

            console.log(`Nueva sesión generada. ID: ${result.lastInsertRowid} (Asignado: ${finalPid})`);
            return res.json({ success: true, session: newSession, created: true });

        } catch (error) {
            console.error('Error crítico en /start:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA COMPLETAR (MFA, Consentimiento, etc.)
    router.post('/complete', async (req, res) => {
        try {
            const { sessionId, consentEmail, mfaEnabled } = req.body;
            const updates = [];
            const values = [];

            if (typeof mfaEnabled === 'boolean') {
                updates.push('mfa_enabled = ?');
                values.push(mfaEnabled ? 1 : 0);
            }
            if (consentEmail) {
                updates.push('password_strength = ?');
                values.push(`consent:${consentEmail}`);
            }
            updates.push('completed_at = datetime(\'now\')');

            if (updates.length === 0) return res.status(400).json({ success: false, error: 'No data provided' });

            values.push(sessionId);
            const info = db.prepare(`UPDATE registrations SET ${updates.join(', ')} WHERE id = ?`).run(...values);
            
            console.log(`✅ Sesión ${sessionId} completada. Registros actualizados: ${info.changes}`);

            const updated = db.prepare('SELECT * FROM registrations WHERE id = ?').get(sessionId);
            res.json({ success: true, session: updated, changes: info.changes });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA CONFIGURAR MFA (TOTP)
    router.post('/mfa/setup', async (req, res) => {
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                return res.status(400).json({ success: false, error: 'Falta sessionId' });
            }

            // Generar secreto TOTP
            const secret = speakeasy.generateSecret({
                name: `TechNova Security (${sessionId})`,
                length: 20
            });

            // Guardar secreto en la base de datos
            db.prepare('UPDATE registrations SET totp_secret = ? WHERE id = ?').run(secret.base32, sessionId);

            // Generar QR Code
            const qrUrl = await QRCode.toDataURL(secret.otpauth_url);

            res.json({
                success: true,
                secret: secret.base32,
                qrUrl: qrUrl
            });
        } catch (error) {
            console.error('Error generando TOTP:', error);
            res.status(500).json({ success: false, error: 'Error al generar la configuración MFA' });
        }
    });

    // RUTA PARA VERIFICAR MFA (TOTP)
    router.post('/mfa/verify', async (req, res) => {
        try {
            const { sessionId, code } = req.body;
            if (!sessionId || !code) {
                return res.status(400).json({ success: false, error: 'Faltan datos' });
            }

            // Obtener secreto de la base de datos
            const row = db.prepare('SELECT totp_secret FROM registrations WHERE id = ?').get(sessionId);
            
            if (!row || !row.totp_secret) {
                return res.status(400).json({ success: false, error: 'MFA no configurado para esta sesión' });
            }

            // Verificar código
            const verified = speakeasy.totp.verify({
                secret: row.totp_secret,
                encoding: 'base32',
                token: code,
                window: 1 // Permite ±30 segundos de desajuste
            });

            res.json({ success: true, verified });
        } catch (error) {
            console.error('Error verificando TOTP:', error);
            res.status(500).json({ success: false, error: 'Error al verificar el código MFA' });
        }
    });

    // RUTA PARA GUARDAR MÉTRICAS
    // Hace dos cosas en paralelo:
    //   1. Inserta en session_metrics (log crudo de auditoría, formato llave-valor)
    //   2. Upsert en participant_metrics (tabla ancha, una fila por participante)
    router.post('/metrics', async (req, res) => {
        try {
            const { sessionId, metrics } = req.body;
            if (!sessionId || !metrics) return res.status(400).json({ success: false, error: 'Faltan datos' });

            // ── 1. Log crudo en session_metrics ──────────────────────────────
            const insertLog = db.prepare(
                `INSERT INTO session_metrics (session_id, scenario, metric_name, metric_value) VALUES (?, ?, ?, ?)`
            );
            const logRows = [];
            for (const [key, val] of Object.entries(metrics)) {
                // Skip null, undefined, or empty string values for logging
                if (val === null || val === undefined || val === '') {
                    continue;
                }
                const parts = key.split('.');
                const scenario = parts.length > 1 ? parts.shift() : null;
                const metric_name = parts.join('.');
                logRows.push({
                    session_id: sessionId,
                    scenario,
                    metric_name,
                    metric_value: typeof val === 'string' ? val : JSON.stringify(val)
                });
            }

            // ── 2. Upsert en participant_metrics (tabla ancha) ────────────────
            // Recuperar participant_id a partir del sessionId
            const reg = db.prepare('SELECT participant_id, created_at, completed_at FROM registrations WHERE id = ?').get(sessionId);
            if (!reg) return res.status(404).json({ success: false, error: 'Sesión no encontrada' });

            // Mapeo: clave del objeto metrics del frontend → columna en participant_metrics
            // Los booleanos se normalizan: true/1/'Yes'/'Sí' → 1 | false/0/'No' → 0 | null/undefined/'Not Set' → NULL
            const toInt = (v) => {
                if (v === null || v === undefined || v === 'Not Set' || v === 'N/A') return null;
                if (v === true  || v === 1 || v === 'Yes' || v === 'Sí' || v === 'Completed' || v === 'Yes - Completed') return 1;
                if (v === false || v === 0 || v === 'No'  || v === 'Did not click' || v === 'Did not report') return 0;
                return null;
            };
            const toText = (v) => (v === null || v === undefined || v === 'Not Set' || v === 'N/A') ? null : String(v);
            const toInt2 = (v) => (v === null || v === undefined) ? null : parseInt(v, 10) || 0;
            const toReal = (v) => (v === null || v === undefined) ? null : parseFloat(v) || 0;

            const m = metrics; // alias corto

            const wideRow = {
                participant_id:               reg.participant_id,
                // S1
                s1_wifi_public:                toInt(m['scenario1.wifi_public']),
                s1_mail_password_strength:     toText(m['scenario1.mail_password_strength']),
                s1_default_password_flag:      toInt(m['scenario1.default_password_flag']),
                s1_drive_password_strength:    toText(m['scenario1.drive_password_strength']),
                s1_events_password_strength:   toText(m['scenario1.events_password_strength']),
                s1_password_reused:            toReal(m['scenario1.password_reused']),
                s1_mfa_enabled:                toInt(m['scenario1.mfa_usage']),
                s1_mfa_method_primary:         toText(m['scenario1.mfa_method_primary']),
                s1_mfa_method_backup:          toText(m['scenario1.mfa_method_backup']),
                s1_mfa_email_alt:              toInt(m['scenario1.mfa_email_alternative']),
                s1_teams_camera_allowed:       toInt(m['scenario1.teams_camera_permission']),
                s1_teams_microphone_allowed:   toInt(m['scenario1.teams_microphone_permission']),
                s1_time_seconds:               toInt2(m['scenario1.time_seconds']),
                // S2
                s2_manual_lock_screen:         toInt(m['scenario2.manual_lock_screen']),
                s2_time_seconds:               toInt2(m['scenario2.time_seconds']),
                // S3
                s3_phishing_clicked:           toReal(m['scenario3.phishing_clicked']),
                s3_phishing_reported:          toReal(m['scenario3.phishing_reported']),
                s3_phishing_false_positives:   toInt2(m['scenario3.phishing_false_positives']),
                s3_phishing_report_reasons:    toText(m['scenario3.phishing_report_reasons']),
                s3_credential_compromised:     toInt(m['scenario3.credential_exposure'] ?? m['scenario3.credential_compromise']),
                s3_secure_data_transmission:   toInt(m['scenario3.secure_data_transmission']),
                s3_time_seconds:               toInt2(m['scenario3.time_seconds']),
                // S4
                s4_browser_warning_response:   toText(m['scenario4.response_to_browser_warnings']),
                s4_cookie_consent:             toText(m['scenario4.cookie_consent']),
                s4_clicked_dangerous_link:     toInt(m['scenario4.clicked_dangerous_link']),
                s4_extensions_disabled_pct:    toReal(m['scenario4.extensions_disabled_pct']),
                s4_warnings_heeded_pct:        toReal(m['scenario4.warnings_heeded_pct']),
                s4_cookie_accepted_pct:        toReal(m['scenario4.cookie_accepted_pct']),
                s4_cookie_consent_by_site:     toText(m['scenario4.cookie_consent_by_site']),
                s4_cookie_risk_score:          toReal(m['scenario4.cookie_risk_score']),
                s4_dangerous_links_clicked_pct: toReal(m['scenario4.dangerous_links_clicked_pct']),
                s4_time_seconds:               toInt2(m['scenario4.time_seconds']),
                // S5
                s5_personal_data_fields_shared: toInt2(m['scenario5.personal_data_disclosure_rate']),
                s5_third_party_app_authorized:  toInt(m['scenario5.third_party_app_authorization']),
                s5_time_seconds:               toInt2(m['scenario5.time_seconds']),
                // S6
                s6_shared_birth_date:          null, // se actualiza desde el handler de perfil
                s6_shared_phone:               null,
                s6_shared_social_media:        null,
                s6_shared_city:                null,
                s6_time_seconds:               toInt2(m['scenario6.time_seconds']),
                // S7
                s7_used_encryption:            toInt(m['scenario6.data_encryption_usage']),
                s7_secure_disposal_used:       toInt(m['scenario6.secure_data_disposal']),
                s7_deleted_final_report:       toInt(m['scenario6.deleted_final_report']),
                s7_time_seconds:               toInt2(m['scenario7.time_seconds']),
                // S8 - se guarda desde breach check
                s8_consented_email_check:      null,
                s8_breach_count:               null,
                s8_time_seconds:               toInt2(m['scenario8.time_seconds']),
                // S9-S10
                s9_time_seconds:               toInt2(m['scenario9.time_seconds']),
                s10_time_seconds:              toInt2(m['scenario10.time_seconds']),
                // Unexpected
                ue_accepted_fake_update:       toInt(m['unexpected.update_compliance_rate']),
                ue_teams_password_reused:      toInt(m['unexpected.teams_password_reused']),
                // Timestamps
                session_total_time_seconds:   toInt2(m['simulation.total_time_seconds']),
                session_started_at:            reg.created_at,
                session_completed_at:          reg.completed_at,
            };

            // Construir el UPSERT dinámicamente con las columnas presentes
            const cols = Object.keys(wideRow);
            const placeholders = cols.map(() => '?').join(', ');

            const upsertStmt = db.prepare(`
                INSERT INTO participant_metrics (${cols.join(', ')})
                VALUES (${placeholders})
                ON CONFLICT(participant_id) DO UPDATE SET 
                ${cols.filter(c => c !== 'participant_id').map(c => `${c} = COALESCE(excluded.${c}, participant_metrics.${c})`).join(', ')}
            `);

            db.transaction(() => {
                // Log crudo
                for (const r of logRows) insertLog.run(r.session_id, r.scenario, r.metric_name, r.metric_value);
                // Tabla ancha
                upsertStmt.run(...cols.map(c => wideRow[c]));
            })();

            res.json({ success: true, inserted: logRows.length });
        } catch (error) {
            console.error('Error en /metrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}

// ══════════════════════════════════════════════════════════════════════
// RUTAS PROTEGIDAS — solo para admin (requieren JWT)
// ══════════════════════════════════════════════════════════════════════
export function setupAdminSessionRoutes() {
    const router = express.Router();

    // RUTA PARA EL ADMIN (Ver todas las sesiones)
    router.get('/all', async (req, res) => {
        try {
            const sessions = db.prepare(`
                SELECT id, username AS user_identifier, participant_id, service, password_strength, mfa_enabled, password_reuse_count, created_at AS started_at, completed_at
                FROM registrations ORDER BY created_at DESC
            `).all();
            
            const normalized = sessions.map(s => ({
                ...s,
                consent_email: (s.password_strength && String(s.password_strength).startsWith('consent:')) ? 
                                s.password_strength.replace('consent:', '') : null
            }));
            res.json({ success: true, sessions: normalized });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA LISTAR FORMATOS DISPONIBLES DE EXPORTACIÓN
    router.get('/metrics/export/formats', (req, res) => {
        res.json({ success: true, formats: getAvailableFormats() });
    });

    // RUTA PARA EXPORTAR MÉTRICAS (Patrón Adapter)
    // Acepta ?format=csv | ?format=json (por defecto: csv)
    router.get('/metrics/export', async (req, res) => {
        try {
            const format = req.query.format || 'csv';
            const exporter = getExporter(format);

            const rows = db.prepare(`
                SELECT pm.*, qr.answers_json, bc.breach_count AS s8_breach_count_confirmed
                FROM participant_metrics pm
                LEFT JOIN questionnaire_responses qr ON qr.participant_id = pm.participant_id
                LEFT JOIN breach_checks bc ON bc.participant_id = pm.participant_id
                ORDER BY pm.recorded_at DESC
            `).all();

            if (rows.length === 0) {
                return res.status(404).json({ success: false, error: 'No hay datos' });
            }

            const output = exporter.format(rows);
            const filename = `technova_metrics_${new Date().toISOString().slice(0, 10)}.${exporter.getExtension()}`;

            res.setHeader('Content-Type', exporter.getMimeType());
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(output);
        } catch (error) {
            console.error('Error exportando datos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA VER INTERACCIONES DE IA (Escenario 5)
    // Filtros opcionales: ?sessionId=123 o ?participantId=P001
    router.get('/ai/interactions', async (req, res) => {
        try {
            const { sessionId, participantId } = req.query;

            const where = [];
            const params = [];

            if (sessionId) {
                where.push('ai.session_id = ?');
                params.push(sessionId);
            }
            if (participantId) {
                where.push('ai.participant_id = ?');
                params.push(participantId);
            }

            const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

            const rows = db.prepare(`
                SELECT
                    ai.id,
                    ai.session_id,
                    ai.participant_id,
                    ai.user_prompt,
                    ai.ai_response,
                    ai.trap_value,
                    ai.trap_label,
                    ai.user_final_text,
                    ai.trap_repeated,
                    ai.created_at,
                    ai.finalized_at,
                    r.created_at AS session_started_at,
                    r.completed_at AS session_completed_at
                FROM ai_interactions ai
                LEFT JOIN registrations r ON r.id = ai.session_id
                ${whereClause}
                ORDER BY ai.created_at DESC
            `).all(...params);

            res.json({ success: true, interactions: rows });
        } catch (error) {
            console.error('Error en /ai/interactions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA VER MÉTRICAS POR ID
    router.get('/:sessionId/metrics', async (req, res) => {
        try {
            const { sessionId } = req.params;
            const session = db.prepare('SELECT id, participant_id, username AS user_identifier, created_at AS started_at, completed_at FROM registrations WHERE id = ?').get(sessionId);
            const metrics = db.prepare(`
                SELECT * FROM session_metrics 
                WHERE id IN (
                    SELECT MAX(id) FROM session_metrics 
                    WHERE session_id = ? 
                    GROUP BY scenario, metric_name
                )
                ORDER BY scenario ASC, metric_name ASC
            `).all(sessionId);
            res.json({ success: true, session, metrics });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA ELIMINAR TODO (Admin)
    router.delete('/clear-all', async (req, res) => {
        try {
            db.transaction(() => {
                db.prepare('DELETE FROM session_metrics').run();
                db.prepare('DELETE FROM participant_metrics').run();
                db.prepare('DELETE FROM questionnaire_responses').run();
                db.prepare('DELETE FROM registrations').run();
            })();
            res.json({ success: true, message: 'Todos los datos han sido eliminados' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}