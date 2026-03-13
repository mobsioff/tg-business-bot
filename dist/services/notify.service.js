import { cut, safeText } from '../lib/format.js';
import { sendMessage } from '../telegram/api.js';
import { getConnection } from './connection.service.js';
export async function notifyConnectionOwner(connectionId, html) {
    const connection = await getConnection(connectionId);
    if (!connection?.owner_chat_id)
        return;
    await sendMessage(connection.owner_chat_id, html);
}
export async function notifyDeleteEvent(params) {
    const content = params.text || params.caption || 'Бот не успел сохранить содержимое до удаления.';
    await notifyConnectionOwner(params.connectionId, `<b>Удалено сообщение</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Кто:</b> ${safeText(params.actorName)}
<b>Тип:</b> ${safeText(params.messageKind ?? 'unknown')}
<b>ID сообщения:</b> ${params.messageId}
<b>Содержимое:</b>
${cut(content)}`);
}
export async function notifyEditEvent(params) {
    await notifyConnectionOwner(params.connectionId, `<b>Сообщение изменено</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Кто:</b> ${safeText(params.actorName)}
<b>Тип:</b> ${safeText(params.messageKind)}

<b>Старый текст:</b>
${cut(params.beforeText || params.beforeCaption || '—')}

<b>Новый текст:</b>
${cut(params.afterText || params.afterCaption || '—')}`);
}
