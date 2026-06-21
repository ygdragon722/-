// 字幕框：底部一个半透明框，文字一句一句出现，点框才翻下一句（不自动切）。
// 全游戏的叙事字幕统一用它——过场、相遇场的观察/反应、抉择场的铺陈/反应，节奏都交给玩家。
// 只有框能点（鼠标移上去会亮），读完最后一句再点一次触发 onDone（出选项 / 下一拍）。
import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;          // 整段文字（可含 \n，内部按行拆；空行只是排版间隔，丢弃）
  startDelay?: number;   // 首句出现前等待 ms（给画面先被看见、喘一口气），默认 0
  onDone: () => void;    // 最后一句之后再点一次触发
  hint?: string;         // 框底提示
}

function linesOf(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter((l) => l !== '');
}

// "出现后稍候才可点"：字幕框翻到最后一句、点一下露出选项/按钮的那一瞬间，React 会把
// 字幕框那个 <button> 复用成新冒出来的按钮，正在派发的这一次点击会"落"在新按钮上误触。
// 让新按钮出现后的一小段时间内禁用，那一下就落空了——既防这个，也防真人手快的连点误选。
export function useArm(active: boolean, delay = 350): boolean {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!active) { setArmed(false); return; }
    setArmed(false);
    const t = setTimeout(() => setArmed(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return armed;
}

export default function SubtitleBox({ text, startDelay = 0, onDone, hint = '轻触继续 ▽' }: Props) {
  const lines = linesOf(text);
  const [line, setLine] = useState(0);
  const [ready, setReady] = useState(false); // 画面是否已"喘过一口气"、字幕框可以浮现
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 用 ref 记当前行号 + 是否已收尾，让"翻句"判断读到最新值——
  // 防止极快连点（两次点击之间还没重渲染）时用旧行号一直 setLine 而越界 / onDone 漏触发或重触发。
  const lineRef = useRef(0);
  const doneRef = useRef(false);

  // 文字块变了（新的一拍/新的反应）就从头来，并给画面一个喘气的间隔
  useEffect(() => {
    lineRef.current = 0;
    doneRef.current = false;
    setLine(0);
    setReady(false);
    timer.current = setTimeout(() => setReady(true), startDelay);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [text, startDelay]);

  const advance = () => {
    if (!ready) return; // 画面还在喘气，先不接点击
    if (lineRef.current < lines.length - 1) {
      lineRef.current += 1;
      setLine(lineRef.current);
    } else if (!doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-10">
      <button
        onClick={advance}
        disabled={!ready}
        className={`group block w-full cursor-pointer rounded-lg border border-white/15 bg-stone-950/60 px-6 py-5 backdrop-blur-md transition-all duration-500 hover:border-amber-200/45 hover:bg-stone-950/75 ${
          ready ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex min-h-[3.5rem] items-center justify-center">
          <p
            key={line}
            className="animate-fade-in text-center text-[16px] leading-8 text-stone-50 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
          >
            {lines[line]}
          </p>
        </div>
        <span className="mt-2 block text-center text-[11px] tracking-[0.3em] text-stone-400 transition group-hover:text-amber-200/70">
          {hint}
        </span>
      </button>
    </div>
  );
}
