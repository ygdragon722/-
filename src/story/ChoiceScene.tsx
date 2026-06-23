// 抉择场：二元道德选择（不走读人的信任机制，纯叙事分叉）。
// 铺陈走字幕框（点一句翻一句）→ 读完框消失、浮现 2 个抉择 →
// 选后反应也走字幕框 → 读完出"继续"。用于第三天的玉/女孩两个抉择。
import { useState } from 'react';
import SubtitleBox from './SubtitleBox';
import { useArm } from './useArm';
import BackButton from './BackButton';

interface Choice {
  id: string;
  label: string;
  outcome: string;
}

interface Props {
  tag?: string;          // 顶部小标签，如"抉择一 · 玉"
  bg?: string;           // 可选背景图
  setup: string;         // 抉择前的铺陈
  choices: Choice[];
  onChoose: (id: string) => void; // 看完反应、点继续后回报所选
  continueLabel?: string;
  onBack?: () => void;
}

export default function ChoiceScene({ tag, bg, setup, choices, onChoose, continueLabel = '继续 →', onBack }: Props) {
  const [setupDone, setSetupDone] = useState(false);              // 铺陈读完 → 出抉择
  const [selecting, setSelecting] = useState<string | null>(null); // 按下但还没落定，给一拍犹豫感
  const [picked, setPicked] = useState<Choice | null>(null);
  const [reactDone, setReactDone] = useState(false);             // 反应读完 → 出继续
  const choicesArmed = useArm(setupDone && !picked); // 抉择刚出现时先不接点击，防误触
  const continueArmed = useArm(reactDone);

  const handlePick = (c: Choice) => {
    if (selecting) return;
    setSelecting(c.id);
    setTimeout(() => setPicked(c), 550);
  };

  const goBack = () => {
    if (picked && reactDone) {
      setReactDone(false);
      return;
    }
    if (picked) {
      setSelecting(null);
      setPicked(null);
      return;
    }
    if (setupDone) {
      setSetupDone(false);
      return;
    }
    onBack?.();
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden bg-stone-950">
      {bg && <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover animate-fade-in-scene" />}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/55 to-stone-950/90" />

      {tag && (
        <p className="absolute inset-x-0 top-0 z-20 pt-12 text-center font-serif text-[12px] tracking-[0.4em] text-amber-200/60">
          {tag}
        </p>
      )}

      {(setupDone || picked || onBack) && (
        <div className="absolute left-5 top-6 z-20">
          <BackButton
            label={picked || setupDone ? '回看上一段' : '上一幕'}
            onClick={goBack}
          />
        </div>
      )}

      {/* 一、铺陈：字幕框，一句一句点着读 */}
      {!picked && !setupDone && (
        <SubtitleBox
          text={setup}
          startDelay={bg ? 1100 : 450}
          onDone={() => setSetupDone(true)}
          onBack={onBack}
          showBoundaryBack={false}
        />
      )}

      {/* 二、抉择：铺陈读完，字幕框消失、两个抉择浮现（错开节拍、隔得远——这不是导航按钮） */}
      {!picked && setupDone && (
        <div className="absolute inset-x-0 bottom-0 z-20 space-y-7 px-7 pb-14">
          {choices.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handlePick(c)}
              disabled={!!selecting || !choicesArmed}
              style={{ animationDelay: `${i * 220}ms` }}
              className={`block w-full animate-fade-in rounded-md border px-6 py-6 text-center font-serif text-[16px] leading-8 tracking-[0.05em] backdrop-blur-sm transition-all duration-500 active:scale-[0.98] ${
                selecting === c.id
                  ? 'scale-[1.02] border-amber-200 bg-amber-100/10 text-amber-50'
                  : selecting
                  ? 'border-white/10 text-stone-500 opacity-40'
                  : 'border-amber-200/30 text-stone-100 hover:border-amber-200/70 hover:bg-amber-100/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* 三、反应：选后她/世界的回应也走字幕框 */}
      {picked && !reactDone && (
        <SubtitleBox
          key={picked.id}
          text={picked.outcome}
          startDelay={400}
          onDone={() => setReactDone(true)}
          onBack={() => {
            setSelecting(null);
            setPicked(null);
          }}
          showBoundaryBack={false}
        />
      )}

      {/* 四、反应读完：继续 */}
      {picked && reactDone && (
        <div className="absolute inset-x-0 bottom-0 z-20 animate-fade-in px-7 pb-14">
          <button
            onClick={() => onChoose(picked.id)}
            disabled={!continueArmed}
            className="w-full rounded-md border border-amber-300/60 py-3 text-[14px] text-amber-100 transition hover:bg-amber-300/10 disabled:opacity-60"
          >
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  );
}
