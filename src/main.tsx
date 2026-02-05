import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const tg = (window as any)?.Telegram?.WebApp

if (tg) {
  try {
    tg.ready()
    tg.expand()

    // Запрет “свайп вниз” (новое/старое API — на всякий случай оба)
    tg.disableVerticalSwipes?.()
    tg.setSwipeBehavior?.({ allow_vertical_swipe: false })

    // Иногда помогает закрепить полноэкранность (если доступно)
    tg.requestFullscreen?.()
  } catch (e) {
    // no-op
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
