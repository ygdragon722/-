// 正门：冷开场 → 报名字 → 入梦（竖屏移动优先 · 水墨）
// 不再有"感知题"自我申报：玩家是谁，由全程的读法选择来刻画，结局再反过来读你
import { useState } from 'react';
import { OPENING_BEATS } from './data/opening';
import BeatScene from './BeatScene';
import BackButton from './BackButton';

interface Props {
  onDone: (name: string) => void;
}

export default function Opening({ onDone }: Props) {
  const [phase, setPhase] = useState<'cold' | 'name'>('cold');
  const [name, setName] = useState('');

  // ===== 冷开场 =====
  if (phase === 'cold') {
    return <BeatScene beats={OPENING_BEATS} onComplete={() => setPhase('name')} />;
  }

  // 接续冷开场最近的一张场景图；最后一拍若是暗场，也不要让报名字页忽然掉进纯黑。
  const lastBg = [...OPENING_BEATS].reverse().find((beat) => beat.bg)?.bg;

  // ===== 报名字 → 入梦 =====
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-6 overflow-hidden bg-stone-950 px-8">
      {lastBg && (
        <img src={lastBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/78 to-stone-950/90" />
      <div className="relative z-20 w-full max-w-[260px]">
        <BackButton label="回看开场" onClick={() => setPhase('cold')} />
      </div>

      <p className="relative text-center text-[15px] leading-8 text-stone-300 drop-shadow">
        慌乱中，你顺口应下。
        <br />
        可若有人问起——你叫什么名字？
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={12}
        placeholder="写下你的名字"
        className="relative w-full max-w-[260px] rounded-md border border-stone-600 bg-stone-900/80 px-4 py-3 text-center text-[16px] text-amber-50 outline-none backdrop-blur-sm focus:border-amber-300/70"
      />
      <button
        disabled={!name.trim()}
        onClick={() => onDone(name.trim())}
        className="relative rounded-md border border-amber-300/60 px-6 py-2.5 text-[14px] text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        入梦
      </button>

      <p className="relative mt-2 max-w-[280px] text-center text-[11px] leading-5 text-stone-500 drop-shadow">
        接下来你怎么读这些人，结局会反过来读你一次。
      </p>
    </div>
  );
}
