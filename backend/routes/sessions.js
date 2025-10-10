import express from 'express';

const router = express.Router();

export function setupSessionRoutes(supabase) {
    /**
   * POST /api/sessions/start
   * Crea una "sesión" dentro de la tabla registrations.
   * - Mapea userIdentifier -> username
   * - Usa service="session" por defecto
   */
    router.post('/start', async (req, res) => {
        try {
            const { userIdentifier } = req.body;
            const username = String(userIdentifier ?? '').trim();
            const service = 'lynx_mail'; // campo requerido NOT NULL
            if (!username) {
                return res.status(400).json({ success: false, error: 'username requerido' });
            }
            
            // ¿ya existe?
            const { data: existing } = await supabase
                .from('registrations')
                .select('id, username, service, password_strength, mfa_enabled, created_at')
                .eq('username', username)
                .eq('service', service)
                .maybeSingle();
            
            if (selErr) throw selErr;

            if (existing) {
                return res.json({ success: true, session: existing, created: false });
            }

            // crear usuario nuevo
            const { data, error } = await supabase
                .from('registrations')
                .insert({
                    username,
                    service,
                    password_strength: null,
                    mfa_enabled: false        // por defecto
                })
                .select()
                .single();

            if (error) throw error;

            res.json({ success: true, session: data });
        } catch (error) {
            console.error('Error starting session:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });
    /**
   * POST /api/sessions/complete
   * Actualiza una fila existente en registrations (por id).
   * Puedes usarlo para marcar cosas del mail:
   * - consentEmail -> lo guardo en password_strength como tag de texto simple (no hay columna específica).
   * - También dejo posibilidad de actualizar mfa_enabled.
   */

    router.post('/complete', async (req, res) => {
        try {
            const { sessionId, consentEmail, mfaEnabled } = req.body;

            const updates = {};
            if (typeof mfaEnabled === 'boolean') updates.mfa_enabled = mfaEnabled;
            if (consentEmail) {
                // No existe columna consent_email: lo guardamos como texto informativo
                updates.password_strength = `consent:${consentEmail}`;
            }

            const { data, error } = await supabase
                .from('registrations')
                .update(updates)
                .eq('id', sessionId)
                .select()
                .single();

            if (error) throw error;

            res.json({ success: true, session: data });
        }   catch (error) {
            console.error('Error completing session:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    
    /**
    router.post('/metrics', async (req, res) => {
        try {
            const { sessionId, metrics } = req.body;

            const metricsToInsert = [];
            for (const scenario in metrics) {
                if (scenario === 'consent') continue;
                for (const metricName in metrics[scenario]) {
                    metricsToInsert.push({
                        session_id: sessionId,
                        scenario: scenario,
                        metric_name: metricName,
                        metric_value: String(metrics[scenario][metricName])
                    });
                }
            }

            const { data, error } = await supabase
                .from('session_metrics')
                .insert(metricsToInsert)
                .select();

            if (error) throw error;

            res.json({ success: true, count: data.length });
        } catch (error) {
            console.error('Error saving metrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
**/
    /**
    * GET /api/sessions/all
    * Devuelve todas las filas de 'registrations'
    */
    router.get('/all', async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            res.json({ success: true, sessions: data });
        } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ success: false, error: error.message });
        }
    });
    return router;
}
/**
    router.get('/:sessionId/metrics', async (req, res) => {
        try {
            const { sessionId } = req.params;

            const { data: session, error: sessionError } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', sessionId)
                .single();

            if (sessionError) throw sessionError;

            const { data: metrics, error: metricsError } = await supabase
                .from('session_metrics')
                .select('*')
                .eq('session_id', sessionId)
                .order('scenario');

            if (metricsError) throw metricsError;

            res.json({ success: true, session, metrics });
        } catch (error) {
            console.error('Error fetching session metrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
}
 */