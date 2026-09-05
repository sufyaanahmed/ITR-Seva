import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/platform': 'http://127.0.0.1:3001',
      '/oauth': 'http://127.0.0.1:3001',
      '/.well-known': 'http://127.0.0.1:3001',
      '/mcp': 'http://127.0.0.1:3001',
      '/api': 'http://127.0.0.1:3000',
    },
  },
  build: {
    cssMinify: 'lightningcss',
  }
})
