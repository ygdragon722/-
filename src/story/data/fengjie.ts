// 数据样板：王熙凤 · 第一天赏戏相遇
// 用途：验证 types.ts 能真正承载一场读人相遇（含感知透镜、4读法、信任增减、真话=线索+判词）
// 这是"脚本作数据"的范例，后续 6-8 场照此模子由 Kimi 起草、用户审阅

import type { NpcDef, Encounter, Clue, Scene } from '../types';

export const FENGJIE: NpcDef = {
  id: 'fengjie',
  name: '王熙凤',
  mbti: 'ESTJ',
  verdictEcho: '机关算尽太聪明，反算了卿卿性命',
  correctKeys: ['empathy'],   // 强撑的 ESTJ，要的不是夸，是有人看见她扛着什么
  guardedness: 1.4,           // 难撬难回
  portraits: {
    calm: './assets/portraits/fengjie-calm.webp',
    open: './assets/portraits/fengjie-open.webp',       // 卸防·读对
    guarded: './assets/portraits/fengjie-guarded.webp', // 戒备·读错
  },
};

export const SCENE_OPERA_HALL: Scene = {
  id: 'opera_hall',
  name: '赏戏厅',
  desc: '元妃赏戏，满堂目光黏在台上，凤姐立在廊下调度。',
  bg: './assets/scenes/fengjie-opera.webp',
};

export const CLUE_FENGJIE_FINANCE: Clue = {
  id: 'clue_fengjie_finance',
  text: '凤姐袖中死攥着账册，自言"挪出去的、拆东墙补西墙"——她的财务有见不得光的窟窿。',
  layer: 2,
};

export const ENC_FENGJIE_D1: Encounter = {
  id: 'enc_fengjie_d1',
  day: 1,
  sceneId: 'opera_hall',
  npcId: 'fengjie',
  observation: {
    base: '满堂喝彩里，凤姐脸上挂着恰到好处、滴水不漏的笑。',
    byLens: {
      F: '这正月十五的寒夜里，她鬓角竟沁着一层薄汗。',
      T: '全府最风光的一夜，管家的人没有半分得意，袖口里死死攥着半卷像是账册的东西。',
      N: '她笑着，可那笑没到眼睛里——像一张绷到极限、随时会裂的纸。',
      J: '你留意到：赏戏这段，凤姐三次短暂离场，无人留意。',
    },
  },
  truthThreshold: 45,
  truth: {
    id: 'truth_fengjie_jiguan',
    text: '「看戏？我何曾看过戏。你当这鲜花着锦是天上掉的？省下来的、挪出去的、拆东墙补西墙的，桩桩都压在我这袖子里。机关算尽——罢了，我的宝兄弟，你成日家只在姐妹堆里厮混，这些腌臜账，你不懂，也不必懂。」',
    clueId: 'clue_fengjie_finance',
    verdictEcho: '机关算尽太聪明，反算了卿卿性命',
  },
  approaches: [
    {
      id: 'confront',
      label: '直问',
      playerLine: '「凤姐姐袖里攥的，是什么？」',
      key: 'confront',
      trustDelta: -15,
      outcome: '她眉梢一挑，似笑非笑：「哟，今儿宝兄弟怎么也学着盘问起我来了？」——可她回得太快、太重，那卷东西见不得人。',
    },
    {
      id: 'flatter',
      label: '奉承',
      playerLine: '「这一夜满园光彩，全靠姐姐一人撑着。」',
      key: 'flatter',
      trustDelta: -10,
      outcome: '她眼皮都不抬，冷笑：「嘴倒甜。可惜这话我一天要听二十遭。」奉承喂不动她——她自己就是操纵的高手。',
    },
    {
      id: 'empathy',
      label: '共情',
      playerLine: '「这一夜……怕是只有姐姐一个人，没看成戏吧。」',
      key: 'empathy',
      trustDelta: 20,
      outcome: '她的笑顿了一下。全园几百口子，只有你看见了那个没看戏的人。',
      unlocksTruthId: 'truth_fengjie_jiguan',
    },
    {
      id: 'observe',
      label: '旁观',
      playerLine: '不上前，先记下她离场的时辰与去向。',
      key: 'observe',
      trustDelta: 0,
      outcome: '你得到了她的行踪，却没能得她一句真心话。（线索板：凤姐赏戏时三次离场）',
    },
  ],
};
