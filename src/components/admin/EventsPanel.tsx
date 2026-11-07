import { useState } from 'react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { EventEditor } from '@/components/admin/EventEditor';
import { RegistrationsPanel } from '@/components/admin/RegistrationsPanel';
import { Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { deleteEvent, listAdminEvents } from '@/lib/admin/events';
import { formatDateTime } from '@/lib/events';
import { EVENT_STATUS_KEYS } from '@/lib/labels';
import { useAsyncData } from '@/lib/useAsyncData';
import type { ClubEvent } from '@/types/club';

export function EventsPanel({ readOnly = false }: { readOnly?: boolean }) {
  const { t, language, pick } = useLanguage();
  const events = useAsyncData(() => listAdminEvents(), []);
  const [editing, setEditing] = useState<ClubEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [registrationsFor, setRegistrationsFor] = useState<ClubEvent | null>(null);
  const [actionError, setActionError] = useState<TranslationKey | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (registrationsFor) {
    return (
      <RegistrationsPanel
        event={registrationsFor}
        readOnly={readOnly}
        onBack={() => {
          setRegistrationsFor(null);
          events.reload();
        }}
      />
    );
  }

  const handleDelete = async (event: ClubEvent) => {
    if (!window.confirm(t('adminDeleteConfirm'))) return;
    setBusyId(event.id);
    setActionError(null);
    try {
      await deleteEvent(event.id);
      events.reload();
    } catch {
      setActionError('adminActionError');
    } finally {
      setBusyId(null);
    }
  };

  const rows = events.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="eyebrow">{t('adminTabEvents')}</p>
          <h2 className="text-2xl">{t('eventsTitle')}</h2>
          <p className="text-muted">{t('adminRowsTotal', { n: rows.length })}</p>
        </div>
        {!readOnly && (
          <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('eventsAdminNew')}
          </button>
        )}
      </div>

      {actionError && <Notice tone="error">{t(actionError)}</Notice>}
      {events.error && (
        <Notice tone="error">
          <p>{t('loadError')}</p>
          <button type="button" onClick={events.reload} className="btn-ghost mt-2 px-0 text-danger">
            {t('retry')}
          </button>
        </Notice>
      )}
      {events.loading && !events.data && <p className="text-muted">{t('loading')}</p>}
      {events.data && rows.length === 0 && <p className="text-muted">{t('eventsAdminNone')}</p>}

      {rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((event) => (
            <li key={event.id} className="card flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg">{pick(event.title_en, event.title_ar)}</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-muted">
                    {t(EVENT_STATUS_KEYS[event.status])}
                  </span>
                  {event.registration_open && (
                    <span className="rounded-full border border-success px-2 py-0.5 text-xs font-semibold text-success">
                      {t('registrationOpen')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{formatDateTime(event.starts_at, language)}</p>
                <p className="text-sm text-muted">
                  {t('eventCapacity')}: {event.capacity ?? t('eventUnlimited')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={() => setRegistrationsFor(event)}>
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {t('eventsAdminViewRegistrations')}
                </button>
                {!readOnly && (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setEditing(event)}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      {t('adminEdit')}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost text-danger"
                      disabled={busyId === event.id}
                      onClick={() => handleDelete(event)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      {t('adminDelete')}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <EventEditor
          event={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            events.reload();
          }}
        />
      )}
    </div>
  );
}
