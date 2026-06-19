// 第一天日终总结：线索拼合 → 第一层真相揭晓。不含判词——判词是全局唯一的终极结局，
// 要等玩家走完所有天数才触发（见 Ending.tsx）。用通用外壳 DaySummary 渲染。
import DaySummary from './DaySummary';

interface Props {
  name: string;
  reachedFengjie: boolean;
  reachedDaiyu: boolean;
  reachedWangfuren?: boolean;
  onContinue: () => void; // 前往第二天
}

export default function Day1Wrap({ name, reachedFengjie, reachedDaiyu, reachedWangfuren, onContinue }: Props) {
  const clues = [
    reachedFengjie && '凤姐袖里死攥着账册——她的混乱是为钱，不是为玉。她从头到尾，没碰过那块玉。',
    reachedDaiyu && '黛玉说，她曾盼那块玉消失。而你今晚——也曾这么想过，对不对？',
  ].filter(Boolean) as string[];

  const beats: React.ReactNode[] = [
    <p className="text-center text-[15px] leading-9 text-stone-300">
      满府的人都在翻箱倒柜找那块玉。
      <br />
      只有你，把今晚听见的话，<br />一句句摆到了一起。
    </p>,

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
    </div>,

    <div className="rounded-md border border-amber-300/40 bg-amber-100/[0.06] p-5 backdrop-blur-sm">
      {reachedDaiyu ? (
        <p className="text-[15px] leading-9 text-amber-50">
          玉不是丢的，不是偷的。<br />
          是你——这副身体里那个穿越前的宝玉——<br />亲手藏起来的。<br />
          他厌恶那块玉，厌恶它替他定好的"命"。<br />
          省亲那夜，他把它扔进了只有自己知道的地方。<br />
          <span className="mt-2 inline-block text-amber-200/80">玉始终是安全的。乱起的不是玉，是人。</span>
        </p>
      ) : (
        <p className="text-[15px] leading-9 text-amber-50/90">
          你隐约觉得，玉的去向和凤姐的账册不是一回事。<br />
          可究竟是谁、为什么——<br />你还差一句话没听到。
          {name ? <><br />{name}，要读懂这副身体藏起的心事，<br />得先真正读懂一个人。</> : null}
        </p>
      )}
    </div>,

    ...(reachedWangfuren
      ? [
          <div className="rounded-md border border-stone-700 bg-stone-900/40 p-4">
            <p className="text-[13px] leading-7 text-stone-400">
              另有一句，你还没想明白该摆在哪里——
              <br />
              王夫人说：「这府里见不得脏东西，脏的，总要拾干净。」
              <br />
              你说不清为什么，这句话让你脊背发凉。
            </p>
          </div>,
        ]
      : []),

    <p className="text-center text-[12px] leading-7 text-stone-500">
      夜深了。明日，省亲的喧闹会散去，
      <br />
      可这一夜你听见、看见的，不会一起散去。
    </p>,
  ];

  return <DaySummary tag="悟" beats={beats} continueLabel="前往第二天 →" onContinue={onContinue} />;
}
