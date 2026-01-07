import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

let aiGeneratedText = "";
let startTime = 0;
let userEdited = false;


export function useAI() {
    const bodyField = document.getElementById('ai-editor-body');
    
    // DISEÑO DEL TRUCO (Métrica C): Generamos un dato falso (200.000€ en vez de 20.000€)
    aiGeneratedText = `He revisado la plantilla Q4. Todo es correcto. Carlos Ruiz tiene un salario de 55.000€ y Lucía Márquez tiene un salario de 200.000€. Procede con el cierre.`;
    
    bodyField.value = aiGeneratedText;
    startTime = Date.now();
    userEdited = false;
    console.log("🤖 IA: Generando respuesta con alucinación salarial...");
}

export function handleAIInput() {
    userEdited = true;
}

export async function sendAIReport() {
    const sid = getSessionId();
    const currentBody = document.getElementById('ai-editor-body').value;
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // segundos

    // Métrica A: Shadow AI (Detectamos si pegó palabras del PDF original: "Cirugía cardíaca", "Diabetes", "IBAN")
    const sensitiveWords = ["cirugía", "cardíaca", "diabetes", "insulina", "baja prevista"];
    const shadowAI = sensitiveWords.some(word => currentBody.toLowerCase().includes(word));

    // Métrica C: Verificación de Alucinación
    // Si el texto sigue diciendo 200.000, es que no corrigió el error
    const hallucinationAccepted = currentBody.includes("200.000");

    const metricsIA = {
        'scenario9.shadow_ai_leak': shadowAI ? 'Critical' : 'None',
        'scenario9.blind_trust': (duration < 5 && !userEdited) ? 'Yes' : 'No',
        'scenario9.hallucination_detected': !hallucinationAccepted ? 'Yes' : 'No',
        'scenario9.reaction_time': duration.toFixed(2)
    };

    try {
        await saveMetrics(sid, metricsIA);
        alert("✅ Informe enviado a RRHH.");
        // Aquí podrías llamar a window.nextScenario() si hubiera un 10
    } catch (err) {
        console.error("Error al guardar métricas IA:", err);
    }
}