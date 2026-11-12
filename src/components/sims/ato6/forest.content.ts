import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 101 · 82% dos Ensaios. À esquerda (palco), STELL2014: revisão sistemática, 61 ECRs com placebo de água,
 * n = 679; 50 com benefício, 11 sem mudança; ganho × duração p = 0,0036; ~1 h boca/cérebro, > 2 h combustível.
 * À direita (painel do último passo), VANDEN2011: meta-análise, 88 estudos e 155 estimativas; +6% a −2% conforme a
 * formulação; melhor bebida ~0,7 + 0,2 + 0,2 g/kg/h; frutose > 0,25 g/kg/h e +10 °C reduzem. São conjuntos diferentes.
 * "≈ 63 g/h a 70 kg" é cálculo (0,9 g/kg/h × 70).
 */

export const TOTAL = 61;
export const POSITIVE = 50;

export const DESIGN = ['revisão sistemática · 61 ECRs · n = 679', 'meta-análise · 88 estudos · 155 estimativas'] as const;

export interface ForestStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    sources: readonly string[];
}

const STELL = 'Stellingwerff & Cox 2014';

export const STEPS: readonly ForestStep[] = [
    {
        tab: '61 ensaios',
        headline: '61 ECRs contra placebo de água',
        color: C.glucoseSoft,
        text: 'Stellingwerff & Cox (2014) reuniram só ECRs com placebo de água e só carboidrato: 61 estudos de desempenho ou capacidade, n = 679, provas de duração variada. Cada quadrado é um ensaio. É revisão sistemática sem meta-análise: conta quem achou efeito, não soma o tamanho dos efeitos.',
        sources: [STELL],
    },
    {
        tab: '82%',
        headline: '50 de 61 acharam benefício',
        color: C.glucose,
        text: '82% dos ensaios mostraram melhora com o carboidrato durante o exercício; os outros 11 (18%), nenhuma mudança. É um placar de direção: diz que o efeito existe na grande maioria, mas não diz de quanto. Para o tamanho, é preciso uma meta-análise.',
        sources: [],
    },
    {
        tab: 'Duração',
        headline: 'Quanto mais longa a prova, maior o ganho',
        color: C.glucose,
        text: 'O % de ganho se correlaciona com o tempo total de exercício (p = 0,0036). E o mecanismo muda: em ~1 h, age a boca e o cérebro, e tipo e quantidade de carboidrato são “irrelevantes”; acima de 2 h, age o combustível, com entrega alta (> 90 g/h) e oxidação alta. Limitação: exclui esportes coletivos.',
        sources: [],
    },
    {
        tab: 'Formulação',
        headline: 'A formulação decide o tamanho',
        color: C.ok,
        text: 'Meta-análise de Vandenbogaerde & Hopkins (2011), outro conjunto: 88 estudos, 155 estimativas (73 e 122 sem os imprecisos), em potência média de contrarrelógio. Inferência por magnitude, controversa.',
        sources: ['Vandenbogaerde & Hopkins 2011'],
    },
];

export const MECHANISMS = [
    { when: '~1 h', what: 'boca e cérebro', note: 'tipo e quantidade “irrelevantes”', color: C.insulinSoft },
    { when: '> 2 h', what: 'combustível', note: 'entrega > 90 g/h · oxidação alta', color: C.glucose },
] as const;

/** Melhor bebida inferida por Vandenbogaerde (g/kg/h). */
export const RECIPE = [
    { amount: '~0,7', what: 'glicose (polímero)', color: C.glucose },
    { amount: '~0,2', what: 'frutose', color: C.fructose },
    { amount: '~0,2', what: 'proteína', color: C.protein },
] as const;

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: '61 ECRs, n = 679, placebo de água.', color: C.co2 },
    { at: 1, text: '82% com benefício; 18% sem mudança.', color: C.glucose },
    { at: 2, text: 'Ganho cresce com a duração (p = 0,0036).', color: C.glucose },
    { at: 3, text: 'A formulação leva o efeito de −2% a +6%.', color: C.ok },
];
