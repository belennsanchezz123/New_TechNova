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
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
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
        breachDemo: resolve(__dirname, 'breach-demo.html'),
        breachResults: resolve(__dirname, 'breach-results.html')
      }
    }
  }
});
