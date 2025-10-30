import express from 'express';
import db from '../database.js';

const router = express.Router();

export function setupSessionRoutes() {
    router.post('/start', async (req, res) => {
        try {
            const { userIdentifier, service = 'mail', participantId, passwordStrength, passwordReuseCount } = req.body;

            const username = String(userIdentifier ?? '').trim();
            if (!username) {
                return res.status(400).json({ success: false, error: 'username requerido' });
            }

            const existing = db.prepare(`
                SELECT id, username, service, password_strength, mfa_enabled, participant_id, created_at
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

            const result = insert.run(
                username,
                service,
                passwordStrength || null,
                participantId || null,
                passwordReuseCount || 0
            );

            const newSession = db.prepare('SELECT * FROM registrations WHERE id = ?').get(result.lastInsertRowid);

            return res.json({ success: true, session: newSession });
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

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No updates provided' });
            }

            values.push(sessionId);

            db.prepare(`
                UPDATE registrations
                SET ${updates.join(', ')}
                WHERE id = ?
            `).run(...values);

            const updated = db.prepare('SELECT * FROM registrations WHERE id = ?').get(sessionId);

            res.json({ success: true, session: updated });
        } catch (error) {
            console.error('Error completing session:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/all', async (req, res) => {
        try {
            const sessions = db.prepare(`
                SELECT * FROM registrations
                ORDER BY created_at DESC
            `).all();

            res.json({ success: true, sessions });
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
