// 可复用文字渐显组件：整段文字按换行拆成一行一行，逐行淡入，
// 每行停顿按默读时长动态算（长句多停、短句少停），尊重人的阅读节奏。
// 不整页一次性蹦出来；用户轻触可快进显示全部，全部显示完再点触发 onComplete。
import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  lines: string[];           // 传入的文本块（可含 \n，内部会再按行拆开）
  startDelay?: number;       // 首行开始前等待 ms（给画面先被看见的时间），默认 0
  className?: string;        // 文字容器 className
  onComplete?: () => void;   // 所有行显示完 + 用户再点一次时触发
}

// 这一行的默读停顿（按字数动态算）；空行＝段落间隔，给一个短呼吸
function readingPause(line: string): number {
  if (line.trim() === '') return 320;
  return Math.max(550, line.length * 70);
}

export default function TextReveal({ lines, startDelay = 0, className = '', onComplete }: Props) {
  // 把每个文本块按换行拆成一行一行——这样整段不会一次性出现，而是逐行浮现
  const allLines = lines.flatMap((l) => l.split('\n'));

  const [shown, setShown] = useState(0);           // 已淡入的行数
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  useEffect(() => {
    if (shown >= allLines.length) { setDone(true); return; }
    const delay = shown === 0 ? startDelay : readingPause(allLines[shown - 1]);
    timer.current = setTimeout(() => setShown((s) => s + 1), delay);
    return clear;
  }, [shown, allLines, startDelay]);

  const handleClick = useCallback(() => {
    if (!done) {
      clear();
      setShown(allLines.length);
      setDone(true);
    } else {
      onComplete?.();
    }
  }, [done, allLines.length, onComplete]);

  return (
    <div onClick={handleClick} className={`cursor-pointer select-none ${className}`}>
      {allLines.slice(0, shown).map((l, i) =>
        l.trim() === '' ? (
          <div key={i} className="h-4" /> // 空行＝段落间隔
        ) : (
          <p key={i} className="animate-fade-in">
            {l}
          </p>
        )
      )}
    </div>
  );
}
