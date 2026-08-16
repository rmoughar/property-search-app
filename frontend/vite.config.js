import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: '/src/testing/vitestSetup.js'
  },
  server: {
    port:4005,
    proxy: {
      '/api' : {
        target: 'http://localhost:4001',
        changeOrigin: true
      }
    }
  }
})
