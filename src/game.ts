// ponytail: reglas Cachonda v2 = base (carta pregunta + señalar a persona física + umbral de eliminación configurable)
// Sin backend. El host toca al jugador más señalado => +1 punto. Llega al umbral => eliminado. Último en pie gana.
import { cartas } from './data/deck';

export interface Jugador {
  nombre: string;
  puntos: number;
  eliminado: boolean;
}

export interface Partida {
  jugadores: Jugador[];
  umbral: number;
  mazoBarajado: string[];
  indiceMazo: number;
  cartaActual: string;
  lector: number; // índice del que lee
  ronda: number;
ganador: string | null;
  vencedor: boolean;
  historial: string[]; // nombres en orden para deshacer
}

export function shuffle<T>(a: T[]): T[] {
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
    jugadores: nombres.map((n) => ({ nombre: n, puntos: 0, eliminado: false })),
    umbral,
    mazoBarajado,
    indiceMazo: 0,
    cartaActual: mazoBarajado[0],
    lector: 0,
    ronda: 1,
    ganador: null,
    vencedor: false,
    historial: [],
  };
}

function vivos(p: Partida) {
  return p.jugadores.filter((j) => !j.eliminado);
}

// sumar punto al señalado; al llegar al umbral se elimina
export function marcar(p: Partida, nombre: string) {
const j = p.jugadores.find((x) => x.nombre === nombre);
  if (!j || j.eliminado) return;
  j.puntos += 1;
  p.historial.push(nombre);
  if (j.puntos >= p.umbral) j.eliminado = true;
  const restantes = vivos(p);
  if (restantes.length === 1) {
    p.ganador = restantes[0].nombre;
    p.vencedor = true;
  }
}

// deshacer el último punto (error de dedo)
export function deshacer(p: Partida, nombre: string) {
  const j = p.jugadores.find((x) => x.nombre === nombre);
  if (!j || j.puntos <= 0) return;
  j.puntos -= 1;
  if (j.eliminado && j.puntos < p.umbral) j.eliminado = false;
  p.vencedor = false;
  p.ganador = null;
}

// siguiente ronda: nueva carta (sin repetir hasta agotar), rota quién lee entre vivos
export function siguiente(p: Partida) {
  if (p.vencedor) return;
  const activos = vivos(p);
  if (activos.length === 0) return;
  // avanza lector al próximo vivo
  const idx = p.jugadores.findIndex((x) => x.nombre === p.jugadores[p.lector].nombre);
  let n = (idx + 1) % p.jugadores.length;
  while (n !== idx && p.jugadores[n].eliminado) n = (n + 1) % p.jugadores.length;
  p.lector = n;
  p.indiceMazo += 1;
  if (p.indiceMazo >= p.mazoBarajado.length) {
    p.mazoBarajado = shuffle(cartas);
    p.indiceMazo = 0;
    p.ronda += 1;
  }
  p.cartaActual = p.mazoBarajado[p.indiceMazo];
}
