import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

export function saveProfile() {
    const fullNameInput = document.getElementById('prof-fullname');

    const fullName = fullNameInput?.value?.trim() || '';

    if (!fullName) {
        window.showDialog('Debes completar el campo Nombre Completo antes de guardar el perfil.', 'Campo requerido', 'error');
        if (!fullName && fullNameInput) {
            fullNameInput.focus();
            return;
        }
        return;
    }

    // Array para guardar los nombres de los datos sensibles revelados
    const disclosedData = [];

    // 1. Fecha de Nacimiento (Riesgo: Ingeniería Social / Contraseñas)
    const dobInput = document.getElementById('prof-dob');
    if (dobInput && dobInput.value.trim() !== '') {
        disclosedData.push('Fecha de Nacimiento');
    }

    // 2. Teléfono Personal (Riesgo: Smishing / Contacto no deseado)
    const phoneInput = document.getElementById('prof-phone');
    if (phoneInput && phoneInput.value.trim() !== '') {
        disclosedData.push('Teléfono Personal');
    }

    // 3. Ciudad de Residencia (Riesgo: Ubicación física)
    const cityInput = document.getElementById('prof-city');
    if (cityInput && cityInput.value.trim() !== '') {
        disclosedData.push('Ciudad de Residencia');
    }

    // 4. Redes Sociales (Riesgo: Perfilado externo / Scraping)
    // (Este campo reemplaza al antiguo 'Workplace' para más realismo)
    const socialInput = document.getElementById('prof-social');
    if (socialInput && socialInput.value.trim() !== '') {
        disclosedData.push('Redes Sociales Externas');
    }

    // 5. Email Personal (Riesgo: Phishing / Suplantación)
    const personalEmailInput = document.getElementById('prof-personal-email');
    if (personalEmailInput && personalEmailInput.value.trim() !== '') {
        disclosedData.push('Email Personal');
    }

    // 6. Compartir ubicación en tiempo real (Riesgo: exposición de ubicación)
    const liveLocationCheckbox = document.getElementById('prof-live-location');
    if (liveLocationCheckbox && liveLocationCheckbox.checked) {
        disclosedData.push('Ubicación en tiempo real');
    }

    // Cálculo de la métrica
    const totalOptionalFields = 6; // Ahora son 6 campos opcionales
    const count = disclosedData.length;

    // Guardamos una cadena descriptiva en lugar de solo un número
    // Ej: "2/4 (Teléfono Personal, Redes Sociales Externas)"
    if (count === 0) {
        metrics.scenario6.personal_data_disclosure_rate = '0 (Minimización de datos correcta)';
    } else {
        metrics.scenario6.personal_data_disclosure_rate =
            `${count}/${totalOptionalFields} Revelados: [${disclosedData.join(', ')}]`;
    }

    console.log('Métrica de Privacidad:', metrics.scenario6.personal_data_disclosure_rate);

    // Continuar con el flujo
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario6.personal_data_disclosure_rate': metrics.scenario6.personal_data_disclosure_rate });
        } catch (err) {
            console.warn('Failed saving scenario5 metric:', err);
        }
        document.getElementById('profile-task').style.display = 'none';
        document.getElementById('app-task').style.display = 'block';
    })();
}

export function connectApp() {
    document.getElementById('popup-app-perms').classList.add('active');
}

export function handleAppPerms(accepted) {
    metrics.scenario6.third_party_app_authorization = accepted ? 'Accepted excessive permissions' : 'Denied excessive permissions';
    document.getElementById('popup-app-perms').classList.remove('active');
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario6.third_party_app_authorization': metrics.scenario6.third_party_app_authorization });
        } catch (err) {
            console.warn('Failed saving scenario5 app perms metric:', err);
        }
        setTimeout(() => window.startScenario(7), 1000);
    })();
}