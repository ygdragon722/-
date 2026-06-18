// 林黛玉 · 第一场相遇（情感场 · 潇湘馆）
import type { NpcDef, Scene, Encounter, Clue } from '../types';

export const DAIYU: NpcDef = {
  id: 'daiyu',
  name: '林黛玉',
  mbti: 'INFP',
  verdictEcho: '玉带林中挂，金簪雪里埋',
  guardedness: 0.8,   // 比凤姐好亲近，但敏感——读错她察觉得快
  correctKeys: ['empathy', 'observe'],
  // 立绘待补：daiyu-calm / daiyu-open / daiyu-guarded
  portraits: {},
};

export const SCENE_XIAOXIANG: Scene = {
  id: 'xiaoxiang',
  name: '潇湘馆',
  desc: '竹影摇窗，墨迹未干，她独坐灯下。',
  // bg 待补：daiyu-xiaoxiang.webp
};

export const CLUE_DAIYU_JADE: Clue = {
  id: 'clue_daiyu_jade',
  text: '黛玉说，她曾希望那块玉消失。宝玉今晚——或许真的如她所愿。',
  layer: 1,   // 第一层真相：玉是宝玉自己藏的
};

export const ENC_DAIYU_D1: Encounter = {
  id: 'enc_daiyu_d1',
  day: 1,
  sceneId: 'xiaoxiang',
  npcId: 'daiyu',
  isBondScene: true,
  observation: {
    base: '潇湘馆的灯比别处暗一些。她坐在窗边，手里捏着笔，却没有在写——只是盯着那张纸。',
    byLens: {
      F: '她的眼圈有些红。不是刚哭完，是那种哭了太多次、眼睛永远带着水光的人。',
      N: '她知道今晚的你不是你。你感觉到了——她的眼神掠过你时，停了一瞬，像是在辨认一个陌生人。',
      T: '她面前的纸上只写了半句诗，停在"花落"两个字后面。她已经在这里坐了很久了。',
      J: '满园灯火，她一个人在这里。省亲的热闹和她没有关系——或者说，她让自己和热闹没有关系。',
    },
  },
  approaches: [
    {
      id: 'daiyu_empathy',
      label: '共情',
      playerLine: '「你在这里，不去看戏？」轻声问，没有催她。',
      key: 'empathy',
      trustDelta: 20,
      outcome: '她抬起头，看了你很久。\n\n「你今晚……不一样。」\n\n她说这话时，眼睛里有什么东西松动了。',
      unlocksTruthId: 'daiyu_truth_1',
    },
    {
      id: 'daiyu_observe',
      label: '旁观',
      playerLine: '不说话，静静在她旁边坐下来。',
      key: 'observe',
      trustDelta: 10,
      outcome: '她没有赶你走，也没有说话。\n\n两个人就这样坐着，听竹子在风里动。',
    },
    {
      id: 'daiyu_play',
      label: '玩闹',
      playerLine: '「好妹妹，今儿这副样子，仔细哭坏了眼睛！」',
      key: 'play',
      trustDelta: -10,
      outcome: '她的眼神骤然冷了一分。\n\n「你今晚奇怪得很。」\n\n她低下头，不再看你。',
    },
    {
      id: 'daiyu_confront',
      label: '直问',
      playerLine: '「你可知道，玉不见了的事？」',
      key: 'logic',
      trustDelta: -15,
      outcome: '她愣了一下，随即扭过头去。\n\n「你来这里，是为了问这个？」\n\n声音里带了一丝你从未听过的冷。',
    },
  ],
  truthThreshold: 40,
  truth: {
    id: 'daiyu_truth_1',
    text: '「我有时候想，要是没有那块玉就好了。\n大家就不会总盯着它、盯着你……」\n\n她顿了顿，像是说漏了什么，\n\n「你今晚——好像也这么想过，对不对？」',
    clueId: 'clue_daiyu_jade',
    verdictEcho: '眼泪还债，债尽人散',
  },
};
