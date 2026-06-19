// 王夫人 · 第一天相遇（人物介绍场 · 上房）
// 不揭谋杀（那是第二天的事），只埋下她"自持/自认行善/见不得脏东西"的肃杀感
import type { NpcDef, Scene, Encounter, Clue } from '../types';

export const WANGFUREN: NpcDef = {
  id: 'wangfuren',
  name: '王夫人',
  mbti: 'ISFJ',
  verdictEcho: '虎兕相逢大梦归',
  guardedness: 1.6,          // 全场最难撬：她不靠强撑，靠真正的冷
  correctKeys: ['defer', 'observe'],
  portraits: {
    calm: './assets/portraits/wangfuren-calm.webp',
    open: './assets/portraits/wangfuren-open.webp',
    guarded: './assets/portraits/wangfuren-guarded.webp',
  },
};

export const SCENE_SHANGFANG: Scene = {
  id: 'shangfang',
  name: '上房',
  desc: '满府都在为玉乱作一团，她独坐在这里，神色一丝不乱。',
  bg: './assets/scenes/wangfuren-hall.webp',
};

export const CLUE_WANGFUREN_COLD: Clue = {
  id: 'clue_wangfuren_cold',
  text: '她说「这府里见不得脏东西，脏的，总要拾干净」——你说不清为什么，这句话让你脊背发凉。',
  layer: 3, // 第三层真相的伏笔：她是那只清除的手
};

export const ENC_WANGFUREN_D1: Encounter = {
  id: 'enc_wangfuren_d1',
  day: 1,
  sceneId: 'shangfang',
  npcId: 'wangfuren',
  observation: {
    base: '满府的人都在找玉，乱得像开了锅。唯独她坐在这里，手里转着一串佛珠，神色一丝不乱。',
    byLens: {
      F: '她脸上没有焦急，只有一种克制到近乎平静的肃然——像是早就料到，又像是根本不在意。',
      N: '她说「不过一块玉，找得到便好」，可她下给下人的每一句话，都重得不像是在说一块玉。',
      T: '一块"不过如此"的玉，调度起来的人手、压低的声量、关起来的门——分量完全对不上。',
      J: '你留意到：她已经让两个陪房悄悄去查了什么人今晚去过哪里，比谁都先。',
    },
  },
  truthThreshold: 50,
  truth: {
    id: 'wangfuren_truth_1',
    text: '她转着佛珠，忽然看你一眼，声音很轻：\n\n「这府里，见不得脏东西。脏的，总要有人拾干净——\n不是谁都担得起这个，担得起的，也未必落得着一句好。」\n\n她说完，重新闭上了眼，像是说累了，又像是什么都没说。',
    clueId: 'clue_wangfuren_cold',
    verdictEcho: '虎兕相逢大梦归',
  },
  approaches: [
    {
      id: 'wangfuren_defer',
      label: '顺服',
      playerLine: '垂手退半步：「太太费心，这些原不该您来操持。」',
      key: 'defer',
      trustDelta: 20,
      outcome: '她转佛珠的手停了一瞬，像是这府里很久没人说过这种话。\n\n「你倒是个明白事理的孩子。」',
      unlocksTruthId: 'wangfuren_truth_1',
    },
    {
      id: 'wangfuren_observe',
      label: '旁观',
      playerLine: '不上前，只远远记下她让谁去了哪里。',
      key: 'observe',
      trustDelta: 5,
      outcome: '她没看你一眼，仿佛你从未站在这里。\n（线索板：她已暗中追查今夜行踪）',
    },
    {
      id: 'wangfuren_empathy',
      label: '共情',
      playerLine: '「太太也是被这一夜搅得不得安宁吧。」',
      key: 'empathy',
      trustDelta: -15,
      outcome: '她抬眼看你，眼神里没有一丝被看穿心事的松动，只有更深一层的冷：\n\n「我没有什么不得安宁。」',
    },
    {
      id: 'wangfuren_confront',
      label: '直问',
      playerLine: '「太太已经查到什么了，对不对？」',
      key: 'confront',
      trustDelta: -20,
      outcome: '她的佛珠停了。\n\n「宝玉，」她第一次叫你的名字，声音很轻，却像一道门关上，\n「有些事，不是你该问的。」',
    },
  ],
};
