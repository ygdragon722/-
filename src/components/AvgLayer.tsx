import { useState, useEffect, useCallback } from 'react';
import type { GameState, EventChoice, HeroineId } from '../types/game';
import { ITEMS } from '../data/items';
import { LOCATIONS } from '../data/locations';
import { HEROINE_TONES } from '../store/gameReducer';

const GARDEN_BG = './assets/ui/menu-bg.webp';
const TYPING_SPEED_MS = 22; // 每 tick 前进的字符数
const CHARS_PER_TICK = 2;

const TONE_LABELS: Record<string, string> = {
  empathy: '情感共鸣',
  planning: '务实规划',
  play: '即兴同乐',
  reform: '改革同盟',
  care: '贴心守护',
  rebel: '叛逆同频',
  aesthetic: '审美理解',
};

interface Props {
  state: GameState;
  onChoice: (choice: EventChoice) => void;
}

export default function AvgLayer({ state, onChoice }: Props) {
  const { currentEvent, silver, talent, inventory } = state;

  // ── Typewriter state（合并 text + index，避免 setState-in-effect 问题）──
  const fullText = currentEvent?.text ?? '';
  const [typing, setTyping] = useState({ text: fullText, index: 0 });

  // React 推荐的"渲染期派生状态"模式：text 变化时同步重置 index
  if (typing.text !== fullText) {
    setTyping({ text: fullText, index: 0 });
  }

  const isTyping = typing.index < typing.text.length;
  const displayText = typing.text.slice(0, typing.index);

  // ── MBTI flash state ──────────────────────────────────────────────
  const [flashKey, setFlashKey] = useState(0);
  const [flashVisible, setFlashVisible] = useState(false);

  // Typewriter interval
  useEffect(() => {
    if (!isTyping) return;
    const id = setInterval(() => {
      setTyping((prev) => ({ ...prev, index: Math.min(prev.index + CHARS_PER_TICK, prev.text.length) }));
    }, TYPING_SPEED_MS);
    return () => clearInterval(id);
  }, [isTyping]);

  // flash 自动隐藏（动画时长 1.1s）
  useEffect(() => {
    if (!flashVisible) return;
    const id = setTimeout(() => setFlashVisible(false), 1100);
    return () => clearTimeout(id);
  }, [flashKey, flashVisible]);

  const skipTyping = useCallback(() => {
    if (isTyping) setTyping((prev) => ({ ...prev, index: prev.text.length }));
  }, [isTyping]);

  const handleChoiceClick = useCallback(
    (choice: EventChoice) => {
      const charId = currentEvent?.character?.id as HeroineId | undefined;
      const preferredTone = charId ? HEROINE_TONES[charId] : undefined;
      const isMatch = choice.tone && preferredTone && choice.tone === preferredTone;

      if (isMatch) {
        setFlashKey((k) => k + 1);
        setFlashVisible(true);
        // 短暂延迟后执行选项，让玩家看到 flash
        setTimeout(() => onChoice(choice), 900);
      } else {
        onChoice(choice);
      }
    },
    [currentEvent, onChoice],
  );

  if (!currentEvent) return null;

  const char = currentEvent.character;

  // 背景优先级：事件 CG > 角色所在地点场景 > 大观园主视图
  let bgImage = GARDEN_BG;
  if (currentEvent.image) {
    bgImage = currentEvent.image;
  } else if (char && 'location' in char && (char as { location?: string }).location) {
    const loc = LOCATIONS[(char as { location: string }).location];
    if (loc?.image) bgImage = loc.image;
  }

  // 有 CG 时不单独显示立绘
  const portrait = currentEvent.image ? undefined : char?.portrait;
  const characterName = char?.name || '事件';
  const charTitle = char && 'title' in char ? (char as { title: string }).title : '';
  const mbtiText = char?.mbti || '';
  const eventTitle = currentEvent.title || '';

  // 当前角色偏好 tone（用于高亮匹配选项）
  const charId = char?.id as HeroineId | undefined;
  const preferredTone = charId ? HEROINE_TONES[charId] : undefined;

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-serif">
      {/* ── 背景 ── */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = GARDEN_BG;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/55" />
      </div>

      {/* ── 事件标题徽章（顶部居中） ── */}
      {(eventTitle || currentEvent.isRandomEvent) && (
        <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2 pointer-events-none">
          <span
            className={`inline-block rounded-full border px-5 py-1 text-sm font-bold tracking-widest backdrop-blur-sm ${
              currentEvent.isRandomEvent
                ? 'border-red-500/70 bg-red-950/85 text-red-200'
                : 'border-amber-400/50 bg-stone-950/80 text-amber-200'
            }`}
          >
            {currentEvent.isRandomEvent ? '突发事件' : eventTitle}
          </span>
        </div>
      )}

      {/* ── 场景区（弹性高度）：立绘锚定在此区底部 ── */}
      <div className="relative min-h-0 flex-1">
        {portrait && (
          <div className="absolute bottom-0 left-6 z-10 hidden md:block lg:left-10">
            <img
              src={portrait}
              alt={characterName}
              className="h-[65vh] max-h-[500px] w-auto object-cover object-top drop-shadow-[0_4px_48px_rgba(0,0,0,0.95)]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* ── 对白面板（底部固定） ── */}
      <div className="relative z-20 shrink-0 border-t border-white/10 bg-stone-950/93 backdrop-blur-md">

        {/* MBTI flash 徽章（悬浮在对白框顶边上方） */}
        {flashVisible && (
          <div
            key={flashKey}
            className="animate-flash-badge pointer-events-none absolute left-1/2 top-0 -translate-y-full -translate-x-1/2 pb-2"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/60 bg-emerald-900/90 px-4 py-1.5 text-sm font-bold text-emerald-200 shadow-lg backdrop-blur-sm">
              ♥ 心有灵犀 · 理解度 +5
            </span>
          </div>
        )}

        <div className={`mx-auto max-w-5xl px-5 py-5 ${portrait ? 'md:pl-60 lg:pl-64' : ''}`}>

          {/* 角色名行 */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {/* 移动端小圆形头像 */}
            {char?.portrait && (
              <img
                src={char.portrait}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full border border-white/25 object-cover object-top md:hidden"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="text-xl font-bold tracking-widest text-amber-200">{characterName}</span>
            {charTitle && <span className="text-sm tracking-wide text-stone-400">{charTitle}</span>}
            {mbtiText && (
              <span className="rounded border border-stone-600 bg-stone-800/80 px-2 py-0.5 font-mono text-xs tracking-widest text-amber-400/80">
                {mbtiText}
              </span>
            )}
          </div>

          {/* 对白文字区（点击跳过打字） */}
          <div
            className={`mb-4 max-h-28 overflow-y-auto ${isTyping ? 'cursor-pointer' : ''}`}
            onClick={skipTyping}
            title={isTyping ? '点击跳过' : undefined}
          >
            <p className="whitespace-pre-wrap text-[15px] leading-8 text-stone-100">
              {displayText}
              {/* 打字光标 */}
              {isTyping && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-amber-300 align-middle" />
              )}
            </p>
          </div>

          {/* 选项 */}
          <div className="space-y-1.5">
            {currentEvent.choices.map((choice, idx) => {
              const canAffordSilver = !choice.cost?.silver || silver >= choice.cost.silver;
              const canAffordTalent = !choice.req?.talent || talent >= choice.req.talent;
              const canAffordItem =
                !choice.req?.item ||
                Boolean(inventory[choice.req.item] && inventory[choice.req.item] > 0);
              const enabled = canAffordSilver && canAffordTalent && canAffordItem;
              const isToneMatch = Boolean(choice.tone && preferredTone && choice.tone === preferredTone);

              return (
                <button
                  key={idx}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={!enabled || flashVisible}
                  className={`w-full rounded border px-4 py-2.5 text-left text-sm transition-all ${
                    !enabled
                      ? 'cursor-not-allowed border-white/6 bg-white/3 text-stone-600'
                      : isToneMatch
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-stone-100 hover:translate-x-1 hover:border-emerald-400/70 hover:bg-emerald-900/40'
                      : 'border-white/15 bg-white/6 text-stone-200 hover:translate-x-1 hover:border-amber-400/50 hover:bg-white/14'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 shrink-0 font-mono text-xs font-bold ${
                        !enabled ? 'text-stone-700' : isToneMatch ? 'text-emerald-400' : 'text-amber-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <div>{choice.text}</div>
                      {!canAffordTalent && (
                        <div className="mt-1 text-xs text-red-400/80">才学需达到 {choice.req?.talent}</div>
                      )}
                      {!canAffordSilver && (
                        <div className="mt-1 text-xs text-red-400/80">银两不足（需 {choice.cost?.silver} 两）</div>
                      )}
                      {!canAffordItem && choice.req?.item && (
                        <div className="mt-1 text-xs text-red-400/80">
                          需要【{ITEMS[choice.req.item]?.name || '未知物品'}】
                        </div>
                      )}
                    </div>
                    {/* tone 标签：匹配时绿色，非匹配时灰色 */}
                    {choice.tone && enabled && (
                      <span
                        className={`hidden shrink-0 self-center rounded px-1.5 py-0.5 font-mono text-[10px] sm:block ${
                          isToneMatch
                            ? 'bg-emerald-900/60 text-emerald-400'
                            : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        {TONE_LABELS[choice.tone] || choice.tone}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
