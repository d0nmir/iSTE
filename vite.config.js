import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // слушать на всех интерфейсах
    port: 5173, // порт для Live Share
  },
})
