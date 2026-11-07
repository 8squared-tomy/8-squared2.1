import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField, Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { submitMembershipRequest } from '@/lib/publicApi';
import { LEVELS, TRAINING_TIMES, YEARS, validateMembership, type MembershipInput, type FieldErrors } from '@/lib/validation';
import type { ChessLevel, TrainingTime, YearsPlaying } from '@/types/club';

const EMPTY: MembershipInput = {
  firstName: '',
  lastName: '',
  email: '',
  university: '',
  level: '',
  yearsPlaying: '',
  trainingTime: '',
};

const LEVEL_KEYS: Record<ChessLevel, TranslationKey> = {
  beginner: 'levelBeginner',
  intermediate: 'levelIntermediate',
  advanced: 'levelAdvanced',
  expert: 'levelExpert',
};
const YEARS_KEYS: Record<YearsPlaying, TranslationKey> = {
  under_1: 'yearsUnder1',
  '1_3': 'years1to3',
  '3_5': 'years3to5',
  over_5: 'yearsOver5',
};
const TRAINING_KEYS: Record<TrainingTime, TranslationKey> = {
  weekday_evenings: 'trainingWeekdayEvenings',
  weekends: 'trainingWeekends',
  flexible: 'trainingFlexible',
};

export function MembershipForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<MembershipInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof MembershipInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<TranslationKey | null>(null);
  const [sent, setSent] = useState(false);

  const set = (field: keyof MembershipInput) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateMembership(form);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`mem-${firstError}`)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);
    const outcome = await submitMembershipRequest({
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email,
      university: form.university,
      level: form.level as ChessLevel,
      yearsPlaying: form.yearsPlaying as YearsPlaying,
      trainingTime: form.trainingTime as TrainingTime,
    });
    setSubmitting(false);

    if (outcome.ok) {
      setSent(true);
      setForm(EMPTY);
    } else {
      setServerError(outcome.errorKey);
    }
  };

  if (sent) {
    return (
      <div role="status" className="card flex flex-col items-start gap-4">
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="text-2xl">{t('membershipSentTitle')}</h3>
        <p className="text-muted">{t('membershipSentBody')}</p>
      </div>
    );
  }

  const selectClass = 'input';

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {serverError && <Notice tone="error">{t(serverError)}</Notice>}

      <FormField label={t('fieldFirstName')} htmlFor="mem-firstName" required error={errors.firstName && t(errors.firstName)}>
        <input id="mem-firstName" name="firstName" autoComplete="given-name" maxLength={40} required className="input"
          value={form.firstName} onChange={(e) => set('firstName')(e.target.value)} aria-invalid={Boolean(errors.firstName)} />
      </FormField>

      <FormField label={t('fieldLastName')} htmlFor="mem-lastName" required error={errors.lastName && t(errors.lastName)}>
        <input id="mem-lastName" name="lastName" autoComplete="family-name" maxLength={40} required className="input"
          value={form.lastName} onChange={(e) => set('lastName')(e.target.value)} aria-invalid={Boolean(errors.lastName)} />
      </FormField>

      <FormField label={t('fieldUniversity')} htmlFor="mem-university" required error={errors.university && t(errors.university)}>
        <input id="mem-university" name="university" autoComplete="organization" maxLength={120} required className="input"
          value={form.university} onChange={(e) => set('university')(e.target.value)} aria-invalid={Boolean(errors.university)} />
      </FormField>

      <FormField label={t('fieldEmail')} htmlFor="mem-email" required error={errors.email && t(errors.email)}>
        <input id="mem-email" name="email" type="email" autoComplete="email" inputMode="email" dir="ltr" maxLength={254} required className="input"
          value={form.email} onChange={(e) => set('email')(e.target.value)} aria-invalid={Boolean(errors.email)} />
      </FormField>

      <FormField label={t('fieldLevel')} htmlFor="mem-level" required error={errors.level && t(errors.level)}>
        <select id="mem-level" name="level" required className={selectClass} value={form.level} onChange={(e) => set('level')(e.target.value)} aria-invalid={Boolean(errors.level)}>
          <option value="">{t('chooseOne')}</option>
          {LEVELS.map((level) => <option key={level} value={level}>{t(LEVEL_KEYS[level])}</option>)}
        </select>
      </FormField>

      <FormField label={t('fieldYears')} htmlFor="mem-yearsPlaying" required error={errors.yearsPlaying && t(errors.yearsPlaying)}>
        <select id="mem-yearsPlaying" name="yearsPlaying" required className={selectClass} value={form.yearsPlaying} onChange={(e) => set('yearsPlaying')(e.target.value)} aria-invalid={Boolean(errors.yearsPlaying)}>
          <option value="">{t('chooseOne')}</option>
          {YEARS.map((years) => <option key={years} value={years}>{t(YEARS_KEYS[years])}</option>)}
        </select>
      </FormField>

      <FormField label={t('fieldTrainingTime')} htmlFor="mem-trainingTime" required error={errors.trainingTime && t(errors.trainingTime)}>
        <select id="mem-trainingTime" name="trainingTime" required className={selectClass} value={form.trainingTime} onChange={(e) => set('trainingTime')(e.target.value)} aria-invalid={Boolean(errors.trainingTime)}>
          <option value="">{t('chooseOne')}</option>
          {TRAINING_TIMES.map((time) => <option key={time} value={time}>{t(TRAINING_KEYS[time])}</option>)}
        </select>
      </FormField>

      <Button type="submit" className="btn-primary h-auto min-h-11 w-full" disabled={submitting}>
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
