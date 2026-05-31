import type { Weather } from '../types/game';

export const WEATHERS: Weather[] = [
  { id: 'sunny', name: '晴空万里', icon: '☀️', effect: '游园心情恢复增加', color: 'text-amber-500' },
  { id: 'cloudy', name: '多云转阴', icon: '⛅', effect: '无特殊影响', color: 'text-stone-500' },
  { id: 'rainy', name: '细雨连绵', icon: '🌧️', effect: '读书效率提升，游园减心情', color: 'text-blue-500' },
];
