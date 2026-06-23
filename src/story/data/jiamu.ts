// 贾母 · 第二天初场（荥庆堂）—— "那只闭上的眼"
// 她不是凶手，不下令、只选择不去看，为保元春/家族体面。
// 与前三场方向相反：不是"靠近她"才能让她卸防，是"你不追问"她才肯松口。
import type { NpcDef, Scene, Encounter, Clue } from '../types';

export const JIAMU: NpcDef = {
  id: 'jiamu',
  name: '贾母',
  mbti: 'ESFJ',
  verdictEcho: '满堂儿孙绕膝下，独有一事不敢看',
  guardedness: 1.8, // 全场最高：不是因为在防御，是因为她真的、一辈子都在练习"不看"
  correctKeys: ['defer'],
  portraits: {
    calm: './assets/portraits/jiamu-calm.webp',
    open: './assets/portraits/jiamu-open.webp',
    guarded: './assets/portraits/jiamu-guarded.webp',
  },
  portraitFrames: {
    calm: { position: 'center 42%' },
    open: { position: 'center 42%' },
    guarded: { position: 'center 42%' },
  },
};

export const SCENE_RONGQING: Scene = {
  id: 'rongqing',
  name: '荥庆堂',
  desc: '灯火温暖，她倚在软榻上，慈眉善目，笑意落不到眼睛深处。',
  bg: './assets/scenes/jiamu-hall.webp',
};

export const CLUE_JIAMU_SILENCE: Clue = {
  id: 'clue_jiamu_silence',
  text: '贾母说「查得太清楚，谁都没好处——尤其是宫里那位」——她不是不知道，是选择不去查。',
  layer: 3, // 第三层真相：顶端默许，为保元春/家族体面
};

export const ENC_JIAMU_D2: Encounter = {
  id: 'enc_jiamu_d2',
  day: 2,
  sceneId: 'rongqing',
  npcId: 'jiamu',
  observation: {
    base: '荥庆堂里灯火温暖，贾母倚在铺着锦垛的软榻上，身边靠着她那根乌木拐杖，慈眉善目，笑意是真的，可那笑意落不到眼睛深处。\n方才有人来回报小蝉的事，她只点了点头，摆手让人下去——没有再多问一句，连"怎么没的"都没有问。',
  },
  // 无对错：四个选项都是真实反应。但这场方向和前三场相反——
  // 不是"靠近/共情"才能让她卸防，是"你不追问"她才肯松口说出真话。
  truthThreshold: 45,
  truth: {
    id: 'jiamu_truth_1',
    clueId: 'clue_jiamu_silence',
    devNote: '贾母卸下了一层——她说出了"这府里太平要紧"，暴露了她明知而不查的真实心态。',
  },
  approaches: [
    {
      id: 'jiamu_empathy',
      label: '共情',
      playerLine: '「老太太，您没事吧？这事儿……听着也让人心里发紧。」',
      key: 'empathy',
      trustDelta: -5,
      outcome:
        '她笑了一下，伸手替你理了理衣领，像在哄一个孩子：\n\n「傻孩子，这府里大大小小的事，哪一件能少了？你呀，就是心太软。」\n\n她说完，转开话题问起你昨夜睡得好不好——这事，被她用一句"你心太软"轻轻翻过去了。',
    },
    {
      id: 'jiamu_observe',
      label: '旁观',
      playerLine: '不说话，远远看着她，记下她有没有再问起这件事。',
      key: 'observe',
      trustDelta: 5,
      outcome:
        '一整晚，她没有再提小蝉一个字。\n倒是后来，你看见她对身边的老嬷嬷低声说了句什么，那嬷嬷脸色一白，匆匆退了下去。',
    },
    {
      id: 'jiamu_confront',
      label: '直问',
      playerLine: '「老太太，要不要查查，小蝉到底是怎么没的？」',
      key: 'confront',
      trustDelta: -20,
      outcome:
        '她拄杖的手没动，笑意却淡了一分：\n\n「查？查出什么来，对谁有好处？」\n\n她看着你，那一刻，慈和底下露出一点你从未见过的、属于这个家族顶端的东西——不是凶狠，是一种"这件事到此为止"的份量。',
    },
    {
      id: 'jiamu_defer',
      label: '顺服',
      playerLine: '垂手低头，没有追问，只静静陪着她坐了一会儿。',
      key: 'defer',
      trustDelta: 20,
      outcome:
        '她似乎松了一口气，拄杖在地上轻轻一点。\n\n「这府里，太平要紧。」她闭着眼，声音很轻，像是说给自己听，又像是在告诉你一件你早该明白的事：\n\n「查得太清楚，谁都没好处——尤其是宫里那位。你只当……什么都没看见，便是疼这个家了。」\n\n她说完，重新睁开眼，笑意又恢复了如常的慈和，仿佛方才那句话从未出现过。',
      unlocksTruthId: 'jiamu_truth_1',
    },
  ],
};
