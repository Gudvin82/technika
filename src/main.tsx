import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

const tg = (window as any)?.Telegram?.WebApp

if (tg) {
  try {
    tg.ready()
    tg.expand()
    tg.disableVerticalSwipes?.()
    tg.setSwipeBehavior?.({ allow_vertical_swipe: false })
    tg.requestFullscreen?.()
  } catch (e) {}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
