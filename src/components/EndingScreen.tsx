import type { GameState } from '../types/game';

interface Props {
  state: GameState;
  onGallery: () => void;
  onMenu: () => void;
}

export default function EndingScreen({ state, onGallery, onMenu }: Props) {
  const { endingData, talent, silver, affection } = state;
  if (!endingData) return null;

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 opacity-30 bg-black"></div>
      <div className="max-w-3xl text-center space-y-6 bg-stone-800 p-12 rounded-2xl border-4 border-amber-800 text-stone-200 relative z-10 shadow-2xl animate-fade-in">
        <h1 className="text-5xl font-serif text-amber-500 mb-8 border-b-2 border-stone-600 pb-4">结局达成</h1>
        <h2 className="text-4xl text-red-500 font-bold mb-4">{endingData.title}</h2>
        <p className="text-xl leading-relaxed text-stone-300 font-serif mb-8">{endingData.desc}</p>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-2 my-8 bg-stone-900 border border-stone-700 p-6 rounded-lg text-sm font-bold">
          <div className="text-blue-400 col-span-3 md:col-span-2">才学: {talent}</div>
          <div className="text-yellow-500 col-span-3 md:col-span-2">银两: {silver}</div>
          <div className="text-pink-400 md:col-start-1">黛玉: {affection.daiyu}</div>
          <div className="text-blue-400">宝钗: {affection.baochai}</div>
          <div className="text-amber-400">湘云: {affection.xiangyun}</div>
          <div className="text-purple-400">探春: {affection.tanchun}</div>
          <div className="text-slate-400">妙玉: {affection.miaoyu}</div>
          <div className="text-stone-400">袭人: {affection.xiren}</div>
          <div className="text-red-400">晴雯: {affection.qingwen}</div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={onGallery}
            className="px-8 py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded border border-stone-500 font-bold text-lg transition"
          >
            查看档案
          </button>
          <button
            onClick={onMenu}
            className="px-8 py-3 bg-red-800 hover:bg-red-700 text-amber-100 rounded border border-amber-600 font-bold text-lg transition shadow-lg"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
