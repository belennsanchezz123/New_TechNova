import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ── Hashes SHA-256 de las credenciales del admin ─────────────────────
// Para cambiar las credenciales, genera nuevos hashes:
//   node -e "console.log(require('crypto').createHash('sha256').update('TU_VALOR').digest('hex'))"
const ADMIN_USER_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';   // sha256('admin')
const ADMIN_PASS_HASH = '76f3bb8617597bd7e7d0888bbd2d5e03dde5bc6dcc5d2ce24bb8215c4a6166ad';   // sha256('Lynx2026!')

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'lynx-study-jwt-secret-2026';

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * Returns: { success: true, token: string } | { success: false, error: string }
 */
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Se requieren usuario y contraseña' });
        }

        // Hashear las credenciales recibidas
        const userHash = crypto.createHash('sha256').update(username).digest('hex');
        const passHash = crypto.createHash('sha256').update(password).digest('hex');

        // Comparar contra los hashes almacenados
        if (userHash !== ADMIN_USER_HASH || passHash !== ADMIN_PASS_HASH) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        // Generar token JWT válido por 8 horas
        const token = jwt.sign(
            { role: 'admin', iat: Math.floor(Date.now() / 1000) },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        console.log('✅ Admin autenticado correctamente');
        res.json({ success: true, token });

    } catch (error) {
        console.error('Error en /auth/login:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});

export { JWT_SECRET };
export default router;
