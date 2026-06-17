import type { GameState } from '../types/game';
import { TIME_LABELS } from '../store/gameReducer';

interface Props {
  state: GameState;
}

export default function StatsBar({ state }: Props) {
  const { day, timeStep, weather, talent, mood, silver, isSick, maxDays } = state;

  return (
    <div className="bg-stone-900 text-stone-100 p-3 md:p-4 flex flex-col md:flex-row md:flex-wrap md:justify-between md:items-center border-b-4 border-red-800 gap-3 md:gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="text-xl font-bold flex flex-col sm:flex-row sm:items-baseline gap-2 min-w-0">
          <div>
            第 <span className="text-amber-500">{day}</span> 天
            <span className="text-stone-400 text-sm ml-1">/ {maxDays}</span>
            <span className="ml-2 text-stone-400 text-lg">({TIME_LABELS[timeStep]})</span>
          </div>
          <div
            className={`text-sm md:text-base sm:ml-4 flex items-center gap-1 bg-stone-800 px-3 py-1 rounded-full border border-stone-700 ${weather.color} relative group cursor-help w-fit max-w-full`}
          >
            <span>{weather.icon}</span>
            <span className="truncate">{weather.name}</span>
            <span className="absolute -bottom-8 left-0 text-[10px] w-max bg-stone-800 text-stone-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-stone-600 shadow-lg">
              {weather.effect}
            </span>
          </div>
        </div>
        {isSick && (
          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded animate-pulse">卧病在床</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-8 text-sm md:text-base font-medium w-full md:w-auto">
        <div className="flex flex-col items-center">
          <span className="text-stone-400 text-xs">才学</span>
          <span className="text-blue-400 text-xl">{talent}</span>
        </div>
        <div className="flex flex-col items-center relative group cursor-help">
          <span className="text-stone-400 text-xs">心情</span>
          <span
            className={`text-xl transition-colors ${
              mood >= 80
                ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : mood <= 20
                ? 'text-red-500'
                : 'text-amber-500'
            }`}
          >
            {mood}/100
          </span>
          {mood >= 80 && (
            <span className="absolute -bottom-6 text-[10px] text-emerald-300 w-max bg-stone-800 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
              状态极佳，加倍内卷！
            </span>
          )}
          {mood <= 20 && (
            <span className="absolute -bottom-6 text-[10px] text-red-300 w-max bg-stone-800 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
              精神内耗警告！
            </span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-stone-400 text-xs">银两</span>
          <span className="text-yellow-500 text-xl">{silver} 两</span>
        </div>
      </div>
    </div>
  );
}
