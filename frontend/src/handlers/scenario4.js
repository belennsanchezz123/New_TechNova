import { metrics } from '../utils/metrics.js';

export function navigate(destination) {
    const contentEl = document.getElementById('browser-content');
    if (destination === 'official') {
        metrics.scenario4.response_to_browser_warnings = 'N/A (Chose safe site)';
        contentEl.innerHTML = `
            <h4>Official Parks Site</h4>
            <p>Welcome! Here is the map you requested.</p>
            <div class="cookie-banner">
                <p>This site uses cookies to enhance your experience.</p>
                <button onclick="window.handleCookies('accept')">Accept All</button>
                <button class="secondary" onclick="window.handleCookies('reject')">Reject All</button>
            </div>`;
    } else {
        contentEl.innerHTML = `
            <div class="browser-warning">
                <h2>⚠️ Security Alert</h2>
                <p>The connection to this site is not private. Attackers might be able to see your information.</p>
                <button onclick="window.handleWarning('proceed')">Proceed Anyway (Dangerous)</button>
                <button class="secondary" onclick="window.handleWarning('back')">Go Back to Safety</button>
            </div>`;
    }
}

export function handleWarning(action) {
     if (action === 'proceed') {
        metrics.scenario4.response_to_browser_warnings = 'Ignored warning and proceeded';
        metrics.scenario4.clicked_dangerous_link = 'Yes';
        alert('Your antivirus blocked a malicious download.');
     } else {
        metrics.scenario4.response_to_browser_warnings = 'Heeded warning and went back';
     }
     setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
     }, 1500);
}

export function handleCookies(decision) {
    metrics.scenario4.cookie_consent = `Chose to '${decision}' cookies`;
    document.querySelector('.cookie-banner').style.display = 'none';
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

export function handleUpdate(action) {
    metrics.unexpected.update_compliance_rate = (action === 'install') ? 'Installed immediately' : 'Postponed';
    document.getElementById('popup-update').classList.remove('active');
    setTimeout(() => window.startScenario(5), 1000);
}
