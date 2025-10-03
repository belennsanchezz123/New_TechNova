import { metrics } from '../utils/metrics.js';

export function saveProfile() {
    let filledFields = 0;
    if (document.getElementById('prof-dob').value) filledFields++;
    if (document.getElementById('prof-phone').value) filledFields++;
    if (document.getElementById('prof-city').value) filledFields++;
    metrics.scenario5.personal_data_disclosure_rate = `${filledFields} out of 3 optional fields filled`;

    document.getElementById('profile-task').style.display = 'none';
    document.getElementById('app-task').style.display = 'block';
}

export function connectApp() {
    document.getElementById('popup-app-perms').classList.add('active');
}

export function handleAppPerms(accepted) {
    metrics.scenario5.third_party_app_authorization = accepted ? 'Accepted excessive permissions' : 'Denied excessive permissions';
    document.getElementById('popup-app-perms').classList.remove('active');
    setTimeout(() => window.startScenario(6), 1000);
}
