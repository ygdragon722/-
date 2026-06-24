import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const base =
  'cursor-pointer rounded-md border backdrop-blur-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'border-amber-300/60 bg-stone-950/45 text-amber-100 shadow-[0_12px_34px_rgba(0,0,0,0.32)] hover:border-amber-200/85 hover:bg-amber-300/10 hover:text-amber-50',
  secondary:
    'border-white/20 bg-stone-950/50 text-stone-100 shadow-[0_12px_34px_rgba(0,0,0,0.32)] hover:border-amber-200/65 hover:bg-stone-900/70 hover:text-amber-50',
  quiet:
    'border-white/15 bg-stone-950/35 text-stone-400 hover:border-amber-200/35 hover:text-stone-200',
  ghost:
    'border-transparent bg-transparent text-stone-500 hover:text-amber-100/75',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[12px]',
  md: 'px-5 py-3 text-[14px]',
  lg: 'px-6 py-6 text-[16px]',
};

export default function VNButton({
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: Props) {
  return (
    <button
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
