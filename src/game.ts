// ponytail: reglas base = carta pregunta + señalar a persona física + umbral configurable.
// El que llega al umbral de señalamientos es EL AMIGO DE MIERDA (pierde y se corona). Sin eliminaciones.
// Sin backend. El host toca al jugador más señalado => +1 punto. Límite => resultado.
import { cartas } from './data/deck';

export interface Jugador {
  nombre: string;
  puntos: number;
}

export interface Partida {
  jugadores: Jugador[];
  umbral: number;
  mazoBarajado: string[];
  indiceMazo: number;
  cartaActual: string;
  lector: number; // índice del que lee
  ronda: number;
  marcado: boolean; // ya se señaló a alguien en esta ronda (1 selección por ronda)
  ganador: string | null; // quien alcanzó el umbral = amigo de mierda
  historial: string[]; // nombres en orden para deshacer
}

export function shuffle(a: string[]): string[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function nuevaPartida(nombres: string[], umbral: number): Partida {
  const mazoBarajado = shuffle(cartas);
  return {
    jugadores: nombres.map((n) => ({ nombre: n, puntos: 0 })),
    umbral,
    mazoBarajado,
    indiceMazo: 0,
    cartaActual: mazoBarajado[0],
    lector: 0,
    ronda: 1,
    marcado: false,
    ganador: null,
    historial: [],
  };
}

// sumar punto al señalado; 1 sola selección por ronda; al llegar al umbral se corona amigo de mierda
export function marcar(p: Partida, nombre: string) {
  const j = p.jugadores.find((x) => x.nombre === nombre);
  if (!j || p.ganador || p.marcado) return;
  j.puntos += 1;
  p.historial.push(nombre);
  p.marcado = true;
  if (j.puntos >= p.umbral) p.ganador = nombre;
}

// deshacer el último punto (error de dedo); deja disponible la selección de la ronda
export function deshacer(p: Partida, nombre: string) {
  const j = p.jugadores.find((x) => x.nombre === nombre);
  if (!j || j.puntos <= 0) return;
  j.puntos -= 1;
  if (j.puntos < p.umbral) p.ganador = null;
  p.marcado = false;
}

// siguiente ronda: nueva carta (sin repetir hasta agotar), rota quién lee, reabre la selección
export function siguiente(p: Partida) {
  if (p.ganador) return;
  p.lector = (p.lector + 1) % p.jugadores.length;
  p.indiceMazo += 1;
  if (p.indiceMazo >= p.mazoBarajado.length) {
    p.mazoBarajado = shuffle(cartas);
    p.indiceMazo = 0;
    p.ronda += 1;
  }
  p.cartaActual = p.mazoBarajado[p.indiceMazo];
  p.marcado = false;
}
