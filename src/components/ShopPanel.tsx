import { ITEMS } from '../data/items';

interface Props {
  silver: number;
  onBuy: (itemId: string) => void;
}

export default function ShopPanel({ silver, onBuy }: Props) {
  return (
    <div className="flex-grow flex flex-col animate-fade-in overflow-y-auto">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-amber-800 mb-1">宁荣街购物中心</h3>
          <p className="text-sm text-amber-700">新到极品名茶【老君眉】，专治各种精神洁癖。</p>
        </div>
        <div className="text-xl font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-300">
          {silver} 两
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-2 pb-4">
        {Object.values(ITEMS).map((item) => (
          <div
            key={item.id}
            className="border border-stone-200 rounded-lg p-3 flex gap-3 hover:shadow-md transition bg-white items-center"
          >
            <div className="text-3xl bg-stone-100 w-12 h-12 flex items-center justify-center rounded-lg border border-stone-200 shrink-0">
              {item.icon}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-stone-800 text-sm">{item.name}</div>
              <div className="text-[10px] text-stone-500 line-clamp-2 leading-tight mt-0.5">{item.desc}</div>
              <div className="text-xs font-bold text-yellow-600 mt-1">{item.price} 两</div>
            </div>
            <button
              onClick={() => onBuy(item.id)}
              disabled={silver < item.price}
              className="shrink-0 px-3 py-1.5 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 disabled:opacity-50 disabled:bg-stone-400 transition font-bold"
            >
              下单
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
