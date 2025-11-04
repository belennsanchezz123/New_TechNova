import express from 'express';
import db from '../database.js';

const router = express.Router();

export function setupQuestionnaireRoutes() {
    router.post('/submit', async (req, res) => {
        try {
            const {
                participantId,
                q1_1, q1_2,
                q2_1, q2_2,
                q3_1, q3_2,
                q4_1, q4_2,
                q5_1, q5_2
            } = req.body;

            if (!participantId) {
                return res.status(400).json({ success: false, error: 'Participant ID is required' });
            }

            const requiredFields = ['q1_1', 'q1_2', 'q2_1', 'q2_2', 'q3_1', 'q3_2', 'q4_1', 'q4_2', 'q5_1', 'q5_2'];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'All questions must be answered',
                    missingFields
                });
            }

            const existing = db.prepare('SELECT id FROM questionnaire_responses WHERE participant_id = ?').get(participantId);

            if (existing) {
                db.prepare(`
                    UPDATE questionnaire_responses
                    SET q1_1 = ?, q1_2 = ?, q2_1 = ?, q2_2 = ?,
                        q3_1 = ?, q3_2 = ?, q4_1 = ?, q4_2 = ?,
                        q5_1 = ?, q5_2 = ?, submitted_at = datetime('now')
                    WHERE participant_id = ?
                `).run(q1_1, q1_2, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2, participantId);

                return res.json({ success: true, message: 'Questionnaire updated successfully' });
            }

            const insert = db.prepare(`
                INSERT INTO questionnaire_responses
                (participant_id, q1_1, q1_2, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insert.run(participantId, q1_1, q1_2, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2);

            res.json({ success: true, message: 'Questionnaire submitted successfully' });
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
