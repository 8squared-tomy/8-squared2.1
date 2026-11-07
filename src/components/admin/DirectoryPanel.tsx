import { useState } from 'react';
import { Download, FileText, Mail, Phone } from 'lucide-react';
import { Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { exportMembershipRequests } from '@/lib/admin/members';
import { buildCsv, downloadCsv } from '@/lib/csv';
import { exportPdfTable } from '@/lib/pdf';
import { LEVEL_KEYS } from '@/lib/labels';
import type { MembershipRequest } from '@/types/club';
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

  type ExportRow = { header: string; value: (row: MembershipRequest) => string | number };

  const exportColumns = (): ExportRow[] => [
    { header: t('colName'), value: (row: MembershipRequest) => row.full_name },
    { header: t('colEmail'), value: (row: MembershipRequest) => row.email },
    { header: t('colPhone'), value: (row: MembershipRequest) => row.phone ?? '' },
    { header: t('colUniversity'), value: (row: MembershipRequest) => row.university },
    { header: t('colLevel'), value: (row: MembershipRequest) => t(LEVEL_KEYS[row.level]) },
  ];

  const handleExport = async () => {
    setExporting(true);
    setActionError(null);
    try {
      const rows = await exportMembershipRequests();
      downloadCsv('8squared-directory.csv', buildCsv(rows, exportColumns()));
    } catch {
      setActionError('adminActionError');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    setActionError(null);
    try {
      const rows = await exportMembershipRequests();
      exportPdfTable({
        filename: '8squared-directory.pdf',
        title: t('adminPdfDirectoryTitle'),
        subtitle: t('adminPdfSubtitle'),
        columns: exportColumns(),
        rows,
      });
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
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleExport} disabled={exporting} className="btn-secondary">
            <Download className="h-4 w-4" aria-hidden="true" />
            {exporting ? t('adminExporting') : t('adminExportCsv')}
          </button>
          <button type="button" onClick={handleExportPdf} disabled={exporting} className="btn-primary">
            <FileText className="h-4 w-4" aria-hidden="true" />
            {t('adminExportPdf')}
          </button>
        </div>
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
