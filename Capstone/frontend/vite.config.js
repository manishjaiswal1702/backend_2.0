import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      // Stabilise HMR — prevents reloads triggered by unrelated socket errors.
      clientPort: 5173,
    },
    proxy: {
      // REST API — forwarded to the backend/ingress
      "/api": {
        target: "http://127.0.0.1:80",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('proxy error', err))
          proxy.on('proxyReq', (_, req) => console.log('proxying:', req.method, req.url))
          proxy.on('proxyRes', (res, req) => console.log('got response:', res.statusCode, req.url))
        }
      },
      "/agent": {
        target: "http://127.0.0.1:80",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('proxy error', err))
          proxy.on('proxyReq', (_, req) => console.log('proxying agent:', req.method, req.url))
          proxy.on('proxyRes', (res, req) => console.log('got agent response:', res.statusCode, req.url))
        }
      },
      "/preview": {
        target: "http://127.0.0.1:80",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('proxy error', err))
          proxy.on('proxyReq', (_, req) => console.log('proxying preview:', req.method, req.url))
          proxy.on('proxyRes', (res, req) => console.log('got preview response:', res.statusCode, req.url))
        }
      }
    }
  }
})