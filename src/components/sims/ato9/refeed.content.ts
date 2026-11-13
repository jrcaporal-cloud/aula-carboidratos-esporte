/**
 * Slide 165 · Depois da Pesagem — KONDO2021, REALE2016-JUDO, REALE2017-BOXE, CDC1998 + OPPLIGER2006 (dossiê 06,
 * confirmados no abstract). A forma da curva do glicogênio é desenho: só os marcos são do estudo (−36,5% na pesagem,
 * ainda abaixo da base 13 h depois, sem número publicado no abstract). As três mortes de 1997 são o pico do Ato IX.
 * O 1,7% do palco e do livro-caixa é o de Oppliger 2006 (perda nas 20 h antes da pesagem), escrito sem contador.
 */
import { C } from '../kit/palette';
import type { LedgerItem } from './FrameB';

export const KONDO = { n: 10, lossPct: 6, lossKg: '4,6', hours: 53, choGkg: '7,1', mealHours: 5, dropPct: '36,5', after: 13, massAfter: '1,7' } as const;

export interface Lane {
    key: string;
    sport: string;
    /** Distância pesagem → luta no desenho (fração da régua; é ilustrativa). */
    gap: number;
    gapLabel: string;
    regain: string;
    verdict: string;
    color: string;
}

export const LANES: readonly Lane[] = [
    { key: 'judo', sport: 'Judô', gap: 0.86, gapLabel: 'pesagem 15–20 h antes', regain: 'reganho H +2,3% · M +3,1%', verdict: 'medalhistas reganharam +1,4 p.p.', color: C.ok },
    { key: 'boxe', sport: 'Boxe', gap: 0.3, gapLabel: 'pesagem diária', regain: 'reganho H +2,1% · M +1,5%', verdict: 'reganho sem relação com vencer', color: C.stone },
];

export const NCAA = { deaths: 3, states: 'Carolina do Norte · Wisconsin · Michigan', window: '7/11 a 9/12/1997', loss: '1,7%', lossKg: '1,2 kg', regain: '1,3%', wrestlers: 811 } as const;

export interface RefeedStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    source: string;
}

export const STEPS: readonly RefeedStep[] = [
    {
        tab: 'O glicogênio',
        headline: 'O glicogênio não volta em uma noite',
        text: 'Kondo 2021: 10 lutadores universitários de elite perderam 6% da massa (−4,6 kg) em 53 h, e o glicogênio, medido por 13C-MRS, caiu 36,5%. Depois comeram 7,1 g/kg de CHO em três refeições, em 5 h. Treze horas depois, o glicogênio seguia abaixo da base e a massa, 1,7 kg abaixo. Limite: n = 10, sem braço com outra dose.',
        design: 'intervenção · n = 10 · 13C-MRS',
        source: 'Kondo 2021 (BMC Sports Sci Med Rehabil)',
    },
    {
        tab: 'Judô × boxe',
        headline: 'A regra de pesagem decide o que importa',
        text: 'Reale 2016, judô internacional (n = 86, pesagem 15–20 h antes): reganho de 2,3% nos homens e 3,1% nas mulheres; medalhistas reganharam 1,4 ponto percentual a mais. Reale 2017, boxe (n = 100, pesagem diária): reganho de ~2% sem relação com chegar à final ou vencer. Observacionais: associação, não causa.',
        design: 'observacionais · n = 86 e n = 100',
        source: 'Reale 2016 (IJSNEM) · Reale 2017 (IJSPP)',
    },
    {
        tab: '1997',
        headline: 'Novembro e dezembro de 1997',
        text: 'Em cerca de um mês, três lutadores universitários dos EUA (Carolina do Norte, Wisconsin e Michigan) morreram de hipertermia e desidratação. Os três restringiram comida e líquido e treinaram com roupa impermeável, em ambiente quente, nas horas antes da pesagem. É relato de casos do CDC: não mede risco, mostra o mecanismo.',
        design: 'relato de casos · CDC',
        source: 'CDC, MMWR 1998',
    },
    {
        tab: 'A regra nova',
        headline: 'A saída foi uma regra',
        text: 'A NCAA passou a exigir peso mínimo pela composição corporal e pesagem perto da luta. Oppliger 2006 (811 lutadores, campeonatos de 1999 a 2004): a perda nas 20 h antes da pesagem ficou em 1,2 kg (1,7%) e o reganho em 0,9 kg (1,3%), menores que antes da regra. Nenhum suplemento fez isso.',
        design: 'observacional · 811 lutadores · 1999–2004',
        source: 'Oppliger 2006 (Med Sci Sports Exerc)',
    },
];

export const LEDGER: readonly LedgerItem[] = [
    { at: 0, label: 'glicogênio na pesagem (Kondo)', value: '−36,5%', color: C.glycogenSoft },
    { at: 1, label: 'reganho a mais dos medalhistas (judô)', value: '+1,4 p.p.', color: C.ok },
    { at: 2, label: 'mortes em ~1 mês, 1997 (CDC)', value: '3', color: C.stone },
    { at: 3, label: 'perda nas 20 h antes, após a regra', value: '1,7%', color: C.ok },
];
