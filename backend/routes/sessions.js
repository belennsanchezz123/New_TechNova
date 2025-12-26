import express from 'express';
import db from '../database.js';

const router = express.Router();

export function setupSessionRoutes() {
    router.post('/start', async (req, res) => {
        try {
            const { userIdentifier, service = 'mail', participantId, passwordStrength, passwordReuseCount } = req.body;

            // Allow using participantId as identifier if no explicit username provided
            let username = String(userIdentifier ?? '').trim();
            if (!username && participantId) {
                username = String(participantId).trim();
            }
            if (!username) {
                return res.status(400).json({ success: false, error: 'username requerido (o participantId)' });
            }

            const existing = db.prepare(`
                SELECT id, username, service, password_strength, mfa_enabled, participant_id, created_at, completed_at,
                    COALESCE(participant_id, username) AS user_identifier
                FROM registrations
                WHERE username = ? AND service = ?
            `).get(username, service);

            if (existing) {
                if (participantId && !existing.participant_id) {
                    db.prepare(`
                        UPDATE registrations
                        SET participant_id = ?
                        WHERE id = ?
                    `).run(participantId, existing.id);
                    existing.participant_id = participantId;
                }
                return res.json({
                    success: true,
                    session: existing,
                    created: false,
                    via: 'username'
                });
            }


            const insert = db.prepare(`
                INSERT INTO registrations (username, service, password_strength, mfa_enabled, participant_id, password_reuse_count)
                VALUES (?, ?, ?, 0, ?, ?)
            `);

            let newSession;
            try {
                const result = insert.run(
                    username,
                    service,
                    passwordStrength || null,
                    participantId || null,
                    passwordReuseCount || 0
                );

                newSession = db.prepare('SELECT id, username, participant_id, service, password_strength, mfa_enabled, password_reuse_count, created_at AS started_at, completed_at, COALESCE(participant_id, username) AS user_identifier FROM registrations WHERE id = ?').get(result.lastInsertRowid);

                return res.json({ success: true, session: newSession });
            } catch (err) {
                // Manejar conflictos de UNIQUE sobre participant_id devolviendo la sesión existente
                if (err && String(err.message).includes('UNIQUE constraint failed: registrations.participant_id')) {
                    if (participantId) {
                        const existingByPid = db.prepare('SELECT id, username, participant_id, service, password_strength, mfa_enabled, password_reuse_count, created_at AS started_at, completed_at, COALESCE(participant_id, username) AS user_identifier FROM registrations WHERE participant_id = ?').get(participantId);
                        if (existingByPid) {
                            return res.json({ success: true, session: existingByPid, created: false, via: 'participant_id' });
                        }
                    }
                }
                // Si no es ese caso, propaga el error para diagnóstico
                console.error('Insert registration failed:', err);
                return res.status(500).json({ success: false, error: err.message });
            }
        } catch (error) {
            console.error('Error starting session:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });

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

            // Mark completion time when completing
            updates.push('completed_at = datetime(\'now\')');

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No updates provided' });
            }

            values.push(sessionId);

            db.prepare(`
                UPDATE registrations
                SET ${updates.join(', ')}
                WHERE id = ?
            `).run(...values);

            const updated = db.prepare('SELECT id, username, participant_id, service, password_strength, mfa_enabled, password_reuse_count, created_at AS started_at, completed_at, COALESCE(participant_id, username) AS user_identifier FROM registrations WHERE id = ?').get(sessionId);

            res.json({ success: true, session: updated });
        } catch (error) {
            console.error('Error completing session:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/all', async (req, res) => {
        try {
            // Return fields with names expected by the admin UI
            const sessions = db.prepare(`
                SELECT
                    id,
                    username AS user_identifier,
                    participant_id,
                    service,
                    password_strength,
                    mfa_enabled,
                    password_reuse_count,
                    created_at AS started_at,
                    completed_at
                FROM registrations
                ORDER BY created_at DESC
            `).all();

            // Extract consent_email if password_strength stores it as 'consent:email'
            const normalized = sessions.map(s => {
                const out = { ...s };
                if (out.password_strength && String(out.password_strength).startsWith('consent:')) {
                    out.consent_email = String(out.password_strength).replace(/^consent:/, '');
                } else {
                    out.consent_email = null;
                }
                return out;
            });

            res.json({ success: true, sessions: normalized });
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Guardar métricas de sesión (acepta array o objeto)
    router.post('/metrics', async (req, res) => {
        try {
            const { sessionId, metrics } = req.body;
            if (!sessionId || !metrics) return res.status(400).json({ success: false, error: 'sessionId y metrics requeridos' });

            const insert = db.prepare(`
                INSERT INTO session_metrics (session_id, scenario, metric_name, metric_value)
                VALUES (?, ?, ?, ?)
            `);

            const insertMany = db.transaction((rows) => {
                for (const r of rows) {
                    insert.run(r.session_id, r.scenario || null, r.metric_name, r.metric_value);
                }
            });

            // Normalizar payloads: soporta array [{scenario, metric_name, metric_value}] o objeto { 'scenario.metric': value }
            let rows = [];
            if (Array.isArray(metrics)) {
                rows = metrics.map(m => ({ session_id: sessionId, scenario: m.scenario || null, metric_name: m.metric_name, metric_value: typeof m.metric_value === 'string' ? m.metric_value : JSON.stringify(m.metric_value) }));
            } else if (typeof metrics === 'object') {
                for (const [key, val] of Object.entries(metrics)) {
                    // intentar separar 'scenario.metric' si existe
                    const parts = key.split('.');
                    const scenario = parts.length > 1 ? parts.shift() : null;
                    const metric_name = parts.join('.');
                    rows.push({ session_id: sessionId, scenario, metric_name, metric_value: typeof val === 'string' ? val : JSON.stringify(val) });
                }
            }

            insertMany(rows);

            res.json({ success: true, inserted: rows.length });
        } catch (error) {
            console.error('Error saving metrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Obtener métricas de una sesión concreta
    router.get('/:sessionId/metrics', async (req, res) => {
        try {
            const { sessionId } = req.params;
            const session = db.prepare('SELECT * FROM registrations WHERE id = ?').get(sessionId);
            if (!session) return res.status(404).json({ success: false, error: 'session not found' });

            const metrics = db.prepare('SELECT * FROM session_metrics WHERE session_id = ? ORDER BY recorded_at DESC').all(sessionId);

            res.json({ success: true, session, metrics });
        } catch (error) {
            console.error('Error fetching metrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Obtener métricas de todas las sesiones de un participante (por participant_id)
    router.get('/participant/:participantId/metrics', async (req, res) => {
        try {
            const { participantId } = req.params;
            if (!participantId) return res.status(400).json({ success: false, error: 'participantId requerido' });

            // Obtener sesiones asociadas al participant_id
            const sessions = db.prepare('SELECT id, username, participant_id, created_at AS started_at, completed_at, COALESCE(participant_id, username) AS user_identifier FROM registrations WHERE participant_id = ? ORDER BY created_at DESC').all(participantId);

            if (!sessions || sessions.length === 0) {
                return res.status(404).json({ success: false, error: 'participant not found' });
            }

            // Obtener métricas uniendo por session_id -> devolver todas las métricas relacionadas
            const metrics = db.prepare(`
                SELECT sm.* FROM session_metrics sm
                JOIN registrations r ON r.id = sm.session_id
                WHERE r.participant_id = ?
                ORDER BY sm.recorded_at DESC
            `).all(participantId);

            res.json({ success: true, participant: { participant_id: participantId }, sessions, metrics });
        } catch (error) {
            console.error('Error fetching participant metrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
