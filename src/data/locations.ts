import type { Location } from '../types/game';

export const LOCATIONS: Record<string, Location> = {
  xiaoxiang: { id: 'xiaoxiang', name: '潇湘馆', desc: '凤尾森森，龙吟细细。', icon: '🎋', bg: 'bg-emerald-50', image: './assets/locations/xiaoxiang.webp' },
  hengwu: { id: 'hengwu', name: '蘅芜苑', desc: '异香扑鼻，奇草仙藤。', icon: '🌿', bg: 'bg-blue-50', image: './assets/locations/hengwu.webp' },
  qinfang: { id: 'qinfang', name: '沁芳亭', desc: '水波荡漾，落花满径。', icon: '亭', bg: 'bg-rose-50', image: './assets/locations/qinfang.webp' },
  qiushuang: { id: 'qiushuang', name: '秋爽斋', desc: '梧桐落叶，开阔疏朗。', icon: '🍂', bg: 'bg-purple-50', image: './assets/locations/qiushuang.webp' },
  yihong: { id: 'yihong', name: '怡红院', desc: '你的快乐老家，金碧辉煌。', icon: '🏮', bg: 'bg-red-50', image: './assets/locations/yihong.webp' },
  longcui: { id: 'longcui', name: '栊翠庵', desc: '红梅绽放，禅音袅袅。', icon: '⛩️', bg: 'bg-slate-100', image: './assets/locations/longcui.webp' },
};
