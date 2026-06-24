// 过场播放器："画面淡入 → 底部字幕框浮现 → 点框翻下一句 → 翻完换下一拍画面"。
// 冷开场、每日过渡（丫鬟之死、道德抉择…）都用同一套节奏。字幕框逻辑见 SubtitleBox。
import { useState } from 'react';
import SubtitleBox from './SubtitleBox';
import ScenePlaque from './ScenePlaque';

export interface Beat {
  text: string;
  bg?: string;   // 该幕背景图（可空，空＝墨色渐变）
  dim?: boolean; // 是否压暗（用真图但要保住文字可读时用）
}

interface Props {
  beats: Beat[];
  onComplete: () => void; // 最后一拍最后一句翻完、再点一次后触发
  chapterLabel?: string;  // 顶部小标签（如"第二天"），不传则不显示
  onBack?: () => void;
}

export default function BeatScene({ beats, onComplete, chapterLabel, onBack }: Props) {
  const [beat, setBeat] = useState(0);
  const current = beats[beat];
  const isLast = beat >= beats.length - 1;

  const advance = () => {
    if (isLast) onComplete();
    else setBeat((b) => b + 1);
  };

  const goBack = () => {
    if (beat > 0) {
      setBeat((b) => b - 1);
      return;
    }
    onBack?.();
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden bg-stone-950">
      {current.bg && (
        <img
          key={`bg-${beat}`}
          src={current.bg}
          alt=""
          className={`vn-scene-image absolute inset-0 h-full w-full object-cover animate-fade-in-scene ${current.dim ? 'opacity-60' : ''}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/24 via-transparent to-stone-950/55" />

      {chapterLabel && (
        <div className="absolute inset-x-0 top-0 z-20 pt-8">
          <ScenePlaque title={chapterLabel} variant="chapter" />
        </div>
      )}

      {/* 字幕框：翻到新画面先让图淡入"喘一口气"，字幕框才浮现，不抢画面；点框翻下一句 */}
      <SubtitleBox
        key={beat}
        text={current.text}
        startDelay={current.bg ? 900 : 350}
        onDone={advance}
        onBack={beat > 0 || onBack ? goBack : undefined}
      />
    </div>
  );
}
