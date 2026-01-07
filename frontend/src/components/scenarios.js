function generateQuestionGroup(title, questions, groupIndex) {
  // Genera el HTML para una sola pregunta (fila)
  const generateQuestionHTML = (question, qIndex) => {
    const questionName = `q_${groupIndex}_${qIndex}`;
    return `
            <div class="question-row">
                <div class="question-label">${question}</div>
                <div class="radio-group-horizontal">
                    <label><input type="radio" name="${questionName}" value="1"> 1</label>
                    <label><input type="radio" name="${questionName}" value="2"> 2</label>
                    <label><input type="radio" name="${questionName}" value="3"> 3</label>
                    <label><input type="radio" name="${questionName}" value="4"> 4</label>
                    <label><input type="radio" name="${questionName}" value="5"> 5</label>
                </div>
            </div>
        `;
  };

  // Crea el bloque completo del grupo
  return `
        <div class="question-section-taxonomy">
            <h3>${title}</h3>
            ${questions.map((q, i) => generateQuestionHTML(q, i)).join("")}
        </div>
    `;
}
export function getScenarioHTML(scenarioNumber) {
  const scenarios = {
    0: `
            <h2>
                ¡Bienvenido a TechNova!
                <span class="translation">Welcome to TechNova!</span>
            </h2>
            <p>
                Este laboratorio virtual simula tu primer día laboral en la empresa tecnológica TechNova.
                <span class="translation">This virtual lab simulates your first working day at the tech company TechNova.</span>
            </p>
            
            <p>A lo largo de tu jornada, deberás completar varias tareas típicas de incorporación digital.
                <span class="translation">Throughout your day, you will need to complete several typical digital onboarding tasks.</span>
            </p>

            <div class="participant-id-form" style="margin: 30px 0;">
                <label for="participant-id-input" style="display: block; margin-bottom: 8px; font-weight: bold;">
                    ID de Participante (proporcionado por el investigador):
                    <span class="translation">Participant ID (provided by the researcher):</span>
                </label>
                <input type="text" id="participant-id-input" placeholder="e.g., P001" style="padding: 8px; width: 200px; margin-bottom: 5px;" />
                <p class="error-message" id="participant-id-error" style="display: none; color: #d32f2f; margin: 5px 0; font-size: 0.9em;">
                    Por favor, introduce un ID de Participante válido
                    <span class="translation">Please enter a valid Participant ID</span>
                </p>
            </div>
            <button onclick="window.validateAndStart()" style="color:white;">
            Comenzar Simulación
            <span class="translation" style="display:block; font-size:0.8em; font-style:normal; color:white;">
            Begin Simulation
            </span>
            </button>
        `,
    1: `
            <h2>
            Escenario 1: Conectividad y Configuración de Cuentas
            <span class="translation">Scenario 1: Connectivity and Account Setup</span>
            </h2>

            <div id="wifi-task-container">
            <p>
                <strong>Instrucción:</strong> Es tu primer día. Enciendes tu portátil pero <strong>no tienes conexión a internet</strong>.
                <span class="translation">
                <strong>Instruction:</strong> It’s your first day. You turn on your laptop but <strong>you have no internet connection</strong>.
                </span>
            </p>

            <p>
                Antes de poder registrarte en los servicios, debes conectarte a la red corporativa.
                <span class="translation">
                Before you can sign up for the services, you must connect to the corporate network.
                </span>
            </p>

            <div style="height: 350px; background: linear-gradient(135deg, #0060a9 0%, #0078d7 100%); position: relative; border: 1px solid #333; margin-top: 20px; border-radius: 4px;">

                    <div id="wifi-menu" class="wifi-menu">
                        <div class="wifi-header">Redes disponibles</div>
                        <div class="wifi-list">
                            <div class="wifi-item" onclick="window.connectWifi('public')">
                                <span class="wifi-signal">📶</span>
                                <div class="wifi-details">
                                    <div class="wifi-name">Free_Coffee_Guest</div>
                                    <div class="wifi-status">Abierta</div>
                                </div>
                            </div>
                            <div class="wifi-item" onclick="window.connectWifi('secure')">
                                <span class="wifi-signal">🔒</span>
                                <div class="wifi-details">
                                    <div class="wifi-name">TechNova_Corp_Secure</div>
                                    <div class="wifi-status">Segura (WPA2-Ent)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="taskbar">
                        <span style="margin-right: auto; color: white; padding-left: 10px; font-size: 12px;">9:00 AM</span>
                        <div class="taskbar-icon" onclick="window.toggleWifiMenu()">
                            <span id="wifi-icon-status">🌐</span>
                        </div>
                        <div class="taskbar-icon">🔋</div>
                    </div>
                </div>
            </div>

            <div id="registration-content" style="display: none;">
                <p style="background: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
                    ✅ <strong>Conexión Establecida.</strong> Ahora tienes acceso a la intranet para crear tus cuentas.
                </p>

                <div id="registration-forms">
                    <div class="form-group" id="technova-mail-form">
                        <h3>📧 1. Registrarse en TechNova Mail
                        <span class="translation"> Register in TechNova Mail</span>
                        </h3>
                        <label for="mail-user">Usuario:</label>
                        <input type="text" id="mail-user" placeholder="">
                        <label for="mail-pass">Contraseña:</label>
                        <input type="password" id="mail-pass">
                        <button onclick="window.registerService('mail')">
                        Crear Cuenta de TechNova Mail
                        <span class="translation" style="color:white;">Create TechNova Mail Account</span>
                        </button>
                    </div>
                    
                    <div class="form-group" id="technova-drive-form" style="display:none;">
                        <h3>💾 2. Registrarse en TechNova Drive
                        <span class="translation">Register in TechNova Drive</span></h3>
                        <p>Ahora, regístrate en TechNova Drive, nuestro sistema de almacenamiento en la nube.
                         <span class="translation">
                        Now, register in TechNova Drive, our cloud storage system.
                        </span>
                        </p>
                         <label for="drive-user">Usuario:</label>
                        <input type="text" id="drive-user" placeholder="">
                        <label for="drive-pass">Contraseña:</label>
                        <input type="password" id="drive-pass">
                        <button onclick="window.registerService('drive')">Crear Cuenta de TechNova Drive
                        <span class="translation" style="color:white;">Create TechNova Drive Account</span>
                        </button>
                    </div>

                    <div class="form-group" id="technova-events-form" style="display:none;">
                        <h3>👥 3. Registrarse en TechNova Events
                        <span class="translation">Register in TechNova Events</span>
                        </h3>
                        <p>Finalmente, crea tu perfil en TechNova Events, la red social interna.
                        <span class="translation">
                        Finally, create your profile in TechNova Events, the internal social network.
                        </span>
                        </p>
                        <label for="events-user">Usuario:</label>
                        <input type="text" id="events-user" placeholder="">
                        <label for="events-pass">Contraseña:</label>
                        <input type="password" id="events-pass">
                        <button onclick="window.registerService('events')">Crear Cuenta de TechNova Events
                        <span class="translation" style="color:white;">Create TechNova Events Account</span>
                        </button>
                    </div>
                </div>
            </div>
        `,
    2: `
            <h2>
    Escenario 2: Dispositivos Externos
    <span class="translation">Scenario 2: External Devices</span>
</h2>

<div id="simulated-lock-screen">
    <div class="lock-screen-content">
        <div class="lock-screen-icon">🖥️</div>

        <h1>
            Sesión Suspendida
            <span class="translation">Session Suspended</span>
        </h1>

        <p>
            (Simulación de Bloqueo de Pantalla)
            <span class="translation">(Simulated Lock Screen)</span>
        </p>

        <div class="lock-screen-prompt">
            Presiona la tecla <strong>'v'</strong> para volver y continuar.
            <span class="translation">Press the <strong>'v'</strong> key to return and continue.</span>
        </div>
    </div>
</div>

<div id="task-interruption">
    <p>
        <strong>Instrucción:</strong> Necesitas encontrar y descargar una plantilla de cronograma de proyectos 
        para tu equipo, que debe presentarse en la reunión del lunes. Para eso, usa el navegador asociado.
        <span class="translation">
            <strong>Instruction:</strong> You need to find and download a project schedule template for your team, 
            which must be presented at Monday’s meeting. To do this, use the assigned browser.
        </span>
    </p>

    <div style="display: flex; justify-content: space-around; gap: 10px; margin-top: 25px;">

        <button onclick="window.handleInterruption(true)" style="flex: 1; background: #6c757d; color: white;">
            🖥️ Suspender sesión
             <span class="translation" style="color:white;">Suspend Session</span>
        </button>

        <button onclick="window.handleInterruption(false)" style="flex: 1; color: white;">
            Continuar ➡️
             <span class="translation" style="color:white;">Continue</span>
        </button>

    </div>
</div>


            <div id="task-usb" style="display:none;">
                <h3>Manejo de Dispositivos Externos
                <span class="translation">Handling External Devices</span>
                </h3>
                <p><strong>Instrucción:</strong> Se ha conectado un dispositivo USB. Por favor, navega hasta él y abre el archivo <strong>'Bienvenida_Equipo_TechNova.docx'</strong>.
                <span class="translation">
                <strong>Instruction:</strong> A USB device has been connected. Please navigate to it and open the file 
                <strong>'Welcome_TechNova_Team.docx'</strong>.
                </span>
                </p>
    
                <div class="file-explorer-window">
                    <div class="fe-header">
                        <div class="fe-arrows">← → ↻</div>
                        <div class="fe-path">Este equipo</div>
                    </div>
                    <div class="fe-body">
                        <div class="fe-sidebar">
                            <ul>
                                <li id="sidebar-documents">▷ Documentos</li>
                                <li id="sidebar-images">▷ Imágenes</li>
                                <li id="sidebar-this-pc" class="active">▶ Este equipo</li>
                                <li id="sidebar-drive-c" style="padding-left: 20px;">▷ Disco local (C:)</li>
                                <li id="sidebar-network">▷ Red</li>
                            </ul>
                        </div>
                        <div class="fe-main">
                            <div id="this-pc-view">
                                <p class="fe-group-title">Dispositivos y unidades (2)</p>
                                <div class="fe-item" id="drive-c">
                                    <div class="fe-icon">💻</div>
                                    <div class="fe-item-details">
                                        <span>Disco local (C:)</span>
                                        <div class="progress-bar"><div style="width: 55%;"></div></div>
                                </div>
                            </div>
                            <div class="fe-item-usb-drive" id="usb-drive">
                                <div class="usb-icon-container">
                                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="8" y="4" width="16" height="24" rx="2" fill="#4A4A4A"/>
                                        <rect x="10" y="6" width="12" height="18" fill="#5A5A5A"/>
                                        <rect x="14" y="25" width="4" height="3" fill="#3A3A3A"/>
                                        <rect x="12" y="8" width="8" height="2" fill="#7A7A7A"/>
                                    </svg>
                                </div>
                                <span class="usb-label">USB Drive (F:)</span>
                            </div>
                        </div>

                        <div id="drive-c-view" style="display:none;">
                            <div class="fe-item">
                                <div class="fe-icon">📁</div>
                                <div class="fe-item-details"><span>Archivos de programa</span></div>
                            </div>
                            <div class="fe-item">
                                <div class="fe-icon">📁</div>
                                <div class="fe-item-details"><span>Windows</span></div>
                            </div>
                            <div class="fe-item">
                                <div class="fe-icon">📁</div>
                                <div class="fe-item-details"><span>Usuarios</span></div>
                            </div>
                        </div>

                        <div id="network-view" style="display:none;">
                            <div class="fe-item">
                                <div class="fe-icon">🖥️</div>
                                <div class="fe-item-details"><span>SERVIDOR-OFICINA</span></div>
                            </div>
                            <div class="fe-item">
                                <div class="fe-icon">🖥️</div>
                                <div class="fe-item-details"><span>PC-SALA-02</span></div>
                            </div>
                        </div>

                        <div id="documents-view" style="display:none;">
                            <div class="fe-item">
                                <div class="fe-icon">📄</div>
                                <div class="fe-item-details"><span>Informe_2024.docx</span></div>
                            </div>
                            <div class="fe-item">
                                <div class="fe-icon">📄</div>
                                <div class="fe-item-details"><span>Presupuesto.xlsx</span></div>
                            </div>
                        </div>

                        <div id="images-view" style="display:none;">
                            <div class="fe-item">
                                <div class="fe-icon">🖼️</div>
                                <div class="fe-item-details"><span>vacaciones_2024.jpg</span></div>
                            </div>
                            <div class="fe-item">
                                <div class="fe-icon">🖼️</div>
                                <div class="fe-item-details"><span>logo_empresa.png</span></div>
                            </div>
                        </div>

                        <div id="usb-content-view" style="display:none;">
                            <div class="fe-item" id="file-mapa">
                                <div class="fe-icon">📄</div>
                                <div class="fe-item-details"><span>Bienvenida_Equipo_TechNova.docx</span></div>
                            </div>
                        <div class="fe-item" id="file-fotos">
                            <div class="fe-icon">📄</div>
                            <div class="fe-item-details"><span>Bienvenida_Equipo_TechNova_BORRADOR.docx</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="usb-context-menu" class="context-menu-windows">
            <div class="context-menu-item">Expandir</div>
            <div class="context-menu-item">Abrir Reproducción automática...</div>
            <div class="context-menu-item context-menu-highlight" id="usb-context-scan">
                <span class="context-menu-icon">🛡️</span>
                Analizar con Antivirus...
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item">Incluir en biblioteca</div>
            <div class="context-menu-item">Anclar al Acceso rápido</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item">Formatear...</div>
            <div class="context-menu-item">Expulsar</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item">Cortar</div>
            <div class="context-menu-item">Copiar</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item">Cambiar nombre</div>
            <div class="context-menu-item">Propiedades</div>
        </div>

        <div id="antivirus-scanning-modal" class="modal" style="display:none;">
            <div class="modal-content">
                <h3> Antivirus</h3>
                <p>Analizando EVENT_FILES (E:)...</p>
                <div class="scanning-progress">
                    <div class="scanning-bar"></div>
                </div>
                <p class="scanning-status">Escaneando archivos...</p>
            </div>
        </div>
        </div>
        `,
    3: `
           <h2>
                Escenario 3: Gestión de Comunicaciones
                <span class="translation">Scenario 3: Communications Management</span>
            </h2>
            <p>
            <strong>Instrucción:</strong> Es hora de revisar tu bandeja de entrada de <strong>TechNova Mail</strong>.
            <span class="translation">
            <strong>Instruction:</strong> It’s time to check your <strong>TechNova Mail</strong> inbox.
            </span>
            </p>
            <p>
            Tu gerente te ha enviado mensajes importantes sobre tu incorporación.
            <span class="translation">
            Your manager has sent you important messages regarding your onboarding.
            </span>
            </p>
            <p>
            Lee y manéjalos como lo harías en un entorno profesional, prestando especial atención al remitente y al contenido. 
            <strong>Para interactuar con un correo (responder, reportar, etc.), haz clic derecho sobre él en la bandeja de entrada.</strong>
            <span class="translation">
            Read and handle them as you would in a professional environment, paying special attention to the sender and the content. 
            <strong>To interact with an email (reply, report, etc.), right-click on it in the inbox.</strong>
            </span>
            </p>
            <div style="margin-bottom: 10px;">
                <button onclick="window.openComposeEmail()">Nuevo Correo</button>
            </div>
            <div class="email-client">
                <div class="email-list" id="email-list"></div>
                <div class="email-view" id="email-view">
                    <p>Selecciona un correo para leerlo.</p>
                </div>
            </div>
            <hr>
            <div id="ai-task" style="margin-top:20px;">
                 <h3>Task: Usar el Asistente IA</h3>
                 <p>
                    <strong>Instrucción:</strong> Ahora debes revisar dos documentos internos para apoyar a tu jefa en una reunión estratégica.
                    <span class="translation">
                    <strong>Instruction:</strong> You must now review two internal documents to support your manager in a strategic meeting.
                    </span>
                </p>
                 <textarea id="ai-input" rows="6" style="width: 98%;" placeholder="Pega el contenido aquí para el Asistente de IA..."></textarea>
                 <button onclick="window.useAI()">Enviar</button>
            </div>
             <div id="send-doc-task" style="margin-top:20px;">
             <h3>
                Tarea: Mandar documento sensible
                <span class="translation">Task: Send Sensitive Document</span>
            </h3>
            <p>
                <strong>Instrucción:</strong> Ahora manda el documento resumido a tu jefe vía email a 
                <strong>'elena_sanchezr@technova.com'</strong>.
                 <span class="translation">
                <strong>Instruction:</strong> Now send the summarized document to your manager via email at 
                <strong>'elena_sanchezr@technova.com'</strong>.
                </span>
            </p>
            <p>
                Utiliza el correo electrónico anterior para redactar un nuevo mensaje y adjuntar el documento.
                <span class="translation">
                Use the email client above to compose a new message and attach the document.
                </span>
            </p>
            </div>
        `,
    4: `
<h2>
    Escenario 4: Búsqueda y Descarga de Recursos
    <span class="translation">Scenario 4: Resource Search & Download</span>
</h2>

<p>
    <strong>Instrucción:</strong> Usa el navegador para buscar en Internet y descargar una <strong>plantilla de cronograma de proyectos</strong>.
    <span class="translation">
        <strong>Instruction:</strong> Use the browser to search online and download a <strong>project schedule template</strong>.
    </span>
</p>
            <div class="browser-container">
                <div class="browser-header">
                    <div class="browser-tabs">
                        <div class="browser-tab active">
                            <span>🔍 Nueva pestaña</span>
                        </div>
                    </div>
                </div>
                <div class="browser-toolbar">
                    <div class="browser-nav-buttons">
                        <button id="browser-back" class="browser-nav-btn" disabled>←</button>
                        <button id="browser-forward" class="browser-nav-btn" disabled>→</button>
                        <button id="browser-refresh" class="browser-nav-btn">⟳</button>
                    </div>
                    <div class="browser-address-bar">
                        <button class="browser-info-btn" id="browser-info-btn" title="Información de la conexión">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                <path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <span class="browser-secure-icon" id="browser-secure-icon">🔒</span>
                        <input type="text" id="browser-url" placeholder="Buscar o introducir dirección web" value="" readonly>
                    </div>
                    <div class="browser-site-info" id="browser-site-info">
                        </div>
                </div>
                <div id="browser-viewport">
                    <div id="browser-content">
                        </div>
                </div>
            </div>
            <div id="update-notification" class="update-notification">
                <div class="notification-header">
                    <span>🔔 Notificación de Windows</span>
                    <button class="notification-close" onclick="this.parentNode.parentNode.style.display='none';">×</button>
                </div>
                <div class="notification-body">
                    <p id="notification-message"></p>
                </div>
            </div>
        `,
    5: `
            <h2>
    Escenario 5: Redes Sociales y Privacidad
    <span class="translation">Scenario 5: Social Media and Privacy</span>
</h2>

<div id="profile-task">

    <h3>
        Completa tu Perfil en TechNova Events
        <span class="translation">Complete Your Profile on TechNova Events</span>
    </h3>

    <p>
        <strong>Instrucción:</strong> Para conectar mejor con tus compañeros en la fiesta de bienvenida, completa tu perfil público.
        <br>
        <em>(Recuerda: Solo los campos con * son obligatorios por el sistema).</em>
        <span class="translation">
            <strong>Instruction:</strong> To connect better with your colleagues at the welcome party, complete your public profile.
            <br>
            <em>(Remember: Only fields marked with * are required by the system.)</em>
        </span>
    </p>

    <div class="form-group">
        <label for="prof-name">
            Nombre Completo *
            <span class="translation">Full Name *</span>
        </label>
        <input type="text" id="prof-name" value="Alex" readonly style="background-color: #e9ecef;">
    </div>

    <div class="form-group">
        <label for="prof-dob">
            Fecha de Nacimiento (Opcional - Para felicitaciones de equipo)
            <span class="translation">Date of Birth (Optional – For team birthday greetings)</span>
        </label>
        <input type="date" id="prof-dob">
    </div>

    <div class="form-group">
        <label for="prof-phone">
            Teléfono Móvil Personal (Opcional - Para alertas SMS)
            <span class="translation">Personal Mobile Phone (Optional – For SMS alerts)</span>
        </label>
        <input type="tel" id="prof-phone" placeholder="+34 600...">
    </div>

    <div class="form-group">
        <label for="prof-social">
            Instagram / LinkedIn / Twitter (Opcional)
            <span class="translation">Instagram / LinkedIn / Twitter (Optional)</span>
        </label>
        <input type="text" id="prof-social" placeholder="@usuario">
    </div>

    <div class="form-group">
        <label for="prof-city">
            Ciudad de Residencia (Opcional - Para carpooling)
            <span class="translation">City of Residence (Optional – For carpooling)</span>
        </label>
        <input type="text" id="prof-city" placeholder="Ej: Madrid, Centro">
    </div>

    <button onclick="window.saveProfile()" style="color:white;">
        Guardar Perfil Público
        <span class="translation" style="color:white;">Save Public Profile</span>
    </button>

</div>

<div id="app-task" style="display:none;">
    <h3>
        Conectar una Aplicación de Terceros
        <span class="translation">Connect a Third-Party Application</span>
    </h3>

    <p>
        <strong>Instrucción:</strong> Para mejorar la coordinación de equipos, por favor integra la aplicación 
        <strong>'TechNova Calendar Sync'</strong> a tu perfil de TechNova Events.
        <span class="translation">
            <strong>Instruction:</strong> To improve team coordination, please integrate the 
            <strong>'TechNova Calendar Sync'</strong> application into your TechNova Events profile.
        </span>
    </p>

    <button onclick="window.connectApp()" style="color:white;">
        Conectar 'TechNova Calendar Sync' App
        <span class="translation" style="color:white;">Connect 'TechNova Calendar Sync' App</span>
    </button>
</div>
        `,
    6: `
<h2>
    Escenario 6: Cierre del Día - Política de Escritorio Limpio
    <span class="translation">Scenario 6: End of Day – Clean Desk Policy</span>
</h2>

<p>
    <strong>Instrucción:</strong> Has terminado de trabajar con los documentos. Tu objetivo es asegurarte de eliminar cualquier archivo sensible o temporal que ya no necesites en tu escritorio.
    <span class="translation">
        <strong>Instruction:</strong> You have finished working with the documents. Your goal is to ensure that any sensitive or temporary files no longer needed are deleted from your desktop.
    </span>
</p>

<p>
    Interactúa con el <strong>Escritorio Virtual</strong> a continuación para completar tus tareas.
    <span class="translation">
        Interact with the <strong>Virtual Desktop</strong> below to complete your tasks.
    </span>
</p>
            <div id="virtual-desktop" class="virtual-desktop">
                
                <div class="desktop-icons">
    <div class="d-icon" onclick="window.openMyPC()">
        <span>💻</span>
        <label>Este Equipo</label>
    </div>

    <div class="d-icon" 
         id="desktop-final-report" 
         draggable="true" 
         ondragstart="window.drag(event)" 
         onclick="window.openWordDocs()">
        <span>📄</span>
        <label>Informe_Final.docx</label> 
    </div>
    <div class="d-icon" onclick="window.openTempFolder()">
        <span>📂</span>
        <label>Descargas (Temp)</label>
    </div>
    
    <div class="d-icon" 
        ondrop="window.drop(event)" 
        ondragover="window.allowDrop(event)">
        <span>🗑️</span>
        <label>Papelera</label>
    </div>
</div>

                <div id="desktop-window-container"></div>

            </div>
        `,
    7: `
            <h2>Fase final opcional: Verificación de filtración de datos</h2>
            <p>Como parte de nuestra investigación, estamos estudiando cómo la exposición de datos públicos se relaciona con el comportamiento en ciberseguridad. Esta fase es <strong>100% voluntaria</strong>.</p>
            <p>Si das tu consentimiento, puedes proporcionar tu dirección de correo electrónico personal. Usaremos una herramienta automatizada para comprobar si ha aparecido en alguna filtración de datos pública conocida.Tu correo será anonimizado y almacenado de forma segura únicamente con fines de investigación.</p>
            <div class="form-group">
                <label for="consent-email">Tu dirección de correo electrónico (opcional)</label>
                <input type="email" id="consent-email" placeholder="Leave blank to decline">
            </div>

            <div id="breach-loading-scenario" style="display: none; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                <p>Checking email against breach databases...</p>
            </div>

            <div id="breach-results-scenario" style="display: none; margin: 20px 0;"></div>

            <button id="consent-submit-btn" onclick="window.finishSimulation(true)">I Consent and Submit</button>
            <button class="secondary" onclick="window.finishSimulation(false)">No, Thank You. Finish.</button>
        `,
    8: `
            <h2>Cuestionario de la Meta-Taxonomía de Comportamiento Humano en Ciberseguridad</h2>
            <p><strong>Instrucciones:</strong> Para cada afirmación, selecciona la opción que mejor describe tu comportamiento habitual.</p>
            
            <form class="questionnaire-form" id="taxonomy-questionnaire">

                <div class="question-section-taxonomy">
                    <h3>0. Información Demográfica y Experiencia</h3>
                    
                    <div class="question-custom">
                        <label>¿Cuál es tu rango de edad?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_1" value="<18"> < 18</label>
                            <label><input type="radio" name="q_0_1" value="18-24"> 18-24</label>
                            <label><input type="radio" name="q_0_1" value="25-34"> 25-34</label>
                            <label><input type="radio" name="q_0_1" value="35-44"> 35-44</label>
                            <label><input type="radio" name="q_0_1" value="45-54"> 45-54</label>
                            <label><input type="radio" name="q_0_1" value="55-64"> 55-64</label>
                            <label><input type="radio" name="q_0_1" value=">65"> > 65</label>
                        </div>
                    </div>

                    <div class="question-custom">
                        <label>¿Cuál es tu nivel más alto de educación completado?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_2" value="Secundaria"> Secundaria</label>
                            <label><input type="radio" name="q_0_2" value="Bachillerato"> Bachillerato</label>
                            <label><input type="radio" name="q_0_2" value="FP"> FP</label>
                            <label><input type="radio" name="q_0_2" value="Grado"> Grado</label>
                            <label><input type="radio" name="q_0_2" value="Master"> Máster</label>
                            <label><input type="radio" name="q_0_2" value="Doctorado"> Doctorado</label>
                        </div>
                    </div>

                    <div class="question-custom">
                        <label>¿Con qué frecuencia usas un ordenador para trabajar o estudiar?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_3" value="Diariamente"> Diariamente</label>
                            <label><input type="radio" name="q_0_3" value="Semanalmente"> Varias veces por semana</label>
                            <label><input type="radio" name="q_0_3" value="Mensualmente"> Varias veces al mes</label>
                            <label><input type="radio" name="q_0_3" value="Rara vez"> Rara vez</label>
                        </div>
                    </div>

                    <div class="question-custom">
                        <label>¿Cómo calificarías tu nivel de habilidad con la tecnología?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_4" value="Muy bajo"> Muy bajo</label>
                            <label><input type="radio" name="q_0_4" value="Bajo"> Bajo</label>
                            <label><input type="radio" name="q_0_4" value="Medio"> Medio</label>
                            <label><input type="radio" name="q_0_4" value="Alto"> Alto</label>
                            <label><input type="radio" name="q_0_4" value="Experto"> Experto</label>
                        </div>
                    </div>

                    <div class="question-custom">
                        <label>¿Has recibido alguna vez formación formal en ciberseguridad?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_5" value="Si"> Sí</label>
                            <label><input type="radio" name="q_0_5" value="No"> No</label>
                        </div>
                    </div>
                    <div class="question-custom">
                        <label>Aproximadamente, ¿en cuántas redes sociales (Facebook, Instagram, LinkedIn, X, TikTok, etc.) tienes un perfil activo?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_6" value="0"> 0</label>
                            <label><input type="radio" name="q_0_6" value="1-2"> 1-2</label>
                            <label><input type="radio" name="q_0_6" value="3-4"> 3-4</label>
                            <label><input type="radio" name="q_0_6" value="5+"> 5 o más</label>
                        </div>
                    </div>
                    </div>
                <p style="margin-top: 30px; font-weight: bold; text-align: left;"><em>Escala para las siguientes preguntas: 1 (Nunca) - 5 (Siempre)</em></p>

                ${generateQuestionGroup(
                  "1. Password Management & Authentication",
                  [
                    "No cambio mis contraseñas, a menos que sea obligatorio.",
                    "Utilizo contraseñas distintas para cada cuenta.",
                    "Creo contraseñas que superan los requisitos mínimos.",
                    "No incluyo caracteres especiales si no son obligatorios.",
                    "Uso contraseñas simples como el nombre o fecha de nacimiento.",
                    "Uso la misma contraseña para varias cuentas.",
                    "Uso verificación en dos pasos (OTP, SMS, etc.).",
                    "Guardo mis contraseñas en el navegador.",
                    "¿Utilizas autenticación multifactor (MFA)?",
                    "¿Compruebas si tus contraseñas han sido comprometidas?",
                  ],
                  1
                )}
                
                ${generateQuestionGroup(
                  "2. Device Securement & Physical Security",
                  [
                    "Bloqueo manually mi equipo al alejarme.",
                    "Uso contraseña para desbloquear portátil/tablet.",
                    "Uso Wi-Fi pública gratuita.",
                    "Escaneo los dispositivos externos (USB, discos) antes de usarlos.",
                  ],
                  2
                )}

                ${generateQuestionGroup(
                  "3. Phishing Awareness & Safe Email Use",
                  [
                    "Abro enlaces sin verificar a dónde dirigen.",
                    "Paso el ratón sobre enlaces antes de hacer clic.",
                    "Reconozco sitios por su apariencia, no por la URL.",
                    "Envío datos sin verificar que la conexión sea segura.",
                    "¿Reportas mensajes sospechosos?",
                  ],
                  3
                )}

                ${generateQuestionGroup(
                  "4. Safe Internet Browsing & Download Practices",
                  [
                    "Introduzco datos de pago en sitios sin certificado.",
                    "Descargo archivos sin verificar su autenticidad.",
                    "Hago clic en anuncios emergentes en sitios web.",
                    "Descargo contenido solo desde sitios oficiales.",
                  ],
                  4
                )}

                ${generateQuestionGroup(
                  "5. Social Media & Personal Information Protection",
                  [
                    "Acepto solicitudes de amistad solo por reconocer la foto.",
                    "Comparto mi ubicación actual en redes sociales.",
                    "Muestro información personal en mis perfiles.",
                    "Reenvío publicaciones sin confirmar su veracidad.",
                    "¿Verificas qué datos personales están públicos en internet?",
                  ],
                  5
                )}

                ${generateQuestionGroup(
                  "6. Secure Information Handling & Data Protection",
                  [
                    "Abro archivos sin importar la extensión.",
                    "¿Cifras tus archivos sensibles?",
                    "¿Eliminas datos antes de desechar un dispositivo?",
                  ],
                  6
                )}

                ${generateQuestionGroup(
                  "7. Software Updating & Patch Management",
                  [
                    "Instalo actualizaciones cuando el sistema me lo indica.",
                    "Verifico que mis programas estén actualizados.",
                    "Verifico que el antivirus se actualice.",
                    "¿Mantienes el software de tu equipo actualizado?",
                    "¿Usas antivirus y firewall activados?",
                  ],
                  7
                )}

                ${generateQuestionGroup(
                  "8. Incident Reporting & Response",
                  [
                    "¿Reportas incidentes de seguridad?",
                    "¿Reportas dispositivos perdidos o robados?",
                    "¿Reportas mensajes o personas sin autorización?",
                  ],
                  8
                )}

                ${generateQuestionGroup(
                  "9. Security Awareness & Policy Compliance",
                  [
                    "¿Lees y aceptas las políticas de seguridad de tu organización?",
                    "¿Solicitas ayuda ante dudas de seguridad?",
                    "¿Participas en programas de concienciación en ciberseguridad?",
                    "¿Reportas políticas inseguras que dificultan tu trabajo?",
                  ],
                  9
                )}

                ${generateQuestionGroup(
                  "10. Generative AI & LLM Usage",
                  [
                    "Antes de enviar un mensaje a un LLM, evalúo si contiene información confidencial.",
                    "¿Has incluido documentos o archivos de tu organización en prompts a IA generativa sin autorización?",
                  ],
                  10
                )}
                <div style="margin-top: 30px;">
                    <button type="button" onclick="window.submitTaxonomy()" class="primary-btn">Enviar Cuestionario</button>
                    <p id="questionnaire-error" style="display: none; color: #d32f2f; margin-top: 10px;">Por favor, responde a todas las preguntas antes de enviar.</p>
                </div>
            </form>
            `,
       9: 
       `
        <div class="ai-lab-container">
            <h2>Escenario 3: Asistente de Inteligencia Artificial Corporativo</h2>
            <div class="task-instruction" style="background: #eef2f5; padding: 15px; border-left: 5px solid #6264a7; margin-bottom: 20px;">
                <p><strong>Tarea Actual:</strong> Se requiere la validación urgente del documento <b>"Revisión de Plantilla Q4"</b>.</p>
            </div>
            
            <div class="ai-interface">
                <textarea id="compose-body" oninput="window.handleAIInput()" 
                    placeholder="Redacta manualmente o usa el asistente de IA..."
                    style="width: 100%; height: 200px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;"></textarea>
                
                <div class="ai-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button onclick="window.useAI()" class="btn-ai" style="background: #6264a7; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                        🤖 Redactar con IA (Copilot TechNova)
                    </button>
                    <button onclick="window.sendComposedEmail()" class="btn-send" style="background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                        Enviar Informe a RRHH
                    </button>
                </div>
            </div>
        </div>
    `,
    10: `
    <div class="simulation-end-container">
    <h2>¡Simulación Completada!</h2>
    <p>Gracias por tu participación. Tus respuestas y acciones han sido registradas correctamente para nuestro estudio sobre ciberseguridad.</p>
            <p>Ya puedes cerrar esta ventana o informar al investigador.</p>
            <button class="btn-primary" onclick="location.reload()">Finalizar Sesión</button>
        </div>   
        `,
  };
  return scenarios[scenarioNumber] || "";
}
