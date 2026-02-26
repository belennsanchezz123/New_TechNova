// =============================================
// PASSWORD STRENGTH — Strategy Pattern
// =============================================
// Tres estrategias intercambiables para medir la
// fuerza de una contraseña. Cambiar en runtime con
// setPasswordStrategy('entropy') | 'nist' | 'zxcvbn'
// =============================================
import zxcvbn from 'zxcvbn';

// --- Lista de contraseñas comunes (subset para NIST) ---
const COMMON_PASSWORDS = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'michael', 'shadow', '123123', '654321', 'password1',
    'welcome', 'hello', 'charlie', 'donald', 'admin',
    'qwerty123', 'password123', '1234567890', '000000', 'contraseña'
];

// ========== STRATEGY: ZXCVBN ==========
function zxcvbnStrategy(password) {
    const result = zxcvbn(password);
    const labels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    return {
        label: labels[result.score] || 'Weak',
        score: result.score,       // 0-4
        details: {
            crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
            suggestions: result.feedback.suggestions
        }
    };
}

// ========== STRATEGY: ENTROPY ==========
function entropyStrategy(password) {
    // Pool de caracteres según el contenido
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    const entropy = password.length * Math.log2(pool || 1);

    let label, score;
    if (entropy < 28)       { label = 'Very Weak'; score = 0; }
    else if (entropy < 36)  { label = 'Weak';      score = 1; }
    else if (entropy < 60)  { label = 'Moderate';   score = 2; }
    else if (entropy < 80)  { label = 'Strong';     score = 3; }
    else                    { label = 'Very Strong'; score = 4; }

    return {
        label,
        score,
        details: { entropy: Math.round(entropy * 100) / 100, poolSize: pool }
    };
}

// ========== STRATEGY: NIST SP 800-63B ==========
function nistStrategy(password) {
    const issues = [];

    if (password.length < 8) issues.push('Mínimo 8 caracteres');
    if (password.length < 12) issues.push('Se recomiendan 12+ caracteres');
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) issues.push('Contraseña común/conocida');
    if (/^(.)\1+$/.test(password)) issues.push('Todos los caracteres son iguales');
    if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def)/.test(password.toLowerCase()))
        issues.push('Secuencia predecible');

    let score;
    if (password.length < 8 || COMMON_PASSWORDS.includes(password.toLowerCase())) score = 0;
    else if (password.length < 10 || issues.length > 1) score = 1;
    else if (password.length < 12) score = 2;
    else if (password.length < 16) score = 3;
    else score = 4;

    const labels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    return {
        label: labels[score],
        score,
        details: { issues, lengthOK: password.length >= 8 }
    };
}

// ========== REGISTRY & ACTIVE STRATEGY ==========
const passwordStrategies = {
    zxcvbn: zxcvbnStrategy,
    entropy: entropyStrategy,
    nist: nistStrategy
};

let activeStrategy = 'zxcvbn';

export function setPasswordStrategy(name) {
    if (!passwordStrategies[name]) {
        console.error(`Strategy "${name}" not found. Available: ${Object.keys(passwordStrategies).join(', ')}`);
        return;
    }
    activeStrategy = name;
    console.log(`🔐 Password strategy set to: ${name}`);
}

export function getAvailableStrategies() {
    return Object.keys(passwordStrategies);
}

export function getActiveStrategy() {
    return activeStrategy;
}

/** Devuelve solo el label (string) — compatible con el código existente */
export function getPasswordStrength(password) {
    if (password.length === 0) return 'Empty';
    const result = passwordStrategies[activeStrategy](password);
    return result.label;
}

/** Devuelve el objeto completo { label, score, details } */
export function getPasswordStrengthFull(password) {
    if (password.length === 0) return { label: 'Empty', score: -1, details: {} };
    return passwordStrategies[activeStrategy](password);
}

export function getLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Sustitución
                    Math.min(
                        matrix[i][j - 1] + 1, // Inserción
                        matrix[i - 1][j] + 1  // Borrado
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}