import { ALL_ENDINGS } from '../data/endings';

interface Props {
  unlockedEndings: string[];
  onBack: () => void;
}

export default function GalleryScreen({ unlockedEndings, onBack }: Props) {
  return (
    <div className="min-h-screen bg-stone-900 p-8 flex flex-col items-center relative text-stone-200 font-serif">
      <div className="w-full max-w-5xl relative z-10">
        <div className="flex justify-between items-center border-b-2 border-stone-700 pb-4 mb-8">
          <h2 className="text-4xl text-amber-500 tracking-widest">太虚幻境 · MBTI 档案</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 border border-stone-500 rounded hover:bg-stone-800 transition"
          >
            返回尘世
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_ENDINGS.map((ending) => {
            const isUnlocked = unlockedEndings.includes(ending.id);
            return (
              <div
                key={ending.id}
                className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition ${
                  isUnlocked
                    ? 'bg-stone-800 border-amber-600/50 shadow-lg'
                    : 'bg-stone-900 border-stone-700 opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{isUnlocked ? ending.icon : '🔒'}</div>
                <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-amber-400' : 'text-stone-500'}`}>
                  {isUnlocked ? ending.title : '未解之缘'}
                </h3>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  {isUnlocked ? ending.desc : '你的经历还不足以翻开这一页...'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
