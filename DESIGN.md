---
name: Amigos de Mierda
description: "Estética de mierda, legible: azul marino profundo, marfil, un dorado para destacar y un naranja quemado para acción."
colors:
  primary: "#0E2338"
  panel: "#173A5C"
  surface: "#F3F0E6"
  dark: "#1E1B18"
  ink: "#F3F0E6"
  mute: "#A7B7C4"
  acc: "#D95228"
  gold: "#DDA136"
  danger: "#A91D22"
typography:
  title:
    fontFamily: system-ui
    fontSize: 1.35rem
    fontWeight: 800
  body:
    fontFamily: system-ui
    fontSize: 1rem
    fontWeight: 700
  meta:
    fontFamily: system-ui
    fontSize: 0.8rem
    fontWeight: 400
rounded:
  sm: 8px
  md: 16px
  lg: 22px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.acc}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: 14px 0
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
  card-content:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dark}"
    rounded: "{rounded.md}"
  card-meta:
    textColor: "{colors.mute}"
    typography: "{typography.meta}"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
---

## Overview

Juego de cartas "Amigos de Mierda". Estética nocturna de bar: fondo azul marino
profundo, superficies marfil solo donde hay que leer, texto atenuado en gris
azulado. Un dorado para destacar (lector, umbral, marcos) y un naranja quemado
como único color de acción (botones, barras de progreso). Textos grotescos en
negrita porque el contenido es carne de cañón: sin sutilezas, sin fuentes
serif, sin gradientes.

## Colors

- **Primary (#0E2338):** Azul Marino Profundo, fondo de pantalla y barras vacías.
- **Panel (#173A5C):** Azul marino elevado, contenedores oscuros, botones secundarios.
- **Surface (#F3F0E6):** Blanco Marfil, tarjetas claras y texto sobre fondos oscuros.
- **Dark (#1E1B18):** Carbón, texto sobre superficies claras.
- **Ink (#F3F0E6):** Marfil, texto sobre fondos oscuros.
- **Mute (#A7B7C4):** Texto atenuado, captions, metadata.
- **Acc (#D95228):** Naranja quemado, CTA y barras de señalamiento.
- **Gold (#DDA136):** Dorado, marcos, insignias, el que lee, el umbral.
- **Danger (#A91D22):** Rojo Rubí, alertas (hoy sin uso directo).

## Typography

Sin fuente propia (system-ui): el juego no debe depender de assets externos.
Grosores altos (700–800) porque las cartas se leen en pantalla de celular en
una ronda ruidosa. Uppercase + tracking-widest para etiquetas y metadata.

## Layout

`body` es `h-dvh overflow-hidden` sin scroll: la carta usa `flex-1 min-h-0`.
No romper el "sin scroll": cualquier contenido que quiera crecer rompe el layout.

## Shapes

Esquinas redondeadas generosas (8–22px), bordes dorados al 40–50% de opacidad
para contornos suaves, sombras profundas debajo de la carta. Estados de presión:
`active:scale-90` / `active:scale-95`, sin transiciones largas (≤ 300ms).

## Components

- **button-primary:** CTA principal ("Empezar", "Siguiente carta", "Jugar otra vez"), texto blanco.
- **button-secondary:** Acciones menores y "Deshacer", borde `line/40`.
- **card:** La carta central del mazo, borde dorado 50%, sombra `0 20px 50px -20px rgba(0,0,0,.7)`.
- **card-content:** El texto de la pregunta sobre marfil 90%.
- **input:** Campos de texto con `focus:ring-2 ring-gold`.

## Do's and Don'ts

- **Hacer:** dorado para lo que hay que destacar; marfil para leer; naranja solo para acción.
- **No hacer:** fondos claros como base, gradientes, sombras de color, fuentes decorativas, emojis en la UI.