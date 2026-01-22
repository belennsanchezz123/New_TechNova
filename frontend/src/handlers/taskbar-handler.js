import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

// Estado de la notificación de actualización
const updateNotificationState = {
    shown: false,
    dismissed: false,
    postponed: false,
    postponeCount: 0,
    showTime: null,
    responseTime: null,
    timeoutId: null,
    postponeTimeoutId: null
};

// Inicializar el reloj de la taskbar
export function initTaskbarClock() {
    const updateClock = () => {
        const now = new Date();
        const timeElement = document.querySelector('.clock-time');
        const dateElement = document.querySelector('.clock-date');

        if (timeElement && dateElement) {
            // Formato 24h: HH:MM
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;

            // Formato fecha: DD/MM/YYYY
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}/${month}/${year}`;
        }
    };

    // Actualizar inmediatamente y luego cada minuto
    updateClock();
    setInterval(updateClock, 60000);
}

// Mostrar la notificación de actualización
export function showUpdateNotification() {
    const notification = document.getElementById('update-notification');
    const indicator = document.getElementById('update-indicator');

    if (!notification || updateNotificationState.shown) return;

    updateNotificationState.shown = true;
    updateNotificationState.showTime = Date.now();

    // Mostrar notificación
    notification.classList.remove('hidden');

    // Mostrar icono de actualización en la bandeja del sistema
    if (indicator) {
        indicator.style.display = 'block';
    }

    // Guardar métrica de que apareció la notificación
    const sid = getSessionId();
    if (sid) {
        saveMetrics(sid, {
            'taskbar.update_notification_appeared': 'Yes',
            'taskbar.update_notification_timestamp': new Date().toISOString()
        }).catch(err => console.warn('Error saving notification metric:', err));
    }

    // Auto-cierre después de 60 segundos si no hay interacción
    updateNotificationState.timeoutId = setTimeout(() => {
        if (!updateNotificationState.dismissed) {
            dismissUpdateNotification('Ignored');
        }
    }, 60000);

    console.log('🔔 Notificación de actualización mostrada');
}

// Cerrar/ignorar la notificación
export function dismissUpdateNotification(reason = 'Dismissed') {
    const notification = document.getElementById('update-notification');

    if (!notification || updateNotificationState.dismissed) return;

    updateNotificationState.dismissed = true;
    updateNotificationState.responseTime = Date.now() - updateNotificationState.showTime;

    // Ocultar notificación
    notification.classList.add('hidden');

    // Limpiar timeout si existe
    if (updateNotificationState.timeoutId) {
        clearTimeout(updateNotificationState.timeoutId);
    }

    // Guardar métrica
    const sid = getSessionId();
    if (sid) {
        const responseTimeSeconds = Math.floor(updateNotificationState.responseTime / 1000);

        saveMetrics(sid, {
            'taskbar.update_user_action': reason,
            'taskbar.update_response_time_seconds': responseTimeSeconds,
            'taskbar.update_action_timestamp': new Date().toISOString()
        }).catch(err => console.warn('Error saving dismiss metric:', err));
    }

    console.log(`❌ Notificación cerrada: ${reason}, Tiempo: ${Math.floor(updateNotificationState.responseTime / 1000)}s`);
}

// Posponer la actualización
export function postponeUpdate() {
    const notification = document.getElementById('update-notification');

    if (!notification) return;

    updateNotificationState.postponed = true;
    updateNotificationState.postponeCount++;
    updateNotificationState.responseTime = Date.now() - updateNotificationState.showTime;

    // Ocultar notificación
    notification.classList.add('hidden');

    // Limpiar timeout si existe
    if (updateNotificationState.timeoutId) {
        clearTimeout(updateNotificationState.timeoutId);
    }

    // Guardar métrica
    const sid = getSessionId();
    if (sid) {
        const responseTimeSeconds = Math.floor(updateNotificationState.responseTime / 1000);

        saveMetrics(sid, {
            'taskbar.update_user_action': 'Postpone',
            'taskbar.update_response_time_seconds': responseTimeSeconds,
            'taskbar.update_postpone_count': updateNotificationState.postponeCount,
            'taskbar.update_action_timestamp': new Date().toISOString()
        }).catch(err => console.warn('Error saving postpone metric:', err));
    }

    console.log(`⏸️ Actualización pospuesta (${updateNotificationState.postponeCount}ª vez)`);

    // Volver a mostrar en 3 minutos (180000 ms)
    updateNotificationState.postponeTimeoutId = setTimeout(() => {
        // Resetear estados para poder mostrar de nuevo
        updateNotificationState.shown = false;
        updateNotificationState.dismissed = false;
        showUpdateNotification();
    }, 180000); // 3 minutos
}

// Reiniciar el sistema (pantalla de reinicio de 1 minuto)
export function restartSystem() {
    const notification = document.getElementById('update-notification');
    const restartScreen = document.getElementById('restart-screen');
    const progressBar = document.getElementById('restart-progress-bar');
    const percentageText = document.getElementById('restart-percentage');

    if (!restartScreen) return;

    updateNotificationState.responseTime = Date.now() - updateNotificationState.showTime;

    // Ocultar notificación
    if (notification) {
        notification.classList.add('hidden');
    }

    // Mostrar pantalla de reinicio
    restartScreen.classList.remove('hidden');

    // Guardar métrica
    const sid = getSessionId();
    if (sid) {
        const responseTimeSeconds = Math.floor(updateNotificationState.responseTime / 1000);

        saveMetrics(sid, {
            'taskbar.update_user_action': 'Restart',
            'taskbar.update_response_time_seconds': responseTimeSeconds,
            'taskbar.update_action_timestamp': new Date().toISOString(),
            'taskbar.restart_initiated': 'Yes'
        }).catch(err => console.warn('Error saving restart metric:', err));
    }

    console.log('🔄 Iniciando reinicio del sistema...');

    // Simular progreso de reinicio durante 60 segundos
    let progress = 0;
    const duration = 60000; // 60 segundos en milisegundos
    const interval = 100; // Actualizar cada 100ms
    const increment = (100 / duration) * interval;

    const progressInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Esperar un poco más antes de cerrar
            setTimeout(() => {
                restartScreen.classList.add('hidden');
                console.log('✅ Reinicio completado');

                // Guardar métrica de completado
                if (sid) {
                    saveMetrics(sid, {
                        'taskbar.restart_completed': 'Yes',
                        'taskbar.restart_completion_timestamp': new Date().toISOString()
                    }).catch(err => console.warn('Error saving restart completion:', err));
                }
            }, 1000);
        }

        // Actualizar UI
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (percentageText) {
            percentageText.textContent = `${Math.floor(progress)}%`;
        }
    }, interval);
}

// Estado del archivo descargado
let recentDownload = null;

// Simular efecto de descarga en la taskbar
export function simulateDownload(duration = 3000, fileInfo = null) {
    const indicator = document.getElementById('download-indicator');
    if (!indicator) return;

    // Guardar info del archivo (si se proporciona)
    if (fileInfo) {
        recentDownload = fileInfo;
    }

    // Mostrar el icono
    indicator.style.display = 'block';

    // Animación simple intermitente
    indicator.style.animation = 'pulse 1s infinite';
    indicator.innerHTML = '<span>⬇️</span>';

    // Logs
    console.log(`📥 Iniciando simulación de descarga (${duration}ms)...`, fileInfo);

    setTimeout(() => {
        // Al terminar, mostrar check verde
        indicator.style.animation = 'none';
        indicator.innerHTML = '<span style="color: #4caf50;">✅</span>';

        console.log('✅ Descarga completada simulada.');

        // Ocultar después de 4 segundos (damos más tiempo para que lo vean y cliquen si quieren)
        setTimeout(() => {
            // Solo ocultamos si no hay una descarga en curso (por si acaso)
            if (indicator.innerHTML.includes('✅')) {
                indicator.style.display = 'none';
                indicator.innerHTML = '<span>⬇️</span>';
            }
        }, 4000);
    }, duration);
}

// Abrir/Cerrar ventana de descargas
export function toggleDownloadsWindow() {
    // Verificamos si desktop-window-container existe pero está oculto
    let container = document.getElementById('desktop-window-container');

    // Si existe pero no es visible (porque el Escenario 7 está oculto), lo ignoramos
    if (container && container.offsetParent === null) {
        console.log("Container exists but is hidden (Scenario 7 inactive). Using temp container.");
        container = null;
    }

    let targetContainer = container;

    if (!targetContainer) {
        // Intentamos usar el body o un container general
        // Pero para mantener el estilo, creemos uno temporal si no existe
        targetContainer = document.getElementById('temp-window-container');
        if (!targetContainer) {
            targetContainer = document.createElement('div');
            targetContainer.id = 'temp-window-container';
            // Aseguramos que esté por encima de todo pero debajo de popups
            targetContainer.style.position = 'absolute';
            targetContainer.style.top = '0';
            targetContainer.style.left = '0';
            targetContainer.style.width = '100%';
            targetContainer.style.height = '100%';
            targetContainer.style.pointerEvents = 'auto'; // CRITICAL: Allow clicks on the windows
            targetContainer.style.zIndex = '8000';
            document.body.appendChild(targetContainer);
        }
    }

    // Verificar si ya está abierta
    const existingWindow = document.getElementById('downloads-window');
    if (existingWindow) {
        existingWindow.remove();
        return;
    }

    // Renderizar contenido de la lista de archivos
    let contentHTML = '';

    // GRUPO: HOY (Solo si hay descarga reciente)
    if (recentDownload) {
        contentHTML += `
            <div class="explorer-group-title">∨ hoy</div>
            <div class="explorer-row selected" onclick="window.openDownloadedFile('${recentDownload.type}')">
                <div class="icon-col">
                    <span class="file-icon-sm">${recentDownload.type === 'malicious' ? '👾' : '📄'}</span>
                </div>
                <div class="name-col">
                    <span class="file-name">${recentDownload.name}</span>
                </div>
                <div class="date-col">
                    <span>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="type-col">
                    <span>${recentDownload.type === 'malicious' ? 'Aplicación' : 'Documento Microsoft Word'}</span>
                </div>
                <div class="size-col">
                    <span>${recentDownload.size || '1.2 MB'}</span>
                </div>
            </div>
        `;
    }

    // GRUPO: AYER (Simulado)
    contentHTML += `
        <div class="explorer-group-title">∨ ayer</div>
        <div class="explorer-row">
            <div class="icon-col"><span class="file-icon-sm">📄</span></div>
            <div class="name-col"><span class="file-name">informe_mensual_ventas.pdf</span></div>
            <div class="date-col"><span>Ayer, 14:30</span></div>
            <div class="type-col"><span>Archivo PDF</span></div>
            <div class="size-col"><span>2.4 MB</span></div>
        </div>
        <div class="explorer-row">
            <div class="icon-col"><span class="file-icon-sm">🖼️</span></div>
            <div class="name-col"><span class="file-name">captura_pantalla_error.png</span></div>
            <div class="date-col"><span>Ayer, 09:15</span></div>
            <div class="type-col"><span>Archivo PNG</span></div>
            <div class="size-col"><span>450 KB</span></div>
        </div>
    `;

    // GRUPO: LA SEMANA PASADA (Simulado)
    contentHTML += `
        <div class="explorer-group-title">∨ la semana pasada</div>
        <div class="explorer-row">
            <div class="icon-col"><span class="file-icon-sm">📦</span></div>
            <div class="name-col"><span class="file-name">driver_canon_printer.zip</span></div>
            <div class="date-col"><span>15/01/2026 11:20</span></div>
            <div class="type-col"><span>Carpeta Comprimida</span></div>
            <div class="size-col"><span>150 MB</span></div>
        </div>
    `;

    // Crear la ventana
    const win = document.createElement('div');
    win.id = 'downloads-window';
    win.className = 'window-frame';
    win.style.position = 'fixed';
    win.style.top = '100px';
    win.style.left = '200px';
    win.style.width = '800px';
    win.style.height = '500px';
    win.style.zIndex = '9005';
    win.style.display = 'flex';
    win.style.flexDirection = 'column';
    win.style.boxShadow = '0 10px 40px rgba(0,0,0,0.4)';

    win.innerHTML = `
        <div class="window-header" style="background:#f3f3f3; border-bottom:1px solid #e0e0e0; display:flex; gap:10px; padding:8px 12px;">
            <span style="font-size:12px;">🔽 Descargas</span>
            <button onclick="document.getElementById('downloads-window').remove()" style="margin-left:auto; background:none; border:none; color:#333; cursor:pointer;">✕</button>
        </div>
        
        <!-- Barra de herramientas simulada -->
        <div style="background:#f9f9f9; padding:8px; border-bottom:1px solid #e0e0e0; display:flex; gap:15px; font-size:12px;">
            <span>➕ Nuevo</span>
            <span>✂️ Cortar</span>
            <span>📋 Copiar</span>
            <span>📝 Pegar</span>
            <span style="margin-left:auto;">Ordenar 🔽</span>
            <span>Ver 🔽</span>
        </div>

        <!-- Barra de direcciones -->
        <div style="padding:10px; border-bottom:1px solid #e0e0e0; display:flex; gap:10px; align-items:center;">
             <span style="color:#666;">⬅ ➡ ⬆ 🔄</span>
             <div style="flex:1; border:1px solid #ccc; padding:4px 8px; font-size:12px; display:flex; align-items:center;">
                 <span style="margin-right:5px;">📂</span> Descargas
             </div>
             <div style="width:200px; border:1px solid #ccc; padding:4px 8px; font-size:12px; color:#666;">
                 🔍 Buscar en Descargas
             </div>
        </div>

        <div class="window-body" style="flex:1; display:flex; overflow:hidden;">
            <!-- Sidebar -->
            <div style="width:180px; background:#f0f0f0; border-right:1px solid #e0e0e0; padding:10px; font-size:13px;">
                <div style="padding:4px;">★ Acceso rápido</div>
                <div style="padding:4px; margin-left:10px;">⬇ Escritorio</div>
                <div style="padding:4px; margin-left:10px; font-weight:bold; background:#e0e0e0;">⬇ Descargas</div>
                <div style="padding:4px; margin-left:10px;">⬇ Documentos</div>
                <div style="padding:4px; margin-left:10px;">⬇ Imágenes</div>
                <div style="margin-top:10px; padding:4px;">💻 Este equipo</div>
                <div style="padding:4px; margin-left:10px;">💾 Disco Local (C:)</div>
            </div>

            <!-- Main Content (File List) -->
            <div class="window-content" style="flex:1; background:white; overflow-y:auto; padding:0;">
                
                <!-- Header Columnas -->
                <div class="explorer-header-row" style="display:flex; padding:5px 10px; border-bottom:1px solid #eee; font-size:12px; color:#666;">
                    <div style="width:30px;"></div>
                    <div style="flex:2;">Nombre</div>
                    <div style="flex:1;">Fecha de modificación</div>
                    <div style="flex:1;">Tipo</div>
                    <div style="width:80px;">Tamaño</div>
                </div>

                <div style="padding:10px;">
                    ${contentHTML}
                </div>
            </div>
        </div>
        
        <!-- Footer Status Bar -->
        <div style="padding:4px 10px; background:#f3f3f3; border-top:1px solid #e0e0e0; font-size:11px; color:#666; display:flex; gap:20px;">
            <span>${recentDownload ? '5 elementos' : '4 elementos'}</span>
            <span>1 elemento seleccionado</span>
        </div>
    `;

    targetContainer.appendChild(win);
}

// Abrir el archivo (Simulación)
export function openDownloadedFile(type) {
    if (type === 'malicious') {
        alert("❌ Error del Sistema:\n\nEl archivo 'Installer_Cracked.exe' está dañado o contiene software malintencionado.\n\nEl antivirus ha bloqueado su ejecución.");
    } else {
        alert("📄 Abriendo documento en Word...\n\n(Simulación: El archivo se abre correctamente).");
    }
}


// Abrir/Cerrar Menú Inicio
export function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    if (!startMenu) return;

    // Cerrar otros menús si están abiertos (ej. WiFi)
    const wifiMenu = document.getElementById('wifi-menu');
    if (wifiMenu && wifiMenu.style.display === 'block') {
        wifiMenu.style.display = 'none';
        const wifiIcon = document.getElementById('wifi-icon-taskbar');
        if (wifiIcon) wifiIcon.classList.remove('active');
    }

    // Toggle visibilidad con clase 'hidden'
    if (startMenu.classList.contains('hidden')) {
        startMenu.classList.remove('hidden');
        startMenu.style.display = 'flex'; // Asegurar display flex

        // Auto-focus en búsqueda (opcional, buena UX)
        const searchInput = startMenu.querySelector('input');
        if (searchInput) searchInput.focus();

        console.log('🪟 Menú Inicio abierto');
    } else {
        startMenu.classList.add('hidden');
        // Esperar animación si se desea, o ocultar tras timeout
        setTimeout(() => {
            if (startMenu.classList.contains('hidden')) {
                startMenu.style.display = 'none';
            }
        }, 300); // Coincide con CSS transition
        console.log('🪟 Menú Inicio cerrado');
    }
}
export function checkUpdateNotificationTrigger(currentScenario) {
    // Mostrar notificación al completar Escenario 3 (cuando avanza a Escenario 4)
    if (currentScenario === 4 && !updateNotificationState.shown) {
        setTimeout(() => {
            showUpdateNotification();
        }, 2000); // Delay de 2 segundos para que el usuario se sitúe
    }
}
