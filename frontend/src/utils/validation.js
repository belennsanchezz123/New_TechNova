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