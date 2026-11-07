import { CalendarDays, MapPin } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { formatDateTime, getEventState, seatsLeft, type EventState } from '@/lib/events';
import type { ClubEvent } from '@/types/club';

const STATE_LABEL: Record<EventState, TranslationKey> = {
  open: 'registrationOpenLabel',
  full: 'eventFull',
  closed: 'eventClosed',
  past: 'eventPast',
};

const STATE_CLASS: Record<EventState, string> = {
  open: 'border-success text-success',
  full: 'border-danger text-danger',
  closed: 'border-border text-muted',
  past: 'border-border text-muted',
};

export function EventStateBadge({ state, seats }: { state: EventState; seats: number | null }) {
  const { t } = useLanguage();
  const label =
    state === 'open'
      ? seats === null
        ? t('eventUnlimited')
        : t('eventSeatsLeft', { n: seats })
      : t(STATE_LABEL[state]);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATE_CLASS[state]}`}
    >
      {label}
    </span>
  );
}

export function EventCard({ event, confirmedCount }: { event: ClubEvent; confirmedCount: number }) {
  const { t, pick, language } = useLanguage();
  const state = getEventState(event, confirmedCount);
  const title = pick(event.title_en, event.title_ar);
  const location = pick(event.location_en, event.location_ar);
  const seats = seatsLeft(event, confirmedCount);

  return (
    <article className="card flex h-full flex-col gap-4">
      <div className="space-y-3">
        <EventStateBadge state={state} seats={seats} />
        <h3 className="text-xl">
          <a href={`/events/${event.id}`} className="hover:text-gold">
            {title}
          </a>
        </h3>
      </div>

      <ul className="space-y-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          <span>{formatDateTime(event.starts_at, language)}</span>
        </li>
        {location && (
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <span>{location}</span>
          </li>
        )}
      </ul>

      <a href={`/events/${event.id}`} className="btn-secondary mt-auto justify-center">
        {t('eventRegisterTitle')}
      </a>
    </article>
  );
}
