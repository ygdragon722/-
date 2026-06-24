import { useState } from 'react';
import { isSoundMuted, playUiSound, setSoundMuted } from './sound';
import VNButton from './VNButton';

interface Props {
  canContinue: boolean;
  onStart: () => void;
  onContinue: () => void;
}

export default function TitleScreen({ canContinue, onStart, onContinue }: Props) {
  const [muted, setMuted] = useState(() => {
    return isSoundMuted();
  });

  const toggleMuted = () => {
    setMuted((current) => {
      const next = !current;
      setSoundMuted(next);
      if (!next) playUiSound('tap');
      return next;
    });
  };

  const start = () => {
    playUiSound('dream');
    onStart();
  };

  const continueGame = () => {
    playUiSound('tap');
    onContinue();
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center overflow-hidden bg-stone-950 px-8">
      <img
        src="./assets/scenes/opening-mirror-back.webp"
        alt=""
        className="vn-scene-image absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/45 via-stone-950/30 to-stone-950/74" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(202,138,4,0.20),transparent_42%)]" />

      <main className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="relative mb-8 flex flex-col items-center gap-3">
          <div className="opening-title-glow" aria-hidden="true" />
          <h1 className="opening-title font-serif text-[46px] font-bold text-amber-50 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
            {'红楼幻梦'.split('').map((char, index) => (
              <span
                key={char}
                className="opening-title-char"
                style={{ animationDelay: `${260 + index * 150}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>
          <div className="opening-title-line" />
          <p className="opening-title-subtitle font-serif text-[13px] text-amber-100/80 drop-shadow">
            一场读人，也被人读的梦
          </p>
        </div>

        <div className="flex w-full max-w-[260px] flex-col gap-3">
          {canContinue && (
            <VNButton
              onClick={continueGame}
              variant="primary"
              fullWidth
            >
              继续旧梦
            </VNButton>
          )}
          <VNButton
            onClick={start}
            variant="secondary"
            fullWidth
          >
            开始入梦
          </VNButton>
          <VNButton
            type="button"
            onClick={toggleMuted}
            aria-pressed={muted}
            variant="quiet"
            size="sm"
            fullWidth
          >
            声音：{muted ? '关' : '开'}
          </VNButton>
          {!muted && (
            <VNButton
              type="button"
              onClick={() => playUiSound('test')}
              variant="quiet"
              size="sm"
              fullWidth
            >
              试音
            </VNButton>
          )}
        </div>
      </main>
    </div>
  );
}
