import { createRegistration, completeRegistration } from '../services/api.js';
import { getPasswordStrength } from '../utils/validation.js';
import { metrics } from '../utils/metrics.js';
//import { saveRegistration, checkUserExists } from '../services/supabase.js';

const passwords = [];
const registrations = {};

function goNext(service) {
    document.getElementById(`lynx-${service}-form`).style.display = 'none';

    if (service === 'mail') {
        // Mostrar el formulario de Drive
        document.getElementById('lynx-drive-form').style.display = 'block';
    } else if (service === 'drive') {
        // Mostrar popup de MFA
        document.getElementById('popup-mfa').classList.add('active');
        // Métrica: ¿reutilizó la contraseña?
        metrics.scenario1.password_reused =
            (passwords[0] === passwords[1] && passwords[0].length > 0) ? 'Yes' : 'No';
        } else if (service === 'events') {
            document.getElementById('popup-passkey').classList.add('active');
        }
    }

export async function registerService(service) {
    const userInput = document.getElementById(`${service}-user`);
    const passInput = document.getElementById(`${service}-pass`);
    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }
    if (!password) {
        alert('Por favor ingresa una contraseña');
        return;
    }

    const serviceName = `lynx_${service}`;

    // 1. Calcula cuántas veces se ha usado ya esta contraseña
    // passwords.filter(p => p === password) crea un array con las contraseñas que coinciden.
    // .length nos da el número de coincidencias.
    const strength = getPasswordStrength(password);
    const reuseCount = passwords.filter(p => p === password).length;
    // 2. Llama a la API enviando el nuevo dato 'reuseCount'
    const { success, session, error } = await createRegistration(username, serviceName, strength, reuseCount);
    metrics.scenario1[`${service}_password_strength`] = strength;
    passwords.push(password);
    if (!success || !session) {
        console.error('createRegistration error:', error);
        alert('Error al crear la cuenta. Por favor, intenta de nuevo.');
        return;
    }
    
    registrations[service] = {
        id: session.id,
        username: username,
        service: serviceName,
        password_strength: strength,
        mfa_enabled: false
    };

    goNext(service);
}


export async function handleMFA(activated) {
    metrics.scenario1.mfa_usage = activated ? 'Yes' : 'No';

    // Si el usuario activa MFA y ya tenemos un registro para 'drive'
    if (activated && registrations['drive']) {
        const sessionId = registrations['drive'].id;
        // Llama a la API para actualizar el registro y marcar mfa_enabled = true
        await completeRegistration(sessionId, { mfaEnabled: true });
        console.log('MFA state updated for Lynx Drive via API.');
    }

    // Oculta el popup y muestra el siguiente formulario
    document.getElementById('popup-mfa').classList.remove('active');
    document.getElementById('lynx-events-form').style.display = 'block';
}

export function handlePasskey(activated) {
    metrics.scenario1.passkey_adoption_rate = activated ? 'Accepted' : 'Rejected';
    document.getElementById('popup-passkey').classList.remove('active');

    showRegistrationComplete();
}

function showRegistrationComplete() {
    const mailUsername = registrations['mail']?.username || '-';
    const driveUsername = registrations['drive']?.username || '-';
    const eventsUsername = registrations['events']?.username || '-';

    document.getElementById('mail-username').textContent = mailUsername;
    document.getElementById('drive-username').textContent = driveUsername;
    document.getElementById('events-username').textContent = eventsUsername;

    const firstUsername = mailUsername !== '-' ? mailUsername : (driveUsername !== '-' ? driveUsername : eventsUsername);
    const firstInitial = firstUsername !== '-' ? firstUsername[0].toUpperCase() : 'U';

    document.getElementById('profile-display-name').textContent = firstUsername;
    document.getElementById('profile-display-email').textContent = `${firstUsername}@lynx.com`;

    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.textContent = firstInitial;
    }

    document.getElementById('popup-registration-complete').classList.add('active');
}

export function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown-menu');
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

export function closeRegistrationComplete() {
    document.getElementById('popup-registration-complete').classList.remove('active');
    window.startScenario(2);
}