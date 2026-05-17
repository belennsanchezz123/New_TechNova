import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    host: '10.208.102.30',
    port: 5173,
    https: false,
    open: true,
    allowedHosts: ['technova.inf.um.es'],
     // Añadir esto:
  hmr: {
    host: 'technova.inf.um.es',  // el host que ve el navegador
    protocol: 'ws',              // forzar ws:// en vez de wss://
    port: 5173,
  },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        breachResults: resolve(__dirname, 'breach-results.html')
      }
    }
  }
});
