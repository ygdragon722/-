// 可玩切片：一场读人相遇（竖屏移动优先 · 水墨留白）
// 这是验证手感的最小纵切片，不是最终演出版

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
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-[#f4f0e6] text-stone-800">
      {/* 场景名牌 */}
      <div className="px-5 pt-6">
        <div className="inline-flex flex-col border-l-2 border-stone-400 pl-3">
          <span className="text-lg font-bold tracking-[0.3em] text-stone-700">{scene.name}</span>
          <span className="mt-0.5 text-xs tracking-wide text-stone-400">{scene.desc}</span>
        </div>
      </div>

      {/* 立绘区（暂用留白 + 名字占位，待立绘到位） */}
      <div className="relative flex flex-1 items-end justify-center px-5 py-4">
        <div className="flex h-[34vh] w-full items-end justify-center rounded-sm border border-stone-300/60 bg-gradient-to-b from-transparent to-stone-200/40">
          {npc.portrait ? (
            <img src={npc.portrait} alt={npc.name} className="h-full w-auto object-contain" />
          ) : (
            <span className="mb-6 text-sm tracking-[0.5em] text-stone-400">{npc.name}　立绘待补</span>
          )}
        </div>
      </div>

      {/* 感知透镜切换（演示：换一只眼，观察就变） */}
      <div className="flex items-center gap-2 px-5 pb-2">
        <span className="text-[11px] text-stone-400">以何眼观之：</span>
        {(Object.keys(LENS_LABELS) as LensKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setLens(lens === k ? null : k)}
            className={`rounded-full border px-2.5 py-0.5 text-[11px] transition ${
              lens === k
                ? 'border-stone-600 bg-stone-700 text-stone-50'
                : 'border-stone-300 text-stone-500 hover:border-stone-500'
            }`}
          >
            {LENS_LABELS[k]}
          </button>
        ))}
      </div>

      {/* 观察文案 */}
      <div className="px-5 pb-3">
        <p className="border-t border-stone-300 pt-3 text-[15px] leading-7 text-stone-700">
          {observation}
        </p>
      </div>

      {/* 选项 或 结果 */}
      <div className="px-5 pb-8">
        {!done ? (
          <div className="space-y-2.5">
            {encounter.approaches.map((a) => (
              <button
                key={a.id}
                onClick={() => handlePick(a.id)}
                className="block w-full rounded-md border border-stone-300 bg-white/70 px-4 py-3 text-left text-[14px] leading-6 text-stone-700 transition active:scale-[0.99] hover:border-stone-500 hover:bg-white"
              >
                <span className="mr-2 text-[11px] font-bold tracking-widest text-stone-400">{a.label}</span>
                {a.playerLine}
              </button>
            ))}
          </div>
        ) : (
          result && (
            <div className="space-y-4">
              {/* 对方反应 */}
              <p className="text-[15px] leading-7 text-stone-700">{result.approach.outcome}</p>

              {/* 距离暗示（不画进度条） */}
              <p
                className={`text-[13px] italic leading-6 ${
                  result.pushedAway ? 'text-stone-500' : 'text-emerald-800/70'
                }`}
              >
                {distanceHint(result.trustAfter)}
                <span className="ml-2 text-[11px] not-italic text-stone-400">
                  （距离 {result.trustBefore} → {result.trustAfter}）
                </span>
              </p>

              {/* 吐露真话 = 线索 + 判词 */}
              {result.truth && (
                <div className="rounded-md border border-amber-300/50 bg-amber-50/60 p-4">
                  <p className="text-[15px] leading-7 text-stone-800">{result.truth.text}</p>
                  {result.truth.verdictEcho && (
                    <p className="mt-3 border-t border-amber-200 pt-2 text-[12px] tracking-wide text-amber-800/80">
                      判词回响 · {result.truth.verdictEcho}
                    </p>
                  )}
                  <p className="mt-2 text-[12px] text-stone-500">
                    ◆ 线索入册：{clue.text}
                  </p>
                </div>
              )}

              <button
                onClick={reset}
                className="mt-2 rounded border border-stone-300 px-4 py-2 text-[13px] text-stone-500 hover:border-stone-500 hover:text-stone-700"
              >
                重读这一场（试试别的读法）
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
