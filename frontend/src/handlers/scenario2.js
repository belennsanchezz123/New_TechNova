import { metrics } from '../utils/metrics.js';

export function handleInterruption(didLock) {
    metrics.scenario2.manual_lock_screen = didLock ? 'Yes, locked screen' : 'No, did not lock';
    document.getElementById('task-interruption').style.display = 'none';
    document.getElementById('task-usb').style.display = 'block';
}

export function handleFileAccess(action) {
    if(action === 'scan') {
        metrics.scenario2.usb_antivirus_scan = 'Yes, scanned first';
        alert('Lynx Antivirus: No threats found.');
    } else {
        if (metrics.scenario2.usb_antivirus_scan === 'Not Set') {
            metrics.scenario2.usb_antivirus_scan = 'No, opened file directly';
        }
        alert("Opening 'Mapa_Ruta_Senderismo.pdf'...");
        setTimeout(() => window.startScenario(3), 1000);
    }
}
