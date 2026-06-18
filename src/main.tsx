import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SliceDemo from './story/SliceDemo.tsx'

// 探案 VN 切片预览：localhost/?slice=fengjie（不影响旧养成 build）
const isSlice = window.location.search.includes('slice')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSlice ? <SliceDemo /> : <App />}
  </StrictMode>,
)
