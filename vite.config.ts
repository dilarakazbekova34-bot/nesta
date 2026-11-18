import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message?.includes('lodash')) return;
        warn(warning);
      },
      output: {
        manualChunks: {
          'three': ['three'],
          'recharts': ['recharts', 'd3-shape', 'd3-scale', 'd3-array'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['lodash', 'three'],
  },
})
