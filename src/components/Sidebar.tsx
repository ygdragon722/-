import type { GameState, ActionType } from '../types/game';

interface Props {
  state: GameState;
  onAction: (action: ActionType) => void;
}

export default function Sidebar({ state, onAction }: Props) {
  const { isSick, talent, logs } = state;

  return (
    <div className="w-full xl:w-[260px] border-r border-stone-200 bg-[#faf8f5] p-4 md:p-6 flex flex-col order-2 xl:order-1 min-h-0">
      <h2 className="text-xl font-bold mb-4 md:mb-6 text-stone-800 border-b-2 border-stone-300 pb-2">内务日程</h2>

      <div className="space-y-3 md:space-y-4 flex-grow overflow-y-auto pb-4 pr-2">
        <button
          onClick={() => onAction('school')}
          disabled={isSick}
          className="w-full text-left p-3 rounded bg-white border border-stone-300 hover:border-blue-500 hover:shadow-md transition disabled:opacity-50 group"
        >
          <div className="font-bold text-stone-700 group-hover:text-blue-700">📚 族学打卡</div>
          <div className="text-xs text-stone-500 mt-1">才学中升，心情微降。</div>
        </button>

        <button
          onClick={() => onAction('study_hard')}
          disabled={isSick}
          className="w-full text-left p-3 rounded bg-white border border-stone-300 hover:border-purple-500 hover:shadow-md transition disabled:opacity-50 group"
        >
          <div className="font-bold text-stone-700 group-hover:text-purple-700">🕯️ 闭门爆肝</div>
          <div className="text-xs text-stone-500 mt-1">大幅内卷才学，极度耗神。</div>
        </button>

        <button
          onClick={() => onAction('rest')}
          disabled={isSick}
          className="w-full text-left p-3 rounded bg-white border border-stone-300 hover:border-emerald-500 hover:shadow-md transition disabled:opacity-50 group"
        >
          <div className="font-bold text-stone-700 group-hover:text-emerald-700">🛏️ 躺平充能</div>
          <div className="text-xs text-stone-500 mt-1">恢复大量情绪价值。</div>
        </button>

        <div className="pt-2 border-t border-stone-200 mt-4">
          <h3 className="text-xs font-bold text-stone-400 mb-3 uppercase tracking-wider">市井营生</h3>
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={() => onAction('poem')}
              disabled={isSick || talent < 30}
              className="w-full text-left p-3 rounded bg-amber-50 border border-amber-300 hover:border-amber-600 hover:shadow-md transition disabled:opacity-50 disabled:bg-stone-100 group relative"
            >
              <div className="font-bold text-amber-800 group-hover:text-amber-900">✍️ 赋诗卖稿</div>
              <div className="text-[11px] text-amber-700 mt-1">写出爆款的几率与才学挂钩。</div>
            </button>
            <button
              onClick={() => onAction('pawn')}
              disabled={isSick}
              className="w-full text-left p-3 rounded bg-white border border-stone-300 hover:border-stone-800 hover:shadow-md transition disabled:opacity-50 group"
            >
              <div className="font-bold text-stone-700 group-hover:text-stone-900">📦 典当旧物</div>
              <div className="text-xs text-stone-500 mt-1">紧急套现，心情跌停。</div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-stone-300 shrink-0">
        <h3 className="text-sm font-bold text-stone-500 mb-2">系统通知</h3>
        <div className="h-28 overflow-y-auto text-xs text-stone-600 space-y-1">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`${
                i === 0 ? 'text-stone-900 font-bold bg-stone-200/50 p-1 rounded' : 'opacity-70'
              }`}
            >
              {i === 0 ? '➤ ' : '• '}
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
