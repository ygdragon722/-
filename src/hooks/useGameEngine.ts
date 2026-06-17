import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { GameState, ActionType, EventChoice, GameEvent, Heroine, Weather } from '../types/game';
import { gameReducer, initialState, MAX_DAYS, MAX_ACTION_POINTS } from '../store/gameReducer';
import { HEROINES } from '../data/heroines';
import { EVENT_DB } from '../data/events';
import { WEATHERS } from '../data/weathers';
import { LOCATIONS } from '../data/locations';
import { ITEMS } from '../data/items';
import { pickRandomEvent } from '../data/randomEvents';
import { pickExploreEvent } from '../data/exploreEvents';
import { calculateEnding, addLog, checkRequirements } from '../utils/helpers';

const SAVE_KEY = 'redchamber_save_v2';
const ENDINGS_KEY = 'redchamber_endings_explore';

function getRandomWeather(): Weather {
  return WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
}

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createRouteHintEvent(heroine: Heroine, affection: number, nextEvent?: GameEvent): NonNullable<GameState['currentEvent']> {
  if (!nextEvent) {
    return {
      req: 0,
      character: heroine,
      text: `（${heroine.title}）你今日又来寻${heroine.name}，二人闲话片刻，倒也自在。\n\n【梦册】${heroine.name}当前已无可触发剧情，后续章节还待补写。`,
      choices: [
        {
          text: '暂且记下',
          reply: '这一日没有新的波澜，却也不是全无意味。',
        },
      ],
    };
  }

  const gap = Math.max(0, nextEvent.req - affection);

  return {
    req: 0,
    character: heroine,
    text: `（${heroine.title}）你来到${heroine.name}常在之处，却觉得今日机缘未至。\n\n【梦册提示】下一段「${nextEvent.title || '未名剧情'}」尚未触发。${nextEvent.hint || '还需继续加深关系。'}${gap > 0 ? `\n\n当前好感还差 ${gap} 点。` : ''}`,
    choices: [
      {
        text: '记下线索',
        reply: '你将这点蛛丝马迹记在心里，准备择日再来。',
      },
    ],
  };
}

export interface GameEngine {
  state: GameState;
  startGame: () => void;
  goToMenu: () => void;
  goToGallery: () => void;
  setView: (view: GameState['currentView']) => void;
  handleAction: (actionType: ActionType) => void;
  exploreLocation: (locationId: string) => void;
  moveTo: (locationId: string) => void;
  buyItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  handleChoice: (choice: EventChoice) => void;
  loadSave: () => boolean;
}

export function useGameEngine(): GameEngine {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
  }, [state.day, state.gameScreen, state]);

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

      if (newDay === 10 || newDay === 20) {
        nextSilver += 200;
        nextLogs = addLog(nextLogs, '【凤姐发月钱】你领到了这旬的 200 两银子。');
      }
    }

    // Check fixed events
    if (newDay === 5 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'system', name: '系统提示', mbti: '系统', avatar: '📜', bg: 'bg-amber-50', border: 'border-amber-400' },
            text: '【初入大观园】\n你已在园中生活了数日，渐渐习惯了这里的生活节奏。袭人提醒你：每日读书、游园、与姐妹们相处，都要兼顾。心情太低会病倒，银两不足也会寸步难行。\n\n（第25天似乎会有大事发生，请做好准备）',
            choices: [
              { text: '铭记于心 (获得 100 两安家费)', reward: { silver: 100, mood: 10 }, reply: '你点点头，将袭人的话记在心里。', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 10 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'fengjie', name: '王熙凤', mbti: 'ENTJ', avatar: '💄', bg: 'bg-red-50', border: 'border-red-400' },
            text: '（账房）王熙凤翻着账本，抬头瞥了你一眼："宝兄弟，这个月的园子维护费该交了。看在老祖宗的面上，收你 80 两。"\n\n【例行公事】：大户人家子弟也要为家族出力。',
            choices: [
              { text: '爽快交钱 (80 两)', req: { silver: 80 }, cost: { silver: 80 }, reward: { mood: 5 }, reply: '王熙凤满意地收起银子："这才像贾家的爷们。"', action: 'close_random_event' },
              { text: '讨价还价 (心情 -10)', cost: { mood: 10 }, reward: {}, reply: '王熙凤冷笑："这点银子也拿不出？传出去让人笑话。"你只好灰溜溜地走了。', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 15 && !current.hasTriggeredPoetry && !current.isSick) {
      // 根据 mbtiInsight 找出理解度最高且 ≥ 20 的角色，动态生成帮助选项
      const insightEntries = Object.entries(current.mbtiInsight) as [string, number][];
      const topEntry = insightEntries.sort((a, b) => b[1] - a[1])[0];
      const [topHeroineId, topInsight] = topEntry ?? ['', 0];
      const helperChoiceMap: Record<string, { name: string; text: string; reply: string; reward: object }> = {
        daiyu:    { name: '林黛玉', text: '请黛玉代为润色诗稿（需 黛玉理解度 ≥ 20）', reply: '黛玉轻轻笑了："你平日里倒也看了不少书，借一借灵气罢了。"她提笔略加点染，诗稿顿时焕然一新，众姐妹拍案叫绝。', reward: { mood: 40, affection_daiyu: 20, affection_xiangyun: 5, affection_tanchun: 5 } },
        baochai:  { name: '薛宝钗', text: '请宝钗从仕途角度润色（需 宝钗理解度 ≥ 20）', reply: '宝钗沉吟片刻，为你改了几处用典，格调顿时雅致许多。众人称赞，贾政那边也传来好消息。', reward: { mood: 30, talent: 20, affection_baochai: 20, silver: 150 } },
        xiangyun: { name: '史湘云', text: '请湘云现场即兴补救，炒热气氛（需 湘云理解度 ≥ 20）', reply: '湘云拍掌大笑，率先为你的诗鼓掌叫好，带动众人情绪，场面热闹非凡，你的不足反而无人深究。', reward: { mood: 50, affection_xiangyun: 20, affection_daiyu: 5 } },
        tanchun:  { name: '贾探春', text: '请探春以诗社主人身份力保（需 探春理解度 ≥ 20）', reply: '探春站出来道："今日重在雅趣，二哥哥能来已是心意。"她的周全让局面顺利收场，又私下点拨你几句。', reward: { mood: 30, talent: 25, affection_tanchun: 20 } },
        miaoyu:   { name: '妙玉', text: '默念妙玉点评的那首诗，以茶道意境破题（需 妙玉理解度 ≥ 20）', reply: '你借妙玉言语中的禅意入诗，清冷脱俗，众人虽未全懂，却齐声称奇。黛玉悄悄向你点了点头。', reward: { mood: 35, affection_miaoyu: 15, affection_daiyu: 10, talent: 10 } },
      };
      const helperChoice = topInsight >= 20 && helperChoiceMap[topHeroineId]
        ? {
            text: helperChoiceMap[topHeroineId].text,
            reward: helperChoiceMap[topHeroineId].reward,
            reply: helperChoiceMap[topHeroineId].reply,
            action: 'close_random_event' as const,
          }
        : null;
      const poetryChoices = [
        { text: '技惊四座：挥毫写下千古绝句！ (需才学 > 80)', req: { talent: 80 }, reward: { silver: 300, mood: 50, affection_daiyu: 15, affection_baochai: 15, affection_xiangyun: 15, affection_tanchun: 15 }, reply: '你思如泉涌，连作三首佳作。贾政听闻后更是大喜，赏银三百两！众姐妹投来赞许的目光。', action: 'close_random_event' as const },
        ...(helperChoice ? [helperChoice] : []),
        { text: '勉强应付：抓耳挠腮凑几句打油诗 (心情 -30)', cost: { mood: 30 }, reward: {}, reply: '你憋了半天只写出几句打油诗，贾政派来的人连连摇头。你感到十分受挫。', action: 'close_random_event' as const },
      ];
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
            character: { id: 'event', name: '【中期考核】海棠结社', mbti: '才学 · 理解度', avatar: '🌸', bg: 'bg-pink-100', border: 'border-pink-400' },
            text: "（秋爽斋）探春发起了『海棠诗社』，众姐妹各自吟诗作对，此刻正等着你赋诗一首以作压轴！\n\n才学越高越能独立发挥；与某位姐妹理解深厚，也可借她之力解围。",
            choices: poetryChoices,
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 16 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【铺垫】冷香暗送', mbti: '金玉良缘', avatar: '💠', bg: 'bg-slate-100', border: 'border-slate-400' },
            text: '（蘅芜苑）宝钗从袖中取出一枚冷香丸，递到你手中。\n"这丸子配了十二味花蕊，一年才得一颗。你近日气色不好，拿着罢。"\n\n【伏笔】：她待你总是这般周全，周全得像是...像是早已认定了什么。',
            choices: [
              { text: '郑重收下："宝姐姐费心了。" (心情 +15)', reward: { mood: 15, affection_baochai: 10 }, reply: '宝钗微微一笑，那笑容里有一丝不易察觉的温柔："你能记着，便好。"', action: 'close_random_event' },
              { text: '转手送人："我正巧想给林妹妹带些东西。" (宝钗好感 -5)', reward: { affection_baochai: -5, mood: 5 }, reply: '宝钗神色一滞，随即恢复如常："也好，她身子弱，正该补补。"她转身进了里屋，再没出来。', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 18 && !current.hasTriggeredDay18 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          hasTriggeredDay18: true,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【园中风波】流言蜚语', mbti: '危机信号', avatar: '⚠', bg: 'bg-orange-950', border: 'border-orange-600' },
            text: '（怡红院）袭人悄悄把你拉到一旁，神色凝重：\n"二爷，外头有人说晴雯姐姐的闲话，说她勾引二爷。王夫人那边似乎也听说了些什么。"\n\n袭人叹了口气："若不早些想个办法，只怕第 25 天会出大事。"',
            choices: [
              { text: '先备下银两以防万一（目标：攒够 400 两用于第 25 天）', reward: { mood: -5 }, reply: '你心中有了防备，默默把这话记在心里。', action: 'close_random_event' },
              { text: '去给晴雯提个醒，让她近期收敛些', reward: { affection_qingwen: -5, mood: 5 }, reply: '晴雯翻了个白眼："我行得正坐得直，收敛什么！"她倒是没往心里去，你却多了几分担忧。', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 20 && !current.hasTriggeredDay20 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          hasTriggeredDay20: true,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【园中风波】上房问话', mbti: '危机加剧', avatar: '⚡', bg: 'bg-red-950', border: 'border-red-700' },
            text: '（荣庆堂）你被王夫人叫去问话。\n"宝玉，我听说你近日在园里与丫鬟们走得极近，此事是真是假？"\n\n她语气平静，眼神却冷得像深秋的水。',
            choices: [
              { text: '如实说：只是正常相处，并无逾矩 (消耗 10 心情)', cost: { mood: 10 }, reward: { talent: 5 }, reply: '王夫人沉默片刻，摆手让你退下。你感到第 25 天的危机越来越近了。', action: 'close_random_event' },
              { text: '花钱堵嘴：私下打点王善保家的 (消耗 100 两)', cost: { silver: 100 }, reward: { mood: 5 }, reply: '你托人往王善保家的那边走了个礼，那边消停了几日。但不知能撑多久。', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 22 && !current.hasTriggeredDay22 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          hasTriggeredDay22: true,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【园中风波】账目告急', mbti: '财务预警', avatar: '📋', bg: 'bg-amber-950', border: 'border-amber-600' },
            text: '（秋爽斋）探春面色凝重，将一本账册摊在你面前：\n"二哥哥，再过几日府里恐怕要出大事。凤姐姐那边账目亏空了，老太太那里还蒙着，到时候恐怕几处都要紧着用银子。"\n\n她压低声音："你手头若还有余钱，这几日先别花了。"',
            choices: [
              { text: '听从劝告，立刻节省开支', reward: { mood: -5, talent: 10 }, reply: '你默默把手头能收的收了收，心里对第 25 天多了一份准备。', action: 'close_random_event' },
              { text: '把 200 两交给探春统筹调度 (消耗 200 两)', cost: { silver: 200 }, reward: { affection_tanchun: 10, talent: 15 }, reply: '探春眼中闪过一丝感激："难得你识大局。这钱我替你用在刀刃上。"', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 24 && !current.isSick) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          day: newDay,
          timeStep: newStep,
          weather: nextWeather,
          silver: nextSilver,
          mood: nextMood,
          logs: nextLogs,
          currentEvent: {
            req: 0,
            isRandomEvent: true,
            character: { id: 'event', name: '【铺垫】槛外送梅', mbti: '欲洁何曾洁', avatar: '🌸', bg: 'bg-stone-100', border: 'border-stone-400' },
            text: '（栊翠庵）老嬷嬷递给你一枝红梅，花瓣上还带着雪。\n"姑娘说，今日雪好，梅也开得好，让你...让你看看就走。"\n\n【伏笔】：红梅映雪，艳得刺眼。你握着那枝梅，觉得它烫手。',
            choices: [
              { text: '附诗回赠："我回她一首诗。" (需 才学>60，妙玉好感 +10)', req: { talent: 60 }, reward: { affection_miaoyu: 10, mood: 10 }, reply: '老嬷嬷拿着诗进去，半晌出来，手里多了一个空茶盏："姑娘说...茶凉了。"你望着那空盏，觉得它比什么话都重。', action: 'close_random_event' },
              { text: '默默离去："我知道了。"', reward: { mood: -5 }, reply: '你握着那枝梅，站在庵门外，雪落在肩头。门内传来一声极轻的叹息，像是梅瓣落在雪上的声音。', action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
        },
      });
      return;
    }

    if (newDay === 25 && !current.hasTriggeredRaid && !current.isSick) {
      // 检查晴雯路线深度：完成 stage 5 或好感 ≥ 50 视为深度路线
      const qingwenDeep = current.completedEvents.includes('qingwen-05-last-night') || current.affection.qingwen >= 50;
      const raidText = qingwenDeep
        ? `（怡红院）夜半时分，王善保家的奉王夫人之命，带人突击抄检大观园！\n你想起她那夜握住你手时说的话——“你不许骗我。”\n\n她正在里屋，不知道外头已是风声鹤唳。矛头直指晴雯，若你不出手，她必死无疑。`
        : `（怡红院）夜半时分，王善保家的奉王夫人之命，带人突击抄检大观园！\n她们凶神恶煞地翻箱倒柜，矛头直指你院里那个性格桀骜的晴雯！\n\n【生死考验】：若不加干预，晴雯将被逐出大观园，香消玉殒！`;
      const silverReply = qingwenDeep
        ? '你将厚厚一沓银票塞进王善保家的袖中。老虔婆掂了掂分量冷笑一声带人撤了。你回到里屋，见晴雯还坐在榻上，她看了你一眼，没说话，却把手放进了你掌心。'
        : '你将厚厚一沓银票塞进王善保家的袖中。老虔婆掂了掂分量冷笑一声带人撤了。晴雯保住了一命。';
      const talentReply = qingwenDeep
        ? '你引经据典，言辞犀利，将王夫人的陪房训得哑口无言。晴雯从里屋出来，见你为她据理力争，眼眶倏地红了，却仰起头："我就知道你不会让她们欺负我。"'
        : '你引经据典言辞犀利，将王夫人的陪房训得哑口无言。众人见你如今已有老爷的风范，不敢造次退下了。';
      const failReply = qingwenDeep
        ? '你站在那里，脚像生了根。晴雯被婆子拖出去时，回头望了你一眼。那眼神里没有怨恨，只有一种你这辈子都忘不了的失望。她说："你不许骗我的。"然后再也没有回来。'
        : '你懦弱地站在一旁。晴雯绝望地看着你，被婆子们强行拖走。这一去便是死别...你心中郁结到了极点。';
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
            text: raidText,
            choices: [
              { text: '破财消灾：暗中塞满银票打点 (需银两 > 400)', req: { silver: 400 }, cost: { silver: 400 }, reward: { affection_qingwen: qingwenDeep ? 40 : 30, mood: 20 }, reply: silverReply, action: 'close_random_event' },
              { text: '据理力争：用圣贤书压制刁奴 (需才学 > 120)', req: { talent: 120 }, reward: { affection_qingwen: qingwenDeep ? 40 : 30, talent: 20 }, reply: talentReply, action: 'close_random_event' },
              { text: '无能为力：眼看晴雯被拖走', cost: { mood: 100 }, reward: { affection_qingwen: -100 }, reply: failReply, action: 'close_random_event' },
            ],
          },
          actionPoints: MAX_ACTION_POINTS,
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
            actionPoints: MAX_ACTION_POINTS,
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
        actionPoints: MAX_ACTION_POINTS,
      },
    });
  }, []);

  const triggerRandomEvent = useCallback(() => {
    const current = stateRef.current;
    const eventTemplate = pickRandomEvent(current);
    if (!eventTemplate) return;

    dispatch({
      type: 'SET_EVENT',
      payload: eventTemplate.getEvent(current),
    });
  }, []);

  const spendActionPoints = useCallback((cost: number) => {
    const current = stateRef.current;
    const newPoints = Math.max(0, current.actionPoints - cost);

    if (newPoints > 0) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: { actionPoints: newPoints },
      });
    } else {
      advanceTime(1, 0);
    }
  }, [advanceTime]);

  const handleAction = useCallback((actionType: ActionType) => {
    const current = stateRef.current;
    if (current.isSick) return;

    let costMood = 0;
    let gainTalent = 0;
    let gainMood = 0;
    let gainSilver = 0;
    let costStamina = 0;
    let gainStamina = 0;
    let gainPrestige = 0;
    let msg = '';

    const hasBuff = current.mood >= 80;
    let talentMultiplier = hasBuff ? 1.5 : 1;

    if (current.weather.id === 'rainy' && (actionType === 'school' || actionType === 'study_hard')) {
      talentMultiplier += 0.5;
    }

    switch (actionType) {
      case 'school':
        costMood = 10;
        costStamina = 15;
        gainPrestige = 3;
        gainTalent = Math.floor(5 * talentMultiplier);
        msg = `在族学听讲半日。才学 +${gainTalent}，心情 -${costMood}，体力 -${costStamina}，名望 +${gainPrestige}。${current.weather.id === 'rainy' ? '(雨声阵阵，让人更能静下心来)' : ''}`;
        break;
      case 'study_hard':
        costMood = 15;
        costStamina = 25;
        gainPrestige = 5;
        gainTalent = Math.floor(8 * talentMultiplier);
        msg = `闭门苦读半日。才学 +${gainTalent}，心情 -${costMood}，体力 -${costStamina}，名望 +${gainPrestige}。${current.weather.id === 'rainy' ? '(阴雨天真是读书的好时候)' : ''}`;
        break;
      case 'rest':
        gainMood = 20;
        gainStamina = 30;
        msg = `在厢房美美地睡了一个午觉。心情 +${gainMood}，体力 +${gainStamina}。`;
        break;
      case 'poem': {
        costMood = 15;
        costStamina = 20;
        const successChance = Math.min(0.9, current.talent / 100);
        if (Math.random() < successChance) {
          gainSilver = 50 + Math.floor(current.talent / 2);
          gainPrestige = 8;
          msg = `你灵感迸发，写下一首佳作卖予书坊！银两 +${gainSilver}，心情 -${costMood}，体力 -${costStamina}，名望 +${gainPrestige}。`;
        } else {
          msg = `你枯坐半日，未能憋出好句，反倒惹得心烦意乱。心情 -${costMood}，体力 -${costStamina}。`;
        }
        break;
      }
      case 'search':
        msg = '你在园中四处寻访，希望能寻得佳人一面。';
        break;
      case 'pawn':
        costMood = 20;
        costStamina = 10;
        gainPrestige = -5;
        gainSilver = 150;
        msg = `让茗烟去当铺死当旧物。银两 +${gainSilver}，心情 -${costMood}，体力 -${costStamina}，名望 ${gainPrestige}。`;
        break;
    }

    const nextStamina = Math.min(100, Math.max(0, current.stamina - costStamina + gainStamina));

    if (nextStamina <= 0 && actionType !== 'rest') {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          stamina: 0,
          prestige: Math.max(0, current.prestige + gainPrestige),
          currentEvent: {
            req: 0,
            character: { id: 'system', name: '系统提示', mbti: '系统', avatar: '💤', bg: 'bg-amber-50' },
            text: '【精力耗尽】\n你连日操劳，终于体力透支，不得不在床上好好休养半日。',
            choices: [
              {
                text: '老老实实歇一歇（恢复 60 体力，推进半天）',
                reward: { stamina: 60 },
                reply: '养足精神，继续。',
                specialAction: 'recover_sick',
              },
            ],
          },
        },
      });
      return;
    }

    if (current.mood - costMood <= 0 && actionType !== 'rest') {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          mood: 0,
          stamina: nextStamina,
          prestige: Math.max(0, current.prestige + gainPrestige),
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
    const nextPrestige = Math.max(0, current.prestige + gainPrestige);

    dispatch({
      type: 'LOAD_SAVE',
      payload: {
        talent: gainTalent > 0 ? nextTalent : current.talent,
        silver: nextSilver,
        mood: nextMood,
        stamina: nextStamina,
        prestige: nextPrestige,
        logs: addLog(current.logs, msg),
      },
    });

    const ACTION_COSTS: Record<string, number> = {
      school: 1,
      study_hard: 2,
      rest: 1,
      poem: 2,
      pawn: 1,
      search: 1,
    };
    spendActionPoints(ACTION_COSTS[actionType] ?? 1);

    if (Math.random() < 0.15 && actionType !== 'rest') {
      setTimeout(() => triggerRandomEvent(), 0);
    }
  }, [advanceTime, triggerRandomEvent, spendActionPoints]);

  const exploreLocation = useCallback((locationId: string) => {
    const current = stateRef.current;
    if (current.isSick) return;

    let costMood = 0;
    let gainMood = 15;
    const costStamina = 10;

    if (current.weather.id === 'sunny') {
      gainMood += 10;
    } else if (current.weather.id === 'rainy') {
      gainMood = -5;
      costMood = 5;
    }

    const nextStamina = Math.max(0, current.stamina - costStamina);

    if (nextStamina <= 0) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          stamina: 0,
          currentEvent: {
            req: 0,
            character: { id: 'system', name: '系统提示', mbti: '系统', avatar: '💤', bg: 'bg-amber-50' },
            text: '【精力耗尽】\n你连日操劳，终于体力透支，不得不在床上好好休养半日。',
            choices: [
              {
                text: '老老实实歇一歇（恢复 60 体力，推进半天）',
                reward: { stamina: 60 },
                reply: '养足精神，继续。',
                specialAction: 'recover_sick',
              },
            ],
          },
        },
      });
      return;
    }

    if (current.mood - costMood <= 0) {
      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          mood: 0,
          stamina: nextStamina,
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
      const heroinesWithReadyEvents = possibleHeroines.filter((heroine) => {
        const affection = current.affection[heroine.id as keyof typeof current.affection];
        return EVENT_DB[heroine.id].some((event) => !current.completedEvents.includes(event.id || '') && affection >= event.req);
      });
      const heroineObj = pickOne(heroinesWithReadyEvents.length > 0 ? heroinesWithReadyEvents : possibleHeroines);
      const currentAffection = current.affection[heroineObj.id as keyof typeof current.affection];
      const events = EVENT_DB[heroineObj.id];
      const availableEvent = events.find((event) => !current.completedEvents.includes(event.id || '') && currentAffection >= event.req);
      const nextLockedEvent = events.find((event) => !current.completedEvents.includes(event.id || ''));

      dispatch({
        type: 'SET_EVENT',
        payload: availableEvent
          ? { ...availableEvent, character: heroineObj }
          : createRouteHintEvent(heroineObj, currentAffection, nextLockedEvent),
      });
    } else {
      const nextMood = Math.min(100, Math.max(0, current.mood + gainMood));
      const weatherText = current.weather.id === 'sunny' ? '(阳光明媚，心情大好)' : current.weather.id === 'rainy' ? '(细雨弄湿了衣摆，有些心烦)' : '';
      const locName = LOCATIONS[locationId]?.name || '未知地点';

      // 30% 概率触发探索事件
      if (Math.random() < 0.3) {
        const exploreTemplate = pickExploreEvent(current);
        if (exploreTemplate) {
          dispatch({
            type: 'LOAD_SAVE',
            payload: {
              mood: nextMood,
              stamina: nextStamina,
              logs: addLog(current.logs, `你在${locName}闲逛，遇到了一些趣事...`),
            },
          });
          setTimeout(() => {
            dispatch({
              type: 'SET_EVENT',
              payload: exploreTemplate.getEvent(current, locName),
            });
          }, 0);
          return;
        }
      }

      const msg = `你在${locName}闲逛了半日。${weatherText} 心情 ${gainMood >= 0 ? '+' : ''}${gainMood}，体力 -${costStamina}`;

      dispatch({
        type: 'LOAD_SAVE',
        payload: {
          mood: nextMood,
          stamina: nextStamina,
          logs: addLog(current.logs, msg),
        },
      });
      spendActionPoints(1); // 叙话消耗 1 行动点

      if (Math.random() < 0.15) {
        setTimeout(() => triggerRandomEvent(), 0);
      }
    }
  }, [advanceTime, triggerRandomEvent, spendActionPoints]);

  const moveTo = useCallback((locationId: string) => {
    dispatch({ type: 'MOVE_TO', payload: locationId });
  }, []);

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
    moveTo,
    buyItem,
    useItem,
    handleChoice,
    loadSave,
  };
}
