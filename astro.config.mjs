import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// ponytail: base dinamica — Vercel sirve en la raiz, GH Pages bajo el nombre del repo.
const base = process.env.VERCEL ? '/' : '/-el-peor-de-los-amigos/';

export default defineConfig({
  output: 'static',
  base,
  vite: { plugins: [tailwindcss()] }
});
