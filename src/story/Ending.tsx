// 全局终极结局：回顾原话 → 判断逻辑 → 反过来读你（三字标题 + 白话引句 + 判词）。
// 这是走完所有天数才触发的唯一终局——判词是给走到最后的人的文学奖励，不在中途提前揭晓。
import { useEffect, useState } from 'react';
import type { ReadKey } from './types';
import { EPILOGUE, GIRL_VERDICT, MORAL_CODA, type JadeChoice, type GirlChoice } from './data/day3';
import { trackEndingReached } from '../analytics';

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
}

interface Beat {
  content: React.ReactNode;
}

// 六种判词原型：三字标题（性格画像）+ 白话引句（情绪先命中）+ 判词（文学奖励层）
interface Verdict {
  title: string;
  vernacular: string;
  poem: string[];
  logic: string; // 判断逻辑的过渡句：为什么会得出这个结论
}

const VERDICTS: Record<
  'soft' | 'watcher' | 'blunt' | 'chameleon' | 'biased' | 'aloof',
  Verdict
> = {
  soft: {
    title: '心太软',
    vernacular: '你把别人的伤都接住了，自己的呢？',
    poem: ['一片心肠对镜悬，', '逢人垂泪即同煎。', '痴情纵好难周全，', '解尽旁人解己难。'],
    logic: '一路上，你都先去接住了对方没说出口的情绪——这不是哪一次凑巧，这是你看人的默认设置。',
  },
  watcher: {
    title: '旁观者',
    vernacular: '你看懂了所有人，除了自己。',
    poem: ['冷眼旁观一夜灯，', '看人看到骨三分。', '万般心事都收尽，', '独有自家无处问。'],
    logic: '一路上，你都没有真正开口靠近——你习惯先退一步，把人看清楚，再决定要不要说话。',
  },
  blunt: {
    title: '直性子',
    vernacular: '你总要的是真话，不是体面。',
    poem: ['单刀直入叩重门，', '要的真话不要恩。', '心扉撞开人退尽，', '自己那扇，几时问？'],
    logic: '一路上，你至少多次选择把问题直接摆到对方面前——你要的是真话，不是周全。',
  },
  chameleon: {
    title: '百变心',
    vernacular: '你换了好几种方式去贴近不同的人——这是温柔，还是没有自己？',
    poem: ['一夜变作三副心，', '逢人换装总相迎。', '柔软原是真本性，', '却被人间认作轻。'],
    logic: '一路上，你用了几种全然不同的方式——没有固定的招，你是跟着对面那个人走的。',
  },
  biased: {
    title: '偏心眼',
    vernacular: '你以为自己一向清醒，可总有那么一次，你也乱过。',
    poem: ['惯持一尺量众生，', '那夜为谁尺失平。', '你说自己最分明，', '原来也有乱方寸。'],
    logic: '一路上，你大多数时候是同一种方式——但有那么一次，你为了某个人，破了例。',
  },
  aloof: {
    title: '高冷系',
    vernacular: '你看了一整夜，却没有真正走近任何人。',
    poem: ['你立门外看众生，', '不肯近前论假真。', '看得清楚，记不深，', '镜中映出，是谁人？'],
    logic: '一路上，你都没有真正卸下防备去靠近谁——你站在每个人的门外，看着，没有进去。',
  },
};

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

export default function Ending({ readKeys, recap, jadeChoice, girlChoice, onRestart }: Props) {
  const [step, setStep] = useState(0);
  const verdict = pickVerdict(readKeys);

  useEffect(() => {
    trackEndingReached(verdict.title);
    // 只在终局首次到达时打一次点，verdict 由 readKeys 派生、本场不会再变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // 2：她的判词——随抉择二（女孩）变化
    {
      content:
        girlChoice === 'remember' ? (
          <div className="rounded-md border border-stone-700 bg-stone-900/60 p-5 text-center">
            <p className="mb-3 text-[11px] tracking-[0.3em] text-stone-500">她的判词</p>
            <div className="space-y-1.5">
              {GIRL_VERDICT.map((line, i) => (
                <p key={i} className="text-[15px] leading-8 tracking-wide text-stone-200">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-stone-800 bg-black/40 p-5 text-center">
            <p className="text-[14px] leading-8 text-stone-500">这里，本该有一首判词。</p>
            <p className="text-[14px] leading-8 text-stone-500">可你没有写。</p>
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
          <p className="mb-1 text-[12px] tracking-[0.4em] text-amber-200/60">反过来读你</p>
          <p className="mb-4 text-[22px] font-bold tracking-[0.2em] text-amber-50">{verdict.title}</p>
          <p className="mb-5 text-[14px] leading-7 text-stone-300">{verdict.vernacular}</p>
          <div className="space-y-1.5 border-t border-amber-200/20 pt-5">
            {verdict.poem.map((line, i) => (
              <p key={i} className="text-[15px] leading-8 tracking-wide text-amber-100">
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
        <button
          onClick={onRestart}
          className="mt-5 w-full rounded border border-stone-600 py-3 text-[14px] text-stone-300 transition hover:border-amber-300/60 hover:text-amber-100"
        >
          从头再读一遍
        </button>
      ),
    },
  ];

  const isDone = step >= beats.length;

  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-[440px] cursor-pointer flex-col bg-stone-950 px-7 py-12"
      onClick={() => !isDone && setStep((s) => s + 1)}
    >
      <p className="mb-8 text-center text-[12px] tracking-[0.4em] text-amber-200/60">终局</p>

      <div className="space-y-6">
        {beats.slice(0, step).map((beat, i) => (
          <div key={i} className="animate-fade-in">
            {beat.content}
          </div>
        ))}
      </div>

      {!isDone && (
        <div className="mt-auto pt-10 text-center text-[11px] tracking-widest text-stone-600">
          轻触继续
        </div>
      )}
    </div>
  );
}
