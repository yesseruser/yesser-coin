import { dirname, resolve} from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './', // crucial for GitHub Pages
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mint: resolve(__dirname, 'mint.html'),
        migrate: resolve(__dirname, 'migrate.html')
      },
    },
  }
});

