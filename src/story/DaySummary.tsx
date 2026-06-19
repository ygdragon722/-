// 通用"日终总结"外壳：分批渐出几句简短总结，结尾给"前往下一天"按钮。
// 不是大段描写，只是把这一天听见/看见的几句话点一下——判词式的大结局只在 Ending.tsx，
// 走完所有天数才出现一次，这里每天都不重复。
import { useState } from 'react';

interface Props {
  tag: string;                 // 顶部小标签，如"悟"
  beats: React.ReactNode[];    // 几条简短总结，逐条渐出
  continueLabel: string;       // "前往第二天 →"
  onContinue: () => void;
}

export default function DaySummary({ tag, beats, continueLabel, onContinue }: Props) {
  const [step, setStep] = useState(0);
  const isDone = step >= beats.length;

  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-[440px] cursor-pointer flex-col bg-stone-950 px-7 py-12"
      onClick={() => !isDone && setStep((s) => s + 1)}
    >
      <p className="mb-8 text-center text-[12px] tracking-[0.4em] text-amber-200/60">{tag}</p>

      <div className="space-y-6">
        {beats.slice(0, step).map((beat, i) => (
          <div key={i} className="animate-fade-in">
            {beat}
          </div>
        ))}
      </div>

      {isDone ? (
        <button
          onClick={onContinue}
          className="mt-9 w-full rounded border border-amber-300/60 py-3 text-[14px] text-amber-100 transition hover:bg-amber-300/10"
        >
          {continueLabel}
        </button>
      ) : (
        <div className="mt-auto pt-10 text-center text-[11px] tracking-widest text-stone-600">
          轻触继续
        </div>
      )}
    </div>
  );
}
