import { metrics, displayResults } from '../utils/metrics.js';
import { saveMetrics, completeSession } from '../services/api.js';
import { getSessionId } from '../utils/session.js';
import { checkEmailBreach } from '../services/breach-checker.js';

export async function finishSimulation(consented) {
    const consentEmailInput = document.getElementById('consent-email');
    const consentEmail = consented ? consentEmailInput?.value?.trim() : null;
    const loadingDiv = document.getElementById('breach-loading-scenario');
    const resultsDiv = document.getElementById('breach-results-scenario');
    const submitBtn = document.getElementById('consent-submit-btn');

    if (consented && consentEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(consentEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        submitBtn.disabled = true;
        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';

        try {
            const breachData = await checkEmailBreach(consentEmail);

            loadingDiv.style.display = 'none';
            displayBreachResults(breachData, resultsDiv);
            resultsDiv.style.display = 'block';

            metrics.consent = `Consented with email: ${consentEmail}`;
            metrics.breachCheckCompleted = true;
            metrics.breachesFound = breachData.breachCount || 0;
            metrics.dataTypesExposed = breachData.dataTypesExposed?.length || 0;
        } catch (error) {
            loadingDiv.style.display = 'none';
            resultsDiv.innerHTML = `
                <div style="padding: 20px; background: #fee; border: 2px solid #dc3545; border-radius: 8px;">
                    <h4 style="color: #d32f2f;">Error</h4>
                    <p>${error.message || 'Unable to check breach data. Please try again.'}</p>
                </div>
            `;
            resultsDiv.style.display = 'block';
            submitBtn.disabled = false;
            return;
        }
    } else if (consented) {
        metrics.consent = 'Consented but provided no email';
    } else {
        metrics.consent = 'Did not consent';
    }

    const sessionId = getSessionId();

    if (sessionId) {
        await saveMetrics(sessionId, metrics);
        await completeSession(sessionId, consentEmail);
        console.log('Metrics saved successfully');
    }

    setTimeout(() => {
        // Move to the questionnaire (scenario 8). Results will be rendered after questionnaire submission (scenario 9).
        window.startScenario(8);
    }, consented && consentEmail ? 3000 : 0);
}

function displayBreachResults(breachData, container) {
    if (!breachData || breachData.breachCount === 0) {
        container.innerHTML = `
            <div style="padding: 25px; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border: 2px solid #4caf50; border-radius: 8px; text-align: center;">
                <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 15px; background: white; color: #4caf50; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ✓
                </div>
                <h4 style="color: #2e7d32; margin: 15px 0;">Email Seguro</h4>
                <p style="color: #1b5e20;">✅ ¡Buenas noticias! Este email no aparece en ninguna brecha conocida.</p>
                <p style="margin-top: 15px; font-size: 0.9em; color: #2e7d32;"><strong>Consejo:</strong> Mantén tus contraseñas seguras y únicas para cada servicio.</p>
            </div>
        `;
    } else {
        const breachesList = breachData.breaches.map(breach => `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #ff9800;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="font-size: 1.1em; color: #2c3e50;">${breach.title}</strong>
                    <span style="font-size: 0.9em; color: #5f6368; background: white; padding: 4px 10px; border-radius: 12px;">
                        ${new Date(breach.breachDate).toLocaleDateString('es-ES')}
                    </span>
                </div>
                <p style="color: #5f6368; margin: 10px 0; line-height: 1.5; font-size: 0.95em;">${breach.description}</p>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 6px 0; font-size: 0.9em; color: #424242;"><strong>Datos comprometidos:</strong> ${breach.dataClasses.join(', ')}</p>
                    <p style="margin: 6px 0; font-size: 0.9em; color: #424242;"><strong>Cuentas afectadas:</strong> ${breach.pwnCount.toLocaleString()}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div style="padding: 25px; background: linear-gradient(135deg, #fff3e0, #ffe0b2); border: 2px solid #ff9800; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 15px; background: white; color: #ff9800; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ⚠
                    </div>
                    <h4 style="color: #e65100; margin: 15px 0;">Email Comprometido</h4>
                    <p style="color: #d84315;">⚠️ Este email ha sido encontrado en ${breachData.breachCount} brecha(s) de datos.</p>
                </div>

                <div style="display: flex; justify-content: space-around; background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="text-align: center;">
                        <span style="display: block; font-size: 2em; font-weight: bold; color: #ff9800;">${breachData.breachCount}</span>
                        <span style="display: block; font-size: 0.9em; color: #5f6368; margin-top: 5px;">Brechas</span>
                    </div>
                    <div style="text-align: center;">
                        <span style="display: block; font-size: 2em; font-weight: bold; color: #ff9800;">${breachData.dataTypesExposed?.length || 0}</span>
                        <span style="display: block; font-size: 0.9em; color: #5f6368; margin-top: 5px;">Tipos de Datos</span>
                    </div>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h5 style="color: #d32f2f; margin-top: 0; font-size: 1.2em;">Recomendaciones Urgentes:</h5>
                    <ul style="margin: 15px 0; padding-left: 25px;">
                        <li style="margin: 10px 0; line-height: 1.6; color: #2c3e50;">Cambia inmediatamente las contraseñas de todas las cuentas que usen este email</li>
                        <li style="margin: 10px 0; line-height: 1.6; color: #2c3e50;">Activa la autenticación de dos factores (2FA) donde sea posible</li>
                        <li style="margin: 10px 0; line-height: 1.6; color: #2c3e50;">Revisa tu actividad reciente en todas las cuentas</li>
                        <li style="margin: 10px 0; line-height: 1.6; color: #2c3e50;">Considera usar un gestor de contraseñas</li>
                    </ul>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h5 style="color: #2c3e50; margin-top: 0; font-size: 1.2em;">Detalles de las Brechas:</h5>
                    ${breachesList}
                </div>

                <p style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #5f6368;">
                    Los resultados continuarán mostrándose en la siguiente pantalla...
                </p>
            </div>
        `;
    }
    window.startScenario(8);
}
