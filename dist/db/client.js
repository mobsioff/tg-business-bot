import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: env.SUPABASE_SCHEMA },
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    },
    global: {
        headers: {
            'x-application-name': 'telegram-business-antidelete-bot'
        }
    }
});
export async function healthcheckDb() {
    const { error } = await supabase.from('users').select('telegram_user_id', { count: 'exact', head: true });
    if (error)
        throw error;
}
