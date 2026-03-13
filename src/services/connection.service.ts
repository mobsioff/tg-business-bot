import type { BusinessConnection, TgChat } from '../telegram/types.js';
import { upsertBusinessChat, upsertBusinessConnection, getBusinessConnection } from '../repositories/connection.repo.js';
import { upsertUser } from '../repositories/user.repo.js';

export async function saveBusinessConnection(connection: BusinessConnection) {
  await upsertUser(connection.user);
  await upsertBusinessConnection(connection);
}

export async function touchBusinessChat(connectionId: string, chat: TgChat) {
  await upsertBusinessChat(connectionId, chat);
}

export async function getConnection(connectionId: string) {
  return getBusinessConnection(connectionId);
}
