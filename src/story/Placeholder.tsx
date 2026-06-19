// 占位屏：内容审完前，用这个占住流程里的位置，保证整条链路能跑通、能点击预览。
// 正式内容定稿后，对应 Stage 直接换成真组件，删掉这个占位调用即可。
interface Props {
  label: string;       // 占位的是哪一段，如"第二天 · 贾母初场（待审）"
  note?: string;       // 给开发/审阅看的说明，不是玩家该看到的正式文案
  continueLabel?: string;
  onContinue: () => void;
}

export default function Placeholder({ label, note, continueLabel = '继续 →', onContinue }: Props) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-4 bg-stone-950 px-8 text-center">
      <p className="text-[11px] tracking-[0.3em] text-amber-200/50">占位 · 内容待审</p>
      <p className="text-[16px] text-stone-200">{label}</p>
      {note && <p className="max-w-[280px] text-[12px] leading-6 text-stone-500">{note}</p>}
      <button
        onClick={onContinue}
        className="mt-4 rounded border border-stone-600 px-6 py-2.5 text-[14px] text-stone-300 transition hover:border-amber-300/60 hover:text-amber-100"
      >
        {continueLabel}
      </button>
    </div>
  );
}
