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
            <div class="welcome-screen">

                <!-- Logo Badge -->
                <div class="welcome-logo-badge">TN</div>

                <!-- Title -->
                <h2 class="welcome-title">
                    ¡Bienvenido a <span class="welcome-brand">TechNova</span>!
                    <span class="translation">Welcome to TechNova!</span>
                </h2>

                <!-- Subtitle -->
                <div class="welcome-subtitle">Simulación de Incorporación Digital</div>

                <!-- Glassmorphism Card -->
                <div class="welcome-card">

                    <!-- Info Block 1 -->
                    <div class="welcome-info-block">
                        <div class="welcome-info-icon">🏢</div>
                        <div class="welcome-info-text">
                            Este laboratorio virtual simula tu <strong>primer día laboral</strong> en la empresa tecnológica TechNova.
                            <span class="translation">This virtual lab simulates your first working day at the tech company TechNova.</span>
                        </div>
                    </div>

                    <!-- Info Block 2 -->
                    <div class="welcome-info-block">
                        <div class="welcome-info-icon">📋</div>
                        <div class="welcome-info-text">
                            A lo largo de tu jornada, deberás completar varias <strong>tareas típicas de incorporación digital</strong>.
                            <span class="translation">Throughout your day, you will need to complete several typical digital onboarding tasks.</span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="welcome-divider"></div>

                    <!-- Participant Input -->
                    <div class="welcome-input-group">
                        <label class="welcome-input-label" for="participant-id-input">
                            ID de Participante
                            <span class="translation">Participant ID (provided by the researcher)</span>
                        </label>
                        <div class="welcome-input-wrapper">
                            <span class="welcome-input-icon">👤</span>
                            <input type="text" id="participant-id-input" placeholder="Ej: P001" autocomplete="off" />
                        </div>
                        <p class="welcome-input-error" id="participant-id-error">
                            Por favor, introduce un ID de Participante válido
                            <span class="translation">Please enter a valid Participant ID</span>
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <button class="welcome-cta-btn" onclick="window.validateAndStart()">
                        <span>🚀</span>
                        <span>
                            <span class="welcome-cta-text-main">Comenzar Simulación</span>
                            <span class="welcome-cta-text-sub">Begin Simulation</span>
                        </span>
                    </button>

                </div>

                <!-- Security Footer -->
                <div class="welcome-security-footer">
                    <span>🔒</span>
                    <span>Entorno seguro · Datos protegidos · Sesión anonimizada</span>
                </div>

            </div>
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

            <p style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; margin: 20px 0;">
                👉 <strong>Consejo:</strong> Busca el icono de red (📡) en la barra de tareas de la parte inferior para conectarte.
            </p>
            </div> <!-- END wifi-task-container -->
            
            <div id="registration-content" style="display:none;">
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
                        <div style="text-align: center; margin-top: 15px;">
                            <button onclick="window.registerService('mail')" style="
                                background: linear-gradient(135deg, #0078d4, #005a9e);
                                color: white;
                                border: none;
                                padding: 12px 32px;
                                border-radius: 10px;
                                font-size: 15px;
                                font-weight: 600;
                                cursor: pointer;
                                box-shadow: 0 4px 14px rgba(0, 120, 212, 0.35);
                                transition: all 0.25s ease;
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                            " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,120,212,0.45)'"
                               onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(0,120,212,0.35)'">
                            ✉️ Crear Cuenta de TechNova Mail
                            <span class="translation" style="color:white;">Create TechNova Mail Account</span>
                            </button>
                        </div>
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
                        <div style="text-align: center; margin-top: 15px;">
                            <button onclick="window.registerService('drive')" style="
                                background: linear-gradient(135deg, #0078d4, #005a9e);
                                color: white;
                                border: none;
                                padding: 12px 32px;
                                border-radius: 10px;
                                font-size: 15px;
                                font-weight: 600;
                                cursor: pointer;
                                box-shadow: 0 4px 14px rgba(0, 120, 212, 0.35);
                                transition: all 0.25s ease;
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                            " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,120,212,0.45)'"
                               onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(0,120,212,0.35)'">
                            ☁️ Crear Cuenta de TechNova Drive
                            <span class="translation" style="color:white;">Create TechNova Drive Account</span>
                            </button>
                        </div>
                    </div>

                    <div class="form-group" id="technova-events-form" style="display:none;">
                        <h3>👥 3. Registrarse en TechNova Teams
                        <span class="translation">Register in TechNova Teams</span>
                        </h3>
                        <p>Finalmente, crea tu perfil en TechNova Teams, la plataforma de comunicación interna.
                        <span class="translation">
                        Finally, create your profile in TechNova Teams, the internal communication platform.
                        </span>
                        </p>
                        <label for="events-user">Usuario:</label>
                        <input type="text" id="events-user" placeholder="">
                        <label for="events-pass">Contraseña:</label>
                        <input type="password" id="events-pass">
                        <div style="text-align: center; margin-top: 15px;">
                            <button onclick="window.registerService('events')" style="
                                background: linear-gradient(135deg, #0078d4, #005a9e);
                                color: white;
                                border: none;
                                padding: 12px 32px;
                                border-radius: 10px;
                                font-size: 15px;
                                font-weight: 600;
                                cursor: pointer;
                                box-shadow: 0 4px 14px rgba(0, 120, 212, 0.35);
                                transition: all 0.25s ease;
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                            " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,120,212,0.45)'"
                               onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(0,120,212,0.35)'">
                            👥 Crear Cuenta de TechNova Teams
                            <span class="translation" style="color:white;">Create TechNova Teams Account</span>
                            </button>
                        </div>
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
        </div>
        <div class="lock-screen-prompt" style="margin-top: 12px; color: rgba(255,255,255,0.6); font-size: 0.95em;">
            Press the <strong>'v'</strong> key to return and continue.
        </div>
    </div>
</div>

<div id="task-interruption">
    <p style="font-size: 1.05em; line-height: 1.7; margin-bottom: 10px;">
        <strong>Instrucción:</strong> Estás trabajando en tu escritorio cuando un compañero se acerca y te pide que le acompañes 
        un momento a la sala de reuniones para resolver una duda rápida. <strong>Debes levantarte de tu puesto</strong>.
        <span class="translation">
            <strong>Instruction:</strong> You are working at your desk when a colleague approaches and asks you to come with them 
            to the meeting room for a quick question. <strong>You need to step away from your workstation</strong>.
        </span>
    </p>

    <p style="background: #fff3cd; color: #856404; padding: 14px 18px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 18px 0; font-size: 0.97em;">
        💡 <strong>¿Qué haces con tu ordenador antes de irte?</strong>
        <span class="translation"><strong>What do you do with your computer before leaving?</strong></span>
    </p>

    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 28px;">

        <button onclick="window.handleInterruption(true)" style="
            flex: 1;
            max-width: 280px;
            background: linear-gradient(135deg, #4a5568, #3a4250);
            color: #ffffff;
            border: none;
            padding: 16px 24px;
            border-radius: 10px;
            font-size: 1.05em;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(74, 85, 104, 0.35);
            transition: all 0.25s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(74,85,104,0.45)'"
           onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(74,85,104,0.35)'">
            🖥️ Suspender Sesión
            <span class="translation" style="color: #ffffff;">Suspend Session</span>
        </button>

        <button onclick="window.handleInterruption(false)" style="
            flex: 1;
            max-width: 280px;
            background: linear-gradient(135deg, #4a5568, #3a4250);
            color: #ffffff;
            border: none;
            padding: 16px 24px;
            border-radius: 10px;
            font-size: 1.05em;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(74, 85, 104, 0.35);
            transition: all 0.25s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(74,85,104,0.45)'"
           onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(74,85,104,0.35)'">
            Continuar ➡️
            <span class="translation" style="color: #ffffff;">Continue</span>
        </button>

    </div>
</div>


<!--
            <div id="task-usb" style="display:none;">
                <h3>Manejo de Dispositivos Externos
                <span class="translation">Handling External Devices</span>
                </h3>
                
                <p>
                    <strong>Instrucción:</strong> Has encontrado un pendrive USB en tu escritorio con la etiqueta "Plantillas". 
                    Conéctalo virtualmente (haz doble clic en el icono USB) y busca el archivo.
                    <span class="translation">
                        <strong>Instruction:</strong> You found a USB drive on your desk labeled "Templates". 
                        Virtually connect it (double-click the USB icon) and find the file.
                    </span>
                </p>

                <div class="virtual-desktop" id="virtual-desktop-container">
                    <div class="desktop-icons">
                        <div class="d-icon" id="drive-c">
                            <span>💽</span>
                            <label>Disco Local (C:)</label>
                        </div>
                        <div class="d-icon" id="usb-drive">
                            <span>💾</span>
                            <label>USB Drive (E:)</label>
                        </div>
                        <div class="d-icon">
                            <span>🗑️</span>
                            <label>Papelera</label>
                        </div>
                    </div>

                    
                    <div id="usb-context-menu" class="context-menu-windows" style="display: none;">
                        <div class="context-menu-item" id="usb-context-scan">🛡️ Escanear con TechNova Antivirus</div>
                        <div class="context-menu-item">📂 Abrir</div>
                        <div class="context-menu-item">⏏️ Expulsar</div>
                        <div class="context-menu-item">🔧 Propiedades</div>
                    </div>

                    
                   
                    <div id="file-explorer-window" class="window-frame" style="display: none;">
                       ... (File explorer content omitted for brevity in comment) ...
                    </div> 
                </div> 
            </div>
-->
<!--
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
                                <li id="sidebar-this-pc" class="active">▼ Este equipo</li>
                            </ul>
                        </div>
                        <div class="fe-content">
                             (Contenido del explorador)
                        </div>
                    </div>
                </div>
-->

        `,
        3: `
           <h2>
                Escenario 3: Gestión de Comunicaciones
                <span class="translation">Scenario 3: Communications Management</span>
            </h2>

            <!-- Phase 1: Inbox Review -->
            <div style="background: #f0f7ff; border-left: 4px solid #0078d4; padding: 14px 18px; border-radius: 6px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; font-size: 1.05em; line-height: 1.6;">
                    <strong>📧 Instrucción:</strong> Revisa <strong>todos</strong> los correos de tu bandeja de <strong>TechNova Mail</strong>.
                    Tu gerente y varios departamentos te han enviado mensajes sobre tu incorporación. Algunos podrían no ser legítimos.
                    <span class="translation">
                    <strong>📧 Instruction:</strong> Review <strong>all</strong> the emails in your <strong>TechNova Mail</strong> inbox.
                    Your manager and various departments have sent you onboarding messages. Some may not be legitimate.
                    </span>
                </p>
                <p style="margin: 0; font-size: 0.95em; color: #444; line-height: 1.5;">
                    Presta atención al <strong>remitente</strong>, el <strong>contenido</strong> y los <strong>enlaces</strong>.
                    Si un correo te parece sospechoso, <strong>haz clic derecho sobre él y repórtalo</strong>.
                    <strong>Debes leer todos los correos para poder continuar.</strong>
                    <span class="translation">
                    Pay attention to the <strong>sender</strong>, <strong>content</strong>, and <strong>links</strong>.
                    If an email seems suspicious, <strong>right-click on it and report it</strong>.
                    <strong>You must read all emails before you can proceed.</strong>
                    </span>
                </p>
            </div>

            <div class="email-client">
                <div class="email-list" id="email-list"></div>
                <div class="email-view" id="email-view">
                    <p>Selecciona un correo para leerlo.</p>
                </div>
            </div>

            <!-- Phase 2: Document Sharing Task (hidden until enough email interactions) -->
            <div id="email-phase-2" style="display: none; margin-top: 24px;">
                <div style="background: #fff8e1; border-left: 4px solid #ff9800; padding: 16px 20px; border-radius: 6px;">
                    <h3 style="margin: 0 0 10px 0; color: #e65100;">
                        📋 Tarea adicional
                        <span class="translation">Additional Task</span>
                    </h3>
                    <p style="margin: 0 0 8px 0; line-height: 1.6;">
                        <strong>Instrucción:</strong> Laura Pérez (tu gerente) te ha pedido que le reenvíes un documento.
                        Usa el botón <strong>"Nuevo Correo"</strong> para componer un mensaje a
                        <strong>laura.perez@technova.com</strong> y adjunta el archivo solicitado.
                        <span class="translation">
                        <strong>Instruction:</strong> Laura Pérez (your manager) asked you to send her back a document.
                        Use the <strong>"New Email"</strong> button to compose a message to
                        <strong>laura.perez@technova.com</strong> and attach the requested file.
                        </span>
                    </p>
                    <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.4;">
                        💡 Puedes adjuntar desde tu ordenador local (📎) o desde TechNova Drive (☁️).
                        <span class="translation">You can attach from your local computer (📎) or from TechNova Drive (☁️).</span>
                    </p>
                </div>
            </div>
        `,
        4: `
<h2>
    Escenario 4: Búsqueda y Descarga de Recursos
    <span class="translation">Scenario 4: Resource Search & Download</span>
</h2>

<p>
    <strong>Instrucción:</strong> Revisa las extensiones instaladas en tu navegador, luego usa el buscador para encontrar y descargar una <strong>plantilla de cronograma de proyectos</strong>.
    <span class="translation">
        <strong>Instruction:</strong> Review the browser extensions installed, then use the search engine to find and download a <strong>project schedule template</strong>.
    </span>
</p>

<!-- Panel de extensiones del navegador -->
<div class="browser-extensions-panel" id="browser-extensions-panel">
    <div class="extensions-header">
        <span>🧩 Extensiones instaladas</span>
        <button class="extensions-close-btn" onclick="window.closeExtensionsPanel()">✕</button>
    </div>
    <div class="extensions-list" id="extensions-list">
        <!-- Se rellena dinámicamente desde scenario4.js -->
    </div>
    <div class="extensions-footer">
        <button class="extensions-done-btn" onclick="window.confirmExtensions()">✔ Listo, continuar navegando</button>
    </div>
</div>

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
                    <button class="browser-extensions-btn" id="browser-extensions-btn" onclick="window.toggleExtensionsPanel()" title="Gestionar extensiones">🧩</button>
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
        <div class="ai-lab-wrapper">
            <h2 style="color: #6264a7;">Escenario 5: Incidencias Críticas de Nóminas (Chat de Grupo)</h2>
            <div style="background: #fff3cd; padding: 10px; border: 1px solid #ffeeba; margin-bottom: 15px; font-size: 0.85em;">
                ⚠️ <strong>SISTEMA CAÍDO:</strong> La base de datos de salarios no funciona. Marta necesita el resumen para la reunión del CEO <strong>YA</strong>. Usa el historial de este chat.
            </div>
            
            <div class="ai-task-container" style="display: flex; gap: 20px; align-items: stretch;">
                <div style="flex: 1.2; background: #fff; padding: 15px; border: 1px solid #ddd; border-top: 5px solid #6264a7; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <h3 style="font-size: 1em; color: #6264a7; margin-top:0;">💬 Chat: Operaciones RRHH</h3>
                    <div id="raw-chat-data" style="height: 380px; overflow-y: auto; font-size: 0.82em; background: #fdfdfd; padding: 10px; border: 1px solid #eee; line-height: 1.4; color: #333;">
                        <p><strong>Marta (10:15):</strong> Chicos, ¿tenemos lo de TechNova? ¡El jefe me pide los cambios del Q4 en 5 minutos!</p>
                        <p><strong>Juan (10:16):</strong> Voy... Carlos Ruiz (TN-4482) dice que ok a los 55.000€ pero que solo si le damos turno de mañana (8 a 15). Ah, y el bonus del 10% no se toca.</p>
                        <p><strong>Elena (10:17):</strong> ¡Oye! Maria Garcia (TN-2231) me acaba de llamar gritando. Dice que quiere 45.000€, que ahora cobra 42k y no le llega.</p>
                        <p><strong>Juan (10:18):</strong> Esperad, Lucía Márquez (TN-9921) cobra 48.000€. Me mandó un mail diciendo que o teletrabaja los viernes o acepta la oferta de la competencia.</p>
                        <p><strong>Marta (10:19):</strong> Juan, ¿qué pasa con Javier Ochoa (TN-1102)?</p>
                        <p><strong>Juan (10:20):</strong> Javier está insoportable. Cobra 32.000€ y exige subir a 35k hoy mismo o se va. Sinceramente, me tiene harto con sus amenazas.</p>
                        <p><strong>Elena (10:21):</strong> Marta, apunta también: Sergio Lopez (TN-5542) sigue con 60k + 5% bonus, sin cambios. Y Elena Gomez (TN-7712) 38k, pero pide remoto 100%.</p>
                        <p><strong>Juan (10:22):</strong> Ah, se me olvidaba Carlos Ruiz... corregid lo de antes, el bonus no es el 10%, es el 12% que me lo acaba de confirmar por WhatsApp.</p>
                        <p><strong>Marta (10:23):</strong> ¡Uf, qué lío! David Perez (TN-3341) sube a 50k (estaba en 45k) por el ascenso. Ana Belen (TN-8823) 52k sin cambios.</p>
                        <p><strong>Elena (10:24):</strong> Pedro Juan (TN-1234) cobra 30k. Laura Martinez (TN-5678) 40k. No tienen cambios estos dos.</p>
                        <p><strong>Juan (10:25):</strong> Marta, ¿le has dicho lo de Javier Ochoa? Si no le subimos los 3k se pira.</p>
                        <p><strong>Marta (10:26):</strong> ¡No tengo tiempo! Pásalo todo al informe y lo que salga, que entro en la reunión!</p>
                    </div>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; background: #f4f6f9; padding: 15px; border: 1px solid #ccc; border-radius: 4px;">
                    <label style="font-weight: bold; margin-bottom: 10px; font-size: 0.9em;">Validación Final para Marta:</label>
                    <textarea id="ai-editor-body" oninput="window.handleAIInput()" 
                        placeholder="Pon orden en este lío y redacta el informe consolidado..."
                        style="flex: 1; min-height: 250px; padding: 10px; font-size: 0.85em; border: 1px solid #bbb; border-radius: 4px;"></textarea>
                    
                    <div id="ai-status-msg" style="height: 20px; font-size: 0.75em; margin: 5px 0;"></div>
                    
                    <div style="margin: 5px 0 15px 0; font-size: 0.75em; color: #555;">
                        <input type="checkbox" id="check-responsibility">
                        <label for="check-responsibility">Confirm que he filtrado el ruido y los datos son correctos según la política de TechNova.</label>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.useAI()" style="background: #6264a7; color: white; flex: 1.2; font-weight: bold; padding: 10px;">🤖 Ordenar con IA</button>
                        <button onclick="window.sendAIReport()" style="background: #2ea44f; color: white; flex: 0.8; font-weight: bold;">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    `,
        6: `
        <div class="official-site" style="padding: 20px; max-width: 800px; margin: 0 auto;">
            <h2>
                Escenario 6: Configuración del Perfil Profesional
                <span class="translation">Scenario 6: Professional Profile Setup</span>
            </h2>
            <p>
                <strong>Instrucción:</strong> Para completar tu incorporación, RRHH te pide que configures tu <strong>Perfil Público</strong> 
                en el directorio de la empresa. Ten cuidado con la información que compartes.
                <span class="translation">
                    <strong>Instruction:</strong> To complete user onboarding, HR asks you to set up your <strong>Public Profile</strong> 
                    in the company directory. Be careful with the information you share.
                </span>
            </p>

            <div id="profile-task">
                <div class="form-group">
                    <label>Nombre Completo (Obligatorio)</label>
                    <input type="text" value="Usuario TechNova" disabled style="background: #eee;">
                </div>
                
                <div class="form-group">
                    <label>Puesto (Obligatorio)</label>
                    <input type="text" value="Project Manager" disabled style="background: #eee;">
                </div>

                <hr style="margin: 20px 0;">
                <p><em>Los siguientes campos son opcionales pero ayudarán a tus compañeros a conocerte mejor.</em></p>

                <div class="form-group">
                    <label for="prof-dob">
                        Fecha de Nacimiento (Opcional)
                        <span class="translation">Date of Birth (Optional)</span>
                    </label>
                    <input type="date" id="prof-dob">
                </div>

                <div class="form-group">
                    <label for="prof-phone">
                        Teléfono Personal (Opcional - Para emergencias)
                        <span class="translation">Personal Phone (Optional – For emergencies)</span>
                    </label>
                    <input type="tel" id="prof-phone" placeholder="+34 600 ...">
                </div>

                <div class="form-group">
                    <label for="prof-social">
                        Redes Sociales (LinkedIn/Twitter) (Opcional)
                        <span class="translation">Social Media (LinkedIn/Twitter) (Optional)</span>
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
        </div>
        `,
        7: `
<h2>
    Escenario 7: Cierre del Día - Política de Escritorio Limpio
    <span class="translation">Scenario 7: End of Day – Clean Desk Policy</span>
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
        8: `
            <h2>Escenario 8: Verificación de filtración de datos</h2>
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
        9: `
            <h2>Escenario 9: Cuestionario Final</h2>
            <p><strong>Instrucciones:</strong> Para cada afirmación, selecciona la opción que mejor describe tu comportamiento habitual.</p>
            
            <form class="questionnaire-form" id="taxonomy-questionnaire">

                <div class="question-section-taxonomy">
                    <h3>0. Información Demográfica y Experiencia</h3>
                    
                    <div class="question-custom">
                        <label>¿Cuál es tu edad?</label>
                        <input 
                            type="number" 
                            id="age-input" 
                            name="q_0_1" 
                            min="0" 
                            max="120" 
                            placeholder="Introduce tu edad" 
                            class="question-input"
                        >
                    </div>

                    <div class="question-custom">
                        <label>¿Cuál es tu facultad?</label>
                        <input 
                            type="text" 
                            id="faculty-input" 
                            name="q_0_2" 
                            placeholder="Escribe aquí tu facultad" 
                            class="question-input"
                        >
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
        10: `
    <div class="simulation-end-container">
    <h2>¡Simulación Completada!</h2>
    <p>Gracias por tu participación. Tus respuestas y acciones han sido registradas correctamente para nuestro estudio sobre ciberseguridad.</p>
            <p>Ya puedes cerrar esta ventana o informar al investigador.</p>
            <button class="btn-primary" onclick="window.finalizeSession()">Finalizar Sesión</button>
        </div>   
        `,
    };
    return scenarios[scenarioNumber] || "";
}
