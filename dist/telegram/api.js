import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
const baseUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}`;
const fileBaseUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}`;
async function request(method, body) {
    const response = await fetch(`${baseUrl}/${method}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    });
    const json = (await response.json());
    if (!response.ok || !json.ok) {
        throw new Error(`Telegram API ${method} failed: ${json.description ?? response.statusText}`);
    }
    return json.result;
}
export async function getMe() {
    return request('getMe');
}
export async function setWebhook() {
    return request('setWebhook', {
        url: `${env.PUBLIC_BASE_URL}${env.WEBHOOK_PATH}`,
        secret_token: env.WEBHOOK_SECRET,
        allowed_updates: ['message', 'business_connection', 'business_message', 'edited_business_message', 'deleted_business_messages']
    });
}
export async function deleteWebhook() {
    return request('deleteWebhook', { drop_pending_updates: false });
}
export async function sendMessage(chatId, text, extra) {
    return request('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...extra
    });
}
export async function readBusinessMessage(businessConnectionId, chatId, messageId) {
    return request('readBusinessMessage', {
        business_connection_id: businessConnectionId,
        chat_id: Number(chatId),
        message_id: messageId
    });
}
export async function getFile(fileId) {
    return request('getFile', {
        file_id: fileId
    });
}
export async function downloadTelegramFile(filePath, destinationPath) {
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    const response = await fetch(`${fileBaseUrl}/${filePath}`);
    if (!response.ok) {
        throw new Error(`Unable to download file: ${filePath}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(destinationPath, buffer);
    logger.debug({ destinationPath }, 'Telegram file saved');
}
