import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import type { TelegramApiResponse } from './types.js';

const baseUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}`;
const fileBaseUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}`;

async function request<T>(method: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${baseUrl}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });

  const json = (await response.json()) as TelegramApiResponse<T> & { error_code?: number };
  if (!response.ok || !json.ok) {
    throw new Error(`Telegram API ${method} failed: ${json.description ?? response.statusText}`);
  }
  return json.result;
}

export async function getMe() {
  return request<{ id: number; username?: string; first_name: string }>('getMe');
}

export async function setWebhook() {
  return request<boolean>('setWebhook', {
    url: `${env.PUBLIC_BASE_URL}${env.WEBHOOK_PATH}`,
    secret_token: env.WEBHOOK_SECRET,
    allowed_updates: ['message', 'business_connection', 'business_message', 'edited_business_message', 'deleted_business_messages']
  });
}

export async function deleteWebhook() {
  return request<boolean>('deleteWebhook', { drop_pending_updates: false });
}

export async function sendMessage(chatId: string | number, text: string, extra?: Record<string, unknown>) {
  return request('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...extra
  });
}

export async function sendPhoto(chatId: string | number, fileId: string, caption?: string) {
  return request('sendPhoto', {
    chat_id: chatId,
    photo: fileId,
    caption,
    parse_mode: 'HTML'
  });
}

export async function sendVideo(chatId: string | number, fileId: string, caption?: string) {
  return request('sendVideo', {
    chat_id: chatId,
    video: fileId,
    caption,
    parse_mode: 'HTML'
  });
}

export async function sendDocument(chatId: string | number, fileId: string, caption?: string) {
  return request('sendDocument', {
    chat_id: chatId,
    document: fileId,
    caption,
    parse_mode: 'HTML'
  });
}

export async function sendVoice(chatId: string | number, fileId: string, caption?: string) {
  return request('sendVoice', {
    chat_id: chatId,
    voice: fileId,
    caption,
    parse_mode: 'HTML'
  });
}

export async function sendAudio(chatId: string | number, fileId: string, caption?: string) {
  return request('sendAudio', {
    chat_id: chatId,
    audio: fileId,
    caption,
    parse_mode: 'HTML'
  });
}

export async function readBusinessMessage(businessConnectionId: string, chatId: string | number, messageId: number) {
  return request<boolean>('readBusinessMessage', {
    business_connection_id: businessConnectionId,
    chat_id: Number(chatId),
    message_id: messageId
  });
}

export async function getFile(fileId: string) {
  return request<{ file_id: string; file_unique_id?: string; file_size?: number; file_path?: string }>('getFile', {
    file_id: fileId
  });
}

export async function downloadTelegramFile(filePath: string, destinationPath: string) {
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  const response = await fetch(`${fileBaseUrl}/${filePath}`);
  if (!response.ok) {
    throw new Error(`Unable to download file: ${filePath}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(destinationPath, buffer);
  logger.debug({ destinationPath }, 'Telegram file saved');
}