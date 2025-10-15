import { metrics } from '../utils/metrics.js';

let hasScannedDrive = false; 
let hasBeenAlerted = false; 

// Función para "abrir" la unidad USB y mostrar los archivos
function openDrive() {
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

// Configura la interactividad del escenario USB
function setupUsbScenario() {
    const usbIcon = document.getElementById('usb-drive-icon');
    const contextMenu = document.getElementById('usb-context-menu');
    const notification = document.getElementById('usb-notification'); // Coge el elemento de la notificación

    // ▼▼▼ INICIO DE LA CORRECCIÓN ▼▼▼
    // 1. Al hacer un solo clic, muestra una notificación NO BLOQUEANTE
    usbIcon.addEventListener('click', () => {
        if (!hasBeenAlerted) {
            notification.textContent = 'El sistema ha detectado un dispositivo USB conectado.';
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2500); // La notificación desaparece sola
            hasBeenAlerted = true;
        }
    });

    // 2. Al hacer DOBLE CLIC, abre la unidad
    usbIcon.addEventListener('dblclick', openDrive);
    // ▲▲▲ FIN DE LA CORRECCIÓN ▲▲▲

    // 3. Al hacer CLIC DERECHO, muestra el menú personalizado
    usbIcon.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Esta línea evita que salga el menú del navegador
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    });

    // Lógica para los botones del menú (sin cambios)
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

    // Ocultar el menú si se hace clic fuera (sin cambios)
    window.addEventListener('click', (e) => {
        if (e.target.id !== 'usb-drive-icon' && !e.target.closest('#usb-drive-icon')) {
            contextMenu.style.display = 'none';
        }
    });
}

// Función principal que inicia el escenario (sin cambios)
export function handleInterruption(didLock) {
    metrics.scenario2.manual_lock_screen = didLock ? 'Yes, locked screen' : 'No, did not lock';
    document.getElementById('task-interruption').style.display = 'none';
    document.getElementById('task-usb').style.display = 'block';
    
    // Llama a la función que activa toda la nueva interactividad
    setupUsbScenario();
}