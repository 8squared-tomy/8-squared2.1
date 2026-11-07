import type { ClubEvent } from '@/types/club';

export type EventState = 'open' | 'full' | 'closed' | 'past';

export function getEventState(event: ClubEvent, confirmedCount: number, now: Date = new Date()): EventState {
  const endsAt = new Date(event.ends_at ?? event.starts_at);
  if (endsAt.getTime() < now.getTime()) return 'past';
  if (!event.registration_open) return 'closed';
  if (event.capacity !== null && confirmedCount >= event.capacity) return 'full';
  return 'open';
}

export function seatsLeft(event: ClubEvent, confirmedCount: number): number | null {
  if (event.capacity === null) return null;
  return Math.max(event.capacity - confirmedCount, 0);
}

// Club events are scheduled in Algiers time; render them there instead of the
// visitor's timezone, and force Latin digits for the Arabic locale.
export function formatDateTime(iso: string, language: 'en' | 'ar'): string {
  return new Date(iso).toLocaleString(language === 'ar' ? 'ar-DZ' : 'en-GB', {
    timeZone: 'Africa/Algiers',
    numberingSystem: 'latn',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
