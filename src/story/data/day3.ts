// 第三天：两个抉择 + 终局文案（数据）
// 抉择一·玉（A）：让玉回来 / 让它继续藏着——给不给这个家它想要的太平
// 抉择二·女孩（B，压轴）：为她写下判词 / 转身离开——记不记得那个没人记得的人
// 守北极星：唏嘘不痛快，每条路各有各的痛，没有"赢"。
import type { Beat } from '../BeatScene';

export type JadeChoice = 'reveal' | 'hide';
export type GirlChoice = 'remember' | 'leave';

// ===== 第三天过场 =====
const DAWN_MANSION_BG = './assets/scenes/day3-dawn-mansion.webp';

export const DAY3_BEATS: Beat[] = [
  {
    text: '省亲的最后一日。\n天没亮，园子里就开始忙了。元妃的仪仗、回宫的车驾，一样样备起来。',
    bg: DAWN_MANSION_BG,
  },
  {
    text: '满府的人还在找那块玉——找了三天，翻遍了每一个角落。\n可你手里，攥着两个只有你知道的秘密。',
    bg: DAWN_MANSION_BG,
  },
  {
    text: '一个，是那块玉，到底在哪。\n一个，是井边那个女孩，到底是怎么没的。\n\n天亮之前，你得决定，拿它们怎么办。',
    bg: DAWN_MANSION_BG,
  },
];

// ===== 抉择一 · 玉 =====
export const JADE_BG = DAWN_MANSION_BG;

export const JADE_SETUP =
  '你比这府里任何人都懂宝玉。\n所以你想得到，他会把那块他厌恶了一辈子的"命"，藏在哪里。\n\n那块玉，从来没有丢。它只是，被它的主人亲手藏了起来。\n而现在，全府的安宁，就系在你这一个念头上。';

export const JADE_CHOICES: { id: JadeChoice; label: string; outcome: string }[] = [
  {
    id: 'reveal',
    label: '让玉"回来"',
    outcome:
      '你把那块玉，放回了它该在的地方。\n\n消息传开，整座府第像松了一口气——玉回来了，娘娘的体面保住了，回宫的车驾再无阴影。人人都说这是祖宗保佑、是天大的喜事。\n\n只是这一松气之间，那个井边的女孩，被忘得更干净了。乱平了，就再没有人，会去想她为什么没的。',
  },
  {
    id: 'hide',
    label: '让它继续藏着',
    outcome:
      '你什么都没说。那块玉，继续躺在只有你和它主人知道的地方。\n\n府里依旧人心惶惶，疑神疑鬼，盖子始终没能盖严。元妃的车驾在不安里启程，没有人得到那个"圆满"。\n\n你没有帮他们粉饰太平——可你也只是，让所有人对着一个永远够不到的真相，多煎熬了一程。',
  },
];

// ===== 过桥（玉 → 女孩） =====
const WELL_RELICS_BG = './assets/scenes/well-relics.webp';

export const DAY3_BRIDGE_BEATS: Beat[] = [
  {
    text: '玉的事，无论你怎么选，到天亮，都会过去。\n\n可还有一个人，不会因为天亮，就回来。',
    bg: WELL_RELICS_BG,
  },
  {
    text: '你走到那口井边。晨雾还没散。\n她那点东西——一只旧荷包，半双没绣完的鞋样——还在井台的石阶上，没人收。',
    bg: WELL_RELICS_BG,
  },
];

// ===== 抉择二 · 女孩（压轴） =====
export const GIRL_BG = WELL_RELICS_BG;

export const GIRL_SETUP =
  '这府里的女子，个个都有一首判词，写尽了她们的命。\n凤姐有，黛玉有，连那高墙里的元妃也有。\n\n唯独她没有。\n没有姓名，没有册子，没有一行字，记得她曾经活过。\n\n而你，是这满园里唯一一个，还记得她的人。';

export const GIRL_CHOICES: { id: GirlChoice; label: string; outcome: string }[] = [
  {
    id: 'remember',
    label: '为她写下',
    outcome:
      '你蹲下身，把她那点东西，轻轻收好。\n然后，你在心里，为她写了一首判词——\n像曹雪芹为那些女子写的那样，像这世间本该有人为她写的那样。',
  },
  {
    id: 'leave',
    label: '转身离开',
    outcome:
      '你站了很久。\n然后，你像这府里所有人一样，转过身，走开了。\n\n晨雾散了，井台的石阶上，那点东西也终会有人当垃圾扫掉。她来过，又走了，没有留下一丝痕迹。',
  },
];

// 那个女孩的判词（选 remember 才在终局展示）；末句"唯你"同构玩家判词的末句转回自身
export const GIRL_VERDICT = [
  '浣衣井畔影伶仃，',
  '册上从来无姓名。',
  '一夜无声沉水去，',
  '满园唯你记曾经。',
];

// ===== 终局：尾声（随玉）/ 道德定音句（随女孩） =====
export const EPILOGUE: Record<JadeChoice, string> = {
  reveal: '省亲的车驾，在一片"失而复得"的欢喜里启程。这座府，又干干净净地，是那座最体面的府了。',
  hide: '省亲的车驾，在一府的不安里启程。那块玉，至今没有再出现——就像有些事，本就不该被找回来。',
};

export const MORAL_CODA: Record<GirlChoice, string> = {
  remember: '你读了一夜的人，最后，也终于有一个人，被你认真地记住了。',
  leave: '你读得懂每一个人，可到最后，你也和所有人一样，选择了走开。',
};
