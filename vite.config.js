import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: '/',
});
