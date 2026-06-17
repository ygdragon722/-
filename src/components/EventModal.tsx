import type { GameState, EventChoice } from '../types/game';
import { ITEMS } from '../data/items';

interface Props {
  state: GameState;
  onChoice: (choice: EventChoice) => void;
}

export default function EventModal({ state, onChoice }: Props) {
  const { currentEvent, silver, talent, inventory } = state;
  if (!currentEvent) return null;
  const borderColor = currentEvent.character?.border || 'border-stone-400';
  const hasEventImage = Boolean(currentEvent.image);
  const characterBadge =
    currentEvent.character && 'mbtiColor' in currentEvent.character
      ? currentEvent.character.mbtiColor
      : 'bg-stone-100 text-stone-700 border-stone-300';
  const characterSubtitle =
    currentEvent.character && 'title' in currentEvent.character
      ? currentEvent.character.title
      : currentEvent.character?.mbti;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm p-3 md:p-8 flex items-center justify-center">
      <div
        className={`w-full max-w-3xl max-h-[92dvh] ${currentEvent.character?.bg || 'bg-white'} border-2 ${borderColor} rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in`}
      >
        <div
          className={`bg-stone-950 text-stone-100 p-3 px-4 md:px-5 text-lg font-bold flex justify-between items-center ${
            currentEvent.isRandomEvent ? 'bg-red-950 border-b-2 border-red-600' : ''
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="truncate">
              {currentEvent.isRandomEvent && '⚠️ '}
              {currentEvent.character?.name || '事件'}
            </span>
            {currentEvent.character?.mbti && (
              <span className="text-[10px] bg-stone-700 px-2 py-0.5 rounded text-amber-300 font-mono tracking-widest shrink-0">
                {currentEvent.character.mbti}
              </span>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto bg-gradient-to-br from-white/74 via-white/88 to-white/70">
          {currentEvent.image && (
            <div className="relative h-36 md:h-52 border-b border-stone-300 bg-stone-100 overflow-hidden">
              <img
                src={currentEvent.image}
                alt={currentEvent.character?.name ? `${currentEvent.character.name}事件插图` : '事件插图'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          )}

          <div
            className={`p-4 md:p-6 flex gap-4 md:gap-6 items-start ${
              hasEventImage ? 'flex-row' : 'flex-col md:flex-row'
            }`}
          >
            {currentEvent.character?.portrait ? (
              <div
                className={`shrink-0 rounded-lg border-2 ${borderColor} bg-white overflow-hidden shadow-lg ${
                  hasEventImage ? 'w-14 h-14 md:w-16 md:h-16' : 'w-24 h-32 md:w-44 md:h-56 mx-auto md:mx-0'
                }`}
              >
                <img
                  src={currentEvent.character.portrait}
                  alt={currentEvent.character.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : currentEvent.character?.avatar ? (
              <div
                className={`${hasEventImage ? 'w-14 h-14 md:w-16 md:h-16' : 'w-20 h-20 md:w-32 md:h-32'} shrink-0 rounded-lg border-2 ${
                  currentEvent.character?.border || 'border-stone-400'
                } bg-white flex flex-col items-center justify-center shadow-inner mx-auto md:mx-0`}
              >
                <span className={hasEventImage ? 'text-2xl md:text-3xl' : 'text-4xl md:text-6xl'}>{currentEvent.character.avatar}</span>
              </div>
            ) : null}
            <div className="flex-1 min-w-0">
              {hasEventImage && currentEvent.character && (
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full border font-bold ${characterBadge}`}>
                    {currentEvent.character.name}
                  </span>
                  <span className="text-stone-500">{characterSubtitle}</span>
                </div>
              )}
              <p className={`${hasEventImage ? 'text-sm md:text-base leading-7 md:leading-8' : 'text-base md:text-lg leading-8 md:leading-9'} whitespace-pre-wrap font-medium text-stone-800 mt-0 md:mt-1`}>
                {currentEvent.text}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-white/92 border-t border-stone-300 space-y-2 md:space-y-3 shrink-0 max-h-[36dvh] overflow-y-auto">
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
                      ? 'bg-stone-50 border-stone-300 hover:border-red-600 hover:bg-red-50 hover:translate-x-1 text-stone-800'
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
