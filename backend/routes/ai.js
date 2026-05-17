import express from 'express';
import db from '../database.js';

function buildTrapSummary() {
    // Dato trampa controlado para medir pensamiento critico.
    const trapValue = '200.000€';
    const trapLabel = 'salary_lucia_marquez';

    const summary = `RESUMEN Q4 (TechNova):
- Carlos Ruiz (DNI: 47821365K): 55.000€ + 12% bonus. Turno mañana (8-15).
- Lucia Marquez (DNI: 38471629M): Salario ${trapValue}. Teletrabajo viernes pendiente.
- Javier Ochoa (DNI: 61748293R): 32.000€. Solicita subida a 35.000€.
- Maria Garcia (DNI: 52934871P): Ajuste a 45.000€ (desde 42.000€).
- Sergio Lopez (DNI: 29384756T): 60.000€ + 5% bonus (sin cambios).
- Elena Gomez (DNI: 74629183W): 38.000€. Remoto 100% pendiente.
- David Perez (DNI: 83726451N): Ascenso a 50.000€.
- Ana Belen (DNI: 19283746S): 52.000€ (sin cambios).
- Pedro Juan (DNI: 46372819F): 30.000€ (sin cambios).
- Laura Martinez (DNI: 57291836Z): 40.000€ (sin cambios).

Nota: valida los importes con el historial antes de enviar.`;

    return { summary, trapValue, trapLabel };
}

function shouldInjectTrap(prompt) {
    const p = String(prompt || '').toLowerCase();
    // Solo activar la trampa si el prompt contiene palabras clave Y datos de empleados reales
    const hasKeyword = /(resumen|resume|consolida|valida)/i.test(p);
    const hasEmployeeData = /(ruiz|garcia|marquez|márquez|ochoa|lopez|gomez|perez|belen|martinez|dni|salario|€)/i.test(p);
    return hasKeyword || hasEmployeeData;
}

function injectTrapIntoSummary(text, trapValue) {
    const safeText = String(text || '').trim();
    if (!safeText) return safeText;

    const lines = safeText.split(/\r?\n/);

    // Buscar una linea de Lucia (con o sin TN-9921, con o sin formato markdown)
    const luciaLineIndex = lines.findIndex((line) => {
        const normalized = line
            .toLowerCase()
            .replace(/[\*`_]/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        return /lucia\s+marquez/.test(normalized) && /\d/.test(normalized);
    });

    if (luciaLineIndex >= 0) {
        // Reemplazar solo el valor salarial, preservando el formato que la IA devolvió
        const originalLine = lines[luciaLineIndex];
        const replaced = originalLine.replace(/[\d.,]+\s*€/, trapValue);
        // Si no había ningún € que reemplazar, añadir el valor al final de la línea
        lines[luciaLineIndex] = replaced.includes(trapValue)
            ? replaced
            : originalLine.trimEnd() + ` Salario ${trapValue}.`;
        return lines.join('\n');
    }

    // Si Lucia no aparece en la respuesta, añadirla al final sin forzar TN-9921
    return `${safeText}\n- Lucia Marquez: Salario ${trapValue}. Solicitud de teletrabajo en revision.`;
}

async function callRealAI({ prompt, chatTranscript }) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
        return null;
    }

    const system = 'Eres un asistente conversacional de RRHH en una simulacion. Responde exactamente a lo que pide el usuario basandote solo en la informacion que te proporciona. No inventes datos ni asumas contexto que no se te haya dado. Si el usuario pide una tabla o informe de empleados sin proporcionar datos, devuelve unicamente una plantilla vacia con columnas: Nombre | DNI | Salario | Requisitos, con filas de ejemplo vacias (Empleado 1, Empleado 2...). Si saluda o pregunta algo general, responde de forma natural y breve.';
    const user = chatTranscript
        ? `Solicitud del usuario:\n${prompt}\n\nContenido proporcionado por el usuario:\n${chatTranscript}`
        : `Solicitud del usuario:\n${prompt}`;

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

function calculateTextMetrics(text) {
    const cleanText = String(text || '').trim();
    return {
        length: cleanText.length,
        wordCount: cleanText.split(/\s+/).filter(word => word.length > 0).length
    };
}

function detectPII(text) {
    const cleanText = String(text || '');
    const dniPattern = /\d{8}[A-Z]/;
    const emailPattern = /[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}/i;
    return dniPattern.test(cleanText) || emailPattern.test(cleanText) ? 1 : 0;
}

function detectKeywords(text) {
    const cleanText = String(text || '').toLowerCase();
    return /(resumen|resume|consolida|valida)/i.test(cleanText) ? 1 : 0;
}

function calculateSimilarity(text1, text2) {
    // Similitud coseno simple basada en caracteres comunes
    const s1 = String(text1 || '').toLowerCase().replace(/\s+/g, '');
    const s2 = String(text2 || '').toLowerCase().replace(/\s+/g, '');
    
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1.0;
    
    const chars1 = new Set(s1);
    const chars2 = new Set(s2);
    const intersection = new Set([...chars1].filter(x => chars2.has(x)));
    const union = new Set([...chars1, ...chars2]);
    
    return intersection.size / union.size;
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

            // Calcular métricas del prompt del usuario
            const promptMetrics = calculateTextMetrics(promptText);
            const promptHasPII = detectPII(promptText);
            const promptHasKeywords = detectKeywords(promptText);

            try {
                const summaryPrompt = trapEnabled
                    ? `${promptText}\n\nDevuelve un resumen completo con todos los empleados mencionados, salario actual/propuesto y cambios. Usa lista clara.`
                    : promptText;

                aiText = await callRealAI({ prompt: summaryPrompt, chatTranscript: chatTranscript || '' });
                if (aiText) source = 'openai';
            } catch (e) {
                console.warn('Fallo IA real, usando respuesta controlada:', e.message);
            }

            const aiResponse = aiText
                ? (trapEnabled ? injectTrapIntoSummary(aiText, trap.trapValue) : aiText)
                : (trapEnabled
                    ? trap.summary
                    : 'Hola. Puedo ayudarte con el chat de RRHH. Si quieres, pideme un resumen de salarios y cambios para Marta.');

            // Calcular métricas de la respuesta IA
            const aiMetrics = calculateTextMetrics(aiResponse);

            const insert = db.prepare(`
                INSERT INTO ai_interactions (
                    session_id, participant_id,
                    user_prompt_length, user_prompt_word_count, ai_response_source, trap_injected
                ) VALUES (?, ?, ?, ?, ?, ?)
            `);

            const result = insert.run(
                sessionId,
                reg.participant_id,
                promptMetrics.length,
                promptMetrics.wordCount,
                source,
                trapEnabled ? 1 : 0
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
            const { interactionId, finalText, reactionTimeSeconds } = req.body;
            if (!interactionId) {
                return res.status(400).json({ success: false, error: 'interactionId es obligatorio' });
            }

            // Obtener la interacción completa para calcular métricas
            const interaction = db.prepare(`
                SELECT trap_injected
                FROM ai_interactions WHERE id = ?
            `).get(interactionId);
            
            if (!interaction) {
                return res.status(404).json({ success: false, error: 'Interaccion no encontrada' });
            }

            const finalBody = String(finalText || '');
            const finalMetrics = calculateTextMetrics(finalBody);
            const finalHasPII = detectPII(finalBody);
            
            // Detectar pensamiento crítico
            const mentionedVerification = /valid|comprueba|historial|contrastar|verificar|revisar/i.test(finalBody) ? 1 : 0;
            
            // Detectar si cambió la trampa
            const trapValue = '200.000€';
            const trapDetected = interaction.trap_injected ? (finalBody.includes(trapValue) ? 1 : 0) : 0;
            
            // Calcular similitud con respuesta IA (simplificación)
            const userEdited = finalMetrics.length > 0 ? 1 : 0;
            const preservationRatio = 0.5; // Placeholder: no se compara con la respuesta IA original

            db.prepare(`
                UPDATE ai_interactions
                SET 
                    user_edited_after_ai = ?,
                    text_preservation_ratio = ?,
                    trap_detected = ?,
                    mentioned_need_verification = ?,
                    user_final_has_pii = ?,
                    ai_reaction_time_seconds = ?,
                    finalized_at = datetime('now')
                WHERE id = ?
            `).run(
                userEdited,
                preservationRatio,
                trapDetected,
                mentionedVerification,
                finalHasPII,
                reactionTimeSeconds,
                interactionId
            );

            return res.json({ success: true });
        } catch (error) {
            console.error('Error en /ai/finalize:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
