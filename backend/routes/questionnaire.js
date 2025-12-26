import express from 'express';
import db from '../database.js';

const router = express.Router();

export function setupQuestionnaireRoutes() {
    router.post('/submit', async (req, res) => {
        try {
            console.log('POST /api/questionnaire/submit payload:', JSON.stringify(req.body).slice(0, 2000));
            const { participantId, sessionId, answers } = req.body;

            if (!participantId) {
                return res.status(400).json({ success: false, error: 'participantId is required' });
            }

            // If an 'answers' object is provided, store it as JSON in the answers_json column
            if (answers && typeof answers === 'object') {
                // Safely stringify answers (catch circular refs or errors)
                let answersJson = null;
                try {
                    answersJson = JSON.stringify(answers);
                } catch (sErr) {
                    console.error('Failed to stringify answers object:', sErr);
                    // fallback to an empty object to avoid failing the whole request
                    answersJson = JSON.stringify({});
                }

                const existing = db.prepare('SELECT id FROM questionnaire_responses WHERE participant_id = ?').get(participantId);
                if (existing) {
                    db.prepare(`
                        UPDATE questionnaire_responses
                        SET answers_json = ?, submitted_at = datetime('now')
                        WHERE participant_id = ?
                    `).run(answersJson, participantId);
                    return res.json({ success: true, message: 'Questionnaire updated (answers_json)' });
                }

                db.prepare(`
                    INSERT INTO questionnaire_responses (participant_id, answers_json)
                    VALUES (?, ?)
                `).run(participantId, answersJson);

                return res.json({ success: true, message: 'Questionnaire saved (answers_json)' });
            }

            // Fallback: if legacy flat fields are sent, accept them too
            const {
                q1_1, q1_2,
                q2_1, q2_2,
                q3_1, q3_2,
                q4_1, q4_2,
                q5_1, q5_2
            } = req.body;

            const existingFlat = db.prepare('SELECT id FROM questionnaire_responses WHERE participant_id = ?').get(participantId);
            if (existingFlat) {
                db.prepare(`
                    UPDATE questionnaire_responses
                    SET q1_1 = ?, q1_2 = ?, q2_1 = ?, q2_2 = ?,
                        q3_1 = ?, q3_2 = ?, q4_1 = ?, q4_2 = ?,
                        q5_1 = ?, q5_2 = ?, submitted_at = datetime('now')
                    WHERE participant_id = ?
                `).run(q1_1, q1_2, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2, participantId);
                return res.json({ success: true, message: 'Questionnaire updated (legacy fields)' });
            }

            const insert = db.prepare(`
                INSERT INTO questionnaire_responses
                (participant_id, q1_1, q1_2, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            insert.run(participantId, q1_1, q1_2, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2);

            res.json({ success: true, message: 'Questionnaire submitted (legacy fields)' });
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/all', async (req, res) => {
        try {
            const responses = db.prepare(`
                SELECT * FROM questionnaire_responses
                ORDER BY submitted_at DESC
            `).all();

            res.json({ success: true, responses });
        } catch (error) {
            console.error('Error fetching questionnaire responses:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
