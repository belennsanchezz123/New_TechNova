// frontend/src/services/api.js
const API_URL = 'http://127.0.0.1:3000/api';
import { getParticipantId } from '../utils/participant.js';

/**
 * Inicia la sesión global al aceptar las políticas.
 * Vincula el P00x al inicio del experimento.
 */
export async function startSession(userIdentifier) {
    try {
        const response = await fetch(`${API_URL}/sessions/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userIdentifier })
        });
        return await response.json();
    } catch (error) {
        console.error('Error starting session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Crea o actualiza un registro de servicio (mail, drive, events).
 * Reutiliza la sesión activa del participante.
 */
export async function createRegistration(username, serviceName, passwordStrength, passwordReuseCount) {
    const participantId = getParticipantId();
    try {
        const res = await fetch(`${API_URL}/sessions/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userIdentifier: username,
                service: serviceName, 
                participantId: participantId,
                passwordStrength, 
                passwordReuseCount
            })
        });
        return await res.json();
    } catch (error) {
        console.error('Error in createRegistration:', error);
        return { success: false };
    }
}

/**
 * FUNCIÓN ÚNICA UNIVERSAL PARA MÉTRICAS
 * Guarda cualquier objeto de métricas (Wi-Fi, Passwords, clics, etc.)
 */
export async function saveMetrics(sessionId, metricsObject) {
    if (!sessionId) {
        console.error('saveMetrics: No hay sessionId activo.');
        return { success: false };
    }

    try {
        const response = await fetch(`${API_URL}/sessions/metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionId: sessionId, 
                metrics: metricsObject 
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log(`%c✅ Métricas guardadas [SID: ${sessionId}]`, "color: green; font-weight: bold;");
            console.table(metricsObject); // Log visual para confirmar qué se envió
        }
        return data;
    } catch (error) {
        console.error('Error en saveMetrics:', error);
        return { success: false };
    }
}

/**
 * Actualiza estados de la sesión (MFA, completado, etc.)
 */
export async function completeRegistration(sessionId, patch = {}) {
    try {
        const res = await fetch(`${API_URL}/sessions/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, ...patch })
        });
        return await res.json();
    } catch (error) {
        console.error('Error in completeRegistration:', error);
        return { success: false };
    }
}

/**
 * Guarda los resultados del cuestionario final
 */
export async function saveQuestionnaire(questionnaireData) {
    try {
        const response = await fetch(`${API_URL}/questionnaire/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionnaireData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error al guardar el cuestionario:', error);
        throw error;
    }
}

/**
 * Finaliza la sesión anotando el correo de consentimiento (si existe)
 */
export async function completeSession(sessionId, consentEmail) {
    try {
        const response = await fetch(`${API_URL}/sessions/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, consentEmail })
        });
        return await response.json();
    } catch (error) {
        console.error('Error al completar sesión:', error);
        return { success: false };
    }
}