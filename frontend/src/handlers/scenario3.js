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

// ── Phishing tracking (Sets para porcentajes) ─────────────────────
const _clickedPhishingIds = new Set();
const _reportedPhishingIds = new Set();

/** Cuenta cuántos correos de phishing existen en la bandeja */
function _getTotalPhishingCount() {
    return emails.filter(e => e.type === 'phishing-creds' || e.type === 'phishing-spam').length;
}

/** Recalcula los porcentajes en el objeto metrics */
function _updatePhishingPercentages() {
    const total = _getTotalPhishingCount();
    if (total === 0) return;

    metrics.scenario3.phishing_clicked  = Math.round((_clickedPhishingIds.size  / total) * 10000) / 10000;
    metrics.scenario3.phishing_reported = Math.round((_reportedPhishingIds.size / total) * 10000) / 10000;
}

// ── Phishing handling ─────────────────────────────────────────────

export function handlePhishingClick(isCredPhish, emailId) {
    // Registrar este correo como clicado
    if (emailId) _clickedPhishingIds.add(emailId);
    _updatePhishingPercentages();

    if (isCredPhish) {
        const enteredCreds = prompt("Lynx Security: Please re-enter your password to verify your identity.");
        if (enteredCreds) {
            metrics.scenario3.credential_compromise = 1;
            alert("ERROR: Invalid password. Your account may be at risk.");
        }
    }

    console.log(`🎣 Phishing clicked: ${_clickedPhishingIds.size}/${_getTotalPhishingCount()} (${metrics.scenario3.phishing_clicked})`);

    // Persist immediately
    _saveS3Metrics();
}

// ── Email reporting ───────────────────────────────────────────────

export function reportEmail(id, type) {
    const email = emails.find(e => e.id === id);

    if (type === 'phishing' && (email.type === 'phishing-creds' || email.type === 'phishing-spam')) {
        _reportedPhishingIds.add(id);
        _updatePhishingPercentages();
    }
    // Note: reporting a legit email as phishing is a false positive but we don't penalize it

    console.log(`🚨 Phishing reported: ${_reportedPhishingIds.size}/${_getTotalPhishingCount()} (${metrics.scenario3.phishing_reported})`);

    alert(`This email has been reported to Lynx Security. Thank you for helping keep our platform safe.`);
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';

    _saveS3Metrics();
}

// ── File explorer ─────────────────────────────────────────────────

const _baseFiles = [
    { filename: 'Plan_de_Introduccion.docx', icon: '📄', desc: 'Documento de Word • 128 KB', encrypted: false },
    { filename: 'Lista_Participantes_Excursion.docx', icon: '📄', desc: 'Documento de Word • 45 KB', encrypted: false },
    { filename: 'Presupuesto_Interno_Q3.xlsx', icon: '📊', desc: 'Hoja de cálculo • 67 KB', encrypted: false },
    { filename: 'Mapa_Ruta_Senderismo.pdf', icon: '📑', desc: 'PDF Document • 1.2 MB', encrypted: false },
];

// Track which files have been encrypted (so we can add them to the list)
const _encryptedFiles = new Set();

function _getCurrentFiles() {
    const files = [..._baseFiles];
    // Add encrypted copies right after their originals
    for (let i = files.length - 1; i >= 0; i--) {
        if (_encryptedFiles.has(files[i].filename)) {
            files.splice(i + 1, 0, {
                filename: files[i].filename,
                icon: '🔒',
                desc: 'Cifrado • ' + files[i].desc,
                encrypted: true
            });
        }
    }
    return files;
}

function _renderFileList() {
    return _getCurrentFiles().map(f => {
        const borderStyle = f.encrypted
            ? 'border: 1px solid #4CAF50; background: #f1f8e9;'
            : 'border: 1px solid #e0e0e0; background: white;';
        const hoverBg = f.encrypted ? '#e8f5e9' : '#f5f7fa';
        const hoverBorder = f.encrypted ? '#388E3C' : '#b0bec5';
        const defaultBg = f.encrypted ? '#f1f8e9' : 'white';
        const defaultBorder = f.encrypted ? '#4CAF50' : '#e0e0e0';
        const encBadge = f.encrypted
            ? '<span style="font-size: 11px; color: #2e7d32; margin-left: auto; flex-shrink: 0; background: #c8e6c9; padding: 2px 8px; border-radius: 10px;">Cifrado</span>'
            : '';
        const encFlag = f.encrypted ? 'true' : 'false';
        const contextMenu = f.encrypted
            ? ''  // no context menu for already encrypted files
            : ' oncontextmenu="event.preventDefault(); window._showFileContextMenu(event, \'' + f.filename + '\'); return false;"';

        return '<div style="padding: 12px 14px; ' + borderStyle + ' margin: 6px 0; cursor: pointer; border-radius: 8px; display: flex; align-items: center; gap: 12px; transition: all 0.15s;"'
            + ' onmouseover="this.style.background=\'' + hoverBg + '\'; this.style.borderColor=\'' + hoverBorder + '\'"'
            + ' onmouseout="this.style.background=\'' + defaultBg + '\'; this.style.borderColor=\'' + defaultBorder + '\'"'
            + ' onclick="window.selectAttachment(\'' + f.filename + '\', ' + encFlag + ')"'
            + contextMenu + '>'
            + '<span style="font-size: 26px;">' + f.icon + '</span>'
            + '<div style="min-width: 0;">'
            + '<div style="font-weight: 600; font-size: 14px; color: #1a1a2e;">' + f.filename + (f.encrypted ? '.enc' : '') + '</div>'
            + '<div style="font-size: 12px; color: #888;">' + f.desc + '</div>'
            + '</div>'
            + encBadge
            + '</div>';
    }).join('');
}

function _refreshExplorerList() {
    const modal = document.getElementById('file-explorer-modal');
    if (!modal) return;
    const listContainer = modal.querySelector('[data-file-list]');
    if (listContainer) {
        listContainer.innerHTML = _renderFileList();
    }
}

function _openExplorer() {
    const title = '📂 Archivos';
    const accentColor = '#0078d4';
    const locationText = 'Este equipo > Documentos';
    const locationBg = '#f0f7ff';

    const html = '<div style="padding: 24px; background: white; border: 1px solid #ccc; border-radius: 12px; max-width: 560px; width: 90%; box-shadow: 0 12px 40px rgba(0,0,0,0.2);">'
        + '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid ' + accentColor + ';">'
        + '<h3 style="margin: 0; font-size: 17px; color: ' + accentColor + ';">' + title + '</h3>'
        + '<button onclick="window.closeFileExplorer()" style="background: transparent; border: none; font-size: 22px; cursor: pointer; padding: 0; width: 32px; height: 32px; color: #999; border-radius: 6px;">×</button>'
        + '</div>'
        + '<div style="background: ' + locationBg + '; padding: 8px 12px; margin-bottom: 14px; border-radius: 6px; font-size: 13px; color: #555; border-left: 3px solid ' + accentColor + ';">'
        + '<strong>📍 Ubicación:</strong> ' + locationText
        + '</div>'
        + '<div data-file-list style="margin: 8px 0; max-height: 300px; overflow-y: auto;">'
        + _renderFileList()
        + '</div>'
        + '<div style="font-size: 11px; color: #999; margin-top: 8px; text-align: center;">💡 Clic derecho sobre un archivo para ver más opciones</div>'
        + '<button onclick="window.closeFileExplorer()" style="margin-top: 10px; width: 100%; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-size: 14px; color: #555;">Cancelar</button>'
        + '</div>';

    const modal = document.createElement('div');
    modal.id = 'file-explorer-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    modal.innerHTML = html;
    document.body.appendChild(modal);
}

export function openFileExplorer() {
    _openExplorer();
}

// Keep old names as aliases so existing window bindings don't break
export function openLocalFileExplorer() {
    _openExplorer();
}
export function openDriveFileExplorer() {
    _openExplorer();
}

// ── Right-click context menu to encrypt ──────────────────────────

export function _showFileContextMenu(e, filename) {
    // Remove any existing menu
    const existing = document.getElementById('file-context-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'file-context-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        z-index: 20000;
        background: #fff;
        border: 1px solid #d0d0d0;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        padding: 4px 0;
        min-width: 200px;
        animation: menuFadeIn 0.15s ease;
    `;
    menu.innerHTML = `
        <div style="padding: 10px 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #1a73e8; transition: background 0.15s;"
             onmouseover="this.style.background='#e8f0fe'"
             onmouseout="this.style.background='transparent'"
             onclick="window._encryptFile('${filename}'); this.parentElement.remove();">
            <span style="font-size: 18px;">🔒</span>
            <div>
                <div style="font-weight: 600;">Cifrar archivo</div>
                <div style="font-size: 11px; color: #888; margin-top: 2px;">Crear copia cifrada del archivo</div>
            </div>
        </div>
    `;
    document.body.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', () => menu.remove(), { once: true });
    }, 10);
}

// ── Encrypt file (adds encrypted copy to the file list) ──────────

export function encryptFile(filename) {
    if (_encryptedFiles.has(filename)) return; // already encrypted
    _encryptedFiles.add(filename);
    _refreshExplorerList();
}

// ── Select attachment (click on a file in the explorer) ──────────

export function selectAttachment(filename, encrypted) {
    composedEmailAttachments.push({ filename, encrypted: !!encrypted });

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
        container.classList.add('empty');
        container.innerHTML = '';
    } else {
        container.classList.remove('empty');
        container.innerHTML = composedEmailAttachments.map((att, idx) => {
            const isEnc = att.encrypted;
            const icon  = isEnc ? '🔒' : '📎';
            const bg    = isEnc ? '#e8f5e9' : '#f1f3f4';
            const border = isEnc ? '#4CAF50' : '#dadce0';
            const textColor = isEnc ? '#1b5e20' : '#3c4043';

            return `<div style="padding: 4px 8px 4px 12px; background: ${bg}; border: 1px solid ${border}; border-radius: 16px; display: inline-flex; align-items: center; gap: 8px;">
                <span style="font-size: 14px;">${icon}</span>
                <span style="font-size: 13px; font-weight: 500; color: ${textColor};" title="${att.filename}">${att.filename}</span>
                <button onclick="window.removeAttachment(${idx})" style="background: transparent; border: none; cursor: pointer; font-size: 16px; color: #5f6368; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; padding: 0;">×</button>
            </div>`;
        }).join('');
    }
}

export function closeFileExplorer() {
    const modal = document.getElementById('file-explorer-modal');
    if (modal) modal.remove();
    // Also clean up any lingering context menu
    const ctx = document.getElementById('file-context-menu');
    if (ctx) ctx.remove();
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

    // Secure = the sensitive file was encrypted
    const usedEncryption = composedEmailAttachments.some(att =>
        sensitiveFiles.includes(att.filename) && att.encrypted === true
    );

    if (hasSensitiveDoc) {
        // Core metric: did they encrypt the file?
        metrics.scenario3.secure_data_transmission = usedEncryption ? 1 : 0;

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
