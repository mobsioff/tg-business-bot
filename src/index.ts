import fs from 'node:fs';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { createApp } from './server/app.js';
import { migrate } from './db/migrate.js';
import { healthcheckDb } from './db/client.js';

async function main() {
  fs.mkdirSync(env.MEDIA_DIR, { recursive: true });

  await migrate();
  await healthcheckDb();

  const app = createApp();
  app.listen(env.PORT, '0.0.0.0', () => {
    logger.info({ port: env.PORT, webhookPath: env.WEBHOOK_PATH }, 'Server started');
  });
}

main().catch((error) => {
  logger.error({ error }, 'Fatal startup error');
  process.exit(1);
});