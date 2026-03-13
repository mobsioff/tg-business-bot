import { cut, safeText } from '../lib/format.js';
import {
  sendAudio,
  sendDocument,
  sendMessage,
  sendPhoto,
  sendVideo,
  sendVoice
} from '../telegram/api.js';
import { getConnection } from './connection.service.js';

export async function notifyConnectionOwner(connectionId: string, html: string) {
  const connection = await getConnection(connectionId);
  if (!connection?.owner_chat_id) return;
  await sendMessage(connection.owner_chat_id, html);
}

export async function notifyDeleteEvent(params: {
  connectionId: string;
  chatTitle: string;
  actorName: string;
  messageId: number;
  text?: string | null;
  caption?: string | null;
  messageKind?: string | null;
}) {
  const content =
    params.text ||
    params.caption ||
    (params.messageKind === 'photo' ||
    params.messageKind === 'video' ||
    params.messageKind === 'document' ||
    params.messageKind === 'voice' ||
    params.messageKind === 'audio'
      ? 'Медиа сохранено отдельно.'
      : 'Бот не успел сохранить содержимое до удаления.');

  await notifyConnectionOwner(
    params.connectionId,
    `<b>Удалено сообщение</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Кто:</b> ${safeText(params.actorName)}
<b>Тип:</b> ${safeText(params.messageKind ?? 'unknown')}
<b>ID сообщения:</b> ${params.messageId}
<b>Содержимое:</b>
${cut(content)}`
  );
}

export async function notifyEditEvent(params: {
  connectionId: string;
  chatTitle: string;
  actorName: string;
  messageKind: string;
  beforeText?: string | null;
  afterText?: string | null;
  beforeCaption?: string | null;
  afterCaption?: string | null;
}) {
  await notifyConnectionOwner(
    params.connectionId,
    `<b>Сообщение изменено</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Кто:</b> ${safeText(params.actorName)}
<b>Тип:</b> ${safeText(params.messageKind)}

<b>Старый текст:</b>
${cut(params.beforeText || params.beforeCaption || '—')}

<b>Новый текст:</b>
${cut(params.afterText || params.afterCaption || '—')}`
  );
}

type StoredMedia = {
  media_type: string;
  file_id: string | null;
  file_name?: string | null;
};

export async function notifyRecoveredMedia(params: {
  connectionId: string;
  chatTitle: string;
  replyText: string;
  media: StoredMedia;
}) {
  const connection = await getConnection(params.connectionId);
  if (!connection?.owner_chat_id) return;
  if (!params.media.file_id) return;

  const caption =
    `<b>Сохранённое медиа по ответу</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Твой ответ:</b> ${cut(params.replyText, 300)}
<b>Тип:</b> ${safeText(params.media.media_type)}`;

  switch (params.media.media_type) {
    case 'photo':
      await sendPhoto(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'video':
      await sendVideo(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'document':
      await sendDocument(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'voice':
      await sendVoice(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'audio':
      await sendAudio(connection.owner_chat_id, params.media.file_id, caption);
      return;
    default:
      await sendMessage(
        connection.owner_chat_id,
        `<b>Найдено медиа, но тип не поддержан</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Тип:</b> ${safeText(params.media.media_type)}`
      );
  }
}

export async function notifyDeletedMedia(params: {
  connectionId: string;
  chatTitle: string;
  actorName: string;
  messageId: number;
  media: StoredMedia;
}) {
  const connection = await getConnection(params.connectionId);
  if (!connection?.owner_chat_id) return;
  if (!params.media.file_id) return;

  const caption =
    `<b>Удалённое медиа восстановлено</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Кто:</b> ${safeText(params.actorName)}
<b>ID сообщения:</b> ${params.messageId}
<b>Тип:</b> ${safeText(params.media.media_type)}`;

  switch (params.media.media_type) {
    case 'photo':
      await sendPhoto(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'video':
      await sendVideo(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'document':
      await sendDocument(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'voice':
      await sendVoice(connection.owner_chat_id, params.media.file_id, caption);
      return;
    case 'audio':
      await sendAudio(connection.owner_chat_id, params.media.file_id, caption);
      return;
    default:
      await sendMessage(
        connection.owner_chat_id,
        `<b>Удалено медиа, но тип не поддержан</b>

<b>Чат:</b> ${safeText(params.chatTitle)}
<b>Тип:</b> ${safeText(params.media.media_type)}`
      );
  }
}