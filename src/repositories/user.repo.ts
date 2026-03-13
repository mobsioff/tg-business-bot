import { supabase } from '../db/client.js';
import type { TgUser } from '../telegram/types.js';

export async function upsertUser(user: TgUser) {
  const payload = {
    telegram_user_id: String(user.id),
    username: user.username ?? null,
    first_name: user.first_name ?? null,
    last_name: user.last_name ?? null,
    language_code: user.language_code ?? null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('users').upsert(payload, { onConflict: 'telegram_user_id' });
  if (error) throw error;
}
