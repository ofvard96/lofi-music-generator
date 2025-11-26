import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  // Use repo name as base for GitHub Pages, '/' for other deployments
  base: process.env.GITHUB_PAGES ? '/lofi-music-generator/' : '/'
})
