import './styles/main.css';
import { getScenarioHTML } from './components/scenarios.js';
import { getPopupsHTML } from './components/popups.js';
import { renderEmails } from './utils/emails.js';
import { metrics } from './utils/metrics.js'; 

import { registerService, 
        handleMFA, 
        handlePasskey, 
        toggleProfileDropdown, 
        closeRegistrationComplete,
        toggleWifiMenu,
        connectWifi, 
        getMinPasswordDistance } from './handlers/scenario1.js';

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
    const popup = document.getElementById('popup-teams-alert');
    if (popup) popup.classList.add('active');
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
        
        // Alerta de Teams al iniciar Escenario 3
        if (!teamsIncidentResolved) {
            console.log('⚡ Iniciando interrupción de Teams...');
            setTimeout(() => {
                triggerTeamsIncident();
            }, 1000);
        }
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
        setParticipantId(participantId);
        error.style.display = 'none';
        input.style.borderColor = '';
        showPolicyPopup(); 
    } catch (err) {
        error.textContent = err.message;
        error.style.display = 'block';
        input.style.borderColor = '#d32f2f';
    }
}

function showPolicyPopup() {
    document.getElementById('popup-policy-rules').classList.add('active');
}

function acceptPolicyAndStart() {
    document.getElementById('popup-policy-rules').classList.remove('active');
    startScenario(1);
}

function handleTeamsAlert() {
    const passInput = document.getElementById('teams-new-pass');
    const newPass = passInput.value;

    if (!newPass) {
        alert("Por favor, introduce una contraseña.");
        return;
    }

    const distance = getMinPasswordDistance(newPass);
    
    if (metrics && metrics.unexpected) {
        metrics.unexpected.teams_password_distance = distance;
    }

    console.log(`Distancia de contraseña Teams: ${distance}`);

    if (distance === 0) {
        console.log("RIESGO CRÍTICO: Contraseña idéntica.");
    } else if (distance <= 3) {
        console.log("RIESGO ALTO: Contraseña muy similar.");
    } else {
        console.log("BUEN COMPORTAMIENTO: Contraseña diferente.");
    }

    alert("✅ Contraseña actualizada correctamente. Servicios reconectados.");
    document.getElementById('popup-teams-alert').classList.remove('active');
    teamsIncidentResolved = true;
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

initApp();