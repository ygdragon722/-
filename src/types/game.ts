export interface Heroine {
  id: string;
  name: string;
  title: string;
  mbti: string;
  mbtiName: string;
  mbtiTag: string;
  mbtiColor: string;
  color: string;
  bg: string;
  border: string;
  avatar: string;
  location: string;
  portrait?: string;
  fullBody?: string;
}

export type HeroineId = 'daiyu' | 'baochai' | 'xiangyun' | 'tanchun' | 'xiren' | 'qingwen' | 'miaoyu';
export type ChoiceTone = 'empathy' | 'planning' | 'play' | 'reform' | 'care' | 'rebel' | 'aesthetic';
export type StoryStage = 1 | 2 | 3 | 4 | 5;
export type MbtiInsight = Record<HeroineId, number>;

export interface NPC {
  id: string;
  name: string;
  mbti: string;
  avatar: string;
  portrait?: string;
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  icon: string;
  bg: string;
  image?: string;
  thumbnail?: string;
}

export interface Weather {
  id: string;
  name: string;
  icon: string;
  effect: string;
  color: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  desc: string;
  icon: string;
  type: 'gift' | 'consumable';
}

export interface ChoiceReward {
  mood?: number;
  talent?: number;
  silver?: number;
  stamina?: number;
  prestige?: number;
  affection_daiyu?: number;
  affection_baochai?: number;
  affection_xiangyun?: number;
  affection_tanchun?: number;
  affection_xiren?: number;
  affection_qingwen?: number;
  affection_miaoyu?: number;
  items?: Record<string, number>;
}

export interface ChoiceCost {
  mood?: number;
  silver?: number;
  item?: string;
}

export interface ChoiceReq {
  talent?: number;
  item?: string;
  silver?: number;
  mood?: number;
}

export interface EventChoice {
  text: string;
  tone?: ChoiceTone;
  req?: ChoiceReq;
  cost?: ChoiceCost;
  reward?: ChoiceReward;
  reply?: string;
  action?: string;
  specialAction?: string;
}

export interface GameEvent {
  id?: string;
  title?: string;
  stage?: StoryStage;
  hint?: string;
  req: number;
  text: string;
  choices: EventChoice[];
  isRandomEvent?: boolean;
  image?: string;
}

export interface Affection {
  daiyu: number;
  baochai: number;
  xiangyun: number;
  tanchun: number;
  xiren: number;
  qingwen: number;
  miaoyu: number;
}

export interface EndingInfo {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export interface EndingData {
  id: string;
  title: string;
  desc: string;
  scene?: string;
}

export type GameScreen = 'menu' | 'playing' | 'ending' | 'gallery';
export type GameView = 'garden' | 'shop' | 'bag';
export type ActionType = 'school' | 'study_hard' | 'rest' | 'poem' | 'pawn' | 'search';

export interface Inventory {
  [itemId: string]: number;
}

export interface GameState {
  day: number;
  timeStep: number;
  currentLocation: string;
  weather: Weather;
  talent: number;
  mood: number;
  silver: number;
  stamina: number;
  prestige: number;
  actionPoints: number;
  inventory: Inventory;
  currentView: GameView;
  affection: Affection;
  currentEvent: (GameEvent & { character?: Heroine | NPC & { bg?: string; border?: string } }) | null;
  logs: string[];
  isSick: boolean;
  gameScreen: GameScreen;
  maxDays: number;
  endingData: EndingData | null;
  unlockedEndings: string[];
  completedEvents: string[];
  mbtiInsight: MbtiInsight;
  routeFocus?: HeroineId;
  storyFlags: Record<string, boolean>;
  hasTriggeredPoetry: boolean;
  hasTriggeredRaid: boolean;
  hasTriggeredDay18: boolean;
  hasTriggeredDay20: boolean;
  hasTriggeredDay22: boolean;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'GO_TO_MENU' }
  | { type: 'GO_TO_GALLERY' }
  | { type: 'GO_TO_ENDING' }
  | { type: 'SET_VIEW'; payload: GameView }
  | { type: 'SET_EVENT'; payload: GameState['currentEvent'] }
  | { type: 'CLEAR_EVENT' }
  | { type: 'ADVANCE_TIME'; payload?: { days?: number; steps?: number } }
  | { type: 'APPLY_CHOICE'; payload: EventChoice }
  | { type: 'HANDLE_ACTION'; payload: ActionType }
  | { type: 'EXPLORE_LOCATION'; payload: string }
  | { type: 'MOVE_TO'; payload: string }
  | { type: 'BUY_ITEM'; payload: string }
  | { type: 'USE_ITEM'; payload: string }
  | { type: 'RECOVER_SICK' }
  | { type: 'TRIGGER_ENDING' }
  | { type: 'ADD_LOG'; payload: string }
  | { type: 'LOAD_SAVE'; payload: Partial<GameState> }
  | { type: 'SET_UNLOCKED_ENDINGS'; payload: string[] }
  | { type: 'TRIGGER_RANDOM_EVENT' };
