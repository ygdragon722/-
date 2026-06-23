// 红楼探案 VN · 读人引擎核心类型
// 设计原则：
//   1. 脚本作数据、不硬编（Encounter/Scene/Truth 都从数据文件加载）
//   2. 不要求玩家做任何性格自我申报；玩家是谁，由全程读法选择刻画，结局反过来读你
//   3. 信任/距离槽 = 你和角色的关系本身，读对走近、读错推远、到阈值吐真话
//   4. 可达性：信任低照样能通关，只是"终究没真正懂她"的版本

// ========== MBTI（仅作写人内部脚手架，不在界面出现） ==========
// 保证每个角色"性格⟷判词⟷动机"三位一体；玩家永远看不到这个字段。

export type Mbti =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// 读法钥匙：玩家靠近一个人时采取的社交姿态
//   读法 = 玩家靠近一个人时的行为选择（无对错，只是不同的靠近方式）
export type ReadKey =
  | 'empathy'   // 共情：看见对方的情绪与苦
  | 'logic'     // 论理：对逻辑漏洞下手、冷静质询
  | 'flatter'   // 奉承：捧、讨好
  | 'confront'  // 硬碰：直接挑战其权威
  | 'observe'   // 旁观：不接触，冷静取证
  | 'play'      // 玩闹：轻松跳脱（对湘云一类）
  | 'defer';    // 顺服：示弱、依从

// ========== Big Five 底层（写人/读你脚手架，不上屏） ==========
// O 开放性 / C 尽责性 / E 外向性 / A 宜人性 / N 神经质
// 每个读法天然加载若干维度（+1 该读法体现的倾向）。这是"判词体验、Big Five 骨架"的
// 那层骨架：现在只埋标签，结局仍只给判词；将来题量够了可据此打开维度侧写，钩子已留。
export type BigFiveDim = 'O' | 'C' | 'E' | 'A' | 'N';

export const READ_KEY_BIGFIVE: Record<ReadKey, Partial<Record<BigFiveDim, number>>> = {
  empathy:  { A: 1, O: 1 },          // 接住情绪：高宜人、对感受开放
  observe:  { O: 1, C: 1, E: -1 },   // 退一步取证：内省、谨慎、不外露
  logic:    { C: 1, A: -1 },         // 追逻辑：条理、低圆滑
  confront: { E: 1, A: -1 },         // 硬碰：主张强、不顾和气
  flatter:  { E: 1, A: 1 },          // 周旋讨好：外向、表面亲和（策略性）
  defer:    { A: 1, E: -1 },         // 示弱顺从：随和、低主张
  play:     { E: 1, O: 1, C: -1 },   // 玩闹：外向、跳脱、不端着
};

// ========== 角色（静态定义） ==========

export interface NpcDef {
  id: string;              // 拼音 id：fengjie / daiyu / wangfuren ...
  name: string;            // 王熙凤
  mbti: Mbti;              // ESTJ
  verdictEcho: string;     // 判词回响（一句，读懂时浮现）："机关算尽太聪明"
  portrait?: string;       // 立绘路径（透明/白底）
  // 对话近景表情：calm=默认表演 / open=卸防读对 / guarded=戒备读错
  portraits?: Partial<Record<'calm' | 'open' | 'guarded', string>>;
  portraitFrames?: Partial<Record<'calm' | 'open' | 'guarded', PortraitFrame>>;
  correctKeys: ReadKey[];  // 能撬开她的"正确钥匙"
  // 宽容度（编码 MBTI）：读错时槽的下滑倍率。凤姐高（难撬难回），湘云低（好亲近）
  guardedness: number;     // 1.0 = 标准；>1 更难、更易推远
}

export interface PortraitFrame {
  fit?: 'cover' | 'contain';
  position?: string;
  scale?: number;
  opacity?: number;
}

// 角色运行时状态：信任/距离槽
export interface TrustState {
  npcId: string;
  trust: number;           // 当前信任值（0-100），初始见 INITIAL_TRUST
  unlockedTruths: string[];// 已解锁的真话 id
  reads: number;           // 已对她读了几次（供镜子参考）
}

// ========== 一场相遇 ==========

// 观察：进入一场相遇时，玩家看见的那段定场观察（每场一条，不再按透镜分支）
export interface Observation {
  base: string;
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

// 真话：达到信任阈值时角色卸下的那一层（具体台词已直接写进对应 ReadApproach.outcome 里，
// 这里只留 id 供 engine 做解锁匹配 + devNote 供开发时核对，devNote 从不上屏）
export interface TruthLine {
  id: string;
  clueId: string;   // 同时入账的线索
  devNote: string;   // 仅供开发核对"这是哪一层卸防"，从不渲染到界面
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
  portraitFrames?: Partial<Record<'calm' | 'open' | 'guarded', PortraitFrame>>;
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
