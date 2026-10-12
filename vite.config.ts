import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/.
  // Keep local development and other hosts rooted at /.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/campusiq-campus-rescue-loop/' : '/',
  plugins: [react()],
})
