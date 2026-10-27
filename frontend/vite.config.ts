import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"development"',  // ← forces readable React errors
  },
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss()
  ],
  base: '/', // Set the base path
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:8080',
        changeOrigin: true

      }
    }
  },
  build: {
    sourcemap: true,
     minify: false,
  },

})


