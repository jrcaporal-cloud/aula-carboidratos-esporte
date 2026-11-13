/**
 * Slide 120 · A Janela que Fecha Devagar. Números: dossiê 04 (IVY1988, PARKIN1997, JENTJENS2003, KERKSICK2017)
 * e dossiê 01 (JENSEN2011: glicogênio cheio inibe a sintase; MIKINES1988: sintase ativa por 48 h).
 * Taxas do Ivy em µmol/g de peso úmido/h (= mmol/kg ww/h). Ivy: "45% mais lenta" (não 47%).
 */

export interface WindowStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const WINDOW_STEPS: readonly WindowStep[] = [
    {
        tab: 'Mecanismo',
        headline: 'A fibra sai pronta para guardar',
        text: 'A contração deixou GLUT4 na membrana: na fase rápida (~30–60 min) a glicose entra sem insulina. O glicogênio baixo ativa a glicogênio sintase (cheio, ele a inibe). Depois vem a fase lenta, dependente de insulina, por horas. A forma ativa da sintase seguiu elevada por 48 h (Mikines 1988, n = 7).',
        sources: ['Jentjens 2003 (revisão)', 'Jensen 2011 (revisão)', 'Mikines 1988'],
    },
    {
        tab: 'Ivy: na hora',
        headline: 'Na hora: 7,7. Duas horas depois: 2,5',
        text: 'Ivy 1988, cruzado, 12 ciclistas: 2 g/kg de carboidrato (solução a 25%) logo após o exercício ou 2 h depois, com biópsias aos 0, 2 e 4 h. Nas primeiras 2 h, quem recebeu na hora repôs três vezes mais rápido: 7,7 contra 2,5 mmol/kg de peso úmido por hora.',
        sources: ['Ivy 1988'],
    },
    {
        tab: 'O atraso',
        headline: 'O CHO chega, mas a taxa não alcança',
        text: 'No braço adiado, a taxa subiu para 4,1 quando o carboidrato chegou: ainda 45% abaixo das primeiras 2 h do braço imediato (P < 0,05), mesmo com glicose e insulina mais altas. O número do resumo é 45%, não os 47% que circulam. Limites: 4 h de seguimento e dose única.',
        sources: ['Ivy 1988'],
    },
    {
        tab: 'Parkin: 24 h',
        headline: 'No dia seguinte, a diferença some',
        text: 'Parkin 1997, cruzado, 6 homens treinados: 5 refeições de alto IG em 24 h, com as 3 primeiras em 0–4 h ou em 2–6 h. O glicogênio foi igual às 8 h e às 24 h. É um nulo com n pequeno, mas coerente com o mecanismo: a fibra segue sensível por horas, e o total do dia compensa o atraso.',
        sources: ['Parkin 1997'],
    },
    {
        tab: 'Quando pesa',
        headline: 'A janela pesa se o próximo treino vem cedo',
        text: 'Treino de novo em poucas horas: carboidrato logo, 1,0–1,85 g/kg/h a cada 15–60 min (Jentjens 2003, revisão); a ISSN fala em 1,2 g/kg/h quando o intervalo é menor que 4 h. Treino só no dia seguinte: a pressa perde o sentido e o que manda é o total de carboidrato do dia.',
        sources: ['ISSN 2017'],
    },
];

/** Selos do canto, por passo. */
export const WINDOW_CHIPS: readonly (readonly string[])[] = [
    ['mecanismo: revisões', 'sintase 48 h: n = 7'],
    ['Ivy 1988 · cruzado · n = 12'],
    ['Ivy 1988 · cruzado · n = 12'],
    ['Parkin 1997 · cruzado · n = 6'],
    ['revisão', 'posicionamento ISSN'],
];

/** Ivy 1988 em duas séries no tempo: um braço por linha, uma janela de 2 h por coluna (mmol/kg ww/h). */
export type ArmKind = 'now' | 'late';

export interface IvyCell {
    /** O braço comeu os 2 g/kg no início desta janela? */
    meal: boolean;
    /** Taxa em mmol/kg ww/h; null = não relatada no resumo. */
    rate: number | null;
    text: string;
    /** Passo em que a célula se preenche. */
    at: number;
    /** É a primeira janela de 2 h depois da refeição (a comparação do −45%). */
    firstAfterMeal: boolean;
}

export const IVY_ARMS: readonly { arm: ArmKind; label: string; cells: readonly [IvyCell, IvyCell] }[] = [
    {
        arm: 'now', label: 'comeu logo',
        cells: [
            { meal: true, rate: 7.7, text: '7,7', at: 1, firstAfterMeal: true },
            { meal: false, rate: null, text: '', at: 2, firstAfterMeal: false },
        ],
    },
    {
        arm: 'late', label: 'comeu 2 h depois',
        cells: [
            { meal: false, rate: 2.5, text: '2,5', at: 1, firstAfterMeal: false },
            { meal: true, rate: 4.1, text: '4,1', at: 2, firstAfterMeal: true },
        ],
    },
];

export const RATE_MAX = 8;
