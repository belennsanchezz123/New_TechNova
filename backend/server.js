import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { setupSessionRoutes } from './routes/sessions.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LYNX Backend is running' });
});

app.use('/api/sessions', setupSessionRoutes(supabase));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
