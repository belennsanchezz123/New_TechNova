export function getPopupsHTML() {
    return `
        <div id="popup-mfa" class="popup-overlay">
            <div class="popup-content mfa-popup-content">
                <button class="popup-close-btn" onclick="window.skipMFA()" title="Cerrar">×</button>
                <div id="mfa-step-container">
                    <!-- El contenido dinámico se renderizará aquí -->
                </div>
            </div>
        </div>



<div id="popup-passkey" class="popup-overlay">
    <div class="popup-content">
        <h3>
            Nueva Tecnología: Passkeys
            <span class="translation">New Technology: Passkeys</span>
        </h3>

        <p>
            ¿Te gustaría configurar una *Passkey* para acceder a tu cuenta sin contraseña en el futuro?
            <span class="translation">
                Would you like to set up a Passkey to access your account without a password in the future?
            </span>
        </p>

        <button onclick="window.handlePasskey(true)" style="color:white;">
            Sí, Configurar Passkey
            <span class="translation" style="color:white;">Yes, Set Up Passkey</span>
        </button>

        <button class="secondary" onclick="window.handlePasskey(false)" style="color:white;">
            No, Usaré Mi Contraseña
            <span class="translation" style="color:white;">No, I'll Use My Password</span>
        </button>
    </div>
</div>

<!-- Popup de Permisos de Teams (Cámara y Micrófono individualmente) -->
<div id="popup-teams-permissions" class="popup-overlay">
    <div class="popup-content teams-permissions-popup">
        <div class="teams-permission-header">
            <div class="teams-icon">👥</div>
            <h3 style="margin: 0; color: #464775;">TechNova Teams</h3>
        </div>
        
        <div class="teams-permission-body">
            <p style="font-size: 1.05em; margin-bottom: 8px;">
                <strong>TechNova Teams necesita tu permiso</strong>
            </p>
            
            <p style="color: #616161; margin-bottom: 20px; font-size: 0.95em;">
                Para poder realizar videollamadas y reuniones, Teams solicita acceso a los siguientes dispositivos. Puedes decidir individualmente:
            </p>
            
            <!-- Cámara -->
            <div class="permission-item" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; background: #f8f9fa; border-radius: 8px; padding: 14px 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="permission-icon" style="font-size: 1.5em;">📷</div>
                    <div>
                        <div class="permission-title" style="font-weight: 600;">Cámara</div>
                        <div class="permission-description" style="font-size: 0.85em; color: #616161;">Para compartir tu vídeo durante las reuniones</div>
                    </div>
                </div>
                <div style="display: flex; gap: 6px;" id="camera-btns">
                    <button id="cam-allow-btn" onclick="window.setTeamsPermission('camera', true)"
                        style="padding: 6px 14px; border: 2px solid #464775; border-radius: 6px; cursor: pointer;
                               background: white; color: #464775; font-size: 0.85em; font-weight: 600; transition: all 0.2s;">
                        Permitir
                    </button>
                    <button id="cam-block-btn" onclick="window.setTeamsPermission('camera', false)"
                        style="padding: 6px 14px; border: 2px solid #d32f2f; border-radius: 6px; cursor: pointer;
                               background: white; color: #d32f2f; font-size: 0.85em; font-weight: 600; transition: all 0.2s;">
                        Bloquear
                    </button>
                </div>
            </div>

            <!-- Micrófono -->
            <div class="permission-item" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; background: #f8f9fa; border-radius: 8px; padding: 14px 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="permission-icon" style="font-size: 1.5em;">🎤</div>
                    <div>
                        <div class="permission-title" style="font-weight: 600;">Micrófono</div>
                        <div class="permission-description" style="font-size: 0.85em; color: #616161;">Para que puedas hablar en las llamadas</div>
                    </div>
                </div>
                <div style="display: flex; gap: 6px;" id="mic-btns">
                    <button id="mic-allow-btn" onclick="window.setTeamsPermission('mic', true)"
                        style="padding: 6px 14px; border: 2px solid #464775; border-radius: 6px; cursor: pointer;
                               background: white; color: #464775; font-size: 0.85em; font-weight: 600; transition: all 0.2s;">
                        Permitir
                    </button>
                    <button id="mic-block-btn" onclick="window.setTeamsPermission('mic', false)"
                        style="padding: 6px 14px; border: 2px solid #d32f2f; border-radius: 6px; cursor: pointer;
                               background: white; color: #d32f2f; font-size: 0.85em; font-weight: 600; transition: all 0.2s;">
                        Bloquear
                    </button>
                </div>
            </div>
            
            <div class="teams-permission-note">
                <span style="font-size: 0.9em; color: #616161;">
                    ℹ️ Puedes cambiar estos permisos en cualquier momento desde la configuración del navegador.
                </span>
            </div>
        </div>
        
        <div class="teams-permission-actions">
            <button id="teams-confirm-btn" onclick="window.handleTeamsPermissions()"
                class="teams-allow-btn"
                disabled
                style="opacity: 0.4; cursor: not-allowed;">
                Confirmar
            </button>
        </div>
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

        <h3>
            La actualización de características más reciente de Windows ya está disponible
            <span class="translation">The latest Windows feature update is now available</span>
        </h3>

        <p>
            Está lista para instalarse. Con las nuevas características y aplicaciones, esta actualización podría tardar un poco más que las otras.
            <span class="translation">
                It is ready to install. With the new features and applications, this update may take a bit longer than previous ones.
            </span>
        </p>

        <p style="margin-top: 20px;">
            Puedes reiniciar ahora o posponer la actualización.
            <span class="translation">
                You can restart now or postpone the update.
            </span>
        </p>

        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">

            <button onclick="window.handleUpdate('install')" style="color:white;">
                Reiniciar ahora
                <span class="translation" style="color:white;">Restart Now</span>
            </button>

            <button class="secondary" onclick="window.handleUpdate('postpone')" style="color:white;">
                Posponer
                <span class="translation" style="color:white;">Postpone</span>
            </button>

        </div>

    </div>
</div>
<div id="popup-teams-alert" class="popup-overlay" style="z-index: 9999;">
            <div class="popup-content" style="border-top: 5px solid #464775;"> <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <span style="font-size: 24px; color: #464775;">👥</span>
                    <h3 style="margin:0;">TechNova Teams</h3>
                </div>
                
                <p style="color: #d32f2f; font-weight: bold;">
                ⚠️ Acción Requerida: Caducidad de Credenciales
                <span class="translation">Action Required: Credential Expiration</span>
                </p>
                
                <p>
                Por política de seguridad, tu contraseña de Teams ha expirado hoy.
                <span class="translation">
                Due to security policy, your Teams password has expired today.
                </span>
                </p>
                
                <p>
                Debes establecer una nueva contraseña para no perder el acceso a los chats del equipo.
                <span class="translation">
                You must set a new password to avoid losing access to the team chats.
                </span>
                </p>

                <div style="text-align: left; margin-top: 20px; background: #f3f2f1; padding: 15px; border-radius: 4px;">
                    <label style="font-size: 12px; font-weight: bold; color: #666;">NUEVA CONTRASEÑA
                    </label>
                    <input type="password" id="teams-new-pass" placeholder="Introduce nueva contraseña..." style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #999;">
                </div>

                <button onclick="window.handleTeamsAlert()" style="margin-top: 20px; background-color: #464775;">
                Actualizar y Conectar
                <span class="translation" style="color:white;">Update and Connect</span>
                </button>
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
                        <div class="dropdown-footer" style="padding: 10px; border-top: 1px solid #eee; text-align: center;">
                            <button onclick="window.finalizeSession()" style="width: 100%; padding: 8px; background: #f3f2f1; color: #333; border: 1px solid #ccc; font-size: 13px; border-radius: 4px;">
                                🚪 Finalizar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                <button onclick="window.closeRegistrationComplete()" style="margin-top: 20px;">Continue</button>
            </div>
        </div>

<div id="popup-policy-rules" class="popup-overlay">
    <div class="popup-content">

        <h3>
            📘 Notificación de Seguridad – IT TechNova
            <span class="translation">📘 Security Notice – IT TechNova</span>
        </h3>

        <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 15px;">
            Antes de comenzar, por favor revise las políticas de uso de plataformas internas. Su cumplimiento es obligatorio.
            <span class="translation">
                Before starting, please review the policies for the use of internal platforms. Compliance is mandatory.
            </span>
        </p>

        <div style="text-align: left; padding: 15px; border: 1px solid #cce5ff; background: #e6f3ff; border-radius: 4px; font-size: 0.98em;">

            <!-- Política IA -->
            <h4 style="margin-bottom: 8px;">
                🔐 Política de Privacidad y Uso de Asistentes de IA:
                <span class="translation">🔐 Privacy Policy and Use of AI Assistants:</span>
            </h4>

            <ul style="padding-left: 24px; margin-top: 0;">
                <li style="margin-left: 10px;">
                    No se permite ingresar, copiar o analizar ningún documento que contenga datos personales, financieros o sensibles en el Asistente de IA.
                    <span class="translation">
                        It is not permitted to enter, copy, or analyze any document containing personal, financial, or sensitive data in the AI Assistant.
                    </span>
                </li>

                <li style="margin-left: 10px;">
                    Queda prohibido el uso del asistente para tratar información identificable de empleados, clientes o proveedores.
                    <span class="translation">
                        The assistant must not be used to process identifiable information of employees, clients, or suppliers.
                    </span>
                </li>
            </ul>

            <!-- Política de Contraseñas -->
            <h4 style="margin-top: 18px; margin-bottom: 8px;">
                🔑 Política de Seguridad de Contraseñas:
                <span class="translation">🔑 Password Security Policy:</span>
            </h4>

            <ul style="padding-left: 24px; margin-top: 0;">
                <li style="margin-left: 10px;">
                    Debe utilizar una contraseña única y robusta para cada plataforma interna (correo, nube, red social, etc.).
                    <span class="translation">
                        You must use a strong and unique password for each internal platform (email, cloud, network, etc.).
                    </span>
                </li>

                <li style="margin-left: 10px;">
                    Se recomienda activar la autenticación multifactor (MFA) siempre que esté disponible.
                    <span class="translation">
                        It is recommended to enable multi-factor authentication (MFA) whenever available.
                    </span>
                </li>

                <li style="margin-left: 10px;">
                    Evite reutilizar contraseñas entre plataformas personales y corporativas.
                    <span class="translation">
                        Avoid reusing passwords across personal and corporate platforms.
                    </span>
                </li>
            </ul>

            <!-- Política de Gestión de Información -->
            <h4 style="margin-top: 18px; margin-bottom: 8px;">
                📁 Política de Gestión de Información:
                <span class="translation">📁 Information Management Policy:</span>
            </h4>

            <ul style="padding-left: 24px; margin-top: 0;">
                <li style="margin-left: 10px;">
                    No está permitido almacenar archivos confidenciales en servicios no autorizados.
                    <span class="translation">
                        It is not permitted to store confidential files on unauthorized services.
                    </span>
                </li>

                <li style="margin-left: 10px;">
                    Todos los documentos internos deben ser tratados bajo las normas de clasificación de TechNova.
                    <span class="translation">
                        All internal documents must be handled following TechNova’s classification standards.
                    </span>
                </li>
            </ul>
        </div>

        <div style="text-align: center;">
        <button onclick="window.acceptPolicyAndStart()" style="margin-top: 25px; color: white;">
            He leído y acepto las Políticas de Seguridad
            <span class="translation" style="color: white;">I have read and accept the Security Policies</span>
        </button>
        </div>


    </div>
</div>

<div id="popup-marta-msg" class="popup-overlay" style="align-items: flex-start; padding-top: 100px;">
    <div class="popup-content" style="border-left: 5px solid #6264a7; width: 450px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; background: #6264a7; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">M</div>
                <h3 style="margin: 0; color: #6264a7;">Marta (RRHH)</h3>
            </div>
            <button onclick="window.closeMartaMessage()" style="background: none; border: none; font-size: 20px; color: #666; cursor: pointer;">×</button>
        </div>
        
        <p style="font-size: 1.05em; line-height: 1.5; color: #333;">
            "¡Oye! Perdona que te escriba así pero es que <strong>el CEO ya me está preguntando por el informe Q4</strong> y me pilla a medias... 😳 ¿Me puedes hacer el favor de mandármelo ya con lo que saques del chat? Hazlo como veas más rápido, ¡gracias!"
        </p>

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