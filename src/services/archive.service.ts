import { fullName } from '../lib/format.js';
import type { TgMessage } from '../telegram/types.js';
import {
  findArchivedMessage,
  insertArchivedMessage,
  insertEditEvent,
  insertMessageMedia,
  markMessageDeleted,
  updateArchivedMessageText
} from '../repositories/message.repo.js';
import { maybeDownloadMedia } from './media.service.js';

function detectMessageKind(message: TgMessage) {
  if (message.photo?.length) return 'photo';
  if (message.video) return 'video';
  if (message.document) return 'document';
  if (message.voice) return 'voice';
  if (message.audio) return 'audio';
  if (message.text) return 'text';
  return 'unknown';
}

export async function archiveBusinessMessage(message: TgMessage) {
  const connectionId = message.business_connection_id;
  if (!connectionId) return;

  const chatId = String(message.chat.id);
  const messageKind = detectMessageKind(message);

  await insertArchivedMessage({
    connectionId,
    chatId,
    messageId: message.message_id,
    senderUserId: message.from ? String(message.from.id) : null,
    senderName: fullName(message.from),
    sentAtUnix: message.date ?? null,
    textContent: message.text ?? null,
    captionContent: message.caption ?? null,
    messageKind,
    rawJson: JSON.stringify(message)
  });

  if (message.photo?.length) {
    const bestPhoto = message.photo[message.photo.length - 1];
    const saved = await maybeDownloadMedia({
      fileId: bestPhoto.file_id,
      fallbackName: `${connectionId}_${chatId}_${message.message_id}_photo.jpg`
    });
    await insertMessageMedia({
      connectionId,
      chatId,
      messageId: message.message_id,
      mediaType: 'photo',
      fileId: bestPhoto.file_id,
      fileUniqueId: bestPhoto.file_unique_id ?? null,
      fileSize: bestPhoto.file_size ?? null,
      localPath: saved.localPath,
      telegramFilePath: saved.telegramFilePath
    });
  }

  for (const item of [message.document, message.video, message.voice, message.audio]) {
    if (!item) continue;
    const type =
      message.document === item ? 'document' :
      message.video === item ? 'video' :
      message.voice === item ? 'voice' : 'audio';

    const saved = await maybeDownloadMedia({
      fileId: item.file_id,
      fallbackName: `${connectionId}_${chatId}_${message.message_id}_${type}_${'file_name' in item && item.file_name ? item.file_name : 'bin'}`
    });

    await insertMessageMedia({
      connectionId,
      chatId,
      messageId: message.message_id,
      mediaType: type,
      fileId: item.file_id,
      fileUniqueId: item.file_unique_id ?? null,
      fileName: 'file_name' in item ? item.file_name ?? null : null,
      mimeType: 'mime_type' in item ? item.mime_type ?? null : null,
      fileSize: item.file_size ?? null,
      localPath: saved.localPath,
      telegramFilePath: saved.telegramFilePath
    });
  }
}

export async function recordBusinessMessageEdit(message: TgMessage) {
  const connectionId = message.business_connection_id;
  if (!connectionId) return null;

  const chatId = String(message.chat.id);
  const existing = await findArchivedMessage(connectionId, chatId, message.message_id);

  await insertEditEvent({
    connectionId,
    chatId,
    messageId: message.message_id,
    oldText: existing?.text_content ?? null,
    newText: message.text ?? null,
    oldCaption: existing?.caption_content ?? null,
    newCaption: message.caption ?? null,
    editedAtUnix: Math.floor(Date.now() / 1000),
    rawJson: JSON.stringify(message)
  });

  await updateArchivedMessageText({
    connectionId,
    chatId,
    messageId: message.message_id,
    textContent: message.text ?? null,
    captionContent: message.caption ?? null,
    rawJson: JSON.stringify(message)
  });

  return {
    beforeText: existing?.text_content ?? null,
    afterText: message.text ?? null,
    beforeCaption: existing?.caption_content ?? null,
    afterCaption: message.caption ?? null,
    senderName: existing?.sender_name ?? fullName(message.from),
    messageKind: existing?.message_kind ?? detectMessageKind(message)
  };
}

export async function recordBusinessMessageDeletion(connectionId: string, chatId: string, messageId: number) {
  const existing = await findArchivedMessage(connectionId, chatId, messageId);
  await markMessageDeleted(connectionId, chatId, messageId, Math.floor(Date.now() / 1000));
  return existing;
}
