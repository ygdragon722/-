// 切片入口：挂载凤姐第一场相遇，供 ?slice=fengjie 预览
import EncounterView from './EncounterView';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';

export default function SliceDemo() {
  // 占位背景：真正的"赏戏厅·人景一体"图待生成，先用现有场景图验证全屏排版
  const sceneWithBg = { ...SCENE_OPERA_HALL, bg: './assets/locations/yihong.webp' };
  return (
    <EncounterView
      npc={FENGJIE}
      scene={sceneWithBg}
      encounter={ENC_FENGJIE_D1}
      clue={CLUE_FENGJIE_FINANCE}
    />
  );
}
