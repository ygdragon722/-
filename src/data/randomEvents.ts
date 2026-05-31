import type { GameEvent, GameState } from '../types/game';
import { NPCS } from './npcs';

export interface RandomEventTemplate {
  id: string;
  weight: number;
  /** 返回 true 表示当前条件可触发 */
  condition?: (state: GameState) => boolean;
  getEvent: (state: GameState) => GameEvent & { character?: { id: string; name: string; mbti: string; avatar: string; bg?: string; border?: string } };
}

export const RANDOM_EVENTS: RandomEventTemplate[] = [
  // ========== 原有事件 ==========
  {
    id: 'jiazheng_exam',
    weight: 25,
    getEvent: (state) => {
      const requiredTalent = Math.min(100, 20 + state.day * 2);
      return {
        req: 0,
        isRandomEvent: true,
        character: NPCS.jiazheng,
        text: `（书房）贾政(${NPCS.jiazheng.mbti})派人将你叫去考较学问："我来考考你《大学》。"\n\n【考验】：才学需达到 ${requiredTalent} 才能应对。`,
        choices: [
          { text: '对答如流 (需才学达标)', req: { talent: requiredTalent }, reward: { silver: 150, mood: 20 }, reply: '贾政点点头："还算没全荒废，拿些银子去买书。"', action: 'close_random_event' },
          { text: '支支吾吾 (心情大幅下降)', cost: { mood: 40 }, reward: {}, reply: '贾政大怒："业精于勤荒于嬉！请家法！"你挨了一顿板子。', action: 'close_random_event' },
        ],
      };
    },
  },
  {
    id: 'jiamu_care',
    weight: 20,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: NPCS.jiamu,
      text: `（荣庆堂）贾母(${NPCS.jiamu.mbti})见你进来，笑得合不拢嘴："我的乖孙儿，快来看看是不是瘦了？"`,
      choices: [
        { text: '提供 ESFJ 需要的情绪共鸣', reward: { silver: 100, mood: 20 }, reply: '贾母十分欢喜，赏了你些碎银子。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'zhao_mock',
    weight: 15,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: NPCS.zhao,
      text: `（回廊）你不小心撞见赵姨娘(${NPCS.zhao.mbti})，她阴阳怪气地讽刺了你几句。`,
      choices: [
        { text: '不理会她 (心情 -15)', cost: { mood: 15 }, reply: '你懒得跟 ESTP 计较，但还是觉得晦气。', action: 'close_random_event' },
        { text: '花钱打发 (消耗 50 银两)', cost: { silver: 50 }, reply: '你丢给她碎银子，她立刻换了谄媚的笑脸走了。', action: 'close_random_event' },
      ],
    }),
  },

  // ========== 新增事件 ==========
  {
    id: 'fengjie_tax',
    weight: 15,
    condition: (state) => state.day >= 5,
    getEvent: (state) => {
      const tax = Math.min(100, 30 + state.day * 3);
      return {
        req: 0,
        isRandomEvent: true,
        character: { id: 'fengjie', name: '王熙凤', mbti: 'ENTJ', avatar: '💄', bg: 'bg-red-50', border: 'border-red-400' },
        text: `（荣国府）王熙凤叉着腰站在廊下，见你走来，凤眼一挑："宝兄弟来得正好，这个月的份子钱该交了！"\n\n【管家权威】：需缴纳 ${tax} 两银子。`,
        choices: [
          { text: `乖乖交钱 (${tax} 两)`, req: { silver: tax }, cost: { silver: tax }, reward: { mood: 10 }, reply: '王熙凤满意地点点头："这才像话。"', action: 'close_random_event' },
          { text: '据理力争 (心情 -20，不交钱)', cost: { mood: 20 }, reward: {}, reply: '王熙凤冷笑一声："好你个宝玉，翅膀硬了？"你被她数落了一通，心情大坏。', action: 'close_random_event' },
        ],
      };
    },
  },
  {
    id: 'laolao_visit',
    weight: 10,
    condition: (state) => state.day >= 3,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'laolao', name: '刘姥姥', mbti: 'ESFP', avatar: '🥬', bg: 'bg-green-50', border: 'border-green-400' },
      text: `（后门）刘姥姥挎着一篮子新鲜瓜果，笑眯眯地拦住你："哥儿行行好，赏口茶喝？我带了自家种的大倭瓜！"`,
      choices: [
        { text: '热情招待 (心情 +15)', reward: { mood: 15 }, reply: '刘姥姥感激涕零，非要塞给你两个大倭瓜。你被她逗得哈哈大笑。', action: 'close_random_event' },
        { text: '打赏银两 (消耗 30 两，心情 +25)', cost: { silver: 30 }, reward: { mood: 25 }, reply: '刘姥姥千恩万谢："哥儿真是菩萨心肠！"你心情大好。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'pinger_help',
    weight: 12,
    condition: (state) => state.day >= 5,
    getEvent: () => {
      return {
        req: 0,
        isRandomEvent: true,
        character: { id: 'pinger', name: '平儿', mbti: 'ISFJ', avatar: '💐', bg: 'bg-pink-50', border: 'border-pink-300' },
        text: `（王熙凤院外）平儿悄悄拉住你，递来一个小包袱："二爷，这是奶奶赏下来的，说给你补补身子。"`,
        choices: [
          { text: '收下礼物', reward: { silver: 50, mood: 15 }, reply: '你打开一看，竟是些上好的燕窝。平儿微微一笑，转身走了。', action: 'close_random_event' },
        ],
      };
    },
  },
  {
    id: 'xiangling_poem',
    weight: 10,
    condition: (state) => state.day >= 7 && state.talent >= 30,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'xiangling', name: '香菱', mbti: 'INFP', avatar: '📜', bg: 'bg-violet-50', border: 'border-violet-300' },
      text: `（藕香榭）香菱捧着一本诗集，苦着脸向你请教："宝二爷，这'大漠孤烟直'的意境，我怎么也参不透..."`,
      choices: [
        { text: '悉心指点 (才学 +10，心情 -5)', cost: { mood: 5 }, reward: { talent: 10, mood: 10 }, reply: '香菱恍然大悟："原来如此！宝二爷真是我的良师！"你也因教导他人而有所得。', action: 'close_random_event' },
        { text: '敷衍两句 (无变化)', reward: {}, reply: '香菱似懂非懂地点点头，你心中略有些愧疚。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'maid_snack',
    weight: 12,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'maid', name: '小丫鬟', mbti: 'ESFJ', avatar: '🍡', bg: 'bg-orange-50', border: 'border-orange-300' },
      text: `（回廊）一个小丫鬟端着一碟桂花糕，差点撞上你。"二爷恕罪！这是厨房里新做的，正要给各房送去。"`,
      choices: [
        { text: '顺手牵糕 (心情 +10)', reward: { mood: 10 }, reply: '你捏了一块桂花糕，甜糯可口，心情顿时好了不少。', action: 'close_random_event' },
        { text: '赏她银子 (消耗 20 两，心情 +20)', cost: { silver: 20 }, reward: { mood: 20 }, reply: '小丫鬟喜笑颜开："二爷真是天下最好的主子！"', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'storm_fright',
    weight: 8,
    condition: (state) => state.weather.id === 'rainy',
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'maid2', name: '粗使婆子', mbti: 'ISTP', avatar: '⛈️', bg: 'bg-slate-100', border: 'border-slate-400' },
      text: `（偏院）忽然一道惊雷劈下，一个粗使婆子慌慌张张地跑过："不好了！后院的梧桐树被雷劈了！"\n\n【突发事件】：大雨滂沱中，你决定...`,
      choices: [
        { text: '冒雨查看 (心情 -15，才学 +5)', cost: { mood: 15 }, reward: { talent: 5 }, reply: '你冒着大雨查看灾情，虽然淋得狼狈，却因此写了一篇《雷劈梧桐赋》，得了些才学。', action: 'close_random_event' },
        { text: '躲在屋里 (心情 +5)', reward: { mood: 5 }, reply: '你给自己泡了杯热茶，听雨声潺潺，倒也惬意。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'gossip_heard',
    weight: 10,
    condition: (state) => state.day >= 10,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'gossip', name: '府中传闻', mbti: '情报', avatar: '👂', bg: 'bg-yellow-50', border: 'border-yellow-400' },
      text: `（假山后）你无意中听到两个小厮窃窃私语："听说江南来了个奇人，专收绝世诗词，一首好诗能换五百两呢！"`,
      choices: [
        { text: '记下此事 (赋诗卖稿收益提升)', reward: { mood: 10 }, reply: '你心中暗喜，决定日后多作几首好诗卖与此人。', action: 'close_random_event' },
        { text: '不予理会', reward: {}, reply: '你摇摇头，这等江湖传闻多半不可信。', action: 'close_random_event' },
      ],
    }),
  },
];

/** 根据当前游戏状态，筛选出可触发的随机事件 */
export function getAvailableRandomEvents(state: GameState): RandomEventTemplate[] {
  return RANDOM_EVENTS.filter((evt) => {
    if (evt.condition && !evt.condition(state)) return false;
    return true;
  });
}

/** 按权重随机选择一个事件 */
export function pickRandomEvent(state: GameState): RandomEventTemplate | null {
  const available = getAvailableRandomEvents(state);
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const evt of available) {
    rand -= evt.weight;
    if (rand <= 0) return evt;
  }

  return available[available.length - 1];
}
