import { useState } from 'react';
import { Download, Mail, Phone } from 'lucide-react';
import { Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { exportMembershipRequests } from '@/lib/admin/members';
import { buildCsv, downloadCsv } from '@/lib/csv';
import { LEVEL_KEYS } from '@/lib/labels';
import { useAsyncData } from '@/lib/useAsyncData';

export function DirectoryPanel() {
  const { t, language } = useLanguage();
  const ar = language === 'ar';
  const directory = useAsyncData(() => exportMembershipRequests(), []);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState<TranslationKey | null>(null);

  const term = search.trim().toLowerCase();
  const people = (directory.data ?? []).filter((row) =>
    term
      ? [row.full_name, row.email, row.university, row.phone ?? '']
          .join(' ')
          .toLowerCase()
          .includes(term)
      : true,
  );

  const handleExport = async () => {
    setExporting(true);
    setActionError(null);
    try {
      const rows = await exportMembershipRequests();
      const csv = buildCsv(rows, [
        { header: t('colName'), value: (row) => row.full_name },
        { header: t('colEmail'), value: (row) => row.email },
        { header: t('colPhone'), value: (row) => row.phone ?? '' },
        { header: t('colUniversity'), value: (row) => row.university },
        { header: t('colLevel'), value: (row) => t(LEVEL_KEYS[row.level]) },
      ]);
      downloadCsv('8squared-directory.csv', csv);
    } catch {
      setActionError('adminActionError');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="eyebrow">{ar ? 'دليل الاتصال' : 'Contact directory'}</p>
          <h2 className="text-2xl">{ar ? 'الأعضاء والطلبات' : 'Members and applicants'}</h2>
          <p className="text-muted">{t('adminRowsTotal', { n: people.length })}</p>
        </div>
        <button type="button" onClick={handleExport} disabled={exporting} className="btn-primary">
          <Download className="h-4 w-4" aria-hidden="true" />
          {exporting ? t('adminExporting') : t('adminExportCsv')}
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="directory-search" className="field-label">
          {t('adminSearch')}
        </label>
        <input
          id="directory-search"
          type="search"
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {actionError && <Notice tone="error">{t(actionError)}</Notice>}
      {directory.error && (
        <Notice tone="error">
          <p>{t('loadError')}</p>
          <button type="button" onClick={directory.reload} className="btn-ghost mt-2 px-0 text-danger">
            {t('retry')}
          </button>
        </Notice>
      )}
      {directory.loading && !directory.data && <p className="text-muted">{t('loading')}</p>}
      {directory.data && people.length === 0 && <p className="text-muted">{t('adminNoRows')}</p>}

      {people.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((row) => (
            <li key={row.id} className="card space-y-2">
              <p className="font-semibold text-ink">{row.full_name}</p>
              <p className="text-sm text-muted">{row.university}</p>
              <p className="text-xs text-muted">{t(LEVEL_KEYS[row.level])}</p>
              <div className="flex flex-col gap-1 pt-2 text-sm">
                <a href={`mailto:${row.email}`} dir="ltr" className="flex items-center gap-2 text-gold underline">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {row.email}
                </a>
                {row.phone && (
                  <a href={`tel:${row.phone}`} dir="ltr" className="flex items-center gap-2 text-gold underline">
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {row.phone}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
