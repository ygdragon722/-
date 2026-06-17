#!/usr/bin/env bash
set -e

echo "🏮 红楼幻梦 · 一键部署"
echo "────────────────────────"

# 1. 推送源码
echo "▶ 推送源码..."
git push

# 2. 构建
echo "▶ 构建生产包..."
npm run build

# 3. 部署 dist 到 gh-pages 分支
echo "▶ 发布到 GitHub Pages..."
npx gh-pages -d dist

echo "────────────────────────"
echo "✓ 部署完成"
echo "  https://ygdragon722.github.io/-/"
