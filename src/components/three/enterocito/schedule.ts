import { rng } from '../shared/math';
import { DOOR, ROUTE_FRUCTOSE, ROUTE_GLUCOSE, ROUTE_KHK, ROUTE_SODIUM, queueSlot, type Pt } from './layout';

/*
 * Agenda das moléculas de cada etapa, calculada uma vez: cada molécula nasce no lúmen, chega à porta,
 * espera na fila se a porta está ocupada (cada porta atende uma por vez, com tempo de serviço fixo) e
 * segue até o capilar. A posição é função pura de (molécula, t): voltar à etapa refaz a mesma cena.
 * Ritmos e tempos de serviço são ilustrativos; os números medidos ficam no placar.
 */

export type Kind = 'glc' | 'gal' | 'fru' | 'na';
export type Door = 'sglt1' | 'glut5';

export interface Mol {
    kind: Kind;
    door: Door;
    pre: readonly Pt[];
    post: readonly Pt[];
    t0: number;
    arrive: number;
    pass: number;
    /** Comprimentos acumulados do trecho depois da porta. */
    postLen: readonly number[];
}

export const SPEED = 4.6;

const lengths = (pts: readonly Pt[]) => pts.reduce<number[]>((acc, p, i) => {
    if (i === 0) return [0];
    const q = pts[i - 1];
    return [...acc, acc[i - 1] + Math.hypot(p[0] - q[0], p[1] - q[1])];
}, []);

interface Lane { kind: Kind; door: Door; count: number; every: number; start: number; route: (lx: number, d: number) => Pt[] }

const build = (lanes: readonly Lane[], service: Record<Door, number>, seed: number): Mol[] => {
    const rand = rng(seed);
    const raw = lanes.flatMap(l => Array.from({ length: l.count }, (_, i) => {
        const route = l.route(-3 + rand() * 6, (rand() - 0.5) * 1.6);
        const t0 = l.start + i * l.every + rand() * l.every * 0.3;
        const preLen = Math.hypot(route[1][0] - route[0][0], route[1][1] - route[0][1]);
        return { kind: l.kind, door: l.door, route, t0, arrive: t0 + preLen / SPEED };
    }));
    // fila por porta: atende em ordem de chegada; o Na⁺ acompanha a glicose e não ocupa a porta
    const lastPass: Record<Door, number> = { sglt1: -9, glut5: -9 };
    const queued: Record<Door, { pass: number }[]> = { sglt1: [], glut5: [] };
    return [...raw].sort((a, b) => a.arrive - b.arrive).map(m => {
        const free = m.kind === 'na';
        const pass = free ? m.arrive : Math.max(m.arrive, lastPass[m.door] + service[m.door]);
        if (!free) lastPass[m.door] = pass;
        const ahead = free ? 0 : queued[m.door].filter(q => q.pass > m.arrive).length;
        if (!free) queued[m.door].push({ pass });
        const doorX = DOOR[m.door].x;
        const pre: Pt[] = ahead > 0 ? [m.route[0], queueSlot(doorX, ahead)] : [m.route[0], m.route[1]];
        const arrive = m.t0 + Math.hypot(pre[1][0] - pre[0][0], pre[1][1] - pre[0][1]) / SPEED;
        const post = m.route.slice(1);
        return { kind: m.kind, door: m.door, pre, post, t0: m.t0, arrive: Math.min(arrive, pass), pass, postLen: lengths(post) };
    });
};

const SGLT1 = (count: number, every: number, start = 0): Lane => ({ kind: 'glc', door: 'sglt1', count, every, start, route: ROUTE_GLUCOSE });
const GAL = (count: number, every: number, start = 0): Lane => ({ kind: 'gal', door: 'sglt1', count, every, start, route: ROUTE_GLUCOSE });
const NA = (count: number, every: number, start = 0): Lane => ({ kind: 'na', door: 'sglt1', count, every, start, route: ROUTE_SODIUM });
const GLUT5 = (count: number, every: number, start = 0): Lane => ({ kind: 'fru', door: 'glut5', count, every, start, route: ROUTE_FRUCTOSE });
const KHK = (count: number, every: number, start = 0): Lane => ({ kind: 'fru', door: 'glut5', count, every, start, route: ROUTE_KHK });

/** Agenda por etapa (a etapa 5, da hipótese, congela a fila da etapa 4 no fim). */
export const SCHEDULES: readonly (readonly Mol[])[] = [
    [],
    build([SGLT1(9, 0.7), GAL(4, 1.4, 0.35), NA(10, 0.65, 0.1)], { sglt1: 0.3, glut5: 0.3 }, 11),
    build([GLUT5(9, 0.7), KHK(3, 2.1, 0.4), SGLT1(5, 1.2, 0.2)], { sglt1: 0.3, glut5: 0.3 }, 12),
    build([SGLT1(28, 0.17)], { sglt1: 0.5, glut5: 0.3 }, 13),
    build([SGLT1(28, 0.17)], { sglt1: 0.5, glut5: 0.3 }, 13),
    build([SGLT1(24, 0.2), GLUT5(16, 0.32, 0.2)], { sglt1: 0.5, glut5: 0.5 }, 15),
    build([SGLT1(26, 0.17), GLUT5(26, 0.17, 0.1)], { sglt1: 0.5, glut5: 0.5 }, 16),
];

/** Etapas em que a cena fica parada no fim da agenda (t fixo). */
export const FROZEN_AT: readonly (number | null)[] = [null, null, null, null, 7.2, null, null];
