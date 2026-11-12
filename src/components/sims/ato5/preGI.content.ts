/**
 * Slide 86 · IG Antes do Treino. Fonte única: dossiê 04 (confirmados no abstract).
 *   THOMAS1991: cruzado, n = 8 ciclistas treinados; 1 h antes, porções iguais de CHO de lentilha (IG baixo),
 *     batata (IG alto), glicose ou água; tempo até a exaustão: lentilha +20 min × batata (P < 0,05); glicose e insulina
 *     pós-prandiais mais baixas com a lentilha. Dose em g/kg não confirmada (não usar).
 *   BURDON2017: RS + MA de cruzados randomizados; k = 19, 188 participantes, 91% homens, VO₂máx > 50 mL/kg/min;
 *     IG baixo (≤ 55) × alto (≥ 70), 30–210 min antes, 0,18–2 g/kg, IG médio 82 × 35; provas ≥ 60 min.
 *     Sem CHO durante: tamanho de efeito −0,17 a −0,36, tendência leve a favor do IG baixo, nenhum significativo (p > 0,05).
 *     Com CHO durante: −0,67 a 0,11, conflitam. Nenhum modificador (duração, momento, carga glicêmica, aptidão).
 * Sinal: negativo = favorece o IG baixo (como no abstract). As barras são a FAIXA dos efeitos agrupados por desfecho,
 * não intervalos de confiança.
 */
import { C } from '../kit/palette';

export interface GIStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    limit?: string;
    sources: string;
    chips: readonly string[];
}

export const GI_STEPS: readonly GIStep[] = [
    {
        tab: 'Lentilha × batata',
        headline: 'O estudo que criou o pré de IG baixo',
        color: C.glucose,
        text: 'Thomas 1991, cruzado, 8 ciclistas treinados: a mesma quantidade de carboidrato 1 h antes, de lentilha (IG baixo) ou de batata (IG alto). Com a lentilha, 20 min a mais até a exaustão, com glicose e insulina pós-refeição mais baixas.',
        limit: 'tempo até a exaustão, sem CHO durante, sem cegamento (a comida se reconhece), n = 8.',
        sources: 'Thomas 1991',
        chips: ['cruzado · n = 8 · até a exaustão'],
    },
    {
        tab: '19 estudos',
        headline: 'Burdon juntou 19 cruzados',
        color: C.glucoseSoft,
        text: 'Burdon 2017, revisão sistemática com meta-análise de cruzados randomizados: IG baixo (≤ 55) × alto (≥ 70), de 30 a 210 min antes, em provas de 60 min ou mais, por contrarrelógio ou tempo até a exaustão. O estudo de 1991 é um dos 19.',
        sources: 'Burdon 2017 (meta-análise)',
        chips: ['meta-análise · 19 cruzados'],
    },
    {
        tab: 'Sem CHO durante',
        headline: 'Sem CHO durante: só tendência',
        color: C.stone,
        text: 'Quando o atleta só bebia água na prova, os efeitos agrupados ficaram entre −0,17 e −0,36, uma inclinação leve para o IG baixo. Nenhum chegou à significância (p > 0,05).',
        limit: 'poucos estudos por protocolo, baixo poder.',
        sources: 'Burdon 2017 (meta-análise)',
        chips: ['meta-análise · 19 cruzados'],
    },
    {
        tab: 'Com CHO durante',
        headline: 'Com CHO durante, o sinal some',
        color: C.ok,
        text: 'Com carboidrato na prova, a vida real, os efeitos foram de −0,67 a 0,11 e se contradizem. Duração, horário, carga glicêmica e aptidão não mudaram nada. Escolha o IG pelo conforto intestinal e pela preferência.',
        sources: 'Burdon 2017 (meta-análise)',
        chips: ['meta-análise · 19 cruzados'],
    },
];

export const FOODS = [
    { id: 'lentilha', name: 'lentilha', gi: 'IG baixo', win: true },
    { id: 'batata', name: 'batata', gi: 'IG alto', win: false },
] as const;

export const THOMAS = { title: 'Thomas 1991 · 1 h antes', value: '+20 min', caption: 'até a exaustão com a lentilha' } as const;

export const BURDON = { studies: 19, title: 'Burdon 2017 · 19 estudos', founder: 'o âmbar é Thomas 1991' } as const;

/** Faixas de efeito agrupado (negativo = favorece IG baixo). */
export const RANGES = [
    { id: 'sem', at: 2, label: 'sem CHO durante', lo: -0.36, hi: -0.17, note: 'p > 0,05' },
    { id: 'com', at: 3, label: 'com CHO durante', lo: -0.67, hi: 0.11, note: 'conflitam' },
] as const;

export const ES_AXIS = { min: -0.8, max: 0.4, ticks: [-0.8, -0.4, 0, 0.4] } as const;

/** Ficha da meta-análise: cada linha entra num passo e fica. */
export const FICHA: readonly { at: number; k: string; v: string }[] = [
    { at: 0, k: 'Thomas 1991', v: 'n = 8 · cruzado · sem cegamento' },
    { at: 1, k: 'Burdon 2017', v: '19 estudos · 188 pessoas · 91% homens' },
    { at: 1, k: 'IG comparado', v: '82 × 35 (médias)' },
    { at: 1, k: 'dose · horário', v: '0,18–2 g/kg · 30–210 min antes' },
    { at: 2, k: 'sem CHO durante', v: 'leve, a favor do IG baixo; p > 0,05' },
    { at: 3, k: 'modificadores', v: 'nenhum significativo' },
];
