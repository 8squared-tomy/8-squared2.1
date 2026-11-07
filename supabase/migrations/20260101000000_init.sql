-- 8 Squared chess club — initial schema.
-- Contract source: src/integrations/supabase/types.ts, src/lib/publicApi.ts,
-- src/lib/admin/*.ts, src/lib/club-ui.ts, src/lib/validation.ts, AGENTS.md.
--
-- Apply with:  supabase db push        (linked project)
--          or  psql "$DATABASE_URL" -f supabase/migrations/20260101000000_init.sql
--
-- Design notes:
--  * Public reads are limited by RLS to published events, active sponsors/links,
--    active members and site content. Every other table is admin-only.
--  * Public writes never touch tables directly: register_for_event() and
--    submit_membership_request() are SECURITY DEFINER RPCs with rate limiting,
--    so a leaked anon key cannot insert or read personal data.
--  * is_admin() requires BOTH editor eligibility (user_roles) and a short-lived
--    grant row in editor_sessions bound to the caller's Auth session_id claim,
--    so a read-only session cannot write even through direct REST calls.
--    can_read_admin() only requires editor eligibility (read-only admin UI).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Identity / authorization tables
-- ---------------------------------------------------------------------------

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Legacy table kept for compatibility; authorization uses user_roles.
create table if not exists public.admin_users (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

-- Short-lived write grant created server-side (src/lib/admin/access.functions.ts).
create table if not exists public.editor_sessions (
  session_id uuid primary key,
  user_id uuid not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists editor_sessions_user_idx on public.editor_sessions (user_id);

create table if not exists public.rate_limits (
  bucket_key text primary key,
  hits integer not null default 0,
  window_start timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (length(btrim(title_en)) between 1 and 200),
  title_ar text,
  description_en text,
  description_ar text,
  location_en text,
  location_ar text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  registration_open boolean not null default false,
  created_at timestamptz not null default now(),
  constraint events_time_order check (ends_at is null or ends_at >= starts_at)
);

create index if not exists events_status_starts_idx on public.events (status, starts_at);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 200),
  description_en text,
  description_ar text,
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.event_sponsors (
  event_id uuid not null references public.events (id) on delete cascade,
  sponsor_id uuid not null references public.sponsors (id) on delete cascade,
  primary key (event_id, sponsor_id)
);

create table if not exists public.external_links (
  id uuid primary key default gen_random_uuid(),
  label_en text not null check (length(btrim(label_en)) between 1 and 200),
  label_ar text,
  url text not null check (url ~* '^https://'),
  platform text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.site_content (
  key text primary key check (length(key) between 1 and 100),
  value_en text not null default '',
  value_ar text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 200),
  club_role text not null default 'member',
  photo_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Intake tables (public writes go through RPCs only)
-- ---------------------------------------------------------------------------

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) between 2 and 100),
  email text not null check (length(email) between 5 and 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  university text not null check (length(btrim(university)) between 2 and 120),
  phone text,
  needs_accommodation boolean not null default false,
  residence text,
  bac_registration_number text,
  status text not null default 'confirmed' check (status in ('confirmed', 'waitlisted', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists event_registrations_event_status_idx
  on public.event_registrations (event_id, status);

-- One live registration per event and email; cancelled rows are ignored.
create unique index if not exists event_registrations_event_email_idx
  on public.event_registrations (event_id, lower(email))
  where status <> 'cancelled';

create table if not exists public.membership_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(btrim(full_name)) between 2 and 100),
  email text not null check (length(email) between 5 and 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  university text not null check (length(btrim(university)) between 2 and 120),
  phone text,
  level text not null check (level in ('beginner', 'intermediate', 'advanced', 'expert')),
  years_playing text check (years_playing is null or years_playing in ('under_1', '1_3', '3_5', 'over_5')),
  fide_rating integer check (fide_rating is null or fide_rating between 0 and 3000),
  interests text,
  message text,
  training_time text check (training_time is null or training_time in ('weekday_evenings', 'weekends', 'flexible')),
  status text not null default 'new' check (status in ('new', 'accepted', 'rejected', 'waitlisted')),
  created_at timestamptz not null default now()
);

create index if not exists membership_requests_status_created_idx
  on public.membership_requests (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Authorization helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_editor_identity()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles r
    where r.user_id = auth.uid()
      and r.role in ('admin', 'editor')
  );
$$;

create or replace function public.can_read_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_editor_identity();
$$;

-- Write access needs editor eligibility plus an unexpired grant bound to this
-- Auth session, so a stolen read-only session cannot mutate data.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with claim as (
    select case
             when coalesce(auth.jwt() ->> 'session_id', '')
                  ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
               then (auth.jwt() ->> 'session_id')::uuid
           end as sid
  )
  select public.is_editor_identity()
     and exists (
       select 1
       from public.editor_sessions s
       cross join claim c
       where c.sid is not null
         and s.session_id = c.sid
         and s.user_id = auth.uid()
         and s.expires_at > now()
     );
$$;

-- ---------------------------------------------------------------------------
-- Rate limiting
-- ---------------------------------------------------------------------------

create or replace function public.check_rate_limit(p_bucket text, p_max integer, p_window text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window interval := p_window::interval;
  v_now timestamptz := now();
  v_hits integer;
begin
  insert into public.rate_limits as rl (bucket_key, hits, window_start)
  values (p_bucket, 1, v_now)
  on conflict (bucket_key) do update
    set hits = case when rl.window_start < v_now - v_window then 1 else rl.hits + 1 end,
        window_start = case when rl.window_start < v_now - v_window then v_now else rl.window_start end
  returning rl.hits into v_hits;

  if v_hits > p_max then
    raise exception 'RATE_LIMITED' using errcode = 'P0001';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public RPCs
-- ---------------------------------------------------------------------------

create or replace function public.get_event_seat_counts()
returns table (event_id uuid, confirmed_count bigint)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select r.event_id, count(*)::bigint
  from public.event_registrations r
  where r.status = 'confirmed'
  group by r.event_id;
$$;

-- Extended registration (accommodation aware). Returns 'confirmed' or 'waitlisted'.
create or replace function public.register_for_event(
  p_event_id uuid,
  p_full_name text,
  p_email text,
  p_university text,
  p_phone text,
  p_needs_accommodation boolean,
  p_residence text,
  p_bac_registration_number text
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_event public.events;
  v_needs_accommodation boolean := coalesce(p_needs_accommodation, false);
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_confirmed integer;
  v_status text;
begin
  perform public.check_rate_limit('register:' || v_email, 5, '10 minutes');

  select * into v_event from public.events e where e.id = p_event_id;
  if v_event.id is null or v_event.status <> 'published' or not v_event.registration_open then
    raise exception 'EVENT_UNAVAILABLE' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.event_registrations r
    where r.event_id = p_event_id
      and lower(r.email) = v_email
      and r.status <> 'cancelled'
  ) then
    raise exception 'ALREADY_REGISTERED' using errcode = 'P0001';
  end if;

  if v_needs_accommodation then
    if length(btrim(coalesce(p_residence, ''))) not between 2 and 120 then
      raise exception 'INVALID_RESIDENCE' using errcode = 'P0001';
    end if;
    if btrim(coalesce(p_bac_registration_number, '')) !~ '^[0-9]{1,30}$' then
      raise exception 'INVALID_BAC_NUMBER' using errcode = 'P0001';
    end if;
    if btrim(coalesce(p_phone, '')) !~ '^\+?[0-9 ()-]{6,25}$' then
      raise exception 'INVALID_ACCOMMODATION_PHONE' using errcode = 'P0001';
    end if;
  end if;

  -- Serialize seat accounting for this event so two callers cannot both take
  -- the last place.
  perform pg_advisory_xact_lock(hashtextextended(p_event_id::text, 0));

  select count(*) into v_confirmed
  from public.event_registrations r
  where r.event_id = p_event_id and r.status = 'confirmed';

  v_status := case
    when v_event.capacity is null or v_confirmed < v_event.capacity then 'confirmed'
    else 'waitlisted'
  end;

  insert into public.event_registrations (
    event_id, full_name, email, university, phone,
    needs_accommodation, residence, bac_registration_number, status
  ) values (
    p_event_id,
    btrim(p_full_name),
    v_email,
    btrim(p_university),
    nullif(btrim(coalesce(p_phone, '')), ''),
    v_needs_accommodation,
    case when v_needs_accommodation then btrim(p_residence) end,
    case when v_needs_accommodation then btrim(p_bac_registration_number) end,
    v_status
  );

  return v_status;
end;
$$;

-- Legacy wrapper: older clients post five arguments and no accommodation data.
create or replace function public.register_for_event(
  p_event_id uuid,
  p_full_name text,
  p_email text,
  p_university text,
  p_phone text
)
returns text
language sql
security definer
set search_path = public, pg_temp
as $$
  select public.register_for_event(
    p_event_id, p_full_name, p_email, p_university, p_phone, false, '', ''
  );
$$;

create or replace function public.submit_membership_request(
  p_full_name text,
  p_email text,
  p_university text,
  p_phone text,
  p_level text,
  p_years_playing text,
  p_fide_rating integer,
  p_interests text,
  p_message text,
  p_training_time text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_level text := btrim(coalesce(p_level, ''));
begin
  perform public.check_rate_limit('membership:' || v_email, 3, '1 hour');

  if v_level not in ('beginner', 'intermediate', 'advanced', 'expert') then
    raise exception 'INVALID_LEVEL' using errcode = 'P0001';
  end if;

  if p_years_playing is not null
     and btrim(p_years_playing) not in ('under_1', '1_3', '3_5', 'over_5') then
    raise exception 'INVALID_YEARS_PLAYING' using errcode = 'P0001';
  end if;

  if p_training_time is not null
     and btrim(p_training_time) not in ('weekday_evenings', 'weekends', 'flexible') then
    raise exception 'INVALID_TRAINING_TIME' using errcode = 'P0001';
  end if;

  insert into public.membership_requests (
    full_name, email, university, phone, level,
    years_playing, fide_rating, interests, message, training_time
  ) values (
    btrim(p_full_name),
    v_email,
    btrim(p_university),
    nullif(btrim(coalesce(p_phone, '')), ''),
    v_level,
    nullif(btrim(coalesce(p_years_playing, '')), ''),
    p_fide_rating,
    nullif(btrim(coalesce(p_interests, '')), ''),
    nullif(btrim(coalesce(p_message, '')), ''),
    nullif(btrim(coalesce(p_training_time, '')), '')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Accommodation validation trigger (defence in depth for direct table writes)
-- ---------------------------------------------------------------------------

create or replace function public.validate_event_registration()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.email := lower(btrim(new.email));

  if coalesce(new.needs_accommodation, false) then
    if length(btrim(coalesce(new.residence, ''))) not between 2 and 120 then
      raise exception 'INVALID_RESIDENCE' using errcode = 'P0001';
    end if;
    if btrim(coalesce(new.bac_registration_number, '')) !~ '^[0-9]{1,30}$' then
      raise exception 'INVALID_BAC_NUMBER' using errcode = 'P0001';
    end if;
    if btrim(coalesce(new.phone, '')) !~ '^\+?[0-9 ()-]{6,25}$' then
      raise exception 'INVALID_ACCOMMODATION_PHONE' using errcode = 'P0001';
    end if;
  else
    new.residence := null;
    new.bac_registration_number := null;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_event_registration_trigger on public.event_registrations;
create trigger validate_event_registration_trigger
  before insert or update on public.event_registrations
  for each row execute function public.validate_event_registration();

create or replace function public.touch_site_content()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_site_content_trigger on public.site_content;
create trigger touch_site_content_trigger
  before update on public.site_content
  for each row execute function public.touch_site_content();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.user_roles enable row level security;
alter table public.admin_users enable row level security;
alter table public.editor_sessions enable row level security;
alter table public.rate_limits enable row level security;
alter table public.events enable row level security;
alter table public.sponsors enable row level security;
alter table public.event_sponsors enable row level security;
alter table public.external_links enable row level security;
alter table public.site_content enable row level security;
alter table public.club_members enable row level security;
alter table public.event_registrations enable row level security;
alter table public.membership_requests enable row level security;

-- Public (anon + authenticated) read access to published content only.
drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists sponsors_public_read on public.sponsors;
create policy sponsors_public_read on public.sponsors
  for select to anon, authenticated
  using (is_active);

drop policy if exists event_sponsors_public_read on public.event_sponsors;
create policy event_sponsors_public_read on public.event_sponsors
  for select to anon, authenticated
  using (true);

drop policy if exists external_links_public_read on public.external_links;
create policy external_links_public_read on public.external_links
  for select to anon, authenticated
  using (is_active);

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content
  for select to anon, authenticated
  using (true);

drop policy if exists club_members_public_read on public.club_members;
create policy club_members_public_read on public.club_members
  for select to anon, authenticated
  using (is_active);

-- Admin read access (editor eligibility, no write grant needed).
drop policy if exists events_admin_read on public.events;
create policy events_admin_read on public.events
  for select to authenticated using (public.can_read_admin());

drop policy if exists registrations_admin_read on public.event_registrations;
create policy registrations_admin_read on public.event_registrations
  for select to authenticated using (public.can_read_admin());

drop policy if exists memberships_admin_read on public.membership_requests;
create policy memberships_admin_read on public.membership_requests
  for select to authenticated using (public.can_read_admin());

drop policy if exists sponsors_admin_read on public.sponsors;
create policy sponsors_admin_read on public.sponsors
  for select to authenticated using (public.can_read_admin());

drop policy if exists links_admin_read on public.external_links;
create policy links_admin_read on public.external_links
  for select to authenticated using (public.can_read_admin());

drop policy if exists content_admin_read on public.site_content;
create policy content_admin_read on public.site_content
  for select to authenticated using (public.can_read_admin());

drop policy if exists club_members_admin_read on public.club_members;
create policy club_members_admin_read on public.club_members
  for select to authenticated using (public.can_read_admin());

drop policy if exists event_sponsors_admin_read on public.event_sponsors;
create policy event_sponsors_admin_read on public.event_sponsors
  for select to authenticated using (public.can_read_admin());

-- Admin write access requires the editor_sessions grant.
drop policy if exists events_admin_write on public.events;
create policy events_admin_write on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists sponsors_admin_write on public.sponsors;
create policy sponsors_admin_write on public.sponsors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists event_sponsors_admin_write on public.event_sponsors;
create policy event_sponsors_admin_write on public.event_sponsors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists links_admin_write on public.external_links;
create policy links_admin_write on public.external_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists content_admin_write on public.site_content;
create policy content_admin_write on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists club_members_admin_write on public.club_members;
create policy club_members_admin_write on public.club_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists registrations_admin_write on public.event_registrations;
create policy registrations_admin_write on public.event_registrations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists memberships_admin_write on public.membership_requests;
create policy memberships_admin_write on public.membership_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Privileges (Supabase roles; skipped on a plain Postgres cluster)
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon')
     and exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant usage on schema public to anon, authenticated;
    grant select on public.events, public.sponsors, public.event_sponsors,
      public.external_links, public.site_content, public.club_members
      to anon, authenticated;
    grant select on public.event_registrations, public.membership_requests
      to authenticated;
    grant execute on function public.get_event_seat_counts() to anon, authenticated;
    grant execute on function public.register_for_event(uuid, text, text, text, text, boolean, text, text)
      to anon, authenticated;
    grant execute on function public.register_for_event(uuid, text, text, text, text)
      to anon, authenticated;
    grant execute on function public.submit_membership_request(text, text, text, text, text, text, integer, text, text, text)
      to anon, authenticated;
    grant execute on function public.is_admin() to authenticated;
    grant execute on function public.can_read_admin() to authenticated;
    grant execute on function public.is_editor_identity() to authenticated;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Private portrait bucket with public read (AGENTS.md: signed URLs)
-- ---------------------------------------------------------------------------

do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public)
    values ('member-portraits', 'member-portraits', false)
    on conflict (id) do nothing;
  end if;
end
$$;
