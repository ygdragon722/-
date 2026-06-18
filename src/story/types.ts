// 红楼探案 VN · 读人引擎核心类型
// 设计原则：
//   1. 脚本作数据、不硬编（Encounter/Scene/Truth 都从数据文件加载）
//   2. 玩家 MBTI 只作"感知透镜 + 结局回响"，绝不分叉剧情树
//   3. 信任/距离槽 = 你和角色的关系本身，读对走近、读错推远、到阈值吐真话
//   4. 可达性：信任低照样能通关，只是"终究没真正懂她"的版本

// ========== MBTI ==========

export type Mbti =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// 感知透镜维度：决定玩家"先看见什么"（同一观察的不同入口）
//   N 看潜台词 / F 看情绪 / T 看逻辑漏洞 / J 给整理好的线索板
export type LensKey = 'N' | 'F' | 'T' | 'J';

// 读法钥匙：玩家靠近一个人时采取的社交姿态
//   每个角色有一把（或几把）能撬开 TA 的"正确钥匙"——读对即匹配
export type ReadKey =
  | 'empathy'   // 共情：看见对方的情绪与苦
  | 'logic'     // 论理：对逻辑漏洞下手、冷静质询
  | 'flatter'   // 奉承：捧、讨好
  | 'confront'  // 硬碰：直接挑战其权威
  | 'observe'   // 旁观：不接触，冷静取证
  | 'play'      // 玩闹：轻松跳脱（对湘云一类）
  | 'defer';    // 顺服：示弱、依从

// ========== 角色（静态定义） ==========

export interface NpcDef {
  id: string;              // 拼音 id：fengjie / daiyu / wangfuren ...
  name: string;            // 王熙凤
  mbti: Mbti;              // ESTJ
  verdictEcho: string;     // 判词回响（一句，读懂时浮现）："机关算尽太聪明"
  portrait?: string;       // 立绘路径（透明/白底）
  correctKeys: ReadKey[];  // 能撬开她的"正确钥匙"
  // 宽容度（编码 MBTI）：读错时槽的下滑倍率。凤姐高（难撬难回），湘云低（好亲近）
  guardedness: number;     // 1.0 = 标准；>1 更难、更易推远
}

// 角色运行时状态：信任/距离槽
export interface TrustState {
  npcId: string;
  trust: number;           // 当前信任值（0-100），初始见 INITIAL_TRUST
  unlockedTruths: string[];// 已解锁的真话 id
  reads: number;           // 已对她读了几次（供镜子参考）
}

// ========== 一场相遇 ==========

// 观察：默认文案 + 各透镜的专属入口（玩家按自己 MBTI 看见对应那条）
export interface Observation {
  base: string;                          // 无匹配透镜时的兜底
  byLens?: Partial<Record<LensKey, string>>;
}

// 一个读法选项
export interface ReadApproach {
  id: string;
  label: string;       // 选项短名："共情"
  playerLine: string;  // 玩家说/做的话
  key: ReadKey;        // 这个读法代表的钥匙
  trustDelta: number;  // 对信任槽的增减（读对为正、读错为负，由作者手调）
  outcome: string;     // 对方的反应（读对吐真话引语 / 读错的表演）
  // 读对且达阈值时解锁的真话 id（可空：旁观类只给行踪、不吐真话）
  unlocksTruthId?: string;
}

// 真话：达到信任阈值时吐露的那句——既是线索，也是判词裂缝
export interface TruthLine {
  id: string;
  text: string;        // 她吐露的真话
  clueId: string;      // 同时入账的线索
  verdictEcho?: string;// 这句呼应的判词（可与 NpcDef.verdictEcho 一致）
}

export interface Encounter {
  id: string;
  day: 1 | 2 | 3;
  sceneId: string;
  npcId: string;
  // 是否情感场（非解谜，如初遇小戏子，建立联结）
  isBondScene?: boolean;
  observation: Observation;
  approaches: ReadApproach[];
  truthThreshold: number;   // 信任达到此值才吐 truth
  truth?: TruthLine;
}

// ========== 案件 ==========

// 线索：三层真相的碎片
export interface Clue {
  id: string;
  text: string;
  layer: 1 | 2 | 3;   // 1=宝玉藏玉 2=凤姐财务 3=灭口
}

export interface Scene {
  id: string;
  name: string;       // 潇湘馆 / 赏戏厅
  desc: string;
  bg?: string;        // 背景图路径
}

// ========== 镜子（反过来读你） ==========

// 一条被记录的玩家关键选择
export interface MirrorRecord {
  at: string;          // 发生处（encounterId / 节点）
  kind: 'read' | 'moral' | 'attitude';
  detail: string;      // 机器可读：用了什么读法读谁 / 对小戏子之死的态度 / 点不点燃
  readKey?: ReadKey;
  npcId?: string;
}

export type MirrorLedger = MirrorRecord[];

// ========== 结局 ==========

export type MoralChoice = 'ignite' | 'bury';  // 点燃真相 / 像所有人一样埋了她

export interface Ending {
  id: string;
  title: string;
  body: string;        // 结局正文
  // 镜子回响：据玩家声明的型 + 全程选择，照回"你究竟是谁"
  mirrorReflection: string;
}

// ========== 总状态 ==========

export interface StoryState {
  playerName: string;
  playerMbti: Mbti | null;     // 玩家声明的型（透镜+回响用）
  day: 1 | 2 | 3;
  currentEncounterId: string | null;
  trust: Record<string, TrustState>;  // 按 npcId
  clues: string[];                     // 已获线索 id
  ledger: MirrorLedger;
  moralChoice: MoralChoice | null;
  endingId: string | null;
  saveVersion: number;                 // 存档版本号（防旧档崩）
}

export const INITIAL_TRUST = 30;       // 信任槽初值
export const SAVE_VERSION = 1;
