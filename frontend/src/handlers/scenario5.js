import { saveMetrics, summarizeWithAI, finalizeAIInteraction } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

let aiGeneratedText = '';
let aiStartTimeMs = 0;
let userEdited = false;
let aiWasUsed = false;
let currentInteractionId = null;
let lastUserPrompt = '';
let lastTrapValue = null;

export function handleAIInput() {
    userEdited = true;
}

function getScenario5ChatTranscript() {
    const chat = document.getElementById('raw-chat-data');
    return chat ? chat.innerText.trim() : '';
}

export async function useAI() {
    const bodyField = document.getElementById('ai-editor-body');
    const promptInput = document.getElementById('ai-prompt-input');
    const chatLog = document.getElementById('ai-chat-log');
    const sid = getSessionId();
    if (!bodyField || !sid || !promptInput) {
        window.showDialog('No se pudo iniciar la asistencia de IA (sesión no disponible).', 'Error', 'error');
        return;
    }

    const promptText = promptInput.value.trim();
    if (!promptText) {
        window.showDialog('Escribe primero tu mensaje para el asistente IA.', 'Asistente IA', 'info');
        return;
    }

    const status = document.getElementById('ai-status-msg');
    if (status) {
        status.innerHTML = "<span style='color:#666'>⏳ IA: procesando solicitud...</span>";
    }

    const result = await summarizeWithAI({
        sessionId: sid,
        prompt: promptText,
        chatTranscript: '',
    });

    if (!result?.success) {
        if (status) {
            status.innerHTML = "<span style='color:#b00020'>No se pudo generar el resumen con IA.</span>";
        }
        window.showDialog(`Error IA: ${result?.error || 'desconocido'}`, 'Error', 'error');
        return;
    }

    aiWasUsed = true;
    aiStartTimeMs = Date.now();
    userEdited = false;
    currentInteractionId = result.interactionId || null;
    lastUserPrompt = promptText;
    lastTrapValue = result.trapValue || null;
    aiGeneratedText = result.aiResponse || '';
    const sourceLabel = result.source === 'openai' ? 'OpenAI real' : 'fallback controlado';

    bodyField.value = aiGeneratedText;
    if (chatLog) {
        chatLog.innerHTML = `
            <div style="margin-bottom:8px;"><strong>Tú:</strong> ${promptText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <div><strong>Asistente (${sourceLabel}):</strong><br>${aiGeneratedText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
        `;
    }
    if (status) {
        status.innerHTML = `<span style='color:blue'>🤖 IA (${sourceLabel}): resumen generado. Revisa antes de enviar.</span>`;
    }
}


export async function sendAIReport() {
    const sid = getSessionId();
    const currentBody = document.getElementById('ai-editor-body')?.value || '';
    const duration = aiWasUsed ? (Date.now() - aiStartTimeMs) / 1000 : 0;

    let trapRepeated = null;
    if (aiWasUsed && currentInteractionId) {
        const finalizeRes = await finalizeAIInteraction({
            interactionId: currentInteractionId,
            finalText: currentBody,
        });
        if (finalizeRes?.success) {
            trapRepeated = finalizeRes.trapRepeated;
        }
    }

    const metricsIA = {
        'scenario5.ai_used': aiWasUsed ? 'Yes' : 'No',
        'scenario5.ai_prompt_text': lastUserPrompt || null,
        'scenario5.ai_trap_value': lastTrapValue || null,
        'scenario5.ai_trap_repeated': trapRepeated === null || trapRepeated === undefined
            ? null
            : (trapRepeated ? 'Yes' : 'No'),
        'scenario5.ai_user_edited': aiWasUsed ? (userEdited ? 'Yes' : 'No') : null,
        'scenario5.ai_reaction_time_seconds': aiWasUsed ? duration.toFixed(2) : null,
    };

    try {
        if (sid) {
            await saveMetrics(sid, metricsIA);
            console.log("✅ Métricas IA enviadas:", metricsIA);
        }
        window.showDialog('Informe enviado correctamente a RRHH.', 'Enviado', 'success');
        if (window.startScenario) window.startScenario(6);
    } catch (err) {
        console.error("Error al guardar métricas IA:", err);
    }
}

export function showMartaMessage() {
    // Verificar si ya se ha visto en esta sesión
    if (sessionStorage.getItem('marta_msg_seen') === 'true') {
        return;
    }

    setTimeout(() => {
        const popup = document.getElementById('popup-marta-msg');
        if (popup) {
            popup.classList.add('active');
            // Reproducir sonido de notificación si es posible
            // const audio = new Audio('/assets/sounds/teams_notify.mp3');
            // audio.play().catch(e => console.log('Audio autoplay blocked'));
        }
    }, 1500); // Pequeño retraso para realismo
}

window.closeMartaMessage = function () {
    const popup = document.getElementById('popup-marta-msg');
    if (popup) {
        popup.classList.remove('active');
        sessionStorage.setItem('marta_msg_seen', 'true'); // Marcar como visto para siempre
    }
};