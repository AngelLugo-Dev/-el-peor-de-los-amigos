# AGENTS.md — contexto para agentes

Guía para trabajar sobre este repo. Léelo antes de tocar código.

## Quickstart

```bash
pnpm install
pnpm dev       # desarrollo
pnpm build     # verifica que compile (SIEMPRE correr antes de dar por hecho un cambio)
pnpm preview   # sirve dist/ en http://localhost:4321/amigos-de-mierda/
```

Regla de verificación: tras cualquier cambio real, correr `pnpm build`. El juego es
100% client-side; también se puede validar la lógica pura con un self-check de Node
(copiar `src/game.ts` y `src/data/deck.ts` a un temp, sumar extensión `.ts` a los
imports y correr `node --experimental-strip-types check.mjs`).

## Qué es esto

Juego de cartas "Amigos de Mierda". Una página estática (Astro 5) +
Tailwind v4 + TS + pnpm, deployada a GitHub Pages vía workflow. Sin backend, sin
multijugador online; la partida vive en `localStorage`.

Regla central: **el que alcanza el umbral de señalamientos se corona EL AMIGO DE
MIERDA** (pantalla final). No hay eliminaciones, no hay "último en pie". Detalle en README.md.

## Archivos — qué tocar y qué NO

| Archivo | Rol | Para qué tocarlo |
|---|---|---|
| `src/pages/index.astro` | Toda la UI (innerHTML + handlers). Las 3 vistas: setup / juego / fin. | Cambios de UX/UI, textos, animaciones. |
| `src/game.ts` | Lógica pura (nuevaPartida, marcar, deshacer, siguiente, shuffle). | Reglas del juego. Mantenerlo sin DOM. |
| `src/data/deck.ts` | 110 preguntas (array de strings). | Agregar/quitar cartas libremente. |
| `src/styles/global.css` | Tailwind import + @theme (tokens de color) + keyframes + CSS del toast. | Colores, animaciones, estilos globales. |
| `astro.config.mjs` | Static output + `base: '/amigos-de-mierda/'` + plugin Tailwind. | Config de build. |
| `.github/workflows/deploy.yml` | CI de GitHub Pages (pnpm build → upload dist). | Deploy. |

`dist/` es generado y está en `.gitignore` (también `node_modules/`, `.astro/`).

## Convenciones

- **Señum** - la clave de localStorage. `adm-amigos-v1`. El esquema de Partida cambió (se eliminaron `eliminado`/`vencedor`, se agregó `ganador`). No cambiar de formato a la ligera; si se cambia el esquema, **bumpear la clave**.
- UI en **español** (textos grotescos/grosores a gusto). Nombres de funciones en inglés (código), textos en español.
- Sin comentarios salvo los `ponytail:` (explican una simplificación deliberada y su techo).
- Sin dependencias nuevas sin justificación: para escueta cosa alcanza stdlib/plataforma/unicode.

## Gotchas críticos (historial de bugs pagados)

1. **Script inline de Astro**: en `.astro`, un `<script>` con `type="module"` es tratado como
   `is:inline` → su `import` NO se bundlea y queda raw. El bug histórico: `import ... from "../game"`
   (sin extensión) resolvía contra la URL del navegador → 404 → pantalla en negro.
   Regla: script **sin atributos** (Astro lo hace module por si y lo bundlea) e imports con
   ruta relativa CON extensión, ej. `import { marcar } from "../../src/game.ts"`.
2. **Base path**: todos los assets salen con `/amigos-de-mierda/`. En dev/preview usarla en las URLs.
3. **localStorage**: usuario con partida vieja → se descarta (bump de clave v3). `load()` devuelve
   `null` ante cualquier error de parseo y eso es **comportement correcto.
4. **Layout móvil**: `body` es `h-dvh overflow-hidden`, el `main` es flex column; la carta usa
   `flex-1 min-h-0`. NO romper el "sin scroll": cualquier contenido que quiera crecer rompe el layout.
5. **Assets**: no hay ninguno externo. Palos (♠♥♣♦), 💩 y animaciones son unicode/CSS. Está pendiente
   el logo/favicon (tabla de pendientes, abajo).
6. **Verificación de UI**: el render es innerHTML y re-crea nodos → las animaciones se re-disparan
   en cada render. No hay framework de test para la UI.

## Pendientes de desarrollo (para continuar)

- Logo/favicon propio (32/192/512 PNG) — hoy no hay favicon; placeholder emoji data-URI como opción mínima.
- Dorso de carta / patrón del dorso para robar mazo (opcional, 512×712).
- Textura de fondo sutil (opcional).
- Sonidos feedback (WebAudio, sin deps).