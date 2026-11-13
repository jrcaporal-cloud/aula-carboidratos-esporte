import type { Lesson } from './paFrame';
import { C } from '../kit/palette';

/**
 * Slide 101 · 82% dos Ensaios. Faixas 1–2 do palco, STELL2014: revisão sistemática, 61 ECRs com placebo de água,
 * n = 679; 50 com benefício, 11 sem mudança; ganho × duração p = 0,0036; ~1 h boca/cérebro, > 2 h combustível.
 * Faixa 3, VANDEN2011: meta-análise, 88 estudos e 155 estimativas; +6% a −2% conforme a
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
        tab: '82% ajudam',
        headline: '50 de 61 ensaios acharam benefício',
        color: C.glucose,
        text: 'Stellingwerff & Cox (2014) reuniram só ECRs de carboidrato contra placebo de água: 61 estudos, n = 679, provas de duração variada. 82% (50) mostraram melhora; 18% (11), nenhuma mudança. É revisão sistemática sem meta-análise: conta votos. Diz que o efeito existe, não de quanto. Limitação: muitos ensaios em jejum.',
        sources: [STELL],
    },
    {
        tab: 'Mais longa',
        headline: 'Quanto mais longa a prova, maior o ganho',
        color: C.glucose,
        text: 'Na mesma revisão, o % de ganho se correlaciona com o tempo total de exercício (p = 0,0036). E o mecanismo muda: perto de 1 h agem a boca e o cérebro, e tipo e quantidade de carboidrato são “irrelevantes”; acima de 2 h age o combustível, com entrega alta (> 90 g/h) e oxidação alta. Limitação: exclui esportes coletivos.',
        sources: [],
    },
    {
        tab: 'Formulação',
        headline: 'A formulação decide o tamanho',
        color: C.ok,
        text: 'Outra base, outra pergunta: a meta-análise de Vandenbogaerde & Hopkins (2011) somou 88 estudos e 155 estimativas (73 e 122 sem os imprecisos) em potência média de contrarrelógio. O efeito vai de −2% a +6% conforme a bebida. A do topo dá ~0,9 g/kg/h de carboidrato: ≈ 63 g/h a 70 kg (cálculo, 0,9 × 70). Inferência por magnitude, controversa.',
        sources: ['Vandenbogaerde & Hopkins 2011'],
    },
];

export const MECHANISMS = [
    { when: '~1 h', what: 'boca e cérebro', note: 'tipo e quantidade “irrelevantes”', color: C.insulinSoft },
    { when: '> 2 h', what: 'combustível', note: 'entrega > 90 g/h · oxidação alta', color: C.glucose },
] as const;

/** Melhor bebida inferida por Vandenbogaerde (g/kg/h). */
export const RECIPE = [
    { amount: '~0,7', what: 'glicose (polímero)', short: 'glicose', color: C.glucose },
    { amount: '~0,2', what: 'frutose', short: 'frutose', color: C.fructoseSoft },
    { amount: '~0,2', what: 'proteína', short: 'proteína', color: C.proteinSoft },
] as const;

export const LESSONS: readonly Lesson[] = [
    { at: 0, text: '82% (50 de 61) com benefício: contagem de votos.', color: C.glucose },
    { at: 1, text: 'Prova mais longa, ganho maior (p = 0,0036).', color: C.glucose },
    { at: 2, text: 'Outra base: o tamanho vai de −2% a +6% conforme a bebida.', color: C.ok },
];
