// 通用"日终总结"外壳：一屏只显示一条总结（点一下换下一条，不是越点越长往下堆），
// 翻到最后一条后该条消失、浮现"前往下一天"按钮——屏幕大小固定，不出现滚动条。
// 不是大段描写，只是把这一天听见/看见的几句话点一下——判词式的大结局只在 Ending.tsx，
// 走完所有天数才出现一次，这里每天都不重复。
import { useState } from 'react';
import { useArm } from './useArm';
import BackButton from './BackButton';
import { playUiSound } from './sound';
import VNButton from './VNButton';
import ScenePlaque from './ScenePlaque';
import MenuButton from './MenuButton';
import SaveButton from './SaveButton';

interface Props {
  tag: string;                 // 顶部小标签，如"悟"
  bg?: string;                 // 整屏背景图（可空＝纯墨色，不强求每处都配图）
  beats: React.ReactNode[];    // 几条简短总结，一条一条翻页
  continueLabel: string;       // "前往第二天 →"
  onContinue: () => void;
  onBack?: () => void;
  onSave?: () => void;
  onMenu?: () => void;
}

export default function DaySummary({ tag, bg, beats, continueLabel, onContinue, onBack, onSave, onMenu }: Props) {
  const [idx, setIdx] = useState(0); // 当前显示第几条（0 起）
  const isDone = idx >= beats.length;
  const continueArmed = useArm(isDone);

  const advance = () => {
    if (!isDone) {
      playUiSound('tap');
      setIdx((i) => i + 1);
    }
  };

  const goBack = () => {
    if (isDone) {
      setIdx(beats.length - 1);
      return;
    }
    if (idx > 0) {
      setIdx((i) => i - 1);
      return;
    }
    onBack?.();
  };

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950 px-7 py-12">
      {bg && (
        <>
          <img src={bg} alt="" className="vn-scene-image absolute inset-0 h-full w-full object-cover animate-fade-in-scene" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/52 via-stone-950/38 to-stone-950/72" />
        </>
      )}
      <ScenePlaque title={tag} variant="chapter" className="mb-8" />
      {(idx > 0 || isDone || onBack || onSave || onMenu) && (
        <div className="relative z-20 mb-6 flex flex-wrap justify-start gap-2">
          {(idx > 0 || isDone || onBack) && (
            <BackButton label={idx > 0 || isDone ? '上一段' : '上一幕'} onClick={goBack} />
          )}
          {onSave && <SaveButton onSave={onSave} />}
          {onMenu && <MenuButton onClick={onMenu} />}
        </div>
      )}

      {isDone ? (
        <div className="relative flex-1" />
      ) : (
        <button onClick={advance} className="relative flex flex-1 flex-col items-center justify-center">
          <div key={idx} className="w-full animate-fade-in">
            {beats[idx]}
          </div>
        </button>
      )}

      {isDone ? (
        <VNButton
          onClick={() => {
            playUiSound('tap');
            onContinue();
          }}
          disabled={!continueArmed}
          variant="primary"
          fullWidth
          className="relative animate-fade-in"
        >
          {continueLabel}
        </VNButton>
      ) : (
        <div className="relative pt-6 text-center text-[11px] tracking-widest text-stone-300/80">轻触继续</div>
      )}
    </div>
  );
}
