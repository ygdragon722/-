// 正门：冷开场 → 报名字 → 选型（竖屏移动优先 · 水墨）
import { useState } from 'react';
import type { Mbti } from './types';
import { OPENING_BEATS } from './data/opening';
import { MBTI_LIST } from './data/mbti';
import { lensForMbti } from './engine';

const LENS_DESC: Record<string, string> = {
  N: '你会先看见话里的潜台词',
  F: '你会先察觉对方的情绪',
  T: '你会先抓住言语的逻辑漏洞',
  J: '你会先理出线索的脉络',
};

interface Props {
  onDone: (name: string, mbti: Mbti) => void;
}

export default function Opening({ onDone }: Props) {
  const [phase, setPhase] = useState<'cold' | 'name' | 'type'>('cold');
  const [beat, setBeat] = useState(0);
  const [name, setName] = useState('');
  const [mbti, setMbti] = useState<Mbti | null>(null);

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

  // ===== 选型 =====
  const lens = mbti ? lensForMbti(mbti) : null;
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-stone-950 px-6 py-8">
      <p className="mb-1 text-center text-[15px] text-stone-200">你是怎样一个人？</p>
      <p className="mb-5 text-center text-[12px] leading-6 text-stone-500">
        （这不改变剧情，只决定你<span className="text-stone-300">先看见什么</span>）
      </p>

      <div className="grid grid-cols-4 gap-2">
        {MBTI_LIST.map((m) => (
          <button
            key={m.code}
            onClick={() => setMbti(m.code)}
            className={`flex flex-col items-center rounded-md border px-1 py-2 transition ${
              mbti === m.code
                ? 'border-amber-300 bg-amber-200 text-stone-900'
                : 'border-stone-700 text-stone-300 hover:border-amber-300/60'
            }`}
          >
            <span className="text-[13px] font-bold tracking-wide">{m.code}</span>
            <span className="mt-0.5 text-[10px] opacity-80">{m.name}</span>
          </button>
        ))}
      </div>

      {mbti && lens && (
        <div className="mt-5 rounded-md border border-amber-300/30 bg-amber-100/5 p-3 text-center">
          <p className="text-[13px] leading-6 text-amber-100">{LENS_DESC[lens]}。</p>
        </div>
      )}

      <div className="flex-1" />
      <button
        disabled={!mbti}
        onClick={() => mbti && onDone(name.trim(), mbti)}
        className="mt-6 w-full rounded border border-amber-300/60 py-3 text-[15px] text-amber-100 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        入梦
      </button>
    </div>
  );
}
