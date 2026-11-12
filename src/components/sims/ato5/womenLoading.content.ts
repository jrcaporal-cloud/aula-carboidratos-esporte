/**
 * Slide 83 · O Mito da Mulher que Não Carrega. Fonte única: dossiê 04 (todos confirmados no abstract).
 *   TARNOPOLSKY1995: 7 homens, 8 mulheres, treino semelhante; CHO de 55–60% para 75% da energia por 4 dias:
 *     glicogênio +41% × 0%; tempo até a exaustão (85% do VO2pico após 60 min a 75%) +45% × +5%; elas oxidaram mais gordura.
 *     Limitação: % da energia deu a elas menos CHO por kg (crítica do JAMES2001); fase do ciclo não controlada.
 *   JAMES2001: 12 g CHO/kg de massa magra/dia, 3 dias, treino interrompido: mulheres 108 → 193 (pós-menstrual),
 *     111 → 202 (pré-menstrual); homens 109 → 183 mmol/kg ww. (n não consta no abstract: não mostrar.)
 *   TARNOPOLSKY2001: cruzado randomizado, 6 + 6 bem treinados, 3 dietas de 4 dias (habitual, CHO 75%, CHO 75% + ~34% de energia):
 *     homens subiram com CHO e com CHO + E; mulheres SÓ com CHO + E.
 */
export interface WomenStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    source: string;
}

export const STEPS: readonly WomenStep[] = [
    {
        tab: '1995',
        headline: 'Só os homens carregaram',
        text: 'Tarnopolsky 1995: 7 homens e 8 mulheres com treino semelhante subiram o carboidrato de 55–60% para 75% da energia por 4 dias. Homens: glicogênio +41% e tempo até a exaustão +45%. Mulheres: 0% e +5%; elas oxidaram mais gordura.',
        design: '7 homens · 8 mulheres · 4 dias',
        source: 'Tarnopolsky 1995',
    },
    {
        tab: '75% de quê?',
        headline: 'A dose estava em %, não em g/kg',
        text: '75% de uma energia diária menor dão menos gramas de carboidrato por quilo. É a crítica do grupo de Fournier ao estudo de 1995, que também não controlou a fase do ciclo menstrual. As barras ao lado só desenham a ideia.',
        design: 'crítica de método',
        source: 'James 2001',
    },
    {
        tab: 'Dose em g/kg',
        headline: 'Com a mesma dose por quilo, elas carregam',
        text: 'James 2001: 12 g de carboidrato por kg de massa magra por dia, 3 dias, treino interrompido. Mulheres de 108 para 193 mmol/kg (fase pós-menstrual) e de 111 para 202 (pré-menstrual); homens de 109 para 183. Sem desfecho de desempenho.',
        design: '12 g/kg de massa magra · 3 dias',
        source: 'James 2001',
    },
    {
        tab: 'Energia',
        headline: 'O limite era a energia, não o sexo',
        text: 'O próprio Tarnopolsky refez em 2001, cruzado com 6 homens e 6 mulheres. Eles subiram com CHO a 75% e com CHO + ~34% de energia; elas, só com a energia extra. Atleta que come pouco (REDs) não carrega.',
        design: 'cruzado · 6 homens · 6 mulheres',
        source: 'Tarnopolsky 2001',
    },
];

export const TAKEAWAY = 'Prescreva em g/kg, com energia suficiente.';

/** Quadro 1: dois desfechos × dois sexos (% de mudança). */
export const BARS_1995 = {
    max: 50,
    groups: [
        { label: 'glicogênio', men: 41, women: 0, menText: '+41%', womenText: '0%', glycogen: true },
        { label: 'tempo até a exaustão', men: 45, women: 5, menText: '+45%', womenText: '+5%', glycogen: false },
    ],
} as const;

/** Quadro 2: duas energias diárias (desenho ilustrativo), a fração de 75% em CHO pintada. */
export const ENERGY = [
    { label: 'ele', width: 1 },
    { label: 'ela', width: 0.72 },
] as const;

export const DUMBBELLS = [
    { label: 'mulheres, pós', from: 108, to: 193, women: true },
    { label: 'mulheres, pré', from: 111, to: 202, women: true },
    { label: 'homens', from: 109, to: 183, women: false },
] as const;
export const DUMB_AXIS = { min: 66, max: 245, unit: 'mmol/kg ww · antes → depois de 3 dias' } as const;

export const GRID = {
    cols: ['CHO 75%', '75% + energia'],
    rows: [
        { label: 'homens', cells: [true, true] },
        { label: 'mulheres', cells: [false, true] },
    ],
    yes: 'subiu',
    no: 'não',
} as const;

export interface Cell {
    at: number;
    year: string;
    title: string;
    note: string;
}

export const CELLS: readonly Cell[] = [
    { at: 0, year: '1995', title: 'Tarnopolsky · 4 dias a 75%', note: '' },
    { at: 1, year: '?', title: '75% de quê? Energia por kg', note: '' },
    { at: 2, year: '2001', title: 'James · 12 g/kg massa magra', note: '' },
    { at: 3, year: '2001', title: 'Tarnopolsky · subiu?', note: '' },
];

export const LEDGER = [
    { at: 0, label: 'em % da energia', value: 'só eles' },
    { at: 1, label: '75% de uma energia menor', value: 'menos g/kg' },
    { at: 2, label: '12 g/kg de massa magra', value: 'os dois' },
    { at: 3, label: 'CHO + ~34% de energia', value: 'os dois' },
] as const;

export const TEXT = {
    ledger: 'quem carregou',
    men: 'H',
    women: 'M',
    share: '75% em CHO',
    lessGkg: 'mesma %, menos gramas por kg',
} as const;
