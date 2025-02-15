import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    watch: {
      usePolling: true,
    },
  },
});

