import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'secondary' | 'danger';
type Size = 'default' | 'sm' | 'lg' | 'icon';

const VARIANTS: Record<Variant, string> = {
  default: 'bg-gold text-on-gold hover:brightness-110',
  outline: 'border border-border bg-surface text-ink hover:border-gold',
  ghost: 'text-ink hover:bg-surface-2',
  secondary: 'bg-surface-2 text-ink hover:border-gold border border-transparent',
  danger: 'border border-danger text-danger hover:bg-surface-2',
};

const SIZES: Record<Size, string> = {
  default: 'min-h-11 px-5 text-sm',
  sm: 'min-h-9 px-3 text-sm',
  lg: 'min-h-12 px-6 text-base',
  icon: 'min-h-11 min-w-11 p-0',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  children?: ReactNode;
};

export function buttonClasses({ variant = 'default', size = 'default', className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({ variant = 'default', size = 'default', asChild = false, className, children, ...rest }: Props) {
  const classes = buttonClasses({ variant, size, className });

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { className: cn(classes, child.props.className) });
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
