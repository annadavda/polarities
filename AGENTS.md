# Agent Handoff Notes

## Current State

This repo is a working skeleton for The Polarities website. It uses:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Prisma 7 with the `@prisma/adapter-pg` Postgres adapter
- Postgres locally through Docker Compose
- Vitest, React Testing Library, and Playwright

The local dev path was verified with 12 seeded articles, 84 sections, and 5 asset records.

## Important Commands

```bash
docker compose up -d db
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polarities?schema=public" npm run db:deploy
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polarities?schema=public" npm run db:seed
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polarities?schema=public" ALLOW_UNAUTHENTICATED_ADMIN="true" npm run dev -- --hostname 127.0.0.1
```

Verification:

```bash
npm test
npm run lint
npm run build
npm run test:e2e
npm audit --omit=dev
docker compose build app
docker compose up -d app
```

## Architecture Pointers

- Public pages: `src/app/page.tsx`, `src/app/articles/page.tsx`, `src/app/articles/[slug]/page.tsx`
- Admin pages/actions: `src/app/admin/**`
- Prisma schema: `prisma/schema.prisma`
- Seed: `prisma/seed.ts`
- Google Docs export parser: `src/lib/content/google-doc-parser.ts`
- Content/bucket assets: `src/lib/content/buckets.ts`
- DB client: `src/lib/prisma.ts`
- Admin validation: `src/lib/admin/validation.ts`

## Content Model

Articles have structured sections. Section `type` values currently include:

- `opening_image`
- `vignette`
- `wise_use`
- `overuse`
- `questions`
- `body`

Related polarities are stored separately as titles and optional target slugs.

## Known Follow-Ups

- Add Google OAuth before any production admin use.
- Decide the real Google Docs to DB sync story before editors work in both places.
- Expand admin UX for adding/reordering sections more elegantly.
- Add richer article layouts using the structured section types.
- Update `fly.toml` with Anna's real Fly app name and deployed URL before production deploy.
- Consider replacing the committed text export with an authenticated import path once repo access and Google credentials are settled.
