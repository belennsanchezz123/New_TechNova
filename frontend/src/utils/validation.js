export function getPasswordStrength(password) {
    if (password.length === 0) return 'Empty';
    if (password.length < 8) return 'Weak';
    if (/\d/.test(password) && /[a-zA-Z]/.test(password)) {
         if (/[!@#$%^&*]/.test(password) && password.length >= 12) return 'Very Strong';
        return 'Strong';
    }
    return 'Moderate';
}
