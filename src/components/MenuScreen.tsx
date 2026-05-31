interface Props {
  onStart: () => void;
  onGallery: () => void;
  hasSave: boolean;
  onContinue: () => void;
}

export default function MenuScreen({ onStart, onGallery, hasSave, onContinue }: Props) {
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden text-amber-50">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#78350f_0%,_transparent_70%)]"></div>
      <div className="z-10 text-center space-y-12">
        <div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-serif text-red-600 mb-6 tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-2xl"
            style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.8)' }}
          >
            红楼幻梦
          </h1>
          <p className="text-xl tracking-widest text-stone-400 font-light">大观园群芳谱 · 终极完整版</p>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 w-full max-w-xs px-4 mx-auto">
          {hasSave && (
            <button
              onClick={onContinue}
              className="px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white border-2 border-emerald-600 rounded-lg text-xl font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-fade-in-up"
            >
              继续梦境
            </button>
          )}
          <button
            onClick={onStart}
            className="px-8 py-4 bg-red-800 hover:bg-red-700 text-white border-2 border-amber-600 rounded-lg text-xl font-bold transition shadow-[0_0_15px_rgba(180,83,9,0.4)]"
          >
            大梦初觉 (入梦)
          </button>
          <button
            onClick={onGallery}
            className="px-8 py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-lg text-lg transition"
          >
            太虚幻境 (图鉴)
          </button>
        </div>
      </div>
    </div>
  );
}
