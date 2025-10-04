import { metrics, displayResults } from '../utils/metrics.js';
import { saveMetrics, completeSession } from '../services/api.js';
import { getSessionId } from '../main.js';

export async function finishSimulation(consented) {
    const consentEmail = consented ? document.getElementById('consent-email').value : null;

    if(consented) {
        metrics.consent = consentEmail ? `Consented with email: ${consentEmail}` : 'Consented but provided no email';
    } else {
         metrics.consent = 'Did not consent';
    }

    const sessionId = getSessionId();

    if (sessionId) {
        await saveMetrics(sessionId, metrics);
        await completeSession(sessionId, consentEmail);
        console.log('Metrics saved successfully');
    }

    displayResults();
    window.startScenario(8);
}
