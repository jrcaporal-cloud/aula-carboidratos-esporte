/**
 * Slide 170 · O Preço no Sorriso — NEEDLEMAN2013, GALLAGHER2018 e GALLAGHER2019 (dossiê 06, confirmados no abstract).
 */
import { C } from '../kit/palette';
import type { LedgerItem } from './FrameB';

export const TEETH = 20;
export const EROSION_PCT = 45; // Londres 2012
export const ERODED = Math.round((TEETH * EROSION_PCT) / 100); // 9 de 20 (1 dente = 5% dos atletas)

export interface PctBar { label: string; value: number; color: string }

/** Needleman 2013: prevalências na clínica da Vila Olímpica (278 atletas com dados). */
export const NEEDLEMAN: readonly PctBar[] = [
    { label: 'gengivite', value: 76, color: C.co2 },
    { label: 'cárie', value: 55, color: C.co2 },
    { label: 'erosão', value: EROSION_PCT, color: C.risk },
    { label: 'periodontite', value: 15, color: C.co2 },
];

/** Gallagher 2019: comportamento relatado (352 atletas). */
export const HABITS: readonly PctBar[] = [
    { label: 'escovam 2×/dia', value: 94, color: C.ok },
    { label: 'bebida esportiva', value: 80, color: C.glucose },
];

/** Gallagher 2018: razão de chances de erosão, coletivo × endurance. */
export const ODDS = { or: 2.0, lo: 1.3, hi: 3.1 } as const;

export interface DentalStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    source: string;
}

export const STEPS: readonly DentalStep[] = [
    {
        tab: 'Londres 2012',
        headline: 'Quase metade dos olímpicos com erosão',
        text: 'Needleman 2013, transversal na clínica odontológica da Vila Olímpica de Londres 2012: 302 atletas de 25 esportes, 278 com dados. Erosão dentária em 45%, cárie em 55%, gengivite em 76%; 18% relataram impacto no treino ou no desempenho. Limite: só quem procurou a clínica, e o desenho não prova que a bebida cause a erosão.',
        design: 'transversal · 278 atletas · quem procurou a clínica',
        source: 'Needleman 2013 (Br J Sports Med)',
    },
    {
        tab: 'O hábito',
        headline: 'Escova, mas bebe CHO ácido o treino inteiro',
        text: 'Gallagher 2019, 352 atletas britânicos de elite e profissionais: 94% escovam os dentes duas vezes ao dia, e 80% usam bebida esportiva em treino ou prova. Escovar não compensa a exposição: a bebida com CHO é ácida e chega em goles repetidos, por horas.',
        design: 'transversal · 352 atletas britânicos',
        source: 'Gallagher 2019 (Br Dent J)',
    },
    {
        tab: 'Coletivo',
        headline: 'No coletivo, o dobro da chance',
        text: 'Gallagher 2018, os mesmos 352 atletas de 11 esportes, examinador único calibrado: erosão em 41,4%, com chance 2,0 vezes maior em esporte coletivo que em endurance (IC 95% 1,3–3,1); 32% relataram impacto no desempenho. Prescrever CHO frequente inclui orientar a boca.',
        design: 'transversal · examinador calibrado',
        source: 'Gallagher 2018 (Community Dent Oral Epidemiol)',
    },
];

export const LEDGER: readonly LedgerItem[] = [
    { at: 0, label: 'erosão dentária, Londres 2012', value: '45%', color: C.risk },
    { at: 1, label: 'usam bebida esportiva', value: '80%', color: C.glucoseSoft },
    { at: 1, label: 'escovam 2 vezes ao dia', value: '94%', color: C.ok },
    { at: 2, label: 'erosão, coletivo × endurance', value: '2,0×', color: C.risk },
];

/** Fecho prático (notas do slide): o que entra na orientação de quem prescreve CHO frequente. */
export const PRACTICE = 'água depois do gole · flúor · saúde bucal na anamnese';
