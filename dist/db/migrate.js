import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../lib/logger.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function migrate() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = await fs.readFile(schemaPath, 'utf8');
    logger.info('\n=== Supabase SQL migration ===\n');
    logger.info('Open Supabase → SQL Editor and run the full SQL below:\n');
    logger.info(`\n${sql}\n`);
    logger.info('=== End SQL ===');
}
if (process.argv[1]?.endsWith('migrate.ts')) {
    migrate().catch((error) => {
        logger.error({ error }, 'Migration helper failed');
        process.exit(1);
    });
}
