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
    base: '满堂喝彩里，凤姐脸上挂着恰到好处、滴水不漏的笑——可那笑没到眼睛里，像一张绷到极限、随时会裂的纸。\n这正月十五的寒夜，她鬓角竟沁着一层薄汗，袖口死死攥着半卷不肯示人的东西。',
  },
  // 无对错：四个选项都是真实反应。共情让她卸一层（露出机关算尽的疲惫，融在 outcome 里），
  // 其余三种是不同的关系结果，但都各自露出"她袖里藏着和钱有关的东西"——故事照常往下推。
  truthThreshold: 45,
  truth: {
    id: 'truth_fengjie_jiguan',
    clueId: 'clue_fengjie_finance',
    devNote: '凤姐卸下了一层——你看见了那个撑着整座府第、自己却没看成一出戏的人。',
  },
  approaches: [
    {
      id: 'empathy',
      label: '共情',
      playerLine: '「这一夜……怕是只有姐姐一个人，没看成戏吧。」',
      key: 'empathy',
      trustDelta: 20,
      outcome:
        '她脸上的笑顿住了。\n半晌，她没有看你，只轻轻"哼"了一声——可那声里，没了平日的锋利。\n\n「……你倒是长了眼睛。」\n\n她转过脸，声音低下来，像是说给自己听：\n「看戏？我何曾看过戏。这鲜花着锦、烈火烹油，你当是天上掉下来的？省下来的、挪出去的、拆东墙补西墙的——桩桩件件，都压在我这一只袖子里。」\n\n她忽然顿住，像是惊觉说多了，又把那副笑扯了回来：\n「罢了。这些腌臜账，你不懂，也不必懂。」',
      unlocksTruthId: 'truth_fengjie_jiguan',
    },
    {
      id: 'flatter',
      label: '奉承',
      playerLine: '「这一夜满园光彩，全靠姐姐一人撑着。」',
      key: 'flatter',
      trustDelta: -10,
      outcome:
        '她眼皮都不抬，唇角一挑：\n「嘴倒甜。可惜这话，我一日要听二十遭。」\n\n奉承喂不动她——这门手艺，她自己就是祖师。\n可你留意到，她应着话的当口，眼角飞快地扫了一下廊柱后头，像是在确认有没有人听见。',
    },
    {
      id: 'confront',
      label: '直问',
      playerLine: '「凤姐姐袖里攥的，是什么？」',
      key: 'confront',
      trustDelta: -15,
      outcome:
        '她眉梢一挑，似笑非笑：\n「哟，今儿宝兄弟，也学会盘问人了？」\n\n她回得太快、太轻巧——可那半卷东西，她攥得更死了。\n她不愿让你看见，本身就是一种回答。',
    },
    {
      id: 'observe',
      label: '旁观',
      playerLine: '不上前。你退到廊柱的阴影里，记下她离席的时辰与去向。',
      key: 'observe',
      trustDelta: 0,
      outcome:
        '一炷香的工夫，她三次悄悄离席，又三次若无其事地回来，脸上的笑分毫不乱。\n你没能换得她一句真心话——\n但她藏的那样东西，藏在何处、何时去碰，你心里渐渐有了数。',
    },
  ],
};
