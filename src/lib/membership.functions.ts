import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

// One applicant = same full name (first + last) and same email. Names are
// compared case- and whitespace-insensitively so "Ahmed  Ali" and "ahmed ali"
// are treated as the same person. Emails are stored lowercase by the
// submit_membership_request RPC, so the lookup normalises the same way.
export function normalizeApplicantName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

const duplicateInput = z.object({
  fullName: z.string().trim().min(2).max(100),
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
    const name = normalizeApplicantName(data.fullName);

    try {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
      const { data: rows, error } = await supabaseAdmin
        .from('membership_requests')
        .select('full_name, status')
        .eq('email', email)
        .neq('status', 'rejected')
        .limit(50);

      if (error) {
        console.error('[membership] duplicate check failed:', error.message);
        return { duplicate: false };
      }

      const duplicate = (rows ?? []).some(
        (row) => normalizeApplicantName(row.full_name ?? '') === name,
      );
      return { duplicate };
    } catch (error) {
      console.error('[membership] duplicate check unavailable:', error);
      return { duplicate: false };
    }
  });
