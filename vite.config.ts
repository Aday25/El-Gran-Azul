import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ✅ CONFIGURACIÓN MEJORADA PARA PRODUCCIÓN
  base: '/',
  
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
    rollupOptions: {
      output: {
        // ✅ MEJOR ORGANIZACIÓN DE ARCHIVOS
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      }
    }
  },
  
  server: {
    port: 5173,
    host: true,
  },
  
  // ✅ PREVIEW CONFIG (para ver build local)
  preview: {
    port: 4173,
    host: true,
  }
})