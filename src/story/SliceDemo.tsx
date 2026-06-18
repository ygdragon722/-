// 切片入口：挂载凤姐第一场相遇，供 ?slice=fengjie 预览
import EncounterView from './EncounterView';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';

export default function SliceDemo() {
  return (
    <EncounterView
      npc={FENGJIE}
      scene={SCENE_OPERA_HALL}
      encounter={ENC_FENGJIE_D1}
      clue={CLUE_FENGJIE_FINANCE}
    />
  );
}
