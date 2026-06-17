import { useState } from 'react';
import type { GameEngine } from '../hooks/useGameEngine';
import type { ActionType, GameState } from '../types/game';
import { TIME_LABELS } from '../store/gameReducer';
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
  const { day, timeStep, weather, talent, mood, silver, isSick, maxDays } = state;

  return (
    <header className="absolute left-0 right-0 top-0 z-30 px-5 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-lg border border-white/20 bg-stone-950/72 px-4 py-3 text-stone-100 shadow-xl backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <div className="font-bold text-lg whitespace-nowrap">
            第 <span className="text-amber-300">{day}</span> 天
            <span className="ml-1 text-sm text-stone-300">/ {maxDays}</span>
            <span className="ml-3 text-sm text-stone-300">{TIME_LABELS[timeStep]}</span>
          </div>
          <div className={`hidden sm:flex items-center gap-1 rounded-full border border-white/15 bg-stone-900/70 px-3 py-1 text-sm ${weather.color}`}>
            <span>{weather.icon}</span>
            <span>{weather.name}</span>
          </div>
          {isSick && (
            <span className="rounded bg-red-700 px-2 py-1 text-xs font-bold text-white animate-pulse">
              卧病在床
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs sm:flex sm:gap-5 sm:text-sm">
          <div>
            <div className="text-stone-400">才学</div>
            <div className="font-bold text-blue-300">{talent}</div>
          </div>
          <div>
            <div className="text-stone-400">心情</div>
            <div className={`font-bold ${mood <= 20 ? 'text-red-300' : mood >= 80 ? 'text-emerald-300' : 'text-amber-300'}`}>
              {mood}
            </div>
          </div>
          <div>
            <div className="text-stone-400">银两</div>
            <div className="font-bold text-yellow-300">{silver}</div>
          </div>
        </div>
      </div>
    </header>
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
