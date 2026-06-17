import type { EndingInfo } from '../types/game';

export const ALL_ENDINGS: EndingInfo[] = [
  {
    id: 'daiyu_ending',
    title: '木石前盟',
    icon: '🪷',
    desc: '黛玉好感 ≥ 50。与她共读西厢，在潇湘馆的烛光里说过彼此的心意。',
  },
  {
    id: 'baochai_ending',
    title: '金玉良缘',
    icon: '🪹',
    desc: '宝钗好感 ≥ 50。听从她的规劝上进，才学与情谊并肩而行。',
  },
  {
    id: 'xiangyun_ending',
    title: '诗酒作伴',
    icon: '🌺',
    desc: '湘云好感 ≥ 50。陪她烤肉饮酒，醉眠芍药，活在当下。',
  },
  {
    id: 'tanchun_ending',
    title: '秋爽斋合伙人',
    icon: '🍂',
    desc: '探春好感 ≥ 50。支持改革，出钱出力，成为她最信任的左膀右臂。',
  },
  {
    id: 'miaoyu_ending',
    title: '红尘眷恋',
    icon: '🍵',
    desc: '妙玉好感 ≥ 50。越过她的心防，让槛外人从此留了一条缝给你。',
  },
  {
    id: 'study_ending',
    title: '崭露头角',
    icon: '📜',
    desc: '才学达到 120。海棠诗社一鸣惊人，贾政对你刮目相看。',
  },
  {
    id: 'qingwen_ending',
    title: '千金难买一笑',
    icon: '🪭',
    desc: '晴雯好感 ≥ 40。抄检风波中为她出手，散尽千金博她一笑。',
  },
  {
    id: 'xiren_ending',
    title: '温柔末路',
    icon: '🪡',
    desc: '袭人好感 ≥ 30。接受她的照顾与守候，安心做个富贵闲人。',
  },
  {
    id: 'bad_ending',
    title: '大梦一场',
    icon: '🌙',
    desc: '未能达成任何路线条件。三十日转瞬即逝，什么也没留下。',
  },
];
