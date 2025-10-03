import { metrics } from '../utils/metrics.js';

export function saveFinalPlan() {
    const isEncrypted = document.getElementById('encryption-checkbox').checked;
    metrics.scenario6.data_encryption_usage = isEncrypted ? 'Used encryption' : 'Did not use encryption';
    document.getElementById('encrypt-task').style.display = 'none';
    document.getElementById('delete-task').style.display = 'block';
}

export function deleteFile(method) {
    metrics.scenario6.secure_data_disposal = (method === 'secure') ? 'Used secure deletion' : 'Used standard deletion (Move to Trash)';
    alert("File has been deleted.");
    setTimeout(() => window.startScenario(7), 1000);
}
