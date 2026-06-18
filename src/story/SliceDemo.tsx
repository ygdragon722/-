// 切片流程：正门（冷开场→报名→选型）→ 凤姐相遇
import { useState } from 'react';
import type { Mbti } from './types';
import Opening from './Opening';
import EncounterView from './EncounterView';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';

export default function SliceDemo() {
  const [player, setPlayer] = useState<{ name: string; mbti: Mbti } | null>(null);

  if (!player) {
    return <Opening onDone={(name, mbti) => setPlayer({ name, mbti })} />;
  }

  return (
    <EncounterView
      npc={FENGJIE}
      scene={SCENE_OPERA_HALL}
      encounter={ENC_FENGJIE_D1}
      clue={CLUE_FENGJIE_FINANCE}
      playerMbti={player.mbti}
    />
  );
}
