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
            ${questions.map((q, i) => generateQuestionHTML(q, i)).join('')}
        </div>
    `;
}
export function getScenarioHTML(scenarioNumber) {
    const scenarios = {
        0: `
            <h2>¡Bienvenido a TechNova!</h2>
            <p>Este laboratorio virtual simula tu primer día laboral en la empresa tecnológica TechNova.</p>
            <p>A lo largo de tu jornada, deberás completar varias tareas típicas de incorporación digital.</p>
            
            <div class="participant-id-form" style="margin: 30px 0;">
                <label for="participant-id-input" style="display: block; margin-bottom: 8px; font-weight: bold;">ID de Participante (proporcionado por el investigador):</label>
                <input type="text" id="participant-id-input" placeholder="e.g., P001" style="padding: 8px; width: 200px; margin-bottom: 5px;" />
                <p class="error-message" id="participant-id-error" style="display: none; color: #d32f2f; margin: 5px 0; font-size: 0.9em;">Por favor, introduce un ID de Participante válido</p>
            </div>
            <button onclick="window.validateAndStart()">Comenzar Simulación</button>
        `,
        1: `
            <h2>Escenario 1: Configuración de Cuentas</h2>
            <p>Tu primera tarea es crear tus cuentas de usuario en las plataformas internas de TechNova.</p>
            <div id="registration-forms">

                <div class="form-group" id="technova-mail-form">
                    <h3>1. Registrarse en TechNova Mail</h3>
                    <label for="mail-user">Usuario:</label>
                    <input type="text" id="mail-user">
                    <label for="mail-pass">Contraseña:</label>
                    <input type="password" id="mail-pass">
                    <button onclick="window.registerService('mail')">Crear Cuenta de TechNova Mail</button>
                </div>
                
            <div class="form-group" id="technova-drive-form" style="display:none;">
                <h3>2. Registrarse en TechNova Drive</h3>
                <p>Ahora, regístrate en TechNova Drive, nuestro sistema de almacenamiento en la nube.</p>
                <label for="drive-user">Usuario:</label>
                <input type="text" id="drive-user">
                <label for="drive-pass">Contraseña:</label>
                <input type="password" id="drive-pass">
                <button onclick="window.registerService('drive')">Crear Cuenta de TechNova Drive</button>
            </div>

            <div class="form-group" id="technova-events-form" style="display:none;">
                <h3>3. Registrarse en TechNova Events</h3>
                <p>Finalmente, crea tu perfil en TechNova Events, la red social interna de la compañía.</p>
                <label for="events-user">Usuario:</label>
                <input type="text" id="events-user">
                <label for="events-pass">Contraseña:</label>
                <input type="password" id="events-pass">
                <button onclick="window.registerService('events')">Crear Cuenta de TechNova Events</button>
            </div>
        </div>
        `,

        2:
            `
            <h2>Scenario 2: Dispositivos Externos</h2>

            <div id="simulated-lock-screen">
                <div class="lock-screen-content">
                    <div class="lock-screen-icon">🖥️</div>
                    <h1>Sesión Suspendida</h1>
                    <p>(Simulación de Bloqueo de Pantalla)</p>
                    <div class="lock-screen-prompt">
                        Presiona la tecla <strong>'v'</strong> para volver y continuar.
                    </div>
                </div>
            </div>

            <div id="task-interruption">
                <p><strong>Intrucción:</strong>Necesitas encontrar y descargar una plantilla de cronograma de proyectos para su equipo, que debe presentar en la reunión del lunes. Para eso usa el navegador asociado.'</strong>.</p>
                
                <div style="display: flex; justify-content: space-around; gap: 10px; margin-top: 25px;">
                    
                    <button onclick="window.handleInterruption(true)" style="flex: 1; background: #6c757d; color: white;">
                        🖥️ Suspender sesión
                    </button>
                    
                    <button onclick="window.handleInterruption(false)" style="flex: 1;">
                        Continuar ➡️
                    </button>
                </div>
            </div>

            <div id="task-usb" style="display:none;">
                <h3>Manejo de Dispositivos Externos</h3>
                <p><strong>Instrucción:</strong> Se ha conectado un dispositivo USB. Por favor, navega hasta él y abre el archivo <strong>'Reservas_Refugio.pdf'</strong>.</p>
    
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
                                <div class="fe-item-details"><span>Reservas_Refugio.pdf</span></div>
                            </div>
                        <div class="fe-item" id="file-fotos">
                            <div class="fe-icon">📄</div>
                            <div class="fe-item-details"><span>Mapa_Ruta_Senderismo_BORRADOR.pdf</span></div>
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
            <h2>Scenario 3: Communications Management</h2>
            <p><strong>Instruction:</strong> Open Mail and review your incoming messages. Read through them and handle them as you normally would. <strong>To interact with an email (reply, forward, report, etc.), right-click on it in the inbox.</strong></p>
            <div style="margin-bottom: 10px;">
                <button onclick="window.openComposeEmail()">New Email</button>
            </div>
            <div class="email-client">
                <div class="email-list" id="email-list"></div>
                <div class="email-view" id="email-view">
                    <p>Select an email to read it.</p>
                </div>
            </div>
            <hr>
            <div id="ai-task" style="margin-top:20px;">
                 <h3>Task: Use the AI Assistant</h3>
                 <p><strong>Instrucción:</strong> Ahora debes revisar dos documentos internos para apoyar a su jefa en una reunión estratégica. It contains sensitive attendee details. Use the 'AI Assistant' below to create a summary of dietary and medical needs.</p>
                 <textarea id="ai-input" rows="6" style="width: 98%;" placeholder="Paste content here for the AI Assistant..."></textarea>
                 <button onclick="window.useAI()">Process with AI</button>
            </div>
             <div id="send-doc-task" style="margin-top:20px;">
                <h3>Task: Send Sensitive Document</h3>
                <p><strong>Instrucción:</strong> Ahora manda el documento resumido a tu jefe via email to your collaborator at 'elena_sanchezr@tech_nova'.</p>
                <p> Utiliza el correo electrónico anterior para redactar un nuevo mensaje a tu jefe y adjuntar el documento.</p>
            </div>
        `,
        4: `
            <h2>Scenario 4: Resource Search & Download</h2>
            <p><strong>Instruction:</strong> Use the  Browser to find and download a 'Topographic Map of the Sierra'.</p>
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
            <h2>Scenario 5: Social Media & Personal Information</h2>
            <div id="profile-task">
                <h3>Complete Your Events Profile</h3>
                <p><strong>Instrucción:</strong> Por favor, completa tu perfil en Tech Nova Events.</p>
                <div class="form-group">
                    <label for="prof-name">Name *</label>
                    <input type="text" id="prof-name" value="Alex">
                </div>
                <div class="form-group">
                    <label for="prof-dob">Date of Birth *</label>
                    <input type="text" id="prof-dob">
                </div>
                <div class="form-group">
                    <label for="prof-phone">Personal Phone</label>
                    <input type="text" id="prof-phone">
                </div>
                <div class="form-group">
                    <label for="prof-workplace">Workplace</label>
                    <input type="text" id="prof-workplace">
                </div>
                <div class="form-group">
                    <label for="prof-city">City of Residence</label>
                    <input type="text" id="prof-city">
                </div>
                <button onclick="window.saveProfile()">Save Profile</button>
            </div>
            <div id="app-task" style="display:none;">
                <h3>Conectar una Aplicación de Terceros</h3>
                <p><strong>Instrucción:</strong> Para mejorar la coordinación de equipos, por favor integra la aplicación <strong>'TechNova Calendar Sync'</strong> a tu perfil de TechNova Events.</p>
                <button onclick="window.connectApp()">Conectar 'TechNova Calendar Sync' App</button>
            </div>
        `,
        6: `
            <h2>Scenario 6: Finalization and Cleanup</h2>
            <p>You have finished planning the excursion! The last steps are to save the final plan and securely delete drafts with sensitive data.</p>
            <div id="encrypt-task">
                <h3>Save Final Plan</h3>
                <p>You are saving the final plan: 'Plan_Maestro_Excursion.docx'.</p>
                <input type="checkbox" id="encryption-checkbox"> <label for="encryption-checkbox">Encrypt this file with a password</label>
                <br>
                <button onclick="window.saveFinalPlan()">Save File</button>
            </div>
            <div id="delete-task" style="display:none;">
                <h3>Securely Delete Drafts</h3>
                <p>For privacy reasons, you must now delete 'Lista_Participantes_Excursion.docx'.</p>
                <button class="secondary" onclick="window.deleteFile('trash')">Move to Trash</button>
                <button class="danger" onclick="window.deleteFile('secure')">Secure Permanent Deletion</button>
            </div>
        `,
        7: `
            <h2>Optional Final Phase: Data Breach Check</h2>
            <p>As part of our research, we are studying how public data exposure relates to cybersecurity behavior. This is <strong>100% voluntary</strong>.</p>
            <p>If you consent, you can provide your personal email address. We will use an automated tool to check if it has appeared in any known public data breaches. Your email will be anonymized and stored securely for research purposes only.</p>
            <div class="form-group">
                <label for="consent-email">Your Email Address (Optional)</label>
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
        8:`
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

                ${generateQuestionGroup("1. Password Management & Authentication", [
                    "No cambio mis contraseñas, a menos que sea obligatorio.",
                    "Utilizo contraseñas distintas para cada cuenta.",
                    "Creo contraseñas que superan los requisitos mínimos.",
                    "No incluyo caracteres especiales si no son obligatorios.",
                    "Uso contraseñas simples como el nombre o fecha de nacimiento.",
                    "Uso la misma contraseña para varias cuentas.",
                    "Uso verificación en dos pasos (OTP, SMS, etc.).",
                    "Guardo mis contraseñas en el navegador.",
                    "¿Utilizas autenticación multifactor (MFA)?",
                    "¿Compruebas si tus contraseñas han sido comprometidas?"
                ], 1)}
                
                ${generateQuestionGroup("2. Device Securement & Physical Security", [
                    "Bloqueo manually mi equipo al alejarme.",
                    "Uso contraseña para desbloquear portátil/tablet.",
                    "Uso Wi-Fi pública gratuita.",
                    "Escaneo los dispositivos externos (USB, discos) antes de usarlos."
                ], 2)}

                ${generateQuestionGroup("3. Phishing Awareness & Safe Email Use", [
                    "Abro enlaces sin verificar a dónde dirigen.",
                    "Paso el ratón sobre enlaces antes de hacer clic.",
                    "Reconozco sitios por su apariencia, no por la URL.",
                    "Envío datos sin verificar que la conexión sea segura.",
                    "¿Reportas mensajes sospechosos?"
                ], 3)}

                ${generateQuestionGroup("4. Safe Internet Browsing & Download Practices", [
                    "Introduzco datos de pago en sitios sin certificado.",
                    "Descargo archivos sin verificar su autenticidad.",
                    "Hago clic en anuncios emergentes en sitios web.",
                    "Descargo contenido solo desde sitios oficiales."
                ], 4)}

                ${generateQuestionGroup("5. Social Media & Personal Information Protection", [
                    "Acepto solicitudes de amistad solo por reconocer la foto.",
                    "Comparto mi ubicación actual en redes sociales.",
                    "Muestro información personal en mis perfiles.",
                    "Reenvío publicaciones sin confirmar su veracidad.",
                    "¿Verificas qué datos personales están públicos en internet?"
                ], 5)}

                ${generateQuestionGroup("6. Secure Information Handling & Data Protection", [
                    "Abro archivos sin importar la extensión.",
                    "¿Cifras tus archivos sensibles?",
                    "¿Eliminas datos antes de desechar un dispositivo?"
                ], 6)}

                ${generateQuestionGroup("7. Software Updating & Patch Management", [
                    "Instalo actualizaciones cuando el sistema me lo indica.",
                    "Verifico que mis programas estén actualizados.",
                    "Verifico que el antivirus se actualice.",
                    "¿Mantienes el software de tu equipo actualizado?",
                    "¿Usas antivirus y firewall activados?"
                ], 7)}

                ${generateQuestionGroup("8. Incident Reporting & Response", [
                    "¿Reportas incidentes de seguridad?",
                    "¿Reportas dispositivos perdidos o robados?",
                    "¿Reportas mensajes o personas sin autorización?"
                ], 8)}

                ${generateQuestionGroup("9. Security Awareness & Policy Compliance", [
                    "¿Lees y aceptas las políticas de seguridad de tu organización?",
                    "¿Solicitas ayuda ante dudas de seguridad?",
                    "¿Participas en programas de concienciación en ciberseguridad?",
                    "¿Reportas políticas inseguras que dificultan tu trabajo?"
                ], 9)}

                ${generateQuestionGroup("10. Generative AI & LLM Usage", [
                    "Antes de enviar un mensaje a un LLM, evalúo si contiene información confidencial.",
                    "¿Has incluido documentos o archivos de tu organización en prompts a IA generativa sin autorización?"
                ], 10)}
                <div style="margin-top: 30px;">
                    <button type="button" onclick="window.submitTaxonomy()" class="primary-btn">Enviar Cuestionario</button>
                    <p id="questionnaire-error" style="display: none; color: #d32f2f; margin-top: 10px;">Por favor, responde a todas las preguntas antes de enviar.</p>
                </div>
            </form>
            `,
        9: `
            <h2>Simulation Complete!</h2>
            <p>Thank you for your participation. Your interactions have been recorded to help us improve the Tech Nova platform. Below is a summary of the metrics collected during your session.</p>
            <table id="results-table">
                <thead>
                    <tr><th>Metric Category</th><th>Metric</th><th>Your Result</th></tr>
                </thead>
                <tbody id="results-body"></tbody>
            </table>
        `
    };

    return scenarios[scenarioNumber] || '';
}