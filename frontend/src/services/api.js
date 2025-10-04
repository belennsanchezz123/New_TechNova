const API_URL = 'http://localhost:3000/api';

export async function startSession(userIdentifier) {
    try {
        const response = await fetch(`${API_URL}/sessions/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIdentifier })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error starting session:', error);
        return { success: false, error: error.message };
    }
}

export async function saveMetrics(sessionId, metrics) {
    try {
        const response = await fetch(`${API_URL}/sessions/metrics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId, metrics })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving metrics:', error);
        return { success: false, error: error.message };
    }
}

export async function completeSession(sessionId, consentEmail) {
    try {
        const response = await fetch(`${API_URL}/sessions/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId, consentEmail })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error completing session:', error);
        return { success: false, error: error.message };
    }
}
