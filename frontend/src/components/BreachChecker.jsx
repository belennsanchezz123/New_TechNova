import { checkEmailBreach, formatBreachInfo } from '../services/breach-checker.js';
import { showPopup } from './popups.js';

export function createBreachChecker() {
    return `
        <div class="breach-checker-container">
            <div class="breach-checker-card">
                <h3>Verificador de Brechas de Seguridad</h3>
                <p class="breach-checker-description">
                    Verifica si tu correo electrónico ha sido expuesto en alguna brecha de datos conocida.
                </p>

                <div class="form-group">
                    <label for="breach-email-input">Correo Electrónico</label>
                    <input
                        type="email"
                        id="breach-email-input"
                        placeholder="ejemplo@correo.com"
                        autocomplete="off"
                    />
                </div>

                <button id="check-breach-btn" class="primary-btn">
                    Verificar Seguridad
                </button>

                <div id="breach-loading" class="breach-loading" style="display: none;">
                    <div class="spinner"></div>
                    <p>Consultando base de datos de brechas...</p>
                </div>

                <div id="breach-results" class="breach-results" style="display: none;">
                    <!-- Results will be inserted here -->
                </div>
            </div>
        </div>
    `;
}

export function initBreachChecker() {
    const checkBtn = document.getElementById('check-breach-btn');
    const emailInput = document.getElementById('breach-email-input');
    const loading = document.getElementById('breach-loading');
    const resultsDiv = document.getElementById('breach-results');

    if (!checkBtn || !emailInput) return;

    checkBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();

        if (!email) {
            showPopup('Error', 'Por favor ingresa un correo electrónico válido.');
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showPopup('Error', 'Por favor ingresa un correo electrónico válido.');
            return;
        }

        checkBtn.disabled = true;
        loading.style.display = 'block';
        resultsDiv.style.display = 'none';

        try {
            const breachData = await checkEmailBreach(email);
            const formattedInfo = formatBreachInfo(breachData);

            displayResults(formattedInfo, resultsDiv);
            resultsDiv.style.display = 'block';
        } catch (error) {
            showPopup('Error', error.message || 'Error al verificar el correo. Intenta nuevamente.');
        } finally {
            checkBtn.disabled = false;
            loading.style.display = 'none';
        }
    });

    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkBtn.click();
        }
    });
}

function displayResults(info, container) {
    if (info.status === 'safe') {
        container.innerHTML = `
            <div class="breach-result-safe">
                <div class="breach-icon">✓</div>
                <h4>Email Seguro</h4>
                <p>${info.message}</p>
                <div class="breach-tip">
                    <strong>Consejo:</strong> Mantén tus contraseñas seguras y únicas para cada servicio.
                </div>
            </div>
        `;
    } else {
        const breachesList = info.breaches.map(breach => `
            <div class="breach-item">
                <div class="breach-item-header">
                    <strong>${breach.name}</strong>
                    <span class="breach-date">${new Date(breach.date).toLocaleDateString('es-ES')}</span>
                </div>
                <p class="breach-description">${breach.description}</p>
                <div class="breach-details">
                    <p><strong>Datos comprometidos:</strong> ${breach.compromisedData.join(', ')}</p>
                    <p><strong>Cuentas afectadas:</strong> ${breach.affectedAccounts.toLocaleString()}</p>
                    ${breach.domain ? `<p><strong>Dominio:</strong> ${breach.domain}</p>` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="breach-result-compromised">
                <div class="breach-icon warning">⚠</div>
                <h4>Email Comprometido</h4>
                <p>${info.message}</p>

                <div class="breach-summary">
                    <div class="breach-stat">
                        <span class="stat-number">${info.breachCount}</span>
                        <span class="stat-label">Brechas</span>
                    </div>
                    ${info.pasteCount > 0 ? `
                        <div class="breach-stat">
                            <span class="stat-number">${info.pasteCount}</span>
                            <span class="stat-label">Pastes</span>
                        </div>
                    ` : ''}
                    <div class="breach-stat">
                        <span class="stat-number">${info.dataTypes.length}</span>
                        <span class="stat-label">Tipos de Datos</span>
                    </div>
                </div>

                <div class="breach-recommendations">
                    <h5>Recomendaciones Urgentes:</h5>
                    <ul>
                        <li>Cambia inmediatamente las contraseñas de todas las cuentas que usen este email</li>
                        <li>Activa la autenticación de dos factores (2FA) donde sea posible</li>
                        <li>Revisa tu actividad reciente en todas las cuentas</li>
                        <li>Considera usar un gestor de contraseñas</li>
                        <li>Monitorea tus cuentas bancarias y reportes de crédito</li>
                    </ul>
                </div>

                <div class="breaches-list">
                    <h5>Detalles de las Brechas:</h5>
                    ${breachesList}
                </div>
            </div>
        `;
    }
}
