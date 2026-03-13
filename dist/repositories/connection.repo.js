import { supabase } from '../db/client.js';
export async function upsertBusinessConnection(connection) {
    const payload = {
        connection_id: connection.id,
        owner_user_id: String(connection.user.id),
        owner_chat_id: String(connection.user_chat_id),
        is_enabled: connection.is_enabled,
        can_reply: Boolean(connection.rights?.can_reply),
        rights_json: connection.rights ?? {},
        created_at_unix: connection.date,
        updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('business_connections').upsert(payload, { onConflict: 'connection_id' });
    if (error)
        throw error;
}
export async function getBusinessConnection(connectionId) {
    const { data, error } = await supabase
        .from('business_connections')
        .select('*')
        .eq('connection_id', connectionId)
        .maybeSingle();
    if (error)
        throw error;
    return data ?? null;
}
export async function getLatestConnectionByOwnerChatId(ownerChatId) {
    const { data, error } = await supabase
        .from('business_connections')
        .select('*')
        .eq('owner_chat_id', ownerChatId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error)
        throw error;
    return data ?? null;
}
export async function upsertBusinessChat(connectionId, chat) {
    const payload = {
        connection_id: connectionId,
        chat_id: String(chat.id),
        type: chat.type ?? null,
        title: chat.title ?? null,
        username: chat.username ?? null,
        first_name: chat.first_name ?? null,
        last_name: chat.last_name ?? null,
        updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('chats').upsert(payload, { onConflict: 'connection_id,chat_id' });
    if (error)
        throw error;
}
