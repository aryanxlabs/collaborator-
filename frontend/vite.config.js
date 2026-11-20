import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // No /api proxy: the frontend talks directly to Supabase (see
  // src/supabase.js), so there is no local backend server to proxy to.
})
