import { env } from '../../config/env.js';
import { fullName } from '../../lib/format.js';
import { getConnection, touchBusinessChat } from '../../services/connection.service.js';
import { archiveBusinessMessage } from '../../services/archive.service.js';
import { notifyRecoveredMedia, notifyConnectionOwner } from '../../services/notify.service.js';
import { findFirstMessageMedia } from '../../repositories/message.repo.js';
import type { TgMessage } from '../../telegram/types.js';
import { readBusinessMessage } from '../../telegram/api.js';

function buildChatTitle(message: TgMessage) {
  return (
    message.chat.title ||
    [message.chat.first_name, message.chat.last_name].filter(Boolean).join(' ') ||
    message.chat.username ||
    String(message.chat.id)
  );
}

function hasRecoverTriggerText(message: TgMessage) {
  return Boolean(message.text?.trim() || message.caption?.trim());
}

export async function handleBusinessMessage(message: TgMessage) {
  if (!message.business_connection_id) return;

  await touchBusinessChat(message.business_connection_id, message.chat);
  await archiveBusinessMessage(message);

  if (env.AUTO_MARK_AS_READ) {
    await readBusinessMessage(message.business_connection_id, message.chat.id, message.message_id).catch(() => null);
  }

  if (message.text?.startsWith('/whoami')) {
    await readBusinessMessage(message.business_connection_id, message.chat.id, message.message_id).catch(() => null);
  }

  const connection = await getConnection(message.business_connection_id);
  const actorName = fullName(message.from);
  void actorName;

  const isOwnerReply =
    Boolean(connection?.owner_user_id) &&
    Boolean(message.from?.id) &&
    String(message.from?.id) === String(connection?.owner_user_id);

  if (
    isOwnerReply &&
    message.reply_to_message?.message_id &&
    hasRecoverTriggerText(message)
  ) {
    const repliedMessageId = message.reply_to_message.message_id;
    const media = await findFirstMessageMedia(
      message.business_connection_id,
      String(message.chat.id),
      repliedMessageId
    );

    if (media?.file_id) {
      await notifyRecoveredMedia({
        connectionId: message.business_connection_id,
        chatTitle: buildChatTitle(message),
        replyText: message.text?.trim() || message.caption?.trim() || '—',
        media
      });
      return;
    }

    await notifyConnectionOwner(
      message.business_connection_id,
      `<b>Медиа не найдено</b>

<b>Чат:</b> ${buildChatTitle(message)}
<b>Reply на сообщение ID:</b> ${repliedMessageId}

Бот не нашёл сохранённый photo/video/document/voice/audio для этого сообщения. Возможно, медиа не успело сохраниться.`
    );
  }
}