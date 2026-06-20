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
  const [selecting, setSelecting] = useState<string | null>(null); // 按下但还没真正落定，给一拍犹豫感
  const [picked, setPicked] = useState<Choice | null>(null);

  const handlePick = (c: Choice) => {
    if (selecting) return;
    setSelecting(c.id);
    setTimeout(() => setPicked(c), 550);
  };

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
            {/* 选项：铺陈读完才浮现，两个选项错开节拍出现、隔得更远——这不是导航按钮，是抉择 */}
            <div className={`mt-10 space-y-7 transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {choices.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => handlePick(c)}
                  disabled={!!selecting}
                  style={{ transitionDelay: revealed ? `${i * 250}ms` : '0ms' }}
                  className={`block w-full rounded border px-6 py-6 text-center font-serif text-[16px] leading-8 tracking-[0.05em] backdrop-blur-sm transition-all duration-500 active:scale-[0.98] ${
                    selecting === c.id
                      ? 'scale-[1.02] border-amber-200 bg-amber-100/10 text-amber-50'
                      : selecting
                      ? 'border-white/10 text-stone-500 opacity-40'
                      : 'border-amber-200/30 text-stone-100 hover:border-amber-200/70 hover:bg-amber-100/5'
                  } ${revealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
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
