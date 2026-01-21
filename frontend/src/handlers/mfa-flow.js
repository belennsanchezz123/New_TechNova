import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { completeRegistration } from '../services/api.js';

// Estado del flujo MFA
const mfaState = {
    currentStep: 1,
    totalSteps: 5,
    startTime: null,
    primaryMethod: null,
    backupMethod: null,
    phoneNumber: '',
    email: '',
    authCode: '',
    hardwarePin: '',
    codesAccepted: false,
    sessionIdForCompletion: null
};

// Reiniciar el estado MFA
function resetMFAState() {
    mfaState.currentStep = 1;
    mfaState.startTime = Date.now();
    mfaState.primaryMethod = null;
    mfaState.backupMethod = null;
    mfaState.phoneNumber = '';
    mfaState.email = '';
    mfaState.authCode = '';
    mfaState.hardwarePin = '';
    mfaState.codesAccepted = false;
}

// Iniciar el flujo MFA
export function startMFAFlow(sessionId) {
    resetMFAState();
    mfaState.sessionIdForCompletion = sessionId;

    // Guardar métrica: MFA iniciado
    saveMetrics(getSessionId(), {
        'scenario1.mfa_started': 'Yes'
    }).catch(err => console.warn('Error saving mfa_started metric:', err));

    const popup = document.getElementById('popup-mfa');
    if (popup) {
        popup.classList.add('active');
        renderMFAStep(1);
    }
}

// Renderizar un paso específico del flujo MFA
export function renderMFAStep(step) {
    mfaState.currentStep = step;
    const container = document.getElementById('mfa-step-container');

    if (!container) return;

    let html = '';

    switch (step) {
        case 1:
            html = getMFAStep1HTML();
            break;
        case 2:
            html = getMFAStep2HTML();
            break;
        case 3:
            html = getMFAStep3HTML();
            break;
        case 4:
            html = getMFAStep4HTML();
            break;
        case 5:
            html = getMFAStep5HTML();
            break;
    }

    container.innerHTML = html;

    // Adjuntar event listener para el checkbox del paso 4
    if (step === 4) {
        setTimeout(() => {
            const checkbox = document.getElementById('mfa-codes-saved');
            const btn = document.getElementById('proceed-step5-btn');
            if (checkbox && btn) {
                checkbox.addEventListener('change', () => {
                    btn.disabled = !checkbox.checked;
                });
            }
        }, 100);
    }
}

// --- PASO 1: Selección de Método Principal ---
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
            
            <button class="mfa-method-card" onclick="window.selectPrimaryMethod('Hardware')">
                <div class="mfa-icon">🔑</div>
                <div class="mfa-method-title">Llave de Seguridad</div>
                <div class="mfa-method-desc">Token USB físico</div>
            </button>
        </div>
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.skipMFA()">Omitir por ahora</button>
        </div>
    `;
}

// --- PASO 2: Configuración del Método Elegido ---
function getMFAStep2HTML() {
    const method = mfaState.primaryMethod;
    let content = '';

    if (method === 'SMS') {
        content = `
            <h3>Configurar SMS</h3>
            <p>Introduce tu número de teléfono móvil:</p>
            
            <div class="mfa-form-group">
                <label>Código de País</label>
                <select id="mfa-country-code" class="mfa-input">
                    <option value="+34">🇪🇸 España (+34)</option>
                    <option value="+1">🇺🇸 Estados Unidos (+1)</option>
                    <option value="+44">🇬🇧 Reino Unido (+44)</option>
                    <option value="+33">🇫🇷 Francia (+33)</option>
                    <option value="+49">🇩🇪 Alemania (+49)</option>
                </select>
            </div>
            
            <div class="mfa-form-group">
                <label>Número de Teléfono</label>
                <input type="tel" id="mfa-phone" class="mfa-input" placeholder="600123456" maxlength="12">
            </div>
            
            <div class="mfa-form-group">
                <label>Código de Verificación (enviado a tu teléfono)</label>
                <input type="text" id="mfa-sms-code" class="mfa-input" placeholder="123456" maxlength="6">
                <small>Este código expira en 10 minutos</small>
            </div>
        `;
    } else if (method === 'Email') {
        content = `
            <h3>Configurar Email</h3>
            <p>Confirma o añade un email alternativo:</p>
            
            <div class="mfa-form-group">
                <label>Email Principal (tu cuenta actual)</label>
                <input type="email" class="mfa-input" value="usuario@technova.com" disabled>
            </div>
            
            <div class="mfa-form-group">
                <label>Email Alternativo (recomendado)</label>
                <input type="email" id="mfa-alt-email" class="mfa-input" placeholder="tu.email.personal@ejemplo.com">
            </div>
            
            <div class="mfa-form-group">
                <label>Código de Verificación (enviado por email)</label>
                <input type="text" id="mfa-email-code" class="mfa-input" placeholder="123456" maxlength="6">
                <small>Revisa tu bandeja de entrada y spam</small>
            </div>
        `;
    } else if (method === 'App') {
        content = `
            <h3>Configurar App de Autenticación</h3>
            <p>Escanea este código QR con tu app de autenticación:</p>
            
            <div class="mfa-qr-container">
                <div class="mfa-qr-code">
                    <div class="qr-pixel-art">
                        ████&nbsp;&nbsp;██&nbsp;&nbsp;██&nbsp;&nbsp;████<br>
                        ██&nbsp;&nbsp;████&nbsp;&nbsp;&nbsp;&nbsp;██&nbsp;&nbsp;██<br>
                        ██&nbsp;&nbsp;██&nbsp;&nbsp;████&nbsp;&nbsp;██&nbsp;&nbsp;██<br>
                        ████&nbsp;&nbsp;██&nbsp;&nbsp;██&nbsp;&nbsp;████
                    </div>
                </div>
                <small style="display:block; margin-top:10px;">Clave manual: JBSW Y3DP EHPK 3PXP</small>
            </div>
            
            <div class="mfa-form-group">
                <label>Introduce el código de 6 dígitos de la app</label>
                <input type="text" id="mfa-app-code" class="mfa-input" placeholder="123456" maxlength="6" style="text-align:center; font-size:20px; letter-spacing: 5px;">
            </div>
        `;
    } else if (method === 'Hardware') {
        content = `
            <h3>Configurar Llave de Seguridad</h3>
            <p>Inserta tu llave de seguridad USB en el ordenador:</p>
            
            <div class="mfa-hardware-animation">
                <div class="usb-icon">🔌</div>
                <p style="margin-top: 15px;">Esperando detección del dispositivo...</p>
                <div class="spinner" style="margin: 20px auto;"></div>
            </div>
            
            <div class="mfa-form-group" style="margin-top: 20px;">
                <label>PIN de la Llave de Seguridad</label>
                <input type="password" id="mfa-hardware-pin" class="mfa-input" placeholder="Introduce tu PIN" maxlength="8">
                <small>Normalmente tiene entre 4-8 dígitos</small>
            </div>
        `;
    }

    return `
        <div class="mfa-progress">Paso 2 de ${mfaState.totalSteps}</div>
        ${content}
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
            <button onclick="window.proceedToStep3()">Continuar →</button>
            <button class="secondary" onclick="window.skipMFA()">Omitir por ahora</button>
        </div>
    `;
}

// --- PASO 3: Método de Respaldo ---
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
            
            ${primaryMethod !== 'Hardware' ? `
                <button class="mfa-method-card" onclick="window.selectBackupMethod('Hardware')">
                    <div class="mfa-icon">🔑</div>
                    <div class="mfa-method-title">Llave de Seguridad</div>
                </button>
            ` : ''}
        </div>
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
            <button class="secondary" onclick="window.skipBackupMethod()">No configurar backup</button>
            <button class="secondary" onclick="window.skipMFA()">Omitir MFA</button>
        </div>
    `;
}

// --- PASO 4: Códigos de Recuperación ---
function getMFAStep4HTML() {
    // Generar códigos de recuperación simulados
    const recoveryCodes = Array.from({ length: 10 }, (_, i) => {
        const random1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const random2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${random1}-${random2}`;
    });

    return `
        <div class="mfa-progress">Paso 4 de ${mfaState.totalSteps}</div>
        <h3>Códigos de Recuperación</h3>
        <p>Guarda estos códigos en un lugar seguro. Podrás usarlos si pierdes acceso a tus métodos de autenticación:</p>
        
        <div class="mfa-recovery-codes">
            ${recoveryCodes.map((code, idx) =>
        `<div class="recovery-code-item">${idx + 1}. ${code}</div>`
    ).join('')}
        </div>
        
        <div class="mfa-warning">
            ⚠️ <strong>Importante:</strong> Cada código solo se puede usar una vez. Descárgalos o escríbelos ahora.
        </div>
        
        <div class="mfa-form-group" style="margin-top: 20px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="mfa-codes-saved" style="margin-right: 10px; width: 20px; height: 20px;">
                <span>He guardado mis códigos de recuperación de forma segura</span>
            </label>
        </div>
        
        <div class="mfa-actions">
            <button class="secondary" onclick="window.goBackMFA()">← Atrás</button>
            <button onclick="window.proceedToStep5()" id="proceed-step5-btn" disabled>Continuar →</button>
            <button class="secondary" onclick="window.skipMFA()">Omitir por ahora</button>
        </div>
    `;
}

// --- PASO 5: Confirmación Final ---
function getMFAStep5HTML() {
    return `
        <div class="mfa-progress">Paso 5 de ${mfaState.totalSteps}</div>
        <h3>🎉 ¡Confirmación Final!</h3>
        <p>Revisa tu configuración de MFA antes de activarla:</p>
        
        <div class="mfa-summary">
            <div class="summary-item">
                <strong>Método Principal:</strong> ${mfaState.primaryMethod || 'No configurado'}
            </div>
            ${mfaState.backupMethod ? `
                <div class="summary-item">
                    <strong>Método de Respaldo:</strong> ${mfaState.backupMethod}
                </div>
            ` : ''}
            <div class="summary-item">
                <strong>Códigos de Recuperación:</strong> Guardados ✓
            </div>
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
            <button class="secondary" onclick="window.skipMFA()">Cancelar</button>
        </div>
    `;
}

// --- FUNCIONES DE NAVEGACIÓN ---

export function selectPrimaryMethod(method) {
    mfaState.primaryMethod = method;
    renderMFAStep(2);
}

export function selectBackupMethod(method) {
    mfaState.backupMethod = method;
    renderMFAStep(4);
}

export function skipBackupMethod() {
    mfaState.backupMethod = 'None';
    renderMFAStep(4);
}

export function proceedToStep3() {
    // Validar inputs del paso 2 según el método elegido
    const method = mfaState.primaryMethod;

    if (method === 'SMS') {
        const phone = document.getElementById('mfa-phone')?.value;
        const code = document.getElementById('mfa-sms-code')?.value;
        if (!phone || !code || code.length !== 6) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }
        mfaState.phoneNumber = phone;
    } else if (method === 'Email') {
        const code = document.getElementById('mfa-email-code')?.value;
        if (!code || code.length !== 6) {
            alert('Por favor, introduce el código de verificación.');
            return;
        }
        mfaState.email = document.getElementById('mfa-alt-email')?.value || '';
    } else if (method === 'App') {
        const code = document.getElementById('mfa-app-code')?.value;
        if (!code || code.length !== 6) {
            alert('Por favor, introduce el código de 6 dígitos de la app.');
            return;
        }
        mfaState.authCode = code;
    } else if (method === 'Hardware') {
        const pin = document.getElementById('mfa-hardware-pin')?.value;
        if (!pin || pin.length < 4) {
            alert('Por favor, introduce un PIN válido.');
            return;
        }
        mfaState.hardwarePin = pin;
    }

    renderMFAStep(3);
}

export function proceedToStep5() {
    const checkbox = document.getElementById('mfa-codes-saved');
    if (!checkbox?.checked) {
        alert('Debes confirmar que has guardado tus códigos de recuperación.');
        return;
    }

    mfaState.codesAccepted = true;
    renderMFAStep(5);
}

export function goBackMFA() {
    if (mfaState.currentStep > 1) {
        renderMFAStep(mfaState.currentStep - 1);
    }
}

export async function completeMFA() {
    const timeSpent = Math.floor((Date.now() - mfaState.startTime) / 1000);
    const sid = getSessionId();

    // Guardar métricas finales
    try {
        await saveMetrics(sid, {
            'scenario1.mfa_completed': 'Yes',
            'scenario1.mfa_step_reached': 5,
            'scenario1.mfa_method_primary': mfaState.primaryMethod,
            'scenario1.mfa_method_backup': mfaState.backupMethod || 'None',
            'scenario1.mfa_abandon_reason': 'Completed',
            'scenario1.mfa_time_spent': timeSpent,
            'scenario1.mfa_usage': 'Yes'
        });

        // Completar el registro con MFA habilitado
        if (mfaState.sessionIdForCompletion) {
            await completeRegistration(mfaState.sessionIdForCompletion, { mfaEnabled: true });
        }

        console.log('✅ MFA completado - Métricas guardadas');
    } catch (err) {
        console.warn('Error al guardar métricas MFA:', err);
    }

    // Cerrar popup y continuar
    closeMFAPopup();

    const eventsForm = document.getElementById('technova-events-form');
    if (eventsForm) eventsForm.style.display = 'block';
}

export async function skipMFA() {
    const timeSpent = mfaState.startTime ? Math.floor((Date.now() - mfaState.startTime) / 1000) : 0;
    const sid = getSessionId();

    // Guardar métricas de abandono
    try {
        await saveMetrics(sid, {
            'scenario1.mfa_completed': 'No',
            'scenario1.mfa_step_reached': mfaState.currentStep,
            'scenario1.mfa_method_primary': mfaState.primaryMethod || 'None',
            'scenario1.mfa_method_backup': 'None',
            'scenario1.mfa_abandon_reason': 'Skipped',
            'scenario1.mfa_time_spent': timeSpent,
            'scenario1.mfa_usage': 'No'
        });

        console.log(`⚠️ MFA omitido en paso ${mfaState.currentStep}`);
    } catch (err) {
        console.warn('Error al guardar métricas de abandono:', err);
    }

    closeMFAPopup();

    const eventsForm = document.getElementById('technova-events-form');
    if (eventsForm) eventsForm.style.display = 'block';
}

function closeMFAPopup() {
    const popup = document.getElementById('popup-mfa');
    if (popup) popup.classList.remove('active');
}

// Habilitar el botón de continuar cuando se marque el checkbox de códigos
export function enableProceedStep5() {
    const checkbox = document.getElementById('mfa-codes-saved');
    const btn = document.getElementById('proceed-step5-btn');

    if (checkbox && btn) {
        checkbox.addEventListener('change', () => {
            btn.disabled = !checkbox.checked;
        });
    }
}
