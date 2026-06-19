// 可复用的"图片淡入 → 文字浮现 → 点击推进"播放器。
// 冷开场、每日过渡（第二天丫鬟之死、第三天道德抉择…）都用同一套节奏，不必每次重写。
import { useState } from 'react';
import TextReveal from './TextReveal';

export interface Beat {
  text: string;
  bg?: string;   // 该幕背景图（可空，空＝墨色渐变）
  dim?: boolean; // 是否压暗（用真图但要保住文字可读时用）
}

interface Props {
  beats: Beat[];
  onComplete: () => void; // 最后一拍播完、再点一次后触发
  chapterLabel?: string;  // 顶部小标签（如"第二天"），不传则不显示
}

export default function BeatScene({ beats, onComplete, chapterLabel }: Props) {
  const [beat, setBeat] = useState(0);
  const current = beats[beat];
  const isLast = beat >= beats.length - 1;

  const advance = () => {
    if (isLast) onComplete();
    else setBeat((b) => b + 1);
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950">
      {current.bg && (
        <img
          key={`bg-${beat}`}
          src={current.bg}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover animate-fade-in-scene ${current.dim ? 'opacity-45' : ''}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/60 to-stone-950/90" />

      {chapterLabel && (
        <p className="relative pt-8 text-center text-[12px] tracking-[0.4em] text-amber-200/60">
          {chapterLabel}
        </p>
      )}

      {/* 文字区：图片淡入后才开始浮现 */}
      <div className="relative flex flex-1 items-center justify-center px-7">
        <TextReveal
          key={beat}
          lines={[current.text]}
          startDelay={current.bg ? 300 : 0}
          className="text-center text-[16px] leading-9 text-stone-100 drop-shadow"
          onComplete={advance}
        />
      </div>

      <div className="relative pb-8 text-center text-[11px] tracking-widest text-stone-500">
        轻触继续
      </div>
    </div>
  );
}
