import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { SiteLogo } from '@/components/SiteLogo';
import { Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { saveSiteContent } from '@/lib/admin/content';
import { SITE_LOGO_KEY } from '@/lib/useSiteLogo';
import { isSafeImageSource } from '@/lib/validation';

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_EDGE = 256;

/** Shrinks the chosen image to a small PNG data URL so it stays tiny in the settings row. */
async function fileToLogoDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas unavailable');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL('image/png');
}

export function LogoPanel({ savedUrl, onSaved }: { savedUrl: string; onSaved: () => void }) {
  const { t } = useLanguage();
  const fileInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(savedUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<TranslationKey | null>(null);
  const [saving, setSaving] = useState(false);
  const current = preview ?? (isSafeImageSource(savedUrl) ? savedUrl : null);

  const save = async (value: string) => {
    setError(null);
    setSaving(true);
    try {
      await saveSiteContent(SITE_LOGO_KEY, value, '');
      setPreview(null);
      setDraft(value);
      onSaved();
    } catch {
      setError('adminActionError');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draft.trim();
    if (value && !isSafeImageSource(value)) {
      setError('siteLogoInvalid');
      return;
    }
    void save(value);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError('siteLogoBadType');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('siteLogoTooLarge');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      setPreview(dataUrl);
      await save(dataUrl);
    } catch {
      setError('adminActionError');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl">{t('siteLogoTitle')}</h2>
        <p className="text-muted">{t('siteLogoIntro')}</p>
      </div>
      {error && <Notice tone="error">{t(error)}</Notice>}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-surface">
            <SiteLogo url={current} className="h-16 w-16" />
          </div>
          <span className="text-xs text-muted">{current ? t('siteLogoPreview') : t('siteLogoDefault')}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <label htmlFor="site-logo-url" className="field-label">
              {t('sponsorFieldLogo')}
            </label>
            <input
              id="site-logo-url"
              type="url"
              dir="ltr"
              placeholder="https://"
              className="input"
              value={draft.startsWith('data:') ? '' : draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <input
              ref={fileInput}
              id="site-logo-file"
              type="file"
              accept={ACCEPTED.join(',')}
              className="sr-only"
              onChange={(event) => void handleFile(event)}
            />
            <button
              type="button"
              className="btn-secondary"
              disabled={saving}
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {t('siteLogoUpload')}
            </button>
            <p className="field-hint">{t('siteLogoUploadHint')}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        {(savedUrl || preview) && (
          <button
            type="button"
            className="btn-secondary"
            disabled={saving}
            onClick={() => {
              setPreview(null);
              setDraft('');
              void save('');
            }}
          >
            {t('siteLogoReset')}
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? t('adminSaving') : t('adminSave')}
        </button>
      </div>
    </form>
  );
}
