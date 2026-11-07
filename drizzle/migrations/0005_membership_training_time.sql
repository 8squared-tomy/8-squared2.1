ALTER TABLE public.membership_requests
  ADD COLUMN training_time text CHECK (training_time IS NULL OR training_time IN ('weekday_evenings', 'weekends', 'flexible'));

DROP FUNCTION IF EXISTS public.submit_membership_request(text, text, text, text, text, text, integer, text, text);

CREATE OR REPLACE FUNCTION public.submit_membership_request(
  p_full_name text, p_email text, p_university text, p_phone text, p_level text,
  p_years_playing text, p_fide_rating integer, p_interests text, p_message text, p_training_time text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM check_rate_limit('membership', 10, interval '10 minutes');
  INSERT INTO membership_requests (full_name, email, university, phone, level, years_playing, fide_rating, interests, message, training_time)
  VALUES (btrim(p_full_name), lower(btrim(p_email)), btrim(p_university),
    NULLIF(btrim(COALESCE(p_phone, '')), ''), p_level, NULLIF(btrim(COALESCE(p_years_playing, '')), ''),
    p_fide_rating, NULLIF(btrim(COALESCE(p_interests, '')), ''), NULLIF(btrim(COALESCE(p_message, '')), ''),
    NULLIF(btrim(COALESCE(p_training_time, '')), ''));
END; $$;

REVOKE EXECUTE ON FUNCTION public.submit_membership_request(text, text, text, text, text, text, integer, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_membership_request(text, text, text, text, text, text, integer, text, text, text) TO anon, authenticated;
