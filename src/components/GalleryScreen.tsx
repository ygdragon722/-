import { ALL_ENDINGS } from '../data/endings';

interface Props {
  unlockedEndings: string[];
  onBack: () => void;
}

const GALLERY_BG = './assets/ui/gallery-bg.webp';

export default function GalleryScreen({ unlockedEndings, onBack }: Props) {
  return (
    <div className="min-h-screen bg-stone-950 p-4 md:p-8 flex flex-col items-center relative text-stone-200 font-serif overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={GALLERY_BG}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-stone-950/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
      </div>
      <div className="w-full max-w-5xl relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:justify-between sm:items-center border-b-2 border-amber-100/20 pb-4 mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl text-amber-400 tracking-widest">太虚幻境 · MBTI 档案</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 border border-amber-100/30 rounded hover:bg-stone-900/80 transition bg-stone-950/45 backdrop-blur w-fit"
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
                className={`min-h-36 p-4 rounded-lg border flex flex-col items-center text-center transition backdrop-blur ${
                  isUnlocked
                    ? 'bg-stone-900/82 border-amber-500/55 shadow-lg shadow-black/25'
                    : 'bg-stone-950/68 border-stone-600/70 opacity-65 grayscale'
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
