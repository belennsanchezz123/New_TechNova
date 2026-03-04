// =============================================
// PASSWORD SIMILARITY — Strategy Pattern
// =============================================
// Estrategias intercambiables para medir la
// similitud entre dos contraseñas (valor 0..1).
//
// Cambiar en runtime:
//   setSimilarityStrategy('levenshtein')
//   setSimilarityStrategy('jaccard')
//
// Añadir nuevas estrategias:
//   registerSimilarityStrategy('nombre', (a, b) => ...)
// =============================================

import { getLevenshteinDistance } from './validation.js';

// ========== STRATEGY: LEVENSHTEIN NORMALIZADA ==========
// Sim(a, b) = 1 − Lev(a, b) / max(|a|, |b|)
// Resultado ∈ [0, 1].  1 = idénticas, 0 = totalmente distintas.
function levenshteinSimilarity(a, b) {
    if (a.length === 0 && b.length === 0) return 1;
    const maxLen = Math.max(a.length, b.length);
    const dist = getLevenshteinDistance(a, b);
    return 1 - dist / maxLen;
}

// ========== STRATEGY: JACCARD (BIGRAMAS) ==========
// Calcula similitud basada en bigramas compartidos.
// Útil para detectar similitudes parciales incluso con reordenaciones.
function jaccardBigramSimilarity(a, b) {
    if (a.length < 2 && b.length < 2) return a === b ? 1 : 0;

    const bigrams = (s) => {
        const set = new Set();
        for (let i = 0; i < s.length - 1; i++) {
            set.add(s.substring(i, i + 2));
        }
        return set;
    };

    const setA = bigrams(a);
    const setB = bigrams(b);

    if (setA.size === 0 && setB.size === 0) return a === b ? 1 : 0;

    let intersection = 0;
    for (const bg of setA) {
        if (setB.has(bg)) intersection++;
    }

    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

// ========== REGISTRY & ACTIVE STRATEGY ==========
const similarityStrategies = {
    levenshtein: levenshteinSimilarity,
    jaccard: jaccardBigramSimilarity,
};

let activeStrategy = 'levenshtein';

/** Registrar una nueva estrategia de similitud */
export function registerSimilarityStrategy(name, fn) {
    if (typeof fn !== 'function') {
        console.error(`registerSimilarityStrategy: "fn" debe ser una función.`);
        return;
    }
    similarityStrategies[name] = fn;
    console.log(`📐 Similarity strategy registered: ${name}`);
}

/** Cambiar la estrategia activa */
export function setSimilarityStrategy(name) {
    if (!similarityStrategies[name]) {
        console.error(`Strategy "${name}" not found. Available: ${Object.keys(similarityStrategies).join(', ')}`);
        return;
    }
    activeStrategy = name;
    console.log(`📐 Similarity strategy set to: ${name}`);
}

export function getAvailableSimilarityStrategies() {
    return Object.keys(similarityStrategies);
}

export function getActiveSimilarityStrategy() {
    return activeStrategy;
}

/**
 * Calcula la similitud entre dos cadenas usando la estrategia activa.
 * @returns {number} Valor en [0, 1].  1 = idénticas, 0 = totalmente distintas.
 */
export function pairSimilarity(a, b) {
    return similarityStrategies[activeStrategy](a, b);
}

/**
 * Similitud Promedio por Pares (Average Pairwise Similarity).
 *
 * Dada una lista de cadenas [s₁, s₂, …, sₙ], calcula:
 *
 *   S_t = Σ Sim(sᵢ, sⱼ)  /  C(n, 2)
 *
 * Para n = 3:
 *   S_t = ( Sim(s₁,s₂) + Sim(s₂,s₃) + Sim(s₁,s₃) ) / 3
 *
 * @param {string[]} strings - Lista de contraseñas (mín. 2 elementos)
 * @returns {number} Valor en [0, 1].  1 = todas idénticas, 0 = sin relación.
 */
export function averagePairwiseSimilarity(strings) {
    if (!strings || strings.length < 2) return 0;

    let totalSim = 0;
    let pairCount = 0;

    for (let i = 0; i < strings.length; i++) {
        for (let j = i + 1; j < strings.length; j++) {
            totalSim += pairSimilarity(strings[i], strings[j]);
            pairCount++;
        }
    }

    const result = pairCount === 0 ? 0 : totalSim / pairCount;

    // Redondear a 4 decimales para evitar artefactos de punto flotante
    return Math.round(result * 10000) / 10000;
}
