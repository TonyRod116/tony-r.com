import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  experimental: {
    // Keep HTML entries and document/image URLs at the normal public root.
    // Resolve lazy chunks/styles and CSS fonts beside their owning file, which
    // also works when the official Sprite Fusion viewer prefixes the website.
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'css' || (hostType === 'js' && /\.(?:js|css)$/.test(filename))) return { relative: true }
    },
  },
  optimizeDeps: {
    include: ['three', 'three/examples/jsm/controls/OrbitControls.js'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
})
