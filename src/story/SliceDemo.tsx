// 切片流程：正门（冷开场→报名→感知题）→ 凤姐相遇
import { useState } from 'react';
import type { LensKey } from './types';
import Opening from './Opening';
import EncounterView from './EncounterView';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';

export default function SliceDemo() {
  const [player, setPlayer] = useState<{ name: string; lens: LensKey } | null>(null);

  if (!player) {
    return <Opening onDone={(name, lens) => setPlayer({ name, lens })} />;
  }

  return (
    <EncounterView
      npc={FENGJIE}
      scene={SCENE_OPERA_HALL}
      encounter={ENC_FENGJIE_D1}
      clue={CLUE_FENGJIE_FINANCE}
      playerLens={player.lens}
    />
  );
}
