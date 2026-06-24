import { playUiSound } from './sound';

interface Props {
  onClick: () => void;
  className?: string;
}

export default function MenuButton({ onClick, className = '' }: Props) {
  const handleClick = () => {
    playUiSound('tap');
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex cursor-pointer items-center rounded-md border border-amber-200/25 bg-stone-950/54 px-3 py-2 text-[12px] tracking-[0.18em] text-amber-100/80 backdrop-blur-sm transition hover:border-amber-200/60 hover:bg-stone-900/72 hover:text-amber-50 ${className}`.trim()}
    >
      开始菜单
    </button>
  );
}
