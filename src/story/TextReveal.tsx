// 可复用文字渐显组件：逐字打出，标点处加停顿，点击快进/推进
// 用法：传入 lines 数组，打完所有行后再点一次触发 onComplete（外层推进）
import { useState, useEffect, useRef, useCallback } from 'react';

// 标点停顿（ms，叠加在 charDelay 上）
const PUNCT: Record<string, number> = {
  '，': 180, '。': 380, '！': 380, '？': 380,
  '——': 280, '…': 320, '、': 120, '：': 150,
};

interface Props {
  lines: string[];           // 每项一句，逐句打出
  charDelay?: number;        // 每个字间隔 ms，默认 42
  startDelay?: number;       // 首字开始前等待 ms（给画面先被看见的时间），默认 0
  className?: string;        // 文字容器 className
  onComplete?: () => void;   // 所有行显示完 + 用户再点一次时触发
}

export default function TextReveal({
  lines,
  charDelay = 42,
  startDelay = 0,
  className = '',
  onComplete,
}: Props) {
  const [started, setStarted] = useState(startDelay === 0);
  const [lineIdx, setLineIdx] = useState(0);       // 正在打的行
  const [charIdx, setCharIdx] = useState(0);       // 正在打的字
  const [done, setDone] = useState(false);         // 全部行打完
  const [skipped, setSkipped] = useState(false);   // 已快进到全部显示
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  // startDelay 倒计时
  useEffect(() => {
    if (startDelay <= 0) return;
    timer.current = setTimeout(() => setStarted(true), startDelay);
    return clear;
  }, [startDelay]);

  // 打字主循环
  useEffect(() => {
    if (!started || skipped) return;
    if (lineIdx >= lines.length) { setDone(true); return; }

    const line = lines[lineIdx];

    if (charIdx >= line.length) {
      // 这行打完 → 停顿后进下一行（停顿 ≈ 该行默读时间）
      const pause = Math.max(500, line.length * 55);
      timer.current = setTimeout(() => {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, pause);
      return clear;
    }

    // 打下一个字
    const ch = line[charIdx];
    const extra = PUNCT[ch] ?? 0;
    timer.current = setTimeout(() => setCharIdx(c => c + 1), charDelay + extra);
    return clear;
  }, [started, skipped, lineIdx, charIdx, lines, charDelay]);

  // 点击处理：未完 → 快进；已完 → 通知外层
  const handleClick = useCallback(() => {
    if (!done && !skipped) {
      clear();
      setSkipped(true);
      setDone(true);
    } else if (done) {
      onComplete?.();
    }
  }, [done, skipped, onComplete]);

  // 渲染：已完整行 + 正在打的行（含光标）
  const fullyShown = skipped ? lines : lines.slice(0, lineIdx);
  const typing = !skipped && lineIdx < lines.length
    ? lines[lineIdx].slice(0, charIdx)
    : null;

  return (
    <div onClick={handleClick} className={`cursor-pointer select-none ${className}`}>
      {fullyShown.map((l, i) => (
        <p key={i} className="animate-fade-in whitespace-pre-line">
          {l}
        </p>
      ))}
      {typing !== null && (
        <p className="whitespace-pre-line">
          {typing}
          <span className="animate-pulse opacity-70">▍</span>
        </p>
      )}
    </div>
  );
}
