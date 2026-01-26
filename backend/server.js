import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSessionRoutes } from './routes/sessions.js';
import { setupBreachRoutes } from './routes/breach.js';
import { setupQuestionnaireRoutes } from './routes/questionnaire.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LYNX Backend is running with SQLite' });
});

app.use('/api/sessions', setupSessionRoutes());
app.use('/api/breach', setupBreachRoutes());
app.use('/api/questionnaire', setupQuestionnaireRoutes());

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SQLite database: backend/lynx-study.db`);
});
