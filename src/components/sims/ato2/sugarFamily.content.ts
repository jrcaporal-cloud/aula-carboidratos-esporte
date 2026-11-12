import type { SugarKind } from './geometry';

/**
 * Slide 20: as mesmas peças (unidades de açúcar) mudam de arranjo a cada passo.
 * Cada unidade tem um id fixo; o passo diz onde ela está (x, y, escala). Quem não aparece some no lugar.
 * Coordenadas no viewBox 1136 × 340.
 */
export interface Place { x: number; y: number; s: number }
export interface Unit { id: string; kind: SugarKind }
export interface Bond { a: Place; b: Place }
export interface Label { x: number; y: number; text: string; size: number; color?: string; anchor?: 'start' | 'middle' | 'end' }

export interface SugarStep {
    tab: string;
    /** Frase do passo (≤ 35 palavras com o resto da tela). */
    line: string;
    places: Record<string, Place>;
    labels: readonly Label[];
}

const GLC_POOL = 46;
export const UNITS: readonly Unit[] = [
    { id: 'gyg', kind: 'gyg' },
    { id: 'f0', kind: 'fru' },
    { id: 'gal0', kind: 'gal' },
    ...Array.from({ length: GLC_POOL }, (_, i): Unit => ({ id: `g${i}`, kind: 'glc' })),
];

const SP = 44; // passo entre anéis numa cadeia, em escala 1

/** Cadeia reta de `n` glicoses a partir de (x, y), na direção do ângulo `a` (radianos). */
const chain = (ids: readonly string[], x: number, y: number, s: number, a = 0): Record<string, Place> =>
    Object.fromEntries(ids.map((id, i) => [id, { x: x + Math.cos(a) * SP * s * i, y: y + Math.sin(a) * SP * s * i, s }]));

const g = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `g${from + i}`);

/* Amilopectina: cadeia principal + ramos pendurados (α-1,6) e um ramo no ramo. */
const AP_X = 300, AP_Y = 222, AP_S = 0.82, D = SP * AP_S;
const amylopectin = {
    ...chain(g(12, 12), AP_X, AP_Y, AP_S),
    ...chain(g(24, 5), AP_X + D * 1, AP_Y + 50, AP_S),
    ...chain(g(29, 4), AP_X + D * 7, AP_Y + 50, AP_S),
    ...chain(g(33, 4), AP_X + D * 3, AP_Y + 100, AP_S),
};

/* Glicogênio esquemático: 3 cadeias saindo da glicogenina, cada uma com 2 ramos (escala pequena). */
const GX = 568, GY = 188, GS = 0.56;
const glycogenArm = (base: number, a: number) => {
    const main = chain(g(base, 4), GX + Math.cos(a) * 40, GY + Math.sin(a) * 40, GS, a);
    const p1 = main[`g${base + 1}`];
    const p3 = main[`g${base + 3}`];
    return {
        ...main,
        ...chain(g(base + 4, 3), p1.x + Math.cos(a + 1.05) * 26, p1.y + Math.sin(a + 1.05) * 26, GS, a + 1.05),
        ...chain(g(base + 7, 3), p3.x + Math.cos(a - 1.05) * 26, p3.y + Math.sin(a - 1.05) * 26, GS, a - 1.05),
    };
};
const glycogen = {
    gyg: { x: GX, y: GY, s: 0.9 },
    ...glycogenArm(0, -Math.PI / 2),
    ...glycogenArm(10, Math.PI / 6),
    ...glycogenArm(20, (5 * Math.PI) / 6),
};

export const STEPS: readonly SugarStep[] = [
    {
        tab: 'Monossacarídeos',
        line: 'Três açúcares com a mesma fórmula, C₆H₁₂O₆. A frutose fecha um anel de cinco; glicose e galactose, de seis.',
        places: { g0: { x: 268, y: 140, s: 2.6 }, f0: { x: 568, y: 140, s: 2.6 }, gal0: { x: 868, y: 140, s: 2.6 } },
        labels: [
            { x: 268, y: 262, text: 'glicose', size: 28 },
            { x: 568, y: 262, text: 'frutose', size: 28 },
            { x: 868, y: 262, text: 'galactose', size: 28 },
        ],
    },
    {
        tab: 'Dissacarídeos',
        line: 'Duas peças viram um dissacarídeo. A glicose está nos três: o açúcar de mesa, o do leite e o do malte.',
        places: {
            g0: { x: 228, y: 140, s: 1.7 }, f0: { x: 308, y: 140, s: 1.7 },
            g1: { x: 528, y: 140, s: 1.7 }, gal0: { x: 608, y: 140, s: 1.7 },
            g2: { x: 828, y: 140, s: 1.7 }, g3: { x: 908, y: 140, s: 1.7 },
        },
        labels: [
            { x: 268, y: 236, text: 'sacarose', size: 28 },
            { x: 268, y: 266, text: 'glicose + frutose', size: 18, color: '#D1D5DB' },
            { x: 568, y: 236, text: 'lactose', size: 28 },
            { x: 568, y: 266, text: 'glicose + galactose', size: 18, color: '#D1D5DB' },
            { x: 868, y: 236, text: 'maltose', size: 28 },
            { x: 868, y: 266, text: 'glicose + glicose', size: 18, color: '#D1D5DB' },
        ],
    },
    {
        tab: 'Cadeias',
        line: 'Só glicose, em fila (ligação α-1,4). A maltodextrina é uma fila curta; a amilose do amido, uma fila longa e reta.',
        places: { ...chain(g(0, 6), 120, 92, 1), ...chain(g(6, 20), 120, 236, 1) },
        labels: [
            { x: 120, y: 48, text: 'maltodextrina · fila curta', size: 22, anchor: 'start' },
            { x: 120, y: 192, text: 'amilose · fila longa e reta', size: 22, anchor: 'start' },
        ],
    },
    {
        tab: 'Ramos',
        line: 'A amilopectina, a outra forma do amido, ganha ramos (α-1,6). No exercício, a amilose é oxidada 25–50% menos que a amilopectina.',
        places: { ...chain(g(0, 12), AP_X, 70, AP_S), ...amylopectin },
        labels: [
            { x: AP_X - 34, y: 76, text: 'amilose', size: 22, anchor: 'end' },
            { x: AP_X - 34, y: 228, text: 'amilopectina', size: 22, anchor: 'end' },
            { x: AP_X + D * 1 + 30, y: AP_Y + 30, text: 'α-1,6', size: 18, color: '#FCD34D', anchor: 'start' },
        ],
    },
    {
        tab: 'Glicogênio',
        line: 'O animal guarda a mesma glicose em ramos em volta de uma proteína, a glicogenina: o glicogênio. A forma muda a velocidade.',
        places: glycogen,
        labels: [{ x: GX - 28, y: GY - 22, text: 'glicogenina', size: 18, color: '#FDBA74', anchor: 'end' }],
    },
];

/** Ligações desenhadas em cada passo (entre centros de peças vizinhas). */
const link = (p: Record<string, Place>, pairs: readonly (readonly [string, string])[]): Bond[] =>
    pairs.filter(([a, b]) => p[a] && p[b]).map(([a, b]) => ({ a: p[a], b: p[b] }));

const run = (ids: readonly string[]): [string, string][] => ids.slice(1).map((id, i) => [ids[i], id]);

const glycogenBonds = (base: number): [string, string][] => [
    ['gyg', `g${base}`], ...run(g(base, 4)),
    [`g${base + 1}`, `g${base + 4}`], ...run(g(base + 4, 3)),
    [`g${base + 3}`, `g${base + 7}`], ...run(g(base + 7, 3)),
];

export const BONDS: readonly Bond[][] = [
    [],
    link(STEPS[1].places, [['g0', 'f0'], ['g1', 'gal0'], ['g2', 'g3']]),
    link(STEPS[2].places, [...run(g(0, 6)), ...run(g(6, 20))]),
    link(STEPS[3].places, [
        ...run(g(0, 12)), ...run(g(12, 12)), ...run(g(24, 5)), ...run(g(29, 4)), ...run(g(33, 4)),
        ['g13', 'g24'], ['g19', 'g29'], ['g26', 'g33'],
    ]),
    link(STEPS[4].places, [...glycogenBonds(0), ...glycogenBonds(10), ...glycogenBonds(20)]),
];

/** Onde uma peça escondida fica: no lugar do passo visível mais próximo (some e reaparece sem atravessar a tela). */
export const restingPlace = (id: string, step: number): Place => {
    for (let d = 1; d < STEPS.length; d++) {
        const later = STEPS[step + d]?.places[id];
        if (later) return later;
        const earlier = STEPS[step - d]?.places[id];
        if (earlier) return earlier;
    }
    return { x: 568, y: 170, s: 1 };
};

export const SOURCE = 'Jeukendrup & Jentjens, Sports Med 2000 · Roach et al., Biochem J 2012 · Chi et al., Front Nutr 2022';
