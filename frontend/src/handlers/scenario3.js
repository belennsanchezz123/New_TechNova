import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { emails, openEmail as _originalOpenEmail, openComposeEmail, renderEmails as _renderEmails } from '../utils/emails.js';

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
    _syncPhishingReasonsMetric();
}

let composedEmailAttachments = [];

// ── Phishing tracking (Sets para porcentajes) ─────────────────────
const _clickedPhishingIds = new Set();
const _reportedPhishingIds = new Set();
const _falsePositiveReportedIds = new Set();
const _phishingReportReasons = {
    mensaje2: '',
    mensaje6: '',
    mensaje7: '',
    mensaje8: ''
};

function _syncPhishingReasonsMetric() {
    metrics.scenario3.phishing_report_reasons = JSON.stringify(_phishingReportReasons);
}

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

function _promptMaskedPassword(message) {
    return new Promise(resolve => {
        const existing = document.getElementById('phishing-password-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'phishing-password-modal';
        overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 12000;';

        overlay.innerHTML = `
            <div style="background: #fff; width: 90%; max-width: 420px; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.25); padding: 18px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1a1a2e;">Lynx Security</h3>
                <p style="margin: 0 0 14px 0; color: #555; font-size: 14px; line-height: 1.4;">${message}</p>
                <input id="phishing-password-input" type="password" autocomplete="off" placeholder="Introduce tu contraseña" style="width: 100%; box-sizing: border-box; border: 1px solid #ccd3dd; border-radius: 8px; padding: 10px 12px; font-size: 14px; margin-bottom: 14px;" />
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button id="phishing-password-cancel" style="border: 1px solid #d5dbe5; background: #fff; color: #4a5568; border-radius: 8px; padding: 8px 12px; cursor: pointer;">Cancelar</button>
                    <button id="phishing-password-submit" style="border: none; background: #0078d4; color: #fff; border-radius: 8px; padding: 8px 12px; cursor: pointer;">Verificar</button>
                </div>
            </div>
        `;

        const cleanupAndResolve = (value) => {
            overlay.remove();
            resolve(value);
        };

        document.body.appendChild(overlay);

        const input = document.getElementById('phishing-password-input');
        const cancelBtn = document.getElementById('phishing-password-cancel');
        const submitBtn = document.getElementById('phishing-password-submit');

        if (input) {
            input.focus();
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') cleanupAndResolve(input.value || '');
                if (event.key === 'Escape') cleanupAndResolve(null);
            });
        }
        if (cancelBtn) cancelBtn.addEventListener('click', () => cleanupAndResolve(null));
        if (submitBtn) submitBtn.addEventListener('click', () => cleanupAndResolve(input ? (input.value || '') : ''));
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) cleanupAndResolve(null);
        });
    });
}

export async function handlePhishingClick(isCredPhish, emailId) {
    // Registrar este correo como clicado
    if (emailId) _clickedPhishingIds.add(emailId);
    _updatePhishingPercentages();

    if (isCredPhish) {
        const enteredCreds = await _promptMaskedPassword('Please re-enter your password to verify your identity.');
        if (enteredCreds) {
            metrics.scenario3.credential_exposure = 1;
        }
    }

    console.log(`🎣 Phishing clicked: ${_clickedPhishingIds.size}/${_getTotalPhishingCount()} (${metrics.scenario3.phishing_clicked})`);

    // Persist immediately
    _saveS3Metrics();
}

function _promptPhishingReason(emailId) {
    return new Promise(resolve => {
        const existing = document.getElementById('phishing-report-reason-modal');
        if (existing) existing.remove();

        const reasonKey = `mensaje${emailId}`;
        const previous = _phishingReportReasons[reasonKey] || '';

        const overlay = document.createElement('div');
        overlay.id = 'phishing-report-reason-modal';
        overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 12000;';

        overlay.innerHTML = `
            <div style="background: #fff; width: 92%; max-width: 520px; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.25); padding: 18px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1a1a2e;">Reportar correo sospechoso</h3>
                <p style="margin: 0 0 10px 0; color: #555; font-size: 14px; line-height: 1.4;">Explica brevemente por qué consideras que este correo es phishing.</p>
                <textarea id="phishing-reason-input" placeholder="Ej: el dominio no es oficial y pide credenciales con urgencia" style="width: 100%; min-height: 96px; box-sizing: border-box; border: 1px solid #ccd3dd; border-radius: 8px; padding: 10px 12px; font-size: 14px; resize: vertical;">${previous}</textarea>
                <div id="phishing-reason-error" style="display:none; color:#b42318; font-size:12px; margin-top:8px;">Este campo es obligatorio.</div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
                    <button id="phishing-reason-cancel" style="border: 1px solid #d5dbe5; background: #fff; color: #4a5568; border-radius: 8px; padding: 8px 12px; cursor: pointer;">Cancelar</button>
                    <button id="phishing-reason-submit" style="border: none; background: #c0392b; color: #fff; border-radius: 8px; padding: 8px 12px; cursor: pointer;">Reportar</button>
                </div>
            </div>
        `;

        const cleanupAndResolve = (value) => {
            overlay.remove();
            resolve(value);
        };

        document.body.appendChild(overlay);

        const input = document.getElementById('phishing-reason-input');
        const error = document.getElementById('phishing-reason-error');
        const cancelBtn = document.getElementById('phishing-reason-cancel');
        const submitBtn = document.getElementById('phishing-reason-submit');

        const submit = () => {
            const reason = (input?.value || '').trim();
            if (!reason) {
                if (error) error.style.display = 'block';
                input?.focus();
                return;
            }
            cleanupAndResolve(reason);
        };

        input?.focus();
        input?.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') submit();
            if (event.key === 'Escape') cleanupAndResolve(null);
        });
        input?.addEventListener('input', () => {
            if (error) error.style.display = 'none';
        });
        cancelBtn?.addEventListener('click', () => cleanupAndResolve(null));
        submitBtn?.addEventListener('click', submit);
    });
}

// ── Email reporting ───────────────────────────────────────────────

export async function reportEmail(id, type) {
    const email = emails.find(e => e.id === id);
    if (!email) return;

    const reason = await _promptPhishingReason(id);
    if (reason === null) return;

    const reasonKey = `mensaje${id}`;
    _phishingReportReasons[reasonKey] = reason;
    _syncPhishingReasonsMetric();

    if (type === 'phishing') {
        // Mark as reported in the UI regardless of whether it was actually phishing or a false positive
        email.reportedAsPhishing = true;

        if (email.type === 'phishing-creds' || email.type === 'phishing-spam') {
            _reportedPhishingIds.add(id);
            _updatePhishingPercentages();
        } else {
            _falsePositiveReportedIds.add(id);
            metrics.scenario3.phishing_false_positives = _falsePositiveReportedIds.size;
        }
    }
    // Note: reporting a legit email as phishing is a false positive but we don't penalize it

    console.log(`🚨 Phishing reported: ${_reportedPhishingIds.size}/${_getTotalPhishingCount()} (${metrics.scenario3.phishing_reported})`);

    await window.showCustomNotification('Reporte Enviado', 'El correo ha sido reportado a Lynx Security. Gracias por ayudar a mantener nuestra plataforma segura.');
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';
    // Refresh inbox list so the reported state remains visible.
    _renderEmails();

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
        const encFlag = f.encrypted ? 'true' : 'false';

        // Badge + encrypt button for unencrypted files; "Cifrado" badge for encrypted
        let actionArea = '';
        if (f.encrypted) {
            actionArea = '<span style="font-size: 11px; color: #2e7d32; margin-left: auto; flex-shrink: 0; background: #c8e6c9; padding: 2px 8px; border-radius: 10px;">✓ Cifrado</span>';
        } else {
            actionArea = `<button onclick="event.stopPropagation(); window._encryptFile('${f.filename}')"
                style="margin-left: auto; flex-shrink: 0; background: none; border: 1px solid #b0bec5; color: #546e7a; border-radius: 8px; padding: 4px 10px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s;"
                onmouseover="this.style.background='#e3f2fd'; this.style.borderColor='#1a73e8'; this.style.color='#1a73e8';"
                onmouseout="this.style.background='none'; this.style.borderColor='#b0bec5'; this.style.color='#546e7a';"
                title="Cifrar este archivo antes de adjuntarlo">
                <span style="font-size: 14px;">🔒</span> Cifrar
            </button>`;
        }

        return '<div style="padding: 12px 14px; ' + borderStyle + ' margin: 6px 0; cursor: pointer; border-radius: 8px; display: flex; align-items: center; gap: 12px; transition: all 0.15s;"'
            + ' onmouseover="this.style.background=\'' + hoverBg + '\'; this.style.borderColor=\'' + hoverBorder + '\'"'
            + ' onmouseout="this.style.background=\'' + defaultBg + '\'; this.style.borderColor=\'' + defaultBorder + '\'"'
            + ' onclick="window.selectAttachment(\'' + f.filename + '\', ' + encFlag + ')">'
            + '<span style="font-size: 26px;">' + f.icon + '</span>'
            + '<div style="min-width: 0;">'
            + '<div style="font-weight: 600; font-size: 14px; color: #1a1a2e;">' + f.filename + (f.encrypted ? '.enc' : '') + '</div>'
            + '<div style="font-size: 12px; color: #888;">' + f.desc + '</div>'
            + '</div>'
            + actionArea
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
    const title = '📂 Archivos — Este equipo';
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
        + '<div style="font-size: 11px; color: #888; margin-top: 10px; text-align: center; background: #f8f9fa; padding: 8px; border-radius: 6px;">📎 Haz clic en un archivo para adjuntarlo · 🔒 Usa el botón <strong>Cifrar</strong> para protegerlo antes de enviarlo</div>'
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
        window.showCustomNotification('Campos obligatorios', 'Por favor completa el destinatario y el asunto.', 'error');
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

        window.showCustomNotification('Mensaje Enviado', `📨 El documento ha sido enviado correctamente a ${to}.`);

        // Save and transition to Scenario 4
        _saveS3Metrics();
        setTimeout(() => window.startScenario(4), 1500);

    } else {
        // Generic send (e.g. replying to Laura without the sensitive doc)
        window.showCustomNotification('Mensaje Enviado', `El correo ha sido enviado a ${to}.`);
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
                'scenario3.phishing_false_positives': metrics.scenario3.phishing_false_positives,
                'scenario3.phishing_report_reasons':  metrics.scenario3.phishing_report_reasons,
                'scenario3.credential_exposure':      metrics.scenario3.credential_exposure,
                'scenario3.secure_data_transmission': metrics.scenario3.secure_data_transmission
            });
        }
    } catch (err) {
        console.warn('Failed saving scenario3 metrics:', err);
    }
}
