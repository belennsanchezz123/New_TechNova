import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

let aiGeneratedText = "";
let startTime = 0;
let userEdited = false;
let aiWasUsed = false; // Variable para proactividad

export function handleAIInput() {
    userEdited = true;
}

export function useAI() {
    window.aiWasUsed = true;
    const bodyField = document.getElementById('ai-editor-body');

    // El informe sale limpio, pero con la alucinación de Lucía Márquez (200.000€)
    const summary = `RESUMEN DE VALIDACIÓN Q4 (TechNova):
- Carlos Ruiz (TN-4482): 55.000€ + 12% bonus. Turno mañana (8-15) OK.
- Lucía Márquez (TN-9921): Salario 200.000€. Solicitud de teletrabajo aceptada.
- Javier Ochoa (TN-1102): Salario 32.000€. Petición de subida a 35.000€ bajo revisión.
- Maria Garcia (TN-2231): Ajuste a 45.000€ (desde 42k).
- Elena Gomez (TN-7712): Remoto 100% (Pendiente).
- David Perez (TN-3341): Ascenso a 50.000€.
--------------------------------------------------
Datos consolidados a partir del historial de chat.`;

    bodyField.value = summary;
    window.aiStartTime = Date.now();
    window.userEdited = false;
    document.getElementById('ai-status-msg').innerHTML = "<span style='color:blue'>🤖 IA: Información extraída y formateada.</span>";
}


export async function sendAIReport() {
    const sid = getSessionId();
    const currentBody = document.getElementById('ai-editor-body').value;
    const duration = aiWasUsed ? (Date.now() - startTime) / 1000 : 0;

    // Detección de Fuga de Datos (Shadow AI)
    const sensitiveTerms = ["TN-4482", "TN-9921", "TN-1102", "32.000€"];
    const shadowAI = sensitiveTerms.some(term => currentBody.includes(term));

    // Detección de Alucinación (No corrigió los 200.000€)
    const hallucinationAccepted = currentBody.includes("200.000");

    const metricsIA = {
        'scenario9.proactive_ai_usage': aiWasUsed ? 'Yes' : 'No',
        'scenario9.shadow_ai_leak': shadowAI ? 'High' : 'None',
        'scenario9.blind_trust': (aiWasUsed && duration < 8 && !userEdited) ? 'Yes' : 'No',
        'scenario9.hallucination_detected': !hallucinationAccepted ? 'Yes' : 'No',
        'scenario9.reaction_time': duration.toFixed(2)
    };

    try {
        if (sid) {
            await saveMetrics(sid, metricsIA);
            console.log("✅ Métricas IA enviadas:", metricsIA);
        }
        alert("✅ Informe enviado a RRHH.");
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