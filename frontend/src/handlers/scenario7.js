import { metrics, displayResults } from '../utils/metrics.js';

export function finishSimulation(consented) {
    if(consented) {
        const email = document.getElementById('consent-email').value;
        metrics.consent = email ? `Consented with email: ${email}` : 'Consented but provided no email';
    } else {
         metrics.consent = 'Did not consent';
    }

    displayResults();
    window.startScenario(8);
}
