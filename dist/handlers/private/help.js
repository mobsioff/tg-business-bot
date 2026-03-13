import { ru } from '../../texts/ru.js';
import { sendMessage } from '../../telegram/api.js';
import { buildStatusMessage } from '../../services/settings.service.js';
import { getLatestConnectionByOwnerChatId } from '../../repositories/connection.repo.js';
export async function handlePrivateCommand(message) {
    const text = message.text?.trim() || '';
    if (text.startsWith('/help')) {
        await sendMessage(message.chat.id, ru.help);
        return;
    }
    if (text.startsWith('/privacy')) {
        await sendMessage(message.chat.id, ru.privacy);
        return;
    }
    if (text.startsWith('/status')) {
        const connection = await getLatestConnectionByOwnerChatId(String(message.chat.id));
        if (!connection) {
            await sendMessage(message.chat.id, 'Подключение ещё не найдено. Сначала добавь бота в Telegram Business → Chatbots.');
            return;
        }
        await sendMessage(message.chat.id, await buildStatusMessage(connection.connection_id));
    }
}
