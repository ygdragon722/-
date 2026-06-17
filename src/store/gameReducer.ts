import type { ChoiceTone, GameState, GameAction, HeroineId, MbtiInsight } from '../types/game';
import { WEATHERS } from '../data/weathers';
import { calculateEnding, addLog } from '../utils/helpers';

export const MAX_DAYS = 30;
export const TIME_LABELS = ['上午', '下午', '晚上'];
export const HEROINE_IDS: HeroineId[] = ['daiyu', 'baochai', 'xiangyun', 'tanchun', 'xiren', 'qingwen', 'miaoyu'];

export const HEROINE_TONES: Record<HeroineId, ChoiceTone> = {
  daiyu: 'empathy',
  baochai: 'planning',
  xiangyun: 'play',
  tanchun: 'reform',
  xiren: 'care',
  qingwen: 'rebel',
  miaoyu: 'aesthetic',
};

const initialMbtiInsight: MbtiInsight = {
  daiyu: 0,
  baochai: 0,
  xiangyun: 0,
  tanchun: 0,
  xiren: 0,
  qingwen: 0,
  miaoyu: 0,
};

function isHeroineId(id: string | undefined): id is HeroineId {
  return Boolean(id && HEROINE_IDS.includes(id as HeroineId));
}

export function normalizeGameState(state: GameState): GameState {
  return {
    ...state,
    completedEvents: Array.isArray(state.completedEvents) ? state.completedEvents : [],
    mbtiInsight: {
      ...initialMbtiInsight,
      ...(state.mbtiInsight || {}),
    },
    storyFlags: state.storyFlags || {},
  };
}

export const initialState: GameState = {
  day: 1,
  timeStep: 0,
  currentLocation: 'yihong',
  weather: WEATHERS[0],
  talent: 20,
  mood: 60,
  silver: 500,
  inventory: { rouge: 1, book_collection: 1 },
  currentView: 'garden',
  affection: {
    daiyu: 0,
    baochai: 0,
    xiangyun: 0,
    tanchun: 0,
    xiren: 0,
    qingwen: 0,
    miaoyu: 0,
  },
  currentEvent: null,
  logs: ['大观园的生活开始了。留意第 25 天的危机！'],
  isSick: false,
  gameScreen: 'menu',
  maxDays: MAX_DAYS,
  endingData: null,
  unlockedEndings: [],
  completedEvents: [],
  mbtiInsight: initialMbtiInsight,
  storyFlags: {},
  hasTriggeredPoetry: false,
  hasTriggeredRaid: false,
  hasTriggeredDay18: false,
  hasTriggeredDay20: false,
  hasTriggeredDay22: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...initialState,
        unlockedEndings: state.unlockedEndings,
        logs: ['大观园的生活开始了。栊翠庵的红梅开了。'],
        gameScreen: 'playing',
      };
    }

    case 'GO_TO_MENU': {
      return { ...state, gameScreen: 'menu', currentEvent: null };
    }

    case 'GO_TO_GALLERY': {
      return { ...state, gameScreen: 'gallery' };
    }

    case 'GO_TO_ENDING': {
      return { ...state, gameScreen: 'ending' };
    }

    case 'SET_VIEW': {
      return { ...state, currentView: action.payload };
    }

    case 'SET_EVENT': {
      return { ...state, currentEvent: action.payload };
    }

    case 'CLEAR_EVENT': {
      return { ...state, currentEvent: null };
    }

    case 'ADVANCE_TIME': {
      const { days = 0, steps = 1 } = action.payload || {};
      let newStep = state.timeStep + steps;
      let newDay = state.day + days;
      let moodDecay = 0;
      let nextWeather = state.weather;
      let nextSilver = state.silver;
      let nextMood = state.mood;
      let nextLogs = state.logs;
      let shouldEnd = false;

      while (newStep > 2) {
        newStep -= 3;
        newDay += 1;
        moodDecay += 5;
        nextWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
        nextLogs = addLog(nextLogs, `【天气更新】今日${nextWeather.name}。`);

        if (newDay > MAX_DAYS) {
          shouldEnd = true;
          break;
        }

        if (newDay % 30 === 1 && newDay !== 1) {
          nextSilver += 200;
          nextLogs = addLog(nextLogs, '【凤姐发月钱】你领到了这个月的 200 两银子。');
        }
      }

      if (shouldEnd) {
        const endingData = calculateEnding({ ...state, day: newDay, timeStep: newStep, weather: nextWeather, silver: nextSilver, mood: nextMood });
        const nextUnlocked = state.unlockedEndings.includes(endingData.id)
          ? state.unlockedEndings
          : [...state.unlockedEndings, endingData.id];
        return {
          ...state,
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          endingData,
          unlockedEndings: nextUnlocked,
          gameScreen: 'ending',
        };
      }

      if (moodDecay > 0 && !state.isSick) {
        nextMood = Math.max(0, nextMood - moodDecay);
        if (nextMood <= 0) {
          return {
            ...state,
            day: newDay,
            timeStep: newStep,
            weather: nextWeather,
            silver: nextSilver,
            mood: 0,
            logs: addLog(nextLogs, `夜深了，一天的烦杂让你心情自然下降了 ${moodDecay} 点。`),
            isSick: true,
            currentEvent: {
              req: 0,
              text: '【大病一场】\n你因心情过于郁结，终于支撑不住病倒了。王夫人急忙请太医来看诊，不仅耗费了大量银两抓药，你还被迫在床上躺了整整三天。',
              choices: [
                {
                  text: '卧床静养 (消耗 3 天，扣除 150 银两，恢复 50 心情)',
                  cost: { silver: 150 },
                  reward: { mood: 50 },
                  specialAction: 'recover_sick',
                },
              ],
            },
          };
        }
        nextLogs = addLog(nextLogs, `夜深了，一天的烦杂让你心情自然下降了 ${moodDecay} 点。`);
      }

      return {
        ...state,
        day: newDay,
        timeStep: newStep,
        weather: nextWeather,
        silver: nextSilver,
        mood: nextMood,
        logs: nextLogs,
      };
    }

    case 'APPLY_CHOICE': {
      const choice = action.payload;
      const eventId = state.currentEvent?.id;

      if (eventId && state.completedEvents.includes(eventId)) {
        return {
          ...state,
          currentEvent: null,
          logs: addLog(state.logs, '【梦册】这段往事已记入梦册，不再重复结算。'),
        };
      }

      let nextState = { ...state };

      if (choice.cost?.silver !== undefined) {
        nextState = { ...nextState, silver: nextState.silver - choice.cost.silver };
      }
      if (choice.cost?.mood !== undefined) {
        nextState = { ...nextState, mood: Math.max(0, nextState.mood - choice.cost.mood) };
      }
      if (choice.cost?.item !== undefined) {
        nextState = {
          ...nextState,
          inventory: {
            ...nextState.inventory,
            [choice.cost.item]: (nextState.inventory[choice.cost.item] || 0) - 1,
          },
        };
      }

      if (choice.reward?.mood !== undefined) {
        nextState = { ...nextState, mood: Math.min(100, nextState.mood + choice.reward.mood) };
      }
      if (choice.reward?.talent !== undefined) {
        nextState = { ...nextState, talent: Math.min(1000, nextState.talent + choice.reward.talent) };
      }
      if (choice.reward?.silver !== undefined) {
        nextState = { ...nextState, silver: nextState.silver + choice.reward.silver };
      }

      if (choice.reward?.items) {
        const nextInventory = { ...nextState.inventory };
        for (const [itemId, qty] of Object.entries(choice.reward.items)) {
          nextInventory[itemId] = (nextInventory[itemId] || 0) + qty;
        }
        nextState = { ...nextState, inventory: nextInventory };
      }

      const nextAffection = { ...nextState.affection };
      let affectionChanged = false;
      if (choice.reward?.affection_daiyu !== undefined) { nextAffection.daiyu += choice.reward.affection_daiyu; affectionChanged = true; }
      if (choice.reward?.affection_baochai !== undefined) { nextAffection.baochai += choice.reward.affection_baochai; affectionChanged = true; }
      if (choice.reward?.affection_xiangyun !== undefined) { nextAffection.xiangyun += choice.reward.affection_xiangyun; affectionChanged = true; }
      if (choice.reward?.affection_tanchun !== undefined) { nextAffection.tanchun += choice.reward.affection_tanchun; affectionChanged = true; }
      if (choice.reward?.affection_xiren !== undefined) { nextAffection.xiren += choice.reward.affection_xiren; affectionChanged = true; }
      if (choice.reward?.affection_qingwen !== undefined) { nextAffection.qingwen += choice.reward.affection_qingwen; affectionChanged = true; }
      if (choice.reward?.affection_miaoyu !== undefined) { nextAffection.miaoyu += choice.reward.affection_miaoyu; affectionChanged = true; }
      if (affectionChanged) {
        nextState = { ...nextState, affection: nextAffection };
      }

      const characterId = state.currentEvent?.character?.id;
      if (choice.tone && isHeroineId(characterId) && HEROINE_TONES[characterId] === choice.tone) {
        const nextInsight = {
          ...nextState.mbtiInsight,
          [characterId]: Math.min(100, nextState.mbtiInsight[characterId] + 5),
        };
        nextState = { ...nextState, mbtiInsight: nextInsight };
      }

      if (choice.specialAction === 'recover_sick') {
        nextState = {
          ...nextState,
          isSick: false,
          logs: addLog(nextState.logs, '休养三天后，身体康复了。'),
        };
      } else if (choice.reply) {
        if (choice.action === 'close_random_event') {
          nextState = { ...nextState, logs: addLog(nextState.logs, `[大事件记录] ${choice.reply}`) };
        } else {
          nextState = { ...nextState, logs: addLog(nextState.logs, `[${state.currentEvent?.character?.name || '未知'}] ${choice.reply}`) };
        }
      }

      if (eventId) {
        nextState = {
          ...nextState,
          completedEvents: nextState.completedEvents.includes(eventId)
            ? nextState.completedEvents
            : [...nextState.completedEvents, eventId],
        };
      }

      nextState = { ...nextState, currentEvent: null };
      return nextState;
    }

    case 'HANDLE_ACTION': {
      // This should be handled in the hook with logic calculation
      return state;
    }

    case 'EXPLORE_LOCATION': {
      // This should be handled in the hook with logic calculation
      return state;
    }

    case 'MOVE_TO': {
      return { ...state, currentLocation: action.payload };
    }

    case 'BUY_ITEM': {
      const itemId = action.payload;
      const itemPrice = (() => {
        switch (itemId) {
          case 'book_collection': return 150;
          case 'rouge': return 80;
          case 'wine': return 100;
          case 'watch': return 250;
          case 'fan': return 120;
          case 'tea': return 200;
          case 'ginseng': return 300;
          default: return 0;
        }
      })();
      const itemName = (() => {
        switch (itemId) {
          case 'book_collection': return '绝版古诗集';
          case 'rouge': return '上等胭脂';
          case 'wine': return '惠泉酒';
          case 'watch': return '西洋怀表';
          case 'fan': return '名贵折扇';
          case 'tea': return '老君眉';
          case 'ginseng': return '百年人参';
          default: return '未知物品';
        }
      })();

      if (state.silver >= itemPrice) {
        return {
          ...state,
          silver: state.silver - itemPrice,
          inventory: {
            ...state.inventory,
            [itemId]: (state.inventory[itemId] || 0) + 1,
          },
          logs: addLog(state.logs, `在集市购买了【${itemName}】。`),
        };
      }
      return { ...state, logs: addLog(state.logs, `【银两不足】买不起 ${itemName}。`) };
    }

    case 'USE_ITEM': {
      const itemId = action.payload;
      const qty = state.inventory[itemId] || 0;
      if (qty > 0 && itemId === 'ginseng') {
        const nextInventory = { ...state.inventory, [itemId]: qty - 1 };
        let nextLogs = addLog(state.logs, '服用了【百年人参】，气血充盈！(+40心情)');
        let nextIsSick = state.isSick;
        if (state.isSick) {
          nextIsSick = false;
          nextLogs = addLog(nextLogs, '人参药效奇佳，大病痊愈了！');
        }
        return {
          ...state,
          inventory: nextInventory,
          mood: Math.min(100, state.mood + 40),
          isSick: nextIsSick,
          logs: nextLogs,
        };
      }
      return state;
    }

    case 'RECOVER_SICK': {
      return { ...state, isSick: false };
    }

    case 'TRIGGER_ENDING': {
      const endingData = calculateEnding(state);
      const nextUnlocked = state.unlockedEndings.includes(endingData.id)
        ? state.unlockedEndings
        : [...state.unlockedEndings, endingData.id];
      return {
        ...state,
        endingData,
        unlockedEndings: nextUnlocked,
        gameScreen: 'ending',
      };
    }

    case 'ADD_LOG': {
      return { ...state, logs: addLog(state.logs, action.payload) };
    }

    case 'LOAD_SAVE': {
      return normalizeGameState({ ...state, ...action.payload });
    }

    case 'SET_UNLOCKED_ENDINGS': {
      return { ...state, unlockedEndings: action.payload };
    }

    case 'TRIGGER_RANDOM_EVENT': {
      return state;
    }

    default:
      return state;
  }
}
