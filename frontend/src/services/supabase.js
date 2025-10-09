import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkUserExists(username, service) {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('id')
            .eq('username', username)
            .eq('service', service)
            .maybeSingle();

        if (error) {
            console.error('Error checking user:', error);
            return { success: false, error };
        }

        return { success: true, exists: !!data };
    } catch (err) {
        console.error('Exception checking user:', err);
        return { success: false, error: err };
    }
}

export async function saveRegistration(username, service, passwordStrength, mfaEnabled = false) {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .insert({
                username: username,
                service: service,
                password_strength: passwordStrength,
                mfa_enabled: mfaEnabled
            })
            .select();

        if (error) {
            console.error('Error saving registration:', error);
            return { success: false, error };
        }

        console.log('Registration saved:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Exception saving registration:', err);
        return { success: false, error: err };
    }
}

export async function getAllRegistrations() {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching registrations:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Exception fetching registrations:', err);
        return { success: false, error: err };
    }
}
