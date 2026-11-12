import { C } from '../kit/palette';
import type { LedgerRow } from './SnShell';

/**
 * Slide 145 · Projeto Supernova 1 (dossiê 05·BURKE2017, BURKE2015/BURKEKIENS2006, BURKE2021rev)
 * + o preço do O₂ do Ato III (01·SCOTT2012). Melhora na prova de 10 km, % com IC90%. Positivo = mais rápido.
 * % da energia das dietas: cálculo nosso a partir dos g/kg/d do artigo (HCHO 8,6 · 2,1 · 1,2; LCHF 78% gordura,
 * proteína 2,1 g/kg/d, dietas isoenergéticas; o CHO do LCHF é o resto).
 */

export interface SnStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

const BURKE = 'Burke 2017, J Physiol';

export const SUPERNOVA_STEPS: readonly SnStep[] = [
    {
        tab: 'O campo',
        headline: 'Burke reabre o caso que ela fechou',
        text: 'Em 2006, Burke e Kiens chamaram a adaptação à gordura de "prego no caixão". Depois do boom cetogênico na mídia leiga, ela admitiu em 2015 que faltavam dados e foi buscá-los: campos no AIS em nov/2015 e jan/2016, 3 semanas de treino intensificado, comida preparada por chef e nutricionistas.',
        sources: [BURKE, 'Burke 2015, Sports Med'],
    },
    {
        tab: 'A chama',
        headline: 'A gordura queimou como nunca',
        text: 'Em 3 semanas com menos de 50 g/d de CHO, o grupo LCHF chegou a 1,57 ± 0,32 g/min de gordura oxidada em 2 h de marcha a ~80% do VO₂pico. A adaptação metabólica é real e grande. A pergunta é outra: o marchador ficou mais rápido?',
        sources: [BURKE],
    },
    {
        tab: 'O preço do O₂',
        headline: 'Mais oxigênio pelo mesmo passo',
        text: '1 litro de O₂ rende 21,1 kJ com carboidrato e 19,6 kJ com gordura: ~7,7% a menos (cálculo). O VO₂pico subiu nos três grupos (IC90% +2,55 a +5,20%): o motor cresceu em todos. Mas, no ritmo de prova, o LCHF pagou mais O₂ pela mesma velocidade: perdeu economia.',
        sources: [BURKE, 'Scott 2012 (kJ/L de O₂)'],
    },
    {
        tab: 'A prova',
        headline: 'No 10 km, o LCHF não melhorou',
        text: 'Prova oficial de 10 km, antes e depois das 3 semanas. HCHO +6,6% e PCHO +5,3%: o treino intensificado rendeu. LCHF −1,6%: a gordura a mais não virou velocidade e anulou o ganho do treino. Mesmo treino, mesma comida fornecida; só o combustível mudou.',
        sources: [BURKE],
    },
    {
        tab: 'O desenho',
        headline: 'Antes de concluir, o desenho',
        text: 'A favor: elite mundial, comida 100% fornecida, prova oficial, treino supervisionado. Contra: alocação em parte por escolha do atleta, cegamento impossível numa dieta, ~10 por grupo e IC90% do LCHF largo, cruzando o zero. Um estudo assim pede réplica, e o grupo a fez.',
        sources: [BURKE],
    },
];

/** Selo de cálculo por passo (as barras de % da energia ficam do passo 1 ao fim). */
export const SUPERNOVA_CALC = (step: number) => (step >= 2 ? 'cálculo: % da energia, 7,7%' : 'cálculo: % da energia');

/** A virada da própria Burke (marcos da linha do tempo do palco). */
export const TIMELINE = [
    { year: '2006', label: 'prego no caixão' },
    { year: '2012', label: 'keto na mídia leiga' },
    { year: '2015', label: '"cedo demais?"' },
    { year: '2015–16', label: 'Supernova no AIS', now: true },
] as const;

export interface Lane {
    id: 'hcho' | 'pcho' | 'lchf';
    name: string;
    diet: string;
    n: number;
    /** % da energia (cálculo): carboidrato, proteína, gordura. */
    mix: readonly [number, number, number];
    gain: number;
    lo: number;
    hi: number;
}

export const LANES: readonly Lane[] = [
    { id: 'hcho', name: 'HCHO', diet: '8,6 g/kg/d de CHO', n: 9, mix: [64, 16, 20], gain: 6.6, lo: 4.1, hi: 9.1 },
    { id: 'pcho', name: 'PCHO', diet: 'mesmo, periodizado', n: 10, mix: [64, 16, 20], gain: 5.3, lo: 3.4, hi: 7.2 },
    { id: 'lchf', name: 'LCHF', diet: '< 50 g/d de CHO', n: 10, mix: [6, 16, 78], gain: -1.6, lo: -8.5, hi: 5.3 },
];

/** Domínio do eixo (% de melhora no 10 km). */
export const DOMAIN: readonly [number, number] = [-9, 10];

export const FAT_PEAK = '1,57 g/min';

/** Energia por litro de O₂ (Ato III, "O Preço do Oxigênio"). */
export const O2 = { cho: 21.1, fat: 19.6 } as const;

export const SUPERNOVA_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'grupos (n)', value: '9 · 10 · 10' },
    { at: 1, label: 'gordura oxidada, LCHF', value: '1,57 g/min', color: C.fat },
    { at: 2, label: 'kJ por litro de O₂', value: '21,1 × 19,6' },
    { at: 3, label: '10 km: HCHO · PCHO · LCHF', value: '+6,6 · +5,3 · −1,6%', color: C.glucose },
    { at: 4, label: 'IC90% do LCHF', value: '−8,5 a +5,3%', color: C.fat },
];
