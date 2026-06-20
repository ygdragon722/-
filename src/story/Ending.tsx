// 全局终极结局：回顾原话 → 判断逻辑 → 反过来读你（三字标题 + 白话引句 + 判词）。
// 这是走完所有天数才触发的唯一终局——判词是给走到最后的人的文学奖励，不在中途提前揭晓。
import { useEffect, useState } from 'react';
import type { ReadKey } from './types';
import { EPILOGUE, GIRL_VERDICT, MORAL_CODA, type JadeChoice, type GirlChoice } from './data/day3';
import { VERDICTS, type Verdict } from './data/verdicts';
import { trackEndingReached } from '../analytics';

interface RecapItem {
  npc: string;
  line?: string;
}

interface Props {
  readKeys: (ReadKey | undefined)[]; // 全程各场用的读法（可能缺）
  recap: RecapItem[];                // 全程各场的玩家原话（供结局原句回放）
  jadeChoice: JadeChoice;
  girlChoice: GirlChoice;
  onRestart: () => void;
}

interface Beat {
  content: React.ReactNode;
}

function pickVerdict(keys: (ReadKey | undefined)[]): Verdict {
  const picked = keys.filter(Boolean) as ReadKey[];
  if (picked.length === 0) return VERDICTS.aloof;

  const directCount = picked.filter((k) => k === 'confront' || k === 'logic').length;
  if (directCount >= 2) return VERDICTS.blunt;

  const count = picked.reduce<Record<string, number>>((a, k) => ((a[k] = (a[k] || 0) + 1), a), {});
  const distinct = Object.keys(count).length;

  if (distinct === 1) {
    if (picked[0] === 'empathy') return VERDICTS.soft;
    if (picked[0] === 'observe') return VERDICTS.watcher;
    return VERDICTS.biased; // 罕见：全程同一种小众读法，归到"偏心眼"
  }
  if (distinct === picked.length && picked.length >= 3) return VERDICTS.chameleon;
  return VERDICTS.biased;
}

export default function Ending({ readKeys, recap, jadeChoice, girlChoice, onRestart }: Props) {
  const [step, setStep] = useState(0);
  const verdict = pickVerdict(readKeys);

  useEffect(() => {
    trackEndingReached(verdict.title);
    // 只在终局首次到达时打一次点，verdict 由 readKeys 派生、本场不会再变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beats: Beat[] = [
    // 0：原句回放——这一路你是怎么走过来的
    {
      content: (
        <div className="space-y-3">
          <p className="mb-2 text-center text-[12px] tracking-[0.3em] text-stone-500">
            这一路，你是这样走过来的
          </p>
          {recap.map((r, i) =>
            r.line ? (
              <div key={i} className="border-l-2 border-stone-600 pl-3">
                <span className="text-[11px] tracking-widest text-stone-500">{r.npc}</span>
                <p className="mt-0.5 text-[14px] leading-7 text-stone-200">{r.line}</p>
              </div>
            ) : null
          )}
        </div>
      ),
    },
    // 1：尾声——随抉择一（玉）变化
    {
      content: (
        <p className="text-center text-[14px] leading-8 text-stone-300">{EPILOGUE[jadeChoice]}</p>
      ),
    },
    // 2：她的判词——随抉择二（女孩）变化
    {
      content:
        girlChoice === 'remember' ? (
          <div className="rounded-md border border-stone-700 bg-stone-900/60 p-5 text-center">
            <p className="mb-3 text-[11px] tracking-[0.3em] text-stone-500">她的判词</p>
            <div className="space-y-1.5">
              {GIRL_VERDICT.map((line, i) => (
                <p key={i} className="text-[15px] leading-8 tracking-wide text-stone-200">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-stone-800 bg-black/40 p-5 text-center">
            <p className="text-[14px] leading-8 text-stone-500">这里，本该有一首判词。</p>
            <p className="text-[14px] leading-8 text-stone-500">可你没有写。</p>
          </div>
        ),
    },
    // 3：判断逻辑——为什么是这个结论
    {
      content: (
        <p className="text-center text-[14px] leading-8 text-stone-300">
          {verdict.logic}
        </p>
      ),
    },
    // 4：反过来读你——三字标题 + 白话引句 + 判词 + 道德定音句
    {
      content: (
        <div className="rounded-md border border-amber-300/40 bg-amber-100/[0.05] p-6 text-center backdrop-blur-sm">
          <p className="mb-1 text-center font-serif text-[12px] tracking-[0.4em] text-amber-200/60">反过来读你</p>
          <p className="mb-4 text-center font-serif text-[22px] font-bold tracking-[0.2em] text-amber-50">{verdict.title}</p>
          <p className="mb-5 text-[14px] leading-7 text-stone-300">{verdict.vernacular}</p>
          <div className="space-y-1.5 border-t border-amber-200/20 pt-5">
            {verdict.poem.map((line, i) => (
              <p key={i} className="font-serif text-[15px] leading-8 tracking-wide text-amber-100">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-5 border-t border-amber-200/20 pt-5 text-[13px] leading-7 text-amber-200/80">
            {MORAL_CODA[girlChoice]}
          </p>
        </div>
      ),
    },
    // 5：结尾 + 按钮
    {
      content: (
        <button
          onClick={onRestart}
          className="mt-5 w-full rounded border border-stone-600 py-3 text-[14px] text-stone-300 transition hover:border-amber-300/60 hover:text-amber-100"
        >
          从头再读一遍
        </button>
      ),
    },
  ];

  const isDone = step >= beats.length;

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full max-w-[440px] cursor-pointer flex-col overflow-hidden bg-stone-950 px-7 py-12"
      onClick={() => !isDone && setStep((s) => s + 1)}
    >
      <img
        src="./assets/scenes/ending-mirror-moon.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover animate-fade-in-scene"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/55 to-stone-950/90" />

      <p className="relative mb-8 text-center font-serif text-[12px] tracking-[0.4em] text-amber-200/60">终局</p>

      <div className="relative space-y-6">
        {beats.slice(0, step).map((beat, i) => (
          <div key={i} className="animate-fade-in">
            {beat.content}
          </div>
        ))}
      </div>

      {!isDone && (
        <div className="relative mt-auto pt-10 text-center text-[11px] tracking-widest text-stone-300/80">
          轻触继续
        </div>
      )}
    </div>
  );
}
