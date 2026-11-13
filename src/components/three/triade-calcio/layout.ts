import { C } from '../../sims/kit/palette';
import { rng } from '../shared/math';
import type { Granule, Pool } from '../fibra-glicogenio/layout';
import type { Vec3 } from '../shared/modal/types';

/*
 * Um sarcômero em corte longitudinal (eixo x), de linha Z a linha Z, com três miofibrilas lado a lado
 * (eixo z; a da frente vem aberta, mostrando actina e miosina). Em cada junção A-I, uma tríade:
 * túbulo T (anel em volta de cada miofibrila, ligado ao sarcolema por um tubo) entre duas cisternas
 * do RS; o RS longitudinal (com a SERCA) corre por cima da banda A. Fora de escala: proteínas,
 * íons e grânulos ampliados para aparecer no vídeo.
 */

export const COLORS = {
    sarcolemma: '#5B6B88',
    sarcolemmaEdge: '#CBD5E1',
    ttubule: '#CBD5E1',
    sr: '#64748B',
    zline: C.stone,
    myosin: '#C98F86',
    actin: '#9FB0C8',
    aBand: '#6E5459',
    iBand: '#94797D',
    troponin: C.stone,
    dhpr: C.glucoseSoft,
    ryr: '#2563EB',
    serca: C.stone,
    calcium: C.insulinSoft,
    ap: '#FFFFFF',
} as const;

/** Linha Z em x = ±Z_REST no repouso; na contração cada uma anda Z_SHIFT para o centro (ilustrativo). */
export const Z_REST = 6;
export const Z_SHIFT = 1.2;
/** Meia banda A (miosina) e comprimento da actina, a partir da linha Z. */
export const A_HALF = 3.2;
export const ACTIN_LEN = 4.2;
export const MYO_R = 0.95;
/** Centros das miofibrilas no eixo z (y = 0); a última é a aberta, de frente para a câmera. */
export const MYO_Z: readonly number[] = [-3.2, 0, 3.2];
export const FRONT_Z = 3.2;

/** Tríades nas junções A-I; anéis do RS e do túbulo T em volta de cada miofibrila. */
export const TRIAD_X: readonly number[] = [-3.4, 3.4];
export const RING_R = 1.25;
export const T_TUBE = 0.16;
export const CIST_TUBE = 0.3;
export const CIST_DX = 0.81;
/** RS longitudinal: tubos ao longo de x, entre as cisternas internas, e o colar na linha M. */
export const LONG_R = 1.2;
export const LONG_TUBE = 0.13;
/** Em cima, atrás e embaixo: a frente fica livre para ver os filamentos da miofibrila aberta. */
export const LONG_ANGLES: readonly number[] = [Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
export const LONG_X0 = TRIAD_X[1] - CIST_DX - CIST_TUBE + 0.05;

/** Sarcolema: placa no alto, cortada na frente para mostrar a miofibrila aberta. */
export const MEM_Y = 2.45;
export const MEM_X = 7;
export const MEM_Z: readonly [number, number] = [-4.8, 0.9];
/** Trilho do túbulo T: corre em z pelo alto dos anéis; o tubo sobe dele até o sarcolema em z = 0. */
export const RAIL_Y = RING_R;

/** Ponto no anel de raio r em volta da miofibrila de centro zc, no ângulo a (a = 0 aponta para +z). */
export const ringPoint = (x: number, r: number, a: number, zc = FRONT_Z): Vec3 => [x, r * Math.sin(a), zc + r * Math.cos(a)];

/**
 * Na miofibrila aberta, os anéis da tríade são cortados na frente (janela de WINDOW[0] a WINDOW[1])
 * para ver os filamentos e o glicogênio de dentro; os pares DHPR–RyR1 ficam no arco de cima.
 */
export const WINDOW: readonly [number, number] = [-1.35, 0.6];
export const JUNCTION_ANGLES: readonly number[] = [0.85, 1.2, 1.55, 1.9];

export interface Junction { x: number; side: -1 | 1; a: number }
/** Cada tríade tem pares dos dois lados do túbulo T (cisterna de fora e de dentro). */
export const JUNCTIONS: readonly Junction[] = TRIAD_X.flatMap(x => ([-1, 1] as const).flatMap(side => JUNCTION_ANGLES.map(a => ({ x, side, a }))));

/** Filamentos da miofibrila aberta: miosina no centro e em hexágono; actina nos vãos (duas coroas). */
export const MYOSIN_YZ: readonly (readonly [number, number])[] = [[0, 0], ...Array.from({ length: 6 }, (_, k) => {
    const a = (k * Math.PI) / 3;
    return [0.5 * Math.sin(a), 0.5 * Math.cos(a)] as const;
})];
export const ACTIN_YZ: readonly (readonly [number, number])[] = [
    ...Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return [0.29 * Math.sin(a), 0.29 * Math.cos(a)] as const; }),
    ...Array.from({ length: 6 }, (_, k) => { const a = (k * Math.PI) / 3; return [0.8 * Math.sin(a), 0.8 * Math.cos(a)] as const; }),
];

/** Troponina C onde cada íon pousa: (actina, distância da linha Z). Quatro de cada lado. */
export const TROPONIN: readonly { rod: number; fromZ: number }[] = [
    { rod: 6, fromZ: 3.3 }, { rod: 7, fromZ: 3.6 }, { rod: 11, fromZ: 3.5 }, { rod: 0, fromZ: 3.8 },
];

/** SERCA no tubo de cima do RS longitudinal (o que a câmera vê), duas por lado. */
export const SERCA_ANGLES: readonly number[] = [Math.PI / 2];
export const SERCA_X: readonly number[] = [1.2, 2.0];

export type { Granule, Pool };

const nearTriad = (x: number, w: number) => TRIAD_X.some(t => Math.abs(x - t) < w);

/**
 * Grânulos nos três endereços. Contagens para o intramiofibrilar ficar em ~12% do total (10–15% em
 * ORTENBLAD2011); a divisão entre os outros dois é ilustrativa. O intramiofibrilar fica na banda I,
 * entre a tríade e a linha Z, só na miofibrila aberta (nas fechadas estaria escondido).
 */
export const GRANULES: readonly Granule[] = (() => {
    const rand = rng(661411);
    const out: Granule[] = [];
    const count = (p: Pool) => out.filter(g => g.pool === p).length;
    const push = (x: number, y: number, z: number, pool: Pool) => out.push({ x, y, z, pool, reveal: rand(), deplete: rand() });
    while (count(0) < 56) {
        const x = -6.2 + rand() * 12.4;
        const z = MEM_Z[0] + 0.4 + rand() * (MEM_Z[1] - MEM_Z[0] - 0.6);
        const y = MEM_Y - 0.62 + rand() * 0.38;
        const nearStub = nearTriad(x, 0.45) && Math.abs(z) < 0.45;
        if (!nearStub) push(x, y, z, 0);
    }
    while (count(1) < 48) {
        const z = (rand() < 0.5 ? -1.8 : 1.45) + (rand() - 0.5) * 0.4;
        const x = -5.6 + rand() * 11.2;
        const y = (rand() - 0.5) * 1.9;
        if (!nearTriad(x, 1.25)) push(x, y, z, 1);
    }
    while (count(2) < 14) {
        const side = count(2) % 2 === 0 ? -1 : 1;
        const x = side * (3.85 + rand() * 0.85);
        const a = rand() * Math.PI * 2;
        const r = 0.15 + rand() * 0.6;
        push(x, r * Math.sin(a), FRONT_Z + r * Math.cos(a), 2);
    }
    return out;
})();

/** Centro do grupo intramiofibrilar perto da tríade da esquerda (âncora do "?"). */
export const INTRA_LEFT: Vec3 = [-4.25, -0.1, FRONT_Z + 0.45];
