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
}

export interface NPC {
  id: string;
  name: string;
  mbti: string;
  avatar: string;
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  icon: string;
  bg: string;
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
  affection_daiyu?: number;
  affection_baochai?: number;
  affection_xiangyun?: number;
  affection_tanchun?: number;
  affection_xiren?: number;
  affection_qingwen?: number;
  affection_miaoyu?: number;
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
  req?: ChoiceReq;
  cost?: ChoiceCost;
  reward?: ChoiceReward;
  reply?: string;
  action?: string;
  specialAction?: string;
}

export interface GameEvent {
  req: number;
  text: string;
  choices: EventChoice[];
  isRandomEvent?: boolean;
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
}

export type GameScreen = 'menu' | 'playing' | 'ending' | 'gallery';
export type GameView = 'garden' | 'shop' | 'bag';
export type ActionType = 'school' | 'study_hard' | 'rest' | 'poem' | 'pawn';

export interface Inventory {
  [itemId: string]: number;
}

export interface GameState {
  day: number;
  timeStep: number;
  weather: Weather;
  talent: number;
  mood: number;
  silver: number;
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
  hasTriggeredPoetry: boolean;
  hasTriggeredRaid: boolean;
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
  | { type: 'BUY_ITEM'; payload: string }
  | { type: 'USE_ITEM'; payload: string }
  | { type: 'RECOVER_SICK' }
  | { type: 'TRIGGER_ENDING' }
  | { type: 'ADD_LOG'; payload: string }
  | { type: 'LOAD_SAVE'; payload: Partial<GameState> }
  | { type: 'SET_UNLOCKED_ENDINGS'; payload: string[] }
  | { type: 'TRIGGER_RANDOM_EVENT' };
