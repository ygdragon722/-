interface Props {
  label?: string;
  onClick: () => void;
  className?: string;
}

export default function BackButton({ label = '回退', onClick, className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border border-white/20 bg-stone-950/60 px-3 py-2 text-[12px] tracking-[0.2em] text-stone-200 backdrop-blur-sm transition hover:border-amber-200/50 hover:text-amber-100 ${className}`.trim()}
    >
      <span aria-hidden="true">‹</span>
      <span>{label}</span>
    </button>
  );
}
