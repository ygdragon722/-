import { useMemo, useState } from 'react';
import type { ActionType, GameState, HeroineId } from '../types/game';
import { HEROINES } from '../data/heroines';
import { LOCATIONS } from '../data/locations';
import { getDreambookRoute } from '../utils/dreambook';
import { MAX_ACTION_POINTS } from '../store/gameReducer';

const GARDEN_BG = './assets/ui/menu-bg.webp';

interface Props {
  state: GameState;
  onExplore: (locationId: string) => void;
  onMove: (locationId: string) => void;
  onAction: (action: ActionType) => void;
}

// 右侧竖排行动菜单按钮
function ActionButton({
  label,
  mark,
  hint,
  disabled,
  highlight,
  onClick,
}: {
  label: string;
  mark: string;
  hint?: string;
  disabled?: boolean;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
        highlight
          ? 'border-amber-300/80 bg-amber-200/95 text-stone-950 hover:bg-amber-100'
          : 'border-white/15 bg-stone-950/70 text-stone-100 hover:border-amber-300/60 hover:bg-stone-900/80'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border text-sm font-bold ${
          highlight ? 'border-stone-800/30 bg-stone-950/10' : 'border-white/25 bg-white/8'
        }`}
      >
        {mark}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight">{label}</span>
        {hint && <span className="block truncate text-[11px] opacity-70">{hint}</span>}
      </span>
    </button>
  );
}

// 移动选单弹层
function MoveModal({
  currentLocation,
  onMove,
  onClose,
}: {
  currentLocation: string;
  onMove: (locationId: string) => void;
  onClose: () => void;
}) {
  const locations = useMemo(() => Object.values(LOCATIONS), []);
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-stone-950/70 p-5 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg border border-amber-300/30 bg-stone-950/92 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-lg font-bold tracking-widest text-amber-200">移步何处</h2>
          <button onClick={onClose} className="rounded border border-white/20 px-3 py-1 text-sm text-stone-300 hover:text-white">
            留步
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => {
            const here = loc.id === currentLocation;
            const dwellers = Object.values(HEROINES).filter((h) => h.location === loc.id);
            return (
              <button
                key={loc.id}
                disabled={here}
                onClick={() => {
                  onMove(loc.id);
                  onClose();
                }}
                className={`group relative overflow-hidden rounded-lg border text-left transition ${
                  here
                    ? 'cursor-default border-amber-300/60 opacity-60'
                    : 'border-white/15 hover:-translate-y-0.5 hover:border-amber-300/60'
                }`}
              >
                <div className="relative h-24">
                  {loc.image && (
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-stone-50">{loc.name}</span>
                      {here && <span className="rounded bg-amber-300 px-1.5 text-[10px] font-bold text-stone-950">现处</span>}
                    </div>
                    <div className="truncate text-[11px] text-stone-300">
                      {dwellers.length > 0 ? dwellers.map((d) => d.name).join('、') : '此处清静无人'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LocationStage({ state, onExplore, onMove, onAction }: Props) {
  const [moveOpen, setMoveOpen] = useState(false);
  const location = LOCATIONS[state.currentLocation] ?? LOCATIONS.yihong;
  const bgImage = location.image || GARDEN_BG;

  const heroines = useMemo(
    () => Object.values(HEROINES).filter((h) => h.location === location.id),
    [location.id],
  );

  const { isSick, talent, actionPoints } = state;

  return (
    <div className="absolute inset-0 z-20">
      {/* 场景背景 */}
      <img
        src={bgImage}
        alt={location.name}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => ((e.target as HTMLImageElement).src = GARDEN_BG)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

      {/* 地点名牌（左上 · 曲径通幽式） */}
      <div className="absolute left-5 top-20 z-30">
        <div className="inline-flex flex-col rounded border-2 border-amber-300/50 bg-stone-950/80 px-5 py-2 shadow-xl backdrop-blur-sm">
          <span className="text-xl font-bold tracking-[0.4em] text-amber-200">{location.name}</span>
          <span className="mt-0.5 text-xs tracking-wide text-stone-400">{location.desc}</span>
        </div>
      </div>

      {/* 角色立绘（场景中部偏左，锚定底部） */}
      <div className="absolute bottom-28 left-0 right-72 top-0 z-20 flex items-end justify-center">
        {heroines.length > 0 ? (
          <div className="flex items-end gap-2">
            {heroines.map((h) => (
              <button
                key={h.id}
                onClick={() => onExplore(location.id)}
                disabled={isSick}
                className="group relative cursor-pointer disabled:cursor-not-allowed"
                title={`与${h.name}叙话`}
              >
                {h.portrait ? (
                  <img
                    src={h.portrait}
                    alt={h.name}
                    className="h-[60vh] max-h-[460px] w-auto object-contain object-bottom drop-shadow-[0_4px_40px_rgba(0,0,0,0.9)] transition group-hover:brightness-110"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                ) : (
                  <div className="flex h-40 w-32 items-end justify-center rounded-lg bg-white/5 pb-4 text-5xl">{h.avatar}</div>
                )}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-amber-300/40 bg-stone-950/85 px-3 py-0.5 text-xs font-bold tracking-widest text-amber-200 opacity-0 transition group-hover:opacity-100">
                  {h.name} · 叙话
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-32 text-stone-300/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">此处清静无人，正好静心。</p>
        )}
      </div>

      {/* 右侧竖排行动菜单 */}
      <aside className="absolute right-5 top-1/2 z-30 w-60 -translate-y-1/2 space-y-2">
        <div className="mb-3 rounded-lg border border-white/15 bg-stone-950/70 px-3 py-2 text-center backdrop-blur-sm">
          <div className="mb-1 text-[10px] tracking-widest text-stone-400">今日行动力</div>
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: MAX_ACTION_POINTS }).map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i < actionPoints ? 'bg-amber-300' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-xs font-bold text-amber-200">
            {actionPoints > 0 ? `还剩 ${actionPoints} 点` : '今日已尽，明日再来'}
          </div>
        </div>
        {heroines.map((h) => {
          const route = getDreambookRoute(state, h.id as HeroineId);
          const hint = route.nextReady
            ? `可推进：${route.nextEvent?.title || '新剧情'}`
            : route.nextEvent
            ? route.nextNote
            : '路线暂告一段落';
          return (
            <ActionButton
              key={h.id}
              label={`叙话 · ${h.name}`}
              mark="话"
              hint={`♥${state.affection[h.id as keyof typeof state.affection]} ${hint}`}
              highlight={route.nextReady}
              disabled={isSick}
              onClick={() => onExplore(location.id)}
            />
          );
        })}

        <ActionButton label="移步他处" mark="移" hint="前往大观园其他地点" onClick={() => setMoveOpen(true)} />

        <div className="!my-3 border-t border-white/10" />

        <ActionButton label="族学打卡" mark="学" hint="才学中升，心情微降" disabled={isSick} onClick={() => onAction('school')} />
        <ActionButton label="闭门苦读" mark="读" hint="大幅提升才学，更耗神" disabled={isSick} onClick={() => onAction('study_hard')} />
        <ActionButton label="歇息养神" mark="憩" hint="恢复心情" disabled={isSick} onClick={() => onAction('rest')} />
        <ActionButton
          label="赋诗卖稿"
          mark="诗"
          hint={talent < 30 ? '才学不足 30' : '收益与才学相关'}
          disabled={isSick || talent < 30}
          onClick={() => onAction('poem')}
        />
      </aside>

      {moveOpen && (
        <MoveModal currentLocation={location.id} onMove={onMove} onClose={() => setMoveOpen(false)} />
      )}
    </div>
  );
}
