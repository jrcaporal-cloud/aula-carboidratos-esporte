/**
 * Slide 140 · A perna que treinou com fome. Desenho e resultado: 05·HANSEN2005 (o "TTE dobrou" NÃO entra: o resumo
 * não traz o número). Sinal: 01·MCBRIDE2009 (in vitro), 02·MACDONALD2003 (n = 8), 02/05·BARTLETT2013 (n = 8),
 * 05·LANE2015 (n = 7). Níveis das coxas: ilustrativos.
 */

export interface HansenStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
}

export const HANSEN_STEPS: readonly HansenStep[] = [
    {
        tab: 'Duas pernas',
        headline: 'O corpo é o próprio controle',
        text: 'Hansen 2005, Copenhague: 7 homens não treinados, extensão de joelho de uma perna, 10 semanas. A perna LOW treinava 1 h, descansava 2 h em jejum e treinava mais 1 h, a cada 2 dias; a HIGH treinava 1 h por dia. Mesma carga total. Mesma genética, mesmo sangue, mesma dieta: só muda o glicogênio na hora do treino.',
        sources: ['Hansen 2005 (J Appl Physiol)'],
    },
    {
        tab: 'A 2ª sessão',
        headline: 'O tanque baixo liga o sinal',
        text: 'A 2ª sessão começa com pouco glicogênio. A AMPK tem um domínio na subunidade β que se liga ao glicogênio e é inibida por ele (in vitro). Em 8 homens treinados, a α2-AMPK só subiu no exercício com o tanque depletado. Bartlett (n = 8): com o glicogênio LOW (103 × 467 mmol/kg ps no HIGH), mais p-ACC, o alvo da AMPK (2,9 × 1,4), e mais p-p53 (2,6 × 0,9). No sleep low, AMPK e p38 amanhecem mais fosforiladas.',
        sources: ['McBride 2009 (Cell Metab, in vitro)', 'MacDonald 2003 (J Appl Physiol)', 'Bartlett 2013 (AJP Regul)', 'Lane 2015 (J Appl Physiol)'],
    },
    {
        tab: 'O resultado',
        headline: 'Mesma força, mais resistência',
        text: 'A carga máxima subiu igual nas duas pernas. O tempo até a exaustão a 90% subiu "acentuadamente mais" na LOW, e HAD (β-oxidação) e glicogênio de repouso só subiram de forma significativa nela.',
        sources: [],
    },
    {
        tab: 'A ressalva',
        headline: 'Prova de conceito, não prescrição',
        text: 'n = 7, não treinados, uma perna só (pouca massa muscular), TTE pouco reprodutível. E o sinal tem nuance: o PGC-1α subiu ~3× com o exercício, com ou sem carboidrato. O "dobrou" que circula não está no resumo: não citamos.',
        sources: [],
    },
];

/** Resultado de Hansen 2005 (lido no resumo; sem os números do TTE). */
export interface HansenRow {
    label: string;
    low: string;
    high: string;
    /** A perna LOW se destacou? */
    lowWins: boolean;
}

export const HANSEN_ROWS: readonly HansenRow[] = [
    { label: 'carga máxima', low: '↑ igual', high: '↑ igual', lowWins: false },
    { label: 'TTE a 90%', low: '↑ bem mais', high: '↑', lowWins: true },
    { label: 'HAD', low: '↑ signif.', high: '↑ n.s.', lowWins: true },
    { label: 'glicogênio de repouso', low: '↑ signif.', high: '↑ n.s.', lowWins: true },
];

/** Nível ilustrativo das coxas por passo [HIGH, LOW]. */
export const LEG_LEVELS: readonly (readonly [number, number])[] = [[0.8, 0.8], [0.8, 0.2], [0.84, 0.96], [0.84, 0.96]];
