import type { GameState, EventChoice } from '../types/game';
import { ITEMS } from '../data/items';

interface Props {
  state: GameState;
  onChoice: (choice: EventChoice) => void;
}

export default function EventModal({ state, onChoice }: Props) {
  const { currentEvent, silver, talent, inventory } = state;
  if (!currentEvent) return null;

  return (
    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center">
      <div
        className={`w-full h-full max-h-[480px] ${currentEvent.character?.bg || 'bg-white'} border-2 ${
          currentEvent.character?.border || 'border-stone-400'
        } rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in`}
      >
        <div
          className={`bg-stone-900 text-stone-100 p-3 px-5 text-lg font-bold flex justify-between items-center ${
            currentEvent.isRandomEvent ? 'bg-red-950 border-b-2 border-red-600' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <span>
              {currentEvent.isRandomEvent && '⚠️ '}
              {currentEvent.character?.name || '事件'}
            </span>
            {currentEvent.character?.mbti && (
              <span className="text-[10px] bg-stone-700 px-2 py-0.5 rounded text-amber-300 font-mono tracking-widest">
                {currentEvent.character.mbti}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 flex-grow overflow-y-auto flex gap-6 items-start">
          {currentEvent.character?.avatar && (
            <div
              className={`w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg border-2 ${
                currentEvent.character?.border || 'border-stone-400'
              } bg-white flex flex-col items-center justify-center shadow-inner`}
            >
              <span className="text-5xl md:text-6xl">{currentEvent.character.avatar}</span>
            </div>
          )}
          <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium text-stone-800 mt-2">
            {currentEvent.text}
          </p>
        </div>

        <div className="p-4 bg-white/80 border-t border-stone-300 space-y-3 shrink-0">
          {currentEvent.choices.map((choice, idx) => {
            const canAffordSilver = !choice.cost?.silver || silver >= choice.cost.silver;
            const canAffordTalent = !choice.req?.talent || talent >= choice.req.talent;
            const canAffordItem = !choice.req?.item || (inventory[choice.req.item] && inventory[choice.req.item] > 0);
            const isClickable = canAffordSilver && canAffordTalent && canAffordItem;

            return (
              <button
                key={idx}
                onClick={() => onChoice(choice)}
                disabled={!isClickable}
                className={`w-full text-left p-3 rounded border transition flex flex-col
                  ${
                    isClickable
                      ? 'bg-stone-50 border-stone-400 hover:border-red-600 hover:bg-red-50 text-stone-800'
                      : 'bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed opacity-70'
                  }`}
              >
                <div className="font-bold">{choice.text}</div>
                {!canAffordSilver && (
                  <div className="text-xs text-red-500 mt-1">
                    💡 银两不足 (需要 {choice.req?.silver || choice.cost?.silver} 两)
                  </div>
                )}
                {!canAffordTalent && (
                  <div className="text-xs text-red-500 mt-1">💡 能力不足: 才学需达到 {choice.req?.talent} </div>
                )}
                {!canAffordItem && (
                  <div className="text-xs text-red-500 mt-1">
                    💡 缺少物品: 【{choice.req?.item ? ITEMS[choice.req.item]?.name || '未知' : '未知物品'}】
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
