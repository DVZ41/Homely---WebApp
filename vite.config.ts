import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Fuerza recarga en cambios de archivos
    watch: {
      usePolling: true,
    },
    // Headers para evitar caché en desarrollo
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  // Deshabilita caché de módulos en desarrollo
  optimizeDeps: {
    force: true,
  },
})
