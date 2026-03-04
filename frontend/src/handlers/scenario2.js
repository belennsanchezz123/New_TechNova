import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

//let hasScannedDrive = false;

// --- INICIO DE LA NUEVA LÓGICA ---

// Esta función maneja el desbloqueo al pulsar la tecla 'v'
// Función de inicialización exportada
export function initScenario2() {
    console.log("🔒 Inicializando Escenario 2: Decisión de Bloqueo");

    // 1. Asegurar que la pantalla de bloqueo esté oculta al principio
    const lockScreen = document.getElementById('simulated-lock-screen');
    if (lockScreen) {
        lockScreen.style.display = 'none';
    }

    // 2. Mostrar la pantalla de interrupción (la decisión)
    const interruptionScreen = document.getElementById('task-interruption');
    if (interruptionScreen) {
        interruptionScreen.style.display = 'block';
    }

    // 3. (Opcional) Setup de listeners si fuera necesario, pero handleInterruption se llama onClick en el HTML
}

// Muestra la siguiente parte de la tarea (el USB)
// Muestra la siguiente parte de la tarea (el USB)
/*
function showUsbTask() {
    document.getElementById('task-interruption').style.display = 'none';
    document.getElementById('task-usb').style.display = 'block';
    setupFileExplorer(); // Configura la lógica del explorador de archivos
}
*/


export async function handleInterruption(didLock) {
    const sid = getSessionId();
    const valorMetrica = didLock ? 1 : 0;
    metrics.scenario2.manual_lock_screen = valorMetrica;

    // 1. Ocultar la pantalla de decisión
    const interruptionScreen = document.getElementById('task-interruption');
    if (interruptionScreen) interruptionScreen.style.display = 'none';

    try {
        await saveMetrics(sid, { 'scenario2.manual_lock_screen': valorMetrica });
    } catch (err) {
        console.warn('Error al guardar métrica:', err);
    }

    if (didLock) {
        // Opción A: Bloquear pantalla
        const lockScreen = document.getElementById('simulated-lock-screen');
        if (lockScreen) {
            lockScreen.style.display = 'flex';
            lockScreen.focus();
        }

        // Listener para desbloquear con 'v'
        const unlockAndGo = (event) => {
            if (event.key === 'v' || event.key === 'V') {
                if (lockScreen) lockScreen.style.display = 'none';
                document.removeEventListener('keydown', unlockAndGo);

                // Mostrar tarea USB (COMENTADO)
                // showUsbTask();
                // Ir directo al siguiente escenario
                window.startScenario(3);
            }
        };
        document.addEventListener('keydown', unlockAndGo);

    } else {
        // Opción B: Continuar sin bloquear -> Ir directo a tarea USB (COMENTADO)
        // showUsbTask();
        // Ir directo al siguiente escenario
        window.startScenario(3);
    }
}

// Función para cambiar entre vistas del explorador
/*
function navigateToView(viewId, pathText, sidebarActiveId) {
    // Ocultar todas las vistas
    const views = ['this-pc-view', 'drive-c-view', 'network-view', 'documents-view', 'images-view', 'usb-content-view'];
    views.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });

    // Mostrar la vista seleccionada
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.style.display = 'block';

    // Actualizar la ruta en la barra de dirección
    const pathElement = document.querySelector('.fe-path');
    if (pathElement) pathElement.textContent = pathText;

    // Actualizar el elemento activo en la barra lateral
    const sidebarItems = document.querySelectorAll('.fe-sidebar li');
    sidebarItems.forEach(item => item.classList.remove('active'));
    const activeItem = document.getElementById(sidebarActiveId);
    if (activeItem) activeItem.classList.add('active');
}

// Función para "abrir" la unidad USB y mostrar su contenido
function openDriveView() {
    // Si el usuario abre la unidad sin haberla escaneado, lo registramos
    if (!hasScannedDrive) {
        metrics.scenario2.usb_antivirus_scan = 'No, opened drive directly';
    }

    navigateToView('usb-content-view', 'Este equipo > EVENT_FILES (E:)', 'sidebar-this-pc');

    // Añade el evento para que al hacer clic en el PDF, se avance de escenario
    document.getElementById('file-mapa').addEventListener('click', () => {
        alert("Abriendo 'Bienvenida_Equipo_TechNova.docx'...");
        (async () => {
            try {
                const sid = getSessionId();
                if (sid) await saveMetrics(sid, metrics.scenario2);
            } catch (err) {
                console.warn('Failed saving scenario2 metrics before scenario transition:', err);
            }
            setTimeout(() => window.startScenario(3), 1000);
        })();
    });
}

// Configura la interactividad del explorador de archivos
function setupFileExplorer() {
    const usbDrive = document.getElementById('usb-drive');
    const driveC = document.getElementById('drive-c');
    const contextMenu = document.getElementById('usb-context-menu');

    // Navegación desde la barra lateral
    document.getElementById('sidebar-this-pc').addEventListener('click', () => {
        navigateToView('this-pc-view', 'Este equipo', 'sidebar-this-pc');
    });

    document.getElementById('sidebar-drive-c').addEventListener('click', () => {
        navigateToView('drive-c-view', 'Este equipo > Disco local (C:)', 'sidebar-drive-c');
    });

    document.getElementById('sidebar-network').addEventListener('click', () => {
        navigateToView('network-view', 'Red', 'sidebar-network');
    });

    document.getElementById('sidebar-documents').addEventListener('click', () => {
        navigateToView('documents-view', 'Documentos', 'sidebar-documents');
    });

    document.getElementById('sidebar-images').addEventListener('click', () => {
        navigateToView('images-view', 'Imágenes', 'sidebar-images');
    });

    // Doble clic en unidades en el panel principal
    if (driveC) {
        driveC.addEventListener('dblclick', () => {
            navigateToView('drive-c-view', 'Este equipo > Disco local (C:)', 'sidebar-drive-c');
        });
    }

    // 1. Al hacer DOBLE CLIC en la unidad USB, se abre
    usbDrive.addEventListener('dblclick', openDriveView);

    // 2. Al hacer CLIC DERECHO, muestra el menú de opciones
    usbDrive.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    });

    // --- Lógica para el botón de escaneo del menú contextual ---
    document.getElementById('usb-context-scan').addEventListener('click', () => {
        hasScannedDrive = true;
        metrics.scenario2.usb_antivirus_scan = 'Yes, scanned drive first';
        contextMenu.style.display = 'none';

        // Persist this scenario metric immediately
        (async () => {
            try {
                const sid = getSessionId();
                if (sid) await saveMetrics(sid, { 'scenario2.usb_antivirus_scan': metrics.scenario2.usb_antivirus_scan });
            } catch (err) {
                console.warn('Failed saving scenario2 scan metric:', err);
            }
        })();

        // Mostrar el modal de escaneo
        const modal = document.getElementById('antivirus-scanning-modal');
        modal.style.display = 'flex';

        // Simular el escaneo con una barra de progreso
        const scanningBar = document.querySelector('.scanning-bar');
        scanningBar.style.width = '0%';

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            scanningBar.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);

                // Cambiar el mensaje a "completado"
                document.querySelector('.scanning-status').textContent = 'Listo, tu archivo no contiene ningún virus';
                document.querySelector('.modal-content h3').textContent = 'Escaneo Completado';

                // Cerrar el modal después de 2 segundos
                setTimeout(() => {
                    modal.style.display = 'none';
                    // Abrir automáticamente la unidad después del escaneo
                    openDriveView();
                }, 2000);
            }
        }, 100);
    });

    // Ocultar el menú si se hace clic en cualquier otro lugar
    window.addEventListener('click', (e) => {
        // Solo oculta si el clic no es sobre el propio menú
        if (!e.target.closest('.context-menu-windows')) {
            contextMenu.style.display = 'none';
        }
    });

    // Agregar event listeners para los otros items del menú (no hacen nada, solo cierran el menú)
    const contextMenuItems = contextMenu.querySelectorAll('.context-menu-item:not(#usb-context-scan)');
    contextMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });
    });
}
    */