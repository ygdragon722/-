import type { GameEngine } from '../hooks/useGameEngine';
import StatsBar from './StatsBar';
import Sidebar from './Sidebar';
import LocationGrid from './LocationGrid';
import EventModal from './EventModal';
import ShopPanel from './ShopPanel';
import BagPanel from './BagPanel';

interface Props {
  engine: GameEngine;
}

export default function GameScreen({ engine }: Props) {
  const { state, setView, handleAction, exploreLocation, buyItem, useItem, handleChoice } = engine;
  const { currentView, currentEvent } = state;

  return (
    <div className="min-h-screen bg-stone-100 font-serif text-stone-800 p-4 md:p-8 flex justify-center items-start relative">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-stone-200 relative z-10">
        <StatsBar state={state} />

        <div className="flex flex-col md:flex-row h-full md:min-h-[650px]">
          <Sidebar state={state} onAction={handleAction} />

          <div className="w-full md:w-3/4 p-6 bg-white relative flex flex-col">
            <div className="flex space-x-2 mb-4 border-b border-stone-200 pb-2 shrink-0">
              <button
                onClick={() => setView('garden')}
                className={`px-4 py-2 rounded-t-lg font-bold transition ${
                  currentView === 'garden'
                    ? 'bg-red-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🗺️ 大观园游览图
              </button>
              <button
                onClick={() => setView('shop')}
                className={`px-4 py-2 rounded-t-lg font-bold transition ${
                  currentView === 'shop'
                    ? 'bg-amber-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🏪 宁荣街
              </button>
              <button
                onClick={() => setView('bag')}
                className={`px-4 py-2 rounded-t-lg font-bold transition flex items-center gap-1 ${
                  currentView === 'bag'
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🎒 锦囊 ({Object.values(state.inventory).reduce((a, b) => a + b, 0)})
              </button>
            </div>

            {!currentEvent && currentView === 'garden' && (
              <LocationGrid state={state} onExplore={exploreLocation} />
            )}

            {!currentEvent && currentView === 'shop' && (
              <ShopPanel silver={state.silver} onBuy={buyItem} />
            )}

            {!currentEvent && currentView === 'bag' && (
              <BagPanel inventory={state.inventory} onUse={useItem} />
            )}

            {currentEvent && <EventModal state={state} onChoice={handleChoice} />}
          </div>
        </div>
      </div>
    </div>
  );
}
