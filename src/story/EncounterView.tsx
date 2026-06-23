// 一场读人相遇（竖屏移动优先 · 全屏 VN 排版）。
// 观察走字幕框（点一句翻一句）→ 读完框消失、浮现 4 个读法选项 →
// 选后她的反应也走字幕框 → 读完出"下一幕"。文字始终在框里，节奏交给玩家。
import { useState } from 'react';
import type { Encounter, NpcDef, Scene, Clue, ReadKey } from './types';
import { applyRead, initTrust, type ReadResult } from './engine';
import SubtitleBox from './SubtitleBox';
import { useArm } from './useArm';
import BackButton from './BackButton';

interface Props {
  npc: NpcDef;
  scene: Scene;
  encounter: Encounter;
  clue: Clue;
  onNext?: () => void;      // 有则在反应读完后显示"前往下一幕"
  nextLabel?: string;
  onBack?: () => void;
  // 抉择后回报：本场是否读到真话 + 用了什么读法 + 玩家说了什么（供结局"反过来读你"归纳与原句回放）
  onResolve?: (info: { reachedTruth: boolean; readKey: ReadKey; playerLine: string }) => void;
}

export default function EncounterView({ npc, scene, encounter, onNext, nextLabel = '前往下一幕 →', onBack, onResolve }: Props) {
  const [trust, setTrust] = useState(() => initTrust(npc.id));
  const [result, setResult] = useState<ReadResult | null>(null);
  const [obsDone, setObsDone] = useState(false);   // 观察读完 → 出选项
  const [reactDone, setReactDone] = useState(false); // 反应读完 → 出下一幕
  const optionsArmed = useArm(obsDone && !result); // 选项刚出现时先不接点击，防误触
  const nextArmed = useArm(reactDone);

  const observation = encounter.observation.base;

  // 对话近景：观察和选项阶段只看“人景一体”的场景图；选完读法后才切人物近景。
  const expr: 'calm' | 'open' | 'guarded' = result?.truth
    ? 'open'
    : result?.pushedAway
    ? 'guarded'
    : 'calm';
  const closeup = npc.portraits?.[expr] ?? npc.portraits?.calm ?? null;
  const closeupFrame =
    encounter.portraitFrames?.[expr]
    ?? encounter.portraitFrames?.calm
    ?? npc.portraitFrames?.[expr]
    ?? npc.portraitFrames?.calm;
  const showCloseup = !!closeup && !!result;

  const handlePick = (approachId: string) => {
    if (result) return;
    const { next, result: r } = applyRead(npc, encounter, trust, approachId);
    setTrust(next);
    setResult(r);
    onResolve?.({
      reachedTruth: !!r.truth,
      readKey: r.approach.key,
      playerLine: r.approach.playerLine,
    });
  };

  const reset = () => {
    setTrust(initTrust(npc.id));
    setResult(null);
    setObsDone(false);
    setReactDone(false);
  };

  const goBack = () => {
    if (result && reactDone) {
      setReactDone(false);
      return;
    }
    if (result) {
      setTrust(initTrust(npc.id));
      setResult(null);
      setReactDone(false);
      return;
    }
    if (obsDone) {
      setObsDone(false);
      return;
    }
    onBack?.();
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden bg-stone-900">
      {/* 场景图铺满（人景一体），进场淡入不硬切 */}
      {scene.bg ? (
        <img src={scene.bg} alt={scene.name} className="absolute inset-0 h-full w-full object-cover animate-fade-in-scene" />
      ) : (
        <div className="absolute inset-0 animate-fade-in-scene bg-gradient-to-b from-stone-700 via-stone-800 to-stone-950" />
      )}
      {/* 观察阶段保留场景可读性；有结果时再压暗一层，聚焦人物近景 */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/30 transition-opacity duration-500 ${
          result ? 'opacity-100' : 'opacity-90'
        }`}
      />

      {/* 选完读法后，才切到人物近景和她的反应；不要在观察阶段盖掉场景图 */}
      {result && closeup && (
        <img
          key={expr}
          src={closeup}
          alt={npc.name}
          className={`absolute inset-0 z-10 h-full w-full opacity-0 transition-opacity duration-700 ${
            closeupFrame?.fit === 'contain' ? 'object-contain' : 'object-cover'
          }`}
          style={{
            opacity: showCloseup ? closeupFrame?.opacity ?? 1 : 0,
            objectPosition: closeupFrame?.position ?? 'center top',
            transform: closeupFrame?.scale ? `scale(${closeupFrame.scale})` : undefined,
          }}
        />
      )}

      {/* 场景名牌（左上） */}
      <div className="absolute inset-x-0 top-0 z-20 px-5 pt-6">
        <div className="mb-3">
          {(obsDone || result || onBack) && (
            <BackButton label={obsDone || result ? '回看上一段' : '上一幕'} onClick={goBack} />
          )}
        </div>
        <div className="inline-flex flex-col border-l-2 border-amber-200/70 bg-stone-950/30 py-1 pl-3 pr-4 backdrop-blur-sm">
          <span className="font-serif text-lg font-bold tracking-[0.3em] text-amber-50 drop-shadow">{scene.name}</span>
          <span className="mt-0.5 text-[11px] tracking-wide text-stone-300/90 drop-shadow">{scene.desc}</span>
        </div>
      </div>

      {/* 一、观察：字幕框，一句一句点着读 */}
      {!result && !obsDone && (
        <SubtitleBox
          key={`obs-${encounter.id}`}
          text={observation}
          startDelay={scene.bg ? 1400 : 450}
          onDone={() => setObsDone(true)}
          onBack={onBack}
          showBoundaryBack={false}
        />
      )}

      {/* 二、选项：观察读完，字幕框消失、4 个读法浮现 */}
      {!result && obsDone && (
        <div className="absolute inset-x-0 bottom-0 z-20 animate-fade-in bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent px-5 pb-8 pt-16">
          <div className="space-y-2.5">
            {encounter.approaches.map((a) => (
              <button
                key={a.id}
                onClick={() => handlePick(a.id)}
                disabled={!optionsArmed}
                className="block w-full rounded-md border border-white/20 bg-stone-950/55 px-4 py-3 text-left text-[14px] leading-6 text-stone-100 backdrop-blur-sm transition active:scale-[0.99] hover:border-amber-200/70 hover:bg-stone-900/70"
              >
                {a.playerLine}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 三、反应：她的回应也走字幕框 */}
      {result && !reactDone && (
        <SubtitleBox
          key={`react-${result.approach.id}`}
          text={result.approach.outcome}
          startDelay={500}
          onDone={() => setReactDone(true)}
          onBack={() => setResult(null)}
          showBoundaryBack={false}
        />
      )}

      {/* 四、反应读完：重读 / 下一幕 */}
      {result && reactDone && (
        <div className="absolute inset-x-0 bottom-0 z-20 animate-fade-in bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent px-5 pb-8 pt-16">
          <div className="flex gap-3">
            <button
              onClick={reset}
              disabled={!nextArmed}
              className="rounded-md border border-white/25 px-4 py-2 text-[13px] text-stone-400 transition hover:border-amber-200/50 hover:text-stone-200"
            >
              重读这一场
            </button>
            {onNext && (
              <button
                onClick={onNext}
                disabled={!nextArmed}
                className="flex-1 rounded-md border border-amber-300/60 px-4 py-2 text-[13px] text-amber-100 transition hover:bg-amber-300/10"
              >
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
