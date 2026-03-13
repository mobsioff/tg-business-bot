import path from 'node:path';
import { config } from 'dotenv';
import { z } from 'zod';

config();

const schema = z.object({
  BOT_TOKEN: z.string().min(10),
  PUBLIC_BASE_URL: z.string().url(),
  WEBHOOK_SECRET: z.string().min(12),
  PORT: z.coerce.number().int().positive().default(3000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  SUPABASE_SCHEMA: z.string().default('public'),
  MEDIA_DIR: z.string().default('./storage/media'),
  SAVE_MEDIA: z.string().default('true').transform((v) => v === 'true'),
  AUTO_MARK_AS_READ: z.string().default('false').transform((v) => v === 'true'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DEFAULT_LANGUAGE: z.string().default('ru')
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  MEDIA_DIR: path.resolve(parsed.MEDIA_DIR),
  WEBHOOK_PATH: `/telegram/webhook/${parsed.WEBHOOK_SECRET}`
};
