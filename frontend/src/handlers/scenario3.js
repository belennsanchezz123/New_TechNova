import { metrics } from '../utils/metrics.js';
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

export function useAI() {
    const text = document.getElementById('ai-input').value.toLowerCase();
    if (text.includes('participantes') || text.includes('alergias') || text.includes('contacto')) {
        metrics.scenario3.sensitive_data_exposure_to_llm = 'Yes';
        metrics.scenario3.policy_compliance_llm = 'Broke the rule';
        alert("AI processed sensitive data.");
    } else {
         alert("AI processing complete.");
    }
}

export function sendDocument(method) {
    metrics.scenario3.secure_data_transmission = (method === 'secure') ? 'Used Secure Channel (Lynx Drive)' : 'Used Insecure Channel (Direct Attachment)';
    alert(`Document will be sent via ${method === 'secure' ? 'Lynx Drive' : 'email attachment'}.`);
    setTimeout(() => window.startScenario(4), 1000);
}

export function addAttachment() {
    const attachmentOptions = `
        <div style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px; max-width: 500px; margin: 20px auto;">
            <h3>Select File to Attach</h3>
            <div style="margin: 15px 0;">
                <div style="padding: 10px; border: 1px solid #ddd; margin: 5px 0; cursor: pointer; border-radius: 4px;" onclick="window.selectAttachment('Lista_Participantes_Excursion.docx', 'direct')">
                    📄 Lista_Participantes_Excursion.docx (Direct attachment)
                </div>
                <div style="padding: 10px; border: 1px solid #ddd; margin: 5px 0; cursor: pointer; border-radius: 4px;" onclick="window.selectAttachment('Lista_Participantes_Excursion.docx', 'link')">
                    🔗 Lista_Participantes_Excursion.docx (Secure Lynx Drive link)
                </div>
                <div style="padding: 10px; border: 1px solid #ddd; margin: 5px 0; cursor: pointer; border-radius: 4px;" onclick="window.selectAttachment('Mapa_Ruta_Senderismo.pdf', 'direct')">
                    📄 Mapa_Ruta_Senderismo.pdf
                </div>
            </div>
            <button onclick="window.closeAttachmentModal()" style="margin-top: 10px;">Cancel</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'attachment-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    modal.innerHTML = attachmentOptions;
    document.body.appendChild(modal);
}

export function selectAttachment(filename, method) {
    composedEmailAttachments.push({ filename, method });

    const attachmentsDiv = document.getElementById('compose-attachments');
    if (attachmentsDiv) {
        const attachmentsList = composedEmailAttachments.map(att =>
            `<div style="padding: 5px; margin: 5px 0; background: #f0f0f0; border-radius: 4px;">
                ${att.method === 'link' ? '🔗' : '📎'} ${att.filename} ${att.method === 'link' ? '(Secure link)' : '(Direct)'}
            </div>`
        ).join('');
        attachmentsDiv.innerHTML = attachmentsList || '<p style="color: #666; font-size: 14px;">No attachments</p>';
    }

    closeAttachmentModal();
}

export function closeAttachmentModal() {
    const modal = document.getElementById('attachment-modal');
    if (modal) {
        modal.remove();
    }
}

export function sendComposedEmail() {
    const to = document.getElementById('compose-to')?.value;
    const subject = document.getElementById('compose-subject')?.value;
    const body = document.getElementById('compose-body')?.value;

    if (!to || !subject) {
        alert('Please fill in the recipient and subject fields.');
        return;
    }

    const hasSensitiveDoc = composedEmailAttachments.some(att =>
        att.filename === 'Lista_Participantes_Excursion.docx'
    );

    const usedSecureMethod = composedEmailAttachments.some(att =>
        att.filename === 'Lista_Participantes_Excursion.docx' && att.method === 'link'
    );

    if (hasSensitiveDoc) {
        metrics.scenario3.secure_data_transmission = usedSecureMethod ?
            'Used Secure Channel (Lynx Drive)' :
            'Used Insecure Channel (Direct Attachment)';
    }

    alert(`Email sent to ${to}!`);
    composedEmailAttachments = [];

    if (to.includes('colaborador@lynx-mail.sim') && hasSensitiveDoc) {
        setTimeout(() => window.startScenario(4), 1000);
    } else {
        document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';
    }
}

export function cancelCompose() {
    composedEmailAttachments = [];
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';
}
