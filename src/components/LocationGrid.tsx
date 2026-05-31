import { HEROINES } from '../data/heroines';
import { LOCATIONS } from '../data/locations';
import type { GameState } from '../types/game';

interface Props {
  state: GameState;
  onExplore: (locationId: string) => void;
}

export default function LocationGrid({ state, onExplore }: Props) {
  const { weather, isSick, day, affection } = state;

  return (
    <div className="flex-grow flex flex-col animate-fade-in h-full relative">
      <div className="bg-[#e8dbbf] w-full h-full rounded-xl border-4 border-double border-stone-400 p-6 relative overflow-hidden shadow-inner flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#a8a29e_0%,_transparent_70%)]"></div>

        <div className="text-center mb-6 relative z-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-stone-800 tracking-widest">大观园</h2>
          <p className="text-sm text-stone-600 mt-1">栊翠庵已对外开放，凑齐大观园六景。</p>
          {day >= 20 && day < 25 && (
            <div className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full mt-2 font-bold animate-pulse">
              ⚠️ 警告：近日王夫人常在园外巡视，恐有大事发生，请备足银两或苦读诗书！
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10 mt-auto mb-auto">
          {Object.values(LOCATIONS).map((loc) => {
            const heroinesInLoc = Object.values(HEROINES).filter((h) => h.location === loc.id);

            return (
              <button
                key={loc.id}
                onClick={() => onExplore(loc.id)}
                disabled={isSick}
                className="flex flex-col items-center p-4 md:p-6 rounded-2xl border-2 border-stone-300 bg-white/90 hover:bg-white hover:-translate-y-2 hover:shadow-xl hover:border-red-400 transition-all group disabled:opacity-50"
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 shadow-inner ${loc.bg} border border-stone-200 group-hover:scale-110 transition-transform`}
                >
                  {loc.icon}
                </div>
                <h3 className="font-bold text-stone-800 text-base md:text-lg mb-1">{loc.name}</h3>
                <p className="text-[10px] md:text-xs text-stone-500 text-center mb-3 h-8">{loc.desc}</p>

                {heroinesInLoc.length > 0 ? (
                  <div className="mt-auto flex flex-col items-center w-full gap-1">
                    {heroinesInLoc.map((heroine) => (
                      <div
                        key={heroine.id}
                        className={`flex items-center justify-between w-full text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border ${heroine.mbtiColor}`}
                      >
                        <span className="truncate">{heroine.name}</span>
                        <span>♥ {affection[heroine.id as keyof typeof affection]}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-auto text-xs text-stone-400 italic">空旷无人</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-stone-500 font-bold">
          当前天气【{weather.name}】：{weather.effect}
        </div>
      </div>
    </div>
  );
}
