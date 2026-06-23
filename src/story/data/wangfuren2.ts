// 王夫人 · 第二天第二场（佛堂）—— "她那只手"正式浮现
// 让玩家把"小蝉之死"和王夫人连起来，但她不认罪、只承认那套让她能够杀人的信念。
// 红线：不血腥、不当众认罪，真相最后一块（怎么死的）留到第三天。
import type { Scene, Encounter, Clue } from '../types';
import { WANGFUREN } from './wangfuren'; // 复用第一场的 NpcDef（同一个人，立绘/基调一致）

// 第二场专用：换到佛堂，与上房区隔，强化"念佛—行恶"的反讽
export const SCENE_FOTANG: Scene = {
  id: 'fotang',
  name: '佛堂',
  desc: '檀香很重，她一下一下数着佛珠，佛像在烟后头，面目慈悲。',
  bg: './assets/scenes/wangfuren-fotang.webp',
};

export const CLUE_WANGFUREN_HAND: Clue = {
  id: 'clue_wangfuren_hand',
  text: '王夫人默认了小蝉之死与她有关，且她自认是"替这个家做了该做的脏活"——慈悲，是要沾手的。',
  layer: 3, // 第三层真相：她是那只清除的手
};

export const ENC_WANGFUREN_D2: Encounter = {
  id: 'enc_wangfuren_d2',
  day: 2,
  sceneId: 'fotang',
  npcId: 'wangfuren',
  portraitFrames: {
    calm: { position: 'center 55%', opacity: 0.92 },
    open: { position: 'center 55%', opacity: 0.92 },
    guarded: { position: 'center 55%', opacity: 0.92 },
  },
  observation: {
    base: '王夫人在小佛堂里，一下一下地数着佛珠，檀香很重。小蝉的名字，今早已经从月例册子上划掉了——干干净净，像是这个人从没在这府里活过。\n她听见你进来，没有回头，只淡淡道：「来上炷香吧。积德的事，多做些总是好的。」',
  },
  // 无对错：四个选项都是真实反应。她只对"认同她逻辑"的人交底（顺服解锁），
  // 区别于贾母的"不追问才卸防"——贾母怕你查，王夫人要你站到她那边。
  truthThreshold: 50,
  truth: {
    id: 'wangfuren_truth_2',
    clueId: 'clue_wangfuren_hand',
    devNote: '王夫人卸下了一层——她没认罪，但说出了"慈悲是要沾手的"，承认了那套让她能够杀人的信念。',
  },
  approaches: [
    {
      id: 'wangfuren2_empathy',
      label: '共情',
      playerLine: '「太太……小蝉那孩子，就这么没了，您一点都不难过吗？」',
      key: 'empathy',
      trustDelta: -10,
      outcome:
        '她终于回过头，看你的眼神里没有慌，只有一种近乎悲悯的平静：\n\n「难过？我替她念了一整卷经。一个投井的丫头，能有这样的体面，是她的造化。」\n\n她说得那样真心，仿佛她真的，是在做一件好事。',
    },
    {
      id: 'wangfuren2_observe',
      label: '旁观',
      playerLine: '不说话，目光落在那本被划掉名字的月例册子上，又移回她数佛珠的手。',
      key: 'observe',
      trustDelta: 5,
      outcome:
        '她数珠的手没有停。\n可你注意到，她数到"小蝉"那一行所在的位置时，指尖几不可察地顿了一下——不是愧疚，倒像是在确认：这一笔，已经了结干净了。',
    },
    {
      id: 'wangfuren2_confront',
      label: '直问',
      playerLine: '「是您让人去搜她箱子的，对不对？她到底看见了什么？」',
      key: 'confront',
      trustDelta: -20,
      outcome:
        '檀香的烟，被她一句话压住了：\n\n「宝玉。」她的声音很轻，「有些孩子，就是管不住自己的眼睛和嘴。\n你是这府里的公子，不该学那些下人，到处去看不该看的东西。」\n\n这不是回答。这是警告——而警告本身，已经是答案。',
    },
    {
      id: 'wangfuren2_defer',
      label: '顺服',
      playerLine: '垂手，顺着她的话上了一炷香，没有点破什么。',
      key: 'defer',
      trustDelta: 20,
      outcome:
        '她的神色柔和下来，像是终于遇到一个"懂事"的人。\n\n「你是个明白人。」她重新闭上眼，数着珠子，声音轻得像叹息，「这府里，总要有人做那个狠心的人，旁人才能干干净净地活着。\n等你将来当了家就懂了——慈悲，有时候是要沾手的。」\n\n她说完，再不看你。香烟笔直地升上去，佛像在烟后头，面目慈悲。',
      unlocksTruthId: 'wangfuren_truth_2',
    },
  ],
};

// 便于 SliceDemo 统一引用：第二场仍是王夫人本人
export const WANGFUREN_NPC = WANGFUREN;
