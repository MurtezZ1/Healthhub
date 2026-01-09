import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false, // Disable HTTPS
    port: 5173,   // Keep the same port
    host: '0.0.0.0',
    proxy: {
      '^/api': {
        target: 'http://localhost:7107',
        changeOrigin: true,
        secure: false
      }
    },
    open: true
  }
});