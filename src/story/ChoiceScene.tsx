// 抉择场：二元道德选择（不走读人的信任机制，纯叙事分叉）。
// 设置文字逐行渐显 → 浮现选项 → 选后整段反应 → 继续。用于第三天的玉/女孩两个抉择。
import { useState } from 'react';
import TextReveal from './TextReveal';

interface Choice {
  id: string;
  label: string;
  outcome: string;
}

interface Props {
  tag?: string;          // 顶部小标签，如"抉择"
  bg?: string;           // 可选背景图
  setup: string;         // 抉择前的铺陈（逐行渐显）
  choices: Choice[];
  onChoose: (id: string) => void; // 看完反应、点继续后回报所选
  continueLabel?: string;
}

export default function ChoiceScene({ tag, bg, setup, choices, onChoose, continueLabel = '继续 →' }: Props) {
  const [revealed, setRevealed] = useState(false); // 铺陈读完才出选项
  const [picked, setPicked] = useState<Choice | null>(null);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950">
      {bg && <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover animate-fade-in-scene" />}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/55 to-stone-950/90" />

      <div className="relative flex min-h-screen flex-col px-7 py-12">
        {tag && <p className="mb-8 text-center font-serif text-[12px] tracking-[0.4em] text-amber-200/60">{tag}</p>}

        {!picked ? (
          <>
            {/* 抉择前铺陈：整屏可点，和其余场景的轻触习惯一致 */}
            <TextReveal
              lines={[setup]}
              startDelay={bg ? 1300 : 450}
              className="flex flex-1 flex-col justify-center text-[15px] leading-9 text-stone-200 drop-shadow"
              onComplete={() => setRevealed(true)}
            />
            {/* 选项：铺陈读完才浮现 */}
            <div className={`mt-9 space-y-3 transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPicked(c)}
                  className="block w-full rounded-md border border-white/25 bg-stone-950/50 px-5 py-4 text-left text-[15px] leading-7 text-stone-100 backdrop-blur-sm transition active:scale-[0.99] hover:border-amber-200/70 hover:bg-stone-900/70"
                >
                  {c.label}
                </button>
              ))}
            </div>
            {!revealed && (
              <div className="mt-auto pt-10 text-center text-[11px] tracking-widest text-stone-600">
                轻触继续
              </div>
            )}
          </>
        ) : (
          <>
            {/* 抉择后的反应 */}
            <TextReveal
              key={picked.id}
              lines={[picked.outcome]}
              className="text-[15px] leading-9 text-stone-100 drop-shadow"
            />
            <div className="flex-1" />
            <button
              onClick={() => onChoose(picked.id)}
              className="mt-9 w-full rounded border border-amber-300/60 py-3 text-[14px] text-amber-100 transition hover:bg-amber-300/10"
            >
              {continueLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
