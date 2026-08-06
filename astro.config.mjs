import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// ponytail: static site, no SSR, no integrations
export default defineConfig({
  output: 'static',
  base: '/amigos-de-mierda/',
  vite: { plugins: [tailwindcss()] }
});
