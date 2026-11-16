import react from '@vitejs/plugin-react'
import { type Connect, defineConfig } from 'vite'
import { buildOfflinePack } from './scripts/build-offline-pack.mjs'

// public/demo/ and public/classroom/ are separate pages. Vercel serves their index.html for
// "/demo/", but Vite's dev and preview servers fall back to the app (the landing page) instead.
const STATIC_PAGES = ['/demo/', '/classroom/']
const servePageIndex: Connect.NextHandleFunction = (req, _res, next) => {
  const [path, query] = (req.url ?? '').split('?')
  if (STATIC_PAGES.includes(path)) req.url = `${path}index.html${query ? `?${query}` : ''}`
  next()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'static-page-index',
    configureServer(server) { server.middlewares.use(servePageIndex) },
    configurePreviewServer(server) { server.middlewares.use(servePageIndex) },
  }, {
    name: 'offline-evidence-pack',
    apply: 'build',
    closeBundle() { buildOfflinePack('dist') },
  }],
  // three.js is big; that's expected, so don't warn about it
  build: { chunkSizeWarningLimit: 2000 },
})
