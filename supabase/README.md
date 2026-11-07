# Database setup (Supabase)

The app talks to Supabase only through `src/integrations/supabase/client.ts`.
`supabase/migrations/20260101000000_init.sql` is the full schema: tables, RLS
policies, the public RPCs, the accommodation trigger and the private portrait
bucket.

## 1. Create the project

1. Create a project at <https://supabase.com> (the free plan is enough).
2. Copy from **Project Settings → API**:
   - Project URL → `SUPABASE_URL`
   - Publishable / anon key → `SUPABASE_PUBLISHABLE_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY` (server only, never `VITE_*`)

In AppJet these are repository environment variables (Settings → Supabase or
Settings → Environment). The build also exposes `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` to the browser bundle — only the public key
belongs there.

## 2. Apply the schema

```bash
supabase link --project-ref <ref>      # once
supabase db push                       # applies supabase/migrations/*.sql
```

Or without the CLI:

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260101000000_init.sql
```

The migration is idempotent (`create ... if not exists`, `drop policy if exists`),
so re-running it is safe.

## 3. Create the first editor

Admin access needs two rows: editor eligibility (`user_roles`) and a short-lived
write grant (`editor_sessions`) that the server inserts after a successful
password check.

```sql
-- 1. create the user in Supabase Auth (Dashboard → Authentication → Users),
--    then grant eligibility with its UID:
insert into public.user_roles (user_id, role) values ('<auth-user-uid>', 'editor');
```

`is_admin()` stays false until `src/lib/admin/access.functions.ts` inserts the
grant for the current session, so a read-only session can never write.

## 4. Content

Nothing is seeded: add events, sponsors, links and `site_content` rows from
`/admin`, or insert them directly. Public pages only read `events` with
`status = 'published'`, active sponsors/links and active club members.
