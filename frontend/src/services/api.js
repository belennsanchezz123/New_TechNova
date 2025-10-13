const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

//Importación de funciones que usamos
import { getParticipantId } from '../utils/participant.js';

/**
 * Crea/recupera un registro (idempotente) para un servicio y usuario,
 * enviando participantId para trazabilidad.
 */
export async function createRegistration(username, serviceName) {
    const participantId = getParticipantId();
    const res = await fetch(`${API_URL}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
            userIdentifier: username,
            service: serviceName,  // 'lynx_mail' | 'lynx_drive' | 'lynx_events'
            participantId
        })
    });
    return res.json();
}

/**
 * Completa/actualiza un registro por id.
 * Úsalo p.ej. para marcar MFA, o anotar consentimiento.
 */
export async function completeRegistration(sessionId, patch = {}) {
    const res = await fetch(`${API_URL}/sessions/complete`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ sessionId, ...patch })
    });
    return res.json();
}

/**
 * Lista todos los registros (debug / admin UI).
 */
export async function getAllRegistrations() {
    const res = await fetch(`${API_URL}/sessions/all`);
    return res.json();
}

//Borrador funciones que no uso

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


//Funcion comentada en el backed
export async function saveMetrics(sessionId, metrics) {
    try {
        const response = await fetch(`${API_URL}/sessions/metrics`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sessionId, metrics })
            });
            return await response.json();
        }  catch (error) {
        console.error('Error saving metrics:', error);
        return { success: false, error: error.message };
    }
}


// Registra el alta de un servicio (mail / drive / events) con fuerza de contraseña
export async function registerServiceMetrics(sessionId, { service, username, password_strength }) {
    return saveMetrics(sessionId, {
        event: 'register_service',
        service,           // 'mail' | 'drive' | 'events'
        username,
        password_strength, // 'weak' | 'medium' | 'strong'
        ts: Date.now()
    });
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
        console.error('Error completing session:', error);
        return { success: false, error: error.message };
    }
}

