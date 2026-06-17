import { EVENT_DB } from '../data/events';
import { HEROINES } from '../data/heroines';
import type { GameEvent, GameState, Heroine, HeroineId, StoryStage } from '../types/game';

export const STORY_STAGES: Array<{ stage: StoryStage; label: string }> = [
  { stage: 1, label: '初遇' },
  { stage: 2, label: '试探' },
  { stage: 3, label: '冲突' },
  { stage: 4, label: '名场面' },
  { stage: 5, label: '结局前夜' },
];

export interface DreambookStage {
  stage: StoryStage;
  label: string;
  event?: GameEvent;
  completed: boolean;
  ready: boolean;
  current: boolean;
  locked: boolean;
  missing: boolean;
  note: string;
}

export interface DreambookRoute {
  heroine: Heroine;
  events: GameEvent[];
  completedCount: number;
  totalEvents: number;
  nextEvent?: GameEvent;
  nextReady: boolean;
  nextNote: string;
  stages: DreambookStage[];
}

export const HEROINE_IDS = Object.keys(HEROINES) as HeroineId[];

function getAffection(state: GameState, heroineId: string): number {
  return state.affection[heroineId as keyof typeof state.affection] || 0;
}

function isCompleted(state: GameState, event?: GameEvent): boolean {
  return Boolean(event?.id && state.completedEvents.includes(event.id));
}

function getEventNote(state: GameState, heroineId: string, event?: GameEvent): string {
  if (!event) return '后续剧情待补写。';
  const affection = getAffection(state, heroineId);
  if (affection < event.req) return `好感还差 ${event.req - affection} 点。`;
  return event.hint || '可前往对应地点触发。';
}

export function getDreambookRoute(state: GameState, heroineId: HeroineId): DreambookRoute {
  const heroine = HEROINES[heroineId];
  const events = EVENT_DB[heroineId] || [];
  const affection = getAffection(state, heroineId);
  const nextEvent = events.find((event) => !isCompleted(state, event));
  const nextReady = Boolean(nextEvent && affection >= nextEvent.req);
  const completedCount = events.filter((event) => isCompleted(state, event)).length;
  const currentStage = nextEvent?.stage;

  return {
    heroine,
    events,
    completedCount,
    totalEvents: events.length,
    nextEvent,
    nextReady,
    nextNote: getEventNote(state, heroineId, nextEvent),
    stages: STORY_STAGES.map(({ stage, label }) => {
      const event = events.find((item) => item.stage === stage);
      const completed = isCompleted(state, event);
      const missing = !event;
      const ready = Boolean(event && !completed && affection >= event.req);
      const current = Boolean(event && !completed && currentStage === stage);

      return {
        stage,
        label,
        event,
        completed,
        ready,
        current,
        locked: Boolean(event && !completed && affection < event.req),
        missing,
        note: getEventNote(state, heroineId, event),
      };
    }),
  };
}

export function getDreambookRoutes(state: GameState): DreambookRoute[] {
  return HEROINE_IDS.map((id) => getDreambookRoute(state, id));
}
