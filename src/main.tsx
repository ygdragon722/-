import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SliceDemo from './story/SliceDemo.tsx'

// 探案 VN 入口（养成版已于 2026-06-18 整体下线）
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SliceDemo />
  </StrictMode>,
)
