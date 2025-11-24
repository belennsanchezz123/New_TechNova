//Funcion que devuelve la fortaleza de la contraseña

// Importa la librería que acabas de instalar
import zxcvbn from 'zxcvbn';

export function getPasswordStrength(password) {
    if (password.length === 0) return 'Empty';

    const result = zxcvbn(password);

    // zxcvbn devuelve un score de 0 (muy débil) a 4 (muy fuerte)
    switch (result.score) {
        case 0:
            return 'Very Weak';
        case 1:
            return 'Weak';
        case 2:
            return 'Moderate';
        case 3:
            return 'Strong';
        case 4:
            return 'Very Strong';
        default:
            return 'Weak';
    }
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