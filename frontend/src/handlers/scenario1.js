import { createRegistration } from '../services/api.js';
import { getPasswordStrength } from '../utils/validation.js';
import { metrics } from '../utils/metrics.js';
//import { saveRegistration, checkUserExists } from '../services/supabase.js';

const passwords = [];
const registrations = {};

function goNext(service) {
    const current = document.getElementById(`lynx-${service}-form`);
    if (current) current.style.display = 'none';

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
        // Mostrar popup de passkey
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

    //insertar funcion de fortaleza de contraseña
    const strength = getPasswordStrength(password);

    metrics.scenario1[`${service}_password_strength`] = strength;
    passwords.push(password);

    // Crea o recupera el registro (idempotente) — participant_id se envía desde api.js
    const { success, session, created, error } = await createRegistration(username, serviceName);
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

/*
export async function handleMFA(activated) {
    metrics.scenario1.mfa_usage = activated ? 'Yes' : 'No';

    if (activated && registrations['drive']) {
        registrations['drive'].mfa_enabled = true;

        await saveRegistration(
            registrations['drive'].username,
            registrations['drive'].service,
            registrations['drive'].password_strength,
            true
        );

        console.log('MFA activado para Lynx Drive');
    }

    document.getElementById('popup-mfa').classList.remove('active');
    document.getElementById('lynx-events-form').style.display = 'block';
}

export function handlePasskey(activated) {
    metrics.scenario1.passkey_adoption_rate = activated ? 'Accepted' : 'Rejected';
    document.getElementById('popup-passkey').classList.remove('active');
    window.startScenario(2);
}
//Modificarlo para que funcione con lo de participante id
*/