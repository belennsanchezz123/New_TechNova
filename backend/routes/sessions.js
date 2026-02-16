import express from 'express';
import db from '../database.js';

const router = express.Router();

export function setupSessionRoutes() {
    
    // RUTA PARA INICIAR SESIÓN (Al aceptar políticas o registrar servicio)
    router.post('/start', async (req, res) => {
        try {
            const { userIdentifier, service, participantId, passwordStrength, passwordReuseCount } = req.body;

            // 1. Validar identificador
            const pid = participantId || userIdentifier;
            if (!pid) {
                return res.status(400).json({ success: false, error: 'Se requiere participantId o userIdentifier' });
            }

            // 2. Buscar si ya existe una sesión activa para este participante
            // Esto evita crear múltiples filas para el mismo usuario (P001)
            const existing = db.prepare(`
                SELECT id, username, service, participant_id, created_at, 
                       COALESCE(participant_id, username) AS user_identifier
                FROM registrations
                WHERE participant_id = ? OR username = ?
                LIMIT 1
            `).get(pid, pid);

            if (existing) {
                console.log(`Sesión recuperada para: ${pid}`);
                // ACTUALIZACIÓN CLAVE: Ponemos la fecha de creación a 'ahora' 
                // para que el Admin la muestre como sesión nueva/activa.
                db.prepare(`
                UPDATE registrations 
                SET created_at = datetime('now') 
                WHERE id = ?
                `).run(existing.id);

                // Si además estamos registrando un servicio real
                if (service && service !== 'initial_setup') {
                    db.prepare(`
                    UPDATE registrations 
                    SET username = ?, service = ?, password_strength = ?, password_reuse_count = ?
                    WHERE id = ?
                    `).run(pid, service, passwordStrength || 'pending', passwordReuseCount || 0, existing.id);
                }

                // Recuperar el objeto actualizado para devolverlo con la estructura correcta
                const updatedSession = db.prepare(`
                    SELECT id, username, participant_id, service, created_at AS started_at, 
                    COALESCE(participant_id, username) AS user_identifier 
                    FROM registrations WHERE id = ?
                `).get(existing.id);

                return res.json({ success: true, session: updatedSession, created: false });
            }

            // 3. Crear nueva sesión
            // Importante: Rellenamos campos 'NOT NULL' con valores por defecto si vienen vacíos
            const finalUsername = pid; 
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
                pid,
                passwordReuseCount || 0
            );

            // 4. Recuperar el objeto recién creado para devolverlo al frontend
            const newSession = db.prepare(`
                SELECT id, username, participant_id, service, created_at AS started_at, 
                COALESCE(participant_id, username) AS user_identifier 
                FROM registrations WHERE id = ?
            `).get(result.lastInsertRowid);

            console.log(`Nueva sesión generada. ID: ${result.lastInsertRowid}`);
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
            db.prepare(`UPDATE registrations SET ${updates.join(', ')} WHERE id = ?`).run(...values);

            const updated = db.prepare('SELECT * FROM registrations WHERE id = ?').get(sessionId);
            res.json({ success: true, session: updated });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

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

    // RUTA PARA GUARDAR MÉTRICAS (Limpia, sin redundancia)
    router.post('/metrics', async (req, res) => {
        try {
            const { sessionId, metrics } = req.body;
            if (!sessionId || !metrics) return res.status(400).json({ success: false, error: 'Faltan datos' });

            const insert = db.prepare(`INSERT INTO session_metrics (session_id, scenario, metric_name, metric_value) VALUES (?, ?, ?, ?)`);
            
            const rows = [];
            for (const [key, val] of Object.entries(metrics)) {
                const parts = key.split('.');
                const scenario = parts.length > 1 ? parts.shift() : null;
                const metric_name = parts.join('.');
                rows.push({ 
                    session_id: sessionId, 
                    scenario, 
                    metric_name, 
                    metric_value: typeof val === 'string' ? val : JSON.stringify(val) 
                });
            }

            const transaction = db.transaction((data) => {
                for (const r of data) insert.run(r.session_id, r.scenario, r.metric_name, r.metric_value);
            });
            transaction(rows);

            res.json({ success: true, inserted: rows.length });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // RUTA PARA VER MÉTRICAS POR ID
    router.get('/:sessionId/metrics', async (req, res) => {
        try {
            const { sessionId } = req.params;
            const session = db.prepare('SELECT id, participant_id, username AS user_identifier, created_at AS started_at, completed_at FROM registrations WHERE id = ?').get(sessionId);
            const metrics = db.prepare('SELECT * FROM session_metrics WHERE session_id = ? ORDER BY recorded_at DESC').all(sessionId);
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