import { C } from '../kit/palette';
import type { LedgerRow } from './MedirShell';

/**
 * Slide 181 · A Diretriz Brasileira Parou em 2009. SBME2009 (texto completo, SciELO), JEUKENDRUP-JENTJENS2000,
 * JENTJENS2004 (dossiê 01: 1,8 g/min ingeridos; 1,26 × 0,83 g/min), BURKE2011, BURKE2001 — dossiê 07.
 * g/min → g/h (× 60) e 60% de 2.000/4.000 kcal (4 kcal/g; 70 kg) são cálculo próprio.
 */

export interface SbmeStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const SBME = 'SBME 2009 (Rev Bras Med Esporte)';

export const STEPS: readonly SbmeStep[] = [
    {
        tab: 'O texto de 2009',
        headline: 'A diretriz que segue em vigor',
        text: 'A SBME pede 60–70% da energia, 5–8 g/kg/d para recuperar e 30–60 g/h durante. E fecha a porta: “Mesmo com uso combinado de diversos carboidratos, sua ingestão não deve exceder 80g/hora.” Não há atualização posterior.',
        sources: [SBME],
    },
    {
        tab: '2000 e 2004',
        headline: 'O teto de uma fonte já tinha caído',
        text: 'Com uma fonte só, a oxidação para em ~1,0–1,1 g/min (revisão de 2000). Em 2004, 8 ciclistas beberam 1,8 g/min (≈ 108 g/h): glicose + frutose oxidaram 1,26 g/min; a mesma dose só de glicose, 0,83. Cinco anos antes da diretriz.',
        sources: [SBME, 'Jeukendrup & Jentjens 2000', 'Jentjens 2004'],
    },
    {
        tab: '2011: o COI',
        headline: '2011: g/kg e até 90 g/h',
        text: 'O consenso do COI (Burke 2011) troca a % por g/kg ligado à carga de treino e aceita até 90 g/h acima de 2,5 h, com transportadores diferentes. A barra de 2011 atravessa o teto publicado dois anos antes.',
        sources: [SBME, 'Jeukendrup & Jentjens 2000', 'Jentjens 2004', 'Burke 2011'],
    },
    {
        tab: 'Por que % engana',
        headline: 'Os mesmos 60%, o dobro de carboidrato',
        text: '60% de 2.000 kcal são 300 g; de 4.000 kcal, 600 g: 4,3 ou 8,6 g/kg no mesmo atleta de 70 kg. Na restrição energética, os 60% encolhem junto. Burke já pedia, em 2001, para abandonar a % da energia.',
        sources: [SBME, 'Jeukendrup & Jentjens 2000', 'Jentjens 2004', 'Burke 2011', 'Burke 2001', '% → g: cálculo (4 kcal/g)'],
    },
];

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, term: '60–70%', text: 'da energia, segundo a SBME', color: C.stone },
    { at: 0, term: '≤ 80 g/h', text: 'teto, “mesmo com uso combinado”', color: C.stone },
    { at: 1, term: '1,26 g/min', text: 'com mistura em 2004 (0,83 só glicose)', color: C.fructose },
    { at: 2, term: '90 g/h', text: 'aceito pelo COI em 2011 (> 2,5 h)', color: C.ok },
    { at: 3, term: '4,3 × 8,6', text: 'g/kg/d: os mesmos 60%, dois dias', color: C.glucose },
];

/** Escala do gráfico (g/h) e janela de anos. */
export const GH_MAX = 120;
/** Posição de cada ano no eixo (0 → 1): categórica, para os rótulos de 2009 e 2011 não colarem. */
export const YEAR_X: Readonly<Record<number, number>> = { 2000: 0.1, 2004: 0.34, 2009: 0.56, 2011: 0.72 };

export interface Bar {
    id: string;
    year: number;
    /** Deslocamento horizontal (px) a partir do ano. */
    dx: number;
    lo: number;
    hi: number;
    color: string;
    /** 'fill' = oxidado ou recomendado; 'outline' = ingerido. */
    kind: 'fill' | 'outline';
    label: string;
    at: number;
}

export const BARS: readonly Bar[] = [
    { id: 'ox2000', year: 2000, dx: 0, lo: 0, hi: 63, color: C.co2, kind: 'fill', label: '~1,0–1,1 g/min', at: 1 },
    { id: 'in2004', year: 2004, dx: 0, lo: 0, hi: 108, color: C.caveat, kind: 'outline', label: 'bebido: 1,8 g/min', at: 1 },
    { id: 'glc2004', year: 2004, dx: -21, lo: 0, hi: 50, color: C.glucose, kind: 'fill', label: '0,83', at: 1 },
    { id: 'mix2004', year: 2004, dx: 21, lo: 0, hi: 76, color: C.fructose, kind: 'fill', label: '1,26', at: 1 },
    { id: 'sbme', year: 2009, dx: 0, lo: 30, hi: 60, color: C.stone, kind: 'fill', label: '30–60', at: 0 },
    { id: 'coi', year: 2011, dx: 0, lo: 0, hi: 90, color: C.ok, kind: 'fill', label: 'até 90', at: 2 },
];

export const TICKS = [
    { year: 2000, top: '2000', sub: 'uma fonte', at: 1 },
    { year: 2004, top: '2004', sub: 'glicose + frutose', at: 1 },
    { year: 2009, top: '2009', sub: 'SBME', at: 0 },
    { year: 2011, top: '2011', sub: 'consenso COI', at: 2 },
] as const;

/** Os mesmos 60% em dois dias (atleta de 70 kg). */
export const PERCENT_ROWS = [
    { kcal: '2.000 kcal', grams: '300 g', gkg: 4.3, color: C.glucoseSoft },
    { kcal: '4.000 kcal', grams: '600 g', gkg: 8.6, color: C.glucose },
] as const;
