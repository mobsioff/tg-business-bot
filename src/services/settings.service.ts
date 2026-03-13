import { listRecentMessagesByConnection } from '../repositories/message.repo.js';
import { getConnection } from './connection.service.js';

export async function buildStatusMessage(connectionId: string) {
  const connection = await getConnection(connectionId);
  if (!connection) {
    return 'У тебя пока нет активного Business Connection. Подключи бота через Telegram Business → Chatbots.';
  }

  const recent = await listRecentMessagesByConnection(connectionId, 5);
  const recentText =
    recent.length === 0
      ? 'Пока пусто.'
      : recent.map((item, index) => `${index + 1}. chat=${item.chat_id}, msg=${item.message_id}, text=${(item.text_content ?? '—').slice(0, 40)}`).join('\n');

  return `
<b>Статус подключения</b>

<b>Connection ID:</b> <code>${connection.connection_id}</code>
<b>Активно:</b> ${connection.is_enabled ? 'да' : 'нет'}
<b>Может отвечать от имени аккаунта:</b> ${connection.can_reply ? 'да' : 'нет'}

<b>Последние сообщения в архиве:</b>
${recentText}`;
}
