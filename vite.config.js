import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      external: ['emitter', 'browser-sync/lib/server/utils'],
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-redux') ||
            id.includes('node_modules/@reduxjs') ||
            id.includes('node_modules/react/')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  server: {
    host: true,
  },
  css: {
    devSourcemap: true,
  },
})
