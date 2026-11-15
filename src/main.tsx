import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter, self-hosted (bundled by Vite, no Google Fonts request). The browser only downloads the
// character subsets the page actually uses (unicode-range).
import '@fontsource-variable/inter/wght.css'
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
