import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // позволяет Live Share расшарить сервер
    port: 5173  // можно указать любой, но лучше дефолт
  },
  build: {
    outDir: 'build'
  }
})
