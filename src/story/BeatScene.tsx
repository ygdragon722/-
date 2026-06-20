// 过场播放器："画面淡入 → 底部字幕框浮现 → 点框翻下一句"。
// 冷开场、每日过渡（丫鬟之死、道德抉择…）都用同一套节奏。
// 字幕一句一句出现，不堆叠、不遮挡画面中央；只有字幕框能点（鼠标移上去会亮），
// 点一下翻一句，不自动切——节奏完全交给玩家。
import { useState, useEffect, useRef } from 'react';

export interface Beat {
  text: string;
  bg?: string;   // 该幕背景图（可空，空＝墨色渐变）
  dim?: boolean; // 是否压暗（用真图但要保住文字可读时用）
}

interface Props {
  beats: Beat[];
  onComplete: () => void; // 最后一拍最后一句翻完、再点一次后触发
  chapterLabel?: string;  // 顶部小标签（如"第二天"），不传则不显示
}

// 把一拍的文字拆成"一句一行"。空行只是排版间隔，字幕式里没意义，去掉。
function linesOf(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter((l) => l !== '');
}

export default function BeatScene({ beats, onComplete, chapterLabel }: Props) {
  const [beat, setBeat] = useState(0);
  const [line, setLine] = useState(0);
  const [ready, setReady] = useState(false); // 这一拍的画面是否已"喘过一口气"、字幕框可以浮现
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = beats[beat];
  const lines = linesOf(current.text);
  const isLastBeat = beat >= beats.length - 1;
  const isLastLine = line >= lines.length - 1;

  // 每翻到新的一拍：先让画面被看见（有图等淡入、无图也留个短呼吸），字幕框才浮现——不抢画面
  useEffect(() => {
    setReady(false);
    const delay = current.bg ? 900 : 350;
    timer.current = setTimeout(() => setReady(true), delay);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [beat, current.bg]);

  // 点字幕框：先把这一拍的句子一句句翻完，再翻到下一拍（换画面），最后触发 onComplete
  const advance = () => {
    if (!ready) return; // 画面还在喘气，先不接点击
    if (!isLastLine) {
      setLine((l) => l + 1);
    } else if (!isLastBeat) {
      setBeat((b) => b + 1);
      setLine(0);
    } else {
      onComplete();
    }
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
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/75" />

      {chapterLabel && (
        <p className="relative pt-8 text-center font-serif text-[12px] tracking-[0.4em] text-amber-200/60">
          {chapterLabel}
        </p>
      )}

      {/* 字幕框：压在画面下方，半透明不糊画面；只有这一块能点，鼠标移上去会亮，点一下翻一句 */}
      <div className="relative mt-auto px-5 pb-10">
        <button
          onClick={advance}
          disabled={!ready}
          className={`group block w-full cursor-pointer rounded-lg border border-white/15 bg-stone-950/55 px-6 py-5 backdrop-blur-md transition-all duration-500 hover:border-amber-200/45 hover:bg-stone-950/70 ${
            ready ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <p
            key={`${beat}-${line}`}
            className="animate-fade-in text-center text-[16px] leading-8 text-stone-50 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
          >
            {lines[line]}
          </p>
          <span className="mt-3 block text-center text-[11px] tracking-[0.3em] text-stone-400 transition group-hover:text-amber-200/70">
            轻触继续 ▽
          </span>
        </button>
      </div>
    </div>
  );
}
