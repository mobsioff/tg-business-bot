import path from 'node:path';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { downloadTelegramFile, getFile } from '../telegram/api.js';
export async function maybeDownloadMedia(target) {
    if (!env.SAVE_MEDIA)
        return { localPath: null, telegramFilePath: null };
    const file = await getFile(target.fileId);
    if (!file.file_path)
        return { localPath: null, telegramFilePath: null };
    const safeName = target.fallbackName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const destination = path.join(env.MEDIA_DIR, safeName);
    try {
        await downloadTelegramFile(file.file_path, destination);
        return { localPath: destination, telegramFilePath: file.file_path };
    }
    catch (error) {
        logger.warn({ error, fileId: target.fileId }, 'Failed to save media locally');
        return { localPath: null, telegramFilePath: file.file_path };
    }
}
