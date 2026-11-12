import { sample, type Pt } from '../kit/useMorphPath';

/**
 * Slide 29 · Índice Glicêmico. Curvas DIDÁTICAS (forma inventada, rotulada como ilustrativa) cuja área
 * sob a curva bate com o IG médio por grupo de alimento de Jenkins 1981 (cereais matinais 65, leguminosas secas 31).
 * Curva incremental: g(t) = A · (t/τ) · e^(1 − t/τ), de 0 a 120 min.
 */
export const W = 700, H = 340;
const X0 = 80, X1 = 670, BASE = 280, AMP = 200, N = 49;

const shape = (tau: number) => (t: number) => (t / tau) * Math.exp(1 - t / tau);
const auc = (f: (t: number) => number) => {
    let s = 0;
    for (let t = 0; t <= 120; t += 1) s += f(t);
    return s;
};
const REF = auc(shape(32));

const mapPt = (t: number, v: number): Pt => [X0 + ((X1 - X0) * t) / 120, BASE - AMP * v];

/** Curva com área = `gi`% da área da glicose. Devolve a linha e a área fechada (mesmo número de pontos). */
const curve = (gi: number, tau: number) => {
    const f = shape(tau);
    const a = ((gi / 100) * REF) / auc(f);
    const line = sample(N, 0, 120, t => a * f(t), mapPt);
    const area: Pt[] = [[X0, BASE], ...line, [X1, BASE]];
    return { line, area };
};

export interface Food { name: string; gi: number; color: string; line: Pt[]; area: Pt[] }

export const FOODS: readonly Food[] = [
    { name: 'glicose (referência)', gi: 100, color: '#F59E0B', ...curve(100, 32) },
    { name: 'cereal matinal', gi: 65, color: '#F59E0B', ...curve(65, 38) },
    { name: 'leguminosa seca', gi: 31, color: '#F59E0B', ...curve(31, 52) },
];

export const AXIS = { X0, X1, BASE, ticks: [0, 30, 60, 90, 120].map(t => ({ t, x: X0 + ((X1 - X0) * t) / 120 })) };

/** Carga glicêmica = IG × gramas de carboidrato da porção ÷ 100 (cálculo pela definição). */
export const LOADS = [
    { label: 'porção com 20 g de CHO', grams: 20 },
    { label: 'porção com 60 g de CHO', grams: 60 },
].map(p => ({ ...p, load: Math.round((65 * p.grams) / 100) }));
