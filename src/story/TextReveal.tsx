// 可复用文字渐显组件：整句一次性淡入（电影字幕感），逐句停顿按默读时长动态算
// 用法：传入 lines 数组，每句淡入后按字数停顿再出下一句；全部显示完后再点一次触发 onComplete（外层推进）
import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  lines: string[];           // 每项一句，逐句淡入
  startDelay?: number;       // 首句开始前等待 ms（给画面先被看见的时间），默认 0
  className?: string;        // 文字容器 className
  onComplete?: () => void;   // 所有行显示完 + 用户再点一次时触发
}

// 这句话的默读停顿（按字数动态算，长句多停、短句少停）
function readingPause(line: string): number {
  return Math.max(550, line.length * 70);
}

export default function TextReveal({ lines, startDelay = 0, className = '', onComplete }: Props) {
  const [shown, setShown] = useState(0);           // 已淡入的行数
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  useEffect(() => {
    if (shown >= lines.length) { setDone(true); return; }
    const delay = shown === 0 ? startDelay : readingPause(lines[shown - 1]);
    timer.current = setTimeout(() => setShown(s => s + 1), delay);
    return clear;
  }, [shown, lines, startDelay]);

  const handleClick = useCallback(() => {
    if (!done) {
      clear();
      setShown(lines.length);
      setDone(true);
    } else {
      onComplete?.();
    }
  }, [done, lines.length, onComplete]);

  return (
    <div onClick={handleClick} className={`cursor-pointer select-none ${className}`}>
      {lines.slice(0, shown).map((l, i) => (
        <p key={i} className="animate-fade-in whitespace-pre-line">
          {l}
        </p>
      ))}
    </div>
  );
}
