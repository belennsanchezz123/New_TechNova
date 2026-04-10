import { metrics } from '../utils/metrics.js';
import { getSessionId } from '../utils/session.js';
import { getParticipantId } from '../utils/participant.js';
import { saveQuestionnaire, completeSession } from '../services/api.js';

const SCENARIO9_MIN_TIME_MS = 4 * 60 * 1000; // 4 minutos mínimos
let scenario9StartTime = null;
let scenario9TimerInterval = null;

export function initScenario9Timer() {
    scenario9StartTime = Date.now();

    // Limpiar intervalo previo si existiera
    if (scenario9TimerInterval) clearInterval(scenario9TimerInterval);

    scenario9TimerInterval = setInterval(() => {
        const elapsed = Date.now() - scenario9StartTime;
        const remaining = Math.max(0, SCENARIO9_MIN_TIME_MS - elapsed);

        const countdownEl = document.getElementById('questionnaire-countdown');
        const waitingEl = document.getElementById('questionnaire-timer-waiting');
        const readyEl = document.getElementById('questionnaire-timer-ready');
        const submitBtn = document.getElementById('questionnaire-submit-btn');

        if (!countdownEl) return; // El escenario ya no está en pantalla

        if (remaining > 0) {
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            countdownEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        } else {
            // Tiempo alcanzado
            clearInterval(scenario9TimerInterval);
            scenario9TimerInterval = null;
            if (waitingEl) waitingEl.style.display = 'none';
            if (readyEl) readyEl.style.display = 'block';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
            // Desbloquear también el botón Siguiente
            window._scenario9TimeReached = true;
        }
    }, 500);
}

export function isScenario9TimeReached() {
    if (!scenario9StartTime) return false;
    return (Date.now() - scenario9StartTime) >= SCENARIO9_MIN_TIME_MS;
}

// ESTA ES LA FUNCIÓN QUE MUESTRA LOS RESULTADOS EN EL ESCENARIO 9
function showResults() {
    const resultsBody = document.getElementById('results-body');
    if (!resultsBody) return;

    resultsBody.innerHTML = ''; // Limpiar tabla prueba

    const allMetrics = {
        ...metrics.scenario1,
        ...metrics.scenario2,
        ...metrics.scenario3,
        ...metrics.scenario4,
        ...metrics.scenario5,
        ...metrics.scenario6,
        ...metrics.unexpected,
        ...metrics.optional
    };

    for (const [key, value] of Object.entries(allMetrics)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Scenario Data</td> 
            <td class="metric-name">${key.replace(/_/g, ' ')}</td>
            <td>${value}</td>
        `;
        resultsBody.appendChild(row);
    }
}


// ESTA ES LA NUEVA FUNCIÓN PARA ENVIAR EL NUEVO CUESTIONARIO
export async function submitTaxonomy() {
    // 0. Comprobar que ha pasado el tiempo mínimo
    if (!isScenario9TimeReached()) {
        const errorEl = document.getElementById('questionnaire-error');
        if (errorEl) {
            errorEl.textContent = 'Por favor, tómate el tiempo necesario para leer y responder todas las preguntas.';
            errorEl.style.display = 'block';
        }
        return;
    }

    // 1. Apunta al ID del nuevo formulario
    const form = document.getElementById('taxonomy-questionnaire');
    const errorEl = document.getElementById('questionnaire-error');

    const formData = new FormData(form);
    const answers = {};
    let answeredCount = 0; // Usamos un contador

    // 2. Itera sobre todas las respuestas que encontró
    for (const [key, value] of formData.entries()) {
        answers[key] = value;
        answeredCount++; // Suma cada respuesta encontrada
    }

    // 3. Determina el total de preguntas dinámicamente (evita desajustes cuando editemos el formulario)
    const inputEls = form.querySelectorAll('input[name^="q_"]');
    const questionNames = new Set(Array.from(inputEls).map(i => i.name));
    const totalQuestions = questionNames.size;

    if (answeredCount < totalQuestions) {
        errorEl.textContent = `Por favor, responde a todas las ${totalQuestions} preguntas. (Faltan ${totalQuestions - answeredCount})`;
        errorEl.style.display = 'block';
        return; // Detiene el envío
    }

    errorEl.style.display = 'none';

    // 4. Si todo está bien, guarda los datos
    try {
        const participantId = getParticipantId();
        const sessionId = getSessionId();

        console.log('Submitting questionnaire', {
            participantId,
            sessionId,
            totalQuestions,
            answeredCount,
            answersPreview: Object.keys(answers).slice(0, 10)
        });

        await saveQuestionnaire({
            participantId: participantId,
            sessionId: sessionId,
            answers: answers // El objeto con q_0_0, q_0_1, etc.
        });

        alert('Cuestionario enviado. ¡Gracias por completar la simulación!');
        
        // Marcamos la sesión como completada en el backend
        if (sessionId) {
            await completeSession(sessionId);
        }

        // 5. Pasa a la pantalla de resultados (Escenario 9)
        window.startScenario(10);

        // 6. Rellena la tabla de resultados
        //setTimeout(showResults, 100); 

    } catch (err) {
        console.error('Error saving questionnaire:', err);
        alert('Error al guardar el cuestionario.');
    }
}