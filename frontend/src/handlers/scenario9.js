import { metrics } from '../utils/metrics.js';
import { getSessionId } from '../utils/session.js';
import { getParticipantId } from '../utils/participant.js';
import { saveQuestionnaire, completeSession } from '../services/api.js';

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