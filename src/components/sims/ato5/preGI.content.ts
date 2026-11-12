/**
 * Slide 86 · IG Antes do Treino. Fonte única: dossiê 04 (confirmados no abstract).
 *   THOMAS1991: cruzado, n = 8 ciclistas; 1 h antes, lentilha (IG baixo) × batata (IG alto): +20 min até a exaustão.
 *   BURDON2017: meta-análise de cruzados randomizados, 19 estudos, 188 participantes, 91% homens;
 *     nenhum efeito agrupado significativo; nenhum modificador (duração, momento, carga glicêmica, aptidão).
 */
export const BEATS: readonly string[] = [
    '1991: lentilha uma hora antes rendeu 20 minutos a mais que batata.',
    'Burdon, 2017, juntou 19 estudos. O de 1991 é um deles.',
    'Somados, nenhum efeito do índice glicêmico. Escolha pelo conforto e pela preferência.',
];

export const FOODS = [
    { id: 'lentilha', name: 'lentilha', gi: 'IG baixo', win: true },
    { id: 'batata', name: 'batata', gi: 'IG alto', win: false },
] as const;

export const THOMAS = { value: '+20 min', caption: 'até a exaustão, com a lentilha' } as const;

export const BURDON = {
    studies: 19,
    value: '19 estudos',
    caption: '188 participantes · 91% homens',
    founder: 'Thomas 1991',
    pooled: 'nenhum efeito agrupado',
    modifiers: 'nem duração, horário, carga glicêmica ou aptidão mudaram isso',
    zero: 'efeito nulo',
    pile: '19 estudos somados',
    result: 'p > 0,05',
    sides: ['favorece IG baixo', 'favorece IG alto'] as const,
} as const;

export const DESIGNS: readonly string[] = [
    'cruzado · n = 8 · tempo até a exaustão',
    'meta-análise · cruzados randomizados',
    'meta-análise · cruzados randomizados',
];

export const SOURCES: readonly string[] = [
    'Thomas DE, Brotherhood JR, Brand JC. Int J Sports Med 1991;12(2):180-186.',
    'Burdon CA, Spronk I, Cheng HL, O’Connor HT. Sports Med 2017;47(6):1087-1101.',
    'Burdon CA, Spronk I, Cheng HL, O’Connor HT. Sports Med 2017;47(6):1087-1101.',
];
