// 16 型数据（对外用"十六型人格"措辞，规避 MBTI 商标）
import type { Mbti } from '../types';

export interface MbtiMeta {
  code: Mbti;
  name: string;   // 中文别名
}

// 按气质四组排列，便于选择界面分组呈现
export const MBTI_LIST: MbtiMeta[] = [
  // NF 理想者
  { code: 'INFP', name: '调停者' },
  { code: 'ENFP', name: '竞选者' },
  { code: 'INFJ', name: '提倡者' },
  { code: 'ENFJ', name: '主人公' },
  // NT 理性者
  { code: 'INTJ', name: '建筑师' },
  { code: 'INTP', name: '逻辑学家' },
  { code: 'ENTJ', name: '指挥官' },
  { code: 'ENTP', name: '辩论家' },
  // SF 照顾者
  { code: 'ISFJ', name: '守卫者' },
  { code: 'ESFJ', name: '执政官' },
  { code: 'ISFP', name: '探险家' },
  { code: 'ESFP', name: '表演者' },
  // ST 实干者
  { code: 'ISTJ', name: '物流师' },
  { code: 'ESTJ', name: '总经理' },
  { code: 'ISTP', name: '鉴赏家' },
  { code: 'ESTP', name: '企业家' },
];
