import {
  createContext,
  cloneElement,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { cn } from '@/lib/utils';

type SheetContextValue = { open: boolean; onOpenChange: (open: boolean) => void };
const SheetContext = createContext<SheetContextValue | null>(null);

function useSheet(component: string) {
  const context = useContext(SheetContext);
  if (!context) throw new Error(`${component} must be used inside <Sheet>`);
  return context;
}

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  return <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>;
}

/**
 * The trigger attaches its handler to the child element itself. Wrapping it in a
 * `display: contents` span used to swallow the click in some browsers, which left
 * the page with a locked scroll and no visible menu.
 */
export function SheetTrigger({ children, asChild = false }: { children: ReactNode; asChild?: boolean }) {
  const { open, onOpenChange } = useSheet('SheetTrigger');

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ onClick?: (event: ReactMouseEvent) => void }>;
    return cloneElement(child, {
      onClick: (event: ReactMouseEvent) => {
        child.props.onClick?.(event);
        onOpenChange(!open);
      },
    });
  }

  return (
    <button type="button" onClick={() => onOpenChange(!open)} className="contents">
      {children}
    </button>
  );
}

export function SheetContent({
  side = 'left',
  className,
  children,
}: {
  side?: 'left' | 'right';
  className?: string;
  children: ReactNode;
}) {
  const { open, onOpenChange } = useSheet('SheetContent');
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  /**
   * The panel stays mounted while it slides out, so opening and closing read as
   * one smooth motion instead of an instant swap. CSS owns the timing (see
   * .sheet-panel in styles.css); this only flips the visibility flag.
   */
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      setRendered(true);
      const enter = window.setTimeout(() => {
        setVisible(true);
        const focusable = panel.current?.querySelector<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        focusable?.focus();
      }, 20);
      return () => window.clearTimeout(enter);
    }
    setVisible(false);
    const exit = window.setTimeout(() => setRendered(false), 360);
    return () => window.clearTimeout(exit);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, close]);

  if (!mounted || !rendered) return null;

  // Portalled to <body>: the header uses sticky positioning and previously
  // trapped this fixed overlay inside its own box, so the menu could not paint.
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        className="sheet-backdrop absolute inset-0 bg-black/60"
        data-visible={visible ? 'true' : 'false'}
        aria-hidden="true"
        onClick={close}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        data-side={side}
        data-visible={visible ? 'true' : 'false'}
        className={cn(
          'sheet-panel absolute inset-y-0 flex w-[min(22rem,88vw)] flex-col bg-surface shadow-2xl',
          side === 'right' ? 'end-0' : 'start-0',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function SheetTitle({ className, children }: { className?: string; children: ReactNode }) {
  const id = useId();
  return (
    <h2 id={id} className={cn('text-base font-bold text-ink', className)}>
      {children}
    </h2>
  );
}

export function SheetDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn('text-sm text-muted', className)}>{children}</p>;
}

export function SheetClose({ children }: { children?: ReactNode }) {
  const { onOpenChange } = useSheet('SheetClose');
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className="btn-ghost min-h-11 min-w-11 p-0"
      aria-label={t('closeMenu')}
    >
      {children ?? <X className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
