// 读人引擎 · 纯逻辑
// 输入：当前信任状态 + 选定的读法 → 输出：信任增减、是否吐真话、线索入账、镜子记录
// 纯函数，不依赖 React，方便单测与控制台验证

import type {
  Encounter,
  ReadApproach,
  TrustState,
  MirrorRecord,
  NpcDef,
  TruthLine,
} from './types';
import { INITIAL_TRUST } from './types';

export interface ReadResult {
  approach: ReadApproach;
  trustBefore: number;
  trustAfter: number;
  pushedAway: boolean;       // 这次是否把她推远了（槽-）
  truth: TruthLine | null;   // 达阈值吐露的真话（含线索）
  mirror: MirrorRecord;      // 本次产生的镜子记录
}

export function initTrust(npcId: string): TrustState {
  return { npcId, trust: INITIAL_TRUST, unlockedTruths: [], reads: 0 };
}

// 应用一次读法。返回新的 TrustState 与本次结果（不修改入参）
export function applyRead(
  npc: NpcDef,
  encounter: Encounter,
  prev: TrustState,
  approachId: string,
): { next: TrustState; result: ReadResult } {
  const approach = encounter.approaches.find((a) => a.id === approachId);
  if (!approach) throw new Error(`未知读法：${approachId}`);

  const trustBefore = prev.trust;

  // 宽容度：读错（delta<0）时按 guardedness 放大下滑；读对不放大
  const rawDelta = approach.trustDelta;
  const delta = rawDelta < 0 ? rawDelta * npc.guardedness : rawDelta;
  const trustAfter = clamp(trustBefore + delta, 0, 100);

  // 是否吐真话：选项标记可解锁 + 信任达阈值 + 该真话尚未解锁
  let truth: TruthLine | null = null;
  const unlockedTruths = [...prev.unlockedTruths];
  if (
    approach.unlocksTruthId &&
    encounter.truth &&
    encounter.truth.id === approach.unlocksTruthId &&
    trustAfter >= encounter.truthThreshold &&
    !unlockedTruths.includes(encounter.truth.id)
  ) {
    truth = encounter.truth;
    unlockedTruths.push(truth.id);
  }

  const next: TrustState = {
    npcId: prev.npcId,
    trust: trustAfter,
    unlockedTruths,
    reads: prev.reads + 1,
  };

  const mirror: MirrorRecord = {
    at: encounter.id,
    kind: 'read',
    detail: `用「${approach.label}」读${npc.name}`,
    readKey: approach.key,
    npcId: npc.id,
  };

  return {
    next,
    result: {
      approach,
      trustBefore,
      trustAfter,
      pushedAway: delta < 0,
      truth,
      mirror,
    },
  };
}

// 把信任值翻译成"距离"的暗示文案（不画进度条，用语言表达关系温度）
export function distanceHint(trust: number): string {
  if (trust >= 70) return '她的神色柔和下来，仿佛终于把你当作能说话的人。';
  if (trust >= 45) return '她看你的眼神松了一分。';
  if (trust >= 30) return '她仍隔着一层，礼数周全，心门未开。';
  if (trust >= 15) return '她的话里多了一丝戒备。';
  return '她已彻底竖起了墙，几乎不愿再看你。';
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
