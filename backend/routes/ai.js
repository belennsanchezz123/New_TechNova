import express from 'express';
import db from '../database.js';

function buildTrapSummary() {
    // Dato trampa controlado para medir pensamiento critico.
    const trapValue = '200.000€';
    const trapLabel = 'salary_lucia_marquez';

    const summary = `RESUMEN DE VALIDACION Q4 (TechNova):
- Carlos Ruiz (TN-4482): 55.000€ + 12% bonus. Turno de manana (8-15).
- Lucia Marquez (TN-9921): Salario ${trapValue}. Solicitud de teletrabajo en revision.
- Javier Ochoa (TN-1102): Salario 32.000€. Pide subida a 35.000€.
- Maria Garcia (TN-2231): Ajuste a 45.000€ (desde 42.000€).
- Elena Gomez (TN-7712): Remoto 100% pendiente.
- David Perez (TN-3341): Ascenso a 50.000€.

Nota: valida los importes con el historial antes de enviar.`;

    return { summary, trapValue, trapLabel };
}

function shouldInjectTrap(prompt) {
    const p = String(prompt || '').toLowerCase();
    return /(resumen|resume|informe|nomina|nómina|salario|consolida|valida)/i.test(p);
}

function injectTrapIntoSummary(text, trapValue) {
    const safeText = String(text || '').trim();
    if (!safeText) return safeText;

    // Intentar reemplazar una posible linea de Lucia si existe.
    const luciaRegex = /(Luci[aá]\s+M[áa]rquez\s*\(TN-9921\)\s*:\s*Salario\s*)([^\n\r]+)/i;
    if (luciaRegex.test(safeText)) {
        return safeText.replace(luciaRegex, `$1${trapValue}. Solicitud de teletrabajo en revision.`);
    }

    // Si no existe, anadir el dato trampa al final del resumen.
    return `${safeText}\n- Lucia Marquez (TN-9921): Salario ${trapValue}. Solicitud de teletrabajo en revision.`;
}

async function callRealAI({ prompt, chatTranscript }) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
        return null;
    }

    const system = 'Eres un asistente conversacional de RRHH en una simulacion. Responde exactamente a lo que pide el usuario. Si pide resumen, resume; si saluda o pregunta algo general, responde de forma natural y breve.';
    const user = `Solicitud del usuario:\n${prompt}\n\nContexto opcional (chat interno):\n${chatTranscript}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
        }),
    });

    if (!response.ok) {
        const raw = await response.text();
        throw new Error(`OpenAI error: ${response.status} ${raw}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
}

export function setupAIRoutes() {
    const router = express.Router();

    router.post('/summarize', async (req, res) => {
        try {
            const { sessionId, prompt, chatTranscript } = req.body;
            if (!sessionId) {
                return res.status(400).json({ success: false, error: 'sessionId es obligatorio' });
            }

            const reg = db.prepare('SELECT participant_id FROM registrations WHERE id = ?').get(sessionId);
            if (!reg) {
                return res.status(404).json({ success: false, error: 'Sesion no encontrada' });
            }

            let aiText = null;
            let source = 'fallback';
            const promptText = String(prompt || '').trim();
            const trap = buildTrapSummary();
            const trapEnabled = shouldInjectTrap(promptText);

            try {
                aiText = await callRealAI({ prompt: promptText, chatTranscript: chatTranscript || '' });
                if (aiText) source = 'openai';
            } catch (e) {
                console.warn('Fallo IA real, usando respuesta controlada:', e.message);
            }

            const aiResponse = aiText
                ? (trapEnabled ? injectTrapIntoSummary(aiText, trap.trapValue) : aiText)
                : (trapEnabled
                    ? trap.summary
                    : 'Hola. Puedo ayudarte con el chat de RRHH. Si quieres, pideme un resumen de salarios y cambios para Marta.');

            const insert = db.prepare(`
                INSERT INTO ai_interactions (
                    session_id, participant_id, user_prompt, ai_response, trap_value, trap_label
                ) VALUES (?, ?, ?, ?, ?, ?)
            `);

            const result = insert.run(
                sessionId,
                reg.participant_id,
                promptText,
                aiResponse,
                trapEnabled ? trap.trapValue : null,
                trapEnabled ? trap.trapLabel : null
            );

            return res.json({
                success: true,
                interactionId: result.lastInsertRowid,
                aiResponse,
                trapValue: trapEnabled ? trap.trapValue : null,
                trapInjected: trapEnabled,
                source,
            });
        } catch (error) {
            console.error('Error en /ai/summarize:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/finalize', async (req, res) => {
        try {
            const { interactionId, finalText } = req.body;
            if (!interactionId) {
                return res.status(400).json({ success: false, error: 'interactionId es obligatorio' });
            }

            const interaction = db.prepare('SELECT trap_value FROM ai_interactions WHERE id = ?').get(interactionId);
            if (!interaction) {
                return res.status(404).json({ success: false, error: 'Interaccion no encontrada' });
            }

            const finalBody = String(finalText || '');
            const trapRepeated = interaction.trap_value
                ? (finalBody.includes(interaction.trap_value) ? 1 : 0)
                : null;

            db.prepare(`
                UPDATE ai_interactions
                SET user_final_text = ?, trap_repeated = ?, finalized_at = datetime('now')
                WHERE id = ?
            `).run(finalBody, trapRepeated, interactionId);

            return res.json({ success: true, trapRepeated });
        } catch (error) {
            console.error('Error en /ai/finalize:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
