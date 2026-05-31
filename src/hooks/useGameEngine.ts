import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { GameState, ActionType, EventChoice, Weather } from '../types/game';
import { gameReducer, initialState, MAX_DAYS } from '../store/gameReducer';
import { HEROINES } from '../data/heroines';
import { NPCS } from '../data/npcs';
import { EVENT_DB } from '../data/events';
import { WEATHERS } from '../data/weathers';
import { LOCATIONS } from '../data/locations';
import { ITEMS } from '../data/items';
import { calculateEnding, addLog, checkRequirements } from '../utils/helpers';

const SAVE_KEY = 'redchamber_save_v2';
const ENDINGS_KEY = 'redchamber_endings_explore';

function getRandomWeather(): Weather {
  return WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
}

export interface GameEngine {
  state: GameState;
  startGame: () => void;
  goToMenu: () => void;
  goToGallery: () => void;
  setView: (view: GameState['currentView']) => void;
  handleAction: (actionType: ActionType) => void;
  exploreLocation: (locationId: string) => void;
  buyItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  handleChoice: (choice: EventChoice) => void;
  loadSave: () => boolean;
}

export function useGameEngine(): GameEngine {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load endings on mount
  useEffect(() => {
    try {
      const savedEndings = localStorage.getItem(ENDINGS_KEY);
      if (savedEndings) {
        dispatch({ type: 'SET_UNLOCKED_ENDINGS', payload: JSON.parse(savedEndings) });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save endings when they change
  useEffect(() => {
    try {
      localStorage.setItem(ENDINGS_KEY, JSON.stringify(state.unlockedEndings));
    } catch {
      // ignore
    }
  }, [state.unlockedEndings]);

  // Auto-save every day change
  useEffect(() => {
    if (state.gameScreen === 'playing') {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      } catch {
        // ignore
      }
    }
  }, [state.day, state.gameScreen]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const goToMenu = useCallback(() => {
    dispatch({ type: 'GO_TO_MENU' });
  }, []);

  const goToGallery = useCallback(() => {
    dispatch({ type: 'GO_TO_GALLERY' });
  }, []);

  const setView = useCallback((view: GameState['currentView']) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const advanceTime = useCallback((days = 0, steps = 1) => {
    const current = stateRef.current;
    let newStep = current.timeStep + steps;
    let newDay = current.day + days;
    let moodDecay = 0;
    let nextWeather = current.weather;
    let nextSilver = current.silver;
    let nextMood = current.mood;
    let nextLogs = [...current.logs];

    while (newStep > 2) {
      newStep -= 3;
      newDay += 1;
      moodDecay += 5;
      nextWeather = getRandomWeather();
      nextLogs = addLog(nextLogs, `【天气更新】今日${nextWeather.name}。`);

      if (newDay > MAX_DAYS) {
        const endingData = calculateEnding({ ...current, day: newDay, timeStep: newStep, weather: nextWeather, silver: nextSilver, mood: nextMood, logs: nextLogs });
        const nextUnlocked = current.unlockedEndings.includes(endingData.id)
          ? current.unlockedEndings
          : [...current.unlockedEndings, endingData.id];
        dispatch({
          type: 'LOAD_SAVE',
          payload: {
            day: newDay,
            timeStep: newStep,
            weather: nextWeather,
            silver: nextSilver,
            mood: nextMood,
            logs: nextLogs,
            endingData,
            unlockedEndings: nextUnlocked,
            gameScreen: 'ending',
          },
        });
        return;
      }

      if (newDay % 30 === 1 && newDay !== 1) {
        nextSilver += 200;
        nextLogs = addLog(nextLogs, '【凤姐发月钱】你领到了这个月的 200 两银子。');
      }
    }

    // Check fixed events
    if (newDay === 15 && !current.hasTriggeredPoetry && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          hasTriggeredPoetry: true,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【中期事件】海棠结社', mbti: '全员考核', avatar: '🌸', bg: 'bg-pink-100', border: 'border-pink-400' },
            text: "（秋爽斋）探春发起了『海棠诗社』，众姐妹各自吟诗作对，此刻正等着你赋诗一首以作压轴！\n\n【中期考核】：此乃扬名立万之大好时机，需要极高的才学！",
            choices: [
              { text: '技惊四座：挥毫写下千古绝句！ (需才学 > 80)', req: { talent: 80 }, reward: { silver: 300, mood: 50, affection_daiyu: 15, affection_baochai: 15, affection_xiangyun: 15, affection_tanchun: 15 }, reply: '你思如泉涌，连作三首佳作。贾政听闻后更是大喜，赏银三百两！', action: 'close_random_event' },
              { text: '勉强应付：抓耳挠腮凑几句打油诗 (心情大幅下降)', cost: { mood: 30 }, reward: {}, reply: '你憋了半天只写出几句打油诗，贾政派来的人连连摇头。你感到十分受挫。', action: 'close_random_event' },
            ],
          },
        },
      });
      return;
    }

    if (newDay === 25 && !current.hasTriggeredRaid && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          hasTriggeredRaid: true,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【危机大事件】抄检大观园', mbti: '家族大劫', avatar: '⚡', bg: 'bg-red-950', border: 'border-red-600' },
            text: "（怡红院）夜半时分，王善保家的奉王夫人之命，带人突击抄检大观园！\n她们凶神恶煞地翻箱倒柜，矛头直指你院里那个性格桀骜的晴雯！\n\n【生死考验】：若不加干预，晴雯将被逐出大观园，香消玉殒！",
            choices: [
              { text: '破财消灾：暗中塞满银票打点 (需银两 > 400)', req: { silver: 400 }, cost: { silver: 400 }, reward: { affection_qingwen: 30, mood: 20 }, reply: '你将厚厚一沓银票塞进王善保家的袖中。老虔婆掂了掂分量冷笑一声带人撤了。晴雯保住了一命。', action: 'close_random_event' },
              { text: '据理力争：用圣贤书压制刁奴 (需才学 > 120)', req: { talent: 120 }, reward: { affection_qingwen: 30, talent: 20 }, reply: '你引经据典言辞犀利，将王夫人的陪房训得哑口无言。众人见你如今已有老爷的风范，不敢造次退下了。', action: 'close_random_event' },
              { text: '无能为力：眼看晴雯被拖走 (心情与好感清零)', cost: { mood: 100 }, reward: { affection_qingwen: -100 }, reply: '你懦弱地站在一旁。晴雯绝望地看着你，被婆子们强行拖走。这一去便是死别...你心中郁结到了极点。', action: 'close_random_event' },
            ],
          },
        },
      });
      return;
    }

    // Mood decay check
    if (moodDecay > 0 && !current.isSick) {
      nextMood = Math.max(0, nextMood - moodDecay);
      if (nextMood <= 0) {
        dispatch({
          type: 'LOAD_SAVE',
          payload: {
            day: newDay,
            timeStep: newStep,
            weather: nextWeather,
            silver: nextSilver,
            mood: 0,
            logs: addLog(nextLogs, `夜深了，一天的烦杂让你心情自然下降了 ${moodDecay} 点。`),
            isSick: true,
            currentEvent: {
              req: 0,
              character: { id: 'system', name: '系统提示', mbti: '系统', avatar: '💊', bg: 'bg-red-50' },
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
          },
        });
        return;
      }
      nextLogs = addLog(nextLogs, `夜深了，一天的烦杂让你心情自然下降了 ${moodDecay} 点。`);
    }

    dispatch({
      type: 'LOAD_SAVE',
      payload: {
        day: newDay,
        timeStep: newStep,
        weather: nextWeather,
        silver: nextSilver,
        mood: nextMood,
        logs: nextLogs,
      },
    });
  }, []);

  const triggerRandomEvent = useCallback(() => {
    const current = stateRef.current;
    const rand = Math.random();

    if (rand < 0.4) {
      const requiredTalent = Math.min(100, 20 + current.day * 2);
      dispatch({
        type: 'SET_EVENT',
        payload: {
          req: 0,
          isRandomEvent: true,
          character: NPCS.jiazheng,
          text: `（书房）贾政(${NPCS.jiazheng.mbti})派人将你叫去考较学问："我来考考你《大学》。"\n\n【考验】：才学需达到 ${requiredTalent} 才能应对。`,
          choices: [
            { text: '对答如流 (需才学达标)', req: { talent: requiredTalent }, reward: { silver: 150, mood: 20 }, reply: '贾政点点头："还算没全荒废，拿些银子去买书。"', action: 'close_random_event' },
            { text: '支支吾吾 (心情大幅下降)', cost: { mood: 40 }, reward: {}, reply: '贾政大怒："业精于勤荒于嬉！请家法！"你挨了一顿板子。', action: 'close_random_event' },
          ],
        },
      });
    } else if (rand < 0.7) {
      dispatch({
        type: 'SET_EVENT',
        payload: {
          req: 0,
          isRandomEvent: true,
          character: NPCS.jiamu,
          text: `（荣庆堂）贾母(${NPCS.jiamu.mbti})见你进来，笑得合不拢嘴："我的乖孙儿，快来看看是不是瘦了？"`,
          choices: [
            { text: '提供 ESFJ 需要的情绪共鸣', reward: { silver: 100, mood: 20 }, reply: '贾母十分欢喜，赏了你些碎银子。', action: 'close_random_event' },
          ],
        },
      });
    } else {
      dispatch({
        type: 'SET_EVENT',
        payload: {
          req: 0,
          isRandomEvent: true,
          character: NPCS.zhao,
          text: `（回廊）你不小心撞见赵姨娘(${NPCS.zhao.mbti})，她阴阳怪气地讽刺了你几句。`,
          choices: [
            { text: '不理会她 (心情 -15)', cost: { mood: 15 }, reply: '你懒得跟 ESTP 计较，但还是觉得晦气。', action: 'close_random_event' },
            { text: '花钱打发 (消耗 50 银两)', cost: { silver: 50 }, reply: '你丢给她碎银子，她立刻换了谄媚的笑脸走了。', action: 'close_random_event' },
          ],
        },
      });
    }
  }, []);

  const handleAction = useCallback((actionType: ActionType) => {
    const current = stateRef.current;
    if (current.isSick) return;

    let costMood = 0;
    let gainTalent = 0;
    let gainMood = 0;
    let gainSilver = 0;
    let msg = '';

    const hasBuff = current.mood >= 80;
    let talentMultiplier = hasBuff ? 1.5 : 1;

    if (current.weather.id === 'rainy' && (actionType === 'school' || actionType === 'study_hard')) {
      talentMultiplier += 0.5;
    }

    switch (actionType) {
      case 'school':
        costMood = 10;
        gainTalent = Math.floor(5 * talentMultiplier);
        msg = `在族学听讲半日。才学 +${gainTalent}，心情 -${costMood}。${current.weather.id === 'rainy' ? '(雨声阵阵，让人更能静下心来)' : ''}`;
        break;
      case 'study_hard':
        costMood = 15;
        gainTalent = Math.floor(8 * talentMultiplier);
        msg = `闭门苦读半日。才学 +${gainTalent}，心情 -${costMood}。${current.weather.id === 'rainy' ? '(阴雨天真是读书的好时候)' : ''}`;
        break;
      case 'rest':
        gainMood = 20;
        msg = `在厢房美美地睡了一个午觉。心情 +${gainMood}。`;
        break;
      case 'poem':
        costMood = 15;
        const successChance = Math.min(0.9, current.talent / 100);
        if (Math.random() < successChance) {
          gainSilver = 50 + Math.floor(current.talent / 2);
          msg = `你灵感迸发，写下一首佳作卖予书坊！银两 +${gainSilver}，心情 -${costMood}。`;
        } else {
          msg = `你枯坐半日，未能憋出好句，反倒惹得心烦意乱。心情 -${costMood}。`;
        }
        break;
      case 'pawn':
        costMood = 20;
        gainSilver = 150;
        msg = `让茗烟去当铺死当旧物。银两 +${gainSilver}，心情 -${costMood}。`;
        break;
    }

    if (current.mood - costMood <= 0 && actionType !== 'rest') {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          mood: 0,
          isSick: true,
          currentEvent: {
            req: 0,
            character: { id: 'system', name: '系统提示', mbti: '系统', avatar: '💊', bg: 'bg-red-50' },
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
        },
      });
      return;
    }

    const nextTalent = Math.min(1000, current.talent + gainTalent);
    const nextSilver = current.silver + gainSilver;
    const nextMood = Math.min(100, Math.max(0, current.mood - costMood + gainMood));

    dispatch({
      type: 'LOAD_SAVE',
      payload: {
        talent: gainTalent > 0 ? nextTalent : current.talent,
        silver: nextSilver,
        mood: nextMood,
        logs: addLog(current.logs, msg),
      },
    });

    advanceTime();

    if (Math.random() < 0.15 && actionType !== 'rest') {
      setTimeout(() => triggerRandomEvent(), 0);
    }
  }, [advanceTime, triggerRandomEvent]);

  const exploreLocation = useCallback((locationId: string) => {
    const current = stateRef.current;
    if (current.isSick) return;

    let costMood = 0;
    let gainMood = 15;

    if (current.weather.id === 'sunny') {
      gainMood += 10;
    } else if (current.weather.id === 'rainy') {
      gainMood = -5;
      costMood = 5;
    }

    if (current.mood - costMood <= 0) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          mood: 0,
          isSick: true,
          currentEvent: {
            req: 0,
            character: { id: 'system', name: '系统提示', mbti: '系统', avatar: '💊', bg: 'bg-red-50' },
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
        },
      });
      return;
    }

    const possibleHeroines = Object.values(HEROINES).filter(h => h.location === locationId);

    if (possibleHeroines.length > 0) {
      const heroineObj = possibleHeroines[Math.floor(Math.random() * possibleHeroines.length)];
      const currentAffection = current.affection[heroineObj.id as keyof typeof current.affection];
      const events = EVENT_DB[heroineObj.id];
      let availableEvent = events[0];

      for (let i = events.length - 1; i >= 0; i--) {
        if (currentAffection >= events[i].req) {
          availableEvent = events[i];
          break;
        }
      }

      dispatch({
        type: 'SET_EVENT',
        payload: { ...availableEvent, character: heroineObj },
      });
    } else {
      const nextMood = Math.min(100, Math.max(0, current.mood + gainMood));
      const weatherText = current.weather.id === 'sunny' ? '(阳光明媚，心情大好)' : current.weather.id === 'rainy' ? '(细雨弄湿了衣摆，有些心烦)' : '';
      const locName = LOCATIONS[locationId]?.name || '未知地点';
      const msg = `你在${locName}闲逛了半日。${weatherText} 心情 ${gainMood >= 0 ? '+' : ''}${gainMood}`;

      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          mood: nextMood,
          logs: addLog(current.logs, msg),
        },
      });
      advanceTime();

      if (Math.random() < 0.15) {
        setTimeout(() => triggerRandomEvent(), 0);
      }
    }
  }, [advanceTime, triggerRandomEvent]);

  const buyItem = useCallback((itemId: string) => {
    const item = ITEMS[itemId];
    if (!item) return;
    dispatch({ type: 'BUY_ITEM', payload: itemId });
  }, []);

  const useItem = useCallback((itemId: string) => {
    dispatch({ type: 'USE_ITEM', payload: itemId });
  }, []);

  const handleChoice = useCallback((choice: EventChoice) => {
    const current = stateRef.current;

    const reqError = checkRequirements(current, (choice.req || {}) as Record<string, number | string | undefined>);
    if (reqError) {
      dispatch({ type: 'ADD_LOG', payload: `【条件不足】${reqError}。` });
      return;
    }

    if (choice.cost?.silver !== undefined && current.silver < choice.cost.silver) {
      dispatch({ type: 'ADD_LOG', payload: '【银两不足】' });
      return;
    }
    if (choice.cost?.mood !== undefined && current.mood < choice.cost.mood) {
      dispatch({ type: 'ADD_LOG', payload: '【精神内耗】太累了，无法应对。' });
      return;
    }
    if (choice.cost?.item !== undefined && (!current.inventory[choice.cost.item] || current.inventory[choice.cost.item] <= 0)) {
      dispatch({ type: 'ADD_LOG', payload: `【道具不足】需要【${ITEMS[choice.cost.item]?.name || '未知物品'}】。` });
      return;
    }

    dispatch({ type: 'APPLY_CHOICE', payload: choice });

    if (choice.specialAction !== 'recover_sick' && choice.action !== 'close_random_event') {
      advanceTime();
    } else if (choice.specialAction === 'recover_sick') {
      dispatch({ type: 'RECOVER_SICK' });
      advanceTime(0, 9);
    }
  }, [advanceTime]);

  const loadSave = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVE', payload: parsed });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  return {
    state,
    startGame,
    goToMenu,
    goToGallery,
    setView,
    handleAction,
    exploreLocation,
    buyItem,
    useItem,
    handleChoice,
    loadSave,
  };
}
