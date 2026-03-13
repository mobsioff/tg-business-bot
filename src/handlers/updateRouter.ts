import { logger } from '../lib/logger.js';
import type { Update } from '../telegram/types.js';
import { handlePrivateStart } from './private/start.js';
import { handlePrivateCommand } from './private/help.js';
import { handleBusinessConnection } from './business/connection.js';
import { handleBusinessMessage } from './business/message.js';
import { handleBusinessEdit } from './business/edit.js';
import { handleBusinessDelete } from './business/delete.js';

export async function routeUpdate(update: Update) {
  if (update.message?.chat?.type === 'private' && update.message.text?.startsWith('/start')) {
    await handlePrivateStart(update.message);
    return;
  }

  if (update.message?.chat?.type === 'private' && update.message.text?.startsWith('/')) {
    await handlePrivateCommand(update.message);
    return;
  }

  if (update.business_connection) {
    await handleBusinessConnection(update.business_connection);
    return;
  }

  if (update.business_message) {
    await handleBusinessMessage(update.business_message);
    return;
  }

  if (update.edited_business_message) {
    await handleBusinessEdit(update.edited_business_message);
    return;
  }

  if (update.deleted_business_messages) {
    await handleBusinessDelete(update.deleted_business_messages);
    return;
  }

  logger.debug({ update }, 'Unhandled update');
}
