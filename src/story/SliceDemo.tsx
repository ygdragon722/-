// 全局流程骨架（三天完整链路已实装）：
// 开场 → 第一天(凤姐/黛玉/王夫人) → 第一天总结 →
// 第二天过渡 → 第二天场次(贾母/王夫人佛堂) → 第二天总结 →
// 第三天过渡 → 抉择一·玉 → 过桥 → 抉择二·女孩 → 终局(判词)
import { useEffect, useState } from 'react';
import type { ReadKey } from './types';
import { loadSave, writeSave, clearSave } from './save';
import Opening from './Opening';
import EncounterView from './EncounterView';
import BeatScene from './BeatScene';
import ChoiceScene from './ChoiceScene';
import Day1Wrap from './Day1Wrap';
import Day2Wrap from './Day2Wrap';
import Ending from './Ending';
import { FENGJIE, SCENE_OPERA_HALL, ENC_FENGJIE_D1, CLUE_FENGJIE_FINANCE } from './data/fengjie';
import { DAIYU, SCENE_XIAOXIANG, ENC_DAIYU_D1, CLUE_DAIYU_JADE } from './data/daiyu';
import { WANGFUREN, SCENE_SHANGFANG, ENC_WANGFUREN_D1, CLUE_WANGFUREN_COLD } from './data/wangfuren';
import { DAY2_BEATS } from './data/day2';
import { JIAMU, SCENE_RONGQING, ENC_JIAMU_D2, CLUE_JIAMU_SILENCE } from './data/jiamu';
import { WANGFUREN_NPC, SCENE_FOTANG, ENC_WANGFUREN_D2, CLUE_WANGFUREN_HAND } from './data/wangfuren2';
import {
  DAY3_BEATS, DAY3_BRIDGE_BEATS, JADE_SETUP, JADE_CHOICES, JADE_BG, GIRL_SETUP, GIRL_CHOICES, GIRL_BG,
  type JadeChoice, type GirlChoice,
} from './data/day3';
import { trackRead, trackMoralChoice } from '../analytics';

type Stage =
  | 'opening'
  | 'fengjie' | 'daiyu' | 'wangfuren' | 'day1wrap'
  | 'day2_transition' | 'day2_jiamu' | 'day2_wangfuren2' | 'day2wrap'
  | 'day3_transition' | 'day3_jade' | 'day3_bridge' | 'day3_girl'
  | 'ending';

const STAGES: Stage[] = [
  'opening',
  'fengjie', 'daiyu', 'wangfuren', 'day1wrap',
  'day2_transition', 'day2_jiamu', 'day2_wangfuren2', 'day2wrap',
  'day3_transition', 'day3_jade', 'day3_bridge', 'day3_girl',
  'ending',
];
const isStage = (s: string): s is Stage => (STAGES as string[]).includes(s);

// 每场留下的痕迹：读到真话没有 + 用了什么读法 + 玩家原话（供结局归纳"你是谁"、原句回放）
interface Mark { reachedTruth: boolean; readKey: ReadKey; playerLine: string }

const saved = loadSave();

export default function SliceDemo() {
  const [name, setName] = useState<string | null>(saved?.name ?? null);
  const [stage, setStage] = useState<Stage>(saved && isStage(saved.stage) ? saved.stage : 'opening');
  const [marks, setMarks] = useState<Record<string, Mark>>((saved?.marks as Record<string, Mark>) ?? {});
  const [jadeChoice, setJadeChoice] = useState<JadeChoice>((saved?.jadeChoice as JadeChoice) ?? 'hide');
  const [girlChoice, setGirlChoice] = useState<GirlChoice>((saved?.girlChoice as GirlChoice) ?? 'leave');

  useEffect(() => {
    writeSave({ name, stage, marks, jadeChoice, girlChoice });
  }, [name, stage, marks, jadeChoice, girlChoice]);

  const restart = () => {
    clearSave();
    setName(null);
    setStage('opening');
    setMarks({});
    setJadeChoice('hide');
    setGirlChoice('leave');
  };

  const mark = (who: string) => (info: Mark) => {
    setMarks((m) => ({ ...m, [who]: info }));
    trackRead({ npcId: who, readKey: info.readKey, reachedTruth: info.reachedTruth });
  };

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
      <EncounterView
        key="wangfuren2"
        npc={WANGFUREN_NPC}
        scene={SCENE_FOTANG}
        encounter={ENC_WANGFUREN_D2}
        clue={CLUE_WANGFUREN_HAND}
        onResolve={mark('wangfuren2')}
        onNext={() => setStage('day2wrap')}
        nextLabel="把这一天摆到一起 →"
      />
    );
  }

  if (stage === 'day2wrap') {
    return (
      <Day2Wrap
        reachedJiamu={marks.jiamu?.reachedTruth ?? false}
        reachedWangfuren2={marks.wangfuren2?.reachedTruth ?? false}
        onContinue={() => setStage('day3_transition')}
      />
    );
  }

  // ===== 第三天：两个抉择 =====
  if (stage === 'day3_transition') {
    return <BeatScene beats={DAY3_BEATS} chapterLabel="第三天" onComplete={() => setStage('day3_jade')} />;
  }

  if (stage === 'day3_jade') {
    return (
      <ChoiceScene
        tag="抉择一 · 玉"
        bg={JADE_BG}
        setup={JADE_SETUP}
        choices={JADE_CHOICES}
        onChoose={(id) => {
          setJadeChoice(id as JadeChoice);
          trackMoralChoice({ choice: 'jade', value: id, ignite: id === 'reveal' });
          setStage('day3_bridge');
        }}
      />
    );
  }

  if (stage === 'day3_bridge') {
    return <BeatScene beats={DAY3_BRIDGE_BEATS} onComplete={() => setStage('day3_girl')} />;
  }

  if (stage === 'day3_girl') {
    return (
      <ChoiceScene
        tag="抉择二 · 女孩"
        bg={GIRL_BG}
        setup={GIRL_SETUP}
        choices={GIRL_CHOICES}
        continueLabel="前往终局 →"
        onChoose={(id) => {
          setGirlChoice(id as GirlChoice);
          trackMoralChoice({ choice: 'girl', value: id, ignite: id === 'remember' });
          setStage('ending');
        }}
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
        marks.wangfuren2?.readKey,
      ]}
      recap={[
        { npc: '凤姐', line: marks.fengjie?.playerLine },
        { npc: '黛玉', line: marks.daiyu?.playerLine },
        { npc: '王夫人', line: marks.wangfuren?.playerLine },
        { npc: '贾母', line: marks.jiamu?.playerLine },
        { npc: '王夫人 · 佛堂', line: marks.wangfuren2?.playerLine },
      ]}
      jadeChoice={jadeChoice}
      girlChoice={girlChoice}
      onRestart={restart}
    />
  );
}
