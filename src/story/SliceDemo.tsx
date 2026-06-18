// 切片流程：正门（冷开场→报名→感知题）→ 凤姐相遇 → 黛玉相遇
import { useState } from 'react';
import type { LensKey } from './types';
import Opening from './Opening';
import EncounterView from './EncounterView';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';
import { DAIYU, SCENE_XIAOXIANG, ENC_DAIYU_D1, CLUE_DAIYU_JADE } from './data/daiyu';

type Stage = 'opening' | 'fengjie' | 'daiyu';

export default function SliceDemo() {
  const [player, setPlayer] = useState<{ name: string; lens: LensKey } | null>(null);
  const [stage, setStage] = useState<Stage>('opening');

  if (!player || stage === 'opening') {
    return <Opening onDone={(name, lens) => { setPlayer({ name, lens }); setStage('fengjie'); }} />;
  }

  if (stage === 'fengjie') {
    return (
      <EncounterView
        key="fengjie"
        npc={FENGJIE}
        scene={SCENE_OPERA_HALL}
        encounter={ENC_FENGJIE_D1}
        clue={CLUE_FENGJIE_FINANCE}
        playerLens={player.lens}
        onNext={() => setStage('daiyu')}
        nextLabel="前往潇湘馆 →"
      />
    );
  }

  return (
    <EncounterView
      key="daiyu"
      npc={DAIYU}
      scene={SCENE_XIAOXIANG}
      encounter={ENC_DAIYU_D1}
      clue={CLUE_DAIYU_JADE}
      playerLens={player.lens}
    />
  );
}
