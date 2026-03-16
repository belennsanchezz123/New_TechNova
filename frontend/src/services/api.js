// frontend/src/services/api.js
const API_URL = '/api';
import { getParticipantId } from '../utils/participant.js';
import { getSessionId } from '../utils/session.js';

/**
 * Inicia la sesión global al aceptar las políticas.
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
 */
export async function createRegistration(username, serviceName, passwordStrength, passwordReuseCount) {
    const participantId = getParticipantId();
    const sessionId = getSessionId();
    try {
        const res = await fetch(`${API_URL}/sessions/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
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
 * Guarda cualquier objeto de métricas.
 */
export async function saveMetrics(sessionId, metricsObject) {
    if (!sessionId) return { success: false };

    try {
        const response = await fetch(`${API_URL}/sessions/metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, metrics: metricsObject })
        });
        return await response.json();
    } catch (error) {
        console.error('Error en saveMetrics:', error);
        return { success: false };
    }
}

/**
 * Actualiza estados de la sesión.
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
 * Guarda los resultados del cuestionario final.
 */
export async function saveQuestionnaire(questionnaireData) {
    try {
        const response = await fetch(`${API_URL}/questionnaire/submit`, {
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
 * Finaliza la sesión anotando el correo de consentimiento.
 */
export async function completeSession(sessionId, consentEmail = null) {
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