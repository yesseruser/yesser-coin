import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // crucial for GitHub Pages
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  }
});

