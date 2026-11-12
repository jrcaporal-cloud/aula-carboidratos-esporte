import { C } from '../kit/palette';

/** Slide 62 · Três dietas, nove estudantes. Fonte única: dossiê 02 · BERGSTROM1967 (texto original, Tabela III). */

export interface Diet {
    name: string;
    /** Glicogênio inicial, g/100 g de músculo úmido. */
    glycogen: number;
    /** Tempo até a exaustão a 75% do VO₂máx, min. */
    minutes: number;
    color: string;
}

/** Na ordem do resultado (o experimento foi mista → gordura+proteína → carboidrato em 6 dos 9). */
export const DIETS: readonly Diet[] = [
    { name: 'gordura + proteína', glycogen: 0.63, minutes: 57, color: C.fat },
    { name: 'mista', glycogen: 1.75, minutes: 114, color: C.stone },
    { name: 'carboidrato', glycogen: 3.31, minutes: 167, color: C.glucose },
];

/** Teto das escalas do slide. */
export const GLY_MAX = 4;
export const MIN_MAX = 180;

/** Reta do artigo: tempo = 41,6 × glicogênio + 36,8 (faixa medida 0,6–4,7 g/100 g). */
export const FIT = { slope: 41.6, intercept: 36.8, x0: 0.6, x1: 4.7 } as const;

/** Os 3 que fizeram carboidrato sem a fase gordurosa logo antes. */
export const OUT_OF_ORDER = { gly: [2.1, 3.0], min: [119, 124] } as const;

export const DIET_LEADS = [
    'Três dietas de 3 dias, nove estudantes, uma biópsia antes de cada teste.',
    'A 75% do VO₂máx, os três cronômetros largam juntos.',
    'Quanto mais glicogênio no início, mais tempo até a exaustão.',
    'Sem esvaziar antes, o carboidrato encheu menos: a origem do "esvaziar para encher".',
    'O gráfico mais famoso da área mostra associação, não causa.',
] as const;

export const PROTOCOL = [
    { what: 'dieta mista', then: 'exaustão' },
    { what: '3 dias gordura + proteína', then: 'exaustão' },
    { what: '3 dias carboidrato', then: 'exaustão' },
] as const;

export const LIMITS = [
    'Tempo até a exaustão, não prova',
    'Sem cegamento',
    'n = 9, ordem não balanceada',
    'Fígado e glicemia não medidos',
] as const;

export const DIETS_SOURCE = 'Bergström, Hermansen, Hultman & Saltin, Acta Physiol Scand 1967 (Tabela III)';
