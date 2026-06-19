// 收束卡：线索拼合 → 第一层真相。分批渐出，轻触逐步浮现，读完后出按钮。
import { useState } from 'react';

interface Props {
  name: string;
  reachedFengjie: boolean;
  reachedDaiyu: boolean;
  reachedWangfuren?: boolean;
  onRestart: () => void;
}

// 每个 beat 是独立渐出的一块
interface Beat {
  content: React.ReactNode;
}

export default function Reveal({ name, reachedFengjie, reachedDaiyu, reachedWangfuren, onRestart }: Props) {
  const [step, setStep] = useState(0);

  // 第一层真相（玉是宝玉自己藏的）专用线索
  const clues = [
    reachedFengjie && '凤姐袖里死攥着账册——她的混乱是为钱，不是为玉。她从头到尾，没碰过那块玉。',
    reachedDaiyu  && '黛玉说，她曾盼那块玉消失。而你今晚——也曾这么想过，对不对？',
  ].filter(Boolean) as string[];

  const beats: Beat[] = [
    // 0：引子
    {
      content: (
        <p className="text-center text-[15px] leading-9 text-stone-300">
          满府的人都在翻箱倒柜找那块玉。
          <br />
          只有你，把今晚听见的话，<br />一句句摆到了一起。
        </p>
      ),
    },
    // 1：线索板（整组一次出）
    {
      content: (
        <div className="space-y-3">
          {clues.length === 0 ? (
            <div className="rounded-md border border-stone-700 bg-stone-900/60 p-4">
              <p className="text-[14px] leading-7 text-stone-400">
                可你这一路，谁的真心话都没接住。<br />线索板上还空着。
              </p>
            </div>
          ) : (
            clues.map((c, i) => (
              <div key={i} className="rounded-md border border-stone-700 bg-stone-900/60 p-4">
                <p className="text-[14px] leading-7 text-stone-200">◆ {c}</p>
              </div>
            ))
          )}
        </div>
      ),
    },
    // 2：真相（完整版 or 悬而未决版）
    {
      content: (
        <div className="rounded-md border border-amber-300/40 bg-amber-100/[0.06] p-5 backdrop-blur-sm">
          {reachedDaiyu ? (
            <>
              <p className="text-[15px] leading-9 text-amber-50">
                玉不是丢的，不是偷的。<br />
                是你——这副身体里那个穿越前的宝玉——<br />亲手藏起来的。<br />
                他厌恶那块玉，厌恶它替他定好的"命"。<br />
                省亲那夜，他把它扔进了只有自己知道的地方。
              </p>
              <p className="mt-4 border-t border-amber-200/25 pt-3 text-[12px] leading-6 tracking-wide text-amber-200/80">
                真相 · 第一层揭开：玉始终是安全的。乱起的不是玉，是人。
              </p>
            </>
          ) : (
            <>
              <p className="text-[15px] leading-9 text-amber-50/90">
                你隐约觉得，玉的去向和凤姐的账册不是一回事。<br />
                可究竟是谁、为什么——<br />你还差一句话没听到。
                {name ? <><br />{name}，要读懂这副身体藏起的心事，<br />得先真正读懂一个人。</> : null}
              </p>
              <p className="mt-4 border-t border-amber-200/25 pt-3 text-[12px] leading-6 tracking-wide text-amber-200/70">
                第一层真相仍蒙着——你来过，但还没真正走近她。
              </p>
            </>
          )}
        </div>
      ),
    },
    // 2.5：王夫人的寒意（第三层伏笔，不属于这层真相，单独留一笔不混进线索板）
    ...(reachedWangfuren
      ? [
          {
            content: (
              <div className="rounded-md border border-stone-700 bg-stone-900/40 p-4">
                <p className="text-[13px] leading-7 text-stone-400">
                  另有一句，你还没想明白该摆在哪里——
                  <br />
                  王夫人说：「这府里见不得脏东西，脏的，总要拾干净。」
                  <br />
                  你说不清为什么，这句话让你脊背发凉。
                </p>
              </div>
            ),
          },
        ]
      : []),
    // 3：结尾说明 + 按钮
    {
      content: (
        <>
          <p className="text-center text-[12px] leading-7 text-stone-500">
            —— 试玩到此。后续还有王夫人那只手、贾母那只闭上的眼，
            <br />
            以及结局——会照着你这一路的选择，反过来读你一次。
          </p>
          <button
            onClick={onRestart}
            className="mt-5 w-full rounded border border-stone-600 py-3 text-[14px] text-stone-300 transition hover:border-amber-300/60 hover:text-amber-100"
          >
            从头再读一遍
          </button>
        </>
      ),
    },
  ];

  const isDone = step >= beats.length;

  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-[440px] cursor-pointer flex-col bg-stone-950 px-7 py-12"
      onClick={() => !isDone && setStep((s) => s + 1)}
    >
      <p className="mb-8 text-center text-[12px] tracking-[0.4em] text-amber-200/60">悟</p>

      <div className="space-y-6">
        {beats.slice(0, step).map((beat, i) => (
          <div key={i} className="animate-fade-in">
            {beat.content}
          </div>
        ))}
      </div>

      {/* 未读完时底部提示 */}
      {!isDone && (
        <div className="mt-auto pt-10 text-center text-[11px] tracking-widest text-stone-600">
          轻触继续
        </div>
      )}
    </div>
  );
}
