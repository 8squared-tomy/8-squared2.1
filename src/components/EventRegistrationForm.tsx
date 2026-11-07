import { useId, useState, type FormEvent } from 'react';
import { FormField, Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import type { EventState } from '@/lib/events';
import type { RegistrationStatus } from '@/types/club';
import { registerForEvent } from '@/lib/publicApi';
import { normalizeEmail, validateEventRegistration, type EventRegistrationInput, type FieldErrors } from '@/lib/validation';

const EMPTY: EventRegistrationInput = {
  firstName: '',
  lastName: '',
  email: '',
  university: '',
  needsAccommodation: false,
  residence: '',
  bacRegistrationNumber: '',
  phone: '',
};

export function EventRegistrationForm({
  eventId,
  state,
  onRegistered,
}: {
  eventId: string;
  state: EventState;
  onRegistered?: () => void;
}) {
  const { t } = useLanguage();
  const uid = useId();
  const [form, setForm] = useState<EventRegistrationInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof EventRegistrationInput>>({});
  const [serverError, setServerError] = useState<TranslationKey | null>(null);
  const [result, setResult] = useState<RegistrationStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (state === 'past' || state === 'closed') {
    return <p className="text-muted">{t(state === 'past' ? 'eventPast' : 'eventClosed')}</p>;
  }

  const update = (patch: Partial<EventRegistrationInput>) => setForm((current) => ({ ...current, ...patch }));
  const id = (field: string) => `${uid}-${field}`;

  const handleSubmit = async (submit: FormEvent<HTMLFormElement>) => {
    submit.preventDefault();
    const found = validateEventRegistration(form);
    setErrors(found);
    setServerError(null);
    setResult(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const response = await registerForEvent({
        eventId,
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: normalizeEmail(form.email),
        university: form.university.trim(),
        phone: form.phone.trim(),
        needsAccommodation: form.needsAccommodation,
        residence: form.residence.trim(),
        bacRegistrationNumber: form.bacRegistrationNumber.trim(),
      });
      if (!response.ok) {
        setServerError(response.errorKey);
        return;
      }
      setResult(response.data);
      setForm(EMPTY);
      onRegistered?.();
    } catch {
      setServerError('errGeneric');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {result && <Notice tone="success">{t(result === 'confirmed' ? 'eventRegisterSuccess' : 'eventWaitlistSuccess')}</Notice>}
      {serverError && <Notice tone="error">{t(serverError)}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={t('fieldFirstName')} htmlFor={id('first')} required error={errors.firstName && t(errors.firstName)}>
          <input
            id={id('first')}
            className="input"
            value={form.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            autoComplete="given-name"
            required
          />
        </FormField>
        <FormField label={t('fieldLastName')} htmlFor={id('last')} required error={errors.lastName && t(errors.lastName)}>
          <input
            id={id('last')}
            className="input"
            value={form.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            autoComplete="family-name"
            required
          />
        </FormField>
      </div>

      <FormField label={t('fieldEmail')} htmlFor={id('email')} required error={errors.email && t(errors.email)}>
        <input
          id={id('email')}
          type="email"
          dir="ltr"
          className="input"
          value={form.email}
          onChange={(e) => update({ email: e.target.value })}
          autoComplete="email"
          required
        />
      </FormField>

      <FormField label={t('fieldUniversity')} htmlFor={id('university')} required error={errors.university && t(errors.university)}>
        <input
          id={id('university')}
          className="input"
          value={form.university}
          onChange={(e) => update({ university: e.target.value })}
          required
        />
      </FormField>

      <fieldset className="space-y-2">
        <legend className="field-label">{t('colAccommodation')}</legend>
        <div className="flex gap-2">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={form.needsAccommodation === value}
              onClick={() => update({ needsAccommodation: value })}
              className={`min-h-11 flex-1 rounded-md border px-3 text-sm font-semibold transition-colors ${
                form.needsAccommodation === value
                  ? 'border-gold bg-gold text-on-gold'
                  : 'border-border bg-surface text-ink hover:border-gold'
              }`}
            >
              {t(value ? 'answerYes' : 'answerNo')}
            </button>
          ))}
        </div>
      </fieldset>

      {form.needsAccommodation && (
        <div className="space-y-4 rounded-lg border border-border bg-surface-2 p-4">
          <FormField label={t('fieldResidence')} htmlFor={id('residence')} required error={errors.residence && t(errors.residence)}>
            <input
              id={id('residence')}
              className="input"
              value={form.residence}
              onChange={(e) => update({ residence: e.target.value })}
              required
            />
          </FormField>
          <FormField
            label={t('fieldBacNumber')}
            htmlFor={id('bac')}
            required
            error={errors.bacRegistrationNumber && t(errors.bacRegistrationNumber)}
          >
            <input
              id={id('bac')}
              inputMode="numeric"
              dir="ltr"
              className="input"
              value={form.bacRegistrationNumber}
              onChange={(e) => update({ bacRegistrationNumber: e.target.value })}
              required
            />
          </FormField>
          <FormField
            label={t('fieldPhone')}
            htmlFor={id('phone')}
            required
            error={errors.phone && t(errors.phone)}
          >
            <input
              id={id('phone')}
              type="tel"
              dir="ltr"
              className="input"
              value={form.phone}
              onChange={(e) => update({ phone: e.target.value })}
              autoComplete="tel"
              required
            />
          </FormField>
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? t('loading') : t(state === 'full' ? 'eventWaitlistButton' : 'eventRegisterButton')}
      </button>
    </form>
  );
}
