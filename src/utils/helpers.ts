import type { GameState, EndingData, Affection, Weather } from '../types/game';
import { WEATHERS } from '../data/weathers';

export function getRandomWeather(): Weather {
  return WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
}

export function calculateEnding(state: GameState): EndingData {
  const { affection, talent, completedEvents, mbtiInsight } = state;

  // 妙玉路线
  if (affection.miaoyu >= 50) {
    const deep = completedEvents.includes('miaoyu-05-last-night') || mbtiInsight.miaoyu >= 30;
    return {
      id: 'miaoyu_ending',
      title: '红尘眷恋',
      desc: deep
        ? '你成功攻破了槛外人坚不可摧的心防，让清冷孤傲的妙玉从此有了人间的牵绊。那枚断线的佛珠，她始终没有重新穿起来。'
        : '你成功攻破了 INTJ 坚不可摧的心理防线，让清冷孤傲的槛外人，从此有了人间的牵绊。',
      scene: '栊翠庵的红梅年年还开，只是庵门从此虚掩着，留一条缝，给某个俗人进来喝一杯茶。',
    };
  }

  // 探春路线
  if (affection.tanchun >= 50) {
    const deep = completedEvents.includes('tanchun-05-last-night') || mbtiInsight.tanchun >= 30;
    return {
      id: 'tanchun_ending',
      title: '秋爽斋合伙人',
      desc: deep
        ? '你与探春并肩整顿了大观园的账目，成为了她最信任的左膀右臂。她出嫁那日，你送她的那包银子压在箱底，带去了千里之外。'
        : '你协助探春完成了大观园的改革，成为了 ENTJ 最信任的左膀右臂，家族中兴指日可待。',
      scene: '秋爽斋的芭蕉还在，账册却已封存。那一行行数字，是她留在这里的最后一件事。',
    };
  }

  // 才学路线
  if (talent >= 120) {
    return {
      id: 'study_ending',
      title: '崭露头角',
      desc: '你发奋苦读，才学大涨，连贾政都对你刮目相看。海棠诗社上那首诗，后来被人传抄了许多份，贾府上下无不称奇。',
      scene: '书案上的灯点到天亮，窗外的花开了又落。你终于成了贾府期望中的那个人，只是那个人里，还剩多少是你。',
    };
  }

  // 黛玉路线
  if (affection.daiyu >= 50) {
    const deep = completedEvents.includes('daiyu-05-last-night') || mbtiInsight.daiyu >= 30;
    return {
      id: 'daiyu_ending',
      title: '木石前盟',
      desc: deep
        ? '你与黛玉在沁芳闸边共读西厢，在潇湘馆的烛光里说过彼此的心意。那个夜晚月光漫进来，把两个人的影子叠在一处，再也分不清。'
        : '你成功同频了 INFP 的精神世界，与黛玉两心相悦。大观园中，落花树下，留下了你们最美的誓言。',
      scene: '潇湘馆的竹影年年摇，那首未写完的诗稿还压在枕下，等着有人续完后半阕。',
    };
  }

  // 宝钗路线
  if (affection.baochai >= 50) {
    const deep = completedEvents.includes('baochai-05-last-night') || mbtiInsight.baochai >= 30;
    return {
      id: 'baochai_ending',
      title: '金玉良缘',
      desc: deep
        ? '你听从宝钗的规劝，行事越发稳重。她收拾行李那日说那枚金簪埋在雪里也不算白埋，你听懂了，她也知道你听懂了。'
        : '你听从宝钗的规劝，行事越发稳重。在 ESTJ 强大家族荣誉感的驱动下，你们走向了世俗的成功。',
      scene: '蘅芜苑的冷香丸只剩最后一颗，她说不必再配了，往后日子里，有你在便够了。',
    };
  }

  // 湘云路线
  if (affection.xiangyun >= 50) {
    const deep = completedEvents.includes('xiangyun-05-last-night') || mbtiInsight.xiangyun >= 30;
    return {
      id: 'xiangyun_ending',
      title: '诗酒作伴',
      desc: deep
        ? '你和湘云在沁芳亭喝到了月落，她说云终究是散的，可那一夜你们都没有走。那壶酒，后来谁也没数清喝了几杯。'
        : '你与湘云日日烤肉饮酒，吟诗作对，无拘无束，成了贾府里最快活的一对逍遥客。',
      scene: '芍药栏的花年年开，她还是会在最盛的那天睡在花丛里，手边永远留着你带来的那壶酒。',
    };
  }

  // 晴雯路线
  if (affection.qingwen >= 40) {
    const deep = completedEvents.includes('qingwen-05-last-night') || mbtiInsight.qingwen >= 30;
    return {
      id: 'qingwen_ending',
      title: '千金难买一笑',
      desc: deep
        ? '你在抄检风波中为她挡下了所有的风浪，又散尽千金只为博她一笑。她说你不许骗她，你没有骗她。'
        : '你在抄检风波中保全了她，又散尽千金只为博她一笑。你们在世俗的眼光中，活出了极致的自我。',
      scene: '那把撕碎的折扇，她留着扇面最完整的一片，夹在枕下。那声嗤啦，是这三十天里最好听的声音。',
    };
  }

  // 袭人路线
  if (affection.xiren >= 30) {
    const deep = completedEvents.includes('xiren-05-last-night') || mbtiInsight.xiren >= 30;
    return {
      id: 'xiren_ending',
      title: '温柔末路',
      desc: deep
        ? '你答应过她哪儿也不让她去。那件熬了一夜补好的孔雀裘，你穿了整整一个冬天，没舍得换下来。'
        : '你沉溺在袭人的温柔照顾中，不再理会世俗功名，安安心心做了一个富贵闲人。',
      scene: '怡红院的茶永远是热的，床永远是暖的，那个说"只要二爷好好的"的人，还在。',
    };
  }

  // 摆烂结局
  return {
    id: 'bad_ending',
    title: '大梦一场',
    desc: '三十日转瞬即逝，你终究一事无成，只留下大观园中的一声叹息。银两散尽，姐妹们各奔东西，连那首诗也没写完。',
    scene: '宝玉做了个梦，梦里什么都有，醒来什么也没留下。',
  };
}

export function applyReward(state: GameState, reward: Record<string, number | undefined>): Partial<GameState> {
  const updates: Partial<GameState> = {};

  if (reward.mood !== undefined) updates.mood = Math.min(100, state.mood + reward.mood);
  if (reward.talent !== undefined) updates.talent = Math.min(1000, state.talent + reward.talent);
  if (reward.silver !== undefined) updates.silver = state.silver + reward.silver;

  if (reward.items) {
    const nextInventory = { ...state.inventory };
    for (const [itemId, qty] of Object.entries(reward.items)) {
      nextInventory[itemId] = (nextInventory[itemId] || 0) + qty;
    }
    updates.inventory = nextInventory;
  }

  const nextAffection: Affection = { ...state.affection };
  let affectionChanged = false;

  if (reward.affection_daiyu !== undefined) { nextAffection.daiyu += reward.affection_daiyu; affectionChanged = true; }
  if (reward.affection_baochai !== undefined) { nextAffection.baochai += reward.affection_baochai; affectionChanged = true; }
  if (reward.affection_xiangyun !== undefined) { nextAffection.xiangyun += reward.affection_xiangyun; affectionChanged = true; }
  if (reward.affection_tanchun !== undefined) { nextAffection.tanchun += reward.affection_tanchun; affectionChanged = true; }
  if (reward.affection_xiren !== undefined) { nextAffection.xiren += reward.affection_xiren; affectionChanged = true; }
  if (reward.affection_qingwen !== undefined) { nextAffection.qingwen += reward.affection_qingwen; affectionChanged = true; }
  if (reward.affection_miaoyu !== undefined) { nextAffection.miaoyu += reward.affection_miaoyu; affectionChanged = true; }

  if (affectionChanged) updates.affection = nextAffection;

  return updates;
}

export function applyCost(state: GameState, cost: Record<string, number | string | undefined>): Partial<GameState> {
  const updates: Partial<GameState> = {};

  if (cost.mood !== undefined) updates.mood = Math.max(0, state.mood - (cost.mood as number));
  if (cost.silver !== undefined) updates.silver = state.silver - (cost.silver as number);
  if (cost.item !== undefined) {
    const itemId = cost.item as string;
    updates.inventory = { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) - 1 };
  }

  return updates;
}

export function checkRequirements(state: GameState, req: Record<string, number | string | undefined>): string | null {
  if (req.talent !== undefined && state.talent < (req.talent as number)) {
    return `才学需达到 ${req.talent}`;
  }
  if (req.item !== undefined) {
    const itemId = req.item as string;
    if (!state.inventory[itemId] || state.inventory[itemId] <= 0) {
      return '道具不足';
    }
  }
  if (req.silver !== undefined && state.silver < (req.silver as number)) {
    return '银两不足';
  }
  if (req.mood !== undefined && state.mood < (req.mood as number)) {
    return '心情不足';
  }
  return null;
}

export function addLog(logs: string[], msg: string): string[] {
  return [msg, ...logs].slice(0, 5);
}
