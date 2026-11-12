/**
 * Slide 145 · Projeto Supernova 1 (dossiê 05·BURKE2017) + o preço do O₂ do Ato III (01·SCOTT2012).
 * Melhora na prova de 10 km de marcha, % com IC90%. Sinal positivo = mais rápido.
 */

export const SUPERNOVA_BEATS = [
    'Canberra, 2015–2016: marchadores de elite, toda a comida fornecida.',
    'No grupo LCHF, a gordura queimou como nunca.',
    'Na prova de 10 km, dois grupos melhoraram. O LCHF, não.',
    'Por quê? Gordura entrega menos energia por litro de O₂.',
    'Antes de concluir, o desenho.',
] as const;

export interface Lane {
    id: 'hcho' | 'pcho' | 'lchf';
    name: string;
    diet: string;
    n: number;
    gain: number;
    lo: number;
    hi: number;
}

export const LANES: readonly Lane[] = [
    { id: 'hcho', name: 'HCHO', diet: '8,6 g/kg/d de CHO', n: 9, gain: 6.6, lo: 4.1, hi: 9.1 },
    { id: 'pcho', name: 'PCHO', diet: 'mesmo CHO, periodizado', n: 10, gain: 5.3, lo: 3.4, hi: 7.2 },
    { id: 'lchf', name: 'LCHF', diet: '< 50 g/d de CHO · 78% gordura', n: 10, gain: -1.6, lo: -8.5, hi: 5.3 },
];

/** Domínio do eixo (% de melhora). */
export const DOMAIN: readonly [number, number] = [-9, 10];

export const FAT_PEAK = '1,57 g/min';

/** Energia por litro de O₂ (Ato III, "O Preço do Oxigênio"). */
export const O2 = { cho: 21.1, fat: 19.6 } as const;

export const SUPERNOVA_SOURCES = {
    burke: 'Burke LM et al. J Physiol 2017;595(9):2785-2807.',
    o2: 'Burke 2017; Scott CB. ScientificWorldJournal 2012 (21,1 × 19,6 kJ/L de O₂).',
} as const;
