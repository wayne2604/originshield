# OriginShield

OriginShield is an AI content detection platform built with Next.js, Tailwind CSS, and Supabase. It verifies text, images, and URLs through first-party API routes so provider credentials stay on the server.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS 4
- Supabase Auth and database storage
- Sapling AI for text and URL content detection
- Sightengine for image AI/deepfake checks

## Setup

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example`:

```bash
SAPLING_API_KEY=
SIGHTENGINE_API_USER=
SIGHTENGINE_API_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase

The app expects a `scans` table with these columns:

- `id` text or uuid primary key
- `content_hash` text
- `type` text
- `truth_score` integer
- `verdict` text
- `confidence_level` text
- `c2pa_verified` boolean
- `detected_artifacts` jsonb
- `evidence_tags` jsonb
- `breakdown` jsonb
- `metadata` jsonb
- `user_id` uuid nullable
- `ip_address` text nullable
- `created_at` timestamptz

Authenticated scans are associated to a user with `user_id`. Guest scans are associated to `ip_address` and capped at 3 scans before the upgrade modal is shown.

## Architecture

- `src/app/api/verify/text` handles text detection through Sapling.
- `src/app/api/verify/media` handles image metadata checks and Sightengine analysis.
- `src/app/api/verify/url` fetches public page text and sends it through Sapling.
- `src/lib/rateLimit.ts` provides in-memory per-IP quota protection for detection routes.
- `src/components/landing` contains the landing page sections.
- `src/components/auth` contains Supabase login/signup UI.
- `src/app/profile` shows authenticated scan history.

## Production Notes

- Rotate any API keys that were ever exposed.
- Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so sitemap, robots, and social metadata resolve correctly.
- Use provider-level quotas in addition to the app's in-memory rate limiter for multi-instance deployments.
- Keep `.env.local` and all real secrets out of Git.

## Checks

```bash
npm run lint
npm run build
```
