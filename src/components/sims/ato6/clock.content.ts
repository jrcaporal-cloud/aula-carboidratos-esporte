import { C } from '../kit/palette';

/**
 * Slide 112 · O Relógio da Prova (síntese prática do Ato VI). Fonte única dos textos e números.
 * Faixas: BURKE2011 (consenso do COI, abstract conferido). Mecanismo por duração: STELL2014 (61 ECRs, n = 679).
 * Fonte única até ~60 g/h, g/h independente do peso e misturas a partir da 3ª hora: JEUK2014 (texto completo).
 * Fronteira 120 g/h: MORTON2026 (texto completo) + PODL2022 (n = 11, ¹³C). Ultramaratona: TILLER2019 (ISSN).
 * NÃO entram: as faixas intermediárias da Fig. 1 de Jeukendrup 2014 e a tabela de Thomas 2016 (não lidas na fonte).
 */

/** O mostrador é um relógio de 12 h: a prova começa no 12 e o ponteiro anda com a duração. */
export const CLOCK_HOURS = 12;

export interface ClockRow {
    id: 'curta' | 'media' | 'longa' | 'fronteira' | 'ultra';
    /** Passo em que a linha entra no quadro (e fica). */
    at: number;
    duration: string;
    /** Linha de apoio da duração. */
    durationSub: string;
    dose: string;
    /** Que carboidrato e como. */
    how: string;
    /** Por quê (mecanismo) e de que nível é a evidência. */
    why: string;
    color: string;
}

export const ROWS: readonly ClockRow[] = [
    {
        id: 'curta', at: 0, duration: '~1 h', durationSub: 'intensa', dose: 'bochecho', color: C.text,
        how: 'ou pouco; tipo e dose não importam', why: 'sinal: boca → cérebro · consenso + RS',
    },
    {
        id: 'media', at: 1, duration: '1–2,5 h', durationSub: 'mais longas', dose: '30–60 g/h', color: C.glucose,
        how: 'uma fonte basta: glicose ou maltodextrina', why: 'combustível · uma só oxida até ~60 g/h',
    },
    {
        id: 'longa', at: 2, duration: '> 2,5 h', durationSub: 'endurance', dose: 'até 90 g/h', color: C.fructose,
        how: 'só com mistura glicose + frutose', why: 'combustível por duas pistas: SGLT1 + GLUT5',
    },
    {
        id: 'fronteira', at: 3, duration: '> 2,5 h', durationSub: 'treinados', dose: '120 g/h', color: C.stone,
        how: 'tolerável e oxida mais (1,51 × 1,29 g/min)', why: 'fronteira · ganho de desempenho não provado',
    },
    {
        id: 'ultra', at: 4, duration: 'ultra', durationSub: 'ISSN 2019', dose: '30–50 g/h', color: C.co2,
        how: 'de alimentos variados (150–400 kcal/h)', why: 'posição: intensidade e tolerância mudam a meta',
    },
];

/** Faixas do mostrador (horas de prova). A fronteira é um anel externo tracejado sobre a faixa longa. */
export interface DialBand {
    id: ClockRow['id'];
    from: number;
    to: number;
    color: string;
    /** O que aparece no centro do mostrador quando a faixa está ativa. */
    center: string;
    centerSub: string;
}

export const DIAL_BANDS: readonly DialBand[] = [
    { id: 'curta', from: 0, to: 1, color: C.text, center: 'bochecho', centerSub: 'ou pouco' },
    { id: 'media', from: 1, to: 2.5, color: C.glucose, center: '30–60', centerSub: 'g/h' },
    { id: 'longa', from: 2.5, to: CLOCK_HOURS, color: C.fructose, center: 'até 90', centerSub: 'g/h, mistura' },
];

/** Centro do mostrador nos passos que não são de uma faixa só. */
export const DIAL_CENTER_EXTRA = [
    { center: '120', centerSub: 'g/h, treinados', color: C.stone },
    { center: 'g/h', centerSub: 'não g/kg', color: C.text },
] as const;

/** Os dois casos fictícios que caem no relógio (Ato I): onde ficam no mostrador. */
export const CASES = [
    { id: 'marina', letter: 'M', hours: 3.5, label: 'Marina', detail: 'maratona, ~3h30 · 58 kg' },
    { id: 'diego', letter: 'D', hours: 10, label: 'Diego', detail: 'Ironman, ~10 h · 72 kg' },
] as const;

export interface ClockStep {
    tab: string;
    headline: string;
    text: string;
    color: string;
    /** Selos de desenho do passo (canto superior direito). */
    chips: readonly string[];
    sources: readonly string[];
}

const BURKE = 'Burke et al., J Sports Sci 2011 (consenso do COI)';

export const CLOCK_STEPS: readonly ClockStep[] = [
    {
        tab: '~1 hora', color: C.text, chips: ['consenso do COI', 'revisão sistemática · 61 ECRs'],
        headline: 'Na prova curta, a boca manda',
        text: 'Em ~1 h de esforço intenso, o consenso aceita pequenas quantidades e até o bochecho. Na revisão de 61 ECRs (n = 679), o efeito nessa duração é oral e central: tipo e quantidade de carboidrato são irrelevantes.',
        sources: [BURKE, 'Stellingwerff & Cox, Appl Physiol Nutr Metab 2014'],
    },
    {
        tab: '1 a 2,5 h', color: C.glucose, chips: ['consenso do COI', 'revisão narrativa'],
        headline: 'Combustível: 30–60 g/h',
        text: 'Com mais tempo de prova, o carboidrato vira combustível e o ganho cresce com a duração (p = 0,0036 na mesma revisão). Uma fonte única, glicose ou maltodextrina, é oxidada até ~60 g/h: cabe inteira nesta faixa.',
        sources: ['Jeukendrup, Sports Med 2014'],
    },
    {
        tab: '> 2,5 h', color: C.fructose, chips: ['consenso do COI', 'revisão narrativa'],
        headline: 'Até 90 g/h, com mistura',
        text: 'Acima de 2,5 h o consenso sobe para até 90 g/h, mas só com carboidratos de transportadores diferentes: glicose pelo SGLT1, frutose pelo GLUT5. O benefício das misturas aparece em estudos de 2,5 h ou mais, a partir da 3ª hora.',
        sources: [],
    },
    {
        tab: '120 g/h', color: C.stone, chips: ['ECR cruzado · n = 11 · ¹³C', 'fronteira experimental'],
        headline: 'A fronteira: 120 g/h',
        text: 'Em ciclistas treinados, 120 g/h oxidou mais que 90 g/h (1,51 × 1,29 g/min), mas a oxidação endógena não mudou (2,15 × 2,20 g/min). Atletas já testam 120–200 g/h; o ganho de desempenho ainda não foi demonstrado.',
        sources: ['Podlogar et al., Eur J Appl Physiol 2022', 'Morton et al., J Nutr 2026'],
    },
    {
        tab: 'Marina e Diego', color: C.text, chips: ['posição ISSN 2019'],
        headline: 'Em g/h, não em g/kg',
        text: 'A meta vale em g/h absolutos: o limite é a absorção, não o tamanho do atleta. Marina e Diego caem na mesma faixa. Na ultramaratona, a ISSN fala em 30–50 g/h.',
        sources: ['Tiller et al., J Int Soc Sports Nutr 2019 (ISSN)'],
    },
];
