import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../routes/auth.js';

/**
 * Middleware que verifica el token JWT en el header Authorization.
 * Formato esperado: Authorization: Bearer <token>
 * 
 * Si el token es válido, añade req.adminUser y continúa.
 * Si no, devuelve 401 Unauthorized.
 */
export function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            error: 'Acceso no autorizado. Se requiere autenticación.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'Permisos insuficientes' 
            });
        }

        req.adminUser = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                error: 'Sesión expirada. Inicia sesión de nuevo.' 
            });
        }
        return res.status(401).json({ 
            success: false, 
            error: 'Token inválido' 
        });
    }
}
