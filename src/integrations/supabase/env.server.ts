// Server-only Supabase settings.
//
// The project URL and the publishable (anon) key are public by design: they are
// shipped to every browser anyway, and row level security is what protects the
// data. They therefore have committed defaults, so a container that does not
// receive the hosting environment variables still works. Environment variables
// always win, so pointing at another project only needs new values.
//
// The service role key is a secret: it is never committed and only ever read
// from the environment.

const DEFAULT_SUPABASE_URL = 'https://zlecuxghuayagxyjvckg.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_WFKNbvj5eE4ilEhAOSFGyA_72JNRq5i';

export function serverSupabaseUrl(): string {
  const raw =
    process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'] || DEFAULT_SUPABASE_URL;
  return raw.replace(/\/+$/, '');
}

export function serverSupabasePublishableKey(): string {
  return (
    process.env['SUPABASE_PUBLISHABLE_KEY'] ||
    process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
    DEFAULT_SUPABASE_PUBLISHABLE_KEY
  );
}

export function serverSupabaseServiceRoleKey(): string | undefined {
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  return key && key.trim().length > 0 ? key.trim() : undefined;
}
