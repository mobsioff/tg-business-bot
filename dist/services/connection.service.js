import { upsertBusinessChat, upsertBusinessConnection, getBusinessConnection } from '../repositories/connection.repo.js';
import { upsertUser } from '../repositories/user.repo.js';
export async function saveBusinessConnection(connection) {
    await upsertUser(connection.user);
    await upsertBusinessConnection(connection);
}
export async function touchBusinessChat(connectionId, chat) {
    await upsertBusinessChat(connectionId, chat);
}
export async function getConnection(connectionId) {
    return getBusinessConnection(connectionId);
}
