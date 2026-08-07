# Amigos de Mierda

Juego de cartas para grupos de amigos, single-page, sin backend, pensado para jugar
en el celular del host (se pasa el teléfono de mano en mano o todos miran una pantalla).

## Cómo se juega

1. Se cargan 2+ jugadores y se define el **umbral** de señalamientos (default 5, configurable 2-20).
2. Cada ronda sale una pregunta del mazo y **el lector** la lee en voz alta (rota cada ronda).
3. Todos señalan a su elegido. **El host toca al jugador más señalado** y le suma 1 punto.
4. El que alcanza el umbral **se corona EL AMIGO DE MIERDA** → pantalla de resultado final. No hay eliminaciones.
5. "Deshacer último" revierte el último punto (error de dedo).

No hay backend ni multijugador online: la partida vive en `localStorage` del dispositivo.

## Stack

- **Astro 5** — build estático puro (`output: 'static'`), una sola página (`src/pages/index.astro`).
- **Tailwind CSS v4** vía `@tailwindcss/vite` — tema en `src/styles/global.css` (tokens `bg/panel/line/ink/mute/acc/ok`).
- **TypeScript** — lógica pura en `src/game.ts` (bundled por Vite al build).
- **pnpm** — gestor de paquetes (`pnpm-lock.yaml` commitado).
- **GitHub Pages** — `.github/workflows/deploy.yml` compila y publica `dist/` en push a `main` o manual.

## Estructura

```
src/
  pages/index.astro      → Toda la UI (vanilla JS: innerHTML + handlers), 3 vistas: setup / juego / fin
  game.ts                → Lógica pura: nuevaPartida, marcar, deshacer, siguiente, shuffle
  data/deck.ts           → 110 preguntas (agregar/quitar libremente, se bundlean al build)
  styles/global.css      → Import de Tailwind, tema, keyframes (pop/rise/flip/copo) y CSS del toast
.github/workflows/deploy.yml → CI de GitHub Pages
```

## Comandos

```bash
pnpm dev       # dev server en http://localhost:4321/amigos-de-mierda/
pnpm build     # genera dist/ (estático)
pnpm preview   # sirve dist/ localmente para verificar el build
```

## Despliegue (GitHub Pages)

- `astro.config.mjs` define el `base` dinámicamente: `/` en Vercel (usa la variable `VERCEL`), `/-el-peor-de-los-amigos/` en GitHub Pages — TODA URL de asset sale con ese prefijo según el deploy.
- El workflow hace `pnpm install --frozen-lockfile && pnpm build` y sube `dist/` como artifact de Pages.
- Tailwind compila a un CSS estático; no necesita nada especial para Pages.

## Estado y decisiones técnicas

- **Regla de resultado**: el que llega al umbral pierde/gana el título (antes se eliminaba al
  llegado al límite y ganaba el último en pie — lógica invertida, corregida; ver historial git).
- **`localStorage`**: clave `adm-amigos-v1` con la `Partida` serializada completa. El esquema
  cambió (se eliminaron `eliminado`/`vencedor`, se agregó `ganador`) — si un usuario tiene
  una partida vieja guardada, se descarta por el cambio de clave.
- **Layout sin scroll en móvil**: `body h-dvh overflow-hidden` + `main` flex column; la carta es
  `flex-1 min-h-0` y absorbe el alto sobrante (scroll interno solo si la pregunta es muy larga).
  Safe-area (`env(safe-area-inset-bottom)`) para notch/home bar.
- **Estética de carta**: palos ♠♥♣♦ (unicode, sin assets) rotando por `indiceMazo % 4` en esquinas,
  flip 3D al pasar carta, 💩 animado en el podio final.
- **Sin assets externos**: logos/iconos/texturas pendientes (ver AGENTS.md).

## Próximos pasos posibles

- Logo/favicon propio (hoy no hay favicon; se puede poner un emoji data-URI como placeholder).
- Dorso de carta para animación de robar mazo.
- Sonidos de feedback (tap, flip) — sin deps, con WebAudio.
