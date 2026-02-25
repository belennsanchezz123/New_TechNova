import './styles/main.css';
import { getScenarioHTML } from './components/scenarios.js';
import { getPopupsHTML } from './components/popups.js';
import { renderEmails } from './utils/emails.js';
import { saveMetrics } from './services/api.js';
import { setPasswordStrategy, getAvailableStrategies, getActiveStrategy } from './utils/validation.js';
import {
    registerService,
    handleMFA,
    toggleProfileDropdown,
    closeRegistrationComplete,
    toggleWifiMenu,
    connectWifi,
    getMinPasswordDistance,
    isEventsRegistrationComplete,
    handleTeamsPermissions,
    setTeamsPermission
} from './handlers/scenario1.js';

import { handleInterruption, initScenario2 } from './handlers/scenario2.js';

import {
    openEmail,
    openComposeEmail,
    handlePhishingClick,
    reportEmail,
    openLocalFileExplorer,
    openDriveFileExplorer,
    selectAttachment,
    removeAttachment,
    closeFileExplorer,
    sendComposedEmail,
    cancelCompose,
    initScenario3,
    areAllEmailsRead
} from './handlers/scenario3.js';

import { navigate, handleWarning, handleCookies, initBrowser, handleExtensionToggle, toggleExtensionsPanel, closeExtensionsPanel, confirmExtensions } from './handlers/scenario4.js';
import { saveProfile, connectApp, handleAppPerms } from './handlers/scenario6.js';

import {
    openWordDocs,
    openSaveDialog,
    finalizeSave,
    openTempFolder,
    showContextMenu,
    performDelete,
    openMyPC,
    drag,
    drop,
    allowDrop
} from './handlers/scenario7.js';

import { finishSimulation } from './handlers/scenario8.js';
import { submitTaxonomy } from './handlers/scenario9.js';
import { useAI, sendAIReport, handleAIInput, showMartaMessage } from './handlers/scenario5.js';
import { startSession, completeSession } from './services/api.js';
import { setParticipantId, getParticipantId } from './utils/participant.js';
import { getSessionId, setSessionId } from './utils/session.js';

// Importar funciones del flujo MFA multi-paso
import {
    startMFAFlow,
    selectPrimaryMethod,
    selectBackupMethod,
    skipBackupMethod,
    proceedToStep3,
    proceedToStep5,
    proceedFromBackupConfig,
    goBackMFA,
    completeMFA,
    skipMFA,
    enableProceedStep5
} from './handlers/mfa-flow.js';

// Importar funciones de la taskbar
import { getTaskbarHTML } from './components/taskbar.js';
import {
    initTaskbarClock,
    dismissUpdateNotification,
    postponeUpdate,
    restartSystem,
    checkUpdateNotificationTrigger,
    simulateDownload,
    toggleDownloadsWindow,
    openDownloadedFile,
    toggleStartMenu
} from './handlers/taskbar-handler.js';

// --- FUNCIONES TASKBAR ---
window.dismissUpdateNotification = dismissUpdateNotification;
window.postponeUpdate = postponeUpdate;
window.restartSystem = restartSystem;
window.simulateDownload = simulateDownload;
window.toggleDownloadsWindow = toggleDownloadsWindow;
window.openDownloadedFile = openDownloadedFile;
window.toggleStartMenu = toggleStartMenu;




let currentScenario = 0;
const teamsIncidentResolved = false;
const TOTAL_SCENARIOS = 11;

// --- FUNCIONES GLOBALES ---

function triggerTeamsIncident() {
    // Verificación ultra-segura: Memoria OR LocalStorage
    const sc1Completed = (typeof isEventsRegistrationComplete !== 'undefined' && isEventsRegistrationComplete === true);

    if (sc1Completed) {
        const popup = document.getElementById('popup-teams-alert');
        if (popup) {
            popup.classList.add('active');
            console.log("✅ Escenario 1 detectado como completo. Mostrando alerta de Teams.");
        }
    } else {
        // Si no está completo, NO hacemos el classList.add
        console.log("🚫 Bloqueo preventivo: El popup de Teams no se mostrará porque el Escenario 1 no ha terminado.");
    }
}

function startScenario(scenarioNumber) {
    console.log(`🎬 Intentando iniciar Escenario: ${scenarioNumber}`);

    // Asegurar que la barra de tareas sea visible si no estamos en la intro (Escenario 0)
    const taskbar = document.getElementById('windows-taskbar');
    if (taskbar) {
        taskbar.style.display = (scenarioNumber > 0) ? 'flex' : 'none';
    }

    // Logs específicos para depuración del Escenario 7 (Escritorio Limpio)
    if (scenarioNumber === 7) {
        console.log("🚀 BIENVENIDO AL ESCENARIO 7");
        console.log("🔍 Comprobando funciones globales de Drag & Drop:");
        console.log("   - window.drag:", window.drag ? "✅ OK" : "❌ INDEFINIDO");
        console.log("   - window.drop:", window.drop ? "✅ OK" : "❌ INDEFINIDO");
    }

    // Cambio visual de escenarios
    document.getElementById(`scenario-${currentScenario}`).classList.remove('active');
    document.getElementById(`scenario-${scenarioNumber}`).classList.add('active');
    currentScenario = scenarioNumber;

    // --- LÓGICA ESCENARIO 1 (WiFi highlight) ---
    if (scenarioNumber === 1) {
        showWifiHighlight();
    }

    // --- LÓGICA ESCENARIO 2 (Bloqueo de Pantalla) ---
    if (scenarioNumber === 2) {
        initScenario2();
    }

    // --- LÓGICA ESCENARIO 3 (Correos / Teams Incident) ---
    if (scenarioNumber === 3) {
        renderEmails();
        initScenario3();

        // Verificamos si el Escenario 1 está terminado para mostrar el aviso de contraseña
        const sc1Completed = isEventsRegistrationComplete;

        if (sc1Completed && !teamsIncidentResolved) {
            console.log('⚡ Iniciando interrupción de Teams (Aviso Contraseña)...');
            setTimeout(() => {
                triggerTeamsIncident();
            }, 1000);
        } else {
            console.log('ℹ️ Alerta de Teams omitida (E1 incompleto o incidente resuelto).');
        }
    }

    // --- LÓGICA ESCENARIO 4 (Navegador) ---
    if (scenarioNumber === 4) {
        setTimeout(() => initBrowser(), 100);
    }

    // --- LÓGICA ESCENARIO 5 (Laboratorio de IA / Nóminas) ---
    if (scenarioNumber === 5) {
        console.log("🤖 Iniciando Escenario 5 (Nóminas)...");
        // Importante: Llamar a la alerta de Marta solo aquí
        if (typeof showMartaMessage === 'function') {
            showMartaMessage();
        } else if (window.showMartaMessage) {
            window.showMartaMessage();
        }
    }

    updateNavigationButtons();

    // Verificar si debe mostrarse la notificación de actualización
    checkUpdateNotificationTrigger(scenarioNumber);
}

// --- WiFi Highlight (señalar el icono WiFi durante 10s) ---
function showWifiHighlight() {
    const wifiBtn = document.getElementById('wifi-icon-taskbar');
    if (!wifiBtn) return;

    // Crear el recuadro highlight
    const highlight = document.createElement('div');
    highlight.id = 'wifi-highlight-box';
    highlight.className = 'wifi-highlight-box';
    highlight.innerHTML = '<span class="wifi-highlight-arrow">👆 Haz clic aquí para conectarte</span>';
    wifiBtn.style.position = 'relative';
    wifiBtn.appendChild(highlight);

    // Auto-remover tras 10 segundos
    setTimeout(() => {
        const existing = document.getElementById('wifi-highlight-box');
        if (existing) existing.remove();
    }, 10000);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-scenario-btn');
    const nextBtn = document.getElementById('next-scenario-btn');
    const currentNum = document.getElementById('current-num');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentScenario <= 0;
        nextBtn.disabled = (currentScenario === 0) || (currentScenario >= TOTAL_SCENARIOS);
    }

    if (currentNum) {
        currentNum.textContent = currentScenario;
    }
}

function previousScenario() {
    if (currentScenario > 0) {
        startScenario(currentScenario - 1);
    }
}

function nextScenario() {
    // WiFi Gate: no se puede avanzar del escenario 1 sin conectar WiFi
    if (currentScenario === 1) {
        const wifiStatus = window.misMetricas?.scenario1?.wifi_public;
        if (wifiStatus === undefined || wifiStatus === null) {
            alert('⚠️ Debes conectarte a una red WiFi antes de continuar. Busca el icono de red (📡) en la barra de tareas.');
            showWifiHighlight();
            return;
        }
    }
    // Email Gate: no se puede avanzar del escenario 3 sin leer todos los correos
    if (currentScenario === 3) {
        if (!areAllEmailsRead()) {
            alert('📧 Debes leer todos los correos de tu bandeja de entrada antes de continuar.');
            return;
        }
    }
    if (currentScenario < TOTAL_SCENARIOS - 1) {
        startScenario(currentScenario + 1);
    }
}

async function initApp() {
    console.log('🟢 INICIANDO APP');
    const app = document.getElementById('app');

    let scenariosHTML = '<div id="simulation-container"><header>Simulación del Primer Día - TechNova</header><main>';

    for (let i = 0; i < TOTAL_SCENARIOS; i++) {
        scenariosHTML += `<div id="scenario-${i}" class="scenario ${i === 0 ? 'active' : ''}">${getScenarioHTML(i)}</div>`;
    }

    scenariosHTML += '</main>';

    console.log('🟢 AGREGANDO NAVIGATION CONTROLS');
    scenariosHTML += `
        <div id="navigation-controls">
            <button id="prev-scenario-btn" onclick="window.previousScenario()" disabled>← Anterior</button>
            <span id="scenario-counter">Escenario <span id="current-num">1</span> de ${TOTAL_SCENARIOS - 1}</span>
            <button id="next-scenario-btn" onclick="window.nextScenario()">Siguiente →</button>
        </div>
    `;

    scenariosHTML += '</div>';

    // Añadir la barra de tareas de Windows
    scenariosHTML += getTaskbarHTML();

    scenariosHTML += getPopupsHTML();

    app.innerHTML = scenariosHTML;
    updateNavigationButtons();

    // Inicializar el reloj de la taskbar
    initTaskbarClock();
}

export { getSessionId, setSessionId };

function validateAndStart() {
    const input = document.getElementById('participant-id-input');
    const error = document.getElementById('participant-id-error');
    const participantId = input.value.trim();

    if (!participantId) {
        error.style.display = 'block';
        input.style.borderColor = '#d32f2f';
        return;
    }

    try {
        localStorage.removeItem('session_id');
        setParticipantId(participantId);
        error.style.display = 'none';
        input.style.borderColor = '';
        showPolicyPopup();
    }

    catch (err) {
        error.textContent = err.message;
        error.style.display = 'block';
        input.style.borderColor = '#d32f2f';
    }

}

function showPolicyPopup() {
    document.getElementById('popup-policy-rules').classList.add('active');
}

async function acceptPolicyAndStart() {
    const pid = getParticipantId(); // Obtiene el P00x del localStorage
    if (!pid) {
        alert("Por favor, introduce tu ID de participante antes de empezar.");
        return;
    }

    try {
        // 1. Llamamos a la función de api.js para registrar el inicio en la DB
        const data = await startSession(pid);

        if (data.success && data.session) {
            // 2. Guardamos el ID de sesión para que todas las métricas futuras se vinculen a él
            const sid = data.session.id || data.session.sessionId;
            setSessionId(sid);

            console.log("✅ Sesión vinculada al participante:", pid, "ID de Sesión:", sid);
        } else {
            console.warn("No se pudo obtener un ID de sesión del servidor, las métricas podrían fallar.");
        }
    } catch (error) {
        console.error("Error al conectar con el servidor para iniciar sesión:", error);
    }

    // 3. Cerramos el popup y empezamos el Escenario 1
    const policyPopup = document.getElementById('popup-policy-rules');
    if (policyPopup) {
        policyPopup.classList.remove('active');
    }

    // 4. Mostrar la barra de tareas ahora que el usuario se ha identificado
    const taskbar = document.getElementById('windows-taskbar');
    if (taskbar) {
        taskbar.style.display = 'flex';
    }

    // 5. Activar modo pantalla completa para ocultar el SO nativo
    try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            await elem.webkitRequestFullscreen(); // Safari
        } else if (elem.msRequestFullscreen) {
            await elem.msRequestFullscreen(); // IE/Edge legacy
        }
        console.log("🖥️ Modo pantalla completa activado");
    } catch (err) {
        console.warn("No se pudo activar pantalla completa:", err.message);
    }

    startScenario(1);
}

window.handleTeamsAlert = async function () {
    // 1. Obtener los elementos del DOM
    const passInput = document.getElementById('teams-new-pass');

    const teamsPopup = document.getElementById('popup-teams-alert');

    // 2. Validar que se haya introducido una contraseña
    if (!passInput || !passInput.value) {
        alert("Por favor, introduce una contraseña.");
        return;
    }

    const newPass = passInput.value;

    // Solo procedemos si el usuario se ha logueado previamente en Events
    if (!isEventsRegistrationComplete) {
        console.log("Bloqueado: Intento de actualizar Teams sin haber completado el registro de Events.");
        const teamsPopup = document.getElementById('popup-teams-alert');
        if (teamsPopup) teamsPopup.classList.remove('active');
        return;
    }

    const distance = getMinPasswordDistance(newPass);
    const sid = getSessionId();

    // 5. Guardar la métrica usando la función única saveMetrics
    try {
        if (sid) {
            await saveMetrics(sid, {
                'scenario1.teams_password_distance': distance
            });
            console.log(`✅ Métrica enviada - Distancia de Teams: ${distance}`);
        } else {
            console.warn("No se pudo enviar la métrica: sessionId no encontrado.");
        }
    } catch (err) {
        console.warn('Error al guardar métrica de Teams:', err);
    }

    // 6. Logs de seguridad para depuración
    if (distance === 0) {
        console.log("%cRIESGO CRÍTICO: Contraseña idéntica.", "color: red; font-weight: bold;");
    } else if (distance <= 3) {
        console.log("%cRIESGO ALTO: Contraseña muy similar.", "color: orange;");
    } else {
        console.log("%cBUEN COMPORTAMIENTO: Contraseña diferente.", "color: green;");
    }

    // 7. Feedback al usuario y cierre de popup
    alert("✅ Contraseña actualizada correctamente. Servicios reconectados.");

    if (teamsPopup) {
        teamsPopup.classList.remove('active');
    }

    // 8. IMPORTANTE: Resetear la variable de flujo si es necesario o marcar incidente como resuelto
    if (typeof window.teamsIncidentResolved !== 'undefined') {
        window.teamsIncidentResolved = true;
    }
}

//Añadimos las funciones que simula un mensaje urgente de Teams

window.showAIPressureAlert = function () {
    // Evitar duplicados si el mensaje ya está en pantalla
    if (document.getElementById('teams-pressure-msg')) return;

    const chat = document.createElement('div');
    chat.id = 'teams-pressure-msg';

    // Estilos de notificación moderna
    chat.style.cssText = `
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        width: 320px; 
        background: #fff; 
        border-top: 6px solid #6264a7; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
        z-index: 10000; 
        border-radius: 5px; 
        padding: 15px; 
        font-family: 'Segoe UI', Tahoma, sans-serif;
    `;

    chat.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-weight:bold; color:#6264a7; display:flex; align-items:center; gap:8px;">
                <span style="background:#6264a7; color:white; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-size:12px;">M</span> 
                Marta (RRHH)
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background:none; border:none; color:#888; cursor:pointer; font-size:18px; line-height:1; padding:0 5px;"
                    title="Cerrar mensaje">
                &times;
            </button>
        </div>
        <p style="font-size:13px; color:#333; line-height:1.4; margin: 0;">
            "¡Oye! Perdona que te escriba así pero es que <b>el CEO ya me está preguntando por el informe Q4</b> y me pilla a medias... 😬 ¿Me puedes hacer el favor de mandármelo ya con lo que saques del chat? Hazlo como veas más rápido, ¡gracias!"
        </p>
    `;

    document.body.appendChild(chat);
};

window.goToAI = function () {
    document.getElementById('teams-chat-alert').remove();
    window.startScenario(9);
};


// --- ASIGNACIONES A WINDOW ---
window.toggleWifiMenu = toggleWifiMenu;
window.connectWifi = connectWifi;
window.validateAndStart = validateAndStart;
window.startScenario = startScenario;
window.previousScenario = previousScenario;
window.nextScenario = nextScenario;
window.acceptPolicyAndStart = acceptPolicyAndStart;
window.registerService = registerService;
window.handleMFA = handleMFA;
window.handleTeamsPermissions = handleTeamsPermissions;
window.setTeamsPermission = setTeamsPermission;
window.toggleProfileDropdown = toggleProfileDropdown;
window.closeRegistrationComplete = closeRegistrationComplete;
window.handleInterruption = handleInterruption;
window.openEmail = openEmail;
// window.openConfidentialDoc = openConfidentialDoc; // <--- COMENTADO (No se usa todavía)
window.openComposeEmail = openComposeEmail;
window.handlePhishingClick = handlePhishingClick;
window.reportEmail = reportEmail;
window.useAI = useAI;
window.sendAIReport = sendAIReport;
window.handleAIInput = handleAIInput;
// window.sendDocument removed — no longer used in Scenario 3
window.openLocalFileExplorer = openLocalFileExplorer;
window.openDriveFileExplorer = openDriveFileExplorer;
window.selectAttachment = selectAttachment;
window.removeAttachment = removeAttachment;
window.closeFileExplorer = closeFileExplorer;
window.sendComposedEmail = sendComposedEmail;
window.cancelCompose = cancelCompose;
window.navigate = navigate;
window.handleWarning = handleWarning;
window.handleCookies = handleCookies;
window.handleExtensionToggle = handleExtensionToggle;
window.toggleExtensionsPanel = toggleExtensionsPanel;
window.closeExtensionsPanel = closeExtensionsPanel;
window.confirmExtensions = confirmExtensions;
// window.handleUpdate = handleUpdate;
window.saveProfile = saveProfile;
window.connectApp = connectApp;
window.handleAppPerms = handleAppPerms;
window.openWordDocs = openWordDocs;
window.openSaveDialog = openSaveDialog;
window.finalizeSave = finalizeSave;
window.openTempFolder = openTempFolder;
window.showContextMenu = showContextMenu;
window.performDelete = performDelete;
window.openMyPC = openMyPC;
window.finishSimulation = finishSimulation;
window.submitTaxonomy = submitTaxonomy;
window.drag = drag;
window.drop = drop;
window.allowDrop = allowDrop;

window.finalizeSession = async function() {
    const sid = getSessionId();
    console.log('🏁 Intentando finalizar sesión. ID local:', sid);
    
    if (!sid) {
        console.error('❌ finalizeSession: no hay session_id en localStorage.');
        alert('⚠️ No se encontró sesión activa. Si estás en modo debug, usa el botón ⏹ del panel de debug.');
        return;
    }
    
    try {
        const result = await completeSession(sid);
        console.log('✅ Respuesta backend (finalizar):', result);
        if (result && result.success) {
            console.log('✨ Sesión marcada como completada en el servidor.');
        } else {
            console.warn('⚠️ El servidor no confirmó el completado, pero procederemos con la limpieza local.');
        }
    } catch(err) {
        console.error('❌ Error fatal al finalizar sesión:', err);
    }
    
    // LIMPIEZA TOTAL
    console.log('🧹 Limpiando localStorage y recargando...');
    localStorage.removeItem('session_id');
    localStorage.removeItem('participant_id');
    localStorage.removeItem('sc1_completed');
    localStorage.removeItem('wifi_sent');

    // Pequeño delay para asegurar que el usuario vea el log si la consola está abierta
    setTimeout(() => {
        location.reload();
    }, 500);
};

// --- Password Strategy (accesible desde consola para investigadores) ---
window.setPasswordStrategy = setPasswordStrategy;
window.getAvailableStrategies = getAvailableStrategies;
window.getActiveStrategy = getActiveStrategy;
// window.handleTeamsAlert is already defined above as an async function expression on window
window.valorTeams = () => isEventsRegistrationComplete;

// --- FUNCIONES MFA MULTI-PASO ---
window.startMFAFlow = startMFAFlow;
window.selectPrimaryMethod = selectPrimaryMethod;
window.selectBackupMethod = selectBackupMethod;
window.skipBackupMethod = skipBackupMethod;
window.proceedToStep3 = proceedToStep3;
window.proceedToStep5 = proceedToStep5;
window.proceedFromBackupConfig = proceedFromBackupConfig;
window.goBackMFA = goBackMFA;
window.completeMFA = completeMFA;
window.skipMFA = skipMFA;
window.enableProceedStep5 = enableProceedStep5;

// --- FUNCIONES TASKBAR ---
window.dismissUpdateNotification = dismissUpdateNotification;
window.postponeUpdate = postponeUpdate;
window.restartSystem = restartSystem;

initApp();

// ═══════════════════════════════════════════════════════════════════
//  🛠️  PANEL DE DEBUG  (solo visible con ?debug=true en la URL)
//  Uso: http://localhost:5173/?debug=true
// ═══════════════════════════════════════════════════════════════════
(function initDebugPanel() {
    if (!new URLSearchParams(window.location.search).has('debug')) return;

    const SCENARIOS = [
        { n: 0,  label: '0 · Bienvenida' },
        { n: 1,  label: '1 · WiFi + Cuentas' },
        { n: 2,  label: '2 · Pantalla Bloqueo' },
        { n: 3,  label: '3 · Email / Phishing' },
        { n: 4,  label: '4 · Navegador' },
        { n: 5,  label: '5 · Chat RRHH / AI' },
        { n: 6,  label: '6 · Perfil Público' },
        { n: 7,  label: '7 · Limpieza Archivos' },
        { n: 8,  label: '8 · Breach Check' },
        { n: 9,  label: '9 · Cuestionario' },
        { n: 10, label: '10 · Finalizar' },
    ];

    // ── Inyectar estilos ──────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #debug-panel {
            position: fixed;
            bottom: 56px;          /* por encima de la taskbar */
            left: 0;
            z-index: 99999;
            font-family: 'Segoe UI', monospace;
            font-size: 12px;
            transition: transform 0.25s ease;
        }
        #debug-panel.collapsed { transform: translateX(calc(-100% + 28px)); }

        #debug-toggle {
            position: absolute;
            right: 0;
            top: 0;
            width: 28px;
            height: 100%;
            background: #1e1e2e;
            color: #cdd6f4;
            border: none;
            cursor: pointer;
            writing-mode: vertical-rl;
            font-size: 10px;
            letter-spacing: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0 6px 6px 0;
        }

        #debug-body {
            background: rgba(30, 30, 46, 0.97);
            border: 1px solid #45475a;
            border-right: none;
            border-radius: 8px 0 0 8px;
            padding: 10px 8px;
            width: 190px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 80vh;
            overflow-y: auto;
        }

        #debug-body h4 {
            color: #f38ba8;
            margin: 0 0 6px 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #45475a;
            padding-bottom: 4px;
        }

        .dbg-label {
            color: #a6adc8;
            font-size: 10px;
            margin: 4px 0 2px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .dbg-btn {
            background: #313244;
            color: #cdd6f4;
            border: 1px solid #45475a;
            border-radius: 4px;
            padding: 5px 8px;
            cursor: pointer;
            text-align: left;
            font-size: 11px;
            transition: background 0.15s;
            width: 100%;
        }
        .dbg-btn:hover      { background: #45475a; color: #fff; }
        .dbg-btn.active-sc  { background: #89b4fa; color: #1e1e2e; font-weight: bold; border-color: #89b4fa; }
        .dbg-btn.danger     { background: #f38ba8; color: #1e1e2e; border-color: #f38ba8; font-weight: bold; }
        .dbg-btn.danger:hover { background: #e06c75; }
        .dbg-btn.warning    { background: #fab387; color: #1e1e2e; border-color: #fab387; }
        #debug-status {
            color: #a6e3a1;
            font-size: 10px;
            margin-top: 4px;
            min-height: 14px;
        }
    `;
    document.head.appendChild(style);

    // ── Crear panel ───────────────────────────────────────────────
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.classList.add('collapsed');
    panel.innerHTML = `
        <div id="debug-body">
            <h4>🛠 Debug Panel</h4>

            <div class="dbg-label">Saltar a escenario</div>
            ${SCENARIOS.map(s => `
                <button class="dbg-btn" id="dbg-sc-${s.n}"
                    onclick="window.__debugGoto(${s.n})">${s.label}</button>
            `).join('')}

            <div class="dbg-label" style="margin-top:8px">Sesión</div>
            <button class="dbg-btn warning" onclick="window.__debugSkipToEnd()">
                ⏭ Ir al Final (sc.10)
            </button>
            <button class="dbg-btn danger" onclick="window.__debugFinalize()">
                ⏹ Finalizar Sesión
            </button>

            <div id="debug-status">Escenario actual: <b id="dbg-cur">?</b></div>
        </div>
        <button id="debug-toggle" onclick="document.getElementById('debug-panel').classList.toggle('collapsed')"
            title="Abrir/cerrar panel debug">🛠</button>
    `;
    document.body.appendChild(panel);

    // ── Helpers internos ──────────────────────────────────────────

    /** Actualiza qué botón está marcado como activo */
    function refreshDebugUI() {
        SCENARIOS.forEach(s => {
            const btn = document.getElementById(`dbg-sc-${s.n}`);
            if (btn) btn.classList.toggle('active-sc', s.n === currentScenario);
        });
        const cur = document.getElementById('dbg-cur');
        if (cur) cur.textContent = currentScenario;
    }

    /** Saltar a escenario sin validaciones */
    window.__debugGoto = async function(n) {
        // En modo debug, establecer participantId directamente en localStorage
        // sin pasar por la validación estricta (que solo acepta P001-P050)
        if (!localStorage.getItem('participant_id')) {
            localStorage.setItem('participant_id', 'P001-DEBUG');
        }

        // Si no hay session_id en localStorage, crear sesión en el servidor
        if (!getSessionId()) {
            try {
                const pid = localStorage.getItem('participant_id');
                const data = await startSession(pid);
                if (data.success && data.session) {
                    const sid = data.session.id || data.session.sessionId;
                    setSessionId(sid);
                    console.log('%c🛠 Debug: sesión creada en servidor — ID: ' + sid, 'color:#a6e3a1;font-weight:bold');
                } else {
                    console.warn('🛠 Debug: respuesta inesperada del servidor:', data);
                }
            } catch (e) {
                console.error('🛠 Debug: error al crear sesión en servidor:', e);
            }
        }

        // Asegurar que la taskbar sea visible para escenarios > 0
        const taskbar = document.getElementById('windows-taskbar');
        if (taskbar) taskbar.style.display = n > 0 ? 'flex' : 'none';

        // Desactivar el escenario actual y activar el destino
        const prev = document.getElementById(`scenario-${currentScenario}`);
        const next = document.getElementById(`scenario-${n}`);
        if (prev) prev.classList.remove('active');
        if (next) next.classList.add('active');
        currentScenario = n;

        // Ejecutar lógica de init del escenario (renderEmails, initBrowser, etc.)
        startScenario(n);
        refreshDebugUI();

        const status = document.getElementById('debug-status');
        if (status) {
            status.innerHTML = `Saltado a <b>Escenario ${n}</b> ✅`;
            setTimeout(() => { status.innerHTML = `Escenario actual: <b id="dbg-cur">${n}</b>`; }, 2000);
        }
    };


    window.__debugSkipToEnd = function() { window.__debugGoto(10); };

    window.__debugFinalize = async function() {
        if (!confirm('⚠️ ¿Finalizar sesión de debug? La página se recargará.')) return;
        const sid = getSessionId();
        console.log('🛠 Debug: Finalizando sesión', sid);
        
        if (sid) {
            try {
                const result = await completeSession(sid);
                console.log('%c🛠 Debug: sesión finalizada ✅', 'color:#a6e3a1', result);
            } catch(e) {
                console.error('🛠 Debug: error al finalizar sesión', e);
            }
        }

        // LIMPIEZA CRÍTICA: Borrar rastro en modo debug también
        console.log('🛠 Debug: Limpieza rastro debug');
        localStorage.removeItem('session_id');
        localStorage.removeItem('participant_id');
        localStorage.removeItem('sc1_completed');
        localStorage.removeItem('wifi_sent');

        setTimeout(() => {
            location.reload();
        }, 500);
    };

    // Enganchar refreshDebugUI al startScenario original
    const _origStartScenario = window.startScenario;
    window.startScenario = function(n) {
        _origStartScenario(n);
        refreshDebugUI();
    };

    // Init inicial
    setTimeout(refreshDebugUI, 300);
    console.log('%c🛠 DEBUG PANEL activo — usa window.__debugGoto(N) para saltar escenarios', 'color:#89b4fa;font-weight:bold');
})();