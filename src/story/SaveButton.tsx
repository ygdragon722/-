import { useEffect, useState } from 'react';
import { playUiSound } from './sound';

interface Props {
  onSave: () => void;
  className?: string;
}

export default function SaveButton({ onSave, className = '' }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1100);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const handleClick = () => {
    playUiSound('tap');
    onSave();
    setSaved(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex cursor-pointer items-center rounded-md border border-amber-200/25 bg-stone-950/54 px-3 py-2 text-[12px] tracking-[0.18em] text-amber-100/80 backdrop-blur-sm transition hover:border-amber-200/60 hover:bg-stone-900/72 hover:text-amber-50 ${className}`.trim()}
    >
      {saved ? '已存档' : '存档'}
    </button>
  );
}
