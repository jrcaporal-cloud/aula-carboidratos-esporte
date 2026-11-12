import { rng } from '../shared/math';

/*
 * A fibra em corte (eixo z; a face cortada é z = 0, a fibra vai para z < 0). Miofibrilas em
 * empacotamento hexagonal, um anel subsarcolemal livre perto da membrana e os grânulos de glicogênio
 * nos três endereços. Fora de escala: os grânulos estão ampliados ~7× para aparecer.
 */

export const FIBER_R = 9;
export const FIBER_LEN = 14;
export const MYO_R = 0.85;
const MYO_STEP = 2.0;
const MYO_MAX_R = FIBER_R - 1.7;

export const COLORS = {
    sarcolemma: '#3E4C66',
    sarcolemmaEdge: '#CBD5E1',
    sarcoplasm: '#141D30',
    myofibril: '#C98F86',
    sr: '#2DD4BF',
    ttubule: '#94A3B8',
    calcium: '#F5F5F4',
} as const;

export type XY = readonly [number, number];

/** Centros das miofibrilas (rede hexagonal recortada pelo círculo). */
export const MYOFIBRILS: readonly XY[] = (() => {
    const out: XY[] = [];
    for (let row = -6; row <= 6; row++) {
        for (let col = -6; col <= 6; col++) {
            const x = col * MYO_STEP + (row % 2 === 0 ? 0 : MYO_STEP / 2);
            const y = row * MYO_STEP * 0.866;
            if (Math.hypot(x, y) <= MYO_MAX_R) out.push([x, y]);
        }
    }
    return out;
})();

export type Pool = 0 | 1 | 2;
export const POOL_NAMES = ['subsarcolemal', 'intermiofibrilar', 'intramiofibrilar'] as const;

export interface Granule { x: number; y: number; z: number; pool: Pool; reveal: number; deplete: number }

const nearestMyo = (x: number, y: number) => MYOFIBRILS.reduce((d, [mx, my]) => Math.min(d, Math.hypot(x - mx, y - my)), Infinity);

/**
 * Grânulos na face cortada. Contagens escolhidas para o intramiofibrilar ficar em ~12% do total
 * (10–15% em ORTENBLAD2011); a divisão entre os outros dois é ilustrativa.
 */
export const GRANULES: readonly Granule[] = (() => {
    const rand = rng(2011711);
    const out: Granule[] = [];
    const push = (x: number, y: number, pool: Pool) => out.push({ x, y, z: 0.12 + rand() * 0.08, pool, reveal: rand(), deplete: rand() });
    while (out.filter(g => g.pool === 0).length < 260) {
        const a = rand() * Math.PI * 2;
        const r = FIBER_R - 0.35 - rand() * 1.05;
        push(Math.cos(a) * r, Math.sin(a) * r, 0);
    }
    while (out.filter(g => g.pool === 1).length < 300) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * (MYO_MAX_R + 0.4);
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (nearestMyo(x, y) > MYO_R + 0.2) push(x, y, 1);
    }
    while (out.filter(g => g.pool === 2).length < 76) {
        const [mx, my] = MYOFIBRILS[Math.floor(rand() * MYOFIBRILS.length)];
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * (MYO_R - 0.22);
        push(mx + Math.cos(a) * r, my + Math.sin(a) * r, 2);
    }
    return out;
})();

/** Vesículas de GLUT4 perto da membrana, na face cortada (ângulo, raio). */
export const VESICLES: readonly { a: number; r: number; seed: number }[] = (() => {
    const rand = rng(1995);
    return Array.from({ length: 44 }, (_, i) => ({ a: (i / 44) * Math.PI * 2 + rand() * 0.08, r: FIBER_R - 2.2 - rand() * 0.6, seed: rand() }));
})();

/** Placas de GLUT4 na parede lateral (ângulo, z), mostradas em ordem de semente. */
export const PATCHES: readonly { a: number; z: number; seed: number }[] = (() => {
    const rand = rng(5817);
    return Array.from({ length: 90 }, () => ({ a: -0.6 + rand() * 2.4, z: -0.8 - rand() * 11, seed: rand() }));
})();
