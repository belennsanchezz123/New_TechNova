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
                    Antes de poder registrarte en los servicios, debes conectarte a la red corporativa. Selecciona una red WiFi para continuar:
                </p>

                <div class="wifi-selection-panel">
                    <div class="wifi-panel-header">
                        <span class="wifi-panel-icon">📡</span>
                        <h3>Redes WiFi disponibles</h3>
                    </div>
                    <p class="wifi-panel-description">
                        Elige una red para conectarte a internet.
                    </p>

                    <div class="wifi-network-list">
                        <div class="wifi-network-item" onclick="window.connectWifi('secure')">
                            <div class="wifi-network-info">
                                <span class="wifi-network-icon">🔒</span>
                                <div>
                                    <div class="wifi-network-name">TechNova_Corp_Secure</div>
                                    <div class="wifi-network-detail">Red corporativa protegida con contraseña</div>
                                </div>
                            </div>
                            <div class="wifi-signal-strength" title="Señal excelente">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="#0078d4" stroke-width="2.5"></path>
                                    <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="#0078d4" stroke-width="2.5"></path>
                                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="#0078d4" stroke-width="2.5"></path>
                                    <circle cx="12" cy="20" r="1.5" fill="#0078d4" stroke="none"></circle>
                                </svg>
                            </div>
                        </div>

                        <div class="wifi-network-item" onclick="window.connectWifi('public')">
                            <div class="wifi-network-info">
                                <span class="wifi-network-icon">📶</span>
                                <div>
                                    <div class="wifi-network-name">TechNova_Public</div>
                                    <div class="wifi-network-detail">Red pública abierta (sin contraseña)</div>
                                </div>
                            </div>
                            <div class="wifi-signal-strength" title="Señal media">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="#d0d7de" stroke-width="2.5"></path>
                                    <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="#0078d4" stroke-width="2.5"></path>
                                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="#0078d4" stroke-width="2.5"></path>
                                    <circle cx="12" cy="20" r="1.5" fill="#0078d4" stroke="none"></circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- END wifi-task-container -->
            
            <div id="registration-content" style="display:none;">
                <p style="background: #e8f2ff; color: #0f3d8a; padding: 12px 14px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #0078d4;">
                    <strong>Instrucción:</strong> Regístrate en las siguientes cuentas de TechNova para completar tu alta.
                </p>

                <!-- Stepper de progreso -->
                <div class="registration-stepper" id="registration-stepper">
                    <div class="stepper-step active" id="stepper-mail">
                        <div class="stepper-circle">1</div>
                        <span class="stepper-label">TechNova Mail</span>
                    </div>
                    <div class="stepper-line" id="stepper-line-1"></div>
                    <div class="stepper-step" id="stepper-drive">
                        <div class="stepper-circle">2</div>
                        <span class="stepper-label">TechNova Drive</span>
                    </div>
                    <div class="stepper-line" id="stepper-line-2"></div>
                    <div class="stepper-step" id="stepper-events">
                        <div class="stepper-circle">3</div>
                        <span class="stepper-label">TechNova Teams</span>
                    </div>
                </div>

                <!-- Contenedor de resúmenes de cuentas completadas -->
                <div id="completed-accounts-container"></div>

                <div id="registration-forms">
                    <div class="form-group active-form" id="technova-mail-form">
                        <h3>📧 1. Registrarse en TechNova Mail
                        </h3>
                        <label for="mail-user">Usuario:</label>
                        <input type="text" id="mail-user" placeholder="">
                        <label for="mail-pass">Contraseña:</label>
                        <div class="sc1-pass-container">
                            <input type="text" id="mail-pass" value="" autocomplete="off" placeholder="Acepta o crea tu contraseña" class="sc1-pass-input" style="-webkit-text-security: disc;" oncopy="event.clipboardData.setData('text/plain', this.value); event.preventDefault();">
                            <button
                                onmousedown="window.holdPasswordVisibility('mail-pass', true)"
                                onmouseup="window.holdPasswordVisibility('mail-pass', false)"
                                onmouseleave="window.holdPasswordVisibility('mail-pass', false)"
                                onmouseout="window.holdPasswordVisibility('mail-pass', false)"
                                ontouchstart="window.holdPasswordVisibility('mail-pass', true)"
                                ontouchend="window.holdPasswordVisibility('mail-pass', false)"
                                ontouchcancel="window.holdPasswordVisibility('mail-pass', false)"
                                title="Mantener pulsado para ver"
                                class="sc1-eye-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                        </div>
                        <div id="mail-pass-suggestion-box" style="margin-top: 10px; padding: 10px; border: 1px solid #d0d7de; border-radius: 8px; background: #f8fbff;">
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
                        <div class="sc1-pass-container">
                            <input type="text" id="drive-pass" class="sc1-pass-input" style="-webkit-text-security: disc;" oncopy="event.clipboardData.setData('text/plain', this.value); event.preventDefault();">
                            <button
                                onmousedown="window.holdPasswordVisibility('drive-pass', true)"
                                onmouseup="window.holdPasswordVisibility('drive-pass', false)"
                                onmouseleave="window.holdPasswordVisibility('drive-pass', false)"
                                onmouseout="window.holdPasswordVisibility('drive-pass', false)"
                                ontouchstart="window.holdPasswordVisibility('drive-pass', true)"
                                ontouchend="window.holdPasswordVisibility('drive-pass', false)"
                                ontouchcancel="window.holdPasswordVisibility('drive-pass', false)"
                                title="Mantener pulsado para ver"
                                class="sc1-eye-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
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
                        <div class="sc1-pass-container">
                            <input type="text" id="events-pass" class="sc1-pass-input" style="-webkit-text-security: disc;" oncopy="event.clipboardData.setData('text/plain', this.value); event.preventDefault();">
                            <button
                                onmousedown="window.holdPasswordVisibility('events-pass', true)"
                                onmouseup="window.holdPasswordVisibility('events-pass', false)"
                                onmouseleave="window.holdPasswordVisibility('events-pass', false)"
                                onmouseout="window.holdPasswordVisibility('events-pass', false)"
                                ontouchstart="window.holdPasswordVisibility('events-pass', true)"
                                ontouchend="window.holdPasswordVisibility('events-pass', false)"
                                ontouchcancel="window.holdPasswordVisibility('events-pass', false)"
                                title="Mantener pulsado para ver"
                                class="sc1-eye-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
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
    Escenario 2: Interrupción en el Puesto Físico
</h2>

<div id="task-interruption" style="min-height: 600px; background: linear-gradient(135deg, #f4f7fb 0%, #e2e8f0 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; box-shadow: inset 0 2px 20px rgba(255,255,255,0.5);">
    
    <style>
        .decision-btn {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            padding: 16px 20px;
            border-radius: 12px;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            font-size: 15px;
            color: #374151;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            width: 100%;
        }
        .decision-btn:hover {
            border-color: #6366f1;
            background: #ffffff;
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
        }
        .decision-btn .emoji-icon {
            font-size: 26px;
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            flex-shrink: 0;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .decision-btn:hover .emoji-icon {
            background: linear-gradient(135deg, #eef2ff, #e0e7ff);
            transform: scale(1.05);
        }
    </style>

    <!-- Notificación simulada centrada (Premium Teams Style) -->
    <div style="background: white; width: 100%; max-width: 500px; border-radius: 14px; box-shadow: 0 16px 40px rgba(0,0,0,0.1), 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); margin: 0 auto 40px auto; animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
        <div style="background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; color: white;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.5px;">
                <span style="background: rgba(255,255,255,0.2); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 11px;">TN</span>
                TechNova Teams
            </div>
            <span style="font-size: 11px; opacity: 0.85;">URGENTE</span>
        </div>
        <div style="padding: 22px;">
            <div style="display: flex; gap: 16px;">
                <div style="width: 52px; height: 52px; border-radius: 12px; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); display: flex; align-items: center; justify-content: center; font-size: 26px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    👨‍💼
                </div>
                <div>
                    <h4 style="margin: 0 0 6px 0; font-size: 16px; color: #111827; font-weight: 700;">Director de Proyecto</h4>
                    <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">
                        "La reunión ya ha comenzado y el CEO te necesita para revisar el presupuesto de forma inmediata. <b>¡Ven a la Sala 3 ahora mismo, trae tu libreta!</b> Te esperamos."
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Pregunta y opciones -->
    <div style="width: 100%; max-width: 600px; margin: 0 auto; animation: fadeIn 0.8s ease-out 0.2s both;">
        <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 20px; text-align: center; font-weight: 700;">¿Cómo reaccionas ante este aviso?</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px 0; text-align: center;">Selecciona la acción que realizarías físicamente en tu entorno de trabajo antes de acudir:</p>

        <div style="display: flex; flex-direction: column; gap: 14px;">
            
            <button class="decision-btn" onclick="window.handleInterruption(false)">
                <div class="emoji-icon">🏃‍♂️</div>
                <div>
                    <strong style="display:block; color:#1f2937; margin-bottom: 3px; font-size: 15px;">Levantarme y salir de inmediato</strong>
                    <span style="color:#6b7280; font-size: 13px; line-height: 1.4;">Dejo el sistema tal cual, recojo mis notas físicas y acudo a la sala rápidamente.</span>
                </div>
            </button>

            <button class="decision-btn" onclick="window.handleInterruption(false)">
                <div class="emoji-icon">⏬</div>
                <div>
                    <strong style="display:block; color:#1f2937; margin-bottom: 3px; font-size: 15px;">Minimizar las ventanas al escritorio (Win + D)</strong>
                    <span style="color:#6b7280; font-size: 13px; line-height: 1.4;">Oculto visualmente mi trabajo en curso y luego voy a la sala.</span>
                </div>
            </button>

            <button class="decision-btn" onclick="window.handleInterruption(true)">
                <div class="emoji-icon">🔒</div>
                <div>
                    <strong style="display:block; color:#1f2937; margin-bottom: 3px; font-size: 15px;">Bloquear sesión de usuario (Win + L)</strong>
                    <span style="color:#6b7280; font-size: 13px; line-height: 1.4;">Suspendo y aseguro el acceso informático al equipo, luego me dirijo a la sala.</span>
                </div>
            </button>

        </div>
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
                    <p style="margin: 0 0 10px 0; line-height: 1.6;">
                        <strong>Instrucción:</strong> Laura Pérez (tu gerente) te ha pedido que le reenvíes el documento
                        <strong style="color: #e65100;">"Plan_de_Introduccion.docx"</strong>.
                    </p>
                    <p style="margin: 0 0 10px 0; line-height: 1.6;">
                        Usa el botón <strong>"Nuevo Correo" (✏️)</strong> para componer un mensaje a
                        <strong>laura.perez@technova.com</strong> y adjunta el archivo usando el botón <strong>📎</strong>.
                    </p>
                </div>
            </div>
        `,
        4: `
<h2>
    Escenario 4: Búsqueda y Descarga de Recursos
</h2>

<div style="background: #f0f7ff; border-left: 4px solid #0078d4; padding: 14px 18px; border-radius: 6px; margin-bottom: 12px;">
    <p style="margin: 0 0 10px 0; line-height: 1.6;">
        <strong>📋 Instrucción:</strong> Tu gerente te ha pedido que descargues una <strong>plantilla de cronograma de proyectos</strong> para organizar tu incorporación.
    </p>
    <ol style="margin: 0; padding-left: 20px; line-height: 1.8; color: #333;">
        <li>Primero, <strong>revisa las extensiones</strong> instaladas en tu navegador (🧩) y decide si mantenerlas activas.</li>
        <li>Luego, <strong>busca en Google</strong> escribiendo lo que necesites en la barra de búsqueda y pulsa <em>Enter</em> o haz clic en <em>"Buscar con Google"</em>.</li>
        <li>Selecciona un resultado y <strong>descarga la plantilla</strong>.</li>
    </ol>
</div>

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
                        <p><strong>Marta (10:15):</strong> ¡El jefe quiere los cambios de Q4 ya! ¿Alguien tiene el resumen?</p>
                        <p><strong>Juan (10:16):</strong> Carlos Ruiz (DNI: 47821365K) acepta 55.000€ si le damos turno mañana (8-15). Bonus: 12%.</p>
                        <p><strong>Elena (10:17):</strong> Maria Garcia (DNI: 52934871P) pide subida a 45.000€, ahora cobra 42k.</p>
                        <p><strong>Juan (10:18):</strong> Lucía Márquez (DNI: 38471629M) cobra 48.000€. Quiere teletrabajo los viernes o se va.</p>
                        <p><strong>Elena (10:19):</strong> Javier Ochoa (DNI: 61748293R) exige subir de 32k a 35k. Sergio Lopez (DNI: 29384756T) sin cambios, 60k + 5% bonus. Elena Gomez (DNI: 74629183W) pide remoto 100%, cobra 38k.</p>
                        <p><strong>Marta (10:21):</strong> David Perez (DNI: 83726451N) asciende, sube a 50k. Ana Belen (DNI: 19283746S) 52k sin cambios. Pedro Juan (DNI: 46372819F) 30k y Laura Martinez (DNI: 57291836Z) 40k, sin cambios.</p>
                        <p><strong>Marta (10:23):</strong> ¡Entro a la reunión! Pasadlo todo al informe, rápido.</p>
                    </div>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; background: #f4f6f9; padding: 15px; border: 1px solid #ccc; border-radius: 4px;">
                    <label style="font-weight: bold; margin-bottom: 8px; font-size: 0.9em;">Asistente IA (chat):</label>
                    <textarea id="ai-prompt-input"
                        ondblclick="this.select()"
                        placeholder="Ejemplo: Resume los cambios salariales confirmados y marca contradicciones."
                        style="min-height: 90px; padding: 10px; font-size: 0.82em; border: 1px solid #bbb; border-radius: 4px; margin-bottom: 10px;"></textarea>

                    <div style="display:flex; gap:10px; margin-bottom: 10px;">
                        <button onclick="window.useAI()" style="background: #2f5fd0; color: white; flex: 1; font-weight: bold; padding: 10px; border:none; border-radius:6px;">
                            💬 Enviar al asistente
                        </button>
                    </div>

                    <div id="ai-chat-log" style="min-height: 95px; max-height: 130px; overflow-y:auto; background:#fff; border:1px solid #d8dbe2; border-radius:6px; padding:10px; font-size:0.8em; color:#2f3a4a; margin-bottom: 10px;">
                        <p style="margin:0; color:#6b7280;">Aqui veras la respuesta del asistente antes de llevarla al informe.</p>
                    </div>

                    <label style="font-weight: bold; margin-bottom: 10px; font-size: 0.9em;">Validación Final para Marta:</label>
                    <textarea id="ai-editor-body" oninput="window.handleAIInput()"
                        placeholder="Pon orden en este lío y redacta el informe consolidado..."
                        style="flex: 1; min-height: 250px; padding: 10px; font-size: 0.82em; font-family: 'Courier New', Courier, monospace; border: 1px solid #bbb; border-radius: 4px; white-space: pre; overflow-x: auto; resize: none; line-height: 1.5;"></textarea>
                    
                    <div id="ai-status-msg" style="height: 20px; font-size: 0.75em; margin: 5px 0;"></div>
                    
                    <div style="margin: 5px 0 15px 0; font-size: 0.75em; color: #555;">
                        <input type="checkbox" id="check-responsibility">
                        <label for="check-responsibility">Confirm que he filtrado el ruido y los datos son correctos según la política de TechNova.</label>
                    </div>

                    <div style="display: flex; gap: 10px;">
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
                    <label for="prof-personal-email">
                        Email Personal (Opcional)
                    </label>
                    <input type="email" id="prof-personal-email" placeholder="Ej: nombre@gmail.com">
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
<div id="desktop-window-container"></div>
        `,
        9: `
            <h2>Escenario 8: Cuestionario Final</h2>
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
                        <label>¿Cuál es tu sexo?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_0" value="Hombre"> Hombre</label>
                            <label><input type="radio" name="q_0_0" value="Mujer"> Mujer</label>
                            <label><input type="radio" name="q_0_0" value="Prefiero no decirlo"> Prefiero no decirlo</label>
                        </div>
                    </div>

                    <div class="question-custom">
                         <label>¿Cuál es tu facultad o escuela?</label>
                        <select id="faculty-input" name="q_0_2" class="question-input">
                            <option value="">-- Selecciona tu facultad --</option>
                            <option value="Facultad de Bellas Artes">Facultad de Bellas Artes</option>
                            <option value="Facultad de Biología">Facultad de Biología</option>
                            <option value="Facultad de Ciencias del Deporte">Facultad de Ciencias del Deporte</option>
                            <option value="Facultad de Ciencias del Trabajo">Facultad de Ciencias del Trabajo</option>
                            <option value="Facultad de Comunicación y Documentación">Facultad de Comunicación y Documentación</option>
                            <option value="Facultad de Derecho">Facultad de Derecho</option>
                            <option value="Facultad de Economía y Empresa">Facultad de Economía y Empresa</option>
                            <option value="Facultad de Educación">Facultad de Educación</option>
                            <option value="Facultad de Enfermería">Facultad de Enfermería</option>
                            <option value="Facultad de Filosofía">Facultad de Filosofía</option>
                            <option value="Facultad de Geografía e Historia">Facultad de Geografía e Historia</option>
                            <option value="Facultad de Informática">Facultad de Informática</option>
                            <option value="Facultad de Letras">Facultad de Letras</option>
                            <option value="Facultad de Matemáticas">Facultad de Matemáticas</option>
                            <option value="Facultad de Medicina">Facultad de Medicina</option>
                            <option value="Facultad de Óptica y Optometría">Facultad de Óptica y Optometría</option>
                            <option value="Facultad de Psicología">Facultad de Psicología</option>
                            <option value="Facultad de Química">Facultad de Química</option>
                            <option value="Facultad de Trabajo Social">Facultad de Trabajo Social</option>
                            <option value="Facultad de Turismo">Facultad de Turismo</option>
                            <option value="Facultad de Veterinaria">Facultad de Veterinaria</option>
                            <option value="Otra / No estudiante UMU">Otra / No estudiante UMU</option>
                        </select>
                    </div>

                    <div class="question-custom">
                        <label>¿En qué curso o vinculación te encuentras actualmente?</label>
                        <div class="radio-group-custom">
                            <label><input type="radio" name="q_0_7" value="1º curso"> 1º curso</label>
                            <label><input type="radio" name="q_0_7" value="2º curso"> 2º curso</label>
                            <label><input type="radio" name="q_0_7" value="3º curso"> 3º curso</label>
                            <label><input type="radio" name="q_0_7" value="4º curso"> 4º curso</label>
                            <label><input type="radio" name="q_0_7" value="5º curso"> 5º curso</label>
                            <label><input type="radio" name="q_0_7" value="6º curso"> 6º curso</label>
                            <label><input type="radio" name="q_0_7" value="Máster"> Máster</label>
                            <label><input type="radio" name="q_0_7" value="Doctorado"> Doctorado</label>
                            <label><input type="radio" name="q_0_7" value="PDI / PAS"> PDI / PAS</label>
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
                    <div id="questionnaire-timer-box" style="margin-bottom: 16px; padding: 12px 18px; background: #fff3e0; border: 1px solid #ffb300; border-radius: 8px; display: inline-block;">
                        <p id="questionnaire-timer-waiting" style="margin: 0; color: #e65100; font-weight: 600;">
                            ⏱️ Tiempo mínimo restante: <span id="questionnaire-countdown">5:00</span>
                        </p>
                        <p id="questionnaire-timer-ready" style="display: none; margin: 0; color: #2e7d32; font-weight: 600;">
                            ✅ Tiempo mínimo alcanzado. Puedes enviar el cuestionario.
                        </p>
                    </div>
                    <br>
                    <button id="questionnaire-submit-btn" type="button" onclick="window.submitTaxonomy()" class="primary-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Enviar Cuestionario</button>
                    <p id="questionnaire-error" style="display: none; color: #d32f2f; margin-top: 10px;">Por favor, responde a todas las preguntas antes de enviar.</p>
                </div>
            </form>
            `,
        10: `
    <div class="simulation-end-container">
    <h2>¡Simulación Completada!</h2>
    <p>Gracias por tu participación. Tus respuestas y acciones han sido registradas correctamente para nuestro estudio sobre ciberseguridad.</p>
            <p><strong>⚠️ Importante:</strong> Antes de cerrar esta ventana, pulsa el botón <strong>"Finalizar Sesión"</strong> para guardar correctamente todos tus datos.</p>
            <button class="btn-primary" onclick="window.finalizeSession()">Finalizar Sesión</button>
        </div>
        `,
    };
    return scenarios[scenarioNumber] || "";
}
