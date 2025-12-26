import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { emails, renderEmails, openEmail, openComposeEmail } from '../utils/emails.js';

export { openEmail, openComposeEmail };

let composedEmailAttachments = [];

export function handlePhishingClick(isCredPhish) {
    metrics.scenario3.phishing_click_rate = 'Clicked a phishing link';
    if (isCredPhish) {
        const enteredCreds = prompt("Lynx Security: Please re-enter your password to verify your identity.");
        if(enteredCreds) {
             metrics.scenario3.credential_compromise = 'Yes, entered credentials on fake page';
             alert("ERROR: Invalid password. Your account may be at risk.");
        }
    } else {
         alert("Your browser blocked a potentially harmful page.");
    }
}

export function reportEmail(id, type) {
    const email = emails.find(e => e.id === id);
    if (type === 'phishing' && (email.type === 'phishing-creds' || email.type === 'phishing-spam')) {
        metrics.scenario3.phishing_report_rate = 'Correctly reported phishing';
    } else if (type === 'phishing' && email.type === 'legit') {
        metrics.scenario3.phishing_report_rate = 'Incorrectly reported a legitimate email (false positive)';
    }
    alert(`This email has been reported to Lynx Security. Thank you for helping keep our platform safe.`);
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';
}

// No olvidar hacer una funcion export function openConfidentialDoc() 

export function useAI() {
    const rawText = document.getElementById('ai-input').value;
    metrics.scenario3.ai_prompt_text = rawText;
    const text = rawText.toLowerCase();
    //const text = document.getElementById('ai-input').value.toLowerCase();
    // Check for sensitive data
    if (text.includes('participantes') || text.includes('alergias') || text.includes('contacto') || text.includes('lista_participantes')) {
        metrics.scenario3.sensitive_data_exposure_to_llm = 'Yes';
        metrics.scenario3.policy_compliance_llm = 'Broke the rule';
        alert("AI processed sensitive data.");
    } else if (text.trim() === '') {
        alert("Please paste some text for the AI to process.");
    } else {
        metrics.scenario3.sensitive_data_exposure_to_llm = 'No';
        metrics.scenario3.policy_compliance_llm = 'Followed the rule';
        alert("AI processing complete. No sensitive data detected.");
    }
}

export function sendDocument(method) {
    metrics.scenario3.secure_data_transmission = (method === 'secure') ? 'Used Secure Channel (Lynx Drive)' : 'Used Insecure Channel (Direct Attachment)';
    alert(`Document will be sent via ${method === 'secure' ? 'Lynx Drive' : 'email attachment'}.`);
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario3.secure_data_transmission': metrics.scenario3.secure_data_transmission });
        } catch (err) {
            console.warn('Failed saving scenario3 metric:', err);
        }
        setTimeout(() => window.startScenario(4), 1000);
    })();
}

export function openLocalFileExplorer() {
  const localFiles = `
        <div style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px; max-width: 600px; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">
                <h3 style="margin: 0; font-size: 16px;">📂 Explorador de Archivos - Local</h3>
                <button onclick="window.closeFileExplorer()" style="background: transparent; border: none; font-size: 20px; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
            </div>
            <div style="background: #f5f5f5; padding: 8px; margin-bottom: 10px; border-radius: 4px; font-size: 14px;">
                <strong>📍 Ubicación:</strong> Este equipo > Documentos
            </div>
            <div style="margin: 15px 0;">
                <div style="padding: 12px; border: 1px solid #ddd; margin: 8px 0; cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 10px; background: white; transition: background 0.2s;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'"
                     onclick="window.selectAttachment('Lista_Participantes_Excursion.docx', 'local')">
                    <span style="font-size: 24px;">📄</span>
                    <div>
                        <div style="font-weight: 600;">Lista_Participantes_Excursion.docx</div>
                        <div style="font-size: 12px; color: #666;">Documento de Word • 45 KB</div>
                    </div>
                </div>
                <div style="padding: 12px; border: 1px solid #ddd; margin: 8px 0; cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 10px; background: white; transition: background 0.2s;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'"
                     onclick="window.selectAttachment('Mapa_Ruta_Senderismo.pdf', 'local')">
                    <span style="font-size: 24px;">📄</span>
                    <div>
                        <div style="font-weight: 600;">Mapa_Ruta_Senderismo.pdf</div>
                        <div style="font-size: 12px; color: #666;">PDF Document • 1.2 MB</div>
                    </div>
                </div>
                <div style="padding: 12px; border: 1px solid #ddd; margin: 8px 0; cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 10px; background: white; transition: background 0.2s;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'"
                     onclick="window.selectAttachment('Presupuesto_Viaje.xlsx', 'local')">
                    <span style="font-size: 24px;">📊</span>
                    <div>
                        <div style="font-weight: 600;">Presupuesto_Viaje.xlsx</div>
                        <div style="font-size: 12px; color: #666;">Hoja de cálculo • 23 KB</div>
                    </div>
                </div>
            </div>
            <button onclick="window.closeFileExplorer()" style="margin-top: 10px; width: 100%;">Cancelar</button>
        </div>
    `;

  const modal = document.createElement("div");
  modal.id = "file-explorer-modal";
  modal.style.cssText =
    "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;";
  modal.innerHTML = localFiles;
  document.body.appendChild(modal);
}

export function openDriveFileExplorer() {
    const driveFiles = `
        <div style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px; max-width: 600px; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #4CAF50;">
                <h3 style="margin: 0; font-size: 16px; color: #4CAF50;">☁️ Lynx Drive - Mis Archivos</h3>
                <button onclick="window.closeFileExplorer()" style="background: transparent; border: none; font-size: 20px; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
            </div>
            <div style="background: #e8f5e9; padding: 8px; margin-bottom: 10px; border-radius: 4px; font-size: 14px; border-left: 3px solid #4CAF50;">
                <strong>☁️ Ubicación:</strong> Lynx Drive / Mis Archivos
            </div>
            <div style="margin: 15px 0;">
                <div style="padding: 12px; border: 1px solid #ddd; margin: 8px 0; cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 10px; background: white; transition: background 0.2s;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'"
                     onclick="window.selectAttachment('Lista_Participantes_Excursion.docx', 'drive')">
                    <span style="font-size: 24px;">📄</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">Lista_Participantes_Excursion.docx</div>
                        <div style="font-size: 12px; color: #666;">Documento de Word • Compartido como enlace seguro</div>
                    </div>
                    <span style="font-size: 20px; color: #4CAF50;">🔗</span>
                </div>
                <div style="padding: 12px; border: 1px solid #ddd; margin: 8px 0; cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 10px; background: white; transition: background 0.2s;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'"
                     onclick="window.selectAttachment('Fotos_Excursion_Anterior.zip', 'drive')">
                    <span style="font-size: 24px;">🗜️</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">Fotos_Excursion_Anterior.zip</div>
                        <div style="font-size: 12px; color: #666;">Archivo comprimido • 15 MB</div>
                    </div>
                    <span style="font-size: 20px; color: #4CAF50;">🔗</span>
                </div>
            </div>
            <button onclick="window.closeFileExplorer()" style="margin-top: 10px; width: 100%;">Cancelar</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'file-explorer-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    modal.innerHTML = driveFiles;
    document.body.appendChild(modal);
}

export function selectAttachment(filename, method) {
    composedEmailAttachments.push({ filename, method });

    const attachmentsDiv = document.getElementById('compose-attachments');
    if (attachmentsDiv) {
        if (composedEmailAttachments.length === 0) {
            attachmentsDiv.innerHTML = '<p style="color: #666; font-size: 14px; margin: 0;">No attachments</p>';
        } else {
            const attachmentsList = composedEmailAttachments.map((att, index) => {
                const icon = att.method === 'drive' ? '🔗' : '📎';
                const methodText = att.method === 'drive' ? 'Lynx Drive (Enlace seguro)' : 'Adjunto directo';
                const bgColor = att.method === 'drive' ? '#e8f5e9' : '#fff3e0';
                const borderColor = att.method === 'drive' ? '#4CAF50' : '#ff9800';

                return `<div style="padding: 10px; margin: 5px 0; background: ${bgColor}; border-left: 3px solid ${borderColor}; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">${icon}</span>
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">${att.filename}</div>
                            <div style="font-size: 12px; color: #666;">${methodText}</div>
                        </div>
                    </div>
                    <button onclick="window.removeAttachment(${index})" style="background: transparent; border: none; cursor: pointer; font-size: 18px; color: #999;">×</button>
                </div>`;
            }).join('');
            attachmentsDiv.innerHTML = attachmentsList;
        }
    }

    closeFileExplorer();
}

export function removeAttachment(index) {
    composedEmailAttachments.splice(index, 1);

    const attachmentsDiv = document.getElementById('compose-attachments');
    if (attachmentsDiv) {
        if (composedEmailAttachments.length === 0) {
            attachmentsDiv.innerHTML = '<p style="color: #666; font-size: 14px; margin: 0;">No attachments</p>';
        } else {
            const attachmentsList = composedEmailAttachments.map((att, idx) => {
                const icon = att.method === 'drive' ? '🔗' : '📎';
                const methodText = att.method === 'drive' ? 'Lynx Drive (Enlace seguro)' : 'Adjunto directo';
                const bgColor = att.method === 'drive' ? '#e8f5e9' : '#fff3e0';
                const borderColor = att.method === 'drive' ? '#4CAF50' : '#ff9800';

                return `<div style="padding: 10px; margin: 5px 0; background: ${bgColor}; border-left: 3px solid ${borderColor}; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">${icon}</span>
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">${att.filename}</div>
                            <div style="font-size: 12px; color: #666;">${methodText}</div>
                        </div>
                    </div>
                    <button onclick="window.removeAttachment(${idx})" style="background: transparent; border: none; cursor: pointer; font-size: 18px; color: #999;">×</button>
                </div>`;
            }).join('');
            attachmentsDiv.innerHTML = attachmentsList;
        }
    }
}

export function closeFileExplorer() {
    const modal = document.getElementById('file-explorer-modal');
    if (modal) {
        modal.remove();
    }
}

export function sendComposedEmail() {
    const to = document.getElementById('compose-to')?.value.trim().toLowerCase();
    const subject = document.getElementById('compose-subject')?.value;
    
    if (!to || !subject) {
        alert('Por favor completa el destinatario y el asunto.');
        return;
    }

    // 1. LÓGICA PARA EL CORREO DE LAURA (Micro-tarea de "Interacción")
    if (to.includes('laura.perez@technova.com')) {
        // Feedback positivo inmediato
        alert('✅ Mensaje enviado a Laura Pérez.\n\n(Has respondido correctamente a una solicitud interna legítima. Puedes continuar con el resto de tareas).');
        
        // Limpiamos el formulario y volvemos a la vista de lista
        composedEmailAttachments = [];
        document.getElementById('email-view').innerHTML = '<p>Selecciona un correo para leerlo.</p>';
        
        // Opcional: Aquí podrías registrar una métrica de "Interacción Correcta" si quisieras
        return; 
    }

    // 2. LÓGICA PARA EL ENVÍO DEL DOCUMENTO SENSIBLE (Tarea Final)
    const hasSensitiveDoc = composedEmailAttachments.some(att =>
        att.filename === 'Presupuesto_Interno_Q3.xlsx' || att.filename === 'Lista_Participantes_Excursion.docx'
    );

    const usedSecureMethod = composedEmailAttachments.some(att =>
        (att.filename === 'Presupuesto_Interno_Q3.xlsx' || att.filename === 'Lista_Participantes_Excursion.docx') 
        && att.method === 'drive'
    );

    // Si está enviando el documento sensible (a contabilidad o colaborador)
    if (hasSensitiveDoc) {
        // Métrica clave del escenario
        metrics.scenario3.secure_data_transmission = usedSecureMethod ?
            'Used Secure Channel (Lynx Drive)' :
            'Used Insecure Channel (Direct Attachment)';
            
        alert(`📨 Documento enviado a ${to}.`);
        
        // Transición al siguiente escenario (Escenario 4)
        setTimeout(() => window.startScenario(4), 1000);
        
    } else {
        // Envío genérico (cualquier otro correo)
        alert(`Correo enviado a ${to}.`);
        composedEmailAttachments = [];
        document.getElementById('email-view').innerHTML = '<p>Selecciona un correo para leerlo.</p>';
    }
}

export function cancelCompose() {
    composedEmailAttachments = [];
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';
}
