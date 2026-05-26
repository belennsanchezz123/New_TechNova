import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';


// =============================================
// MFA FLOW — Simulación completa
// =============================================
// Simula verificación MFA mediante:
// - SMS / Email: genera y muestra código de 6 dígitos via toast
// - App:        QR code real (api.qrserver.com) con código en texto plano
// =============================================

// --- ESTADO DEL FLUJO ---
const mfaState = {
    currentStep: 1,
    totalSteps: 4,
    startTime: null,
    primaryMethod: null,
    backupMethod: null,
    generatedCode: null,    // código generado para SMS/Email/App
    codesAccepted: false,
    sessionIdForCompletion: null,
    emailAlternative: 0     // 1 si el usuario puso un email alternativo, 0 si no
};

// --- UTILIDADES ---

/** Genera un código numérico de 6 dígitos */
function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Muestra una notificación toast flotante en la esquina superior derecha.
 * Se auto-cierra tras `duration` ms.
 */
function showSimulatedNotification(type, message) {
    const icons = { SMS: '📱', Email: '📧', Hardware: '🔑', App: '🔐', success: '✅' };
    const icon = icons[type] || '🔔';

    // Contenedor de toasts (crear si no existe)
    let container = document.getElementById('mfa-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mfa-toast-container';
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            display: flex; flex-direction: column; gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'mfa-toast-notification';
    toast.style.cssText = `
        pointer-events: auto;
        background: white; border: 1px solid #d0d0d0; border-left: 4px solid #0078d4;
        border-radius: 8px; padding: 14px 18px; min-width: 300px; max-width: 400px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        animation: mfaToastIn 0.3s ease-out;
        display: flex; align-items: flex-start; gap: 12px;
        font-family: 'Segoe UI', sans-serif;
    `;
    toast.innerHTML = `
        <span style="font-size: 24px; flex-shrink: 0;">${icon}</span>
        <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 13px; color: #333; margin-bottom: 4px;">
                Notificación TechNova
            </div>
            <div style="font-size: 13px; color: #555; line-height: 1.4;">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="
            background: none; border: none; font-size: 18px; color: #999;
            cursor: pointer; padding: 0; line-height: 1;
        ">×</button>
    `;
    container.appendChild(toast);
}

// Inyectar estilos de animación toast (una sola vez)
if (!document.getElementById('mfa-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'mfa-toast-styles';
    style.textContent = `
        @keyframes mfaToastIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes mfaToastOut {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(100%); opacity: 0; }
        }
        .mfa-simulate-btn {
            display: inline-flex; align-items: center; gap: 8px;
            background: linear-gradient(135deg, #0078d4, #005a9e);
            color: white; border: none; padding: 12px 24px;
            border-radius: 8px; font-size: 15px; font-weight: 600;
            cursor: pointer; transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(0, 120, 212, 0.3);
        }
        .mfa-simulate-btn:hover {
            background: linear-gradient(135deg, #005a9e, #003f75);
            box-shadow: 0 6px 16px rgba(0, 120, 212, 0.4);
            transform: translateY(-1px);
        }
        .mfa-simulate-btn:active {
            transform: translateY(0);
        }
        @keyframes mfaWaitPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// --- RESET ---
function resetMFAState() {
    mfaState.currentStep = 0;
    mfaState.startTime = Date.now();
    mfaState.primaryMethod = null;
    mfaState.backupMethod = null;
    mfaState.generatedCode = null;
    mfaState.codesAccepted = false;
    mfaState.emailAlternative = 0;
}

// --- INICIAR ---
export function startMFAFlow(sessionId) {
    resetMFAState();
    mfaState.sessionIdForCompletion = sessionId;

    const popup = document.getElementById('popup-mfa');
    if (popup) {
        popup.classList.add('active');
        renderMFAStep(0);
    }
}

// --- RENDERIZAR PASO ---
export function renderMFAStep(step) {
    mfaState.currentStep = step;
    const container = document.getElementById('mfa-step-container');
    if (!container) return;

    let html = '';
    switch (step) {
        case 0: html = getMFAStep0HTML(); break;
        case 1: html = getMFAStep1HTML(); break;
        case 2: html = getMFAStep2HTML(); break;
        case 3: html = getMFAStep3HTML(); break;
        case 5: html = getMFAStep5HTML(); break;
        case 6: html = getMFAStep6BackupConfigHTML(); break;
    }
    container.innerHTML = html;
}

export function proceedToStep1() {
    renderMFAStep(1);
}

// =============================================
// PASO 0: Inicio / Prompt
// =============================================
function getMFAStep0HTML() {
    return `
        <div style="text-align: center; padding: 30px 10px;">
            <p style="font-size: 1.3em; color: #1a1a2e; margin-bottom: 40px; line-height: 1.5; font-weight: 500;">
                ¿Quieres activar el MFA (Autenticación Multifactor) para tus cuentas en TechNova?fix: 
            </p>
            
            <div class="mfa-actions" style="justify-content: center; gap: 20px;">
                <button onclick="window.proceedToStep1()" style="width: 140px; padding: 12px; font-size: 1.1em; background-color: #0078d4;">Sí</button>
                <button class="secondary" onclick="window.skipMFA()" style="width: 140px; padding: 12px; font-size: 1.1em;">No</button>
            </div>
        </div>
    `;
}

// =============================================
// PASO 1: Selección de Método Principal
// =============================================
function getMFAStep1HTML() {
    return `
        <div class="mfa-progress">Paso 1 de ${mfaState.totalSteps}</div>
        <h3>Selecciona tu Método Principal de MFA</h3>
        <p>Elige cómo deseas recibir los códigos de verificación:</p>
        
        <div class="mfa-method-grid">
            <button class="mfa-method-card" onclick="window.selectPrimaryMethod('SMS')">
                <div class="mfa-icon">📱</div>
                <div class="mfa-method-title">SMS</div>
                <div class="mfa-method-desc">Código por mensaje de texto</div>
            </button>
            
            <button class="mfa-method-card" onclick="window.selectPrimaryMethod('Email')">
                <div class="mfa-icon">📧</div>
                <div class="mfa-method-title">Email</div>
                <div class="mfa-method-desc">Código por correo electrónico</div>
            </button>
            
            <button class="mfa-method-card" onclick="window.selectPrimaryMethod('App')">
                <div class="mfa-icon">🔐</div>
                <div class="mfa-method-title">App Autenticadora</div>
                <div class="mfa-method-desc">Google/Microsoft Authenticator</div>
            </button>
        </div>
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
        </div>
    `;
}

// =============================================
// PASO 2: Configuración del Método Elegido
// =============================================
function getMFAStep2HTML() {
    const method = mfaState.primaryMethod;

    // Generar código para SMS, Email y App
    mfaState.generatedCode = generateCode();

    // Obtener el username del mail del usuario para el email dinámico
    const mailUserInput = document.getElementById('mail-user');
    const userMailName = mailUserInput ? mailUserInput.value.trim() : 'usuario';

    let content = '';

    if (method === 'SMS') {
        // Toast inmediato con el código
        setTimeout(() => {
            showSimulatedNotification('SMS',
                `📲 <strong>SMS recibido</strong> de TechNova Security:<br>
                Tu código de verificación es: <strong style="font-size: 16px; letter-spacing: 2px;">${mfaState.generatedCode}</strong>`
            );
        }, 800);

        content = `
            <h3>Configurar SMS</h3>
            <p>Recibirás un SMS con el código de verificación en tu teléfono registrado en TechNova.</p>

            <div class="mfa-form-group">
                <label>Código de Verificación (revisa la notificación ↗)</label>
                <input type="text" id="mfa-sms-code" class="mfa-input" placeholder="______" maxlength="6"
                       style="text-align:center; font-size:20px; letter-spacing:5px;">
                <small>📱 Hemos enviado un SMS con tu código. Míralo en la notificación arriba a la derecha.</small>
            </div>
        `;

    } else if (method === 'Email') {
        setTimeout(() => {
            showSimulatedNotification('Email',
                `📨 <strong>Nuevo correo</strong> de security@technova.com:<br>
                Tu código de verificación es: <strong style="font-size: 16px; letter-spacing: 2px;">${mfaState.generatedCode}</strong>`
            );
        }, 800);

        content = `
            <h3>Configurar Email</h3>
            <p>Elige a qué dirección de correo deseas recibir los códigos de verificación:</p>
            
            <div class="mfa-form-group">
                <label>Email Principal (tu cuenta actual)</label>
                <input type="email" class="mfa-input" value="${userMailName}@technova.com" disabled>
            </div>
            
            <div class="mfa-form-group">
                <label>Email Alternativo (opcional)</label>
                <input type="email" id="mfa-alt-email" class="mfa-input" placeholder="tu.email.personal@ejemplo.com">
            </div>
            
            <div class="mfa-form-group">
                <label>Código de Verificación (revisa la notificación ↗)</label>
                <input type="text" id="mfa-email-code" class="mfa-input" placeholder="______" maxlength="6"
                       style="text-align:center; font-size:20px; letter-spacing:5px;">
                <small>📧 Hemos enviado un email con tu código. Míralo en la notificación arriba a la derecha.</small>
            </div>
        `;

    } else if (method === 'App') {
        content = `
            <h3>Configurar App de Autenticación</h3>
            <p>Escanea este código QR con la cámara de tu móvil para obtener el código:</p>
            
            <div id="mfa-qr-loading" style="text-align: center; padding: 20px;">
                <div class="mfa-spinner" style="display:inline-block; width:40px; height:40px; border:4px solid #f3f3f3; border-top:4px solid #0078d4; border-radius:50%; animation: spin 1s linear infinite;"></div>
                <p>Generando código QR...</p>
            </div>
            
            <div id="mfa-qr-wrapper" class="mfa-qr-container" style="text-align: center; display: none;">
                <img id="mfa-qr-image" src="" alt="Código QR" 
                     style="width: 200px; height: 200px; border: 4px solid #f0f0f0; border-radius: 8px; margin: 10px auto; display: block;">
                <small style="display:block; margin-top:10px; color:#666;">
                    Escanea este código con Google Authenticator o Authy.
                </small>
            </div>
            
            <div class="mfa-form-group" style="margin-top: 20px;">
                <label>Introduce el código de 6 dígitos</label>
                <input type="text" id="mfa-app-code" class="mfa-input" placeholder="______" maxlength="6"
                       style="text-align:center; font-size:20px; letter-spacing:5px;" disabled>
            </div>
            
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        `;

        // Fetch QR asynchronously after rendering the skeleton
        setTimeout(async () => {
            try {
                const sid = getSessionId();
                const response = await fetch('/api/sessions/mfa/setup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: sid })
                });
                const data = await response.json();
                
                if (data.success && data.qrUrl) {
                    document.getElementById('mfa-qr-loading').style.display = 'none';
                    document.getElementById('mfa-qr-image').src = data.qrUrl;
                    document.getElementById('mfa-qr-wrapper').style.display = 'block';
                    document.getElementById('mfa-app-code').disabled = false;
                    document.getElementById('mfa-app-code').focus();
                } else {
                    document.getElementById('mfa-qr-loading').innerHTML = '<p style="color:red;">Error al generar QR. Intenta de nuevo.</p>';
                }
            } catch (err) {
                console.error('Error fetching QR:', err);
                document.getElementById('mfa-qr-loading').innerHTML = '<p style="color:red;">Error de conexión. Intenta de nuevo.</p>';
            }
        }, 100);
    }

    const actions = `
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
            <button onclick="window.proceedToStep3()" id="mfa-proceed-btn">Continuar →</button>
        </div>
    `;

    return `
        <div class="mfa-progress">Paso 2 de ${mfaState.totalSteps}</div>
        ${content}
        ${actions}
    `;
}



// =============================================
// PASO 3: Método de Respaldo
// =============================================
function getMFAStep3HTML() {
    const primaryMethod = mfaState.primaryMethod;

    return `
        <div class="mfa-progress">Paso 3 de ${mfaState.totalSteps}</div>
        <h3>Método de Respaldo</h3>
        <p>Por seguridad, configura un segundo método de autenticación:</p>
        <p style="font-size: 0.9em; color: #666;">Tu método principal es: <strong>${primaryMethod}</strong></p>
        
        <div class="mfa-method-grid">
            ${primaryMethod !== 'SMS' ? `
                <button class="mfa-method-card" onclick="window.selectBackupMethod('SMS')">
                    <div class="mfa-icon">📱</div>
                    <div class="mfa-method-title">SMS</div>
                </button>
            ` : ''}
            
            ${primaryMethod !== 'Email' ? `
                <button class="mfa-method-card" onclick="window.selectBackupMethod('Email')">
                    <div class="mfa-icon">📧</div>
                    <div class="mfa-method-title">Email</div>
                </button>
            ` : ''}
            
            ${primaryMethod !== 'App' ? `
                <button class="mfa-method-card" onclick="window.selectBackupMethod('App')">
                    <div class="mfa-icon">🔐</div>
                    <div class="mfa-method-title">App Autenticadora</div>
                </button>
            ` : ''}

            <button class="mfa-method-card" onclick="window.skipBackupMethod()" style="border: 2px dashed #b0b0b0;">
                <div class="mfa-icon" style="filter: grayscale(1);">🚫</div>
                <div class="mfa-method-title" style="color: #666;">Ninguno</div>
                <div class="mfa-method-desc" style="color: #888;">No usar método de respaldo</div>
            </button>
        </div>
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
        </div>
    `;
}

// =============================================
// PASO 3b (interno: step 6): Configuración del Método de Respaldo
// =============================================
function getMFAStep6BackupConfigHTML() {
    const method = mfaState.backupMethod;

    // Generar código para SMS, Email y App
    mfaState.generatedCode = generateCode();

    // Obtener el username del mail del usuario para el email dinámico
    const mailUserInput = document.getElementById('mail-user');
    const userMailName = mailUserInput ? mailUserInput.value.trim() : 'usuario';

    let content = '';

    if (method === 'SMS') {
        setTimeout(() => {
            showSimulatedNotification('SMS',
                `📲 <strong>SMS recibido</strong> de TechNova Security:<br>
                Tu código de verificación es: <strong style="font-size: 16px; letter-spacing: 2px;">${mfaState.generatedCode}</strong>`
            );
        }, 800);

        content = `
            <h3>Configurar SMS (Respaldo)</h3>
            <p>Recibirás un SMS con el código de verificación en tu teléfono registrado en TechNova.</p>

            <div class="mfa-form-group">
                <label>Código de Verificación (revisa la notificación ↗)</label>
                <input type="text" id="mfa-sms-code" class="mfa-input" placeholder="______" maxlength="6"
                       style="text-align:center; font-size:20px; letter-spacing:5px;">
                <small>📱 Hemos enviado un SMS con tu código. Míralo en la notificación arriba a la derecha.</small>
            </div>
        `;

    } else if (method === 'Email') {
        setTimeout(() => {
            showSimulatedNotification('Email',
                `📨 <strong>Nuevo correo</strong> de security@technova.com:<br>
                Tu código de verificación es: <strong style="font-size: 16px; letter-spacing: 2px;">${mfaState.generatedCode}</strong>`
            );
        }, 800);

        content = `
            <h3>Configurar Email (Respaldo)</h3>
            <p>Elige a qué dirección de correo deseas recibir los códigos de verificación de respaldo:</p>
            
            <div class="mfa-form-group">
                <label>Email Principal (tu cuenta actual)</label>
                <input type="email" class="mfa-input" value="${userMailName}@technova.com" disabled>
            </div>
            
            <div class="mfa-form-group">
                <label>Email Alternativo (opcional)</label>
                <input type="email" id="mfa-alt-email" class="mfa-input" placeholder="tu.email.personal@ejemplo.com">
            </div>
            
            <div class="mfa-form-group">
                <label>Código de Verificación (revisa la notificación ↗)</label>
                <input type="text" id="mfa-email-code" class="mfa-input" placeholder="______" maxlength="6"
                       style="text-align:center; font-size:20px; letter-spacing:5px;">
                <small>📧 Hemos enviado un email con tu código. Míralo en la notificación arriba a la derecha.</small>
            </div>
        `;

    } else if (method === 'App') {
        content = `
            <h3>Configurar App de Autenticación (Respaldo)</h3>
            <p>Escanea este código QR con la cámara de tu móvil para obtener el código:</p>
            
            <div id="mfa-qr-loading-backup" style="text-align: center; padding: 20px;">
                <div class="mfa-spinner" style="display:inline-block; width:40px; height:40px; border:4px solid #f3f3f3; border-top:4px solid #0078d4; border-radius:50%; animation: spin 1s linear infinite;"></div>
                <p>Generando código QR...</p>
            </div>
            
            <div id="mfa-qr-wrapper-backup" class="mfa-qr-container" style="text-align: center; display: none;">
                <img id="mfa-qr-image-backup" src="" alt="Código QR" 
                     style="width: 200px; height: 200px; border: 4px solid #f0f0f0; border-radius: 8px; margin: 10px auto; display: block;">
                <small style="display:block; margin-top:10px; color:#666;">
                    Escanea este código con Google Authenticator o Authy.
                </small>
            </div>
            
            <div class="mfa-form-group" style="margin-top: 20px;">
                <label>Introduce el código de 6 dígitos</label>
                <input type="text" id="mfa-app-code" class="mfa-input" placeholder="______" maxlength="6"
                       style="text-align:center; font-size:20px; letter-spacing:5px;" disabled>
            </div>
        `;

        // Fetch QR asynchronously after rendering the skeleton
        setTimeout(async () => {
            try {
                const sid = getSessionId();
                const response = await fetch('/api/sessions/mfa/setup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: sid })
                });
                const data = await response.json();
                
                if (data.success && data.qrUrl) {
                    document.getElementById('mfa-qr-loading-backup').style.display = 'none';
                    document.getElementById('mfa-qr-image-backup').src = data.qrUrl;
                    document.getElementById('mfa-qr-wrapper-backup').style.display = 'block';
                    document.getElementById('mfa-app-code').disabled = false;
                    document.getElementById('mfa-app-code').focus();
                } else {
                    document.getElementById('mfa-qr-loading-backup').innerHTML = '<p style="color:red;">Error al generar QR. Intenta de nuevo.</p>';
                }
            } catch (err) {
                console.error('Error fetching QR:', err);
                document.getElementById('mfa-qr-loading-backup').innerHTML = '<p style="color:red;">Error de conexión. Intenta de nuevo.</p>';
            }
        }, 100);
    }

    const actions = `
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
            <button onclick="window.proceedFromBackupConfig()" id="mfa-proceed-btn-backup">Continuar →</button>
        </div>
    `;

    return `
        <div class="mfa-progress">Paso 3 de ${mfaState.totalSteps} — Configurar Respaldo</div>
        ${content}
        ${actions}
    `;
}




// =============================================

// =============================================
// PASO 5: Confirmación Final
// =============================================
function getMFAStep5HTML() {
    return `
        <div class="mfa-progress">Paso ${mfaState.totalSteps} de ${mfaState.totalSteps}</div>
        <h3>🎉 ¡Confirmación Final!</h3>
        <p>Revisa tu configuración de MFA antes de activarla:</p>
        
        <div class="mfa-summary">
            <div class="summary-item">
                <strong>Método Principal:</strong> ${mfaState.primaryMethod || 'No configurado'}
            </div>
            ${mfaState.backupMethod && mfaState.backupMethod !== 'None' ? `
                <div class="summary-item">
                    <strong>Método de Respaldo:</strong> ${mfaState.backupMethod}
                </div>
            ` : ''}
        </div>
        
        <div class="mfa-confirmation">
            <p style="font-size: 0.95em; color: #333; line-height: 1.6;">
                Al activar MFA, mejorarás significativamente la seguridad de tu cuenta. 
                Necesitarás tu método de autenticación cada vez que inicies sesión desde un nuevo dispositivo.
            </p>
        </div>
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
            <button onclick="window.completeMFA()" style="background-color: #2e7d32;">✓ Activar MFA Ahora</button>
        </div>
    `;
}

// =============================================
// FUNCIONES DE NAVEGACIÓN
// =============================================

export function selectPrimaryMethod(method) {
    mfaState.primaryMethod = method;
    renderMFAStep(2);
}

export function selectBackupMethod(method) {
    mfaState.backupMethod = method;
    renderMFAStep(6); // Ir a configurar el método de respaldo
}

export function skipBackupMethod() {
    mfaState.backupMethod = 'None';
    renderMFAStep(5);
}

function showMFAError(msg) {
    let errDiv = document.getElementById('mfa-inline-error');
    if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.id = 'mfa-inline-error';
        errDiv.style.color = '#c62828';
        errDiv.style.backgroundColor = '#ffcdd2';
        errDiv.style.padding = '10px';
        errDiv.style.borderRadius = '6px';
        errDiv.style.marginBottom = '15px';
        errDiv.style.textAlign = 'center';
        errDiv.style.fontWeight = '500';
        errDiv.style.fontSize = '0.9em';
        
        const actionsDiv = document.querySelector('.mfa-actions');
        if (actionsDiv && actionsDiv.parentNode) {
            actionsDiv.parentNode.insertBefore(errDiv, actionsDiv);
        } else {
            const container = document.getElementById('mfa-step-container');
            if (container) container.appendChild(errDiv);
        }
    }
    errDiv.innerHTML = msg;
    
    setTimeout(() => {
        if (errDiv.parentNode) errDiv.parentNode.removeChild(errDiv);
    }, 4500);
}

/** Valida el código introducido en un paso de configuración (síncrono para SMS/Email) */
function validateMethodCode(method) {
    if (method === 'SMS') {
        const code = document.getElementById('mfa-sms-code')?.value;
        if (code !== mfaState.generatedCode) {
            showMFAError('Código incorrecto. Revisa la notificación en la esquina superior derecha.');
            return false;
        }
    } else if (method === 'Email') {
        const code = document.getElementById('mfa-email-code')?.value;
        if (code !== mfaState.generatedCode) {
            showMFAError('Código incorrecto. Revisa la notificación en la esquina superior derecha.');
            return false;
        }
    }
    return true;
}

export async function proceedToStep3() {
    const btn = document.getElementById('mfa-proceed-btn');
    const method = mfaState.primaryMethod;

    if (method === 'App') {
        const code = document.getElementById('mfa-app-code')?.value;
        if (!code || code.length !== 6) {
            showMFAError('Introduce el código de 6 dígitos que aparece en tu App Authenticator.');
            return;
        }
        
        if (btn) { btn.disabled = true; btn.textContent = 'Verificando...'; }
        
        try {
            const sid = getSessionId();
            const response = await fetch('/api/sessions/mfa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sid, code })
            });
            const data = await response.json();
            
            if (btn) { btn.disabled = false; btn.textContent = 'Continuar →'; }
            
            if (!data.success || !data.verified) {
                showMFAError('Código incorrecto o expirado. Prueba de nuevo con el que aparece en tu App.');
                return;
            }
        } catch (err) {
            console.error('Error verifying TOTP:', err);
            if (btn) { btn.disabled = false; btn.textContent = 'Continuar →'; }
            showMFAError('Error al verificar el código. Intenta de nuevo.');
            return;
        }
    } else {
        if (!validateMethodCode(method)) return;
        
        // Track email alternative if primary method is Email
        if (method === 'Email') {
            const altEmail = document.getElementById('mfa-alt-email')?.value?.trim();
            mfaState.emailAlternative = altEmail ? 1 : 0;
        }
    }

    renderMFAStep(3);
}

/** Avanza desde la configuración del método de respaldo a los códigos de recuperación */
export async function proceedFromBackupConfig() {
    const btn = document.getElementById('mfa-proceed-btn-backup');
    const method = mfaState.backupMethod;

    if (method === 'App') {
        const code = document.getElementById('mfa-app-code')?.value;
        if (!code || code.length !== 6) {
            showMFAError('Introduce el código de 6 dígitos que aparece en tu App Authenticator.');
            return;
        }
        
        if (btn) { btn.disabled = true; btn.textContent = 'Verificando...'; }
        
        try {
            const sid = getSessionId();
            const response = await fetch('/api/sessions/mfa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sid, code })
            });
            const data = await response.json();
            
            if (btn) { btn.disabled = false; btn.textContent = 'Continuar →'; }
            
            if (!data.success || !data.verified) {
                showMFAError('Código incorrecto o expirado. Prueba de nuevo con el que aparece en tu App.');
                return;
            }
        } catch (err) {
            console.error('Error verifying TOTP:', err);
            if (btn) { btn.disabled = false; btn.textContent = 'Continuar →'; }
            showMFAError('Error al verificar el código. Intenta de nuevo.');
            return;
        }
    } else {
        if (!validateMethodCode(method)) return;
        
        // Track email alternative if backup method is Email
        if (method === 'Email') {
            const altEmail = document.getElementById('mfa-alt-email')?.value?.trim();
            mfaState.emailAlternative = altEmail ? 1 : 0;
        }
    }
    
    renderMFAStep(5);
}

export function proceedToStep5() {
    const checkbox = document.getElementById('mfa-codes-saved');
    if (!checkbox?.checked) {
        showMFAError('Debes confirmar que has guardado tus códigos de recuperación.');
        return;
    }
    mfaState.codesAccepted = true;
    renderMFAStep(5);
}

export function goBackMFA() {
    const step = mfaState.currentStep;
    if (step === 6) {
        // Desde configurar respaldo → volver a selección de respaldo
        renderMFAStep(3);
    } else if (step === 5) {
        // Desde confirmación → volver a config respaldo (o selección si se omitió)
        if (mfaState.backupMethod && mfaState.backupMethod !== 'None') {
            renderMFAStep(6);
        } else {
            renderMFAStep(3);
        }
    } else if (step > 0) {
        renderMFAStep(step - 1);
    }
}

// =============================================
// COMPLETAR / OMITIR MFA
// =============================================

export async function completeMFA() {
    const sid = getSessionId();

    try {
        await saveMetrics(sid, {
            'scenario1.mfa_usage': 1,
            'scenario1.mfa_method_primary': mfaState.primaryMethod,
            'scenario1.mfa_method_backup': mfaState.backupMethod || 'None',
            'scenario1.mfa_email_alternative': mfaState.emailAlternative
        });

        // --- Persistir en localStorage ---
        localStorage.setItem('mfa_config', JSON.stringify({
            active: true,
            method: mfaState.primaryMethod
        }));

        console.log('✅ MFA completado — config guardada en localStorage');
    } catch (err) {
        console.warn('Error al guardar métricas MFA:', err);
    }

    closeMFAPopup();
    showSimulatedNotification('success', '🎉 <strong>MFA Activado</strong><br>Tu cuenta está ahora protegida con autenticación multifactor.');

    // Llamamos a que termine el flujo general del escenario 1
    import('./scenario1.js').then(({ showRegistrationComplete }) => {
        showRegistrationComplete();
    });
}

export async function skipMFA() {
    const sid = getSessionId();

    try {
        await saveMetrics(sid, {
            'scenario1.mfa_usage': 0,
            'scenario1.mfa_method_primary': mfaState.primaryMethod || 'None',
            'scenario1.mfa_method_backup': 'None',
            'scenario1.mfa_email_alternative': 0
        });
        console.log(`⚠️ MFA omitido en paso ${mfaState.currentStep}`);
    } catch (err) {
        console.warn('Error al guardar métricas de abandono:', err);
    }

    closeMFAPopup();

    import('./scenario1.js').then(({ showRegistrationComplete }) => {
        showRegistrationComplete();
    });
}

function closeMFAPopup() {
    const popup = document.getElementById('popup-mfa');
    if (popup) popup.classList.remove('active');
}

// Función legacy (mantenida por compatibilidad)
export function enableProceedStep5() {
    const checkbox = document.getElementById('mfa-codes-saved');
    const btn = document.getElementById('proceed-step5-btn');
    if (checkbox && btn) {
        checkbox.addEventListener('change', () => {
            btn.disabled = !checkbox.checked;
        });
    }
}
