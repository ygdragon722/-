// 可玩切片：一场读人相遇（竖屏移动优先 · 全屏 VN 排版）
// 人景一体的场景图铺满，观察/选项浮在底部半透明栏——让画面的"实"发挥出来

import { useState } from 'react';
import type { Encounter, NpcDef, Scene, LensKey, Clue } from './types';
import { applyRead, initTrust, distanceHint, type ReadResult } from './engine';

const LENS_LABELS: Record<LensKey, string> = {
  N: '直觉',
  F: '情感',
  T: '思辨',
  J: '判断',
};

interface Props {
  npc: NpcDef;
  scene: Scene;
  encounter: Encounter;
  clue: Clue;
}

export default function EncounterView({ npc, scene, encounter, clue }: Props) {
  const [trust, setTrust] = useState(() => initTrust(npc.id));
  const [lens, setLens] = useState<LensKey | null>(null);
  const [result, setResult] = useState<ReadResult | null>(null);
  const [done, setDone] = useState(false);

  const observation =
    (lens && encounter.observation.byLens?.[lens]) || encounter.observation.base;

  const handlePick = (approachId: string) => {
    if (done) return;
    const { next, result } = applyRead(npc, encounter, trust, approachId);
    setTrust(next);
    setResult(result);
    setDone(true);
  };

  const reset = () => {
    setTrust(initTrust(npc.id));
    setResult(null);
    setDone(false);
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden bg-stone-900">
      {/* 场景图铺满（人景一体） */}
      {scene.bg ? (
        <img src={scene.bg} alt={scene.name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-950" />
      )}
      {/* 底部压暗，保证文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/30" />

      {/* 内容层 */}
      <div className="relative flex min-h-screen flex-col">
        {/* 场景名牌（左上） */}
        <div className="px-5 pt-6">
          <div className="inline-flex flex-col border-l-2 border-amber-200/70 bg-stone-950/30 py-1 pl-3 pr-4 backdrop-blur-sm">
            <span className="text-lg font-bold tracking-[0.3em] text-amber-50 drop-shadow">{scene.name}</span>
            <span className="mt-0.5 text-[11px] tracking-wide text-stone-300/90 drop-shadow">{scene.desc}</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* 底部浮层：透镜 + 观察 + 选项/结果 */}
        <div className="bg-gradient-to-t from-stone-950/95 to-stone-950/0 px-5 pb-8 pt-10">
          {/* 感知透镜 */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] text-stone-400">以何眼观之：</span>
            {(Object.keys(LENS_LABELS) as LensKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setLens(lens === k ? null : k)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] transition ${
                  lens === k
                    ? 'border-amber-200 bg-amber-200 text-stone-900'
                    : 'border-stone-500/60 text-stone-300 hover:border-amber-200/70'
                }`}
              >
                {LENS_LABELS[k]}
              </button>
            ))}
          </div>

          {/* 观察文案 */}
          <p className="mb-4 border-t border-white/15 pt-3 text-[15px] leading-7 text-stone-100 drop-shadow">
            {observation}
          </p>

          {/* 选项 或 结果 */}
          {!done ? (
            <div className="space-y-2.5">
              {encounter.approaches.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handlePick(a.id)}
                  className="block w-full rounded-md border border-white/20 bg-stone-950/55 px-4 py-3 text-left text-[14px] leading-6 text-stone-100 backdrop-blur-sm transition active:scale-[0.99] hover:border-amber-200/70 hover:bg-stone-900/70"
                >
                  <span className="mr-2 text-[11px] font-bold tracking-widest text-amber-200/80">{a.label}</span>
                  {a.playerLine}
                </button>
              ))}
            </div>
          ) : (
            result && (
              <div className="space-y-4">
                <p className="text-[15px] leading-7 text-stone-100 drop-shadow">{result.approach.outcome}</p>

                <p className={`text-[13px] italic leading-6 ${result.pushedAway ? 'text-stone-400' : 'text-emerald-200/90'}`}>
                  {distanceHint(result.trustAfter)}
                  <span className="ml-2 text-[11px] not-italic text-stone-500">
                    （距离 {result.trustBefore} → {result.trustAfter}）
                  </span>
                </p>

                {result.truth && (
                  <div className="rounded-md border border-amber-300/40 bg-amber-100/10 p-4 backdrop-blur-sm">
                    <p className="text-[15px] leading-7 text-amber-50">{result.truth.text}</p>
                    {result.truth.verdictEcho && (
                      <p className="mt-3 border-t border-amber-200/30 pt-2 text-[12px] tracking-wide text-amber-200/90">
                        判词回响 · {result.truth.verdictEcho}
                      </p>
                    )}
                    <p className="mt-2 text-[12px] text-stone-300">◆ 线索入册：{clue.text}</p>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="mt-1 rounded border border-white/25 px-4 py-2 text-[13px] text-stone-300 hover:border-amber-200/70 hover:text-amber-100"
                >
                  重读这一场（试试别的读法）
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
