import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, onClose, children }: Props) {
  const { t } = useLanguage();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Read onClose through a ref. Parents pass a new function on every render, and
  // depending on it here would re-run the focus call on each keystroke inside the dialog.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="card max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-b-none focus:outline-none sm:rounded-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('actionClose')}
            className="btn-ghost -me-2 h-11 w-11 shrink-0 px-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
