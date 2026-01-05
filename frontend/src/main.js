import './styles/main.css';
import { getScenarioHTML } from './components/scenarios.js';
import { getPopupsHTML } from './components/popups.js';
import { renderEmails } from './utils/emails.js';
import {saveMetrics } from './services/api.js';
import { registerService, 
        handleMFA, 
        handlePasskey, 
        toggleProfileDropdown, 
        closeRegistrationComplete,
        toggleWifiMenu,
        connectWifi, 
        getMinPasswordDistance,
        isEventsRegistrationComplete } from './handlers/scenario1.js';

import { handleInterruption } from './handlers/scenario2.js';

import { openEmail, 
        openComposeEmail, 
        handlePhishingClick, 
        reportEmail, 
        useAI, 
        sendDocument, 
        openLocalFileExplorer, 
        openDriveFileExplorer, 
        selectAttachment, 
        removeAttachment, 
        closeFileExplorer, 
        sendComposedEmail, 
        cancelCompose,
        // openConfidentialDoc // <--- COMENTADO (No se usa todavía)
        } from './handlers/scenario3.js';

import { navigate, handleWarning, handleCookies, handleUpdate, initBrowser } from './handlers/scenario4.js';
import { saveProfile, connectApp, handleAppPerms } from './handlers/scenario5.js';

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
} from './handlers/scenario6.js';

import { finishSimulation } from './handlers/scenario7.js';
import { submitTaxonomy } from './handlers/scenario8.js';
import { startSession } from './services/api.js';
import { setParticipantId, getParticipantId } from './utils/participant.js';
import { getSessionId, setSessionId } from './utils/session.js';

let currentScenario = 0;
let teamsIncidentResolved = false;
const TOTAL_SCENARIOS = 9;

// --- FUNCIONES GLOBALES ---

function triggerTeamsIncident() {
    // Verificación ultra-segura: Memoria OR LocalStorage
    const sc1Completed = (typeof isEventsRegistrationComplete !== 'undefined' && isEventsRegistrationComplete === true) || 
                         localStorage.getItem('sc1_completed') === 'true';

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
    if (scenarioNumber === 6) {
        console.log("🚀 BIENVENIDO AL ESCENARIO 6");
        console.log("🔍 Comprobando funciones globales:");
        console.log("   - window.drag:", window.drag ? "✅ OK" : "❌ INDEFINIDO");
        console.log("   - window.drop:", window.drop ? "✅ OK" : "❌ INDEFINIDO");
    }
    document.getElementById(`scenario-${currentScenario}`).classList.remove('active');
    document.getElementById(`scenario-${scenarioNumber}`).classList.add('active');
    currentScenario = scenarioNumber;

 if (scenarioNumber === 3) {
        renderEmails();
        
        // Comprobamos si el escenario 1 está realmente terminado
        const sc1Completed = isEventsRegistrationComplete || localStorage.getItem('sc1_completed') === 'true';

        if (sc1Completed && !teamsIncidentResolved) {
            console.log('⚡ Iniciando interrupción de Teams...');
            setTimeout(() => {
                triggerTeamsIncident();
            }, 1000);
        } else {
            console.log('ℹ️ Omitiendo interrupción de Teams: Escenario 1 incompleto o ya resuelto.');
        }
    }

    if (scenarioNumber === 4) {
        setTimeout(() => initBrowser(), 100);
    }

    if (scenarioNumber === 4) {
        setTimeout(() => initBrowser(), 100);
    }

    updateNavigationButtons();
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
    if (currentScenario < TOTAL_SCENARIOS) {
        startScenario(currentScenario + 1);
    }
}

async function initApp() {
    console.log('🟢 INICIANDO APP');
    const app = document.getElementById('app');

    let scenariosHTML = '<div id="simulation-container"><header>Simulación del Primer Día - TechNova</header><main>';

    for (let i = 0; i <= 9; i++) {
        scenariosHTML += `<div id="scenario-${i}" class="scenario ${i === 0 ? 'active' : ''}">${getScenarioHTML(i)}</div>`;
    }

    scenariosHTML += '</main>';

    console.log('🟢 AGREGANDO NAVIGATION CONTROLS');
    scenariosHTML += `
        <div id="navigation-controls">
            <button id="prev-scenario-btn" onclick="window.previousScenario()" disabled>← Anterior</button>
            <span id="scenario-counter">Escenario <span id="current-num">0</span> de 8</span>
            <button id="next-scenario-btn" onclick="window.nextScenario()">Siguiente →</button>
        </div>
    `;

    scenariosHTML += '</div>';
    scenariosHTML += getPopupsHTML();

    app.innerHTML = scenariosHTML;
    updateNavigationButtons();
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
        localStorage.removeItem('lynx_session_id');
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

    startScenario(1);
}

window.handleTeamsAlert = async function() {
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
window.handlePasskey = handlePasskey;
window.toggleProfileDropdown = toggleProfileDropdown;
window.closeRegistrationComplete = closeRegistrationComplete;
window.handleInterruption = handleInterruption;
window.openEmail = openEmail;
// window.openConfidentialDoc = openConfidentialDoc; // <--- COMENTADO (No se usa todavía)
window.openComposeEmail = openComposeEmail;
window.handlePhishingClick = handlePhishingClick;
window.reportEmail = reportEmail;
window.useAI = useAI;
window.sendDocument = sendDocument;
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
window.handleUpdate = handleUpdate;
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
window.handleTeamsAlert = handleTeamsAlert;
window.valorTeams = () => isEventsRegistrationComplete;
initApp();