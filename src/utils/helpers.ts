import type { GameState, EndingData, Affection, Weather } from '../types/game';
import { WEATHERS } from '../data/weathers';

export function getRandomWeather(): Weather {
  return WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
}

export function calculateEnding(state: GameState): EndingData {
  const { affection, talent } = state;

  if (affection.miaoyu >= 50) {
    return {
      id: 'miaoyu_ending',
      title: '红尘眷恋 (INTJ 跌落神坛)',
      desc: '你成功攻破了 INTJ 坚不可摧的心理防线，让清冷孤傲的槛外人，从此有了人间的牵绊。',
    };
  }
  if (affection.tanchun >= 50) {
    return {
      id: 'tanchun_ending',
      title: '秋爽斋合伙人 (ENTJ 联盟)',
      desc: '你协助探春完成了大观园的改革，成为了 ENTJ 最信任的左膀右臂，家族中兴指日可待。',
    };
  }
  if (talent >= 120) {
    return {
      id: 'study_ending',
      title: '崭露头角 (进化为 ENTJ)',
      desc: '你这段时间发奋苦读，才学大涨，连贾政都对你刮目相看，你终于成了符合贾府期望的卷王。',
    };
  }
  if (affection.daiyu >= 50) {
    return {
      id: 'daiyu_ending',
      title: '木石前盟 (高段位共情者)',
      desc: '你成功同频了 INFP 的精神世界，与黛玉两心相悦。大观园中，落花树下，留下了你们最美的誓言。',
    };
  }
  if (affection.baochai >= 50) {
    return {
      id: 'baochai_ending',
      title: '金玉良缘 (ESTJ 的贤内助)',
      desc: '你听从宝钗的规劝，行事越发稳重。在 ESTJ 强大家族荣誉感的驱动下，你们走向了世俗的成功。',
    };
  }
  if (affection.xiangyun >= 50) {
    return {
      id: 'xiangyun_ending',
      title: '诗酒作伴 (ESFP 的最佳玩伴)',
      desc: '你与湘云日日烤肉饮酒，吟诗作对，无拘无束，成了贾府里最快活的一对逍遥客。',
    };
  }
  if (affection.qingwen >= 40) {
    return {
      id: 'qingwen_ending',
      title: '千金难买一笑 (ENTP 灵魂挚友)',
      desc: '你在抄检风波中保全了她，又散尽千金只为博她一笑。你们在世俗的眼光中，活出了极致的自我。',
    };
  }
  if (affection.xiren >= 30) {
    return {
      id: 'xiren_ending',
      title: '温柔富贵乡 (ISFJ 守护者)',
      desc: '你沉溺在袭人的温柔照顾中，不再理会世俗功名，安安心心做了一个富贵闲人。',
    };
  }

  return {
    id: 'bad_ending',
    title: '大梦一场 (P人摆烂结局)',
    desc: '三十日转瞬即逝，你终究一事无成，只留下大观园中的一声叹息...你的 P 属性大爆发了。',
  };
}

export function applyReward(state: GameState, reward: Record<string, number | undefined>): Partial<GameState> {
  const updates: Partial<GameState> = {};

  if (reward.mood !== undefined) updates.mood = Math.min(100, state.mood + reward.mood);
  if (reward.talent !== undefined) updates.talent = Math.min(1000, state.talent + reward.talent);
  if (reward.silver !== undefined) updates.silver = state.silver + reward.silver;

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
