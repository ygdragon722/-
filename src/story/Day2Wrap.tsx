// 第二天日终总结：玉案已清，可有个真正死了的人没人管（道德层）。
// 与第一天"悟"一轻一重：第一天揭"玉是宝玉自己藏的"（解谜），第二天揭"人命这条线"（沉重）。
// 不含判词——判词只在 Ending.tsx。用通用外壳 DaySummary 渲染。
import DaySummary from './DaySummary';

interface Props {
  reachedJiamu: boolean;      // 读到贾母真话
  reachedWangfuren2: boolean; // 读到王夫人佛堂真话
  onContinue: () => void;     // 前往第三天
  onBack?: () => void;
}

export default function Day2Wrap({ reachedJiamu, reachedWangfuren2, onContinue, onBack }: Props) {
  const clues = [
    reachedJiamu &&
      '贾母不是不知道。她只是说——「查得太清楚，谁都没好处」。她选择了不去看。',
    reachedWangfuren2 &&
      '王夫人也不是不知道。她甚至觉得，自己做的是对的——「慈悲，有时候是要沾手的」。',
  ].filter(Boolean) as string[];

  const beats: React.ReactNode[] = [
    // 引子
    <p className="text-center text-[15px] leading-9 text-stone-300">
      玉的事，其实已经清了。
      <br />
      它从来就在那儿，安安静静，是这座府第自己慌了一夜。
      <br />
      <br />
      可这一天，真正没了的，是一个人。
    </p>,

    // 线索条（动态拼；都没读到给兜底）
    <div className="space-y-3">
      {clues.length === 0 ? (
        <div className="rounded-md border border-stone-700 bg-stone-900/60 p-4">
          <p className="text-[14px] leading-7 text-stone-400">
            ◆ 你问了，可这一天，没有人愿意把话说到底。<br />
            小蝉是怎么没的，依旧没人肯说。
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

    // 收束（锥心反讽）
    <div className="rounded-md border border-amber-300/40 bg-amber-100/[0.06] p-5 backdrop-blur-sm">
      <p className="text-[15px] leading-9 text-amber-50">
        一块玉，惊动了整座府第，几百口人翻箱倒柜地找。
        <br />
        一个活生生的女孩子没了，月例册子上轻轻一划，就像她从没来过。
        <br />
        <br />
        满府的人，到这一刻，还在找那块玉。
        <br />
        <span className="text-amber-200/90">只有你，记得井边那个女孩。</span>
      </p>
    </div>,

    // 过渡到第三天——预告的是接下来真正要做的两个决定（玉/女孩），不是单一的"说不说"
    <p className="text-center text-[13px] leading-8 text-stone-400">
      明日，是省亲的最后一日。
      <br />
      你手里攥着两件事——一块藏起来的玉，一个没人记得的人。
      <br />
      天亮之前，这两件事，都要由你来决定怎么收。
    </p>,
  ];

  return (
    <DaySummary
      tag="第二天"
      bg="./assets/scenes/day2wrap-night.webp"
      beats={beats}
      continueLabel="前往第三天 →"
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}
