import { C } from '../kit/palette';

/**
 * Slide 183 · Como se Mede o Glicogênio. TAYLOR1992, CASEY2000, ROUTLEDGE2019 com HILL2014 e BONE2021, BERGSTROM1967 — dossiê 07.
 * Princípio da bioquímica e do PAS: Bone 2021 (texto completo PMC8308826: biópsia tratada por procedimentos enzimáticos,
 * histoquímicos ou de microscopia; resultado em mmol/kg de peso seco; ultrassom = intensidade de pixel, razão glicogênio:água
 * 1:3 suposta, escore 0–100) e Schaart 2004 (PAS semiquantitativo, vira número com padrão externo; conferidos em 12/11/2026).
 */

export type MethodId = 'biopsia' | 'mrs' | 'us';

export interface MethodLane {
    id: MethodId;
    name: string;
    color: string;
    key: string;
    keyCaption: string;
    pro: string;
    con: string;
}

export const LANES: readonly MethodLane[] = [
    {
        id: 'biopsia', name: 'Biópsia por agulha', color: C.glycogenSoft,
        key: 'CV 9,3%', keyCaption: 'repetida no mesmo dia',
        pro: 'mede direto; o PAS separa fibra por fibra',
        con: 'invasiva, um ponto; elevou AGL e catecolaminas',
    },
    {
        id: 'mrs', name: 'Ressonância de ¹³C', color: C.glycogenSoft,
        key: 'CV 4,3%', keyCaption: 'R = 0,95 contra a biópsia',
        pro: 'sem agulha, repetível; mede o fígado',
        con: 'cara e rara; lê só a região sob a bobina',
    },
    {
        id: 'us', name: 'Ultrassom (escore)', color: C.stone,
        key: 'r = 0,93', keyCaption: 'validação dos criadores',
        pro: 'rápido e barato, à beira do campo',
        con: 'supõe glicogênio preso à água em razão fixa (1:3)',
    },
];

/** Routledge 2019, estudo 1 (rugby league, n = 14): antes × depois do jogo. */
export const ROUTLEDGE = { glycogen: '443 → 271 mmol/kg', score: 'escore 47 → 49', p: 'P = 0,4' } as const;

export interface MethodStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    sources: readonly string[];
}

export const STEPS: readonly MethodStep[] = [
    {
        tab: 'Biópsia',
        headline: 'A agulha que fundou a área',
        text: 'Bergström e colegas biopsiaram o vasto lateral nos anos 1960. O fragmento vai para a bioquímica (o ácido solta a glicose do glicogênio; enzimas medem a glicose) ou para a histologia: o PAS cora o glicogênio de cada fibra, e só vira número com padrão de calibração. Repetida no mesmo dia, a biópsia variou 9,3%.',
        design: 'biópsias repetidas · mesmo dia',
        sources: ['Bergström 1967', 'Schaart 2004 (PAS)', 'Bone 2021 (revisão)', 'Taylor 1992'],
    },
    {
        tab: 'Ressonância ¹³C',
        headline: '¹³C-MRS: o glicogênio sem agulha',
        text: 'No ímã, uma bobina sobre a perna capta o sinal do ¹³C natural do glicogênio; a área do pico acompanha a concentração. Taylor 1992 (n = 8; 6 exames e 3 biópsias no mesmo dia): 87,4 × 88,3 mM, R = 0,95, CV 4,3% × 9,3%. Mede o fígado: Casey 2000 viu +13 g com glicose e +25 g com sacarose em 4 h.',
        design: 'validação · n = 8 · mesmo dia',
        sources: ['Bergström 1967', 'Schaart 2004 (PAS)', 'Bone 2021 (revisão)', 'Taylor 1992', 'Casey 2000'],
    },
    {
        tab: 'Ultrassom',
        headline: 'Ultrassom: a validação de quem vende',
        text: 'O aparelho lê o brilho da imagem e o converte num escore de 0 a 100, supondo que o glicogênio prende água numa razão fixa de 1:3. Hill e San Millán 2014, criadores da tecnologia, em 22 ciclistas: r = 0,93 contra a biópsia antes e 0,94 depois do esforço.',
        design: 'fabricante · n = 22',
        sources: ['Bergström 1967', 'Schaart 2004 (PAS)', 'Bone 2021 (revisão)', 'Taylor 1992', 'Casey 2000', 'Hill & San Millán 2014'],
    },
    {
        tab: 'Teste independente',
        headline: 'O tanque esvaziou; o escore, não',
        text: 'Routledge 2019, 14 jogadores de rugby league: o jogo baixou o glicogênio de 443 para 271 mmol/kg ps na biópsia, e o escore foi de 47 para 49 (P = 0,4). Em 16 ativos, dieta alta × baixa: 531 × 252 mmol/kg, escore 56 × 54 (P = 0,9). Bone 2021: validade “no máximo equívoca”.',
        design: 'independente · n = 14 + 16',
        sources: ['Bergström 1967', 'Schaart 2004 (PAS)', 'Bone 2021 (revisão)', 'Taylor 1992', 'Casey 2000', 'Hill & San Millán 2014', 'Routledge 2019'],
    },
];

/** Comparador do painel: uma linha por método (entra no passo do método). */
export const COMPARE = [
    { at: 0, name: 'Biópsia', precision: 'CV 9,3%', needle: true, liver: false, color: C.glycogenSoft },
    { at: 1, name: '¹³C-MRS', precision: 'CV 4,3%', needle: false, liver: true, color: C.glycogenSoft },
    { at: 2, name: 'Ultrassom', precision: 'r 0,93*', needle: false, liver: false, color: C.stone },
] as const;
