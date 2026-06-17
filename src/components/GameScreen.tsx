import { useState, useRef, useEffect } from 'react';
import type { GameEngine } from '../hooks/useGameEngine';
import type { ActionType, GameState } from '../types/game';
import { ACTION_POINT_LABELS } from '../store/gameReducer';
import AvgLayer from './AvgLayer';
import LocationStage from './LocationStage';
import ShopPanel from './ShopPanel';
import BagPanel from './BagPanel';
import DreambookPanel from './DreambookPanel';

type DrawerView = 'schedule' | 'dreambook' | 'bag' | 'shop' | null;

const GARDEN_BG = './assets/ui/menu-bg.webp';

interface Props {
  engine: GameEngine;
}

function TopHud({ state }: { state: GameState }) {
  const { day, actionPoints, weather, talent, mood, silver, stamina, prestige, isSick } = state;

  const prevRef = useRef({ talent, mood, silver, stamina, prestige });
  const [deltas, setDeltas] = useState({ talent: 0, mood: 0, silver: 0, stamina: 0, prestige: 0 });
  const timerRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const prev = prevRef.current;
    const next = { talent, mood, silver, stamina, prestige };
    const nextDeltas: typeof deltas = { talent: 0, mood: 0, silver: 0, stamina: 0, prestige: 0 };
    let hasChange = false;

    (Object.keys(next) as Array<keyof typeof next>).forEach((key) => {
      const delta = next[key] - prev[key];
      if (delta !== 0) {
        nextDeltas[key] = delta;
        hasChange = true;
        window.clearTimeout(timerRef.current[key]);
        timerRef.current[key] = window.setTimeout(() => {
          setDeltas((d) => ({ ...d, [key]: 0 }));
        }, 1500);
      }
    });

    if (hasChange) {
      setDeltas(nextDeltas);
      prevRef.current = next;
    }
  }, [talent, mood, silver, stamina, prestige]);

  const moodColor = mood <= 20 ? 'text-red-300' : mood >= 80 ? 'text-emerald-300' : 'text-amber-300';

  const stats: Array<{
    key: keyof typeof deltas;
    label: string;
    value: number;
    color: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'talent',
      label: '才学',
      value: talent,
      color: 'text-blue-300',
      icon: (
        <svg className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      key: 'mood',
      label: '心情',
      value: mood,
      color: moodColor,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      key: 'silver',
      label: '银两',
      value: silver,
      color: 'text-yellow-300',
      icon: (
        <svg className="h-4 w-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">两</text>
        </svg>
      ),
    },
    {
      key: 'stamina',
      label: '体力',
      value: stamina,
      color: 'text-orange-300',
      icon: (
        <svg className="h-4 w-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      key: 'prestige',
      label: '名望',
      value: prestige,
      color: 'text-violet-300',
      icon: (
        <svg className="h-4 w-4 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* 左上角日期天气徽章 */}
      <div className="absolute top-4 left-5 z-30">
        <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-stone-950/72 px-3 py-1.5 text-sm text-stone-200 shadow-lg backdrop-blur-md">
          <span className="text-stone-400">第</span>
          <span className="font-bold text-amber-300">{day}</span>
          <span className="text-stone-400">天</span>
          <span className="ml-1 text-stone-300">{ACTION_POINT_LABELS[actionPoints]}</span>
          <span className="mx-1 text-stone-500">·</span>
          <span className={weather.color}>{weather.icon}</span>
          <span className={weather.color}>{weather.name}</span>
        </div>
      </div>

      {/* 卧病提示 */}
      {isSick && (
        <div className="absolute top-20 left-1/2 z-30 -translate-x-1/2">
          <span className="rounded bg-red-700 px-3 py-1 text-xs font-bold text-white animate-pulse shadow-lg">
            卧病在床
          </span>
        </div>
      )}

      {/* 底部属性横栏 */}
      <div className="absolute bottom-20 left-1/2 z-30 w-[min(640px,calc(100%-2rem))] -translate-x-1/2">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-white/15 bg-stone-950/78 px-4 py-2.5 shadow-2xl backdrop-blur-md">
          {stats.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-0.5 min-w-[3.5rem]">
              <div className="flex items-center gap-1">
                {s.icon}
                <span className="text-[10px] text-stone-400">{s.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-base font-bold ${s.color}`}>{s.value}</span>
                {deltas[s.key] !== 0 && (
                  <span
                    className={`text-xs font-bold animate-pulse ${
                      deltas[s.key] > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {deltas[s.key] > 0 ? '+' : ''}{deltas[s.key]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function BottomCommandBar({
  activeDrawer,
  inventoryCount,
  onOpenDrawer,
}: {
  activeDrawer: DrawerView;
  inventoryCount: number;
  onOpenDrawer: (drawer: DrawerView) => void;
}) {
  const buttons: Array<{ id: Exclude<DrawerView, null>; label: string; mark: string; count?: number }> = [
    { id: 'schedule', label: '日程', mark: '行' },
    { id: 'dreambook', label: '梦册', mark: '册' },
    { id: 'bag', label: '锦囊', mark: '囊', count: inventoryCount },
    { id: 'shop', label: '宁荣街', mark: '街' },
  ];

  return (
    <nav className="absolute bottom-5 left-1/2 z-30 w-[min(680px,calc(100%-2rem))] -translate-x-1/2">
      <div className="grid grid-cols-4 gap-2 rounded-lg border border-white/20 bg-stone-950/78 p-2 shadow-2xl backdrop-blur-md">
        {buttons.map((button) => {
          const isActive = activeDrawer === button.id;
          return (
            <button
              key={button.id}
              onClick={() => onOpenDrawer(isActive ? null : button.id)}
              className={`h-14 rounded-lg border px-2 text-sm font-bold transition ${
                isActive
                  ? 'border-amber-300 bg-amber-200 text-stone-950'
                  : 'border-white/10 bg-white/8 text-stone-100 hover:bg-white/16'
              }`}
            >
              <span className={`mr-2 inline-flex h-6 w-6 items-center justify-center rounded border text-xs ${
                isActive ? 'border-stone-800/30 bg-stone-950/10' : 'border-white/20 bg-white/8'
              }`}>
                {button.mark}
              </span>
              {button.label}
              {button.count !== undefined && (
                <span className="ml-1 text-xs opacity-80">({button.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ScheduleDrawer({ state, onAction }: { state: GameState; onAction: (action: ActionType) => void }) {
  const { isSick, talent, logs } = state;
  const actionGroups: Array<{ title: string; items: Array<{ id: ActionType; label: string; desc: string; disabled?: boolean; tone: string }> }> = [
    {
      title: '内务日程',
      items: [
        { id: 'school', label: '族学打卡', desc: '才学中升，心情微降。', disabled: isSick, tone: 'blue' },
        { id: 'study_hard', label: '闭门苦读', desc: '大幅提升才学，耗神更多。', disabled: isSick, tone: 'purple' },
        { id: 'rest', label: '歇息养神', desc: '恢复大量心情。', disabled: isSick, tone: 'emerald' },
      ],
    },
    {
      title: '市井营生',
      items: [
        { id: 'poem', label: '赋诗卖稿', desc: '收益与才学相关。', disabled: isSick || talent < 30, tone: 'amber' },
        { id: 'pawn', label: '典当旧物', desc: '紧急套现，心情下降。', disabled: isSick, tone: 'stone' },
      ],
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        {actionGroups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-3 text-sm font-bold tracking-widest text-stone-500">{group.title}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onAction(item.id)}
                  disabled={item.disabled}
                  className="rounded-lg border border-stone-300 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-700 hover:shadow-md disabled:opacity-45 disabled:hover:translate-y-0"
                >
                  <div className="font-bold text-stone-900">{item.label}</div>
                  <div className="mt-1 text-xs leading-5 text-stone-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="rounded-lg border border-stone-300 bg-stone-50 p-4">
        <h3 className="mb-2 text-sm font-bold text-stone-700">近况</h3>
        <div className="max-h-56 space-y-2 overflow-y-auto text-xs leading-5 text-stone-600">
          {logs.map((log, index) => (
            <p key={index} className={index === 0 ? 'font-bold text-stone-900' : ''}>
              {index === 0 ? '> ' : '- '}
              {log}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

function Drawer({
  view,
  state,
  onClose,
  onAction,
  onBuy,
  onUse,
}: {
  view: DrawerView;
  state: GameState;
  onClose: () => void;
  onAction: (action: ActionType) => void;
  onBuy: (itemId: string) => void;
  onUse: (itemId: string) => void;
}) {
  if (!view) return null;

  const title = {
    schedule: '日程',
    dreambook: '梦册',
    bag: '锦囊',
    shop: '宁荣街',
  }[view];

  return (
    <div className="absolute inset-x-4 bottom-24 z-40 mx-auto max-w-6xl rounded-lg border border-stone-300 bg-[#f8f3e8]/96 p-4 shadow-2xl backdrop-blur-md animate-fade-in-up">
      <div className="mb-4 flex items-center justify-between border-b border-stone-300 pb-3">
        <h2 className="text-xl font-bold text-stone-900">{title}</h2>
        <button
          onClick={onClose}
          className="rounded border border-stone-300 bg-white px-3 py-1 text-sm font-bold text-stone-700 hover:border-red-700 hover:text-red-800"
        >
          收起
        </button>
      </div>

      <div className="max-h-[56dvh] overflow-y-auto pr-1">
        {view === 'schedule' && <ScheduleDrawer state={state} onAction={onAction} />}
        {view === 'dreambook' && (
          <div className="rounded-lg overflow-hidden border border-stone-300">
            <DreambookPanel state={state} />
          </div>
        )}
        {view === 'bag' && <BagPanel inventory={state.inventory} onUse={onUse} />}
        {view === 'shop' && <ShopPanel silver={state.silver} onBuy={onBuy} />}
      </div>
    </div>
  );
}

export default function GameScreen({ engine }: Props) {
  const { state, handleAction, exploreLocation, moveTo, buyItem, useItem, handleChoice } = engine;
  const [activeDrawer, setActiveDrawer] = useState<DrawerView>(null);
  const inventoryCount = Object.values(state.inventory).reduce((total, quantity) => total + quantity, 0);

  return (
    <div className="relative h-screen min-h-[680px] overflow-hidden bg-stone-950 font-serif text-stone-800">
      <img src={GARDEN_BG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/10 to-stone-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(28,25,23,0.42)_72%)]" />

      <TopHud state={state} />
      <LocationStage state={state} onExplore={exploreLocation} onMove={moveTo} onAction={handleAction} />

      <Drawer
        view={activeDrawer}
        state={state}
        onClose={() => setActiveDrawer(null)}
        onAction={(action) => {
          handleAction(action);
          setActiveDrawer(null);
        }}
        onBuy={buyItem}
        onUse={useItem}
      />

      <BottomCommandBar
        activeDrawer={activeDrawer}
        inventoryCount={inventoryCount}
        onOpenDrawer={setActiveDrawer}
      />

      {state.currentEvent && <AvgLayer state={state} onChoice={handleChoice} />}
    </div>
  );
}
