// frontend/src/services/api.js
const API_URL = '/api';
import { getParticipantId } from '../utils/participant.js';

async function parseApiResponse(response) {
    const raw = await response.text();

    let data = null;
    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`;
        return {
            success: false,
            error: data?.error || raw || fallbackError,
            status: response.status
        };
    }

    return data || { success: true };
}

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
        return await parseApiResponse(response);
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
        return await parseApiResponse(res);
    } catch (error) {
        console.error('Error in createRegistration:', error);
        return { success: false, error: error.message };
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
        return await parseApiResponse(response);
    } catch (error) {
        console.error('Error en saveMetrics:', error);
        return { success: false, error: error.message };
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
        return await parseApiResponse(res);
    } catch (error) {
        console.error('Error in completeRegistration:', error);
        return { success: false, error: error.message };
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
        return await parseApiResponse(response);
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
        return await parseApiResponse(response);
    } catch (error) {
        console.error('Error al completar sesión:', error);
        return { success: false, error: error.message };
    }
}