interface Props {
  title: string;
  subtitle?: string;
  variant?: 'scene' | 'chapter';
  className?: string;
}

export default function ScenePlaque({ title, subtitle, variant = 'scene', className = '' }: Props) {
  if (variant === 'chapter') {
    return (
      <div className={`relative z-20 flex justify-center ${className}`.trim()}>
        <div className="inline-flex items-center gap-2 border-l border-r border-amber-200/35 bg-stone-950/24 px-4 py-1.5 font-serif text-[12px] text-amber-200/65 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
          <span>{title}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex max-w-full flex-col border-l-2 border-amber-200/70 bg-stone-950/34 py-1 pl-3 pr-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm ${className}`.trim()}>
      <span className="font-serif text-lg font-bold text-amber-50 drop-shadow">{title}</span>
      {subtitle && (
        <span className="mt-0.5 text-[11px] leading-5 text-stone-300/90 drop-shadow">{subtitle}</span>
      )}
    </div>
  );
}
