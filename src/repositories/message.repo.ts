import { supabase } from '../db/client.js';

type ArchiveRow = {
  connectionId: string;
  chatId: string;
  messageId: number;
  senderUserId?: string | null;
  senderName?: string | null;
  sentAtUnix?: number | null;
  textContent?: string | null;
  captionContent?: string | null;
  messageKind: string;
  rawJson: string;
};

export async function insertArchivedMessage(row: ArchiveRow) {
  const payload = {
    connection_id: row.connectionId,
    chat_id: row.chatId,
    message_id: row.messageId,
    sender_user_id: row.senderUserId ?? null,
    sender_name: row.senderName ?? null,
    direction: 'incoming',
    sent_at_unix: row.sentAtUnix ?? null,
    text_content: row.textContent ?? null,
    caption_content: row.captionContent ?? null,
    message_kind: row.messageKind,
    raw_json: JSON.parse(row.rawJson),
    was_deleted: false,
    deleted_at_unix: null
  };

  const { error } = await supabase.from('archived_messages').upsert(payload, {
    onConflict: 'connection_id,chat_id,message_id'
  });
  if (error) throw error;
}

export async function insertMessageMedia(row: Record<string, unknown>) {
  const payload = {
    connection_id: row.connectionId,
    chat_id: row.chatId,
    message_id: row.messageId,
    media_type: row.mediaType,
    file_id: row.fileId,
    file_unique_id: row.fileUniqueId,
    file_name: row.fileName,
    mime_type: row.mimeType,
    file_size: row.fileSize,
    local_path: row.localPath,
    telegram_file_path: row.telegramFilePath
  };

  const { error } = await supabase.from('message_media').insert(payload);
  if (error) throw error;
}

export async function findArchivedMessage(connectionId: string, chatId: string, messageId: number) {
  const { data, error } = await supabase
    .from('archived_messages')
    .select('*')
    .eq('connection_id', connectionId)
    .eq('chat_id', chatId)
    .eq('message_id', messageId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function markMessageDeleted(connectionId: string, chatId: string, messageId: number, deletedAtUnix: number) {
  const { error: updateError } = await supabase
    .from('archived_messages')
    .update({ was_deleted: true, deleted_at_unix: deletedAtUnix })
    .eq('connection_id', connectionId)
    .eq('chat_id', chatId)
    .eq('message_id', messageId);

  if (updateError) throw updateError;

  const { error: insertError } = await supabase.from('delete_events').insert({
    connection_id: connectionId,
    chat_id: chatId,
    message_id: messageId,
    deleted_at_unix: deletedAtUnix
  });

  if (insertError) throw insertError;
}

export async function insertEditEvent(row: Record<string, unknown>) {
  const payload = {
    connection_id: row.connectionId,
    chat_id: row.chatId,
    message_id: row.messageId,
    old_text: row.oldText,
    new_text: row.newText,
    old_caption: row.oldCaption,
    new_caption: row.newCaption,
    edited_at_unix: row.editedAtUnix,
    raw_json: JSON.parse(String(row.rawJson))
  };

  const { error } = await supabase.from('message_edits').insert(payload);
  if (error) throw error;
}

export async function updateArchivedMessageText(row: {
  connectionId: string;
  chatId: string;
  messageId: number;
  textContent?: string | null;
  captionContent?: string | null;
  rawJson: string;
}) {
  const { error } = await supabase
    .from('archived_messages')
    .update({
      text_content: row.textContent ?? null,
      caption_content: row.captionContent ?? null,
      raw_json: JSON.parse(row.rawJson)
    })
    .eq('connection_id', row.connectionId)
    .eq('chat_id', row.chatId)
    .eq('message_id', row.messageId);

  if (error) throw error;
}

export async function listRecentMessagesByConnection(connectionId: string, limit = 5) {
  const { data, error } = await supabase
    .from('archived_messages')
    .select('*')
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}


export async function findMessageMedia(connectionId: string, chatId: string, messageId: number) {
  const { data, error } = await supabase
    .from('message_media')
    .select('*')
    .eq('connection_id', connectionId)
    .eq('chat_id', chatId)
    .eq('message_id', messageId)
    .order('id', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function findFirstMessageMedia(connectionId: string, chatId: string, messageId: number) {
  const media = await findMessageMedia(connectionId, chatId, messageId);
  return media[0] ?? null;
}