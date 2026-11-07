# 8squared Chess Club

Public website for the 8squared chess club: membership applications, events and
registrations, sponsors, and the club's member carousel.

## Stack

- React 19 with TanStack Start and TanStack Router
- Supabase for the database, storage and row-level security
- Tailwind CSS 4, Radix UI, Embla carousel

## Getting started

```sh
npm install
cp .env.example .env   # fill in the Supabase URL and publishable key
npm run dev
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL (browser) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (browser) |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project reference |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Same values, used during server rendering |
| `CRON_SECRET`, `CRON_SECRET_PREVIOUS` | Secrets for scheduled jobs, if used |
| `DATABASE_URL` | Connection string for running Drizzle migrations |

Never put the service-role key in a variable that the browser can read.

## Database migrations

Migrations live in `drizzle/migrations` and must be applied in order. Run them
in the Supabase SQL editor, or with Drizzle using `DATABASE_URL`.

## Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm test`: unit and routing tests
- `npm run lint`: linter

## Project notes

Working rules for code changes are in `AGENTS.md`. Product goals are in
`docs/north-star.md`.
