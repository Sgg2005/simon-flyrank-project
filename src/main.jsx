import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  const stored = localStorage.getItem('flyrank-settings')
  if (stored) {
    const { theme } = JSON.parse(stored)
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }
} catch {
  // Ignore invalid stored settings.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
