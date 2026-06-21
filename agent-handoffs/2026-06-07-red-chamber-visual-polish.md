# 红楼幻梦视觉化与实机预览接力记录

时间：2026-06-07 15:38 CST

## 项目位置

- `/Users/mashengjia/AI-Projects-Portal/projects/红楼幻梦`

## 本轮完成

- 补齐视觉资产：
  - 7 位女主立绘：`public/assets/characters/*.webp`
  - 6 个地点图：`public/assets/locations/*.webp`
  - 2 张 UI 背景：`public/assets/ui/menu-bg.webp`、`public/assets/ui/gallery-bg.webp`
  - 5 张重点事件 CG：`public/assets/events/*.webp`
- UI 接入：
  - 主菜单使用 `menu-bg.webp`
  - 图鉴页使用 `gallery-bg.webp`
  - 地点卡片使用 16:9 场景图和角色小头像
  - 事件弹窗支持 `GameEvent.image` 横幅插图
  - PWA Workbox 预缓存加入 `webp`
- 交互体验打磨：
  - 名场面有事件 CG 时，人物立绘缩为身份头像
  - 移动端顶部标签支持横向滚动
  - 大观园地点网格内部滚动，天气条不遮挡卡片
  - 事件选项区设置最大高度和内部滚动
- 真实浏览器预览修复：
  - 桌面主菜单和图鉴页检查通过
  - 手机主菜单无横向溢出
  - 手机游戏页改为主内容优先，日程面板后置
  - 手机状态条改为两行结构
  - 事件弹窗改成 `fixed` 视口覆盖，避免滚动后顶部被裁切
  - 潇湘馆早期 PIL 占位图已替换为统一水墨淡彩场景图

## 已验证

- `npm run lint` 通过
- `npm run build` 通过
- 本地 dev server 曾启动于 `http://127.0.0.1:5173/` 并已停止

## 当前预览链接

记录时间：2026-06-07 15:44 CST

- 本机网页版：`http://localhost:5173/`
- 手机局域网预览：`http://192.168.1.64:5173/`
- 线上 GitHub Pages：`https://mashengjia.github.io/红楼幻梦/`

说明：本地 dev server 当前以 `npm run dev -- --host 0.0.0.0` 启动，可供同 Wi-Fi 手机访问。GitHub Pages 链接可能尚未包含 2026-06-07 的最新视觉和移动端修复，需要发布后才会同步。

## 重要文件

- `src/components/MenuScreen.tsx`
- `src/components/GalleryScreen.tsx`
- `src/components/GameScreen.tsx`
- `src/components/StatsBar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/LocationGrid.tsx`
- `src/components/EventModal.tsx`
- `src/data/heroines.ts`
- `src/data/locations.ts`
- `src/data/events.ts`
- `src/types/game.ts`
- `vite.config.ts`
- `docs/ASSET_MANIFEST.md`
- `docs/NEXT_STEPS.md`

## 下一步建议

1. 做一次最终发布前检查：桌面、390x844 手机、图鉴、普通事件、名场面事件。
2. 整理提交范围，注意当前仓库已有多处未提交改动和未跟踪 `docs/`、`public/assets/`、`references/`。
3. 如要发布，优先走 GitHub Pages 或门户同步前的 `npm run build`。
