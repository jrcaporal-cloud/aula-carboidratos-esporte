import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 102 · A Curva de Smith (SMITH2013, dossiê 03 bloco B): ECR duplo-cego, 4 centros, 51 ciclistas e triatletas;
 * 12 doses de 10 a 120 g/h + placebo, cada um fez só 4 ensaios (3 doses do centro + placebo); ganhos estimados de
 * 1,0/2,0/3,0/4,0/4,7% a 9/19/31/48/78 g/h. Quais doses cada centro testou NÃO está no dossiê: a matriz é esquema.
 * "~0,8% e ~0,2% por 10 g/h" são cálculo (4,0 ÷ 4,8 e 0,7 ÷ 3).
 */

export const POINTS = [
    { dose: 0, gain: 0 },
    { dose: 9, gain: 1.0 },
    { dose: 19, gain: 2.0 },
    { dose: 31, gain: 3.0 },
    { dose: 48, gain: 4.0 },
    { dose: 78, gain: 4.7 },
] as const;

/** Esquema do delineamento: 4 centros, 3 doses cada (distribuição ilustrativa) + placebo em todos. */
export const CENTERS: readonly (readonly number[])[] = [
    [10, 50, 90],
    [20, 60, 100],
    [30, 70, 110],
    [40, 80, 120],
];

export const DOSES = Array.from({ length: 12 }, (_, i) => (i + 1) * 10);

export interface DoseStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    fact: { value: string; caption: string };
    sources: readonly string[];
}

export const STEPS: readonly DoseStep[] = [
    {
        tab: 'O desenho',
        headline: 'Doze doses, quatro ensaios por pessoa',
        color: C.glucoseSoft,
        text: 'ECR duplo-cego em 4 centros: 51 ciclistas e triatletas (28 ± 7 anos). Bebida 1:1:1 de glicose, frutose e maltodextrina, com eletrólitos, a 1 L/h. Teste: 2 h a 95% da carga do lactato de 4 mmol/L e contrarrelógio de 20 km (~160 min). Ninguém testou todas as doses: blocos incompletos e modelo misto.',
        fact: { value: '51', caption: 'atletas · 12 doses + placebo · 4 ensaios cada' },
        sources: ['Smith JW et al., Med Sci Sports Exerc 2013'],
    },
    {
        tab: 'A subida',
        headline: 'A maior parte do ganho vem cedo',
        color: C.glucose,
        text: 'O modelo junta as colunas numa curva só. Ganhos estimados no contrarrelógio: +1,0% a 9 g/h, +2,0% a 19, +3,0% a 31 e +4,0% a 48 g/h. Até ~50 g/h, cada 10 g/h a mais rende ~0,8% (cálculo).',
        fact: { value: '+4,0%', caption: 'a 48 g/h' },
        sources: [],
    },
    {
        tab: 'O ótimo',
        headline: 'O ótimo deste protocolo: ~78 g/h',
        color: C.glucose,
        text: '+4,7% a 78 g/h. De 48 para 78 g/h, mais 30 g/h compraram 0,7 ponto: ~0,2% por 10 g/h (cálculo), um quarto do rendimento do início. Acima de 78 g/h, o ganho estimado diminui.',
        fact: { value: '+4,7%', caption: 'a 78 g/h' },
        sources: [],
    },
    {
        tab: 'O preço',
        headline: 'Um estudo, um protocolo',
        color: C.stone,
        text: 'Limitações: um único ECR; dados log-transformados e médias ajustadas; sem isótopo; ~160 min de ciclismo em laboratório; primeiro autor do Gatorade Sports Science Institute. Serve para a forma da curva, não para fixar 78 g/h em qualquer prova.',
        fact: { value: '~0,2%', caption: 'por 10 g/h entre 48 e 78 g/h (cálculo)' },
        sources: ['afiliação: registro Europe PMC'],
    },
];

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: 'Blocos incompletos: ninguém testou as 12 doses.', color: C.co2 },
    { at: 1, text: 'Até ~50 g/h: ~0,8% de ganho a cada 10 g/h.', color: C.glucose },
    { at: 2, text: 'Ótimo do protocolo: ~78 g/h, +4,7%.', color: C.glucose },
    { at: 3, text: 'Acima, menos por grama. Um estudo, da indústria.', color: C.stone },
];
