// 全局终极结局：回顾原话 → 判断逻辑 → 反过来读你（三字标题 + 白话引句 + 判词）。
// 这是走完所有天数才触发的唯一终局——判词是给走到最后的人的文学奖励，不在中途提前揭晓。
import { useEffect, useState } from 'react';
import type { ReadKey } from './types';
import { EPILOGUE, GIRL_VERDICT, MORAL_CODA, type JadeChoice, type GirlChoice } from './data/day3';
import { VERDICTS, type Verdict } from './data/verdicts';
import { trackEndingReached } from '../analytics';
import BackButton from './BackButton';
import { playUiSound } from './sound';
import VNButton from './VNButton';
import ScenePlaque from './ScenePlaque';

interface RecapItem {
  npc: string;
  line?: string;
}

interface Props {
  readKeys: (ReadKey | undefined)[]; // 全程各场用的读法（可能缺）
  recap: RecapItem[];                // 全程各场的玩家原话（供结局原句回放）
  jadeChoice: JadeChoice;
  girlChoice: GirlChoice;
  onRestart: () => void;
  onBack?: () => void;
}

interface Beat {
  content: React.ReactNode;
}

function pickVerdict(keys: (ReadKey | undefined)[]): Verdict {
  const picked = keys.filter(Boolean) as ReadKey[];
  if (picked.length === 0) return VERDICTS.aloof;

  const directCount = picked.filter((k) => k === 'confront' || k === 'logic').length;
  if (directCount >= 2) return VERDICTS.blunt;

  const count = picked.reduce<Record<string, number>>((a, k) => ((a[k] = (a[k] || 0) + 1), a), {});
  const distinct = Object.keys(count).length;

  if (distinct === 1) {
    if (picked[0] === 'empathy') return VERDICTS.soft;
    if (picked[0] === 'observe') return VERDICTS.watcher;
    return VERDICTS.biased; // 罕见：全程同一种小众读法，归到"偏心眼"
  }
  if (distinct === picked.length && picked.length >= 3) return VERDICTS.chameleon;
  return VERDICTS.biased;
}

// 这几拍是压轴牌，不让手快的人一划而过：翻到这一拍时短暂锁住点击，逼着多停一眼
// key＝该拍在 beats 数组里的下标（0 起）
const HELD_BEATS: Record<number, number> = { 2: 900, 4: 1400 };

export default function Ending({ readKeys, recap, jadeChoice, girlChoice, onRestart, onBack }: Props) {
  const [idx, setIdx] = useState(0); // 当前显示第几拍（0 起）
  const [locked, setLocked] = useState(false);
  const verdict = pickVerdict(readKeys);

  useEffect(() => {
    trackEndingReached(verdict.title);
    // 只在终局首次到达时打一次点，verdict 由 readKeys 派生、本场不会再变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = () => {
    if (locked) return;
    playUiSound('tap');
    const next = idx + 1;
    setIdx(next);
    const hold = HELD_BEATS[next];
    if (hold) {
      setLocked(true);
      setTimeout(() => setLocked(false), hold);
    }
  };

  const goBack = () => {
    if (idx > 0) {
      setIdx((i) => i - 1);
      setLocked(false);
      return;
    }
    onBack?.();
  };

  const beats: Beat[] = [
    // 0：原句回放——这一路你是怎么走过来的
    {
      content: (
        <div className="space-y-3">
          <p className="mb-2 text-center text-[12px] tracking-[0.3em] text-stone-500">
            这一路，你是这样走过来的
          </p>
          {recap.map((r, i) =>
            r.line ? (
              <div key={i} className="border-l-2 border-stone-600 pl-3">
                <span className="text-[11px] tracking-widest text-stone-500">{r.npc}</span>
                <p className="mt-0.5 text-[14px] leading-7 text-stone-200">{r.line}</p>
              </div>
            ) : null
          )}
        </div>
      ),
    },
    // 1：尾声——随抉择一（玉）变化
    {
      content: (
        <p className="text-center text-[14px] leading-8 text-stone-300">{EPILOGUE[jadeChoice]}</p>
      ),
    },
    // 2：她的判词——随抉择二（女孩）变化。记住/遗忘是全剧该被拉开差距的对比，
    // 故意不用同一种卡片：记住她的版本更暖、更隆重；忘记她的版本更空、更久地停在那句话上。
    {
      content:
        girlChoice === 'remember' ? (
          <div className="rounded-md border border-amber-200/30 bg-amber-50/[0.04] p-6 text-center">
            <p className="mb-4 text-[11px] tracking-[0.3em] text-amber-200/50">她的判词</p>
            <div className="space-y-2">
              {GIRL_VERDICT.map((line, i) => (
                <p key={i} className="font-serif text-[16px] leading-9 tracking-wide text-amber-100">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-stone-900 bg-black/50 px-5 py-12 text-center">
            <p className="text-[14px] leading-10 text-stone-600">这里，本该有一首判词。</p>
            <p className="text-[14px] leading-10 text-stone-600">可你没有写。</p>
          </div>
        ),
    },
    // 3：判断逻辑——为什么是这个结论
    {
      content: (
        <p className="text-center text-[14px] leading-8 text-stone-300">
          {verdict.logic}
        </p>
      ),
    },
    // 4：反过来读你——三字标题 + 白话引句 + 判词 + 道德定音句
    {
      content: (
        <div className="rounded-md border border-amber-300/40 bg-amber-100/[0.05] p-6 text-center backdrop-blur-sm">
          <p className="mb-1 text-center font-serif text-[12px] tracking-[0.4em] text-amber-200/60">反过来读你</p>
          <p className="mb-4 text-center font-serif text-[22px] font-bold tracking-[0.2em] text-amber-50">{verdict.title}</p>
          <p className="mb-5 text-[14px] leading-7 text-stone-300">{verdict.vernacular}</p>
          <div className="space-y-1.5 border-t border-amber-200/20 pt-5">
            {verdict.poem.map((line, i) => (
              <p key={i} className="font-serif text-[15px] leading-8 tracking-wide text-amber-100">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-5 border-t border-amber-200/20 pt-5 text-[13px] leading-7 text-amber-200/80">
            {MORAL_CODA[girlChoice]}
          </p>
        </div>
      ),
    },
    // 5：结尾 + 按钮
    {
      content: (
        <VNButton
          onClick={() => {
            playUiSound('dream');
            onRestart();
          }}
          variant="quiet"
          fullWidth
          className="mt-5"
        >
          从头再读一遍
        </VNButton>
      ),
    },
  ];

  const current = beats[idx];
  const isLastBeat = idx === beats.length - 1; // 最后一拍本身就是"从头再读一遍"按钮，不再包一层可点击外壳

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[440px] flex-col overflow-hidden bg-stone-950 px-7 py-12">
      <img
        src="./assets/scenes/ending-mirror-moon.webp"
        alt=""
        className="vn-scene-image absolute inset-0 h-full w-full object-cover animate-fade-in-scene"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/48 via-stone-950/34 to-stone-950/76" />

      <ScenePlaque title="终局" variant="chapter" className="mb-8" />
      {(idx > 0 || onBack) && (
        <div className="relative z-20 mb-4 flex justify-start">
          <BackButton label={idx > 0 ? '上一段' : '上一幕'} onClick={goBack} />
        </div>
      )}

      {isLastBeat ? (
        <>
          <div className="relative flex-1" />
          <div key={idx} className="relative w-full animate-fade-in">{current.content}</div>
        </>
      ) : (
        <button
          onClick={advance}
          disabled={locked}
          className="relative flex flex-1 cursor-pointer flex-col items-center justify-center disabled:cursor-not-allowed"
        >
          <div key={idx} className={`w-full ${HELD_BEATS[idx] ? 'animate-fade-in-grand' : 'animate-fade-in'}`}>
            {current.content}
          </div>
        </button>
      )}

      {!isLastBeat && (
        <div className="relative pt-6 text-center text-[11px] tracking-widest text-stone-300/80">
          轻触继续
        </div>
      )}
    </div>
  );
}
