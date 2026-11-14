import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // three.js is big; that's expected, so don't warn about it
  build: { chunkSizeWarningLimit: 2000 },
})
