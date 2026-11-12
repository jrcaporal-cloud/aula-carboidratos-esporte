import type { ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/**
 * Slide 111 · O Tamanho Real do Bochecho. Arquivo próprio (o rinse.content.ts é dividido com o slide do Bochecho).
 * BRIE2019 (meta-análise, abstract), DEAT2013 (revisão sistemática, abstract; dossiê 03, K), LANE2013 e TROM2015 (abstracts).
 */

export const META_ROWS: readonly ForestRow[] = [
    { id: 'pot', label: 'Potência média', sub: '16 ensaios · n = 175', est: 0.25, lo: 0.04, hi: 0.46, kind: 'pooled', color: C.glucose, right: '0,25 (0,04 a 0,46)' },
    { id: 'tempo', label: 'Tempo de prova', sub: 'n = 151 · p = 0,25', est: -0.13, lo: -0.36, hi: 0.1, kind: 'pooled', color: '#CBD5E1', right: '−0,13 (−0,36 a 0,10)' },
];

/** Lane 2013: potência média (W) no contrarrelógio de 60 min, por estado alimentar. */
export const LANE_GROUPS = [
    { id: 'jejum', label: 'em jejum', placebo: 273, rinse: 282, gain: '+3,4%' },
    { id: 'alim', label: 'alimentado', placebo: 281, rinse: 286, gain: '+1,8%' },
] as const;
/** Eixo em zoom honesto: começa em 260 W (está escrito no gráfico). */
export const LANE_AXIS = [260, 290] as const;

/** Trommelen 2015: tempo (min) no contrarrelógio de 1 h; menor = melhor. */
export const TROM_ROWS = [
    { id: 'jejum', label: 'em jejum', placebo: 68.6, sucrose: 69.6 },
    { id: 'alim', label: 'alimentado', placebo: 67.6, sucrose: 69.0 },
] as const;
export const TROM_AXIS = [67, 70] as const;

export interface MetaStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    chips: readonly string[];
    sources: readonly string[];
}

export const META_STEPS: readonly MetaStep[] = [
    {
        tab: 'Potência', color: C.glucose, chips: ['meta-análise · 16 ensaios · n = 175 · I² = 0%'],
        headline: 'Efeito real, e pequeno',
        text: 'Brietzke 2019 juntou 13 estudos (16 ensaios) de bochecho com carboidrato × placebo no contrarrelógio de ciclismo. A potência média subiu com SMD 0,25 (p = 0,02), sem heterogeneidade. Pela régua de Cohen, efeito pequeno.',
        sources: ['Brietzke et al., Sports Med 2019', 'de Ataide e Silva et al., Nutrients 2013'],
    },
    {
        tab: 'Tempo', color: '#E5E7EB', chips: ['meta-análise · n = 151 (tempo) · I² = 0%'],
        headline: 'O cronômetro não confirmou',
        text: 'No tempo para completar a prova, SMD −0,13 (p = 0,25): o intervalo cruza o zero. O ganho aparece na potência média, não no tempo final. A meta-análise recebeu um comentário crítico publicado.',
        sources: [],
    },
    {
        tab: 'Jejum × alimentado', color: C.glucose, chips: ['ECR duplo-cego · n = 12 · quadrado latino'],
        headline: 'O café da manhã encolhe o efeito',
        text: 'Lane 2013: 12 ciclistas, bochecho de 10 s com maltodextrina a 10% num contrarrelógio de 60 min. Em jejum, +3,4% de potência; alimentado (2,5 g/kg de carboidrato 2 h antes), +1,8%. A maior potência absoluta veio de alimentado + bochecho.',
        sources: ['Lane et al., Appl Physiol Nutr Metab 2013'],
    },
    {
        tab: 'Um nulo bem feito', color: C.stone, chips: ['ECR cruzado duplo-cego · n = 14'],
        headline: 'E às vezes, nada',
        text: 'Trommelen 2015: 14 ciclistas treinados (5,0 W/kg), sacarose a 6,4% × placebo adoçado, em jejum e alimentados. Sem efeito (p = 0,277), com o gosto doce nos dois braços.',
        sources: ['Trommelen et al., Int J Sport Nutr Exerc Metab 2015'],
    },
];

/** Livro-caixa do painel: um dado-chave por passo, que fica. */
export const META_LEDGER = [
    { at: 0, value: 'SMD 0,25', label: 'potência · IC95% 0,04 a 0,46', color: C.glucose },
    { at: 1, value: 'p = 0,25', label: 'tempo de prova: nulo', color: '#E5E7EB' },
    { at: 2, value: '+3,4 × +1,8%', label: 'jejum × alimentado (n = 12)', color: C.glucoseSoft },
    { at: 3, value: 'p = 0,277', label: 'sacarose × placebo doce', color: C.stone },
] as const;
