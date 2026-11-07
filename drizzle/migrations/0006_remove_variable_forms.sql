-- Removes the configurable (variable) form feature. Table data is kept so nothing
-- is lost by accident; drop the tables manually after a backup if they are no longer needed.

DROP FUNCTION IF EXISTS public.submit_club_form(uuid, integer, jsonb);
DROP TRIGGER IF EXISTS validate_club_form ON public.club_forms;
DROP FUNCTION IF EXISTS public.validate_club_form();

REVOKE ALL ON public.club_forms FROM anon, authenticated;
REVOKE ALL ON public.form_submissions FROM anon, authenticated;
