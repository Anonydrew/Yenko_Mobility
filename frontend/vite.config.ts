import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// In development the PHP API runs on :8000; proxying keeps everything on one origin so the httpOnly cookie works.
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8000';
const proxy = {
  '/api': { target: apiTarget, changeOrigin: true },
  '/uploads': { target: apiTarget, changeOrigin: true },
};

export default defineConfig({
  plugins: [react()],
  // Read VITE_* variables from the shared .env in the project root.
  envDir: '..',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, strictPort: true, proxy },
  preview: { port: 4173, proxy },
});
