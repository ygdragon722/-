import type { DreambookRoute } from '../utils/dreambook';
import { getDreambookRoutes, STORY_STAGES } from '../utils/dreambook';
import type { GameState, HeroineId } from '../types/game';

interface Props {
  state: GameState;
}

function getStageClass(stage: DreambookRoute['stages'][number]): string {
  if (stage.completed) return 'bg-emerald-700 text-white border-emerald-800';
  if (stage.ready) return 'bg-amber-200 text-amber-950 border-amber-500';
  if (stage.current) return 'bg-stone-200 text-stone-800 border-stone-400';
  if (stage.missing) return 'bg-stone-100 text-stone-400 border-stone-200';
  return 'bg-white text-stone-500 border-stone-300';
}

function getStageSymbol(stage: DreambookRoute['stages'][number]): string {
  if (stage.completed) return '✓';
  if (stage.ready) return '!';
  if (stage.missing) return '·';
  return String(stage.stage);
}

function RouteCard({ route, state }: { route: DreambookRoute; state: GameState }) {
  const heroineId = route.heroine.id as HeroineId;
  const affection = state.affection[heroineId];
  const insight = state.mbtiInsight[heroineId] || 0;
  const nextTitle = route.nextEvent?.title || '待补写';

  return (
    <section className={`rounded-lg border ${route.heroine.border} ${route.heroine.bg} p-3 shadow-sm`}>
      <div className="flex items-start gap-2">
        {route.heroine.portrait ? (
          <img
            src={route.heroine.portrait}
            alt=""
            className="h-10 w-10 rounded-md object-cover object-top border border-white/80 bg-white shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-white/80 border border-white flex items-center justify-center shrink-0">
            {route.heroine.avatar}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-bold text-sm text-stone-900 truncate">{route.heroine.name}</div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${route.heroine.mbtiColor}`}>
              {route.heroine.mbti}
            </span>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1 text-[10px] text-stone-600">
            <span>好感 {affection}</span>
            <span>理解 {insight}</span>
            <span>{route.completedCount}/{route.totalEvents}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-1">
        {route.stages.map((stage) => (
          <div
            key={stage.stage}
            title={`${stage.label}: ${stage.event?.title || '待补写'} - ${stage.note}`}
            className={`h-7 flex-1 min-w-0 rounded border text-[11px] font-bold flex items-center justify-center ${getStageClass(stage)}`}
          >
            {getStageSymbol(stage)}
          </div>
        ))}
      </div>

      <div className="mt-2 text-[11px] leading-5 text-stone-700">
        <span className="font-bold">下一段：</span>
        <span>{nextTitle}</span>
      </div>
      <div className={`mt-1 text-[11px] leading-5 ${route.nextReady ? 'text-amber-800 font-bold' : 'text-stone-500'}`}>
        {route.nextReady ? '可触发。前往对应地点即可推进。' : route.nextNote}
      </div>
    </section>
  );
}

export default function DreambookPanel({ state }: Props) {
  const routes = getDreambookRoutes(state);
  const completed = routes.reduce((total, route) => total + route.completedCount, 0);
  const total = routes.reduce((sum, route) => sum + route.totalEvents, 0);

  return (
    <aside className="w-full bg-[#f7f3ea] p-4 flex flex-col min-h-0">
      <div className="shrink-0 border-b-2 border-stone-300 pb-3 mb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-stone-800">梦册</h2>
          <span className="text-xs font-bold text-stone-600 bg-white border border-stone-300 rounded px-2 py-1">
            {completed}/{total}
          </span>
        </div>
        <p className="mt-1 text-xs text-stone-500">
          {STORY_STAGES.map((stage) => stage.label).join(' · ')}
        </p>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 pb-2">
        {routes.map((route) => (
          <RouteCard key={route.heroine.id} route={route} state={state} />
        ))}
      </div>
    </aside>
  );
}
