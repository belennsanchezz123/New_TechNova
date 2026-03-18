import { createRegistration, saveMetrics } from '../services/api.js';
import { getPasswordStrength, getLevenshteinDistance } from '../utils/validation.js';
import { averagePairwiseSimilarity } from '../utils/similarity.js';
import { metrics } from '../utils/metrics.js';
import { getParticipantId } from '../utils/participant.js';
import { getSessionId, setSessionId } from '../utils/session.js';

export let isEventsRegistrationComplete = false;
const passwords = [];
const registrations = {};
const DEFAULT_MAIL_PASSWORD = 'X9m!Q2v@T7k#L4r$Z8';
let isWifiLocked = false;

export function acceptDefaultMailPassword() {
    const passInput = document.getElementById('mail-pass');
    const suggestion = document.getElementById('mail-pass-suggestion');
    if (!passInput) return;

    passInput.value = suggestion ? suggestion.textContent.trim() : DEFAULT_MAIL_PASSWORD;
    passInput.focus();
}

export function rejectDefaultMailPassword() {
    const passInput = document.getElementById('mail-pass');
    if (!passInput) return;

    if (passInput.value === DEFAULT_MAIL_PASSWORD) {
        passInput.value = '';
    }
    passInput.focus();
}

function _applyPasswordVisibility(input, holdVisible) {
    if (!input) return;
    // Keep input as text and mask/unmask via CSS to avoid browser password manager leak popups.
    input.style.webkitTextSecurity = holdVisible ? 'none' : 'disc';
}

export function holdPasswordVisibility(inputId, show) {
    const input = document.getElementById(inputId);
    if (!input) return;

    _applyPasswordVisibility(input, show);
}

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
        // Iniciar el flujo MFA multi-paso
        const sessionId = registrations['drive']?.id;

        // Importar dinámicamente y llamar a startMFAFlow
        import('./mfa-flow.js').then(({ startMFAFlow }) => {
            startMFAFlow(sessionId);
        });

    } else if (service === 'events') {
        localStorage.setItem('sc1_completed', 'true');
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
    const defaultPasswordFlag = (service === 'mail' && password === DEFAULT_MAIL_PASSWORD) ? 1 : 0;

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
                'scenario1.wifi_public': metrics.scenario1.wifi_public
            });
            localStorage.setItem('wifi_sent', 'true');
        }

        // B. Enviar datos del servicio actual (Mail, Drive o Events)
        const serviceMetrics = {
            [`scenario1.${service}_password_strength`]: strength
        };

        if (service === 'mail') {
            metrics.scenario1.default_password_flag = defaultPasswordFlag;
            serviceMetrics['scenario1.default_password_flag'] = defaultPasswordFlag;
        }

        await saveMetrics(currentSid, serviceMetrics);

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

        // Calcular similitud promedio por pares entre las 3 contraseñas
        // Resultado ∈ [0, 1]. 1 = todas idénticas, 0 = sin relación.
        if (passwords.length >= 3) {
            metrics.scenario1.password_reused = averagePairwiseSimilarity(passwords.slice(0, 3));
        } else if (passwords.length === 2) {
            metrics.scenario1.password_reused = averagePairwiseSimilarity(passwords);
        }
        console.log(`🔑 Similitud de contraseñas (avg pairwise): ${metrics.scenario1.password_reused}`);

        // Mostrar popup de permisos de Teams (cámara y micrófono)
        setTimeout(() => {
            const permissionsPopup = document.getElementById('popup-teams-permissions');
            if (permissionsPopup) {
                permissionsPopup.classList.add('active');
            }
        }, 500);

        return; // No llamamos a goNext() aún, esperamos a que responda a los permisos
    }

    goNext(service);
}

export async function handleMFA(activated) {
    // Si el usuario hace click en "Activar MFA", iniciamos el flujo multi-paso
    if (activated) {
        const sessionId = registrations['drive']?.id;

        // Usar evento global estático para evitar warning de Vite
        if (window.startMFAFlow) {
            window.startMFAFlow(sessionId);
        }
    } else {
        // Si dice "No", guardamos métricas de rechazo inmediato
        const sid = getSessionId();
        await saveMetrics(sid, {
            'scenario1.mfa_usage': 0,
            'scenario1.mfa_method_primary': 'None',
            'scenario1.mfa_method_backup': 'None',
            'scenario1.mfa_email_alternative': 0
        });

        document.getElementById('popup-mfa').classList.remove('active');

        const eventsForm = document.getElementById('technova-events-form');
        if (eventsForm) eventsForm.style.display = 'block';
    }
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
                    const val = metrics.scenario1[key];
                    if (val !== null && val !== undefined && val !== '') {
                        const newKey = key.startsWith('scenario1.') ? key : `scenario1.${key}`;
                        formattedMetrics[newKey] = val;
                    }
                }
                if (Object.keys(formattedMetrics).length > 0) {
                    await saveMetrics(sid, formattedMetrics);
                }
            }
        } catch (err) {
            console.warn('Failed saving final scenario1 metrics:', err);
        }
        window.startScenario(2);
    })();
}

export function toggleWifiMenu() {
    if (isWifiLocked) return;

    const menu = document.getElementById('wifi-menu');
    if (menu) {
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }
}

export function connectWifi(type) {
    if (isWifiLocked) return;

    const menu = document.getElementById('wifi-menu');
    const icon = document.getElementById('wifi-icon-status');
    const wifiBtn = document.getElementById('wifi-icon-taskbar');

    if (type === 'secure') {
        const password = prompt("🔐 TechNova_Corp_Secure está protegida.\n\nClave:");
        if (password !== "UniversidadMurcia2026!") {
            alert("❌ Contraseña incorrecta.");
            return;
        }
    }

    // Feedback visual (cursor de espera)
    document.body.style.cursor = 'wait';

    setTimeout(() => {
        metrics.scenario1.wifi_public = (type === 'public') ? 1 : 0;


        if (icon) icon.textContent = '🛜';
        if (menu) menu.style.display = 'none';

        // Bloquear cambio de red tras la primera conexión.
        isWifiLocked = true;
        if (wifiBtn) {
            wifiBtn.disabled = true;
            wifiBtn.classList.add('locked');
            wifiBtn.title = 'WiFi conectado';
        }

        document.body.style.cursor = 'default';

        // Mostrar el contenido de registro
        const registrationContent = document.getElementById('registration-content');
        if (registrationContent) {
            registrationContent.style.display = 'block';
        }

        // Ocultar el bloque inicial de conexión para evitar confusión tras conectarse.
        const wifiTaskContainer = document.getElementById('wifi-task-container');
        if (wifiTaskContainer) {
            wifiTaskContainer.style.display = 'none';
        }

        console.log(`✅ Conectado a WiFi: ${type === 'public' ? 'TechNova_Public' : 'TechNova_Corp_Secure'}`);
    }, 1500);
}

// Estado interno de los permisos de Teams
const teamsPerms = { camera: null, mic: null };

/** Llamado al pulsar Permitir/Bloquear en cada fila individual */
export function setTeamsPermission(device, allowed) {
    teamsPerms[device] = allowed;

    // Feedback visual: resaltar el botón seleccionado
    if (device === 'camera') {
        const allowBtn = document.getElementById('cam-allow-btn');
        const blockBtn = document.getElementById('cam-block-btn');
        if (allowBtn && blockBtn) {
            allowBtn.style.background = allowed ? '#464775' : 'white';
            allowBtn.style.color     = allowed ? 'white'   : '#464775';
            blockBtn.style.background = !allowed ? '#d32f2f' : 'white';
            blockBtn.style.color      = !allowed ? 'white'   : '#d32f2f';
        }
    } else {
        const allowBtn = document.getElementById('mic-allow-btn');
        const blockBtn = document.getElementById('mic-block-btn');
        if (allowBtn && blockBtn) {
            allowBtn.style.background = allowed ? '#464775' : 'white';
            allowBtn.style.color     = allowed ? 'white'   : '#464775';
            blockBtn.style.background = !allowed ? '#d32f2f' : 'white';
            blockBtn.style.color      = !allowed ? 'white'   : '#d32f2f';
        }
    }

    // Habilitar el botón Confirmar solo cuando ambos están decididos
    const confirmBtn = document.getElementById('teams-confirm-btn');
    if (confirmBtn && teamsPerms.camera !== null && teamsPerms.mic !== null) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
    }
}

export async function handleTeamsPermissions() {
    const sid = getSessionId();

    // Guardar métricas individuales de permisos de Teams
    try {
        await saveMetrics(sid, {
            'scenario1.teams_camera_permission':     teamsPerms.camera ? 1 : 0,
            'scenario1.teams_microphone_permission': teamsPerms.mic    ? 1 : 0
        });

        console.log(`📹 Cámara: ${teamsPerms.camera ? 'Permitida' : 'Bloqueada'} | 🎤 Micrófono: ${teamsPerms.mic ? 'Permitido' : 'Bloqueado'}`);
    } catch (err) {
        console.warn('Error al guardar métricas de permisos de Teams:', err);
    }

    // Cerrar el popup
    const permissionsPopup = document.getElementById('popup-teams-permissions');
    if (permissionsPopup) {
        permissionsPopup.classList.remove('active');
    }

    // Resetear estado para próximas aperturas
    teamsPerms.camera = null;
    teamsPerms.mic    = null;

    // Continuar con el flujo normal
    showRegistrationComplete();
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