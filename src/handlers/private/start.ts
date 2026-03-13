import { ru } from '../../texts/ru.js';
import { getMe, sendMessage } from '../../telegram/api.js';
import type { TgMessage } from '../../telegram/types.js';
import { upsertUser } from '../../repositories/user.repo.js';
import { buildStatusMessage } from '../../services/settings.service.js';
import { getLatestConnectionByOwnerChatId } from '../../repositories/connection.repo.js';

export async function handlePrivateStart(message: TgMessage) {
  if (!message.from) return;
  await upsertUser(message.from);

  const me = await getMe();
  const payload = message.text?.split(' ').slice(1).join(' ').trim();
  await sendMessage(message.chat.id, ru.start(me.username));

  if (payload?.startsWith('bizChat')) {
    const ownerChatId = String(message.chat.id);
    const connection = await getLatestConnectionByOwnerChatId(ownerChatId);

    if (connection?.connection_id) {
      await sendMessage(message.chat.id, await buildStatusMessage(connection.connection_id));
    } else {
      await sendMessage(
        message.chat.id,
        'Я получил deep link из business-чата, но connection ещё не появился в базе. Обычно это происходит через пару секунд после фактического подключения в Telegram Business.'
      );
    }
  }
}
