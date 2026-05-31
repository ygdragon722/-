import type { Item } from '../types/game';

export const ITEMS: Record<string, Item> = {
  book_collection: { id: 'book_collection', name: '绝版古诗集', price: 150, desc: '市面上罕见的孤本。', icon: '📖', type: 'gift' },
  rouge: { id: 'rouge', name: '上等胭脂', price: 80, desc: '色泽鲜艳，香气扑鼻。', icon: '💄', type: 'gift' },
  wine: { id: 'wine', name: '惠泉酒', price: 100, desc: '香气浓郁的佳酿。', icon: '🍶', type: 'gift' },
  watch: { id: 'watch', name: '西洋怀表', price: 250, desc: '舶来品，深受务实之人喜爱。', icon: '⏱️', type: 'gift' },
  fan: { id: 'fan', name: '名贵折扇', price: 120, desc: '湘妃竹骨折扇，十分名贵。', icon: '🪭', type: 'gift' },
  tea: { id: 'tea', name: '老君眉', price: 200, desc: '极品名茶，极受精神洁癖者推崇。', icon: '🍵', type: 'gift' },
  ginseng: { id: 'ginseng', name: '百年人参', price: 300, desc: '大补之物。可治大病！', icon: '🌿', type: 'consumable' },
};
