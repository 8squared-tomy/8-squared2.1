import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { LinkEditor } from '@/components/admin/LinkEditor';
import { Modal } from '@/components/Modal';
import { FormField, Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import {
  deleteLink,
  deleteSponsor,
  listAdminLinks,
  listAdminSponsors,
  saveSponsor,
  type SponsorDraft,
} from '@/lib/admin/events';
import { isSafeHttpsUrl } from '@/lib/validation';
import { useAsyncData } from '@/lib/useAsyncData';
import type { ExternalLink, Sponsor } from '@/types/club';

const EMPTY_SPONSOR: SponsorDraft = {
  name: '',
  descriptionEn: '',
  descriptionAr: '',
  logoUrl: '',
  websiteUrl: '',
  sortOrder: 0,
  isActive: true,
};

export function PartnersPanel() {
  const { t, language, pick } = useLanguage();
  const ar = language === 'ar';
  const sponsors = useAsyncData(() => listAdminSponsors(), []);
  const links = useAsyncData(() => listAdminLinks(), []);
  const [sponsorForm, setSponsorForm] = useState<{ id: string | null; draft: SponsorDraft } | null>(null);
  const [linkForm, setLinkForm] = useState<{ id: string | null; link: ExternalLink | null } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<TranslationKey | null>(null);
  const [saving, setSaving] = useState(false);

  const openSponsor = (sponsor: Sponsor | null) =>
    setSponsorForm({
      id: sponsor?.id ?? null,
      draft: sponsor
        ? {
            name: sponsor.name,
            descriptionEn: sponsor.description_en ?? '',
            descriptionAr: sponsor.description_ar ?? '',
            logoUrl: sponsor.logo_url ?? '',
            websiteUrl: sponsor.website_url ?? '',
            sortOrder: sponsor.sort_order,
            isActive: sponsor.is_active,
          }
        : EMPTY_SPONSOR,
    });

  const handleSponsorSave = async (submit: FormEvent<HTMLFormElement>) => {
    submit.preventDefault();
    if (!sponsorForm) return;
    const draft = sponsorForm.draft;
    if (!draft.name.trim()) {
      setFormError(ar ? 'اسم الراعي مطلوب.' : 'Sponsor name is required.');
      return;
    }
    if (draft.logoUrl.trim() && !isSafeHttpsUrl(draft.logoUrl.trim())) {
      setFormError(t('siteLogoInvalid'));
      return;
    }
    if (draft.websiteUrl.trim() && !isSafeHttpsUrl(draft.websiteUrl.trim())) {
      setFormError(ar ? 'أدخل رابطاً صحيحاً يبدأ بـ https.' : 'Enter a valid https web address.');
      return;
    }
    setSaving(true);
    setFormError(null);
    setActionError(null);
    try {
      await saveSponsor({ ...draft, name: draft.name.trim(), logoUrl: draft.logoUrl.trim(), websiteUrl: draft.websiteUrl.trim() }, sponsorForm.id);
      setSponsorForm(null);
      sponsors.reload();
    } catch {
      setActionError('adminActionError');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSponsor = async (sponsor: Sponsor) => {
    if (!window.confirm(t('adminDeleteConfirm'))) return;
    setActionError(null);
    try {
      await deleteSponsor(sponsor.id);
      sponsors.reload();
    } catch {
      setActionError('adminActionError');
    }
  };

  const handleDeleteLink = async (link: ExternalLink) => {
    if (!window.confirm(t('adminDeleteConfirm'))) return;
    setActionError(null);
    try {
      await deleteLink(link.id);
      links.reload();
    } catch {
      setActionError('adminActionError');
    }
  };

  const renderError = (error: unknown, reload: () => void) =>
    error ? (
      <Notice tone="error">
        <p>{t('loadError')}</p>
        <button type="button" onClick={reload} className="btn-ghost mt-2 px-0 text-danger">
          {t('retry')}
        </button>
      </Notice>
    ) : null;

  return (
    <div className="space-y-8">
      {actionError && <Notice tone="error">{t(actionError)}</Notice>}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="eyebrow">{t('adminTabSponsors')}</p>
            <h2 className="text-2xl">{t('sponsorsTitle')}</h2>
          </div>
          <button type="button" className="btn-primary" onClick={() => openSponsor(null)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {ar ? 'راعٍ جديد' : 'New sponsor'}
          </button>
        </div>

        {renderError(sponsors.error, sponsors.reload)}
        {sponsors.loading && !sponsors.data && <p className="text-muted">{t('loading')}</p>}
        {sponsors.data && sponsors.data.length === 0 && <p className="text-muted">{t('adminNoRows')}</p>}

        {sponsors.data && sponsors.data.length > 0 && (
          <ul className="space-y-3">
            {sponsors.data.map((sponsor) => (
              <li key={sponsor.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {sponsor.logo_url && (
                    <img src={sponsor.logo_url} alt="" className="h-10 w-10 rounded object-contain" />
                  )}
                  <div>
                    <p className="font-semibold text-ink">{sponsor.name}</p>
                    <p className="text-sm text-muted">
                      {pick(sponsor.description_en, sponsor.description_ar) || '—'}
                    </p>
                    <p className="text-xs text-muted">
                      {t('adminSortOrder')}: {sponsor.sort_order} ·{' '}
                      {sponsor.is_active ? t('registrationOpen') : t('registrationClosed')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary" onClick={() => openSponsor(sponsor)}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {t('adminEdit')}
                  </button>
                  <button type="button" className="btn-ghost text-danger" onClick={() => handleDeleteSponsor(sponsor)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {t('adminDelete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="eyebrow">{t('adminTabSponsors')}</p>
            <h2 className="text-2xl">{t('linksTitle')}</h2>
            <p className="text-sm text-muted">{t('linksIntro')}</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setLinkForm({ id: null, link: null })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {ar ? 'رابط جديد' : 'New link'}
          </button>
        </div>

        {renderError(links.error, links.reload)}
        {links.loading && !links.data && <p className="text-muted">{t('loading')}</p>}
        {links.data && links.data.length === 0 && <p className="text-muted">{t('adminNoRows')}</p>}

        {links.data && links.data.length > 0 && (
          <ul className="space-y-3">
            {links.data.map((link) => (
              <li key={link.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">{pick(link.label_en, link.label_ar)}</p>
                  <a href={link.url} target="_blank" rel="noreferrer noopener" dir="ltr" className="text-sm text-gold underline">
                    {link.url}
                  </a>
                  <p className="text-xs text-muted">
                    {t('adminSortOrder')}: {link.sort_order} ·{' '}
                    {link.is_active ? t('registrationOpen') : t('registrationClosed')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary" onClick={() => setLinkForm({ id: link.id, link })}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {t('adminEdit')}
                  </button>
                  <button type="button" className="btn-ghost text-danger" onClick={() => handleDeleteLink(link)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {t('adminDelete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {sponsorForm && (
        <Modal title={sponsorForm.id ? t('adminEdit') : ar ? 'راعٍ جديد' : 'New sponsor'} onClose={() => setSponsorForm(null)}>
          <form onSubmit={handleSponsorSave} className="space-y-4">
            {formError && <Notice tone="error">{formError}</Notice>}
            <FormField label={t('colName')} htmlFor="sponsor-name" required>
              <input
                id="sponsor-name"
                className="input"
                value={sponsorForm.draft.name}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, draft: { ...sponsorForm.draft, name: e.target.value } })
                }
                required
              />
            </FormField>
            <FormField label={t('contentEnglish')} htmlFor="sponsor-desc-en">
              <textarea
                id="sponsor-desc-en"
                rows={2}
                dir="ltr"
                className="input"
                value={sponsorForm.draft.descriptionEn}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, draft: { ...sponsorForm.draft, descriptionEn: e.target.value } })
                }
              />
            </FormField>
            <FormField label={t('contentArabic')} htmlFor="sponsor-desc-ar">
              <textarea
                id="sponsor-desc-ar"
                rows={2}
                dir="rtl"
                className="input"
                value={sponsorForm.draft.descriptionAr}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, draft: { ...sponsorForm.draft, descriptionAr: e.target.value } })
                }
              />
            </FormField>
            <FormField label={ar ? 'رابط الشعار (https)' : 'Logo URL (https)'} htmlFor="sponsor-logo">
              <input
                id="sponsor-logo"
                type="url"
                dir="ltr"
                className="input"
                value={sponsorForm.draft.logoUrl}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, draft: { ...sponsorForm.draft, logoUrl: e.target.value } })
                }
              />
            </FormField>
            <FormField label={ar ? 'رابط الموقع (https)' : 'Website URL (https)'} htmlFor="sponsor-website">
              <input
                id="sponsor-website"
                type="url"
                dir="ltr"
                className="input"
                value={sponsorForm.draft.websiteUrl}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, draft: { ...sponsorForm.draft, websiteUrl: e.target.value } })
                }
              />
            </FormField>
            <div className="flex flex-wrap items-end gap-4">
              <FormField label={t('adminSortOrder')} htmlFor="sponsor-order">
                <input
                  id="sponsor-order"
                  type="number"
                  min={0}
                  className="input"
                  value={sponsorForm.draft.sortOrder}
                  onChange={(e) =>
                    setSponsorForm({
                      ...sponsorForm,
                      draft: { ...sponsorForm.draft, sortOrder: Number(e.target.value) || 0 },
                    })
                  }
                />
              </FormField>
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={sponsorForm.draft.isActive}
                  onChange={(e) =>
                    setSponsorForm({ ...sponsorForm, draft: { ...sponsorForm.draft, isActive: e.target.checked } })
                  }
                />
                {ar ? 'ظاهر على الموقع' : 'Visible on the site'}
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? t('adminSaving') : t('adminSave')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setSponsorForm(null)}>
                {t('adminCancel')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {linkForm && (
        <LinkEditor
          link={linkForm.link}
          onClose={() => setLinkForm(null)}
          onSaved={() => {
            setLinkForm(null);
            links.reload();
          }}
        />
      )}
    </div>
  );
}
