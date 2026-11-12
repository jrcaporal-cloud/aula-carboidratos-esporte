/**
 * Slide 83 · O Mito da Mulher que Não Carrega. Fonte única: dossiê 04 (todos confirmados no abstract).
 *   TARNOPOLSKY1995: 7 homens, 8 mulheres; CHO de 55–60% para 75% da energia por 4 dias: glicogênio +41% × 0%.
 *   JAMES2001: 12 g CHO/kg de massa magra/dia, 3 dias: mulheres 108 → 193 (pós-menstrual), 111 → 202 (pré-menstrual);
 *     homens 109 → 183 mmol/kg ww. (n não consta no abstract: não mostrar.)
 *   TARNOPOLSKY2001: cruzado, 6 + 6; dieta habitual, CHO 75%, CHO 75% + ~34% de energia:
 *     homens subiram com CHO e com CHO + E; mulheres SÓ com CHO + E.
 */
export const BEATS: readonly string[] = [
    'A mesma dieta, 75% da energia em carboidrato. Só os homens carregaram.',
    '75% de quê? De uma energia menor. Menos gramas de carboidrato por quilo.',
    'Dose por quilo de massa magra. Elas carregaram tanto quanto eles.',
    'O próprio Tarnopolsky refez: elas carregaram quando a energia subiu junto.',
];

export const TAKEAWAY = 'Prescreva em g/kg, com energia suficiente.';

export const BARS = [
    { label: 'homens', value: 41, text: '+41%' },
    { label: 'mulheres', value: 0, text: '0%' },
] as const;
export const BARS_MAX = 50;
export const BARS_TITLE = 'glicogênio muscular após 4 dias';

/** Passo 2: duas energias diárias (desenho ilustrativo), a fração de 75% em CHO pintada. */
export const ENERGY = [
    { label: 'ele', width: 1 },
    { label: 'ela', width: 0.72 },
] as const;
export const ENERGY_TEXT = { title: 'energia do dia', share: '75% em carboidrato' } as const;

export const DUMBBELLS = [
    { label: 'mulheres · pós-menstrual', from: 108, to: 193, women: true },
    { label: 'mulheres · pré-menstrual', from: 111, to: 202, women: true },
    { label: 'homens', from: 109, to: 183, women: false },
] as const;
export const DUMB_AXIS = { min: 80, max: 220, ticks: [100, 150, 200], unit: 'glicogênio, mmol/kg (peso úmido) · antes → depois de 3 dias' } as const;

export const GRID = {
    cols: ['CHO a 75%', '75% + energia'],
    rows: [
        { label: 'homens', cells: [true, true] },
        { label: 'mulheres', cells: [false, true] },
    ],
    title: 'o glicogênio subiu?',
    yes: 'sim',
    no: 'não',
} as const;

export const DESIGNS: readonly string[] = [
    '7 homens · 8 mulheres · 4 dias',
    '',
    '12 g/kg de massa magra · 3 dias',
    'cruzado · 6 homens · 6 mulheres',
];

export const SOURCES: readonly string[] = [
    'Tarnopolsky MA et al. J Appl Physiol 1995;78(4):1360-1368.',
    'Tarnopolsky MA et al. J Appl Physiol 1995;78(4):1360-1368.',
    'James AP et al. Eur J Appl Physiol 2001;85(6):533-538.',
    'Tarnopolsky MA et al. J Appl Physiol 2001;91(1):225-230.',
];
