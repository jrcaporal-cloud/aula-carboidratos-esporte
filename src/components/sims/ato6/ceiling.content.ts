import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 103 · O Teto de um Grama. Picos de oxidação exógena com ¹³C, só glicose (dossiê 03, bloco C):
 * HULST2009 (48 g/h → 0,60), JENT2005 (72 g/h → 1,06), JENT2004 MSSE (144 g/h → 1,18). Teto e gargalo: JEUK2000.
 * g/h = g/min × 60 (cálculo). 49% e ~73 g/h "no caminho" são cálculo. Atrito com COX2010 (o treino muda o teto).
 */

export interface CeilingRow {
    study: string;
    gh: number;
    /** Pico de oxidação exógena (g/min). */
    ox: number;
}

export const ROWS: readonly CeilingRow[] = [
    { study: 'Hulston 2009', gh: 48, ox: 0.6 },
    { study: 'Jentjens 2005', gh: 72, ox: 1.06 },
    { study: 'Jentjens 2004', gh: 144, ox: 1.18 },
];

export interface CeilingStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    sources: readonly string[];
}

export const STEPS: readonly CeilingStep[] = [
    {
        tab: 'Três ensaios',
        headline: 'O isótopo separa o copo do estoque',
        color: C.glucose,
        text: 'Glicose marcada com ¹³C mostra quanto do CO₂ expirado veio da bebida. Três ECRs cruzados em ciclistas treinados (n = 7–8 cada), 150 min a 60–65% do VO₂máx, só glicose: 48, 72 ou 144 g/h. Barra vazada: o que entra. Barra cheia: o pico de oxidação exógena.',
        sources: ['Hulston 2009 (MSSE)', 'Jentjens 2005 (Br J Nutr)', 'Jentjens 2004 (MSSE)'],
    },
    {
        tab: 'O teto',
        headline: 'Com uma fonte só, para em ~1 g/min',
        color: C.glucoseSoft,
        text: 'De 72 para 144 g/h, a ingestão dobrou e a oxidação subiu só 0,12 g/min. A revisão de Jeukendrup & Jentjens (2000) junta os estudos com isótopo: fonte única satura em ~1,0–1,1 g/min (≈ 60–66 g/h). Frutose, galactose e amilose oxidam 25–50% menos. Na revisão, o treino não mudava o teto; Cox 2010 viu subir com 28 dias de dieta rica em carboidrato.',
        sources: ['Jeukendrup & Jentjens 2000 (Sports Med)', 'Cox 2010 (J Appl Physiol)'],
    },
    {
        tab: 'No caminho',
        headline: 'Metade não vira combustível na hora',
        color: C.risk,
        text: 'A 144 g/h entram 2,4 g/min e se oxidam 1,18: 49% do que entra (cálculo). Os outros ~73 g/h não viram energia naquela hora: ficam pelo caminho, na luz do intestino ou ainda a caminho do sangue. Passar do teto aumenta a carga do intestino, não a energia disponível.',
        sources: [],
    },
    {
        tab: 'O gargalo',
        headline: 'O limite é a porta, não o músculo',
        color: C.glucose,
        text: 'O músculo não é o limite. O gargalo está na absorção: o SGLT1, que usa o gradiente de Na⁺ e é a porta da glicose e da galactose, satura; e o fígado libera glicose a ~1 g/min. Leitura certa: ~1 g/min é teto de oxidação exógena de um tipo de carboidrato, não medida direta do SGLT1. Com uma segunda porta, a oxidação passa do teto.',
        sources: ['Wright 2011 (Physiol Rev, SGLT)'],
    },
];

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: '¹³C: a oxidação exógena é medida, não estimada.', color: C.co2 },
    { at: 1, text: 'Fonte única: teto de ~1,0–1,1 g/min (≈ 60–66 g/h).', color: C.glucose },
    { at: 2, text: 'A 144 g/h, só 49% vira combustível na hora.', color: C.risk },
    { at: 3, text: 'Gargalo: absorção (SGLT1) e fígado, não o músculo.', color: C.glucose },
];
