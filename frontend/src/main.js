import './styles/main.css';
import { getScenarioHTML } from './components/scenarios.js';
import { getPopupsHTML } from './components/popups.js';
import { renderEmails } from './utils/emails.js';
import { registerService, handleMFA, handlePasskey } from './handlers/scenario1.js';
import { handleInterruption, handleFileAccess } from './handlers/scenario2.js';
import { openEmail, handlePhishingClick, reportEmail, useAI, sendDocument } from './handlers/scenario3.js';
import { navigate, handleWarning, handleCookies, handleUpdate } from './handlers/scenario4.js';
import { saveProfile, connectApp, handleAppPerms } from './handlers/scenario5.js';
import { saveFinalPlan, deleteFile } from './handlers/scenario6.js';
import { finishSimulation } from './handlers/scenario7.js';
import { startSession } from './services/api.js';

let currentScenario = 0;
let sessionId = null;

function startScenario(scenarioNumber) {
    document.getElementById(`scenario-${currentScenario}`).classList.remove('active');
    document.getElementById(`scenario-${scenarioNumber}`).classList.add('active');
    currentScenario = scenarioNumber;

    if (scenarioNumber === 3) {
        renderEmails();
    }
}

async function initApp() {
    const app = document.getElementById('app');

    let scenariosHTML = '<div id="simulation-container"><header>LYNX Platform Evaluation Simulation</header><main>';

    for (let i = 0; i <= 8; i++) {
        scenariosHTML += `<div id="scenario-${i}" class="scenario ${i === 0 ? 'active' : ''}">${getScenarioHTML(i)}</div>`;
    }

    scenariosHTML += '</main></div>';
    scenariosHTML += getPopupsHTML();

    app.innerHTML = scenariosHTML;
}

export function getSessionId() {
    return sessionId;
}

window.startScenario = startScenario;
window.registerService = registerService;
window.handleMFA = handleMFA;
window.handlePasskey = handlePasskey;
window.handleInterruption = handleInterruption;
window.handleFileAccess = handleFileAccess;
window.openEmail = openEmail;
window.handlePhishingClick = handlePhishingClick;
window.reportEmail = reportEmail;
window.useAI = useAI;
window.sendDocument = sendDocument;
window.navigate = navigate;
window.handleWarning = handleWarning;
window.handleCookies = handleCookies;
window.handleUpdate = handleUpdate;
window.saveProfile = saveProfile;
window.connectApp = connectApp;
window.handleAppPerms = handleAppPerms;
window.saveFinalPlan = saveFinalPlan;
window.deleteFile = deleteFile;
window.finishSimulation = finishSimulation;

initApp();
