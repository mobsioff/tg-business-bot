# Telegram Business Anti-Delete Bot

Production-style Telegram Business bot scaffold for:
- onboarding users via `/start`
- storing Telegram Business connections in Supabase
- archiving business messages
- detecting edits via `edited_business_message`
- detecting deletions via `deleted_business_messages`
- notifying the business account owner in the bot chat
- optionally downloading media locally

## Stack
- Node.js 20+
- TypeScript
- Express webhook server
- Supabase Postgres
- local media cache for photos/files/videos/voice

## Install
```bash
npm install
cp .env.example .env
```

## Required environment
```env
BOT_TOKEN=...
PUBLIC_BASE_URL=https://your-domain.com
WEBHOOK_SECRET=super_long_random_secret
PORT=3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_SCHEMA=public
MEDIA_DIR=./storage/media
SAVE_MEDIA=true
AUTO_MARK_AS_READ=false
LOG_LEVEL=info
DEFAULT_LANGUAGE=ru
```

## Supabase setup
1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `src/db/schema.sql`.
4. Put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into `.env`.

## Run locally
```bash
npm run dev
```

## Set webhook
```bash
npm run set:webhook
```

## Remove webhook
```bash
npm run delete:webhook
```

## Build
```bash
npm run build
npm start
```

## Main folders
- `src/handlers/private` — `/start`, `/help`, `/status`, `/privacy`
- `src/handlers/business` — business updates
- `src/services` — archive, media, notify logic
- `src/repositories` — Supabase storage layer
- `src/telegram` — raw Bot API client
- `src/server` — Express app and webhook route

## Important notes
1. This bot only works after the user personally connects it through Telegram Business.
2. Deleted content can be shown only if Telegram delivered the original message before it was deleted.
3. Secret chats are not supported.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` only on the server. Never expose it to frontend code.
5. RLS is enabled in the SQL, but the service role bypasses it. Add custom policies later only if you build a user-facing dashboard.

## Suggested next upgrades
- admin panel / mini app
- per-chat rules
- retention settings (7/30/90 days)
- export logs to ZIP
- billing and Stars-based subscriptions
- Redis queue for very active bots
- move media from local disk to Supabase Storage or S3
