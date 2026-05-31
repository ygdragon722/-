import type { GameEvent, GameState } from '../types/game';

export interface ExploreEventTemplate {
  id: string;
  weight: number;
  condition?: (state: GameState) => boolean;
  getEvent: (state: GameState, locationName: string) => GameEvent & { character?: { id: string; name: string; mbti: string; avatar: string; bg?: string; border?: string } };
}

export const EXPLORE_EVENTS: ExploreEventTemplate[] = [
  {
    id: 'find_silver',
    weight: 15,
    getEvent: (_, locationName) => {
      const amount = 20 + Math.floor(Math.random() * 50);
      return {
        req: 0,
        isRandomEvent: true,
        character: { id: 'find', name: '意外发现', mbti: '机缘', avatar: '💰', bg: 'bg-yellow-50', border: 'border-yellow-400' },
        text: `（${locationName}）你在角落里发现了一个遗落的荷包，打开一看，里面竟有 ${amount} 两碎银子！`,
        choices: [
          { text: '收入囊中', reward: { silver: amount, mood: 5 }, reply: '你四下张望无人，便将银子收了起来。', action: 'close_random_event' },
        ],
      };
    },
  },
  {
    id: 'find_item',
    weight: 10,
    getEvent: () => {
      const items = ['rouge', 'wine', 'tea'] as const;
      const itemId = items[Math.floor(Math.random() * items.length)];
      const itemNames: Record<string, string> = { rouge: '上等胭脂', wine: '惠泉酒', tea: '老君眉' };
      return {
        req: 0,
        isRandomEvent: true,
        character: { id: 'find', name: '意外发现', mbti: '机缘', avatar: '🎁', bg: 'bg-pink-50', border: 'border-pink-400' },
        text: `你在石凳下发现了一个精致的小匣子，打开一看，是一盒【${itemNames[itemId]}】！不知是哪位姐妹遗落的。`,
        choices: [
          { text: '收起来再说', reward: { mood: 10, items: { [itemId]: 1 } }, reply: `你小心地将【${itemNames[itemId]}】收入囊中。`, action: 'close_random_event' },
        ],
      };
    },
  },
  {
    id: 'inspiration',
    weight: 12,
    condition: (state) => state.weather.id === 'sunny',
    getEvent: (_, locationName) => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'nature', name: '触景生情', mbti: '灵感', avatar: '✨', bg: 'bg-sky-50', border: 'border-sky-400' },
      text: `（${locationName}）${locationName}的景色令你诗兴大发，脑海中浮现出几句妙语。`,
      choices: [
        { text: '记录下来 (才学 +8)', reward: { talent: 8, mood: 5 }, reply: '你找来纸笔，将灵感记录下来，才学又精进了一分。', action: 'close_random_event' },
        { text: '继续发呆', reward: { mood: 10 }, reply: '你任凭思绪飘散，享受这片刻的宁静。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'rain_melancholy',
    weight: 12,
    condition: (state) => state.weather.id === 'rainy',
    getEvent: (_, locationName) => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'nature', name: '雨中愁思', mbti: '情绪', avatar: '🌧️', bg: 'bg-blue-50', border: 'border-blue-400' },
      text: `（${locationName}）细雨如丝，打在芭蕉叶上声声入耳。你不由得想起了一些往事...`,
      choices: [
        { text: '吟诗排遣 (才学 +5，心情 -5)', cost: { mood: 5 }, reward: { talent: 5 }, reply: '你吟了几句诗，心中郁结稍解。', action: 'close_random_event' },
        { text: '任凭伤感蔓延 (心情 -10)', cost: { mood: 10 }, reward: {}, reply: '你任由悲伤笼罩，独自在雨中站了许久。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'bird_song',
    weight: 10,
    getEvent: (_, locationName) => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'nature', name: '园中趣闻', mbti: '自然', avatar: '🐦', bg: 'bg-green-50', border: 'border-green-400' },
      text: `（${locationName}）一只黄鹂鸟落在枝头，叽叽喳喳地叫着，仿佛在向你诉说园中的秘密。`,
      choices: [
        { text: '静静聆听 (心情 +15)', reward: { mood: 15 }, reply: '你屏息聆听，仿佛真的听懂了鸟语，心情大好。', action: 'close_random_event' },
      ],
    }),
  },
  {
    id: 'old_book',
    weight: 8,
    condition: (state) => state.day >= 5,
    getEvent: () => ({
      req: 0,
      isRandomEvent: true,
      character: { id: 'find', name: '意外发现', mbti: '机缘', avatar: '📚', bg: 'bg-amber-50', border: 'border-amber-400' },
      text: `你在旧书架上翻出一本残破的《牡丹亭》，扉页上还有前人的批注，字迹娟秀。`,
      choices: [
        { text: '细细研读 (才学 +15，心情 -5)', cost: { mood: 5 }, reward: { talent: 15 }, reply: '你被书中的痴情所打动，也学到了不少诗词技法。', action: 'close_random_event' },
        { text: '随手翻阅 (心情 +5)', reward: { mood: 5 }, reply: '你随意翻了翻，便放回原处。', action: 'close_random_event' },
      ],
    }),
  },
];

export function getAvailableExploreEvents(state: GameState): ExploreEventTemplate[] {
  return EXPLORE_EVENTS.filter((evt) => {
    if (evt.condition && !evt.condition(state)) return false;
    return true;
  });
}

export function pickExploreEvent(state: GameState): ExploreEventTemplate | null {
  const available = getAvailableExploreEvents(state);
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const evt of available) {
    rand -= evt.weight;
    if (rand <= 0) return evt;
  }

  return available[available.length - 1];
}
