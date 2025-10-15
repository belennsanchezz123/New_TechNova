import { metrics } from '../utils/metrics.js';

let hasScannedDrive = false; 
let hasBeenAlerted = false; 

function openDrive() {
    console.log("LOG 5: La función 'openDrive' se ha ejecutado.");
    if (!hasScannedDrive) {
        metrics.scenario2.usb_antivirus_scan = 'No, opened drive directly';
    }
    document.getElementById('usb-drive-container').style.display = 'none';
    document.getElementById('file-explorer-content').style.display = 'block';

    document.querySelector('.file-item[data-filename="Mapa_Ruta_Senderismo.pdf"]').addEventListener('click', () => {
        alert("Abriendo 'Mapa_Ruta_Senderismo.pdf'...");
        setTimeout(() => window.startScenario(3), 1000);
    });
}

function setupUsbScenario() {
    console.log("LOG 2: Ejecutando 'setupUsbScenario' para añadir los eventos.");
    
    const usbIcon = document.getElementById('usb-drive-icon');
    const contextMenu = document.getElementById('usb-context-menu');
    
    // Al hacer DOBLE CLIC, abre la unidad
    usbIcon.addEventListener('dblclick', () => {
        console.log("LOG 4: ¡EVENTO 'DBLCLICK' DETECTADO!");
        openDrive();
    });

    // Al hacer CLIC DERECHO, muestra el menú personalizado
    usbIcon.addEventListener('contextmenu', (e) => {
        console.log("LOG Clic Derecho: Evento 'contextmenu' detectado.");
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    });

    // --- El resto de la función (lógica del menú y de ocultarlo) sigue igual ---
    document.getElementById('usb-context-scan').addEventListener('click', () => {
        hasScannedDrive = true;
        metrics.scenario2.usb_antivirus_scan = 'Yes, scanned drive first';
        alert('Lynx Antivirus: Escaneo de la unidad completado. No se encontraron amenazas.');
        contextMenu.style.display = 'none';
    });
    document.getElementById('usb-context-open').addEventListener('click', () => {
        openDrive();
        contextMenu.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target.id !== 'usb-drive-icon' && !e.target.closest('#usb-drive-icon')) {
            contextMenu.style.display = 'none';
        }
    });
}

export function handleInterruption(didLock) {
    console.log("LOG 1: Se ha ejecutado 'handleInterruption'.");
    metrics.scenario2.manual_lock_screen = didLock ? 'Yes, locked screen' : 'No, did not lock';
    document.getElementById('task-interruption').style.display = 'none';
    document.getElementById('task-usb').style.display = 'block';
    
    setupUsbScenario();
}