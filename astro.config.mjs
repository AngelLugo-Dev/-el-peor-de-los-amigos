import { defineConfig } from 'astro/config';

// ponytail: static site, no SSR, no integrations
export default defineConfig({
  output: 'static',
  base: '/amigos-de-mierda/'
});
