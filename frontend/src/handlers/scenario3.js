import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { emails, openEmail as _originalOpenEmail, openComposeEmail } from '../utils/emails.js';

export { openComposeEmail };

// Wrap openEmail to show Phase 2 when Laura's task email (#9) is read
export function openEmail(id) {
    _originalOpenEmail(id);

    // Show Phase 2 when the user reads Laura's email asking for the document
    if (id === 9) {
        const phase2 = document.getElementById('email-phase-2');
        if (phase2 && phase2.style.display === 'none') {
            phase2.style.display = 'block';
            phase2.style.animation = 'fadeIn 0.5s ease';
        }
    }
}

// Check if all emails have been read (used by navigation gate)
export function areAllEmailsRead() {
    return emails.every(e => e.read);
}

export function initScenario3() {
    const phase2 = document.getElementById('email-phase-2');
    if (phase2) phase2.style.display = 'none';
}

let composedEmailAttachments = [];

// ── Phishing handling ─────────────────────────────────────────────

export function handlePhishingClick(isCredPhish) {
    metrics.scenario3.phishing_clicked = 1;

    if (isCredPhish) {
        const enteredCreds = prompt("Lynx Security: Please re-enter your password to verify your identity.");
        if (enteredCreds) {
            metrics.scenario3.credential_compromise = 1;
            alert("ERROR: Invalid password. Your account may be at risk.");
        }
    } else {
        alert("Your browser blocked a potentially harmful page.");
    }

    // Persist immediately
    _saveS3Metrics();
}

// ── Email reporting ───────────────────────────────────────────────

export function reportEmail(id, type) {
    const email = emails.find(e => e.id === id);

    if (type === 'phishing' && (email.type === 'phishing-creds' || email.type === 'phishing-spam' || email.type === 'phishing-malware')) {
        metrics.scenario3.phishing_reported = 1;
    }
    // Note: reporting a legit email as phishing is a false positive but we don't penalize it

    alert(`This email has been reported to Lynx Security. Thank you for helping keep our platform safe.`);
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';

    _saveS3Metrics();
}

// ── File explorers (Local / Drive) ────────────────────────────────

// Shared file list — same files appear in both local and Drive
const _sharedFiles = [
    { filename: 'Plan_de_Introduccion.docx', icon: '📄', desc: 'Documento de Word • 128 KB' },
    { filename: 'Lista_Participantes_Excursion.docx', icon: '📄', desc: 'Documento de Word • 45 KB' },
    { filename: 'Presupuesto_Interno_Q3.xlsx', icon: '📊', desc: 'Hoja de cálculo • 67 KB' },
    { filename: 'Mapa_Ruta_Senderismo.pdf', icon: '📑', desc: 'PDF Document • 1.2 MB' },
];

function _renderFileList(method) {
    return _sharedFiles.map(f => {
        const driveBadge = method === 'drive'
            ? '<span style="font-size: 14px; color: #4CAF50; margin-left: auto; flex-shrink: 0;">🔗 Enlace seguro</span>'
            : '';
        return '<div style="padding: 12px 14px; border: 1px solid #e0e0e0; margin: 6px 0; cursor: pointer; border-radius: 8px; display: flex; align-items: center; gap: 12px; background: white; transition: all 0.15s;"'
            + ' onmouseover="this.style.background=\'#f5f7fa\'; this.style.borderColor=\'#b0bec5\'"'
            + ' onmouseout="this.style.background=\'white\'; this.style.borderColor=\'#e0e0e0\'"'
            + ' onclick="window.selectAttachment(\'' + f.filename + '\', \'' + method + '\')">'
            + '<span style="font-size: 26px;">' + f.icon + '</span>'
            + '<div style="min-width: 0;">'
            + '<div style="font-weight: 600; font-size: 14px; color: #1a1a2e;">' + f.filename + '</div>'
            + '<div style="font-size: 12px; color: #888;">' + f.desc + '</div>'
            + '</div>'
            + driveBadge
            + '</div>';
    }).join('');
}

function _openExplorer(mode) {
    const isLocal = mode === 'local';
    const title = isLocal ? '📂 Explorador de Archivos' : '☁️ TechNova Drive';
    const accentColor = isLocal ? '#0078d4' : '#4CAF50';
    const locationText = isLocal ? 'Este equipo > Documentos' : 'TechNova Drive / Mis Archivos';
    const locationBg = isLocal ? '#f0f7ff' : '#e8f5e9';

    const html = '<div style="padding: 24px; background: white; border: 1px solid #ccc; border-radius: 12px; max-width: 560px; width: 90%; box-shadow: 0 12px 40px rgba(0,0,0,0.2);">'
        + '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid ' + accentColor + ';">'
        + '<h3 style="margin: 0; font-size: 17px; color: ' + accentColor + ';">' + title + '</h3>'
        + '<button onclick="window.closeFileExplorer()" style="background: transparent; border: none; font-size: 22px; cursor: pointer; padding: 0; width: 32px; height: 32px; color: #999; border-radius: 6px;">×</button>'
        + '</div>'
        + '<div style="background: ' + locationBg + '; padding: 8px 12px; margin-bottom: 14px; border-radius: 6px; font-size: 13px; color: #555; border-left: 3px solid ' + accentColor + ';">'
        + '<strong>📍 Ubicación:</strong> ' + locationText
        + '</div>'
        + '<div style="margin: 8px 0; max-height: 300px; overflow-y: auto;">'
        + _renderFileList(mode)
        + '</div>'
        + '<button onclick="window.closeFileExplorer()" style="margin-top: 14px; width: 100%; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-size: 14px; color: #555;">Cancelar</button>'
        + '</div>';

    const modal = document.createElement('div');
    modal.id = 'file-explorer-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    modal.innerHTML = html;
    document.body.appendChild(modal);
}

export function openLocalFileExplorer() {
    _openExplorer('local');
}

export function openDriveFileExplorer() {
    _openExplorer('drive');
}



export function selectAttachment(filename, method) {
    composedEmailAttachments.push({ filename, method });

    const attachmentsDiv = document.getElementById('compose-attachments');
    if (attachmentsDiv) {
        _renderAttachments(attachmentsDiv);
    }

    closeFileExplorer();
}

export function removeAttachment(index) {
    composedEmailAttachments.splice(index, 1);

    const attachmentsDiv = document.getElementById('compose-attachments');
    if (attachmentsDiv) {
        _renderAttachments(attachmentsDiv);
    }
}

function _renderAttachments(container) {
    if (composedEmailAttachments.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 14px; margin: 0;">No attachments</p>';
    } else {
        container.innerHTML = composedEmailAttachments.map((att, idx) => {
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
    }
}

export function closeFileExplorer() {
    const modal = document.getElementById('file-explorer-modal');
    if (modal) {
        modal.remove();
    }
}

// ── Email compose & send ──────────────────────────────────────────

export function sendComposedEmail() {
    const to = document.getElementById('compose-to')?.value.trim().toLowerCase();
    const subject = document.getElementById('compose-subject')?.value;

    if (!to || !subject) {
        alert('Por favor completa el destinatario y el asunto.');
        return;
    }

    // Check if a sensitive document is attached
    const sensitiveFiles = ['Plan_de_Introduccion.docx', 'Presupuesto_Interno_Q3.xlsx', 'Lista_Participantes_Excursion.docx'];
    const hasSensitiveDoc = composedEmailAttachments.some(att =>
        sensitiveFiles.includes(att.filename)
    );

    const usedSecureMethod = composedEmailAttachments.some(att =>
        sensitiveFiles.includes(att.filename) && att.method === 'drive'
    );

    if (hasSensitiveDoc) {
        // Core metric: did they use secure channel?
        metrics.scenario3.secure_data_transmission = usedSecureMethod ? 1 : 0;

        alert(`📨 Documento enviado a ${to}.`);

        // Save and transition to Scenario 4
        _saveS3Metrics();
        setTimeout(() => window.startScenario(4), 1000);

    } else {
        // Generic send (e.g. replying to Laura without the sensitive doc)
        alert(`Correo enviado a ${to}.`);
        composedEmailAttachments = [];
        document.getElementById('email-view').innerHTML = '<p>Selecciona un correo para leerlo.</p>';
    }
}

export function cancelCompose() {
    composedEmailAttachments = [];
    document.getElementById('email-view').innerHTML = '<p>Selecciona un correo para leerlo.</p>';
}

// ── Persist metrics helper ────────────────────────────────────────

async function _saveS3Metrics() {
    try {
        const sid = getSessionId();
        if (sid) {
            await saveMetrics(sid, {
                'scenario3.phishing_clicked':         metrics.scenario3.phishing_clicked,
                'scenario3.phishing_reported':        metrics.scenario3.phishing_reported,
                'scenario3.credential_compromise':    metrics.scenario3.credential_compromise,
                'scenario3.secure_data_transmission': metrics.scenario3.secure_data_transmission
            });
        }
    } catch (err) {
        console.warn('Failed saving scenario3 metrics:', err);
    }
}
