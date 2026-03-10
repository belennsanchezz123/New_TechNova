// Componente HTML de la barra de tareas de Windows
export function getTaskbarHTML() {
    return `
        <div id="windows-taskbar" class="windows-taskbar" style="display: none;">
            <div class="taskbar-left">
                <button class="taskbar-start-btn" title="Inicio" onclick="window.toggleStartMenu()">
                    <span class="windows-logo">🪟</span>
                </button>
                <button class="taskbar-search-btn" title="Buscar">
                    <span class="search-icon">🔍</span>
                </button>
            </div>
            
            <div class="taskbar-center">
                <div class="taskbar-app-icon active" title="TechNova Mail">
                    <span>📧</span>
                </div>
                <div class="taskbar-app-icon active" title="TechNova Drive">
                    <span>☁️</span>
                </div>
                <div class="taskbar-app-icon active" title="TechNova Teams">
                    <span>👥</span>
                </div>
            </div>
            
            <div class="taskbar-right">
                <div class="system-tray">
                    <button class="system-icon" id="download-indicator" style="display:none;" title="Descargando..." onclick="window.toggleDownloadsWindow()">
                        <span>⬇️</span>
                    </button>
                    <button class="system-icon" id="update-indicator" style="display:none;" title="Actualización disponible" onclick="window.openUpdateNotificationFromTaskbar()">
                        <span>🔄</span>
                    </button>
                    <button class="system-icon" id="wifi-icon-taskbar" onclick="window.toggleWifiMenu()" title="Red">
                        <span id="wifi-icon-status">📡</span>
                    </button>
                    
                    <!-- Menú WiFi desplegable estilo Windows -->
                    <div id="wifi-menu" class="wifi-dropdown-menu" style="display: none;">
                        <div class="wifi-header-row">
                            <span class="wifi-title">Wi-Fi</span>
                            <div class="wifi-toggle">
                                <span class="toggle-switch checked"></span>
                            </div>
                        </div>
                        
                        <div class="wifi-networks-list">
                            <!-- Opción 1: Red Abierta -->
                            <div class="wifi-item" onclick="window.connectWifi('public')">
                                <div class="wifi-icon-wrapper">
                                    <span class="wifi-icon">📡</span>
                                </div>
                                <div class="wifi-info">
                                    <span class="wifi-name">TechNova_Public</span>
                                    <span class="wifi-status-text">Abierta</span>
                                </div>
                                <div class="wifi-actions">
                                    <span class="info-icon">ℹ️</span>
                                </div>
                            </div>
                            
                            <!-- Opción 2: Red Segura -->
                            <div class="wifi-item" onclick="window.connectWifi('secure')">
                                <div class="wifi-icon-wrapper">
                                    <span class="wifi-icon">🔒</span>
                                </div>
                                <div class="wifi-info">
                                    <span class="wifi-name">TechNova_Corp_Secure</span>
                                    <span class="wifi-status-text">Segura</span>
                                </div>
                                <div class="wifi-actions">
                                    <span class="info-icon">ℹ️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="system-icon" title="Volumen">
                        <span>🔊</span>
                    </button>
                    <button class="system-icon" title="Batería">
                        <span>🔋</span>
                    </button>
                </div>
                <div class="taskbar-clock" id="taskbar-clock">
                    <div class="clock-time">10:00</div>
                    <div class="clock-date">20/01/2026</div>
                </div>
            </div>
        </div>
        
        <!-- Notificación de actualización -->
        <div id="update-notification" class="update-notification hidden">
            <div class="notification-header">
                <span class="notification-icon">🔄</span>
                <span class="notification-title">Windows Update</span>
                <button class="notification-close" onclick="window.dismissUpdateNotification()">×</button>
            </div>
            <div class="notification-body">
                <p><strong>Es necesario reiniciar para completar la instalación</strong></p>
                <p style="font-size: 0.9em; color: #666;">
                    Se han instalado actualizaciones importantes que requieren reiniciar el equipo.
                </p>
            </div>
            <div class="notification-actions">
                <button class="btn-restart" onclick="window.restartSystem()">
                    Reiniciar ahora
                </button>
                <button class="btn-postpone" onclick="window.showPostponeOptions()">
                    Posponer
                </button>
                <button class="btn-ignore" onclick="window.dismissUpdateNotification('Ignored')">
                    Ignorar
                </button>
            </div>
        </div>

        <!-- Ventana de opciones para posponer actualización -->
        <div id="update-postpone-options" class="update-notification hidden update-postpone-options">
            <div class="notification-header">
                <span class="notification-icon">⏰</span>
                <span class="notification-title">Posponer actualización</span>
                <button class="notification-close" onclick="window.closePostponeOptions()">×</button>
            </div>
            <div class="notification-body">
                <p><strong>¿Cuánto tiempo quieres posponer?</strong></p>
            </div>
            <div class="postpone-options-grid">
                <button class="btn-postpone-choice" onclick="window.postponeUpdate(900000, '15 minutos')">En 15 min</button>
                <button class="btn-postpone-choice" onclick="window.postponeUpdate(3600000, '1 hora')">En 1 hora</button>
                <button class="btn-postpone-choice" onclick="window.postponeUpdate(86400000, '24 horas')">En 24 horas</button>
            </div>
            <div class="notification-actions">
                <button class="btn-ignore" onclick="window.closePostponeOptions()">Cancelar</button>
            </div>
        </div>
        
        <!-- Pantalla de reinicio -->
        <div id="restart-screen" class="restart-screen hidden">
            <div class="restart-content">
                <div class="restart-spinner"></div>
                <h2 class="restart-title">Reiniciando</h2>
                <p class="restart-message">No apagues el equipo</p>
                <div class="restart-progress">
                    <div class="restart-progress-bar" id="restart-progress-bar"></div>
                </div>
                <p class="restart-percentage" id="restart-percentage">0%</p>
            </div>
        </div>
            </div>
        </div>

        <!-- Menú de Inicio (Estilo Windows 11) -->
        <div id="start-menu" class="start-menu hidden">
            <div class="start-menu-search">
                <span class="search-icon-input">🔍</span>
                <input type="text" placeholder="Buscar aplicaciones, configuraciones y documentos" readonly>
            </div>
            
            <div class="start-menu-pinned">
                <div class="pinned-header">
                    <span>Anclado</span>
                    <button class="btn-all-apps">Todos ></button>
                </div>
                
                <div class="pinned-grid">
                    <div class="pinned-item" title="Microsoft Edge">
                        <span class="pinned-icon">🌐</span>
                        <span class="pinned-name">Edge</span>
                    </div>
                    <div class="pinned-item" title="Microsoft 365">
                        <span class="pinned-icon">🟦</span>
                        <span class="pinned-name">Office</span>
                    </div>
                    <div class="pinned-item" title="Outlook">
                        <span class="pinned-icon">📧</span>
                        <span class="pinned-name">Outlook</span>
                    </div>
                    <div class="pinned-item" title="Microsoft Store">
                        <span class="pinned-icon">🛍️</span>
                        <span class="pinned-name">Store</span>
                    </div>
                    <div class="pinned-item" title="Fotos">
                        <span class="pinned-icon">🖼️</span>
                        <span class="pinned-name">Fotos</span>
                    </div>
                    <div class="pinned-item" title="Configuración">
                        <span class="pinned-icon">⚙️</span>
                        <span class="pinned-name">Ajustes</span>
                    </div>
                    <div class="pinned-item" title="Solitario">
                        <span class="pinned-icon">🃏</span>
                        <span class="pinned-name">Solitario</span>
                    </div>
                    <div class="pinned-item" title="Paint">
                        <span class="pinned-icon">🎨</span>
                        <span class="pinned-name">Paint</span>
                    </div>
                    <!-- ITEM CLAVE: Explorador de Archivos -->
                    <div class="pinned-item" onclick="window.toggleDownloadsWindow(); window.toggleStartMenu();" title="Explorador de archivos">
                        <span class="pinned-icon">📁</span>
                        <span class="pinned-name">Explorador</span>
                    </div>
                    <div class="pinned-item" title="Calculadora">
                        <span class="pinned-icon">🧮</span>
                        <span class="pinned-name">Calc</span>
                    </div>
                    <div class="pinned-item" title="Reloj">
                        <span class="pinned-icon">⏰</span>
                        <span class="pinned-name">Reloj</span>
                    </div>
                    <div class="pinned-item" title="Bloc de notas">
                        <span class="pinned-icon">📝</span>
                        <span class="pinned-name">Notas</span>
                    </div>
                    <div class="pinned-item" onclick="window.openRecycleBinWindow(); window.toggleStartMenu();" oncontextmenu="window.showRecycleBinContextMenu(event)" title="Papelera de reciclaje">
                        <span class="pinned-icon">🗑️</span>
                        <span class="pinned-name">Papelera</span>
                    </div>
                </div>
            </div>

            <div class="start-menu-footer">
                <div class="user-profile">
                    <div class="user-avatar-sm">👤</div>
                    <span class="user-name-sm">Usuario</span>
                </div>
                <button class="power-btn" title="Inicio/Apagado" onclick="window.finalizeSession()">⏻</button>
            </div>
        </div>
    `;
}
