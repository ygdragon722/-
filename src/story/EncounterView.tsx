// 可玩切片：一场读人相遇（竖屏移动优先 · 全屏 VN 排版）
// 人景一体的场景图铺满，观察/选项浮在底部半透明栏——让画面的"实"发挥出来

import { useState } from 'react';
import type { Encounter, NpcDef, Scene, Clue, ReadKey } from './types';
import { applyRead, initTrust, type ReadResult } from './engine';
import TextReveal from './TextReveal';

interface Props {
  npc: NpcDef;
  scene: Scene;
  encounter: Encounter;
  clue: Clue;
  onNext?: () => void;      // 有则在结果页显示"前往下一幕"
  nextLabel?: string;
  // 抉择后回报：本场是否读到真话 + 用了什么读法 + 玩家说了什么（供结局"反过来读你"归纳与原句回放）
  onResolve?: (info: { reachedTruth: boolean; readKey: ReadKey; playerLine: string }) => void;
}

export default function EncounterView({ npc, scene, encounter, onNext, nextLabel = '前往下一幕 →', onResolve }: Props) {
  const [trust, setTrust] = useState(() => initTrust(npc.id));
  const [result, setResult] = useState<ReadResult | null>(null);
  const [done, setDone] = useState(false);
  const [obsRevealed, setObsRevealed] = useState(false); // 观察文字打完，才显示选项

  const observation = encounter.observation.base;

  // 对话近景：有结果时按读对/读错选表情，缺失则回退到 calm
  const expr: 'calm' | 'open' | 'guarded' | null = !done
    ? null
    : result?.truth
    ? 'open'
    : result?.pushedAway
    ? 'guarded'
    : 'calm';
  const closeup = expr
    ? npc.portraits?.[expr] ?? npc.portraits?.calm ?? null
    : null;

  const handlePick = (approachId: string) => {
    if (done) return;
    const { next, result } = applyRead(npc, encounter, trust, approachId);
    setTrust(next);
    setResult(result);
    setDone(true);
    onResolve?.({
      reachedTruth: !!result.truth,
      readKey: result.approach.key,
      playerLine: result.approach.playerLine,
    });
  };

  const reset = () => {
    setTrust(initTrust(npc.id));
    setResult(null);
    setDone(false);
    setObsRevealed(false);
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden bg-stone-900">
      {/* 场景图铺满（人景一体）。进场淡入，和冷开场/日间过渡的转场节奏一致，不硬切 */}
      {scene.bg ? (
        <img src={scene.bg} alt={scene.name} className="absolute inset-0 h-full w-full object-cover animate-fade-in-scene" />
      ) : (
        <div className="absolute inset-0 animate-fade-in-scene bg-gradient-to-b from-stone-700 via-stone-800 to-stone-950" />
      )}
      {/* 有结果时，场景再压暗一层，聚焦她的近景 */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/30 transition-opacity duration-500 ${
          done ? 'opacity-100' : 'opacity-90'
        }`}
      />

      {/* 对话近景：凤姐特写，读人有结果时整屏淡入（脸在上方，文字浮在下方） */}
      {closeup && (
        <img
          src={closeup}
          alt={npc.name}
          className="absolute inset-0 z-10 h-full w-full object-cover object-top transition-opacity duration-500"
          style={{ opacity: done ? 1 : 0 }}
        />
      )}

      {/* 内容层（z-20，确保文字浮在近景立绘之上） */}
      <div className="relative z-20 flex min-h-screen flex-col">
        {/* 场景名牌（左上） */}
        <div className="px-5 pt-6">
          <div className="inline-flex flex-col border-l-2 border-amber-200/70 bg-stone-950/30 py-1 pl-3 pr-4 backdrop-blur-sm">
            <span className="font-serif text-lg font-bold tracking-[0.3em] text-amber-50 drop-shadow">{scene.name}</span>
            <span className="mt-0.5 text-[11px] tracking-wide text-stone-300/90 drop-shadow">{scene.desc}</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* 底部浮层：透镜 + 观察 + 选项/结果。done 后限高可滚动，把上半屏的脸留出来 */}
        <div
          className={`bg-gradient-to-t from-stone-950 via-stone-950/90 to-stone-950/0 px-5 pb-8 pt-10 ${
            done ? 'max-h-[58vh] overflow-y-auto' : ''
          }`}
        >
          {/* 透镜无形起作用：开场定好后，观察文字已因人而异，不再每场提醒（自觉留到结局"反过来读你"） */}

          {/* 观察文案：场景图先被看见（startDelay），再整句淡入；显示完才浮现选项 */}
          {!done && (
            <TextReveal
              key={encounter.id}
              lines={[observation]}
              // 场景图（或渐变占位）淡入(.8s)走完、再停半拍才出字
              startDelay={1300}
              className="mb-4 text-[15px] leading-7 text-stone-100 drop-shadow"
              onComplete={() => setObsRevealed(true)}
            />
          )}

          {/* 选项 或 结果 */}
          {!done ? (
            <div className={`space-y-2.5 transition-opacity duration-300 ${obsRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {encounter.approaches.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handlePick(a.id)}
                  className="block w-full rounded-md border border-white/20 bg-stone-950/55 px-4 py-3 text-left text-[14px] leading-6 text-stone-100 backdrop-blur-sm transition active:scale-[0.99] hover:border-amber-200/70 hover:bg-stone-900/70"
                >
                  {a.playerLine}
                </button>
              ))}
            </div>
          ) : (
            result && (
              <div className="space-y-5">
                {/* 屏幕只留故事：她的反应整段浮现，不显示距离/判词/线索等机制标签 */}
                <p className="animate-fade-in whitespace-pre-line text-[15px] leading-8 text-stone-100 drop-shadow">
                  {result.approach.outcome}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="rounded border border-white/25 px-4 py-2 text-[13px] text-stone-400 hover:border-amber-200/50 hover:text-stone-200"
                  >
                    重读这一场
                  </button>
                  {onNext && (
                    <button
                      onClick={onNext}
                      className="flex-1 rounded border border-amber-300/60 px-4 py-2 text-[13px] text-amber-100 hover:bg-amber-300/10"
                    >
                      {nextLabel}
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
