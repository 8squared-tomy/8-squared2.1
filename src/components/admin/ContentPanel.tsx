import { useState, type FormEvent } from 'react';
import { Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { saveSiteContent } from '@/lib/admin/content';
import { fetchSiteContent } from '@/lib/publicApi';
import { useAsyncData } from '@/lib/useAsyncData';
import type { SiteContentEntry } from '@/types/club';

const LABELS: Record<string, TranslationKey> = {
  hero_title: 'contentHeroTitle',
  hero_subtitle: 'contentHeroSubtitle',
  about_text: 'contentAbout',
};

export function ContentPanel() {
  const { t, language } = useLanguage();
  const ar = language === 'ar';
  const content = useAsyncData(() => fetchSiteContent(), []);
  const [drafts, setDrafts] = useState<Record<string, { valueEn: string; valueAr: string }>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [status, setStatus] = useState<{ key: string; tone: 'success' | 'error' } | null>(null);

  const rows = content.data ?? [];

  const draftFor = (entry: SiteContentEntry) =>
    drafts[entry.key] ?? { valueEn: entry.value_en, valueAr: entry.value_ar };

  const update = (entry: SiteContentEntry, patch: Partial<{ valueEn: string; valueAr: string }>) =>
    setDrafts((current) => ({ ...current, [entry.key]: { ...draftFor(entry), ...patch } }));

  const handleSave = async (entry: SiteContentEntry, submit: FormEvent<HTMLFormElement>) => {
    submit.preventDefault();
    const draft = draftFor(entry);
    setSavingKey(entry.key);
    setStatus(null);
    try {
      await saveSiteContent(entry.key, draft.valueEn.trim(), draft.valueAr.trim());
      setDrafts((current) => {
        const next = { ...current };
        delete next[entry.key];
        return next;
      });
      setStatus({ key: entry.key, tone: 'success' });
      content.reload();
    } catch {
      setStatus({ key: entry.key, tone: 'error' });
    } finally {
      setSavingKey(null);
    }
  };

  if (content.loading && !content.data) return <p className="text-muted">{t('loading')}</p>;
  if (content.error) {
    return (
      <Notice tone="error">
        <p>{t('loadError')}</p>
        <button type="button" onClick={content.reload} className="btn-ghost mt-2 px-0 text-danger">
          {t('retry')}
        </button>
      </Notice>
    );
  }
  if (rows.length === 0) return <p className="text-muted">{t('adminNoRows')}</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">{t('contentSaveHint')}</p>

      {rows.map((entry) => {
        const draft = draftFor(entry);
        const dirty = drafts[entry.key] !== undefined;
        return (
          <form key={entry.key} onSubmit={(submit) => handleSave(entry, submit)} className="card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg">{LABELS[entry.key] ? t(LABELS[entry.key]!) : entry.key}</h2>
              <code className="text-xs text-muted">{entry.key}</code>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={`content-${entry.key}-en`} className="field-label">
                  {t('contentEnglish')}
                </label>
                <textarea
                  id={`content-${entry.key}-en`}
                  dir="ltr"
                  rows={4}
                  className="input"
                  value={draft.valueEn}
                  onChange={(e) => update(entry, { valueEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`content-${entry.key}-ar`} className="field-label">
                  {t('contentArabic')}
                </label>
                <textarea
                  id={`content-${entry.key}-ar`}
                  dir="rtl"
                  rows={4}
                  className="input"
                  value={draft.valueAr}
                  onChange={(e) => update(entry, { valueAr: e.target.value })}
                />
              </div>
            </div>

            {status?.key === entry.key && (
              <Notice tone={status.tone === 'success' ? 'success' : 'error'}>
                {t(status.tone === 'success' ? 'adminSaved' : 'adminActionError')}
              </Notice>
            )}

            <button type="submit" className="btn-primary" disabled={!dirty || savingKey === entry.key}>
              {savingKey === entry.key ? t('adminSaving') : t('adminSave')}
            </button>
          </form>
        );
      })}
    </div>
  );
}
