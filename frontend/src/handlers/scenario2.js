import { metrics } from '../utils/metrics.js';

let hasScannedDrive = false;

// Función para "abrir" la unidad USB y mostrar su contenido
function openDriveView() {
    // Si el usuario abre la unidad sin haberla escaneado, lo registramos
    if (!hasScannedDrive) {
        metrics.scenario2.usb_antivirus_scan = 'No, opened drive directly';
    }

    // Oculta la vista de "Este equipo" y muestra la del contenido del USB
    document.getElementById('this-pc-view').style.display = 'none';
    document.getElementById('usb-content-view').style.display = 'block';

    // Actualiza la ruta en la barra de dirección simulada
    document.querySelector('.fe-path').textContent = 'Este equipo > EVENT_FILES (E:)';

    // Añade el evento para que al hacer clic en el PDF, se avance de escenario
    document.getElementById('file-mapa').addEventListener('click', () => {
        alert("Abriendo 'Mapa_Ruta_Senderismo.pdf'...");
        setTimeout(() => window.startScenario(3), 1000);
    });
}

// Configura la interactividad del explorador de archivos
function setupFileExplorer() {
    const usbDrive = document.getElementById('usb-drive');
    const contextMenu = document.getElementById('usb-context-menu');

    // 1. Al hacer DOBLE CLIC en la unidad, se abre
    usbDrive.addEventListener('dblclick', openDriveView);

    // 2. Al hacer CLIC DERECHO, muestra el menú de opciones
    usbDrive.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    });

    // --- Lógica para los botones del menú contextual ---
    document.getElementById('usb-context-scan').addEventListener('click', () => {
        hasScannedDrive = true;
        metrics.scenario2.usb_antivirus_scan = 'Yes, scanned drive first';
        alert('Lynx Antivirus: Escaneo de la unidad completado. No se encontraron amenazas.');
        contextMenu.style.display = 'none';
    });

    document.getElementById('usb-context-open').addEventListener('click', () => {
        openDriveView();
        contextMenu.style.display = 'none';
    });

    // Ocultar el menú si se hace clic en cualquier otro lugar
    window.addEventListener('click', (e) => {
        // Solo oculta si el clic no es sobre el propio menú
        if (!e.target.closest('.context-menu')) {
            contextMenu.style.display = 'none';
        }
    });
}

// Función principal que inicia el escenario 2
export function handleInterruption(didLock) {
    metrics.scenario2.manual_lock_screen = didLock ? 'Yes, locked screen' : 'No, did not lock';
    document.getElementById('task-interruption').style.display = 'none';
    document.getElementById('task-usb').style.display = 'block';
    
    // Inicia la lógica del explorador de archivos
    setupFileExplorer();
}