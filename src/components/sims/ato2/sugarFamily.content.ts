import type { SugarKind } from './geometry';

/**
 * Slide 20 · Da Glicose ao Amido. As mesmas peças (unidades de açúcar) mudam de arranjo a cada passo;
 * o painel guarda uma ficha que acumula (forma · do que é feita · oxidação no exercício).
 * Coordenadas no viewBox do palco (STAGE_W × STAGE_H). Oxidação: Jeukendrup & Jentjens 2000 (revisão).
 */
export const STAGE_W = 640;
export const STAGE_H = 444;

export interface Place { x: number; y: number; s: number }
export interface Unit { id: string; kind: SugarKind }
export interface Bond { a: Place; b: Place }
export interface Label { x: number; y: number; text: string; size: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number }

export interface SugarStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    sources: readonly string[];
    places: Record<string, Place>;
    labels: readonly Label[];
    /** Qual lupa química aparece no palco (ligação α-1,4 ou α-1,6). */
    inset?: '14' | '16';
}

const GLC_POOL = 66;
export const UNITS: readonly Unit[] = [
    { id: 'gyg', kind: 'gyg' },
    { id: 'f0', kind: 'fru' },
    { id: 'gal0', kind: 'gal' },
    ...Array.from({ length: GLC_POOL }, (_, i): Unit => ({ id: `g${i}`, kind: 'glc' })),
];

const SP = 54; // passo entre anéis numa cadeia, em escala 1 (anel de 41,6 px + traço da ligação)

/** Cadeia reta de glicoses a partir de (x, y), na direção do ângulo `a` (radianos). */
const chain = (ids: readonly string[], x: number, y: number, s: number, a = 0): Record<string, Place> =>
    Object.fromEntries(ids.map((id, i) => [id, { x: x + Math.cos(a) * SP * s * i, y: y + Math.sin(a) * SP * s * i, s }]));

const g = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `g${from + i}`);

/* Passo 4 · amilopectina: cadeia principal + ramos pendurados (α-1,6) e um ramo no ramo. */
const AP = { x: 140, y: 214, s: 0.5 };
const AD = SP * AP.s;
const amylopectin4 = {
    ...chain(g(12, 12), AP.x, AP.y, AP.s),
    ...chain(g(24, 5), AP.x + AD, AP.y + 38, AP.s),
    ...chain(g(29, 4), AP.x + AD * 7, AP.y + 38, AP.s),
    ...chain(g(33, 4), AP.x + AD * 3, AP.y + 76, AP.s),
};

/* Passo 5 · os três polímeros lado a lado (escala menor). */
const FS = 0.42;
const FD = SP * FS;
const AMY5 = { x: 40, y: 92 };
const APC5 = { x: 40, y: 222 };
const amylopectin5 = {
    ...chain(g(12, 10), APC5.x, APC5.y, FS),
    ...chain(g(24, 4), APC5.x + FD, APC5.y + 32, FS),
    ...chain(g(29, 3), APC5.x + FD * 5, APC5.y + 32, FS),
    ...chain(g(33, 3), APC5.x + FD * 2, APC5.y + 64, FS),
};

/* Glicogênio esquemático: 3 cadeias saindo da glicogenina, cada uma com 2 ramos. */
export const GLY = { x: 478, y: 236, s: 0.42 };
const glycogenArm = (base: number, a: number) => {
    const main = chain(g(base, 4), GLY.x + Math.cos(a) * 36, GLY.y + Math.sin(a) * 36, GLY.s, a);
    const p1 = main[`g${base + 1}`];
    const p3 = main[`g${base + 3}`];
    return {
        ...main,
        ...chain(g(base + 4, 3), p1.x + Math.cos(a + 1.05) * 24, p1.y + Math.sin(a + 1.05) * 24, GLY.s, a + 1.05),
        ...chain(g(base + 7, 3), p3.x + Math.cos(a - 1.05) * 24, p3.y + Math.sin(a - 1.05) * 24, GLY.s, a - 1.05),
    };
};
const glycogen5 = {
    gyg: { x: GLY.x, y: GLY.y, s: 0.75 },
    ...glycogenArm(36, -Math.PI / 2),
    ...glycogenArm(46, Math.PI / 6),
    ...glycogenArm(56, (5 * Math.PI) / 6),
};

const SOFT = '#D1D5DB';
const JEUK = 'Jeukendrup & Jentjens 2000 (revisão)';

export const STEPS: readonly SugarStep[] = [
    {
        tab: 'Monossacarídeos',
        headline: 'Mesma fórmula, outro arranjo',
        color: '#F59E0B',
        text: 'Glicose, frutose e galactose são C₆H₁₂O₆. Glicose e galactose fecham um anel de seis; a frutose, de cinco. Os átomos são os mesmos; o anel e o caminho no corpo, não. Na revisão de Jeukendrup, frutose e galactose são oxidadas 25–50% menos que a glicose no exercício.',
        sources: ['Tappy & Lê 2010 (revisão)', JEUK],
        places: { g0: { x: 110, y: 150, s: 2.4 }, f0: { x: 320, y: 150, s: 2.4 }, gal0: { x: 530, y: 150, s: 2.4 } },
        labels: [
            { x: 110, y: 262, text: 'glicose', size: 26 },
            { x: 320, y: 262, text: 'frutose', size: 26 },
            { x: 530, y: 262, text: 'galactose', size: 26 },
            ...[110, 320, 530].map(x => ({ x, y: 296, text: 'C₆H₁₂O₆', size: 20, color: '#FCD34D' })),
            { x: 110, y: 326, text: 'anel de 6', size: 17, color: SOFT },
            { x: 320, y: 326, text: 'anel de 5', size: 17, color: SOFT },
            { x: 530, y: 326, text: 'anel de 6', size: 17, color: SOFT },
            { x: 320, y: 410, text: 'o furo marca a galactose (não é química: é para não depender da cor)', size: 16, color: SOFT },
        ],
    },
    {
        tab: 'Dissacarídeos',
        headline: 'Duas peças, um dissacarídeo',
        color: '#FCD34D',
        text: 'Sacarose (açúcar de mesa), lactose (leite) e maltose (malte). A glicose está nos três. Sacarose e maltose entram no grupo de oxidação alta; a lactose não foi avaliada nessa revisão.',
        sources: [JEUK],
        places: {
            g0: { x: 80, y: 140, s: 1.3 }, f0: { x: 140, y: 140, s: 1.3 },
            g1: { x: 290, y: 140, s: 1.3 }, gal0: { x: 350, y: 140, s: 1.3 },
            g2: { x: 500, y: 140, s: 1.3 }, g3: { x: 560, y: 140, s: 1.3 },
        },
        labels: [
            { x: 110, y: 216, text: 'sacarose', size: 24 },
            { x: 110, y: 244, text: 'glicose + frutose', size: 17, color: SOFT },
            { x: 320, y: 216, text: 'lactose', size: 24 },
            { x: 320, y: 244, text: 'glicose + galactose', size: 17, color: SOFT },
            { x: 530, y: 216, text: 'maltose', size: 24 },
            { x: 530, y: 244, text: 'glicose + glicose', size: 17, color: SOFT },
        ],
    },
    {
        tab: 'Cadeias',
        headline: 'Só glicose, em fila: α-1,4',
        color: '#F59E0B',
        text: 'A ligação α-1,4 prende o carbono 1 de uma glicose ao carbono 4 da seguinte. A maltodextrina é uma fila curta; a amilose do amido, uma fila longa e reta. A amilase corta a amilose em maltose.',
        sources: ['Roach 2012 (revisão)', 'Chi 2022 (revisão)'],
        places: { ...chain(g(0, 6), 40, 118, 0.5), ...chain(g(6, 21), 40, 300, 0.5) },
        labels: [
            { x: 40, y: 82, text: 'maltodextrina · fila curta', size: 20, anchor: 'start' },
            { x: 40, y: 264, text: 'amilose · fila longa e reta', size: 20, anchor: 'start' },
            { x: 40, y: 352, text: 'cada traço = uma ligação α-1,4', size: 17, color: SOFT, anchor: 'start' },
        ],
        inset: '14',
    },
    {
        tab: 'Ramos',
        headline: 'Um ramo muda a velocidade',
        color: '#C4B5FD',
        text: 'A amilopectina, a outra forma do amido, ganha ramos pela ligação α-1,6 (C1 → C6). A amilase solta dela dextrinas ramificadas. No exercício, a amilose oxida 25–⁠50% menos.',
        sources: [JEUK, 'Chi 2022 (revisão)'],
        places: { ...chain(g(0, 12), 140, 76, 0.5), ...amylopectin4 },
        labels: [
            { x: 124, y: 82, text: 'amilose', size: 20, anchor: 'end' },
            { x: 124, y: 220, text: 'amilopectina', size: 20, anchor: 'end' },
            { x: 150, y: 252, text: 'α-1,6', size: 17, color: '#C4B5FD', anchor: 'end', weight: 800 },
        ],
        inset: '16',
    },
    {
        tab: 'Glicogênio',
        headline: 'O animal guarda em árvore',
        color: '#C4B5FD',
        text: 'O glicogênio é a mesma glicose, em ramos α-1,6 a cada ~12 resíduos em volta de uma proteína, a glicogenina. Mesmas peças; a arquitetura decide a velocidade.',
        sources: ['Roach 2012 (revisão)'],
        places: { ...chain(g(0, 10), AMY5.x, AMY5.y, FS), ...amylopectin5, ...glycogen5 },
        labels: [
            { x: 40, y: 60, text: 'amilose (amido)', size: 18, anchor: 'start' },
            { x: 40, y: 124, text: 'fila reta · α-1,4', size: 16, color: SOFT, anchor: 'start' },
            { x: 40, y: 190, text: 'amilopectina (amido)', size: 18, anchor: 'start' },
            { x: 40, y: 330, text: 'ramos · α-1,4 + α-1,6', size: 16, color: SOFT, anchor: 'start' },
            { x: GLY.x, y: 60, text: 'glicogênio (animal)', size: 18 },
            { x: GLY.x, y: 410, text: 'ramo a cada ~12 glicoses', size: 16, color: SOFT },
            { x: GLY.x, y: 434, text: 'no centro: glicogenina (proteína)', size: 16, color: '#FDBA74' },
            { x: 40, y: 392, text: 'no exercício, a amilose oxida', size: 17, color: '#E5E7EB', anchor: 'start' },
            { x: 40, y: 416, text: '25–50% menos que a amilopectina', size: 17, color: '#E5E7EB', anchor: 'start' },
        ],
    },
];

/** Ligações desenhadas em cada passo (entre centros de peças vizinhas). */
const link = (p: Record<string, Place>, pairs: readonly (readonly [string, string])[]): Bond[] =>
    pairs.filter(([a, b]) => p[a] && p[b]).map(([a, b]) => ({ a: p[a], b: p[b] }));

const run = (ids: readonly string[]): [string, string][] => ids.slice(1).map((id, i) => [ids[i], id]);

/** Ligações α-1,6 (desenhadas em âmbar, as outras em branco). */
export interface StepBonds { a14: Bond[]; a16: Bond[] }

export const BONDS: readonly StepBonds[] = [
    { a14: [], a16: [] },
    { a14: link(STEPS[1].places, [['g0', 'f0'], ['g1', 'gal0'], ['g2', 'g3']]), a16: [] },
    { a14: link(STEPS[2].places, [...run(g(0, 6)), ...run(g(6, 21))]), a16: [] },
    {
        a14: link(STEPS[3].places, [...run(g(0, 12)), ...run(g(12, 12)), ...run(g(24, 5)), ...run(g(29, 4)), ...run(g(33, 4))]),
        a16: link(STEPS[3].places, [['g13', 'g24'], ['g19', 'g29'], ['g26', 'g33']]),
    },
    {
        a14: link(STEPS[4].places, [...run(g(0, 10)), ...run(g(12, 10)), ...run(g(24, 4)), ...run(g(29, 3)), ...run(g(33, 3)),
            ...[36, 46, 56].flatMap(b => [['gyg', `g${b}`] as [string, string], ...run(g(b, 4)), ...run(g(b + 4, 3)), ...run(g(b + 7, 3))])]),
        a16: link(STEPS[4].places, [['g13', 'g24'], ['g17', 'g29'], ['g26', 'g33'],
            ...[36, 46, 56].flatMap((b): [string, string][] => [[`g${b + 1}`, `g${b + 4}`], [`g${b + 3}`, `g${b + 7}`]])]),
    },
];

/** Onde uma peça escondida fica: no lugar do passo visível mais próximo (some e reaparece sem atravessar a tela). */
export const restingPlace = (id: string, step: number): Place => {
    for (let d = 1; d < STEPS.length; d++) {
        const later = STEPS[step + d]?.places[id];
        if (later) return later;
        const earlier = STEPS[step - d]?.places[id];
        if (earlier) return earlier;
    }
    return { x: STAGE_W / 2, y: STAGE_H / 2, s: 1 };
};

/** Ficha que acumula no painel: cada linha entra num passo e fica. */
export type Oxidation = 'alta' | 'menor' | 'nd' | 'estoque';
export interface FichaRow { at: number; name: string; what: string; ox: Oxidation }

export const FICHA: readonly FichaRow[] = [
    { at: 0, name: 'glicose', what: 'monossacarídeo', ox: 'alta' },
    { at: 0, name: 'frutose', what: 'monossacarídeo', ox: 'menor' },
    { at: 0, name: 'galactose', what: 'monossacarídeo', ox: 'menor' },
    { at: 1, name: 'sacarose', what: 'glicose + frutose', ox: 'alta' },
    { at: 1, name: 'maltose', what: 'glicose + glicose', ox: 'alta' },
    { at: 1, name: 'lactose', what: 'glicose + galactose', ox: 'nd' },
    { at: 2, name: 'maltodextrina', what: 'fila curta · α-1,4', ox: 'alta' },
    { at: 2, name: 'amilose', what: 'fila longa · α-1,4', ox: 'menor' },
    { at: 3, name: 'amilopectina', what: 'ramos · α-1,6', ox: 'alta' },
    { at: 4, name: 'glicogênio', what: 'ramos + glicogenina', ox: 'estoque' },
];
