export function getPopupsHTML() {
    return `
        <div id="popup-mfa" class="popup-overlay">
            <div class="popup-content">
                <h3>Extra Security Layer</h3>
                <p>To better protect your account, do you want to activate Multi-Factor Authentication (MFA)?</p>
                <button onclick="window.handleMFA(true)">Yes, Activate MFA</button>
                <button class="secondary" onclick="window.handleMFA(false)">No, Maybe Later</button>
            </div>
        </div>

        <div id="popup-passkey" class="popup-overlay">
            <div class="popup-content">
                <h3>New Technology: Passkeys</h3>
                <p>Would you like to set up a 'Passkey' to access your account without a password in the future?</p>
                <button onclick="window.handlePasskey(true)">Yes, Set Up Passkey</button>
                <button class="secondary" onclick="window.handlePasskey(false)">No, I'll Use My Password</button>
            </div>
        </div>

        <div id="popup-app-perms" class="popup-overlay">
    <div class="popup-content">
        <h3>'TechNova Calendar Sync' solicita permiso para:</h3>
        <ul style="text-align: left; list-style-position: inside;">
            <li>Ver tu información básica de perfil</li>
            <li>Acceder a tu lista de contactos y mensajes privados</li>
            <li>Publicar en tu nombre en TechNova Events</li>
        </ul>
        <button onclick="window.handleAppPerms(true)">Aceptar</button>
        <button class="danger" onclick="window.handleAppPerms(false)">Denegar</button>
    </div>
</div>

        <div id="popup-update" class="popup-overlay">
                <div class="popup-content">
                    <h3>La actualización de características más reciente de Windows ya está disponible</h3>
                    <p>Está lista para instalarse. Con las nuevas características y aplicaciones, esta actualización podría tardar un poco más que las otras.</p>
                    <p style="margin-top: 20px;">Puedes reiniciar ahora o posponer la actualización.</p>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">
                        
                        <button onclick="window.handleUpdate('install')">Reiniciar ahora</button>
                        
                        <button class="secondary" onclick="window.handleUpdate('postpone')">Posponer</button>
                    
                    </div>
                </div>
        </div>
<div id="popup-teams-alert" class="popup-overlay" style="z-index: 9999;">
            <div class="popup-content" style="border-top: 5px solid #464775;"> <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <span style="font-size: 24px; color: #464775;">👥</span>
                    <h3 style="margin:0;">TechNova Teams</h3>
                </div>
                
                <p style="color: #d32f2f; font-weight: bold;">⚠️ Acción Requerida: Caducidad de Credenciales</p>
                <p>Por política de seguridad, tu contraseña de Teams ha expirado hoy.</p>
                <p>Debes establecer una nueva contraseña para no perder el acceso a los chats del equipo.</p>

                <div style="text-align: left; margin-top: 20px; background: #f3f2f1; padding: 15px; border-radius: 4px;">
                    <label style="font-size: 12px; font-weight: bold; color: #666;">NUEVA CONTRASEÑA</label>
                    <input type="password" id="teams-new-pass" placeholder="Introduce nueva contraseña..." style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #999;">
                </div>

                <button onclick="window.handleTeamsAlert()" style="margin-top: 20px; background-color: #464775;">Actualizar y Conectar</button>
            </div>
        </div>
        
        <div id="popup-registration-complete" class="popup-overlay">
            <div class="popup-content">
                <h3>¡Registro completado!</h3>
                <p>Te has registrado de forma correcta en todas tus cuentas.</p>

                <div class="profile-dropdown-container">
                    <button class="profile-button" onclick="window.toggleProfileDropdown()">
                        <div class="profile-avatar">B</div>
                        <div class="profile-info">
                            <span class="profile-name" id="profile-display-name">User</span>
                            <span class="profile-email" id="profile-display-email">user@technova.com</span>
                        </div>
                        <span class="dropdown-arrow">▼</span>
                    </button>

                    <div id="profile-dropdown-menu" class="profile-dropdown-menu" style="display: none;">
                        <div class="dropdown-section">
                            <div class="dropdown-header">Cuentas de TechNova</div>

                            <div class="account-item">
                                <div class="account-icon">📧</div>
                                <div class="account-details">
                                    <div class="account-service">TechNova Correo </div>
                                    <div class="account-username" id="mail-username">-</div>
                                </div>
                            </div>

                            <div class="account-item">
                                <div class="account-icon">☁️</div>
                                <div class="account-details">
                                    <div class="account-service">TechNova Drive</div>
                                    <div class="account-username" id="drive-username">-</div>
                                </div>
                            </div>

                            <div class="account-item">
                                <div class="account-icon">👥</div>
                                <div class="account-details">
                                    <div class="account-service">TechNova Teams</div>
                                    <div class="account-username" id="events-username">-</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button onclick="window.closeRegistrationComplete()" style="margin-top: 20px;">Continue</button>
            </div>
        </div>

<div id="popup-policy-rules" class="popup-overlay">
    <div class="popup-content">
        <h3>📘 Notificación de Seguridad – IT TechNova</h3>
        <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 15px;">
            Antes de comenzar, por favor revise las políticas de uso de plataformas internas. Su cumplimiento es obligatorio.
        </p>

        <div style="text-align: left; padding: 15px; border: 1px solid #cce5ff; background: #e6f3ff; border-radius: 4px; font-size: 0.98em;">
            
            <h4 style="margin-bottom: 8px;">🔐 Política de Privacidad y Uso de Asistentes de IA:</h4>
            <ul style="padding-left: 24px; margin-top: 0;">
                <li style="margin-left: 10px;">No se permite ingresar, copiar o analizar ningún documento que contenga datos personales, financieros o sensibles en el Asistente de IA.</li>
                <li style="margin-left: 10px;">Queda prohibido el uso del asistente para tratar información identificable de empleados, clientes o proveedores.</li>
            </ul>

            <h4 style="margin-top: 18px; margin-bottom: 8px;">🔑 Política de Seguridad de Contraseñas:</h4>
            <ul style="padding-left: 24px; margin-top: 0;">
                <li style="margin-left: 10px;">Debe utilizar una contraseña única y robusta para cada plataforma interna (correo, nube, red social, etc.).</li>
                <li style="margin-left: 10px;">Se recomienda activar la autenticación multifactor (MFA) siempre que esté disponible.</li>
                <li style="margin-left: 10px;">Evite reutilizar contraseñas entre plataformas personales y corporativas.</li>
            </ul>

            <h4 style="margin-top: 18px; margin-bottom: 8px;">📁 Política de Gestión de Información:</h4>
            <ul style="padding-left: 24px; margin-top: 0;">
                <li style="margin-left: 10px;">No está permitido almacenar archivos confidenciales en servicios no autorizados.</li>
                <li style="margin-left: 10px;">Todos los documentos internos deben ser tratados bajo las normas de clasificación de TechNova.</li>
            </ul>
        </div>

        <button onclick="window.acceptPolicyAndStart()" style="margin-top: 25px;">
            He leído y acepto las Políticas de Seguridad
        </button>
    </div>
</div>
    `;
}
// ----------------------------------------------------
// --- NUEVA FUNCIÓN AÑADIDA ---
// ----------------------------------------------------
// Esta es la función que `BreachChecker.jsx` necesita.
// Crea un popup de alerta simple y dinámico.

export function showPopup(title, message) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.display = 'flex'; 

    const content = document.createElement('div');
    content.className = 'popup-content';

    content.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    content.appendChild(closeButton);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
}