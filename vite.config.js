import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative paths, so the built app works from GitHub Pages' sub-folder
  // (https://<username>.github.io/<repo-name>/) as well as locally.
  base: './',
});