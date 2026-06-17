import { HEROINES } from '../data/heroines';
import { LOCATIONS } from '../data/locations';
import type { GameState, HeroineId } from '../types/game';
import { getDreambookRoute } from '../utils/dreambook';

interface Props {
  state: GameState;
  onExplore: (locationId: string) => void;
}

export default function LocationGrid({ state, onExplore }: Props) {
  const { weather, isSick, day, affection } = state;

  return (
    <div className="flex-grow flex flex-col animate-fade-in h-full min-h-0 relative">
      <div className="bg-[#eadfc7] w-full h-full rounded-xl border-4 border-double border-stone-400 p-4 md:p-6 relative overflow-hidden shadow-inner flex flex-col min-h-0">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,_#fef3c7_0%,_transparent_46%)]"></div>

        <div className="text-center mb-4 md:mb-6 relative z-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-stone-800 tracking-widest">大观园</h2>
          <p className="text-sm text-stone-600 mt-1">栊翠庵已对外开放，凑齐大观园六景。</p>
          {day >= 20 && day < 25 && (
            <div className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full mt-2 font-bold animate-pulse">
              ⚠️ 警告：近日王夫人常在园外巡视，恐有大事发生，请备足银两或苦读诗书！
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 relative z-10 flex-1 min-h-0 overflow-y-auto pr-1 pb-2">
          {Object.values(LOCATIONS).map((loc) => {
            const heroinesInLoc = Object.values(HEROINES).filter((h) => h.location === loc.id);

            return (
              <button
                key={loc.id}
                onClick={() => onExplore(loc.id)}
                disabled={isSick}
                className="flex flex-col items-stretch p-2.5 md:p-3 rounded-xl border border-stone-300 bg-white/92 hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:border-red-400 transition-all group disabled:opacity-50 overflow-hidden text-left"
              >
                {loc.image && (
                  <div className="w-full aspect-video mb-3 rounded-lg overflow-hidden border border-stone-200 relative bg-stone-100">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/10 to-transparent" />
                    <span className="absolute bottom-2 left-2 right-2 text-white text-base md:text-lg font-bold drop-shadow-md truncate">
                      {loc.icon} {loc.name}
                    </span>
                  </div>
                )}
                {!loc.image && (
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 shadow-inner ${loc.bg} border border-stone-200 group-hover:scale-110 transition-transform`}
                  >
                    {loc.icon}
                  </div>
                )}
                {loc.image && (
                  <p className="text-[11px] md:text-xs text-stone-600 mb-3 min-h-[1.5rem] px-1">{loc.desc}</p>
                )}
                {!loc.image && (
                  <>
                    <h3 className="font-bold text-stone-800 text-base md:text-lg mb-1">{loc.name}</h3>
                    <p className="text-[10px] md:text-xs text-stone-500 text-center mb-3 min-h-[2rem]">{loc.desc}</p>
                  </>
                )}

                {heroinesInLoc.length > 0 ? (
                  <div className="mt-auto flex flex-col items-center w-full gap-1">
                    {heroinesInLoc.map((heroine) => {
                      const route = getDreambookRoute(state, heroine.id as HeroineId);
                      const routeText = route.nextReady
                        ? `可触发：${route.nextEvent?.title || '新剧情'}`
                        : route.nextEvent
                        ? route.nextNote
                        : '路线暂告一段落';

                      return (
                        <div
                          key={heroine.id}
                          className={`w-full text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg border ${heroine.mbtiColor}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 min-w-0">
                              {heroine.portrait ? (
                                <img
                                  src={heroine.portrait}
                                  alt=""
                                  className="w-5 h-5 rounded-full object-cover object-top border border-white/80 bg-white shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center shrink-0">
                                  {heroine.avatar}
                                </span>
                              )}
                              <span className="truncate">{heroine.name}</span>
                            </span>
                            <span className="shrink-0">♥ {affection[heroine.id as keyof typeof affection]}</span>
                          </div>
                          <div className="mt-1 truncate text-[10px] font-medium opacity-80">
                            {routeText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-auto text-xs text-stone-400 italic">空旷无人</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative z-10 mt-3 text-center text-xs text-stone-600 font-bold shrink-0">
          当前天气【{weather.name}】：{weather.effect}
        </div>
      </div>
    </div>
  );
}
