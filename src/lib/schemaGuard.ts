// A freshly created Supabase project has no tables until the migration in
// supabase/migrations is applied. Public pages should then render their empty
// states instead of a 500 error page, so reads treat "schema not installed yet"
// as "no rows" and keep every other database error loud.

const MISSING_SCHEMA_CODES = new Set([
  '42P01', // Postgres: relation does not exist
  'PGRST202', // PostgREST: function not found in schema cache
  'PGRST204', // PostgREST: column not found in schema cache
  'PGRST205', // PostgREST: table not found in schema cache
]);

const MISSING_SCHEMA_HINTS = [
  'could not find the table',
  'could not find the function',
  'relation',
  'does not exist',
  'schema cache',
];

type PostgrestLikeError = { code?: string | null; message?: string | null } | null | undefined;

export function isMissingSchema(error: PostgrestLikeError): boolean {
  if (!error) return false;
  if (error.code && MISSING_SCHEMA_CODES.has(error.code)) return true;
  const message = (error.message ?? '').toLowerCase();
  if (!message) return false;
  return MISSING_SCHEMA_HINTS.some((hint) => message.includes(hint));
}

let warned = false;

// Log once per process: repeated warnings would flood the server logs on every render.
export function warnMissingSchemaOnce(error: PostgrestLikeError): void {
  if (warned) return;
  warned = true;
  console.warn(
    '[Supabase] Database schema is not installed yet; rendering empty content.',
    error?.code ?? '',
    error?.message ?? '',
  );
}
