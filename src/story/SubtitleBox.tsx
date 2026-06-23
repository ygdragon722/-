// 字幕框：底部一个半透明框，文字一句一句出现，点框才翻下一句（不自动切）。
// 全游戏的叙事字幕统一用它——过场、相遇场的观察/反应、抉择场的铺陈/反应，节奏都交给玩家。
// 只有框能点（鼠标移上去会亮），读完最后一句再点一次触发 onDone（出选项 / 下一拍）。
import { useState, useEffect, useRef } from 'react';
import BackButton from './BackButton';

interface Props {
  text: string;          // 整段文字（可含 \n，内部按行拆；空行只是排版间隔，丢弃）
  startDelay?: number;   // 首句出现前等待 ms（给画面先被看见、喘一口气），默认 0
  onDone: () => void;    // 最后一句之后再点一次触发
  hint?: string;         // 框底提示
  onBack?: () => void;   // 第一行时可退到上一拍 / 上一步
  showBoundaryBack?: boolean; // 是否在第一句就显示"上一幕"，有独立顶部回退时可关掉
}

function linesOf(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter((l) => l !== '');
}

export default function SubtitleBox({
  text,
  startDelay = 0,
  onDone,
  hint = '轻触继续 ▽',
  onBack,
  showBoundaryBack = true,
}: Props) {
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
    setTimeout(() => {
      setLine(0);
      setReady(false);
    }, 0);
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

  const goBack = () => {
    if (!ready) return;
    if (lineRef.current > 0) {
      lineRef.current -= 1;
      doneRef.current = false;
      setLine(lineRef.current);
      return;
    }
    onBack?.();
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-10">
      {(line > 0 || (showBoundaryBack && onBack)) && (
        <div className="mb-3 flex justify-start">
          <BackButton label={line > 0 ? '上一句' : '上一幕'} onClick={goBack} />
        </div>
      )}
      <button
        onClick={advance}
        disabled={!ready}
        className={`group block w-full cursor-pointer rounded-md border border-white/15 bg-stone-950/65 px-6 py-5 backdrop-blur-md transition-all duration-500 hover:border-amber-200/45 hover:bg-stone-950/75 ${
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
