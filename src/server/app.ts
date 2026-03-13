import express from 'express';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { routeUpdate } from '../handlers/updateRouter.js';
import type { Update } from '../telegram/types.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  app.post(env.WEBHOOK_PATH, async (req, res) => {
    const update = req.body as Update;

    logger.info(
      {
        updateId: update?.update_id,
        hasMessage: !!update?.message,
        hasBusinessMessage: !!update?.business_message,
        hasEditedBusinessMessage: !!update?.edited_business_message,
        hasDeletedBusinessMessages: !!update?.deleted_business_messages,
        text: update?.message?.text ?? null
      },
      'Incoming telegram update'
    );

    try {
      if (update?.message?.text === '/start' && update?.message?.chat?.id) {
        const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: update.message.chat.id,
            text:
              'Привет. Бот запущен и webhook работает.\n\nДальше подключи меня в Telegram Business → Chatbots и дай доступ к нужным чатам.'
          })
        });

        const data = await response.json();
        logger.info({ data }, 'Direct /start reply result');
        res.json({ ok: true, directStartHandled: true });
        return;
      }

      await routeUpdate(update);
      res.json({ ok: true });
    } catch (error) {
      logger.error({ error, updateId: update?.update_id }, 'Failed to process update');
      res.status(500).json({ ok: false });
    }
  });

  return app;
}