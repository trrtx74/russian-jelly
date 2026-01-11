import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/russian-jelly/', // for github pages
  build: {
    outDir: 'docs',
  },
})
