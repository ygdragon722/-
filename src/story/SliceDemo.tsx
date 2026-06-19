// 全局流程骨架（三天完整链路已搭好）：
// 开场 → 第一天(凤姐/黛玉/王夫人) → 第一天总结 →
// 第二天过渡 → 第二天场次(贾母等，待审) → 第二天总结 →
// 第三天过渡 → 第三天场次(道德抉择，待写) → 终局(判词)
//
// 占位说明：day2/day3 的内容文档还在审阅中（见 docs/第二天_丫鬬之死_贾母初场_待审_*.md），
// 在这之前用 Placeholder 占住流程位置，保证整条链路能跑通预览。
// 审完后：把对应 Stage 的 Placeholder 换成真组件（BeatScene 过渡 + EncounterView 场次 + DaySummary 总结）即可，
// 不需要再改整体结构。
import { useState } from 'react';
import type { ReadKey } from './types';
import Opening from './Opening';
import EncounterView from './EncounterView';
import BeatScene from './BeatScene';
import Day1Wrap from './Day1Wrap';
import Placeholder from './Placeholder';
import Ending from './Ending';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';
import { DAIYU, SCENE_XIAOXIANG, ENC_DAIYU_D1, CLUE_DAIYU_JADE } from './data/daiyu';
import { WANGFUREN, SCENE_SHANGFANG, ENC_WANGFUREN_D1, CLUE_WANGFUREN_COLD } from './data/wangfuren';
import { DAY2_BEATS } from './data/day2';
import { JIAMU, SCENE_RONGQING, ENC_JIAMU_D2, CLUE_JIAMU_SILENCE } from './data/jiamu';

type Stage =
  | 'opening'
  | 'fengjie' | 'daiyu' | 'wangfuren' | 'day1wrap'
  | 'day2_transition' | 'day2_jiamu' | 'day2_wangfuren2' | 'day2wrap'
  | 'day3_transition' | 'day3_encounters'
  | 'ending';

// 每场留下的痕迹：读到真话没有 + 用了什么读法 + 玩家原话（供结局归纳"你是谁"、原句回放）
interface Mark { reachedTruth: boolean; readKey: ReadKey; playerLine: string }

export default function SliceDemo() {
  const [name, setName] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('opening');
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  const restart = () => {
    setName(null);
    setStage('opening');
    setMarks({});
  };

  const mark = (who: string) => (info: Mark) =>
    setMarks((m) => ({ ...m, [who]: info }));

  if (name === null || stage === 'opening') {
    return <Opening onDone={(n) => { setName(n); setStage('fengjie'); }} />;
  }

  // ===== 第一天：三场已定稿 =====
  if (stage === 'fengjie') {
    return (
      <EncounterView
        key="fengjie"
        npc={FENGJIE}
        scene={SCENE_OPERA_HALL}
        encounter={ENC_FENGJIE_D1}
        clue={CLUE_FENGJIE_FINANCE}
        onResolve={mark('fengjie')}
        onNext={() => setStage('daiyu')}
        nextLabel="前往潇湘馆 →"
      />
    );
  }

  if (stage === 'daiyu') {
    return (
      <EncounterView
        key="daiyu"
        npc={DAIYU}
        scene={SCENE_XIAOXIANG}
        encounter={ENC_DAIYU_D1}
        clue={CLUE_DAIYU_JADE}
        onResolve={mark('daiyu')}
        onNext={() => setStage('wangfuren')}
        nextLabel="前往上房 →"
      />
    );
  }

  if (stage === 'wangfuren') {
    return (
      <EncounterView
        key="wangfuren"
        npc={WANGFUREN}
        scene={SCENE_SHANGFANG}
        encounter={ENC_WANGFUREN_D1}
        clue={CLUE_WANGFUREN_COLD}
        onResolve={mark('wangfuren')}
        onNext={() => setStage('day1wrap')}
        nextLabel="把听见的话摆到一起 →"
      />
    );
  }

  if (stage === 'day1wrap') {
    return (
      <Day1Wrap
        name={name}
        reachedFengjie={marks.fengjie?.reachedTruth ?? false}
        reachedDaiyu={marks.daiyu?.reachedTruth ?? false}
        reachedWangfuren={marks.wangfuren?.reachedTruth ?? false}
        onContinue={() => setStage('day2_transition')}
      />
    );
  }

  // ===== 第二天：过渡 + 贾母初场已定稿，王夫人第二场待写 =====
  if (stage === 'day2_transition') {
    return <BeatScene beats={DAY2_BEATS} chapterLabel="第二天" onComplete={() => setStage('day2_jiamu')} />;
  }

  if (stage === 'day2_jiamu') {
    return (
      <EncounterView
        key="jiamu"
        npc={JIAMU}
        scene={SCENE_RONGQING}
        encounter={ENC_JIAMU_D2}
        clue={CLUE_JIAMU_SILENCE}
        onResolve={mark('jiamu')}
        onNext={() => setStage('day2_wangfuren2')}
        nextLabel="继续 →"
      />
    );
  }

  if (stage === 'day2_wangfuren2') {
    return (
      <Placeholder
        label="王夫人第二场 · 她那只手（待写）"
        note="案件宪法：正式被怀疑的一场，与凤姐财务案、丫鬬之死同一根线。"
        onContinue={() => setStage('day2wrap')}
      />
    );
  }

  if (stage === 'day2wrap') {
    return (
      <Placeholder
        label="第二天总结（待写）"
        note="用 DaySummary 渲染，内容待第二天场次定稿后再写。"
        continueLabel="前往第三天 →"
        onContinue={() => setStage('day3_transition')}
      />
    );
  }

  // ===== 第三天：道德抉择，待写 =====
  if (stage === 'day3_transition') {
    return (
      <Placeholder
        label="第三天 · 过渡（待写）"
        note="案件宪法：两案同一根线，道德抉择——点燃真相 / 像所有人一样埋了她。"
        onContinue={() => setStage('day3_encounters')}
      />
    );
  }

  if (stage === 'day3_encounters') {
    return (
      <Placeholder
        label="第三天场次 · 道德抉择（待写）"
        note="这是全局唯一的分叉点（点燃/埋了），结局正文按此分支。"
        continueLabel="前往终局 →"
        onContinue={() => setStage('ending')}
      />
    );
  }

  // ===== 终局：唯一出现判词的地方 =====
  return (
    <Ending
      readKeys={[
        marks.fengjie?.readKey,
        marks.daiyu?.readKey,
        marks.wangfuren?.readKey,
        marks.jiamu?.readKey,
      ]}
      recap={[
        { npc: '凤姐', line: marks.fengjie?.playerLine },
        { npc: '黛玉', line: marks.daiyu?.playerLine },
        { npc: '王夫人', line: marks.wangfuren?.playerLine },
        { npc: '贾母', line: marks.jiamu?.playerLine },
      ]}
      onRestart={restart}
    />
  );
}
