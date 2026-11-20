import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In local development the Vite server proxies /api to the Express backend,
    // so the frontend can call relative /api URLs. In production, set
    // VITE_API_URL to the Render backend URL instead (see README.md).
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
