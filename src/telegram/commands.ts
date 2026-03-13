import { deleteWebhook, getMe, setWebhook } from './api.js';
import { logger } from '../lib/logger.js';

const command = process.argv[2];

async function main() {
  switch (command) {
    case 'set-webhook': {
      const result = await setWebhook();
      logger.info({ result }, 'Webhook set');
      break;
    }
    case 'delete-webhook': {
      const result = await deleteWebhook();
      logger.info({ result }, 'Webhook deleted');
      break;
    }
    case 'get-me': {
      const me = await getMe();
      logger.info({ me }, 'Bot info');
      break;
    }
    default:
      logger.info('Use: npm run set:webhook | delete:webhook | bot:info');
  }
}

main().catch((error) => {
  logger.error({ error }, 'Command failed');
  process.exit(1);
});
