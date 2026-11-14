import { C } from '../../sims/kit/palette';
import type { Vec3 } from '../shared/modal/types';
import { domePoint, halfTube, sampleOutline, type DomeSpec, type Vec2 } from './geometry';

/*
 * A cabeça em corte sagital (unidades ~cm, fora de escala nas peças pequenas). Eixos: +x = frente
 * (o rosto), +y = alto, o corte no plano z = 0 e a metade que fica em z < 0 (para o lado de fora).
 * Posições das regiões: plausíveis, ajustadas para não se encobrirem no vídeo. Tálamo NÃO entra
 * (dossiê 03, "Limite do mecanismo"): a via NTS → córtex é desenhada simplificada.
 */

export const COLORS = {
    skin: '#D8B4A0',
    headInside: '#0F1726',
    bone: '#B8B2AC',
    tooth: '#F5F5F4',
    brainInside: '#243149',
    brainGlass: '#9FB0C8',
    brainRim: '#94A3B8',
    callosum: '#3B4964',
    cerebellum: '#323D55',
    cerebellumCut: '#3C4861',
    stem: '#3A4760',
    stemCut: '#4B5873',
    tongue: '#B9747A',
    tongueCut: '#9C5A62',
    papilla: '#E8B4AE',
    /** Regiões em repouso: ardósias claras (neutras, sem significado químico). */
    calm: '#7186A6',
    /** Região ou sinal do passo: âmbar = carboidrato (a cor-tema da aula). */
    lit: C.glucose,
    pathDim: '#34425B',
    pathOn: '#D6DEE8',
    pulse: C.glucose,
    hull: '#04080F',
    sensor: C.stone,
    sweet: '#94A3B8',
    sweetB: '#CBD5E1',
    budCell: '#E3B3AD',
    budSurface: '#C98F86',
} as const;

/* ---------- contornos do corte ---------- */

const HEAD_PTS: readonly Vec2[] = [
    [2.6, -10.2], [3.0, -6.4], [5.0, -5.6], [7.4, -5.2], [9.2, -4.4], [9.3, -3.2], [8.95, -2.6], [9.8, -1.75],
    [9.5, -1.15], [9.95, -0.6], [9.5, 0.3], [10.0, 0.9], [11.1, 1.6], [10.0, 3.2], [8.7, 4.6], [9.0, 5.6],
    [8.6, 7.6], [7.6, 9.8], [5.4, 11.5], [2.0, 12.5], [-1.5, 12.7], [-5.0, 11.8], [-7.8, 9.6], [-9.4, 6.6],
    [-9.7, 3.6], [-8.8, 1.2], [-7.0, -0.8], [-5.4, -3.4], [-5.0, -6.5], [-5.0, -10.2],
];
export const HEAD: DomeSpec = { outline: sampleOutline(HEAD_PTS, 180), center: [-0.5, 2.5], depth: 7.2 };

const BRAIN_PTS: readonly Vec2[] = [
    [7.2, 6.4], [6.6, 8.6], [4.8, 10.4], [2.0, 11.5], [-1.0, 11.8], [-4.2, 11.2], [-6.8, 9.6], [-8.4, 7.4],
    [-8.8, 5.2], [-8.0, 3.6], [-6.0, 3.3], [-3.6, 3.0], [-1.8, 2.4], [0.4, 1.6], [2.6, 1.6], [4.0, 2.2],
    [5.4, 2.8], [6.6, 3.8], [7.2, 5.0],
];
export const BRAIN: DomeSpec = { outline: sampleOutline(BRAIN_PTS, 160), center: [-0.6, 6.4], depth: 6.0 };

const CEREB_PTS: readonly Vec2[] = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return [-5.4 + 2.8 * Math.cos(a), 1.4 + 1.85 * Math.sin(a) - 0.25 * Math.cos(a)] as const;
});
export const CEREBELLUM: DomeSpec = { outline: sampleOutline(CEREB_PTS, 72), center: [-5.4, 1.4], depth: 4.0 };

const TONGUE_PTS: readonly Vec2[] = [
    [8.7, -1.75], [8.0, -1.5], [6.6, -1.45], [5.0, -1.42], [3.6, -1.6], [2.6, -2.2], [2.4, -3.2], [3.0, -4.2],
    [5.0, -4.4], [7.0, -3.6], [8.2, -2.6], [8.75, -2.1],
];
export const TONGUE: DomeSpec = { outline: sampleOutline(TONGUE_PTS, 96), center: [5.4, -2.7], depth: 2.2 };

/** Tronco encefálico + medula: meio tubo pelo plano do corte (mesencéfalo dentro do cérebro, ponte, bulbo, medula). */
export const STEM_PTS: readonly Vec2[] = [[-1.2, 3.6], [-0.9, 2.0], [-1.3, 0.2], [-1.7, -1.6], [-1.9, -4.5], [-2.0, -7.5], [-2.0, -9.8]];
export const STEM_R: readonly number[] = [0.95, 1.25, 0.85, 0.66, 0.56, 0.52, 0.3];
/** Contorno da face cortada do tronco (a geometria é criada pela cena e liberada ao fechar). */
export const STEM_OUTLINE: readonly Vec2[] = (() => {
    const t = halfTube(STEM_PTS, STEM_R);
    t.geometry.dispose();
    return t.outline;
})();

/** Palato duro, mandíbula (sínfise) e incisivos no corte. */
export const PALATE: readonly Vec2[] = [[3.4, -0.45], [8.6, -0.45], [9.05, -0.6], [8.95, -0.85], [8.4, -0.78], [3.4, -0.75]];
export const MANDIBLE: readonly Vec2[] = [[7.9, -2.55], [8.7, -2.25], [8.85, -3.0], [8.95, -4.0], [8.35, -4.75], [7.45, -4.65], [7.55, -3.5]];
export const TEETH: readonly Vec2[][] = [
    [[8.75, -0.8], [9.1, -0.75], [9.2, -1.3], [8.95, -1.38]],
    [[8.7, -1.5], [8.98, -1.46], [8.95, -2.15], [8.68, -2.2]],
];

/** O crânio no corte: da sobrancelha à nuca (ângulo em volta do centro da cabeça). */
export const isVault = (i: number): boolean => {
    const [x, y] = HEAD.outline[i];
    const a = Math.atan2(y - HEAD.center[1], x - HEAD.center[0]);
    return a > 0.32 || a < -2.62;
};

/* ---------- regiões ---------- */

export interface Ellipsoid { c: Vec3; r: Vec3; rot?: Vec3 }

export const INSULA: Ellipsoid = { c: [0.6, 3.7, -4.3], r: [1.75, 1.1, 0.45], rot: [-0.25, 0, 0] };
export const OFC: Ellipsoid = { c: [4.9, 3.55, -1.5], r: [1.6, 0.4, 1.25] };
export const STRIATUM: readonly Ellipsoid[] = [
    { c: [2.2, 6.1, -1.6], r: [1.45, 0.8, 0.66], rot: [0, 0, 0.35] },
    { c: [1.6, 5.35, -2.7], r: [1.55, 0.74, 0.6], rot: [0, 0, 0.15] },
];
export const NTS: Ellipsoid = { c: [-1.85, -0.2, 0.0], r: [0.32, 0.32, 0.32] };

/** Corpo caloso e cíngulo anterior: arcos na face medial (o corte). */
export const CALLOSUM: readonly Vec3[] = [[-4.0, 5.6, -0.3], [-2.0, 7.0, -0.3], [0.6, 7.65, -0.3], [2.8, 7.5, -0.3], [4.25, 6.4, -0.3], [4.1, 5.2, -0.3], [3.4, 4.8, -0.3]];
export const ACC: readonly Vec3[] = [[0.6, 8.65, -0.3], [3.0, 8.6, -0.3], [5.0, 7.6, -0.3], [5.7, 5.9, -0.3], [5.2, 4.5, -0.3]];

/** M1: faixa no giro pré-central, do alto da linha média descendo a convexidade (forra a parede por dentro). */
/** Índice do contorno do cérebro, na metade de cima, mais perto de x. */
const topOutlineAt = (x: number): number => BRAIN.outline.reduce((best, [px, py], i) => {
    if (py <= BRAIN.center[1]) return best;
    return best < 0 || Math.abs(px - x) < Math.abs(BRAIN.outline[best][0] - x) ? i : best;
}, -1);
const M1_MID = topOutlineAt(0.0);
export const M1_SPAN: readonly [number, number] = [M1_MID - 7, M1_MID + 7];
export const M1_PHI: readonly [number, number] = [0.04, 1.32];
export const M1_K = 0.975;
const at = (i: number, phi: number, k = M1_K): Vec3 => domePoint(BRAIN, i, phi, k);
export const M1_AT: Vec3 = at(M1_MID, 0.62, 0.95);

/* ---------- vias ---------- */

/** Papila do dorso da língua onde fica o botão gustativo ampliado (e começa o nervo). */
export const PAPILLA: Vec3 = [6.8, -1.36, -0.55];

/** Aferente gustativa (ex.: corda do tímpano), desenhada sobre a face do corte, até o NTS. */
export const AFFERENT: readonly Vec3[] = [
    PAPILLA, [6.2, -2.0, 0.06], [4.4, -3.0, 0.06], [2.0, -2.9, 0.06], [0.2, -1.7, 0.06], [-1.1, -0.65, 0.07], [NTS.c[0], NTS.c[1], 0.07],
];

/** Tronco comum NTS → base do cérebro e os ramos (via simplificada, sem tálamo). */
export const TRUNK: readonly Vec3[] = [[NTS.c[0], NTS.c[1], 0.0], [-1.95, 1.5, -0.35], [-1.5, 3.0, -1.0]];
const T_END = TRUNK[TRUNK.length - 1];
export const BRANCH = {
    ins: [T_END, [-0.9, 3.5, -2.6], [-0.6, 3.7, -3.9]] as readonly Vec3[],
    ofc: [T_END, [0.9, 3.4, -1.7], [3.3, 3.5, -1.5]] as readonly Vec3[],
    str: [T_END, [-0.6, 4.4, -1.8], [0.5, 5.1, -2.3]] as readonly Vec3[],
    acc: [T_END, [1.0, 3.95, -0.7], [3.2, 4.05, -0.4], [4.5, 4.3, -0.3]] as readonly Vec3[],
} as const;
export type Branch = keyof typeof BRANCH;

/** Via motora descendente: M1 → cápsula → face anterior do tronco → medula → "para o músculo". */
export const DESCENT: readonly Vec3[] = [
    at(M1_MID, 0.55, 0.96), [-0.3, 8.0, -2.6], [-0.6, 5.2, -1.8], [-0.5, 3.2, -0.8], [-0.4, 1.8, 0.04], [-0.75, 0.0, 0.04],
    [-1.4, -2.0, 0.04], [-1.65, -5.0, 0.04], [-1.75, -8.6, 0.04], [-1.75, -9.7, 0.04],
];
export const ARROW_TIP: Vec3 = [-1.75, -11.4, 0.04];

/** Onde os autores propõem a integração com o comando motor ("talvez via núcleos do tronco"). */
export const INTEGRATION_AT: Vec3 = [-0.2, 1.0, 0.3];

/* ---------- boca ---------- */

/** Cavidade oral (onde o líquido se mexe) e a saída pelos lábios. */
export const CAVITY = { x: [4.2, 8.7] as const, y: [-1.22, -0.88] as const, z: [-2.3, -0.2] as const };
export const LIPS: Vec3 = [9.7, -1.15, -0.3];

/* ---------- botão gustativo ampliado ---------- */

/** Centro e escala do botão ampliado, fora do rosto (à frente e para o lado da câmera). */
export const BUD = { c: [13.6, 0.6, 2.6] as Vec3, scale: 1.25 } as const;
/** Pontos locais do botão (multiplicar pela escala e somar o centro). */
export const BUD_LOCAL = {
    pore: [0, 1.25, 0] as Vec3,
    sweet: [-0.62, 1.85, 0.1] as Vec3,
    sensor: [0.62, 1.85, 0.1] as Vec3,
    body: [0.75, -0.2, 0.35] as Vec3,
};
export const budWorld = (p: Vec3, lift = 0): Vec3 => [BUD.c[0] + p[0] * BUD.scale, BUD.c[1] + (p[1] + lift) * BUD.scale, BUD.c[2] + p[2] * BUD.scale];
