import './styles/main.css';
import { getScenarioHTML } from './components/scenarios.js';
import { getPopupsHTML } from './components/popups.js';
import { renderEmails } from './utils/emails.js';
import { registerService, handleMFA, handlePasskey, toggleProfileDropdown, closeRegistrationComplete } from './handlers/scenario1.js';
import { handleInterruption } from './handlers/scenario2.js';
import { openEmail, openComposeEmail, handlePhishingClick, reportEmail, useAI, sendDocument, openLocalFileExplorer, openDriveFileExplorer, selectAttachment, removeAttachment, closeFileExplorer, sendComposedEmail, cancelCompose } from './handlers/scenario3.js';
import { navigate, handleWarning, handleCookies, handleUpdate, initBrowser } from './handlers/scenario4.js';
import { saveProfile, connectApp, handleAppPerms } from './handlers/scenario5.js';
import { 
    openWordDocs, 
    openSaveDialog, 
    finalizeSave, 
    openTempFolder, 
    showContextMenu, 
    performDelete, 
    openMyPC 
} from './handlers/scenario6.js';
import { finishSimulation } from './handlers/scenario7.js';
import { submitTaxonomy } from './handlers/scenario8.js';
import { startSession } from './services/api.js';
import { setParticipantId, getParticipantId } from './utils/participant.js';

let currentScenario = 0;
let sessionId = null;
const TOTAL_SCENARIOS = 9;

function startScenario(scenarioNumber) {
    document.getElementById(`scenario-${currentScenario}`).classList.remove('active');
    document.getElementById(`scenario-${scenarioNumber}`).classList.add('active');
    currentScenario = scenarioNumber;

    if (scenarioNumber === 3) {
        renderEmails();
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
        //botones para desactivarlos a través de los escenarios
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

    for (let i = 0; i <= 8; i++) {
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

    console.log('🟢 INYECTANDO HTML');
    app.innerHTML = scenariosHTML;

    console.log('🟢 VERIFICANDO BOTONES EN DOM:', {
        prevBtn: document.getElementById('prev-scenario-btn'),
        nextBtn: document.getElementById('next-scenario-btn'),
        counter: document.getElementById('scenario-counter')
    });

    updateNavigationButtons();
}

export function getSessionId() {
    return sessionId;
}

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

initApp();
