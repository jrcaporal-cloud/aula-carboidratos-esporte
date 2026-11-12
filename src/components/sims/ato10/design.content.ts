import { C } from '../kit/palette';
import type { DecideRow } from './DecideShell';

/**
 * Slide 186 · O Desenho Decide o Efeito (dossiê 07: JEUKENDRUP1996 + CURRELL2008, COLOMBANI2013, VANDENBOGAERDE2011).
 * As curvas e o efeito de 5% são ilustrativos; CV, contagens e limiares são dados lidos no abstract.
 */

export interface DesignStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    /** Selo de desenho do passo (canto superior direito). */
    design: string;
}

export const DESIGN_STEPS: readonly DesignStep[] = [
    {
        tab: 'Contrarrelógio',
        headline: 'Contrarrelógio: o atleta se repete',
        text: 'Jeukendrup 1996: 30 atletas bem treinados, em 3 grupos; cada um repetiu o seu teste 6 vezes. No contrarrelógio, o coeficiente de variação foi de 3,35% (pré-carga de 45 min + 15 min máximos: 3,49%). Com ruído baixo, um efeito real de poucos por cento se separa do placebo.',
        sources: ['Jeukendrup 1996 (reprodutibilidade)'],
        design: 'reprodutibilidade · n = 30',
    },
    {
        tab: 'Até a exaustão',
        headline: 'Até a exaustão: o ruído engole o efeito',
        text: 'No tempo até a exaustão a 75% da Wmáx, o CV foi de 26,6%: o mesmo atleta varia mais do que o efeito que se quer medir. Um TTE que “melhora 20%” e um contrarrelógio que melhora 2% podem ser o mesmo efeito real. Currell 2008: TTE com CV > 10%, contrarrelógio < 5%; entre 1º e 2º lugar, < 1%.',
        sources: ['Currell 2008 (revisão)'],
        design: 'reprodutibilidade · n = 30',
    },
    {
        tab: 'Atleta alimentado',
        headline: 'Ensaio como a prova: o efeito encolhe',
        text: 'Colombani 2013 triou 16.658 artigos e ficou com 17 estudos (22 intervenções, 26 a 241 min, sobretudo ciclismo) em que o atleta comeu antes e o teste imitava a prova. Metade das intervenções não melhorou; a outra metade, de +1% a +13%. Até ~70 min, 1 de 5; de 70 a 241 min, 10 de 17. Sem meta-análise.',
        sources: ['Colombani 2013 (RS)'],
        design: 'RS · 17 estudos',
    },
    {
        tab: 'Jejum e viés',
        headline: 'Jejum e viés inflam o efeito',
        text: 'Vandenbogaerde 2011 reuniu 88 estudos cruzados (155 estimativas) e achou viés de publicação: o corte deixou 73 estudos e 122 estimativas. Um jejum adicional de 9 h aumentou o benefício aparente (provavelmente pequeno). Os efeitos foram de ~6% de melhora a ~2% de prejuízo; em potência de contrarrelógio, 2,7% já é efeito grande.',
        sources: ['Vandenbogaerde 2011 (MA)'],
        design: 'MA · 88 estudos',
    },
];

/** Coeficiente de variação de cada teste (Jeukendrup 1996). */
export const CV = { tt: 3.35, tte: 26.6 } as const;
/** Efeito ilustrativo (%), o mesmo nos dois testes. */
export const EFFECT = 5;
export const X_RANGE = 35;

export const COLOMBANI = [
    { label: 'até ~70 min', lit: 1, total: 5 },
    { label: '70 a 241 min', lit: 10, total: 17 },
] as const;

/** Limiares de efeito em potência média de contrarrelógio (Vandenbogaerde 2011). */
export const THRESHOLDS = [
    { at: 0.5, word: 'pequeno' },
    { at: 1.5, word: 'moderado' },
    { at: 2.7, word: 'grande' },
] as const;
export const RULER_MAX = 3;

/** Livro-caixa: a pergunta de leitura que cada passo deixa. */
export const DESIGN_LEDGER: readonly DecideRow[] = [
    { at: 0, term: 'contrarrelógio: o atleta se repete', value: 'CV 3,35%', color: C.ok },
    { at: 1, term: 'até a exaustão: varia mais que o efeito', value: 'CV 26,6%', color: C.stone },
    { at: 2, term: 'alimentado: até ~70 min · 70 a 241 min', value: '1/5 · 10/17', color: C.glucoseSoft },
    { at: 3, term: 'estudos depois do corte de viés', value: '88 → 73', color: C.caveat },
    { at: 3, term: 'efeito grande em contrarrelógio', value: '2,7%', color: C.caveat },
];
