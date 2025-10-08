import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { setupSessionRoutes } from './routes/sessions.js';

// Cargar .env que está en la misma carpeta
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar con Supabase (usa las variables del .env)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

// Ruta de prueba para ver si el .env funciona
app.get('/api/env-check', (req, res) => {
  res.json({
    port: process.env.PORT,
    supabase_url: process.env.SUPABASE_URL ? 'OK' : 'MISSING',
    supabase_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LYNX Backend is running' });
});

app.use('/api/sessions', setupSessionRoutes(supabase));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
