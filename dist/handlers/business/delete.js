import { recordBusinessMessageDeletion } from '../../services/archive.service.js';
import { touchBusinessChat } from '../../services/connection.service.js';
import { notifyDeleteEvent } from '../../services/notify.service.js';
export async function handleBusinessDelete(payload) {
    await touchBusinessChat(payload.business_connection_id, payload.chat);
    const chatTitle = payload.chat.title || [payload.chat.first_name, payload.chat.last_name].filter(Boolean).join(' ') || payload.chat.username || String(payload.chat.id);
    for (const messageId of payload.message_ids) {
        const archived = await recordBusinessMessageDeletion(payload.business_connection_id, String(payload.chat.id), messageId);
        await notifyDeleteEvent({
            connectionId: payload.business_connection_id,
            chatTitle,
            actorName: archived?.sender_name ?? 'Неизвестно',
            messageId,
            text: archived?.text_content,
            caption: archived?.caption_content,
            messageKind: archived?.message_kind ?? 'unknown'
        });
    }
}
