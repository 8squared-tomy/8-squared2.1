import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

// One applicant = one email. A previous application with the same email blocks
// a new one even when the name (or anything else) is changed, so the same
// person cannot submit repeatedly by editing the name field. Emails are stored
// lowercase by the submit_membership_request RPC, so the lookup normalises the
// same way.
const duplicateInput = z.object({
  email: z.string().trim().min(5).max(254),
});

export type DuplicateCheck = { duplicate: boolean };

// Runs with the service role key because `anon` cannot read membership_requests
// (RLS). A failed lookup never blocks a real applicant: it returns
// { duplicate: false } so the form still submits.
export const checkMembershipDuplicate = createServerFn({ method: 'POST' })
  .inputValidator(duplicateInput)
  .handler(async ({ data }): Promise<DuplicateCheck> => {
    const email = data.email.trim().toLowerCase();

    try {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
      const { data: rows, error } = await supabaseAdmin
        .from('membership_requests')
        .select('status')
        .eq('email', email)
        .neq('status', 'rejected')
        .limit(1);

      if (error) {
        console.error('[membership] duplicate check failed:', error.message);
        return { duplicate: false };
      }

      return { duplicate: (rows ?? []).length > 0 };
    } catch (error) {
      console.error('[membership] duplicate check unavailable:', error);
      return { duplicate: false };
    }
  });
