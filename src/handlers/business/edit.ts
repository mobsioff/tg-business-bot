import { fullName } from '../../lib/format.js';
import type { TgMessage } from '../../telegram/types.js';
import { recordBusinessMessageEdit } from '../../services/archive.service.js';
import { notifyEditEvent } from '../../services/notify.service.js';
import { touchBusinessChat } from '../../services/connection.service.js';

export async function handleBusinessEdit(message: TgMessage) {
  if (!message.business_connection_id) return;
  await touchBusinessChat(message.business_connection_id, message.chat);

  const result = await recordBusinessMessageEdit(message);
  if (!result) return;

  const chatTitle = message.chat.title || [message.chat.first_name, message.chat.last_name].filter(Boolean).join(' ') || message.chat.username || String(message.chat.id);

  await notifyEditEvent({
    connectionId: message.business_connection_id,
    chatTitle,
    actorName: result.senderName || fullName(message.from),
    messageKind: result.messageKind,
    beforeText: result.beforeText,
    afterText: result.afterText,
    beforeCaption: result.beforeCaption,
    afterCaption: result.afterCaption
  });
}
