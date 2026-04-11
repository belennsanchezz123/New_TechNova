import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupSessionRoutes, setupAdminSessionRoutes } from './routes/sessions.js';
import { setupBreachRoutes } from './routes/breach.js';
import { setupQuestionnaireRoutes } from './routes/questionnaire.js';
import { setupAIRoutes } from './routes/ai.js';
import authRouter from './routes/auth.js';
import { requireAdmin } from './utils/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env desde backend/.env y tambien desde la raiz del proyecto.
dotenv.config({ path: join(__dirname, '.env'), override: true });
dotenv.config({ path: join(__dirname, '..', '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LYNX Backend is running with SQLite' });
});

// ── Rutas públicas (participantes) ─────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/sessions', setupSessionRoutes());
app.use('/api/breach', setupBreachRoutes());
app.use('/api/ai', setupAIRoutes());
app.use('/api/questionnaire', setupQuestionnaireRoutes());


// ── Rutas protegidas (admin — requieren JWT) ───────────────────────
app.use('/api/sessions', requireAdmin, setupAdminSessionRoutes());

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SQLite database: backend/lynx-study.db`);
});
