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
                        </div>
                    </div>

                    <!-- Info Block 2 -->
                    <div class="welcome-info-block">
                        <div class="welcome-info-icon">📋</div>
                        <div class="welcome-info-text">
                            A lo largo de tu jornada, deberás completar varias <strong>tareas típicas de incorporación digital</strong>.
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="welcome-divider"></div>

                    <!-- Participant Input -->
                    <div class="welcome-input-group">
                        <label class="welcome-input-label" for="participant-id-input">
                            ID de Participante
                        </label>
                        <div class="welcome-input-wrapper">
                            <span class="welcome-input-icon">👤</span>        
                            <input type="text" id="participant-id-input" placeholder="Ej: P001" autocomplete="off" />
                        </div>
                        <p class="welcome-input-error" id="participant-id-error">
                            Por favor, introduce un ID de Participante válido  
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <button class="welcome-cta-btn" onclick="window.validateAndStart()">
                        <span>🚀</span>
                        <span>
                            <span class="welcome-cta-text-main">Comenzar Simulación</span>
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
            </h2>

            <div id="wifi-task-container">
            <p>
                <strong>Instrucción:</strong> Es tu primer día. Enciendes tu portátil pero <strong>no tienes conexión a internet</strong>.
            </p>

            <p>
                Antes de poder registrarte en los servicios, debes conectarte a la red corporativa.
            </p>

            <p style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; margin: 20px 0;">
                👉 <strong>Consejo:</strong> Busca el icono de red (📡) en la barra de tareas de la parte inferior para conectarte.
            </p>
            </div> <!-- END wifi-task-container -->
            
            <div id="registration-content" style="display:none;">
                <p style="background: #e8f2ff; color: #0f3d8a; padding: 12px 14px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #0078d4;">
                    <strong>Instrucción:</strong> Regístrate en las siguientes cuentas de TechNova para completar tu alta.
                </p>

                <div id="registration-forms">
                    <div class="form-group" id="technova-mail-form">
                        <h3>📧 1. Registrarse en TechNova Mail
                        </h3>
                        <label for="mail-user">Usuario:</label>
                        <input type="text" id="mail-user" placeholder="">
                        <label for="mail-pass">Contraseña:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="mail-pass" value="" autocomplete="off" placeholder="Acepta o crea tu contraseña" style="flex: 1; -webkit-text-security: disc;">
                            <button
                                onmousedown="window.holdPasswordVisibility('mail-pass', true)"
                                onmouseup="window.holdPasswordVisibility('mail-pass', false)"
                                onmouseleave="window.holdPasswordVisibility('mail-pass', false)"
                                onmouseout="window.holdPasswordVisibility('mail-pass', false)"
                                ontouchstart="window.holdPasswordVisibility('mail-pass', true)"
                                ontouchend="window.holdPasswordVisibility('mail-pass', false)"
                                ontouchcancel="window.holdPasswordVisibility('mail-pass', false)"
                                title="Mantener pulsado para ver"
                                style="border: 1px solid #d0d7de; background: #fff; border-radius: 6px; padding: 6px 10px; cursor: pointer;">👁️</button>
                        </div>
                        <div style="margin-top: 10px; padding: 10px; border: 1px solid #d0d7de; border-radius: 8px; background: #f8fbff;">
                            <div style="font-size: 13px; color: #2d3748; margin-bottom: 8px;">
                                🔐 Contraseña sugerida por generador:
                            </div>
                            <code id="mail-pass-suggestion" style="display:block; font-size: 13px; color: #0f3d8a; background: #e9f2ff; padding: 8px; border-radius: 6px; word-break: break-all;">X9m!Q2v@T7k#L4r$Z8</code>
                            <div style="display:flex; gap:8px; margin-top: 10px;">
                                <button onclick="window.acceptDefaultMailPassword()" style="flex:1; border:1px solid #9fc5f8; background:#e9f2ff; color:#0f3d8a; border-radius:6px; padding:8px; cursor:pointer; font-weight:600;">Aceptar sugerida</button>
                                <button onclick="window.rejectDefaultMailPassword()" style="flex:1; border:1px solid #d0d0d0; background:#fff; color:#333; border-radius:6px; padding:8px; cursor:pointer; font-weight:600;">Rechazar y crear otra</button>
                            </div>
                        </div>
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
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group" id="technova-drive-form" style="display:none;">
                        <h3>💾 2. Registrarse en TechNova Drive
                        </h3>
                        <p>Ahora, regístrate en TechNova Drive, nuestro sistema de almacenamiento en la nube.
                        </p>
                         <label for="drive-user">Usuario:</label>
                        <input type="text" id="drive-user" placeholder="">
                        <label for="drive-pass">Contraseña:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="drive-pass" style="flex: 1; -webkit-text-security: disc;">
                            <button
                                onmousedown="window.holdPasswordVisibility('drive-pass', true)"
                                onmouseup="window.holdPasswordVisibility('drive-pass', false)"
                                onmouseleave="window.holdPasswordVisibility('drive-pass', false)"
                                onmouseout="window.holdPasswordVisibility('drive-pass', false)"
                                ontouchstart="window.holdPasswordVisibility('drive-pass', true)"
                                ontouchend="window.holdPasswordVisibility('drive-pass', false)"
                                ontouchcancel="window.holdPasswordVisibility('drive-pass', false)"
                                title="Mantener pulsado para ver"
                                style="border: 1px solid #d0d7de; background: #fff; border-radius: 6px; padding: 6px 10px; cursor: pointer;">👁️</button>
                        </div>
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
                            </button>
                        </div>
                    </div>

                    <div class="form-group" id="technova-events-form" style="display:none;">
                        <h3>👥 3. Registrarse en TechNova Teams
                        </h3>
                        <p>Finalmente, crea tu perfil en TechNova Teams, la plataforma de comunicación interna.
                        </p>
                        <label for="events-user">Usuario:</label>
                        <input type="text" id="events-user" placeholder="">
                        <label for="events-pass">Contraseña:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="events-pass" style="flex: 1; -webkit-text-security: disc;">
                            <button
                                onmousedown="window.holdPasswordVisibility('events-pass', true)"
                                onmouseup="window.holdPasswordVisibility('events-pass', false)"
                                onmouseleave="window.holdPasswordVisibility('events-pass', false)"
                                onmouseout="window.holdPasswordVisibility('events-pass', false)"
                                ontouchstart="window.holdPasswordVisibility('events-pass', true)"
                                ontouchend="window.holdPasswordVisibility('events-pass', false)"
                                ontouchcancel="window.holdPasswordVisibility('events-pass', false)"
                                title="Mantener pulsado para ver"
                                style="border: 1px solid #d0d7de; background: #fff; border-radius: 6px; padding: 6px 10px; cursor: pointer;">👁️</button>
                        </div>
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
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        2: `
            <h2>
    Escenario 2: Dispositivos Externos
</h2>

<div id="simulated-lock-screen">
    <div class="lock-screen-content">
        <div class="lock-screen-icon">🖥️</div>

        <h1>
            Sesión Suspendida
        </h1>

        <p>
            (Simulación de Bloqueo de Pantalla)
        </p>

        <div class="lock-screen-prompt">
            Presiona la tecla <strong>'v'</strong> para volver y continuar.
        </div>
    </div>
</div>

<div id="task-interruption">
    <p style="font-size: 1.05em; line-height: 1.7; margin-bottom: 10px;">
        <strong>Instrucción:</strong> Estás trabajando en tu escritorio cuando un compañero se acerca y te pide que le acompañes 
        un momento a la sala de reuniones para resolver una duda rápida. <strong>Debes levantarte de tu puesto</strong>.
    </p>

    <p style="background: #fff3cd; color: #856404; padding: 14px 18px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 18px 0; font-size: 0.97em;">
        💡 <strong>¿Qué haces con tu ordenador antes de irte?</strong>
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
        </button>

    </div>
</div>
        `,
        3: `
           <h2>
                Escenario 3: Gestión de Comunicaciones
            </h2>

            <!-- Phase 1: Inbox Review -->
            <div style="background: #f0f7ff; border-left: 4px solid #0078d4; padding: 14px 18px; border-radius: 6px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; font-size: 1.05em; line-height: 1.6;">
                    <strong>📧 Instrucción:</strong> Revisa <strong>todos</strong> los correos de tu bandeja de <strong>TechNova Mail</strong>.
                    Tu gerente y varios departamentos te han enviado mensajes sobre tu incorporación. Algunos podrían no ser legítimos.
                </p>
                <p style="margin: 0; font-size: 0.95em; color: #444; line-height: 1.5;">
                    Presta atención al <strong>remitente</strong>, el <strong>contenido</strong> y los <strong>enlaces</strong>.
                    Si un correo te parece sospechoso, <strong>haz clic derecho sobre él y repórtalo</strong>.
                    <strong>Debes leer todos los correos para poder continuar.</strong>
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
                    </h3>
                    <p style="margin: 0 0 8px 0; line-height: 1.6;">
                        <strong>Instrucción:</strong> Laura Pérez (tu gerente) te ha pedido que le reenvíes un documento.
                        Usa el botón <strong>"Nuevo Correo"</strong> para componer un mensaje a
                        <strong>laura.perez@technova.com</strong> y adjunta el archivo solicitado.
                    </p>
                    <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.4;">
                        💡 Puedes adjuntar desde tu ordenador local (📎) o desde TechNova Drive (☁️).
                    </p>
                </div>
            </div>
        `,
        4: `
<h2>
    Escenario 4: Búsqueda y Descarga de Recursos
</h2>

<p>
    <strong>Instrucción:</strong> Revisa las extensiones instaladas en tu navegador, luego usa el buscador para encontrar y descargar una <strong>plantilla de cronograma de proyectos</strong>.
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
            <div id="browser-update-notification" class="browser-update-notification">
                <div class="browser-notification-header">
                    <span>🔔 Notificación de Windows</span>
                    <button class="browser-notification-close" onclick="this.parentNode.parentNode.style.display='none';">×</button>
                </div>
                <div class="browser-notification-body">
                    <p id="browser-notification-message"></p>
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
        <div class="official-site" style="padding: 0; width: 100%; max-width: none; margin: 0;">
            <div id="profile-task">
                <h2>
                    Escenario 6: Configuración del Perfil Profesional
                </h2>
                <p>
                    <strong>Instrucción:</strong> Para completar tu incorporación, RRHH te pide que configures tu <strong>Perfil Público</strong> 
                    en el directorio de la empresa. Ten cuidado con la información que compartes.
                </p>

                <div class="form-group">
                    <label for="prof-fullname">Nombre Completo <span style="color:#d32f2f;">*</span></label>
                    <input type="text" id="prof-fullname" placeholder="Escribe tu nombre completo" required>
                </div>
                
                <div class="form-group">
                    <label for="prof-dni">DNI (Opcional)</label>
                    <input type="text" id="prof-dni" placeholder="Ej: 12345678A">
                </div>

                <hr style="margin: 20px 0;">

                <div class="form-group">
                    <label for="prof-dob">
                        Fecha de Nacimiento (Opcional)
                    </label>
                    <input type="date" id="prof-dob">
                </div>

                <div class="form-group">
                    <label for="prof-phone">
                        Teléfono Personal (Opcional)
                    </label>
                    <input type="tel" id="prof-phone" placeholder="+34 600 ...">
                </div>

                <div class="form-group">
                    <label for="prof-social">
                        Redes Sociales (LinkedIn/Twitter) (Opcional)
                    </label>
                    <input type="text" id="prof-social" placeholder="@usuario">
                </div>

                <div class="form-group">
                    <label for="prof-city">
                        Ciudad de Residencia (Opcional)
                    </label>
                    <input type="text" id="prof-city" placeholder="Ej: Madrid, Centro">
                </div>

                <div class="form-group">
                    <label for="prof-live-location" style="display:flex; align-items:flex-start; gap:10px;">
                        <input type="checkbox" id="prof-live-location" style="margin-top: 3px;">
                        <span>
                            Compartir mi ubicación en tiempo real para encontrar compañeros cercanos.
                        </span>
                    </label>
                </div>

                <button onclick="window.saveProfile()" style="color:white;">
                    Guardar Perfil Público
                </button>

            </div>

            <div id="app-task" style="display:none;">
                <h3>
                    Vincular Aplicación Externa
                </h3>

                <p style="margin-top: 8px; margin-bottom: 14px; color:#243447; line-height:1.5;">
                    Revisa la solicitud de integración y decide si deseas continuar con la vinculación de la aplicación.
                </p>

                <div style="border:1px solid #d7e3f4; border-radius:12px; background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%); padding:16px; box-shadow:0 6px 20px rgba(10,50,120,0.08); margin-top:10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:42px; height:42px; border-radius:10px; background:#1f6feb; color:#fff; display:flex; align-items:center; justify-content:center; font-size:20px;">📅</div>
                            <div>
                                <div style="font-weight:700; color:#183153;">TechNova Calendar Sync</div>
                                <div style="font-size:12px; color:#5c6b7a;">by TN Productivity Labs</div>
                            </div>
                        </div>
                        <span style="font-size:11px; font-weight:700; color:#7a4b00; background:#fff3d9; border:1px solid #f4cf8a; border-radius:999px; padding:4px 10px;">Permisos sensibles</span>
                    </div>

                    <div style="background:#f9fbfd; border:1px solid #e3edf7; border-radius:10px; padding:12px;">
                        <div style="font-size:12px; color:#425466; font-weight:700; margin-bottom:8px;">Solicita acceso a:</div>
                        <div style="font-size:13px; color:#2f3a4a; line-height:1.55;">
                            • Perfil básico y correo corporativo<br>
                            • Calendario de empresa y reuniones<br>
                            • Contactos internos y mensajes privados<br>
                            • Publicar cambios en tu nombre
                        </div>
                    </div>

                    <button onclick="window.connectApp()" style="margin-top:14px; width:100%; color:white; background:linear-gradient(135deg,#0a66c2,#004a99); border:none; border-radius:10px; padding:12px 14px; font-weight:700; cursor:pointer; box-shadow:0 8px 20px rgba(10,102,194,0.28);">
                        Revisar permisos y continuar
                    </button>
                </div>
            </div>
        </div>
        `,
        7: `
<h2>
    Escenario 7: Cierre del Día - Política de Escritorio Limpio
</h2>

<p>
    <strong>Instrucción:</strong> Navega por la barra de herramientas y elimina los documentos sensibles o temporales que ya no deban permanecer en el sistema.
</p>
        `,
        8: `
            <h2>Escenario 8: Verificación de filtración de datos</h2>
            <p>Como parte de nuestra investigación, estamos estudiando cómo la exposición de datos públicos se relaciona con el comportamiento en ciberseguridad. Esta fase es <strong>100% voluntaria</strong>.</p>
            <p>Si das tu consentimiento, puedes proporcionar tu dirección de correo electrónico personal. Usaremos una herramienta automatizada para comprobar si ha aparecido en alguna filtración de datos pública conocida.Tu correo será anonimizado y almacenado de forma segura únicamente con fines de investigación.</p>
            <div class="form-group">
                <label for="consent-email">Tu dirección de correo electrónico (opcional)</label>
                <input type="email" id="consent-email" placeholder="Dejar en blanco para rechazar">
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
