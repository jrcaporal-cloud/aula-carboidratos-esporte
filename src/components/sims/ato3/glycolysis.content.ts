/**
 * Slide 42 · A Escada da Glicólise. Fonte única dos textos e da conta.
 * Via e estequiometria: LEHNINGER2017 (livro-texto). PFK como portão: HEARRIS2018. Lactato: BROOKS2018.
 * PDH × potência: HOWLETT1998 (n = 7, não treinados). ~30–32 ATP: cálculo pelo P/O de HINKLE2005.
 */

export interface GlycoStep {
    /** Nome da aba. */
    tab: string;
    headline: string;
    /** Texto do painel (≤ 40 palavras). */
    text: string;
    /** Uma ou mais fontes do passo; a linha do rodapé acumula. */
    sources: readonly string[];
}

/** Fontes curtas no rodapé; a citação completa fica na tecla D. */
const LEHNINGER = 'Lehninger, 7ª ed., 2017 (cap. 14)';

export const GLYCO_STEPS: readonly GlycoStep[] = [
    {
        tab: 'Investimento',
        headline: 'Primeiro, a fibra paga',
        text: 'A hexoquinase gasta 1 ATP para prender a glicose do sangue na fibra; a PFK-1 gasta outro. A glicose do glicogênio chega pela fosforilase já com fosfato e pula a hexoquinase.',
        sources: [LEHNINGER],
    },
    {
        tab: 'O portão',
        headline: 'PFK-1: o portão regulado',
        text: 'Três reações não voltam atrás (setas grossas): hexoquinase, PFK-1 e piruvato-quinase. A PFK-1 é a limitante: ADP, AMP e Pi, sinais de ATP em queda, abrem o portão. Depois dele, a aldolase parte a hexose em duas trioses.',
        sources: [LEHNINGER, 'Hearris 2018 (revisão)'],
    },
    {
        tab: 'Pagamento',
        headline: 'O lucro sai em dois degraus',
        text: 'Cada triose rende 1 NADH na GAPDH, 1 ATP na fosfoglicerato-quinase e 1 na piruvato-quinase. São duas trioses, então tudo dobra. O ATP não sai no último degrau: sai em dois.',
        sources: [LEHNINGER],
    },
    {
        tab: 'Duas saídas',
        headline: 'O NAD⁺ precisa voltar',
        text: 'Sem NAD⁺, a GAPDH para. A LDH devolve o NAD⁺ ao formar lactato, mesmo com oxigênio. A outra saída, a PDH, acompanha a potência: 0,53 em repouso, 3,33 a 90% do VO₂máx.',
        sources: [
            'Brooks 2018 (revisão)',
            'Howlett 1998 (PDH, mmol/kg/min)',
            'Hinkle 2005 (P/O)',
        ],
    },
];

/** Selos do canto, por passo (o desenho de onde vem o que está na tela). */
export const GLYCO_CHIPS: readonly (readonly string[])[] = [
    ['via canônica · livro-texto'],
    ['via canônica · livro-texto', 'PFK: revisão'],
    ['via canônica · livro-texto'],
    ['lactato: revisão', 'PDH: n = 7, não treinados'],
];

/** Passo em que o selo de cálculo aparece (saldo e ~30–32 ATP são conta, não dado lido). */
export const CALC_CHIP: Readonly<Record<number, string>> = {
    2: 'saldo: estequiometria',
    3: '~30–32 ATP: cálculo',
};

/** O livro-caixa por glicose: cada linha entra num passo e fica. */
export interface LedgerRow {
    at: number;
    label: string;
    blood: string;
    glycogen: string;
    /** Linha de resultado (vai maior, na cor da glicose). */
    total?: boolean;
}

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'investimento', blood: '−2 ATP', glycogen: '−1 ATP' },
    { at: 2, label: 'pagamento', blood: '+4 ATP', glycogen: '+4 ATP' },
    { at: 2, label: 'NADH', blood: '+2', glycogen: '+2' },
    { at: 2, label: 'saldo', blood: '2 ATP', glycogen: '3 ATP', total: true },
];
