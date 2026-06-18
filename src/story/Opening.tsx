// 正门：冷开场 → 报名字 → 感知题（竖屏移动优先 · 水墨）
import { useState } from 'react';
import type { LensKey } from './types';
import { OPENING_BEATS } from './data/opening';

// 一道感知题：4个选项各自对应一种观察视角，不提 MBTI
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
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[440px] cursor-pointer flex-col overflow-hidden bg-stone-950"
        onClick={advance}
      >
        {current.bg && (
          <img src={current.bg} alt="" className={`absolute inset-0 h-full w-full object-cover ${current.dim ? 'opacity-45' : ''}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/60 to-stone-950/90" />
        <div className="relative flex flex-1 items-center justify-center px-7">
          <p key={beat} className="animate-fade-in whitespace-pre-line text-center text-[16px] leading-9 text-stone-100 drop-shadow">
            {current.text}
          </p>
        </div>
        <div className="relative pb-8 text-center text-[11px] tracking-widest text-stone-500">轻触继续</div>
      </div>
    );
  }

  // ===== 报名字 =====
  if (phase === 'name') {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-6 bg-stone-950 px-8">
        <p className="text-center text-[15px] leading-8 text-stone-300">
          慌乱中，你顺口应下。
          <br />
          可若有人问起——你叫什么名字？
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          placeholder="写下你的名字"
          className="w-full max-w-[260px] rounded border border-stone-600 bg-stone-900 px-4 py-3 text-center text-[16px] text-amber-50 outline-none focus:border-amber-300/70"
        />
        <button
          disabled={!name.trim()}
          onClick={() => setPhase('type')}
          className="rounded border border-amber-300/60 px-6 py-2.5 text-[14px] text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          就叫这个名字
        </button>
      </div>
    );
  }

  // ===== 感知题 =====
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-stone-950 px-6 py-10">
      <p className="mb-3 text-center text-[17px] tracking-wide text-stone-100">
        走进赏戏厅，你第一眼注意到的是——
      </p>
      <p className="mb-8 text-center text-[12px] leading-6 text-stone-500">
        你看人的方式，决定这一路你看见什么、又错过什么。
        <br />
        而结局，会照着你的选择，反过来读你一次。
      </p>

      <div className="space-y-3">
        {SENSE_OPTIONS.map((opt) => (
          <button
            key={opt.lens}
            onClick={() => setLens(opt.lens)}
            className={`w-full rounded-md border px-5 py-4 text-left transition ${
              lens === opt.lens
                ? 'border-amber-300 bg-amber-100/10 text-amber-50'
                : 'border-stone-700 text-stone-300 hover:border-amber-300/50'
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
        className="mt-8 w-full rounded border border-amber-300/60 py-3 text-[15px] text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        入梦
      </button>
    </div>
  );
}
