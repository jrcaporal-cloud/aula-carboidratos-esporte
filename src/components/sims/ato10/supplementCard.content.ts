import { C } from '../kit/palette';
import type { DecideRow } from './DecideShell';

/**
 * Slide 192 · O Cartão do Carboidrato. Do g/h do «Relógio da Prova» ao que vai no bolso.
 * Unidades: MAUGHAN2018 (consenso do COI, tabela 2, texto completo — dossiê 07): gel ~25 g, bebida 5–8%, goma ~5 g,
 * barra 40–50 g. Formato × oxidação: HEAR2022 (n = 9, ¹³C) e PFEI2010G (gel + água = bebida). Fonte única até ~60 g/h:
 * JEUK2000 + JEUK2014. Bebida 6–8% a cada 10–15 min: KERK2017 (ISSN). Mistura: HULST2009 (nula a ~48 g/h), CURR2008
 * (2:1, +8%), OBRI2011 (0,8:1). Gel de 30 g 2:1 a cada 20 min = protocolo de COST2017 (dossiê 03).
 * Os exemplos em gramas (500 mL a 6% = 30 g; gel + 500 mL a 7% = 60 g; ~1,1 L/h a 8%; 60 + 30 e 50 + 40 g) são CÁLCULO.
 * Sem marca comercial.
 */

export type UnitKind = 'gel' | 'drink' | 'gummy' | 'bar';

export interface UnitTile {
    kind: UnitKind;
    name: string;
    grams: string;
    sub: string;
}

export const UNITS: readonly UnitTile[] = [
    { kind: 'gel', name: 'gel', grams: '~25 g', sub: 'sachê de 30–40 g' },
    { kind: 'drink', name: 'bebida', grams: '5–8%', sub: '25–40 g/500 mL' },
    { kind: 'gummy', name: 'goma', grams: '~5 g', sub: 'por unidade' },
    { kind: 'bar', name: 'barra', grams: '40–50 g', sub: '+ 5–10 g de proteína' },
];

/** Uma hora de prova: o que entra e quando (minuto). `water` = gole de água, sem carboidrato. */
export type TokenKind = 'gel' | 'gelMix' | 'sip' | 'water';

export interface HourRow {
    at: number;
    goal: string;
    total: string;
    tokens: readonly { kind: TokenKind; min: number }[];
    caption: string;
    color: string;
}

const SIPS = [0, 15, 30, 45].map(min => ({ kind: 'sip' as const, min }));

export const HOUR_ROWS: readonly HourRow[] = [
    {
        at: 1, goal: '30 g/h', total: '30 g', color: C.glucose, tokens: SIPS,
        caption: '500 mL a 6%, em 4 goles de 125 mL',
    },
    {
        at: 1, goal: '60 g/h', total: '60 g', color: C.glucose, tokens: [...SIPS, { kind: 'gel', min: 22 }],
        caption: '1 gel (~25 g) + 500 mL a 7% (35 g)',
    },
    {
        at: 2, goal: '90 g/h', total: '90 g', color: C.fructose,
        tokens: [0, 20, 40].flatMap(min => [{ kind: 'gelMix' as const, min }, { kind: 'water' as const, min: min + 10 }]),
        caption: 'gel de 30 g (glicose:frutose 2:1) a cada 20 min, com água',
    },
];

/** Como montar 90 g/h nas duas proporções estudadas (gramas = cálculo). */
export const MIXES = [
    { ratio: '2:1', glucose: 60, fructose: 30, note: 'Currell 2008 · Costa 2017' },
    { ratio: '1:0,8', glucose: 50, fructose: 40, note: "O'Brien 2011" },
] as const;

export interface CardStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    sources: readonly string[];
}

export const CARD_STEPS: readonly CardStep[] = [
    {
        tab: 'As unidades', color: C.glucose,
        headline: 'Cada formato tem um número',
        text: 'Para o COI, gel, bebida, goma e barra são alimento esportivo de conveniência: o efeito vem do carboidrato que carregam. A 120 g/h, bebida, gel e goma oxidaram igual (1,56, 1,58 e 1,59 g/min; n = 9, ¹³C). Escolha pelo que o atleta tolera e consegue carregar.',
        sources: ['Maughan 2018 (COI)', 'Hearris 2022'],
    },
    {
        tab: '30 a 60 g/h', color: C.glucose,
        headline: 'Até 60 g/h, uma fonte basta',
        text: 'Glicose ou maltodextrina sozinhas oxidam até ~1,0–1,1 g/min: o limite é o intestino, não o músculo. A ISSN orienta bebida de 6–8%, em goles a cada 10–15 min. Na conta: 500 mL a 6% dão 30 g; um gel mais 500 mL a 7% fecham 60 g.',
        sources: ['Jeukendrup 2000', 'Kerksick 2017 (ISSN)'],
    },
    {
        tab: '90 g/h', color: C.fructose,
        headline: 'Acima de 60 g/h, só com mistura',
        text: 'A glicose satura o SGLT1; a frutose entra pelo GLUT5. Com 2:1 a 108 g/h, contrarrelógio 8% mais rápido que só glicose (n = 8); 0,8:1 oxidou 1,14 × 1,04 g/min, com menos náusea (n = 10). Só de bebida a 8%, seriam ~1,1 L/h; gel com água oxida igual à bebida.',
        sources: ['Currell 2008', "O'Brien 2011", 'Pfeiffer 2010', 'Hulston 2009', 'Costa 2017'],
    },
];

export const CARD_DESIGNS = [
    'consenso do COI 2018 · n = 9, ¹³C',
    'posição ISSN 2017',
    'ECRs cruzados · n = 8 e n = 10',
] as const;

export const CARD_LEDGER: readonly DecideRow[] = [
    { at: 0, term: 'formato (bebida, gel, goma)', value: 'oxidação igual', color: C.ok },
    { at: 1, term: 'fonte única oxida até', value: '~60 g/h', color: C.glucose },
    { at: 1, term: 'bebida (ISSN)', value: '6–8% · 10–15 min', color: C.glucose },
    { at: 2, term: 'mistura a ~48 g/h', value: 'sem vantagem', color: C.stone },
    { at: 2, term: '90 g/h só de bebida a 8%', value: '~1,1 L/h', color: C.fructoseSoft },
];
