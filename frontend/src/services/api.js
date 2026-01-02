// frontend/src/services/api.js
const API_URL = 'http://127.0.0.1:3000/api';
import { getParticipantId } from '../utils/participant.js';

/**
 * NUEVA: Inicia la sesión global al aceptar las políticas.
 * Envía el identificador (P00x) al backend.
 */
export async function startSession(userIdentifier) {
    try {
        const response = await fetch(`${API_URL}/sessions/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIdentifier })
        });
        return await response.json();
    } catch (error) {
        console.error('Error starting session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * MODIFICADA: Ahora usa la sesión que ya existe para actualizar los datos del servicio.
 * Si no hay sessionId previo, el backend lo gestionará con el participantId.
 */
export async function createRegistration(username, serviceName, passwordStrength, passwordReuseCount) {
    const participantId = getParticipantId();
    // Intentamos enviar tanto el nombre de usuario como el participantId 
    // para que el backend sepa que es la misma persona.
    const res = await fetch(`${API_URL}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
            userIdentifier: username,
            service: serviceName, 
            participantId,
            passwordStrength, 
            passwordReuseCount
        })
    });
    return res.json();
}

/**
 * Guarda métricas vinculadas a un sessionId.
 * Se asegura de que los datos lleguen al Admin Dashboard.
 */
export async function saveMetrics(sessionId, metrics) {
    if (!sessionId) {
        console.warn('saveMetrics: No sessionId provided, metrics will not be saved.');
        return { success: false };
    }

    try {
        const response = await fetch(`${API_URL}/sessions/metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, metrics })
        });
        
        const data = await response.json();
        console.log('Métricas guardadas con éxito:', data);
        return data;
    } catch (error) {
        console.error('Error al guardar métricas:', error);
        return { success: false, error: error.message };
    }
}

/**
 * El resto de tus funciones se mantienen igual
 */
export async function completeRegistration(sessionId, patch = {}) {
    const res = await fetch(`${API_URL}/sessions/complete`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ sessionId, ...patch })
    });
    return res.json();
}

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

export async function completeSession(sessionId, consentEmail) {
    try {
        const response = await fetch(`${API_URL}/sessions/complete`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sessionId, consentEmail })
        });
        return await response.json();
    } catch (error) {
        console.error('Error al completar sesión:', error);
        return { success: false };
    }
}

export async function registerServiceMetrics(sessionId, { service, username, password_strength }) {
    return saveMetrics(sessionId, {
        [`scenario1.${service}_user`]: username,
        [`scenario1.${service}_password_strength`]: password_strength,
        [`scenario1.${service}_registration_ts`]: new Date().toISOString()
    });
}