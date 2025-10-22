export function getScenarioHTML(scenarioNumber) {
    const scenarios = {
        0: `
            <h2>Welcome, Beta Tester!</h2>
            <p>Thank you for helping us test Lynx, the new all-in-one platform for organizing your projects and personal events.</p>
            <p>Your mission is to use the new Lynx suite to plan a fictional event: a <strong>Hiking Trip</strong> for a group of friends. Your primary goal is to evaluate the usability, flow, and intuitiveness of the tools.</p>
            <p><strong>One important rule:</strong> For the privacy of your guests, never use the 'AI Assistant' to process documents containing lists of people or their contact details.</p>
            <p>Click "Begin" to start the simulation.</p>
            <button onclick="window.startScenario(1)">Begin Simulation</button>
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
            <h2>Scenario 2: Interruption & Peripherals</h2>
            <div id="task-interruption">
                <p><strong>Instruction:</strong> Before you continue, one of the organizers needs to ask you a few quick questions. Please get their attention. For this simulation, imagine you are turning away from your screen to talk to someone for a minute.</p>
                <p>What do you do with your computer screen?</p>
                <button id="lock-screen-btn" onclick="window.handleInterruption(true)">Lock Screen (Win + L)</button>
                <button class="secondary" onclick="window.handleInterruption(false)">Do Nothing</button>
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
                            <div class="fe-item" id="usb-drive">
                                <div class="fe-icon">💾</div>
                                <div class="fe-item-details">
                                    <span>EVENT_FILES (E:)</span>
                                    <div class="progress-bar"><div style="width: 25%;"></div></div>
                                </div>
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

        <div id="usb-context-menu" class="context-menu">
            <ul>
                <li id="usb-context-open">Abrir</li>
                <li id="usb-context-scan">Analizar con Antivirus Lynx</li>
            </ul>
        </div>
        </div>
        `,
        3: `
            <h2>Scenario 3: Communications Management (Phishing)</h2>
            <p><strong>Instruction:</strong> Open Lynx Mail. Your task is to categorize each message using the action buttons. Decide if each email is Important, Informative (Archive), Spam, or Phishing.</p>
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
                 <p><strong>Remember the rule:</strong> Never use the AI for documents with personal contact data.</p>
            </div>
             <div id="send-doc-task" style="margin-top:20px;">
                <h3>Task: Send Sensitive Document</h3>
                <p><strong>Instruction:</strong> Now, send the original complete document ('Lista_Participantes_Excursion.docx') to your collaborator at 'colaborador@lynx-mail.sim'.</p>
                <p>How do you want to send the file?</p>
                <button onclick="window.sendDocument('insecure')">Attach File directly to Email</button>
                <button onclick="window.sendDocument('secure')">Share from Lynx Drive (Secure Link)</button>
            </div>
        `,
        4: `
            <h2>Scenario 4: Resource Search & Download</h2>
            <p><strong>Instruction:</strong> Use the Lynx Browser to find and download a 'Topographic Map of the Sierra'.</p>
            <div class="browser-window">
                <h3>Lynx Browser</h3>
                <p>Search results for: <em>'Topographic Map of the Sierra'</em></p>
                <div class="search-results">
                    <a onclick="window.navigate('official')">Topographic Map of the Sierra - 'Official Site of Natural Parks'</a>
                    <a onclick="window.navigate('external')">Topographic Map of the Sierra - 'External Map Archive'</a>
                </div>
                <div id="browser-content" style="margin-top:20px; border-top: 1px solid #eee; padding-top:15px;">
                    <p>Click a link to navigate.</p>
                </div>
            </div>
        `,
        5: `
            <h2>Scenario 5: Social Media & Personal Information</h2>
            <div id="profile-task">
                <h3>Complete Your Lynx Events Profile</h3>
                <p><strong>Instruction:</strong> Please complete your profile on Lynx Events. Fill in the information you consider appropriate for the event page.</p>
                <div class="form-group">
                    <label for="prof-name">Name (Required)</label>
                    <input type="text" id="prof-name" value="Alex">
                </div>
                <div class="form-group">
                    <label for="prof-dob">Date of Birth (Optional)</label>
                    <input type="text" id="prof-dob">
                </div>
                <div class="form-group">
                    <label for="prof-phone">Personal Phone (Optional)</label>
                    <input type="text" id="prof-phone">
                </div>
                <div class="form-group">
                    <label for="prof-city">City of Residence (Optional)</label>
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
            <p>If you consent, you can provide your personal email address. We will use an automated tool to check if it has appeared in any known public data breaches. Your email will be anonymized and deleted after the check.</p>
            <div class="form-group">
                <label for="consent-email">Your Email Address (Optional)</label>
                <input type="email" id="consent-email" placeholder="Leave blank to decline">
            </div>
            <button onclick="window.finishSimulation(true)">I Consent and Submit</button>
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
