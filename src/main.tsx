import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './lib/language'
import { ToastProvider } from './lib/toast'
import '@fontsource-variable/lexend' // self-hosted Lexend (legibility-tuned for early/dyslexic readers)
import './index.css'

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Production pages are prerendered snapshots (scripts/prerender.mjs). Hydrating
// adopts that markup instead of discarding it and repainting after the JS loads,
// which is what held back mobile LCP (the hero was painted ~3 s after it had
// downloaded). The empty shell (dev server, prerender itself) still client-renders.
const container = document.getElementById('root')!
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app)
} else {
  ReactDOM.createRoot(container).render(app)
}
