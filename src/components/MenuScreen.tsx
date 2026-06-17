interface Props {
  onStart: () => void;
  onGallery: () => void;
  hasSave: boolean;
  onContinue: () => void;
}

const MENU_BG = './assets/ui/menu-bg.webp';

export default function MenuScreen({ onStart, onGallery, hasSave, onContinue }: Props) {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-amber-50">
      <div className="absolute inset-0 z-0">
        <img
          src={MENU_BG}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/58 to-stone-950/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/25" />
      </div>
      <div className="z-10 w-full max-w-5xl text-center md:text-left space-y-10 md:space-y-12">
        <div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-serif text-red-500 mb-5 tracking-[0.18em] sm:tracking-[0.26em] drop-shadow-2xl"
            style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.8)' }}
          >
            红楼幻梦
          </h1>
          <p className="text-base sm:text-xl tracking-widest text-amber-100/80 font-light">
            大观园群芳谱 · 终极完整版
          </p>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 w-full max-w-xs px-4 mx-auto md:mx-0 md:px-0">
          {hasSave && (
            <button
              onClick={onContinue}
              className="px-8 py-4 bg-emerald-800/95 hover:bg-emerald-700 text-white border-2 border-emerald-500 rounded-lg text-xl font-bold transition shadow-[0_0_20px_rgba(16,185,129,0.35)] animate-fade-in-up"
            >
              继续梦境
            </button>
          )}
          <button
            onClick={onStart}
            className="px-8 py-4 bg-red-800/95 hover:bg-red-700 text-white border-2 border-amber-500 rounded-lg text-xl font-bold transition shadow-[0_0_20px_rgba(180,83,9,0.35)]"
          >
            大梦初觉 (入梦)
          </button>
          <button
            onClick={onGallery}
            className="px-8 py-4 bg-stone-950/75 hover:bg-stone-900 text-stone-100 border border-amber-100/25 rounded-lg text-lg transition backdrop-blur"
          >
            太虚幻境 (图鉴)
          </button>
        </div>
      </div>
    </div>
  );
}
