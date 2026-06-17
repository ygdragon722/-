import type { GameState } from '../types/game';
import { ALL_ENDINGS } from '../data/endings';
import { HEROINE_IDS } from '../store/gameReducer';

const BG = './assets/ui/menu-bg.webp';

// 每个结局对应的色调（用于标题和边框渲染）
const ENDING_PALETTE: Record<string, { title: string; accent: string; border: string }> = {
  daiyu_ending:    { title: 'text-pink-200',   accent: 'border-pink-400/50',   border: 'from-pink-950/80' },
  baochai_ending:  { title: 'text-amber-200',  accent: 'border-amber-400/50',  border: 'from-amber-950/80' },
  xiangyun_ending: { title: 'text-orange-200', accent: 'border-orange-400/50', border: 'from-orange-950/80' },
  tanchun_ending:  { title: 'text-purple-200', accent: 'border-purple-400/50', border: 'from-purple-950/80' },
  miaoyu_ending:   { title: 'text-cyan-200',   accent: 'border-cyan-400/50',   border: 'from-cyan-950/80' },
  study_ending:    { title: 'text-blue-200',   accent: 'border-blue-400/50',   border: 'from-blue-950/80' },
  qingwen_ending:  { title: 'text-red-200',    accent: 'border-red-400/50',    border: 'from-red-950/80' },
  xiren_ending:    { title: 'text-stone-200',  accent: 'border-stone-400/50',  border: 'from-stone-800/80' },
  bad_ending:      { title: 'text-stone-400',  accent: 'border-stone-600/50',  border: 'from-stone-950/90' },
};

const HEROINE_NAMES: Record<string, string> = {
  daiyu: '黛玉', baochai: '宝钗', xiangyun: '湘云',
  tanchun: '探春', xiren: '袭人', qingwen: '晴雯', miaoyu: '妙玉',
};

interface Props {
  state: GameState;
  onGallery: () => void;
  onMenu: () => void;
}

export default function EndingScreen({ state, onGallery, onMenu }: Props) {
  const { endingData, talent, silver, affection, mbtiInsight, completedEvents } = state;
  if (!endingData) return null;

  const palette = ENDING_PALETTE[endingData.id] ?? ENDING_PALETTE.bad_ending;
  const galleryEntry = ALL_ENDINGS.find((e) => e.id === endingData.id);

  // 统计剧情完成数
  const totalCompleted = completedEvents.filter((id) => id).length;

  return (
    <div className="relative min-h-screen overflow-hidden font-serif text-stone-100">
      {/* 背景 */}
      <img src={BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-t ${palette.border} via-stone-950/60 to-stone-950/75`} />

      {/* 内容区 */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">

        {/* 顶部小标 */}
        <p className="mb-6 text-xs tracking-[0.4em] text-stone-400 uppercase">
          第三十日 · 尾声
        </p>

        {/* 结局标题 */}
        <div className={`mb-2 inline-block rounded-full border px-6 py-1 text-sm tracking-widest ${palette.accent} bg-stone-950/60`}>
          {galleryEntry?.icon ?? '◆'} &ensp; 结局达成
        </div>
        <h1 className={`mt-4 text-5xl font-bold tracking-[0.2em] drop-shadow-lg ${palette.title}`}>
          {endingData.title}
        </h1>

        {/* 分隔线 */}
        <div className={`my-8 h-px w-48 bg-gradient-to-r from-transparent ${palette.accent.replace('border-', 'via-')} to-transparent opacity-70`} />

        {/* 主文案 */}
        <p className="max-w-xl text-lg leading-9 text-stone-200">
          {endingData.desc}
        </p>

        {/* 场景诗句 */}
        {endingData.scene && (
          <p className="mt-6 max-w-md text-sm italic leading-8 text-stone-400">
            {endingData.scene}
          </p>
        )}

        {/* 数据面板 */}
        <div className="mt-12 w-full max-w-xl rounded-lg border border-white/10 bg-stone-950/70 px-6 py-5 backdrop-blur-sm">
          {/* 资源行 */}
          <div className="mb-4 flex justify-center gap-10 text-sm">
            <div>
              <span className="text-stone-500">才学</span>
              <span className="ml-2 font-bold text-blue-300">{talent}</span>
            </div>
            <div>
              <span className="text-stone-500">银两</span>
              <span className="ml-2 font-bold text-yellow-300">{silver}</span>
            </div>
            <div>
              <span className="text-stone-500">剧情</span>
              <span className="ml-2 font-bold text-emerald-300">{totalCompleted} 段</span>
            </div>
          </div>

          {/* 好感 + 理解度 */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
            {HEROINE_IDS.map((id) => {
              const aff = affection[id] ?? 0;
              const ins = mbtiInsight[id] ?? 0;
              return (
                <div key={id} className="space-y-1">
                  <div className="text-stone-400">{HEROINE_NAMES[id]}</div>
                  <div className="font-bold text-rose-300">♥ {aff}</div>
                  <div className="text-amber-400/80">◈ {ins}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-center gap-4 text-[10px] text-stone-600">
            <span>♥ 好感</span>
            <span>◈ 理解度</span>
          </div>
        </div>

        {/* 按钮 */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={onGallery}
            className="rounded border border-white/20 bg-white/8 px-8 py-3 text-sm font-bold text-stone-200 backdrop-blur-sm transition hover:bg-white/15"
          >
            查看档案
          </button>
          <button
            onClick={onMenu}
            className={`rounded border px-8 py-3 text-sm font-bold backdrop-blur-sm transition hover:opacity-90 ${palette.accent} bg-stone-950/60 ${palette.title}`}
          >
            返回主菜单
          </button>
        </div>

      </div>
    </div>
  );
}
