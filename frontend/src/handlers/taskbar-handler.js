import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { metrics } from '../utils/metrics.js';

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

function setUpdateIndicatorDisabled(disabled) {
    const indicator = document.getElementById('update-indicator');
    if (!indicator) return;

    indicator.disabled = disabled;
    indicator.setAttribute('aria-disabled', String(disabled));
}

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
    const postponeOptions = document.getElementById('update-postpone-options');
    const indicator = document.getElementById('update-indicator');

    if (!notification || updateNotificationState.shown) return;

    updateNotificationState.shown = true;
    updateNotificationState.showTime = Date.now();

    // Mostrar notificación
    notification.classList.remove('hidden');
    if (postponeOptions) postponeOptions.classList.add('hidden');

    // Mostrar icono de actualización en la bandeja del sistema
    if (indicator) {
        indicator.style.display = 'block';
    }

    // Bloquear re-apertura desde la taskbar para evitar acciones múltiples
    setUpdateIndicatorDisabled(true);

    // Guardar métrica de que apareció la notificación
    const sid = getSessionId();
    if (sid) {
        saveMetrics(sid, {
            'taskbar.update_notification_appeared': 'Yes',
            'taskbar.update_notification_timestamp': new Date().toISOString()
        }).catch(err => console.warn('Error saving notification metric:', err));
    }

    console.log('🔔 Notificación de actualización mostrada');
}

// Reabrir la notificación desde el icono/pestaña de la taskbar
export function openUpdateNotificationFromTaskbar() {
    const notification = document.getElementById('update-notification');
    const postponeOptions = document.getElementById('update-postpone-options');
    const indicator = document.getElementById('update-indicator');

    if (!notification || (indicator && indicator.disabled)) return;

    updateNotificationState.shown = true;
    updateNotificationState.dismissed = false;
    updateNotificationState.showTime = Date.now();

    notification.classList.remove('hidden');
    if (postponeOptions) postponeOptions.classList.add('hidden');

    if (indicator) {
        indicator.style.display = 'block';
    }

    if (updateNotificationState.timeoutId) {
        clearTimeout(updateNotificationState.timeoutId);
        updateNotificationState.timeoutId = null;
    }
}

export function showPostponeOptions() {
    const notification = document.getElementById('update-notification');
    const postponeOptions = document.getElementById('update-postpone-options');

    if (!postponeOptions) return;

    if (notification) {
        notification.classList.add('hidden');
    }

    postponeOptions.classList.remove('hidden');
}

export function closePostponeOptions() {
    const notification = document.getElementById('update-notification');
    const postponeOptions = document.getElementById('update-postpone-options');

    if (!postponeOptions) return;

    postponeOptions.classList.add('hidden');
    if (notification && !updateNotificationState.dismissed) {
        notification.classList.remove('hidden');
    }
}

// Cerrar/ignorar la notificación
export function dismissUpdateNotification(reason = 'Dismissed') {
    const notification = document.getElementById('update-notification');
    const postponeOptions = document.getElementById('update-postpone-options');

    if (!notification || updateNotificationState.dismissed) return;

    updateNotificationState.dismissed = true;
    updateNotificationState.responseTime = Date.now() - updateNotificationState.showTime;

    // Ocultar notificación
    notification.classList.add('hidden');
    if (postponeOptions) postponeOptions.classList.add('hidden');

    // Limpiar timeout si existe
    if (updateNotificationState.timeoutId) {
        clearTimeout(updateNotificationState.timeoutId);
    }

    // Guardar métrica
    const sid = getSessionId();
    if (sid) {
        const responseTimeSeconds = Math.floor(updateNotificationState.responseTime / 1000);

        // Mantener una copia local visible en window.misMetricas/paneles de resultados
        metrics.taskbar.update_user_action = reason;
        metrics.taskbar.update_response_time_seconds = responseTimeSeconds;

        saveMetrics(sid, {
            'taskbar.update_user_action': reason,
            'taskbar.update_response_time_seconds': responseTimeSeconds
        }).catch(err => console.warn('Error saving dismiss metric:', err));
    }

    console.log(`❌ Notificación cerrada: ${reason}, Tiempo: ${Math.floor(updateNotificationState.responseTime / 1000)}s`);
}

// Posponer la actualización
export function postponeUpdate(delayMs = 180000, delayLabel = '3 minutos') {
    const notification = document.getElementById('update-notification');
    const postponeOptions = document.getElementById('update-postpone-options');

    let postponeAction = 'Postpone_Custom';
    if (delayMs === 900000) postponeAction = 'Postpone_15m';
    if (delayMs === 3600000) postponeAction = 'Postpone_1h';
    if (delayMs === 86400000) postponeAction = 'Postpone_24h';

    if (!notification) return;

    updateNotificationState.postponed = true;
    updateNotificationState.postponeCount++;
    updateNotificationState.responseTime = Date.now() - updateNotificationState.showTime;

    // Ocultar notificación
    notification.classList.add('hidden');
    if (postponeOptions) postponeOptions.classList.add('hidden');

    // Limpiar timeout si existe
    if (updateNotificationState.timeoutId) {
        clearTimeout(updateNotificationState.timeoutId);
    }

    // Guardar métrica
    const sid = getSessionId();
    if (sid) {
        const responseTimeSeconds = Math.floor(updateNotificationState.responseTime / 1000);

        metrics.taskbar.update_user_action = postponeAction;
        metrics.taskbar.update_response_time_seconds = responseTimeSeconds;

        saveMetrics(sid, {
            'taskbar.update_user_action': postponeAction,
            'taskbar.update_response_time_seconds': responseTimeSeconds,
            'taskbar.update_postpone_count': updateNotificationState.postponeCount,
            'taskbar.update_postpone_delay_minutes': Math.round(delayMs / 60000)
        }).catch(err => console.warn('Error saving postpone metric:', err));
    }

    console.log(`⏸️ Actualización pospuesta (${updateNotificationState.postponeCount}ª vez) - ${delayLabel}`);

    if (updateNotificationState.postponeTimeoutId) {
        clearTimeout(updateNotificationState.postponeTimeoutId);
    }

    // Volver a mostrar según opción elegida
    updateNotificationState.postponeTimeoutId = setTimeout(() => {
        // Resetear estados para poder mostrar de nuevo
        updateNotificationState.shown = false;
        updateNotificationState.dismissed = false;
        showUpdateNotification();
    }, delayMs);
}

// Reiniciar el sistema (pantalla de reinicio de 1 minuto)
export function restartSystem() {
    const notification = document.getElementById('update-notification');
    const postponeOptions = document.getElementById('update-postpone-options');
    const restartScreen = document.getElementById('restart-screen');
    const progressBar = document.getElementById('restart-progress-bar');
    const percentageText = document.getElementById('restart-percentage');

    if (!restartScreen) return;

    updateNotificationState.responseTime = Date.now() - updateNotificationState.showTime;

    // Ocultar notificación
    if (notification) {
        notification.classList.add('hidden');
    }
    if (postponeOptions) postponeOptions.classList.add('hidden');

    // Mostrar pantalla de reinicio
    restartScreen.classList.remove('hidden');

    // Guardar métrica
    const sid = getSessionId();
    if (sid) {
        const responseTimeSeconds = Math.floor(updateNotificationState.responseTime / 1000);

        metrics.taskbar.update_user_action = 'Restart';
        metrics.taskbar.update_response_time_seconds = responseTimeSeconds;

        saveMetrics(sid, {
            'taskbar.update_user_action': 'Restart',
            'taskbar.update_response_time_seconds': responseTimeSeconds,
            'taskbar.restart_initiated': 'Yes'
        }).catch(err => console.warn('Error saving restart metric:', err));
    }

    console.log('🔄 Iniciando reinicio del sistema...');

    // Simular progreso de reinicio por debajo de 1 minuto
    let progress = 0;
    const duration = 45000; // 45 segundos en milisegundos
    const interval = 100; // Actualizar cada 100ms
    const increment = (100 / duration) * interval;

    const progressInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            restartScreen.classList.add('hidden');
            console.log('✅ Reinicio completado');

            // Guardar métrica de completado
            if (sid) {
                saveMetrics(sid, {
                    'taskbar.restart_completed': 'Yes',
                    'taskbar.restart_completion_timestamp': new Date().toISOString()
                }).catch(err => console.warn('Error saving restart completion:', err));
            }
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
let downloadsContextMenuElement = null;
let downloadsContextMenuOutsideClickHandler = null;
let downloadsContextMenuEscapeHandler = null;
let recycleBinContextMenuElement = null;
let recycleBinContextMenuOutsideClickHandler = null;
let recycleBinContextMenuEscapeHandler = null;
const deletedDownloads = new Set();
const recycleBinItems = [];

function getWindowTargetContainer() {
    let container = document.getElementById('desktop-window-container');

    // Si existe pero no es visible (porque el Escenario 7 está oculto), lo ignoramos
    if (container && container.offsetParent === null) {
        console.log('Container exists but is hidden (Scenario 7 inactive). Using temp container.');
        container = null;
    }

    if (container) {
        return container;
    }

    let tempContainer = document.getElementById('temp-window-container');
    if (!tempContainer) {
        tempContainer = document.createElement('div');
        tempContainer.id = 'temp-window-container';
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.width = '100%';
        tempContainer.style.height = '100%';
        tempContainer.style.pointerEvents = 'none';
        tempContainer.style.zIndex = '8000';
        document.body.appendChild(tempContainer);
    }

    return tempContainer;
}

function moveFileToRecycleBin(fileData) {
    if (!fileData || !fileData.name) return;

    if (!deletedDownloads.has(fileData.name)) {
        deletedDownloads.add(fileData.name);
        recycleBinItems.unshift({
            name: fileData.name,
            size: fileData.size || 'N/D',
            type: fileData.fileTypeLabel || 'Archivo',
            deletedAt: new Date().toLocaleString()
        });
    }

    if (recentDownload && recentDownload.name === fileData.name) {
        recentDownload = null;
    }
}

function hideDownloadsContextMenu() {
    if (downloadsContextMenuElement) {
        downloadsContextMenuElement.remove();
        downloadsContextMenuElement = null;
    }

    if (downloadsContextMenuOutsideClickHandler) {
        document.removeEventListener('click', downloadsContextMenuOutsideClickHandler);
        downloadsContextMenuOutsideClickHandler = null;
    }

    if (downloadsContextMenuEscapeHandler) {
        document.removeEventListener('keydown', downloadsContextMenuEscapeHandler);
        downloadsContextMenuEscapeHandler = null;
    }
}

function hideRecycleBinContextMenu() {
    if (recycleBinContextMenuElement) {
        recycleBinContextMenuElement.remove();
        recycleBinContextMenuElement = null;
    }

    if (recycleBinContextMenuOutsideClickHandler) {
        document.removeEventListener('click', recycleBinContextMenuOutsideClickHandler);
        recycleBinContextMenuOutsideClickHandler = null;
    }

    if (recycleBinContextMenuEscapeHandler) {
        document.removeEventListener('keydown', recycleBinContextMenuEscapeHandler);
        recycleBinContextMenuEscapeHandler = null;
    }
}

function showDownloadsContextMenu(x, y, fileData) {
    hideDownloadsContextMenu();

    const menu = document.createElement('div');
    menu.className = 'context-menu-windows';
    menu.style.display = 'block';
    menu.style.zIndex = '10020';

    menu.innerHTML = `
        <div class="context-menu-item" data-action="open">📂 Abrir</div>
        <div class="context-menu-item" data-action="openWith">🛠️ Abrir con...</div>
        <div class="context-menu-item" data-action="share">👥 Compartir con</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="copy">📋 Copiar</div>
        <div class="context-menu-item" data-action="delete">🗑️ Eliminar</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="properties">⚙️ Propiedades</div>
    `;

    menu.addEventListener('click', (event) => {
        const item = event.target.closest('.context-menu-item');
        if (!item) return;

        const action = item.dataset.action;

        if (action === 'open') {
            openDownloadedFile(fileData.type);
        } else if (action === 'openWith') {
            alert(`Abrir con...\n\nSelecciona una app para abrir "${fileData.name}".`);
        } else if (action === 'share') {
            alert(`Compartir con...\n\n"${fileData.name}" listo para compartirse (simulación).`);
        } else if (action === 'copy') {
            alert(`"${fileData.name}" copiado al portapapeles (simulación).`);
        } else if (action === 'delete') {
            moveFileToRecycleBin(fileData);

            metrics.scenario7.document_deleted = 1;
            const sid = getSessionId();
            if (sid) {
                saveMetrics(sid, {
                    'scenario7.document_deleted': 1
                }).catch(err => console.warn('Error saving scenario7 document deletion metric:', err));
            }

            const downloadsWindow = document.getElementById('downloads-window');
            if (downloadsWindow) {
                downloadsWindow.remove();
                toggleDownloadsWindow();
            }

            alert(`"${fileData.name}" enviado a la Papelera.`);
        } else if (action === 'properties') {
            const fileTypeText = fileData.fileTypeLabel || (fileData.type === 'malicious' ? 'Aplicación (.exe)' : 'Documento Microsoft Word');
            alert(`Propiedades\n\nNombre: ${fileData.name}\nTipo: ${fileTypeText}\nTamaño: ${fileData.size || '1.2 MB'}`);
        }

        hideDownloadsContextMenu();
    });

    document.body.appendChild(menu);

    const maxLeft = window.innerWidth - menu.offsetWidth - 8;
    const maxTop = window.innerHeight - menu.offsetHeight - 8;
    menu.style.left = `${Math.max(8, Math.min(x, maxLeft))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, maxTop))}px`;

    downloadsContextMenuOutsideClickHandler = (event) => {
        if (downloadsContextMenuElement && !downloadsContextMenuElement.contains(event.target)) {
            hideDownloadsContextMenu();
        }
    };

    downloadsContextMenuEscapeHandler = (event) => {
        if (event.key === 'Escape') {
            hideDownloadsContextMenu();
        }
    };

    document.addEventListener('click', downloadsContextMenuOutsideClickHandler);
    document.addEventListener('keydown', downloadsContextMenuEscapeHandler);

    downloadsContextMenuElement = menu;
}

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
    hideDownloadsContextMenu();
    const targetContainer = getWindowTargetContainer();

    // Verificar si ya está abierta
    const existingWindow = document.getElementById('downloads-window');
    if (existingWindow) {
        existingWindow.remove();
        // También limpiar el container temporal si está vacío
        const tempContainer = document.getElementById('temp-window-container');
        if (tempContainer && tempContainer.children.length === 0) {
            tempContainer.remove();
        }
        return;
    }

    // Renderizar contenido de la lista de archivos
    let contentHTML = '';
    let totalItems = 0;

    // GRUPO: HOY (Solo si hay descarga reciente)
    if (recentDownload && !deletedDownloads.has(recentDownload.name)) {
        totalItems += 1;
        contentHTML += `
            <div class="explorer-group-title">∨ hoy</div>
            <div class="explorer-row selected downloadable-file-row" data-file-type="${recentDownload.type}" data-file-name="${recentDownload.name}" data-file-size="${recentDownload.size || '1.2 MB'}" data-file-type-label="${recentDownload.type === 'malicious' ? 'Aplicación (.exe)' : 'Documento Microsoft Word'}">
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
        ${deletedDownloads.has('informe_mensual_ventas_confidencial.pdf') ? '' : `
        <div class="explorer-row downloadable-file-row" data-file-type="safe" data-file-name="informe_mensual_ventas_confidencial.pdf" data-file-size="2.4 MB" data-file-type-label="Archivo PDF">
            <div class="icon-col"><span class="file-icon-sm">📄</span></div>
            <div class="name-col"><span class="file-name">informe_mensual_ventas_confidencial.pdf</span></div>
            <div class="date-col"><span>Ayer, 14:30</span></div>
            <div class="type-col"><span>Archivo PDF</span></div>
            <div class="size-col"><span>2.4 MB</span></div>
        </div>
        `}
        <div class="explorer-row">
            <div class="icon-col"><span class="file-icon-sm">🖼️</span></div>
            <div class="name-col"><span class="file-name">captura_pantalla_error.png</span></div>
            <div class="date-col"><span>Ayer, 09:15</span></div>
            <div class="type-col"><span>Archivo PNG</span></div>
            <div class="size-col"><span>450 KB</span></div>
        </div>
    `;

    if (!deletedDownloads.has('informe_mensual_ventas_confidencial.pdf')) {
        totalItems += 1;
    }
    totalItems += 1; // captura_pantalla_error.png

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
    totalItems += 1; // driver_canon_printer.zip

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
    win.style.pointerEvents = 'auto'; // CRITICAL: permite clics en la ventana
    win.style.background = '#ffffff';

    win.innerHTML = `
        <div class="window-header" style="background:#f3f3f3; border-bottom:1px solid #e0e0e0; display:flex; gap:10px; padding:8px 12px;">
            <span style="font-size:12px;">🔽 Descargas</span>
            <button class="downloads-close-btn" style="margin-left:auto; background:none; border:none; color:#333; cursor:pointer;">✕</button>
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
            <span>${totalItems} elementos</span>
            <span>1 elemento seleccionado</span>
        </div>
    `;

    targetContainer.appendChild(win);

    const closeButton = win.querySelector('.downloads-close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            hideDownloadsContextMenu();
            win.remove();
        });
    }

    win.addEventListener('click', (event) => {
        const downloadableRow = event.target.closest('.downloadable-file-row');
        if (!downloadableRow) return;

        const fileType = downloadableRow.dataset.fileType;
        if (!fileType) return;

        hideDownloadsContextMenu();
        openDownloadedFile(fileType);
    });

    win.addEventListener('contextmenu', (event) => {
        const downloadableRow = event.target.closest('.downloadable-file-row');
        if (!downloadableRow) return;

        event.preventDefault();

        const fileData = {
            type: downloadableRow.dataset.fileType || 'safe',
            name: downloadableRow.dataset.fileName || 'archivo',
            size: downloadableRow.dataset.fileSize || '1.2 MB',
            fileTypeLabel: downloadableRow.dataset.fileTypeLabel || 'Archivo'
        };

        showDownloadsContextMenu(event.clientX, event.clientY, fileData);
    });
}

export function openRecycleBinWindow() {
    hideDownloadsContextMenu();
    hideRecycleBinContextMenu();

    const existingWindow = document.getElementById('recycle-bin-window');
    if (existingWindow) {
        existingWindow.remove();
        return;
    }

    const targetContainer = getWindowTargetContainer();
    const win = document.createElement('div');
    win.id = 'recycle-bin-window';
    win.className = 'window-frame';
    win.style.position = 'fixed';
    win.style.top = '120px';
    win.style.left = '240px';
    win.style.width = '640px';
    win.style.height = '420px';
    win.style.zIndex = '9006';
    win.style.display = 'flex';
    win.style.flexDirection = 'column';
    win.style.boxShadow = '0 10px 40px rgba(0,0,0,0.35)';
    win.style.pointerEvents = 'auto';
    win.style.background = '#ffffff';

    const rows = recycleBinItems.map((item) => `
        <div class="explorer-row" title="${item.name}">
            <div class="icon-col"><span class="file-icon-sm">🗑️</span></div>
            <div class="name-col"><span class="file-name">${item.name}</span></div>
            <div class="date-col"><span>${item.deletedAt}</span></div>
            <div class="type-col"><span>${item.type}</span></div>
            <div class="size-col"><span>${item.size}</span></div>
        </div>
    `).join('');

    win.innerHTML = `
        <div class="window-header" style="background:#f3f3f3; border-bottom:1px solid #e0e0e0; display:flex; gap:10px; padding:8px 12px;">
            <span style="font-size:12px;">🗑️ Papelera de reciclaje</span>
            <button class="recycle-close-btn" style="margin-left:auto; background:none; border:none; color:#333; cursor:pointer;">✕</button>
        </div>
        <div class="window-content" style="flex:1; background:white; overflow-y:auto; padding:0;">
            <div class="explorer-header-row" style="display:flex; padding:5px 10px; border-bottom:1px solid #eee; font-size:12px; color:#666;">
                <div style="width:30px;"></div>
                <div style="flex:2;">Nombre</div>
                <div style="flex:1;">Fecha de eliminación</div>
                <div style="flex:1;">Tipo</div>
                <div style="width:80px;">Tamaño</div>
            </div>
            <div style="padding:10px;">
                ${rows || '<div style="padding:25px; color:#666; font-size:13px;">La Papelera de reciclaje está vacía.</div>'}
            </div>
        </div>
        <div style="padding:4px 10px; background:#f3f3f3; border-top:1px solid #e0e0e0; font-size:11px; color:#666;">
            ${recycleBinItems.length} elementos
        </div>
    `;

    targetContainer.appendChild(win);

    const closeButton = win.querySelector('.recycle-close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            win.remove();
        });
    }
}

export function emptyRecycleBin() {
    recycleBinItems.length = 0;

    metrics.scenario7.recycle_bin_emptied = 1;
    const sid = getSessionId();
    if (sid) {
        saveMetrics(sid, {
            'scenario7.recycle_bin_emptied': 1
        }).catch(err => console.warn('Error saving scenario7 recycle bin metric:', err));
    }

    const recycleWindow = document.getElementById('recycle-bin-window');
    if (recycleWindow) {
        recycleWindow.remove();
        openRecycleBinWindow();
    }

    hideRecycleBinContextMenu();
    alert('Papelera vaciada.');
}

export function showRecycleBinContextMenu(event) {
    event.preventDefault();
    hideRecycleBinContextMenu();
    hideDownloadsContextMenu();

    const menu = document.createElement('div');
    menu.className = 'context-menu-windows';
    menu.style.display = 'block';
    menu.style.zIndex = '10030';
    menu.innerHTML = '<div class="context-menu-item" data-action="empty-bin">🧹 Vaciar papelera</div>';

    menu.addEventListener('click', (clickEvent) => {
        const item = clickEvent.target.closest('.context-menu-item');
        if (!item) return;

        if (item.dataset.action === 'empty-bin') {
            emptyRecycleBin();
        }
    });

    document.body.appendChild(menu);

    const maxLeft = window.innerWidth - menu.offsetWidth - 8;
    const maxTop = window.innerHeight - menu.offsetHeight - 8;
    menu.style.left = `${Math.max(8, Math.min(event.clientX, maxLeft))}px`;
    menu.style.top = `${Math.max(8, Math.min(event.clientY, maxTop))}px`;

    recycleBinContextMenuOutsideClickHandler = (outsideEvent) => {
        if (recycleBinContextMenuElement && !recycleBinContextMenuElement.contains(outsideEvent.target)) {
            hideRecycleBinContextMenu();
        }
    };

    recycleBinContextMenuEscapeHandler = (keyEvent) => {
        if (keyEvent.key === 'Escape') {
            hideRecycleBinContextMenu();
        }
    };

    document.addEventListener('click', recycleBinContextMenuOutsideClickHandler);
    document.addEventListener('keydown', recycleBinContextMenuEscapeHandler);

    recycleBinContextMenuElement = menu;
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
    hideRecycleBinContextMenu();

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
