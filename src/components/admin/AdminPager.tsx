import { useLanguage } from '@/i18n/LanguageProvider';
import { PAGE_SIZE } from '@/lib/admin/members';

export function AdminPager({ page, total, onPage }: { page: number; total: number; onPage: (page: number) => void }) {
  const { t } = useLanguage();
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" className="btn-secondary" onClick={() => onPage(page - 1)} disabled={page <= 0}>
        {t('adminPrevious')}
      </button>
      <p className="text-sm text-muted">
        {t('adminPageOf', { page: page + 1, total: pages })} · {t('adminRowsTotal', { n: total })}
      </p>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => onPage(page + 1)}
        disabled={page >= pages - 1}
      >
        {t('adminNext')}
      </button>
    </nav>
  );
}
