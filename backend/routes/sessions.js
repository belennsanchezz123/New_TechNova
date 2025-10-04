import express from 'express';

const router = express.Router();

export function setupSessionRoutes(supabase) {
    router.post('/start', async (req, res) => {
        try {
            const { userIdentifier } = req.body;

            const { data, error } = await supabase
                .from('user_sessions')
                .insert({
                    user_identifier: userIdentifier || `user_${Date.now()}`,
                    started_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            res.json({ success: true, session: data });
        } catch (error) {
            console.error('Error starting session:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/complete', async (req, res) => {
        try {
            const { sessionId, consentEmail } = req.body;

            const { data, error } = await supabase
                .from('user_sessions')
                .update({
                    completed_at: new Date().toISOString(),
                    consent_email: consentEmail || null
                })
                .eq('id', sessionId)
                .select()
                .single();

            if (error) throw error;

            res.json({ success: true, session: data });
        } catch (error) {
            console.error('Error completing session:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

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

    router.get('/all', async (req, res) => {
        try {
            const { data: sessions, error: sessionsError } = await supabase
                .from('user_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (sessionsError) throw sessionsError;

            res.json({ success: true, sessions });
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/:sessionId/metrics', async (req, res) => {
        try {
            const { sessionId } = req.params;

            const { data: session, error: sessionError } = await supabase
                .from('user_sessions')
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
