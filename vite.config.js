import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base set for GitHub Pages project-page deploy (adjust to repo name later)
export default defineConfig({
  plugins: [react()],
})
