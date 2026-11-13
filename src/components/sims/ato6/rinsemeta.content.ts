import type { ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/**
 * Slide 111 · O Tamanho Real do Bochecho. Arquivo próprio (o rinse.content.ts é dividido com o slide do Bochecho).
 * BRIE2019 (meta-análise, abstract), LANE2013 e TROM2015 (abstracts). A revisão de 2013 (DEAT2013) saiu da tela
 * (passo fora da pergunta, outra escala) e fica nas notas.
 * Palco em 3 faixas, um estudo e um eixo por faixa: 1 meta-análise (SMD) → 2 Lane (% de potência) → 3 Trommelen (min).
 */

export const META_ROWS: readonly ForestRow[] = [
    { id: 'pot', label: 'potência', est: 0.25, lo: 0.04, hi: 0.46, kind: 'pooled', color: C.glucose, right: '0,25' },
    { id: 'tempo', label: 'tempo', est: -0.13, lo: -0.36, hi: 0.1, kind: 'pooled', color: '#CBD5E1', right: '−0,13' },
];

/** Lane 2013: ganho de potência média (%) com o bochecho no contrarrelógio de 60 min, por estado alimentar. */
export const LANE_GAINS = [
    { id: 'jejum', label: 'em jejum', value: 3.4, text: '+3,4%', color: C.glucose },
    { id: 'alim', label: 'alimentado', value: 1.8, text: '+1,8%', color: C.glucoseSoft },
] as const;
/** Fim do eixo da barra (%), que começa no zero. */
export const LANE_MAX = 4;

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
        headline: 'Somados, o efeito é real',
        text: 'Brietzke 2019 juntou 13 estudos (16 ensaios) de bochecho com carboidrato × placebo no contrarrelógio de ciclismo. A potência média subiu com SMD 0,25 (p = 0,02), sem heterogeneidade: o intervalo não toca o zero.',
        sources: ['Brietzke et al., Sports Med 2019'],
    },
    {
        tab: 'Tempo', color: '#E5E7EB', chips: ['meta-análise · n = 151 (tempo) · I² = 0%'],
        headline: 'Mas pequeno',
        text: 'Pela régua de Cohen, 0,25 é efeito pequeno. E no tempo para completar a prova, SMD −0,13 (p = 0,25): o intervalo cruza o zero. O ganho aparece na potência média, não no cronômetro. A meta-análise recebeu um comentário crítico publicado.',
        sources: [],
    },
    {
        tab: 'Jejum × alimentado', color: C.glucose, chips: ['ECR duplo-cego · n = 12 · quadrado latino'],
        headline: 'O café da manhã encolhe o efeito',
        text: 'Lane 2013: 12 ciclistas, bochecho de 10 s com maltodextrina a 10% num contrarrelógio de 60 min. Em jejum, +3,4% (273 → 282 W); alimentado com 2,5 g/kg de carboidrato 2 h antes, +1,8% (281 → 286 W). A maior potência absoluta foi alimentado + bochecho.',
        sources: ['Lane et al., Appl Physiol Nutr Metab 2013'],
    },
    {
        tab: 'Um nulo bem feito', color: C.stone, chips: ['ECR cruzado duplo-cego · n = 14'],
        headline: 'E às vezes, nada',
        text: 'Trommelen 2015: 14 ciclistas treinados (5,0 W/kg), sacarose a 6,4% × placebo adoçado, em jejum e alimentados. Sem efeito (p = 0,277), com o gosto doce nos dois braços.',
        sources: ['Trommelen et al., Int J Sport Nutr Exerc Metab 2015'],
    },
];

/** Livro-caixa do painel: a cadeia "isso → mas → por isso → logo", um elo por passo, que fica. */
export const META_CHAIN = [
    { at: 0, link: 'isso', text: 'potência sobe: SMD 0,25', color: C.glucose },
    { at: 1, link: 'mas', text: 'pequeno; tempo não muda (p = 0,25)', color: '#E5E7EB' },
    { at: 2, link: 'por isso', text: 'jejum +3,4% × alimentado +1,8%', color: C.glucoseSoft },
    { at: 3, link: 'logo', text: 'nem sempre aparece (p = 0,277)', color: C.stone },
] as const;
