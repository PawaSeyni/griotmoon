import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import path from 'node:path'

export default defineConfig({
  // imagetools answers `?w=…&format=webp&as=srcset` on image imports at build
  // time (src/data/books.ts uses it for the cover srcset). Plain imports are
  // untouched, so the 1000px JPEGs still exist for og:image and JSON-LD.
  plugins: [react(), imagetools()],
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
