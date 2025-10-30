import express from 'express';
import db from '../database.js';

const router = express.Router();

export function setupBreachRoutes() {
    router.post('/check', async (req, res) => {
        try {
            const { email, participantId } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, error: 'Email requerido' });
            }

            const apiKey = process.env.HIBP_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    success: false,
                    error: 'HIBP API key no configurada'
                });
            }

            const response = await fetch(
                `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
                {
                    headers: {
                        'hibp-api-key': apiKey,
                        'user-agent': 'LYNX-Security-Study'
                    }
                }
            );

            let breachData = {
                breachCount: 0,
                pasteCount: 0,
                breaches: []
            };

            if (response.status === 200) {
                const breaches = await response.json();
                breachData = {
                    breachCount: breaches.length,
                    pasteCount: 0,
                    breaches: breaches
                };
            } else if (response.status !== 404) {
                throw new Error(`HIBP API error: ${response.status}`);
            }

            const insert = db.prepare(`
                INSERT INTO breach_checks (email, participant_id, breach_count, paste_count, breaches_data)
                VALUES (?, ?, ?, ?, ?)
            `);

            insert.run(
                email,
                participantId || null,
                breachData.breachCount,
                breachData.pasteCount,
                JSON.stringify(breachData.breaches)
            );

            res.json({
                success: true,
                ...breachData
            });
        } catch (error) {
            console.error('Error checking breach:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/history', async (req, res) => {
        try {
            const history = db.prepare(`
                SELECT * FROM breach_checks
                ORDER BY checked_at DESC
            `).all();

            const formattedHistory = history.map(record => ({
                ...record,
                breaches_data: JSON.parse(record.breaches_data || '[]')
            }));

            res.json({ success: true, history: formattedHistory });
        } catch (error) {
            console.error('Error fetching breach history:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
