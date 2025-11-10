import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // test: { // Comentado porque no es una propiedad válida en la configuración base de Vite
  //   globals: true, 
  //   environment: 'jsdom',
  // }
})