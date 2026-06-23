import { useEffect, useState } from 'react';

// "出现后稍候才可点"：字幕框翻到最后一句、点一下露出选项/按钮的那一瞬间，React 会把
// 字幕框那个 <button> 复用成新冒出来的按钮，正在派发的这一次点击会"落"在新按钮上误触。
// 让新按钮出现后的一小段时间内禁用，那一下就落空了，也防真人手快连点误选。
export function useArm(active: boolean, delay = 350): boolean {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setArmed(active), active ? delay : 0);
    return () => clearTimeout(t);
  }, [active, delay]);

  return armed;
}
