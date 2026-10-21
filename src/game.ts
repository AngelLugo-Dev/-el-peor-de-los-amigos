// ponytail: reglas base = rondas configurables (3, 5, 10) + votaciones por jugador.
// Cada veredicto suma un "punto de mierda". Al terminar las rondas se corona EL AMIGO DE MIERDA.
import { cartas } from './data/deck';

export interface Jugador {
  nombre: string;
  puntos: number;
  color: string;
}

export interface Partida {
  jugadores: Jugador[];
  rondasTotales: number;
  rondaActual: number;
  mazoBarajado: string[];
  indiceMazo: number;
  cartaActual: string;
  votanteActual: number; // índice del jugador que está votando (0 a jugadores.length - 1)
  votosRonda: number[]; // índices de los jugadores votados en la ronda actual
  terminada: boolean;
  ganador: string | null; // perdedor definitivo (quien más puntos de mierda acumuló)
}

export const AVATAR_COLORS = [
  '#F27457', // Coral / Rojo suave
  '#F5CE42', // Amarillo
  '#74B3F2', // Azul cielo
  '#F29BC6', // Rosa
  '#68D391', // Verde menta
  '#B794F4', // Lavanda
  '#F6AD55', // Naranja melocotón
  '#4FD1C5', // Turquesa
];

export const NOMBRES_DEFAULT = [
  'Tú',
  'Sofi',
  'Nacho',
  'Cami',
  'Dani',
  'Mati',
  'Valen',
  'Luli',
];

export function shuffle(a: string[]): string[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function inicialJugador(nombre: string): string {
  const limpio = (nombre || '').trim();
  return limpio ? limpio[0].toUpperCase() : '?';
}

export function nuevaPartida(nombres: string[], rondasTotales = 5): Partida {
  const mazoBarajado = shuffle(cartas);
  const jugadores: Jugador[] = nombres.map((n, i) => ({
    nombre: n.trim() || NOMBRES_DEFAULT[i] || `Jugador ${i + 1}`,
    puntos: 0,
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }));
  return {
    jugadores,
    rondasTotales,
    rondaActual: 1,
    mazoBarajado,
    indiceMazo: 0,
    cartaActual: mazoBarajado[0],
    votanteActual: 0,
    votosRonda: [],
    terminada: false,
    ganador: null,
  };
}

// Registrar el voto del votanteActual hacia el jugador en indiceVictima.
// Cada voto suma 1 "punto de mierda" al elegido.
// Cuando todos los jugadores votan en la ronda, avanza a la siguiente ronda o termina la partida.
export function registrarVoto(p: Partida, indiceVictima: number): { finRonda: boolean; finPartida: boolean } {
  if (p.terminada) return { finRonda: false, finPartida: false };
  const victima = p.jugadores[indiceVictima];
  if (!victima) return { finRonda: false, finPartida: false };

  victima.puntos += 1;
  p.votosRonda.push(indiceVictima);
  p.votanteActual += 1;

  if (p.votanteActual >= p.jugadores.length) {
    if (p.rondaActual >= p.rondasTotales) {
      p.terminada = true;
      const ordenados = [...p.jugadores].sort((a, b) => b.puntos - a.puntos);
      p.ganador = ordenados[0]?.nombre || null;
      return { finRonda: true, finPartida: true };
    } else {
      p.rondaActual += 1;
      p.votanteActual = 0;
      p.votosRonda = [];
      p.indiceMazo = (p.indiceMazo + 1) % p.mazoBarajado.length;
      p.cartaActual = p.mazoBarajado[p.indiceMazo];
      return { finRonda: true, finPartida: false };
    }
  }

  return { finRonda: false, finPartida: false };
}

export function clasificacion(p: Partida): Jugador[] {
  return [...p.jugadores].sort((a, b) => b.puntos - a.puntos);
}
