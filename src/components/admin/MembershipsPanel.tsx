import { useState, type FormEvent } from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';
import { AdminPager } from '@/components/admin/AdminPager';
import { Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import {
  deleteMembershipRequest,
  exportMembershipRequests,
  listMembershipRequests,
  updateMembershipStatus,
} from '@/lib/admin/members';
import { buildCsv, downloadCsv } from '@/lib/csv';
import { exportPdfTable } from '@/lib/pdf';
import { LEVEL_KEYS, MEMBERSHIP_STATUS_KEYS, YEARS_KEYS } from '@/lib/labels';
import { useAsyncData } from '@/lib/useAsyncData';
import type { MembershipRequest, MembershipStatus, TrainingTime } from '@/types/club';

const STATUSES: MembershipStatus[] = ['new', 'accepted', 'waitlisted', 'rejected'];

const TRAINING_KEYS: Record<TrainingTime, TranslationKey> = {
  weekday_evenings: 'trainingWeekdayEvenings',
  weekends: 'trainingWeekends',
  flexible: 'trainingFlexible',
};

export function MembershipsPanel({ readOnly = false }: { readOnly?: boolean }) {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [status, setStatus] = useState<'all' | MembershipStatus>('all');
  const [actionError, setActionError] = useState<TranslationKey | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const list = useAsyncData(() => listMembershipRequests({ page, search, status }), [page, search, status]);

  const handleSearch = (submit: FormEvent<HTMLFormElement>) => {
    submit.preventDefault();
    setPage(0);
    setSearch(draftSearch);
  };

  const handleStatusChange = async (row: MembershipRequest, next: MembershipStatus) => {
    setBusyId(row.id);
    setActionError(null);
    try {
      await updateMembershipStatus(row.id, next);
      list.reload();
    } catch {
      setActionError('adminActionError');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (row: MembershipRequest) => {
    if (!window.confirm(t('adminDeleteConfirm'))) return;
    setBusyId(row.id);
    setActionError(null);
    try {
      await deleteMembershipRequest(row.id);
      list.reload();
    } catch {
      setActionError('adminActionError');
    } finally {
      setBusyId(null);
    }
  };

  type ExportRow = { header: string; value: (row: MembershipRequest) => string | number };

  const exportColumns = (): ExportRow[] => [
    { header: t('colName'), value: (row: MembershipRequest) => row.full_name },
    { header: t('colEmail'), value: (row: MembershipRequest) => row.email },
    { header: t('colUniversity'), value: (row: MembershipRequest) => row.university },
    { header: t('colPhone'), value: (row: MembershipRequest) => row.phone ?? '' },
    { header: t('colLevel'), value: (row: MembershipRequest) => t(LEVEL_KEYS[row.level]) },
    { header: t('fieldYears'), value: (row: MembershipRequest) => (row.years_playing ? t(YEARS_KEYS[row.years_playing]) : '') },
    { header: t('fieldTrainingTime'), value: (row: MembershipRequest) => (row.training_time ? t(TRAINING_KEYS[row.training_time]) : '') },
    { header: t('colRating'), value: (row: MembershipRequest) => (row.fide_rating === null ? '' : row.fide_rating) },
    { header: t('colInterests'), value: (row: MembershipRequest) => row.interests ?? '' },
    { header: t('colMessage'), value: (row: MembershipRequest) => row.message ?? '' },
    { header: t('colStatus'), value: (row: MembershipRequest) => t(MEMBERSHIP_STATUS_KEYS[row.status]) },
    { header: t('colDate'), value: (row: MembershipRequest) => row.created_at },
  ];

  const handleExport = async () => {
    setExporting(true);
    setActionError(null);
    try {
      const rows = await exportMembershipRequests();
      downloadCsv('8squared-membership-requests.csv', buildCsv(rows, exportColumns()));
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
        filename: '8squared-membership-requests.pdf',
        title: t('adminPdfMembershipsTitle'),
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

  const rows = list.data?.rows ?? [];
  const total = list.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="eyebrow">{t('adminTabRequests')}</p>
          <h2 className="text-2xl">{t('membershipTitle')}</h2>
          <p className="text-muted">{t('adminRowsTotal', { n: total })}</p>
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

      <form onSubmit={handleSearch} role="search" className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="membership-search" className="field-label">
            {t('adminSearch')}
          </label>
          <input
            id="membership-search"
            type="search"
            className="input"
            placeholder={t('searchPlaceholder')}
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="membership-status" className="field-label">
            {t('adminFilterStatus')}
          </label>
          <select
            id="membership-status"
            className="input"
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value as 'all' | MembershipStatus);
            }}
          >
            <option value="all">{t('filterAllStatuses')}</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(MEMBERSHIP_STATUS_KEYS[value])}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-secondary">
          {t('adminSearchButton')}
        </button>
      </form>

      {actionError && <Notice tone="error">{t(actionError)}</Notice>}
      {list.error && (
        <Notice tone="error">
          <p>{t('loadError')}</p>
          <button type="button" onClick={list.reload} className="btn-ghost mt-2 px-0 text-danger">
            {t('retry')}
          </button>
        </Notice>
      )}
      {list.loading && !list.data && <p className="text-muted">{t('loading')}</p>}
      {list.data && rows.length === 0 && <p className="text-muted">{t('adminNoRows')}</p>}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('colName')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('colUniversity')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('colLevel')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('fieldYears')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('fieldTrainingTime')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('colPhone')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('colStatus')}</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">{t('colDate')}</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">{t('adminActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{row.full_name}</div>
                    <div dir="ltr" className="text-muted">{row.email}</div>
                  </td>
                  <td className="px-4 py-3">{row.university}</td>
                  <td className="px-4 py-3">{t(LEVEL_KEYS[row.level])}</td>
                  <td className="px-4 py-3">{row.years_playing ? t(YEARS_KEYS[row.years_playing]) : '—'}</td>
                  <td className="px-4 py-3">{row.training_time ? t(TRAINING_KEYS[row.training_time]) : '—'}</td>
                  <td dir="ltr" className="px-4 py-3 text-start">{row.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`membership-status-${row.id}`}>
                      {t('colStatus')}
                    </label>
                    <select
                      id={`membership-status-${row.id}`}
                      className="input min-h-10 py-1"
                      value={row.status}
                      disabled={readOnly || busyId === row.id}
                      onChange={(e) => handleStatusChange(row, e.target.value as MembershipStatus)}
                    >
                      {STATUSES.map((value) => (
                        <option key={value} value={value}>
                          {t(MEMBERSHIP_STATUS_KEYS[value])}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(row.created_at).toLocaleDateString(language === 'ar' ? 'ar' : 'en-GB')}
                  </td>
                  <td className="px-4 py-3 text-end">
                    {!readOnly && (
                      <button
                        type="button"
                        className="btn-ghost min-h-10 px-3 text-danger"
                        disabled={busyId === row.id}
                        onClick={() => handleDelete(row)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        {t('adminDelete')}
                        <span className="sr-only">: {row.full_name}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && <AdminPager page={page} total={total} onPage={setPage} />}
    </div>
  );
}
