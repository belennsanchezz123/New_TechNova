import { getParticipantId } from '../utils/participant.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function submitQuestionnaire() {
    const errorMsg = document.getElementById('questionnaire-error');
    errorMsg.style.display = 'none';

    const participantId = getParticipantId();
    if (!participantId) {
        errorMsg.textContent = 'Error: No se encontró el ID de participante';
        errorMsg.style.display = 'block';
        return;
    }

    const questions = ['q1_1', 'q1_2', 'q2_1', 'q2_2', 'q3_1', 'q3_2', 'q4_1', 'q4_2', 'q5_1', 'q5_2'];
    const responses = {};
    let allAnswered = true;

    for (const question of questions) {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        if (!selected) {
            allAnswered = false;
            break;
        }
        responses[question] = selected.value;
    }

    if (!allAnswered) {
        errorMsg.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/questionnaire/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                participantId,
                ...responses
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Cuestionario enviado exitosamente. Gracias por tu participación.');
            showCompletionMessage();
        } else {
            errorMsg.textContent = `Error: ${result.error}`;
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error('Error submitting questionnaire:', error);
        errorMsg.textContent = 'Error al enviar el cuestionario. Por favor, intenta de nuevo.';
        errorMsg.style.display = 'block';
    }
}

function showCompletionMessage() {
    const scenario = document.getElementById('scenario-8');
    scenario.innerHTML = `
        <h2>Simulación Completada</h2>
        <p>Gracias por completar el cuestionario y participar en este estudio.</p>
        <p>Tus respuestas han sido registradas de forma segura y anónima.</p>
        <p><strong>El ID de tu participante es: ${getParticipantId()}</strong></p>
        <p>Puedes cerrar esta ventana.</p>
    `;
}
