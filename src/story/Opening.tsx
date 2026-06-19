// 正门：冷开场 → 报名字 → 感知题（竖屏移动优先 · 水墨）
import { useState } from 'react';
import type { LensKey } from './types';
import { OPENING_BEATS } from './data/opening';
import TextReveal from './TextReveal';

const SENSE_OPTIONS: { label: string; hint: string; lens: LensKey }[] = [
  { label: '她的眼睛里有什么', hint: '情绪，那些没说出口的感受', lens: 'F' },
  { label: '她笑着，但笑没到眼睛里', hint: '潜台词，言语背后真正想说的', lens: 'N' },
  { label: '她袖里攥着的那卷东西', hint: '逻辑漏洞，哪里对不上', lens: 'T' },
  { label: '她站的位置和离场方向', hint: '线索脉络，现场信息先整理一遍', lens: 'J' },
];

interface Props {
  onDone: (name: string, lens: LensKey) => void;
}

export default function Opening({ onDone }: Props) {
  const [phase, setPhase] = useState<'cold' | 'name' | 'type'>('cold');
  const [beat, setBeat] = useState(0);
  const [name, setName] = useState('');
  const [lens, setLens] = useState<LensKey | null>(null);

  const current = OPENING_BEATS[beat];
  const isLastBeat = beat >= OPENING_BEATS.length - 1;

  const advance = () => {
    if (isLastBeat) setPhase('name');
    else setBeat((b) => b + 1);
  };

  // ===== 冷开场 =====
  if (phase === 'cold') {
    return (
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950">
        {/* 场景图：每个 beat 独立 key，触发重新淡入 */}
        {current.bg && (
          <img
            key={`bg-${beat}`}
            src={current.bg}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover animate-fade-in-scene ${current.dim ? 'opacity-45' : ''}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/60 to-stone-950/90" />

        {/* 文字区：图片淡入后 600ms 才开始打字 */}
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

  // 接续冷开场最后一拍的同一张省亲夜场景图，亮度逐步从暗到亮，避免黑屏硬切
  const lastBg = OPENING_BEATS[OPENING_BEATS.length - 1].bg;

  // ===== 报名字 =====
  if (phase === 'name') {
    return (
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-6 overflow-hidden bg-stone-950 px-8">
        {lastBg && (
          <img src={lastBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/85 to-stone-950/95" />

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
          className="relative w-full max-w-[260px] rounded border border-stone-600 bg-stone-900/80 px-4 py-3 text-center text-[16px] text-amber-50 outline-none backdrop-blur-sm focus:border-amber-300/70"
        />
        <button
          disabled={!name.trim()}
          onClick={() => setPhase('type')}
          className="relative rounded border border-amber-300/60 px-6 py-2.5 text-[14px] text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          就叫这个名字
        </button>
      </div>
    );
  }

  // ===== 感知题 =====
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950 px-6 py-10">
      {lastBg && (
        <img src={lastBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/80 to-stone-950/95" />

      <p className="relative mb-3 text-center text-[17px] tracking-wide text-stone-100 drop-shadow">
        走进赏戏厅，你第一眼注意到的是——
      </p>
      <p className="relative mb-8 text-center text-[12px] leading-6 text-stone-400 drop-shadow">
        你看人的方式，决定这一路你看见什么、又错过什么。
        <br />
        而结局，会照着你的选择，反过来读你一次。
      </p>

      <div className="relative space-y-3">
        {SENSE_OPTIONS.map((opt) => (
          <button
            key={opt.lens}
            onClick={() => setLens(opt.lens)}
            className={`w-full rounded-md border px-5 py-4 text-left backdrop-blur-sm transition ${
              lens === opt.lens
                ? 'border-amber-300 bg-amber-100/10 text-amber-50'
                : 'border-stone-700 bg-stone-950/40 text-stone-300 hover:border-amber-300/50'
            }`}
          >
            <p className="text-[15px] leading-6">{opt.label}</p>
            {lens === opt.lens && (
              <p className="mt-1 text-[12px] text-amber-200/70">{opt.hint}</p>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1" />
      <button
        disabled={!lens}
        onClick={() => lens && onDone(name.trim(), lens)}
        className="relative mt-8 w-full rounded border border-amber-300/60 py-3 text-[15px] text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        入梦
      </button>
    </div>
  );
}
