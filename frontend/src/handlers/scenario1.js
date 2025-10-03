import { metrics } from '../utils/metrics.js';
import { getPasswordStrength } from '../utils/validation.js';

const passwords = [];

export function registerService(service) {
    const passInput = document.getElementById(`${service}-pass`);
    const password = passInput.value;
    const strength = getPasswordStrength(password);

    metrics.scenario1[`${service}_password_strength`] = strength;
    passwords.push(password);

    document.getElementById(`${service}-form`).style.display = 'none';

    if (service === 'mail') {
        document.getElementById('lynx-drive-form').style.display = 'block';
    } else if (service === 'drive') {
        document.getElementById('popup-mfa').classList.add('active');
        metrics.scenario1.password_reused = (passwords[0] === passwords[1] && passwords[0].length > 0) ? 'Yes' : 'No';
    } else if (service === 'events') {
         document.getElementById('popup-passkey').classList.add('active');
    }
}

export function handleMFA(activated) {
    metrics.scenario1.mfa_usage = activated ? 'Yes' : 'No';
    document.getElementById('popup-mfa').classList.remove('active');
    document.getElementById('lynx-events-form').style.display = 'block';
}

export function handlePasskey(activated) {
    metrics.scenario1.passkey_adoption_rate = activated ? 'Accepted' : 'Rejected';
    document.getElementById('popup-passkey').classList.remove('active');
    window.startScenario(2);
}
