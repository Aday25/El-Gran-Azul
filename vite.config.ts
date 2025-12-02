import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ✅ CONFIGURACIÓN BÁSICA Y SEGURA
  base: '/',
  
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
  },
  
  server: {
    port: 5173,
    host: true,
  }
})