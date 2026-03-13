import type { BusinessConnection } from '../../telegram/types.js';
import { saveBusinessConnection } from '../../services/connection.service.js';
import { sendMessage } from '../../telegram/api.js';

export async function handleBusinessConnection(connection: BusinessConnection) {
  await saveBusinessConnection(connection);

  const rights = connection.rights ?? {};
  const rightsList = Object.entries(rights)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => `• ${key}`)
    .join('\n') || '• нет специальных прав';

  await sendMessage(
    connection.user_chat_id,
    `<b>Business connection ${connection.is_enabled ? 'подключён' : 'обновлён / отключён'}</b>

<b>ID:</b> <code>${connection.id}</code>
<b>Активен:</b> ${connection.is_enabled ? 'да' : 'нет'}
<b>can_reply:</b> ${connection.rights?.can_reply ? 'да' : 'нет'}

<b>Права:</b>
${rightsList}`
  );
}
