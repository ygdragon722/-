// 正门：冷开场 → 报名字 → 入梦（竖屏移动优先 · 水墨）
// 不再有"感知题"自我申报：玩家是谁，由全程的读法选择来刻画，结局再反过来读你
import { useState } from 'react';
import { OPENING_BEATS } from './data/opening';
import BeatScene from './BeatScene';
import { playUiSound } from './sound';
import VNButton from './VNButton';
import ScenePlaque from './ScenePlaque';
import MenuButton from './MenuButton';

interface Props {
  onDone: (name: string) => void;
  onMenu?: () => void;
}

export default function Opening({ onDone, onMenu }: Props) {
  const [phase, setPhase] = useState<'briefing' | 'cold' | 'name'>('briefing');
  const [name, setName] = useState('');

  // ===== 开场牌：先让玩家知道"游戏开始了"，再进入现代游园 =====
  if (phase === 'briefing') {
    return (
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-end overflow-hidden bg-stone-950 px-7 pb-12 pt-8">
        <div
          aria-hidden="true"
          className="vn-scene-image absolute inset-0 bg-cover bg-center opacity-[0.86]"
          style={{ backgroundImage: "url('./assets/scenes/opening-modern-entry.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/52 via-stone-950/22 to-stone-950/86" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(253,230,138,0.18),transparent_44%)]" />

        {onMenu && (
          <div className="absolute left-5 top-6 z-20">
            <MenuButton onClick={onMenu} />
          </div>
        )}

        <div className="relative z-10 mb-auto mt-4 flex justify-center">
          <ScenePlaque title="序幕" variant="chapter" />
        </div>

        <main className="relative z-10 animate-fade-in-up">
          <p className="mb-4 font-serif text-[13px] text-amber-200/70">现代 · 城郊大观园景区</p>
          <h2 className="font-serif text-[30px] font-bold leading-tight text-amber-50 drop-shadow-[0_8px_22px_rgba(0,0,0,0.72)]">
            游园的人，
            <br />
            要入梦了。
          </h2>
          <div className="mt-5 border-l-2 border-amber-200/55 bg-stone-950/36 px-4 py-3 text-[14px] leading-7 text-stone-200 shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <p>你是来游玩的现代女生。</p>
            <p className="text-stone-300/88">你读过《红楼梦》，也以为自己读懂了它。</p>
          </div>

          <VNButton
            type="button"
            onClick={() => {
              playUiSound('dream');
              setPhase('cold');
            }}
            variant="primary"
            fullWidth
            className="mt-7"
          >
            进入大观园
          </VNButton>
        </main>
      </div>
    );
  }

  // ===== 冷开场 =====
  if (phase === 'cold') {
    return <BeatScene beats={OPENING_BEATS} onComplete={() => setPhase('name')} onMenu={onMenu} />;
  }

  // 接续冷开场最近的一张场景图；最后一拍若是暗场，也不要让报名字页忽然掉进纯黑。
  const lastBg = [...OPENING_BEATS].reverse().find((beat) => beat.bg)?.bg;

  // ===== 报名字 → 入梦 =====
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950 px-7 py-8">
      {lastBg && (
        <img src={lastBg} alt="" className="vn-scene-image absolute inset-0 h-full w-full object-cover opacity-78" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/48 via-stone-950/58 to-stone-950/86" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(251,191,36,0.16),transparent_42%)]" />

      {onMenu && (
        <div className="absolute left-5 top-6 z-20">
          <MenuButton onClick={onMenu} />
        </div>
      )}

      <div className="relative z-10 flex justify-center">
        <ScenePlaque title="入梦" variant="chapter" />
      </div>

      <main className="relative z-10 mt-auto animate-fade-in-up">
        <section className="border-l-2 border-amber-200/55 bg-stone-950/42 px-5 py-5 shadow-[0_16px_38px_rgba(0,0,0,0.32)] backdrop-blur-sm">
          <p className="font-serif text-[13px] text-amber-200/72">镜前一问</p>
          <h2 className="mt-3 font-serif text-[24px] font-bold leading-snug text-amber-50 drop-shadow">
            你在这场梦里，
            <br />
            叫什么名字？
          </h2>
          <p className="mt-4 text-[14px] leading-7 text-stone-300/92 drop-shadow">
            慌乱中，你顺口应下。可若有人问起，你总得留下一个能被记住的名字。
          </p>

          <label className="mt-5 block">
            <span className="sr-only">写下你的名字</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
              placeholder="写下你的名字"
              className="w-full rounded-md border border-amber-200/30 bg-stone-950/58 px-4 py-3 text-center font-serif text-[17px] text-amber-50 outline-none shadow-inner backdrop-blur-sm transition focus:border-amber-200/75 focus:bg-stone-950/72"
            />
          </label>

          <VNButton
            disabled={!name.trim()}
            onClick={() => {
              playUiSound('dream');
              onDone(name.trim());
            }}
            variant="primary"
            fullWidth
            className="mt-4"
          >
            入梦
          </VNButton>
        </section>

        <VNButton
          type="button"
          onClick={() => {
            playUiSound('tap');
            setPhase('briefing');
          }}
          variant="ghost"
          size="sm"
          fullWidth
          className="mt-3 border-0 px-0"
        >
          回看开场
        </VNButton>

        <p className="mx-auto mt-4 max-w-[280px] text-center text-[11px] leading-5 text-stone-500 drop-shadow">
          接下来你怎么读这些人，结局会反过来读你一次。
        </p>
      </main>
    </div>
  );
}
