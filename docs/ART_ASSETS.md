# 红楼幻梦美术与资产记录

- 更新时间：2026-06-11
- 用途：合并原 `ART_DIRECTION.md`、`ASSET_MANIFEST.md`、`REFERENCE_SOURCES.md`，作为美术方向、资产清单和参考边界的单一文档。

## 美术原则

整体风格：

- 国风绘本 + 水墨淡彩
- 轻游戏立绘质感
- 柔和低饱和色调
- 可带一点 90 年代中文 PC 游戏 / AVG 插画感
- 拒绝现代摄影风，避免过度写实

人物图：

- 半身立绘，胸像至腰际
- 比例 3:4
- 建议尺寸 600 x 800px
- WebP 优先，PNG 可接受
- 背景透明或极淡晕染
- 适合事件弹窗和人物标签

场景图：

- 横图 16:9
- 建议尺寸 1280 x 720px
- 写意园林，留白，远景淡墨
- 适合地点卡片、菜单背景、图鉴背景

Fallback 原则：

- 图片资产是体验增强，不是运行前提。
- 图片缺失或加载失败时，应回退到 emoji + 文字表现，保证游戏仍可玩。

## 配色基调

| 场景 | 主色调 | 辅助色 |
|---|---|---|
| 潇湘馆 | 竹青、月白 | 淡粉、墨绿 |
| 蘅芜苑 | 素白、冷灰 | 淡金、藏青 |
| 沁芳亭 | 水蓝、桃红 | 鹅黄、浅绿 |
| 秋爽斋 | 赭石、秋香 | 紫檀、米白 |
| 怡红院 | 胭脂、绯红 | 暖金、象牙 |
| 栊翠庵 | 素白、梅红 | 玄青、淡金 |

## 命名规范

```text
public/assets/characters/{id}-portrait.webp
public/assets/locations/{id}.webp
public/assets/events/{event-id}.webp
public/assets/ui/menu-bg.webp
public/assets/ui/gallery-bg.webp
```

## 当前资产清单

人物立绘：

| 文件名 | 角色 | 状态 | 备注 |
|---|---|---|---|
| `characters/daiyu-portrait.webp` | 林黛玉 | 已完成 | 潇湘妃子，柔弱忧郁，手持诗卷 |
| `characters/baochai-portrait.webp` | 薛宝钗 | 已完成 | 蘅芜君，端庄大气，冷香丸气质 |
| `characters/xiangyun-portrait.webp` | 史湘云 | 已完成 | 枕霞旧友，豪爽活泼，男装或烤肉姿态 |
| `characters/tanchun-portrait.webp` | 贾探春 | 已完成 | 蕉下客，精明干练，持账本或毛笔 |
| `characters/xiren-portrait.webp` | 花袭人 | 已完成 | 贤袭人，温柔体贴，端汤或针线 |
| `characters/qingwen-portrait.webp` | 晴雯 | 已完成 | 勇晴雯，桀骜明艳，撕扇或抱臂 |
| `characters/miaoyu-portrait.webp` | 妙玉 | 已完成 | 槛外人，清冷孤傲，煮茶或持佛珠 |

场景图：

| 文件名 | 地点 | 状态 | 备注 |
|---|---|---|---|
| `locations/xiaoxiang.webp` | 潇湘馆 | 已完成 | 凤尾森森，竹影婆娑 |
| `locations/hengwu.webp` | 蘅芜苑 | 已完成 | 异香扑鼻，奇草仙藤 |
| `locations/qinfang.webp` | 沁芳亭 | 已完成 | 水波荡漾，落花满径 |
| `locations/qiushuang.webp` | 秋爽斋 | 已完成 | 梧桐落叶，开阔疏朗 |
| `locations/yihong.webp` | 怡红院 | 已完成 | 金碧辉煌，胭脂水粉 |
| `locations/longcui.webp` | 栊翠庵 | 已完成 | 红梅绽放，禅音袅袅 |

UI 背景：

| 文件名 | 用途 | 状态 | 备注 |
|---|---|---|---|
| `ui/menu-bg.webp` | 主菜单背景 | 已完成 | 大观园全景或梦境意境 |
| `ui/gallery-bg.webp` | 图鉴背景 | 已完成 | 太虚幻境薄命司氛围 |

事件插图：

| 文件名 | 事件 | 状态 | 备注 |
|---|---|---|---|
| `events/gongdu-xixiang.webp` | 共读西厢 | 已完成 | 黛玉 + 宝玉，沁芳闸桃花下 |
| `events/tingquan-shentan.webp` | 听劝深谈 | 已完成 | 宝钗 + 宝玉，滴翠亭 |
| `events/zuimian-shaoyao.webp` | 醉眠芍药 | 已完成 | 湘云卧于芍药丛中 |
| `events/sishan-xiaoxiao.webp` | 撕扇子 | 已完成 | 晴雯撕扇，宝玉大笑 |
| `events/kanwairen-dongfanxin.webp` | 槛外人动凡心 | 已完成 | 妙玉落泪，宝玉握其手 |

## 参考来源边界

本项目可以参考旧游戏、插画、影视和古典绘画的风格特征，但不直接复制、搬运或发布第三方受版权保护的游戏数据、图片、音乐、角色立绘或资源包。

允许：

- 记录来源链接和元数据
- 观察画风、配色、构图、界面气质
- 提炼为自己的美术规范
- 生成或绘制原创人物和场景资产

不做：

- 不把原游戏 zip / 数据包放进项目
- 不把原游戏截图、立绘、音乐作为项目资产提交
- 不把第三方素材发布到云端或 GitHub Pages

智冠《红楼梦之十二金钗》可检索关键词：

- 红楼梦之十二金钗
- 智冠科技
- THE DREAM OF RED CHAMBER
- 1998 DOS
- 90 年代中文 PC 游戏

可参考入口：

- GitHub 索引项目：`https://github.com/rwv/chinese-dos-games`
- CN DOS Games Wiki：`https://cn-dos-games.fandom.com/zh/wiki/红楼梦之十二金钗_(1998)`
- 在线 DOS 游戏入口：`https://dos.lol/`
- 低端游戏在线页：`https://ddyx.me/`

如果用户拥有合法游戏副本，可在本地另建私有参考目录：

```text
references/original-game/
```

该目录只作本机研究，不提交 Git，不发布，不放入 `public/`。
