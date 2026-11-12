/**
 * Slide 123 · 24 Horas: o Total Manda. Números: dossiê 04 (KEIZER1987, BURKE1996, BURKE1993, BURKE2003,
 * BURKE2017, KERKSICK2017). Cada linha do livro-caixa tem a sua unidade e a sua escala: não comparar entre linhas
 * (Keizer em mmol/kg sem a base declarada no resumo; Burke em mmol/kg de peso úmido).
 */

export interface TotalStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const TOTAL_STEPS: readonly TotalStep[] = [
    {
        tab: 'Forma',
        headline: 'Sólido ou líquido: tanto faz',
        text: 'Keizer 1987, cruzado, 8 homens, a mesma quantidade de CHO depois da depleção: às 5 h, o glicogênio foi de 72 para 198 com sólido e de 69 para 192 mmol/kg com líquido. Às 22 h, a recuperação estava completa nos dois. O braço que comeu à vontade (n = 4) recuperou menos.',
        sources: ['Keizer 1987'],
    },
    {
        tab: 'Frequência',
        headline: '4 refeições ou 16 lanches: sem diferença',
        text: 'Burke 1996, 8 triatletas, 10 g/kg em 24 h divididos em 4 refeições grandes ou em 16 lanches: 74,1 contra 94,5 mmol/kg de peso úmido, diferença não significativa. Com o total garantido, fracionar vira escolha de apetite, intestino e rotina.',
        sources: ['Burke 1996'],
    },
    {
        tab: 'IG',
        headline: 'Em 24 h, alto IG repõe mais',
        text: 'Burke 1993, cruzado, 5 ciclistas, 10 g/kg em 24 h só de alto ou só de baixo IG: o glicogênio subiu 106 contra 71,5 mmol/kg ww (P = 0,02). É o contrário do conselho de pré-treino. Limites: n = 5, sem desempenho; parte do CHO de baixo IG pode não ter sido absorvida.',
        sources: ['Burke 1993'],
    },
    {
        tab: 'Álcool',
        headline: 'O álcool atrapalha tirando o CHO do prato',
        text: 'Burke 2003, cruzado, 9 ciclistas, 24 h: com 1,5 g/kg de álcool no lugar da energia do CHO, 68 contra 82 mmol/kg ww (às 8 h, 24,4 contra 44,6; n = 6). Com o álcool somado à dieta, 85: igual ao controle. O estrago principal é deslocar a comida; o efeito direto é incerto.',
        sources: ['Burke 2003'],
    },
    {
        tab: 'O total',
        headline: 'Em 24 h, o total manda',
        text: 'Burke 2017 (revisão): de 4 a 24 h, o total de CHO precisa cobrir a demanda, e tipo, forma e padrão importam menos. A ISSN 2017 fala em 8–12 g/kg/d para maximizar os estoques. E glicogênio reposto não é atleta recuperado: no Keizer, a capacidade máxima caiu mesmo assim.',
        sources: ['Burke 2017 (revisão)', 'ISSN 2017'],
    },
];

export const TOTAL_CHIPS: readonly (readonly string[])[] = [
    ['Keizer 1987 · cruzado · n = 8'],
    ['Burke 1996 · n = 8 triatletas'],
    ['Burke 1993 · cruzado · n = 5'],
    ['Burke 2003 · cruzado · n = 9'],
    ['revisão', 'posicionamento ISSN'],
];

export type Verdict = 'same' | 'differs';

export interface ArmBar {
    label: string;
    value: number;
    text: string;
    /** Braço de referência (barra cheia) ou comparação (contorno). */
    solid: boolean;
}

export interface StudyRow {
    at: number;
    question: string;
    study: string;
    unit: string;
    arms: readonly ArmBar[];
    verdict: string;
    kind: Verdict;
}

export const ROWS: readonly StudyRow[] = [
    {
        at: 0, question: 'Sólido ou líquido?', study: 'Keizer 1987', unit: 'às 5 h',
        arms: [
            { label: 'sólido · de 72', value: 198, text: '198', solid: true },
            { label: 'líquido · de 69', value: 192, text: '192', solid: false },
        ],
        verdict: 'igual', kind: 'same',
    },
    {
        at: 1, question: 'Refeições ou lanches?', study: 'Burke 1996', unit: 'às 24 h, ww',
        arms: [
            { label: '4 refeições', value: 74.1, text: '74,1', solid: true },
            { label: '16 lanches', value: 94.5, text: '94,5', solid: false },
        ],
        verdict: 'sem diferença', kind: 'same',
    },
    {
        at: 2, question: 'Alto ou baixo IG?', study: 'Burke 1993', unit: 'ganho 24 h, ww',
        arms: [
            { label: 'alto IG', value: 106, text: '106', solid: true },
            { label: 'baixo IG', value: 71.5, text: '71,5', solid: false },
        ],
        verdict: 'alto IG: P = 0,02', kind: 'differs',
    },
    {
        at: 3, question: 'E o álcool?', study: 'Burke 2003', unit: 'às 24 h, ww',
        arms: [
            { label: 'controle', value: 82, text: '82', solid: true },
            { label: 'no lugar do CHO', value: 68, text: '68', solid: false },
            { label: 'somado', value: 85, text: '85', solid: false },
        ],
        verdict: 'trocar: menos', kind: 'differs',
    },
];

/** O resumo do painel: cada item entra num passo e fica. */
export const MATTERS_LITTLE: readonly { text: string; at: number }[] = [
    { text: 'sólido × líquido', at: 0 },
    { text: 'nº de refeições', at: 1 },
];

export const MATTERS: readonly { text: string; at: number }[] = [
    { text: 'alto IG (em 24 h)', at: 2 },
    { text: 'álcool no lugar do CHO', at: 3 },
    { text: 'o total: 8–12 g/kg/d', at: 4 },
];
