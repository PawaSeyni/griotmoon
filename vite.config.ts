import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    // Dev server only (never runs in production). Kept to the one remote
    // preview host we actually use, rather than 'all'.
    allowedHosts: ['.manus.computer'],
  },
})
