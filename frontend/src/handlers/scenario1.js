import { createRegistration, completeRegistration, saveMetrics } from '../services/api.js';
import { getPasswordStrength, getLevenshteinDistance } from '../utils/validation.js';
import { metrics } from '../utils/metrics.js';
import { getParticipantId } from '../utils/participant.js';
import { getSessionId, setSessionId } from '../utils/session.js';

let isEventsRegistrationComplete = false;
const passwords = [];
const registrations = {};

function goNext(service) {
    const currentForm = document.getElementById(`technova-${service}-form`);

    if (currentForm) {
        currentForm.style.display = 'none';
    } else {
        console.error(`Error: No se encontró el formulario con ID: technova-${service}-form.`);
    }

    if (service === 'mail') {
        const driveForm = document.getElementById('technova-drive-form');
        if (driveForm) driveForm.style.display = 'block';
    } else if (service === 'drive') {
        document.getElementById('popup-mfa').classList.add('active');
        metrics.scenario1.password_reused =
            (passwords[0] === passwords[1] && passwords[0].length > 0) ? 'Yes' : 'No';
    } else if (service === 'events') {
        localStorage.setItem('sc1_completed', 'true');
        document.getElementById('popup-passkey').classList.add('active');
    }
}

export async function registerService(service) {
    const pid = getParticipantId();
    if (!pid) {
        alert('Por favor, introduce el ID de Participante antes de empezar.');
        return;
    }

    const userInput = document.getElementById(`${service}-user`);
    const passInput = document.getElementById(`${service}-pass`);
    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
        alert('Por favor ingresa usuario y contraseña');
        return;
    }

    const serviceName = `technova_${service}`;
    const strength = getPasswordStrength(password);
    const reuseCount = passwords.filter(p => p === password).length;
    
    // 1. Crear registro en DB
    const { success, session, error } = await createRegistration(username, serviceName, strength, reuseCount);

    if (!success || !session) {
        console.error('createRegistration error:', error);
        alert('Error al crear la cuenta.');
        return;
    }

    const sid = session.sessionId || session.id;
    passwords.push(password);
    
    registrations[service] = {
        id: sid,
        username: username,
        service: serviceName,
        password_strength: strength
    };

    // --- ENVÍO DE MÉTRICAS UNIFICADO ---
    try {
        const currentSid = getSessionId() || sid;

        // A. Enviar Wi-Fi solo una vez
        if (!localStorage.getItem('wifi_sent')) {
            await saveMetrics(currentSid, { 
                'scenario1.wifi_network_choice': metrics.scenario2.wifi_network_choice,
                'scenario1.initial_step': 'initial_connection'
            });
            localStorage.setItem('wifi_sent', 'true');
        }

        // B. Enviar datos del servicio actual (Mail, Drive o Events)
        await saveMetrics(currentSid, { 
            [`scenario1.${service}_user`]: username, 
            [`scenario1.${service}_password_strength`]: strength 
        });

        console.log(`✅ Métricas de ${service} enviadas.`);

    } catch (err) {
        console.warn('Error al guardar las métricas:', err);
    }

    // Asegurar que el ID de sesión esté guardado globalmente
    if (!getSessionId()) {
        setSessionId(sid);
    }

    if (service === 'events') {
        isEventsRegistrationComplete = true;
    }

    goNext(service);
}

export async function handleMFA(activated) {
    metrics.scenario1['scenario1.mfa_usage'] = activated ? 'Yes' : 'No';

    if (activated && registrations['drive']) {
        const sessionId = registrations['drive'].id;
        await completeRegistration(sessionId, { mfaEnabled: true });
    }

    document.getElementById('popup-mfa').classList.remove('active');
    
    const eventsForm = document.getElementById('technova-events-form');
    if (eventsForm) eventsForm.style.display = 'block';
}

export function handlePasskey(activated) {
    metrics.scenario1['scenario1.passkey_adoption_rate'] = activated ? 'Accepted' : 'Rejected';
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
    
    document.getElementById('profile-display-name').textContent = firstUsername;
    document.getElementById('profile-display-email').textContent = `${firstUsername}@technova.com`;

    const avatar = document.querySelector('.profile-avatar');
    if (avatar && firstUsername !== '-') {
        avatar.textContent = firstUsername[0].toUpperCase();
    }

    document.getElementById('popup-registration-complete').classList.add('active');
}

export function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'none' || !dropdown.style.display) ? 'block' : 'none';
}

export function closeRegistrationComplete() {
    document.getElementById('popup-registration-complete').classList.remove('active');
    
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) {
                const formattedMetrics = {};
                for (const key in metrics.scenario1) {
                    const newKey = key.startsWith('scenario1.') ? key : `scenario1.${key}`;
                    formattedMetrics[newKey] = metrics.scenario1[key];
                }
                await saveMetrics(sid, formattedMetrics);
            }
        } catch (err) {
            console.warn('Failed saving final scenario1 metrics:', err);
        }
        window.startScenario(2);
    })();
}

export function toggleWifiMenu() {
    const menu = document.getElementById('wifi-menu');
    if (menu) menu.classList.toggle('active');
}

export function connectWifi(type) {
    const menu = document.getElementById('wifi-menu');
    const icon = document.getElementById('wifi-icon-status');

    if (type === 'secure') {
        const password = prompt("🔐 TechNova_Corp_Secure está protegida.\n\nClave:");
        if (password !== "UniversidadMurcia2026!") {
            alert("❌ Contraseña incorrecta.");
            return;
        }
    }
    
    menu.innerHTML = `<div style="padding: 20px; text-align: center;"><div class="spinner"></div><p>Conectando...</p></div>`;

    setTimeout(() => {
        metrics.scenario2.wifi_network_choice = (type === 'public') ? 'Insecure (Public)' : 'Secure (Corporate)';
        if(icon) icon.textContent = '📶'; 
        menu.classList.remove('active'); 
        document.getElementById('wifi-task-container').style.display = 'none';
        document.getElementById('registration-content').style.display = 'block';
    }, 1500);
}

export function getMinPasswordDistance(candidatePassword) {
    if (passwords.length === 0) return 100;
    let minDistance = 100;
    passwords.forEach(oldPass => {
        const dist = getLevenshteinDistance(oldPass, candidatePassword);
        if (dist < minDistance) minDistance = dist;
    });
    return minDistance;
}