import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

export function saveProfile() {
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

    // Cálculo de la métrica
    const totalOptionalFields = 4; // Ahora son 4 campos opcionales
    const count = disclosedData.length;

    // Guardamos una cadena descriptiva en lugar de solo un número
    // Ej: "2/4 (Teléfono Personal, Redes Sociales Externas)"
    if (count === 0) {
        metrics.scenario5.personal_data_disclosure_rate = '0 (Minimización de datos correcta)';
    } else {
        metrics.scenario5.personal_data_disclosure_rate =
            `${count}/${totalOptionalFields} Revelados: [${disclosedData.join(', ')}]`;
    }

    console.log('Métrica de Privacidad:', metrics.scenario5.personal_data_disclosure_rate);

    // Continuar con el flujo
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario5.personal_data_disclosure_rate': metrics.scenario5.personal_data_disclosure_rate });
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
    metrics.scenario5.third_party_app_authorization = accepted ? 'Accepted excessive permissions' : 'Denied excessive permissions';
    document.getElementById('popup-app-perms').classList.remove('active');
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario5.third_party_app_authorization': metrics.scenario5.third_party_app_authorization });
        } catch (err) {
            console.warn('Failed saving scenario5 app perms metric:', err);
        }
        setTimeout(() => window.startScenario(7), 1000);
    })();
}