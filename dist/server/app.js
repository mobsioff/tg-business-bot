import express from 'express';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { routeUpdate } from '../handlers/updateRouter.js';
export function createApp() {
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.get('/health', (_req, res) => {
        res.json({ ok: true, uptime: process.uptime() });
    });
    app.post(env.WEBHOOK_PATH, async (req, res) => {
        const secretHeader = req.header('x-telegram-bot-api-secret-token');
        if (secretHeader !== env.WEBHOOK_SECRET) {
            logger.warn('Webhook secret mismatch');
            res.status(401).json({ ok: false });
            return;
        }
        const update = req.body;
        try {
            await routeUpdate(update);
            res.json({ ok: true });
        }
        catch (error) {
            logger.error({ error, updateId: update.update_id }, 'Failed to process update');
            res.status(500).json({ ok: false });
        }
    });
    return app;
}
