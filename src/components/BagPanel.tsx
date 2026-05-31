import { ITEMS } from '../data/items';
import type { Inventory } from '../types/game';

interface Props {
  inventory: Inventory;
  onUse: (itemId: string) => void;
}

export default function BagPanel({ inventory, onUse }: Props) {
  const hasItems = Object.keys(inventory).some((k) => inventory[k] > 0);

  return (
    <div className="flex-grow flex flex-col animate-fade-in overflow-y-auto">
      <div className="bg-stone-100 border border-stone-300 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-stone-800 mb-1">个人资产库</h3>
        <p className="text-sm text-stone-500">礼物在触发对应剧情时自动消耗，补品可直接使用回血。</p>
      </div>
      {!hasItems ? (
        <div className="text-center text-stone-400 my-auto">你的资产负债表十分干净，去搞点钱吧。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-2">
          {Object.keys(inventory).map((itemId) => {
            const qty = inventory[itemId];
            if (qty <= 0) return null;
            const item = ITEMS[itemId];
            if (!item) return null;
            return (
              <div key={itemId} className="border border-stone-200 rounded-lg p-3 flex items-center gap-4 bg-white">
                <div className="text-3xl bg-stone-50 w-12 h-12 flex items-center justify-center rounded border border-stone-200 relative">
                  {item.icon}
                  <span className="absolute -bottom-2 -right-2 bg-stone-800 text-white text-[10px] px-1.5 rounded-full border-2 border-white">
                    x{qty}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="font-bold text-stone-800">
                    {item.name}{' '}
                    <span className="text-xs font-normal text-stone-400 ml-2">
                      ({item.type === 'gift' ? '礼物' : '补药'})
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">{item.desc}</div>
                </div>
                {item.type === 'consumable' && (
                  <button
                    onClick={() => onUse(itemId)}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition shadow font-bold"
                  >
                    服用
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
