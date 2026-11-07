import { supabase } from '@/lib/supabase';
import { isMissingSchema, warnMissingSchemaOnce } from '@/lib/schemaGuard';
import { registrationSchema } from '@/lib/validation';
import { normalizeEmail } from '@/lib/validation';
import type { TranslationKey } from '@/i18n/translations';
import type { ClubEvent, ChessLevel, ExternalLink, RegistrationStatus, Sponsor, SiteContentEntry, TrainingTime, YearsPlaying } from '@/types/club';

export type ActionResult<T> = { ok: true; data: T } | { ok: false; errorKey: TranslationKey };

export function errorKeyFrom(error: { message?: string } | null): TranslationKey {
  const message = error?.message ?? '';
  if (message.includes('RATE_LIMITED')) return 'errRateLimited';
  if (message.includes('ALREADY_REGISTERED')) return 'errAlreadyRegistered';
  if (message.includes('EVENT_UNAVAILABLE')) return 'errEventUnavailable';
  if (message.includes('INVALID_RESIDENCE')) return 'errResidence';
  if (message.includes('INVALID_BAC_NUMBER')) return 'errBacNumber';
  if (message.includes('INVALID_ACCOMMODATION_PHONE')) return 'errAccommodationPhone';
  return 'errGeneric';
}

export async function fetchPublishedEvents(): Promise<ClubEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('starts_at', { ascending: true })
    .limit(200);
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export async function fetchEventById(id: string): Promise<ClubEvent | null> {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).eq('status', 'published').maybeSingle();
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return null;
    }
    throw error;
  }
  return data;
}

export async function fetchEventSeatCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('get_event_seat_counts');
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return {};
    }
    throw error;
  }
  const rows = (data ?? []) as { event_id: string; confirmed_count: number }[];
  return Object.fromEntries(rows.map((row) => [row.event_id, row.confirmed_count]));
}

export async function fetchEventSponsors(eventId: string): Promise<Sponsor[]> {
  const { data, error } = await supabase
    .from('event_sponsors')
    .select('sponsor:sponsors(*)')
    .eq('event_id', eventId);
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return [];
    }
    throw error;
  }
  return (data ?? []).map((row) => row.sponsor as unknown as Sponsor).filter((sponsor) => sponsor?.is_active);
}

export async function fetchActiveSponsors(): Promise<Sponsor[]> {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(200);
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export async function fetchActiveLinks(): Promise<ExternalLink[]> {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(100);
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return [];
    }
    throw error;
  }
  return data ?? [];
}

let siteContentRequest: Promise<SiteContentEntry[]> | null = null;

// The header and the home page both need site content. Share one request in the
// browser; never cache on the server, where the cache would outlive a request.
export function fetchSiteContent(): Promise<SiteContentEntry[]> {
  if (typeof window === 'undefined') return loadSiteContent();
  if (!siteContentRequest) {
    siteContentRequest = loadSiteContent().catch((error) => {
      siteContentRequest = null;
      throw error;
    });
  }
  return siteContentRequest;
}

// Admin writes must drop the shared browser cache, otherwise the header and the
// home page keep rendering the previous values for the rest of the session.
export function resetSiteContentCache(): void {
  siteContentRequest = null;
}

async function loadSiteContent(): Promise<SiteContentEntry[]> {
  const { data, error } = await supabase.from('site_content').select('key, value_en, value_ar').limit(100);
  if (error) {
    if (isMissingSchema(error)) {
      warnMissingSchemaOnce(error);
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export type MembershipPayload = {
  fullName: string;
  email: string;
  university: string;
  level: ChessLevel;
  yearsPlaying: YearsPlaying;
  trainingTime: TrainingTime;
};

export async function submitMembershipRequest(payload: MembershipPayload): Promise<ActionResult<null>> {
  const { error } = await supabase.rpc('submit_membership_request', {
    p_full_name: payload.fullName.trim(),
    p_email: normalizeEmail(payload.email),
    p_university: payload.university.trim(),
    p_phone: null,
    p_level: payload.level,
    p_years_playing: payload.yearsPlaying,
    p_fide_rating: null,
    p_interests: null,
    p_message: null,
    p_training_time: payload.trainingTime,
  });
  if (error) return { ok: false, errorKey: errorKeyFrom(error) };
  return { ok: true, data: null };
}

export type RegistrationPayload = {
  eventId: string;
  fullName: string;
  email: string;
  university: string;
  phone: string;
  needsAccommodation: boolean;
  residence: string;
  bacRegistrationNumber: string;
};

export async function registerForEvent(payload: RegistrationPayload): Promise<ActionResult<RegistrationStatus>> {
  const parsed = registrationSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, errorKey: 'invalidRequired' };
  const input = parsed.data;
  const { data, error } = await supabase.rpc('register_for_event', {
    p_event_id: payload.eventId,
    p_full_name: input.fullName,
    p_email: normalizeEmail(input.email),
    p_university: input.university,
    p_phone: input.needsAccommodation ? input.phone.trim() : '',
    p_needs_accommodation: input.needsAccommodation,
    p_residence: input.needsAccommodation ? input.residence.trim() : '',
    p_bac_registration_number: input.needsAccommodation ? input.bacRegistrationNumber.trim() : '',
  });
  if (error) return { ok: false, errorKey: errorKeyFrom(error) };
  if (data !== 'confirmed' && data !== 'waitlisted') return { ok: false, errorKey: 'errGeneric' };
  return { ok: true, data };
}
