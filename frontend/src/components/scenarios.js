export function getScenarioHTML(scenarioNumber) {
    const scenarios = {
        0: `
            <h2>Welcome, Beta Tester!</h2>
            <p>Thank you for helping us test Lynx, the new all-in-one platform for organizing your projects and personal events.</p>
            <p>Your mission is to use the new Lynx suite to plan a fictional event: a <strong>Hiking Trip</strong> for a group of friends. Your primary goal is to evaluate the usability, flow, and intuitiveness of the tools.</p>
            <p><strong>One important rule:</strong> For the privacy of your guests, never use the 'AI Assistant' to process documents containing lists of people or their contact details.</p>
            <div class="participant-id-form" style="margin: 30px 0;">
                <label for="participant-id-input" style="display: block; margin-bottom: 8px; font-weight: bold;">Participant ID (provided by researchers):</label>
                <input type="text" id="participant-id-input" placeholder="" style="padding: 8px; width: 200px; margin-bottom: 5px;" />
                <p class="error-message" id="participant-id-error" style="display: none; color: #d32f2f; margin: 5px 0; font-size: 0.9em;">Please enter a valid Participant ID (P001-P050)</p>
            </div>
            <button onclick="window.validateAndStart()">Begin Simulation</button>
        `,
        1: `
            <h2>Scenario 1: Account Creation</h2>
            <p>Your first task is to create user accounts in the main Lynx applications. We want to measure how intuitive the registration process is.</p>
            <div id="registration-forms">
                <div class="form-group" id="lynx-mail-form">
                    <h3>1. Register for Lynx Mail</h3>
                    <label for="mail-user">Username:</label>
                    <input type="text" id="mail-user" placeholder="e.g., hikinglover">
                    <label for="mail-pass">Password:</label>
                    <input type="password" id="mail-pass">
                    <button onclick="window.registerService('mail')">Create Lynx Mail Account</button>
                </div>
                <div class="form-group" id="lynx-drive-form" style="display:none;">
                    <h3>2. Register for Lynx Drive</h3>
                    <p>Now, register for Lynx Drive, our cloud storage system.</p>
                     <label for="drive-user">Username:</label>
                    <input type="text" id="drive-user" placeholder="e.g., hikinglover">
                    <label for="drive-pass">Password:</label>
                    <input type="password" id="drive-pass">
                    <button onclick="window.registerService('drive')">Create Lynx Drive Account</button>
                </div>
                <div class="form-group" id="lynx-events-form" style="display:none;">
                    <h3>3. Register for Lynx Events</h3>
                    <p>Finally, create your profile on Lynx Events, the social network for organizing the trip.</p>
                    <label for="events-user">Username:</label>
                    <input type="text" id="events-user" placeholder="e.g., hikinglover">
                    <label for="events-pass">Password:</label>
                    <input type="password" id="events-pass">
                    <button onclick="window.registerService('events')">Create Lynx Events Account</button>
                </div>
            </div>
        `,
        2: `
            <h2>Scenario 2: External Devices</h2>
            <div id="task-interruption">
                <p><strong>Instruction:</strong> You need to retrieve the document <strong>'Lista_Participantes_Excursion.docx'</strong> from another room. Please leave your workstation to get it.</p>
                <button onclick="window.handleInterruption(false)">Continue</button>
            </div>
            <div id="task-usb" style="display:none;">
                <h3>Handling External Devices</h3>
                <p><strong>Instruction:</strong> A USB device has been connected. Please navigate to it and open the file named <strong>'Mapa_Ruta_Senderismo.pdf'</strong>.</p>
    
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
                                <div class="fe-item-details"><span>Mapa_Ruta_Senderismo.pdf</span></div>
                            </div>
                        <div class="fe-item" id="file-fotos">
                            <div class="fe-icon">📦</div>
                            <div class="fe-item-details"><span>Fotos_Localizacion.zip</span></div>
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
                Analizar con Antivirus Lynx...
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
                <h3>Lynx Antivirus</h3>
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
            <p><strong>Instruction:</strong> Open Lynx Mail and review your incoming messages. Read through them and handle them as you normally would. <strong>To interact with an email (reply, forward, report, etc.), right-click on it in the inbox.</strong></p>
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
                 <p><strong>Instruction 1:</strong> On your desktop, you find 'Lista_Participantes_Excursion.docx'. It contains sensitive attendee details. Use the 'Lynx AI Assistant' below to create a summary of dietary and medical needs.</p>
                 <textarea id="ai-input" rows="6" style="width: 98%;" placeholder="Paste content here for the AI Assistant..."></textarea>
                 <button onclick="window.useAI()">Process with AI</button>
            </div>
             <div id="send-doc-task" style="margin-top:20px;">
                <h3>Task: Send Sensitive Document</h3>
                <p><strong>Instruction:</strong> Now, send the original complete document ('Lista_Participantes_Excursion.docx') to your collaborator at 'colaborador@lynx-mail.sim'.</p>
                <p>Use the email client above to compose a new message to your collaborator and attach the document.</p>
            </div>
        `,
        4: `
            <h2>Scenario 4: Resource Search & Download</h2>
            <p><strong>Instruction:</strong> Use the Lynx Browser to find and download a 'Topographic Map of the Sierra'.</p>
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
                        <!-- Info del sitio se muestra aquí -->
                    </div>
                </div>
                <div id="browser-viewport">
                    <div id="browser-content">
                        <!-- Contenido se carga dinámicamente -->
                    </div>
                </div>
            </div>
        `,
        5: `
            <h2>Scenario 5: Social Media & Personal Information</h2>
            <div id="profile-task">
                <h3>Complete Your Lynx Events Profile</h3>
                <p><strong>Instruction:</strong> Please complete your profile on Lynx Events. Fill in the information you consider appropriate for the event page.</p>
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
                <h3>Connect a Third-Party Application</h3>
                <p><strong>Instruction:</strong> To improve organization, please integrate the 'Lynx Route Planner' app to add a map to your event.</p>
                <button onclick="window.connectApp()">Connect 'Lynx Route Planner' App</button>
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
        8: `
            <h2>Cuestionario Post-Simulación (Concienciación y Hábitos)</h2>
            <p><strong>Instrucciones:</strong> Por favor, responde a las siguientes preguntas sobre tus hábitos y percepciones de seguridad. No hay respuestas correctas o incorrectas. Tus respuestas son anónimas y nos ayudarán a entender mejor los resultados de la simulación.</p>

            <div class="questionnaire-form">
                <div class="question-section">
                    <h3>1. Percepción General</h3>

                    <div class="question">
                        <label>1.1. En una escala del 1 (Nada) al 5 (Muy), ¿cómo de prioritario es para ti mantener la seguridad de tus cuentas y datos online?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q1_1" value="1"> 1 (Nada)</label>
                            <label><input type="radio" name="q1_1" value="2"> 2</label>
                            <label><input type="radio" name="q1_1" value="3"> 3</label>
                            <label><input type="radio" name="q1_1" value="4"> 4</label>
                            <label><input type="radio" name="q1_1" value="5"> 5 (Muy)</label>
                        </div>
                    </div>

                    <div class="question">
                        <label>1.2. En una escala del 1 (Novato) al 5 (Experto), ¿cómo calificarías tu nivel general de conocimientos en ciberseguridad?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q1_2" value="1"> 1 (Novato)</label>
                            <label><input type="radio" name="q1_2" value="2"> 2</label>
                            <label><input type="radio" name="q1_2" value="3"> 3</label>
                            <label><input type="radio" name="q1_2" value="4"> 4</label>
                            <label><input type="radio" name="q1_2" value="5"> 5 (Experto)</label>
                        </div>
                    </div>
                </div>

                <div class="question-section">
                    <h3>2. Hábitos de Contraseñas y Cuentas</h3>

                    <div class="question">
                        <label>2.1. Cuando un servicio online te ofrece la "Autenticación de Dos Pasos" (MFA/2FA), ¿con qué frecuencia la activas?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q2_1" value="a"> (a) Siempre, es lo primero que hago.</label>
                            <label><input type="radio" name="q2_1" value="b"> (b) A menudo, si el servicio es importante (ej. banco, email).</label>
                            <label><input type="radio" name="q2_1" value="c"> (c) Rara vez, me parece una molestia.</label>
                            <label><input type="radio" name="q2_1" value="d"> (d) Nunca, no sé qué es o cómo usarlo.</label>
                        </div>
                    </div>

                    <div class="question">
                        <label>2.2. ¿Cómo gestionas tus contraseñas para diferentes sitios web?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q2_2" value="a"> (a) Uso un gestor de contraseñas (ej. Bitwarden, 1Password, Llavero de Apple/Google).</label>
                            <label><input type="radio" name="q2_2" value="b"> (b) Intento crear contraseñas únicas y memorizarlas.</label>
                            <label><input type="radio" name="q2_2" value="c"> (c) Reutilizo la misma contraseña (o variaciones leves) en la mayoría de los sitios.</label>
                            <label><input type="radio" name="q2_2" value="d"> (d) Las apunto en un documento en mi ordenador o en un papel.</label>
                        </div>
                    </div>
                </div>

                <div class="question-section">
                    <h3>3. Redes Sociales y Privacidad</h3>

                    <div class="question">
                        <label>3.1. Aproximadamente, ¿en cuántas redes sociales (Facebook, Instagram, LinkedIn, X, TikTok, etc.) tienes un perfil activo?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q3_1" value="a"> (a) 0</label>
                            <label><input type="radio" name="q3_1" value="b"> (b) 1-2</label>
                            <label><input type="radio" name="q3_1" value="c"> (c) 3-4</label>
                            <label><input type="radio" name="q3_1" value="d"> (d) 5 o más</label>
                        </div>
                    </div>

                    <div class="question">
                        <label>3.2. ¿Con qué frecuencia revisas la configuración de privacidad de tus redes sociales (ej. quién puede ver tus publicaciones o tu información)?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q3_2" value="a"> (a) Regularmente (al menos cada 6 meses).</label>
                            <label><input type="radio" name="q3_2" value="b"> (b) A veces (quizás una vez al año, o si oigo una noticia).</label>
                            <label><input type="radio" name="q3_2" value="c"> (c) Solo cuando creé la cuenta.</label>
                            <label><input type="radio" name="q3_2" value="d"> (d) Nunca.</label>
                        </div>
                    </div>
                </div>

                <div class="question-section">
                    <h3>4. Seguridad del Dispositivo y Navegación</h3>

                    <div class="question">
                        <label>4.1. Si te levantas de tu ordenador en un lugar público o en la oficina (ej. para ir al baño o a por un café), ¿bloqueas la pantalla?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q4_1" value="a"> (a) Siempre, es un acto reflejo (ej. Win+L).</label>
                            <label><input type="radio" name="q4_1" value="b"> (b) Casi siempre, a menos que sea solo un segundo.</label>
                            <label><input type="radio" name="q4_1" value="c"> (c) Rara vez.</label>
                            <label><input type="radio" name="q4_1" value="d"> (d) Nunca, confío en la gente a mi alrededor.</label>
                        </div>
                    </div>

                    <div class="question">
                        <label>4.2. Cuando tu teléfono o tu ordenador te notifica sobre una "actualización de seguridad" disponible:</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q4_2" value="a"> (a) La instalo tan pronto como puedo.</label>
                            <label><input type="radio" name="q4_2" value="b"> (b) La pospongo repetidamente hasta que me obliga.</label>
                            <label><input type="radio" name="q4_2" value="c"> (c) Intento ignorarla, me preocupa que algo deje de funcionar.</label>
                        </div>
                    </div>
                </div>

                <div class="question-section">
                    <h3>5. Correo Electrónico y Phishing</h3>

                    <div class="question">
                        <label>5.1. Recibes un correo de un servicio que usas (ej. Netflix, Amazon) diciendo que hay un "problema con tu pago" y un enlace para "solucionarlo ahora". ¿Qué haces?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q5_1" value="a"> (a) Hago clic en el enlace para ver qué pasa.</label>
                            <label><input type="radio" name="q5_1" value="b"> (b) No hago clic. Abro una nueva pestaña del navegador y escribo la dirección del sitio yo mismo para comprobarlo desde allí.</label>
                            <label><input type="radio" name="q5_1" value="c"> (c) Ignoro el correo, probablemente sea un error.</label>
                            <label><input type="radio" name="q5_1" value="d"> (d) Reviso con mucho cuidado la dirección del remitente y la URL del enlace antes de decidir.</label>
                        </div>
                    </div>

                    <div class="question">
                        <label>5.2. Si detectas un correo que es claramente "phishing" o una estafa, ¿qué sueles hacer?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="q5_2" value="a"> (a) Simplemente lo borro.</label>
                            <label><input type="radio" name="q5_2" value="b"> (b) Lo borro y bloqueo al remitente.</label>
                            <label><input type="radio" name="q5_2" value="c"> (c) Utilizo el botón de "Reportar Phishing" o "Reportar Spam" de mi email.</label>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <button onclick="window.submitQuestionnaire()" class="primary-btn">Enviar Cuestionario</button>
                    <p id="questionnaire-error" style="display: none; color: #d32f2f; margin-top: 10px;">Por favor, responde a todas las preguntas antes de enviar.</p>
                </div>
            </div>
        `
    };

    return scenarios[scenarioNumber] || '';
}
