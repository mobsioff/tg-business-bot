import { env } from '../../config/env.js';
import { fullName } from '../../lib/format.js';
import { readBusinessMessage } from '../../telegram/api.js';
import { archiveBusinessMessage } from '../../services/archive.service.js';
import { touchBusinessChat } from '../../services/connection.service.js';
export async function handleBusinessMessage(message) {
    if (!message.business_connection_id)
        return;
    await touchBusinessChat(message.business_connection_id, message.chat);
    await archiveBusinessMessage(message);
    if (env.AUTO_MARK_AS_READ) {
        await readBusinessMessage(message.business_connection_id, message.chat.id, message.message_id);
    }
    if (message.text?.startsWith('/whoami')) {
        // Небольшой тест, чтобы владелец видел, что бот реально получает business updates.
        await readBusinessMessage(message.business_connection_id, message.chat.id, message.message_id).catch(() => null);
    }
    const _actor = fullName(message.from);
    void _actor;
}
