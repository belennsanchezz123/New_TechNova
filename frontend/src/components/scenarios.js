export function getScenarioHTML(scenarioNumber) {
    const scenarios = {
        0: `
            <h2>Welcome, Beta Tester!</h2>
            <p>Thank you for helping us test Lynx, the new all-in-one platform for organizing your projects and personal events.</p>
            <p>Your mission is to use the new Lynx suite to plan a fictional event: a <strong>Hiking Trip</strong> for a group of friends. Your primary goal is to evaluate the usability, flow, and intuitiveness of the tools.</p>
            <p><strong>One important rule:</strong> For the privacy of your guests, never use the 'AI Assistant' to process documents containing lists of people or their contact details.</p>
            <div class="participant-id-form" style="margin: 30px 0;">
                <label for="participant-id-input" style="display: block; margin-bottom: 8px; font-weight: bold;">Participant ID (provided by researchers):</label>
                <input type="text" id="participant-id-input" placeholder="e.g., P001" style="padding: 8px; width: 200px; margin-bottom: 5px;" />
                <p class="error-message" id="participant-id-error" style="display: none; color: #d32f2f; margin: 5px 0; font-size: 0.9em;">Please enter a valid Participant ID</p>
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
        // En: frontend/src/components/scenarios.js

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
                <p><strong>Instrucción:</strong> Necesitas ir a otra sala a por el documento <strong>'Lista_Participantes_Excursion.docx'</strong>. Vas a dejar tu puesto de trabajo por un momento.</p>
                
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
                <p><strong>Instrucción:</strong> Se ha conectado un dispositivo USB. Por favor, navega hasta él y abre el archivo <strong>'Mapa_Ruta_Senderismo.pdf'</strong>.</p>
    
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
            <h2>Simulation Complete!</h2>
            <p>Thank you for your participation. Your interactions have been recorded to help us improve the Lynx platform. Below is a summary of the metrics collected during your session.</p>
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
