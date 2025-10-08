const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
/* ------------------ Nuevas utilidades de comportamiento ------------------ */

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