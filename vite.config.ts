import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { buildOfflinePack } from './scripts/build-offline-pack.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'offline-evidence-pack',
    apply: 'build',
    closeBundle() { buildOfflinePack('dist') },
  }],
  // three.js is big; that's expected, so don't warn about it
  build: { chunkSizeWarningLimit: 2000 },
})
