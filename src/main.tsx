import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted type (bundled by Vite, no Google Fonts request, saved in the offline pack):
// Instrument Serif for display headlines, Instrument Sans for reading, JetBrains Mono for data.
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './index.css'
import App from './App.tsx'
import { startRouter } from './state/router'

// Read #moon / #mars/<relic> from the URL before the first render (see state/router.ts).
startRouter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
