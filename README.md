# The Polarities

Editorial polarity article site built with Next.js, TypeScript, Tailwind, Prisma, and Postgres. It is set up for local-first work today and Fly.io deployment later.

## What Is Here

- Public homepage, article index, article detail pages, and a small About placeholder.
- Local admin editor at `/admin` for article metadata, structured sections, related polarities, and publish/featured flags.
- Prisma schema and migration for articles, sections, related articles, and generated assets.
- Seed/import flow from the Google Docs text export in `content/source/polarity-articles-drafts.txt`.
- Docker and Fly config for a production-style deployment path.
- Unit/component tests with Vitest and browser tests with Playwright.

## Quick Start

Requirements:

- Node 22
- Docker Desktop

Install dependencies:

```bash
npm install
```

Start local Postgres:

```bash
docker compose up -d db
```

Apply migrations and seed content:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polarities?schema=public" npm run db:deploy
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polarities?schema=public" npm run db:seed
```

Run the local app:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polarities?schema=public" \
ALLOW_UNAUTHENTICATED_ADMIN="true" \
npm run dev -- --hostname 127.0.0.1
```

Open:

- Site: `http://127.0.0.1:3000`
- Admin: `http://127.0.0.1:3000/admin`
- Health check: `http://127.0.0.1:3000/api/health`

## Docker

Build and run the production-style app locally:

```bash
docker compose up --build app
```

The app service waits for Postgres, runs `prisma migrate deploy`, runs the seed, then starts the Next standalone server.

## Content

The current seed source is:

```text
content/source/polarity-articles-drafts.txt
```

That file is a plain-text export of the Google Doc `Polarity Articles - Drafts`. The parser lives at:

```text
src/lib/content/google-doc-parser.ts
```

To inspect a parsed JSON payload without touching the database:

```bash
npm run import:docs -- --path content/source/polarity-articles-drafts.txt
```

The seed is one-way for now: Google Docs export to DB. Once content is edited in the admin, the DB should be treated as the app source of truth unless a later sync workflow is designed.

## Generated Assets

Generated project assets live in:

```text
public/generated/
```

Asset prompts and metadata are recorded in:

```text
src/lib/content/buckets.ts
```

## Tests

```bash
npm test
npm run lint
npm run build
npm run test:e2e
npm audit --omit=dev
```

Playwright expects local Postgres to be running and seeded. If browsers are missing:

```bash
npx playwright install chromium
```

## Fly.io Notes

`fly.toml` is included with a placeholder app name. Before deploying for real, update the Fly app name and public URL, then attach Fly Postgres so `DATABASE_URL` is available.

The Fly release command runs:

```bash
npx prisma migrate deploy
```

Useful future secrets/config:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAILS`
- Google OAuth client values once auth is implemented

Admin auth is intentionally local-only in this first pass. Production admin access should be locked behind Google OAuth before real use.
