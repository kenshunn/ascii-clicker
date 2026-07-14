import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = repo name for GitHub Pages project-page deploy.
// Served at https://<user>.github.io/ascii-clicker/
export default defineConfig({
  base: '/ascii-clicker/',
  plugins: [react()],
})
