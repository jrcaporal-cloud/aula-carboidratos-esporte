/**
 * Slide 82 · Quanto a Carga Rende. Fonte única: dossiê 04 (confirmados no abstract).
 *   MCLAY2007: n = 9 mulheres, cruzado 2 × 2 (dieta × fase), 8,4 × 5,2 g/kg/d por 3 dias; 75 min intermitentes +
 *     contrarrelógio de 16 km: 26,10 × 26,16 min (P = 0,494); fase do ciclo também sem efeito (P = 0,370).
 *   SHERMAN1981: 20,9 km (~1h20): tempo igual.
 *   HAWLEY1997 (revisão NARRATIVA): < 5 min pouco ou nenhum efeito; 60–90 min nenhum (sobra glicogênio);
 *     > 90 min: ~20% no tempo até a exaustão, 2–3% no contrarrelógio; na exaustão ~25 mmol/kg ww.
 *   BURKE2000: ECR cruzado com placebo, n = 7; 9 × 6 g/kg/d por 3 dias; café 2 g/kg 2 h antes e 1 g/kg/h durante
 *     nas duas condições; 100 km com sprints (~2h30): 147,5 × 149,1 min, 259 × 253 W (P = 0,4);
 *     glicogênio 572 × 485 mmol/kg dw (P < 0,05).
 */
export const AXIS_MAX = 180;
export const SPLIT = 90;
export const TICKS: readonly number[] = [0, 30, 60, 90, 120, 150, 180];

export interface GainStep {
    tab: string;
    headline: string;
    text: string;
    design: string;
    source: string;
}

export const STEPS: readonly GainStep[] = [
    {
        tab: 'Até ~90 min',
        headline: 'Em prova curta, o tanque sobra',
        text: 'McLay 2007: 9 mulheres, cruzado 2 × 2, 3 dias com 8,4 contra 5,2 g/kg/d. Depois de 75 min intermitentes, 16 km em 26,10 × 26,16 min (P = 0,494), e a fase do ciclo também não mudou o tempo. Sherman 1981: 20,9 km, tempo igual.',
        design: 'McLay: cruzado 2 × 2 · n = 9 mulheres',
        source: 'McLay et al. 2007 · Sherman et al. 1981',
    },
    {
        tab: 'Acima de ~90 min',
        headline: 'O ganho é de 2–3%, não de 20%',
        text: 'Hawley 1997 é revisão narrativa, não meta-análise. Acima de 90 min, a carga adia a fadiga em ~20% quando o teste é tempo até a exaustão; em distância fixa, o contrarrelógio melhora 2–3%. Entre 60 e 90 min, nenhum ganho: ainda sobra glicogênio no fim.',
        design: 'revisão narrativa, não meta-análise',
        source: 'Hawley et al. 1997 (revisão)',
    },
    {
        tab: 'Com placebo',
        headline: 'Burke 2000: a dieta controle disfarçada',
        text: '7 ciclistas bem treinados, cruzado e controlado por placebo: 3 dias com 9 contra 6 g/kg/d. Contrarrelógio de 100 km com 4 sprints de 4 km e 5 de 1 km: 147,5 × 149,1 min e 259 × 253 W, os dois com P = 0,4.',
        design: 'ECR cruzado · placebo · n = 7',
        source: 'Burke et al. J Appl Physiol 2000',
    },
    {
        tab: 'Por que nulo',
        headline: 'Tanque mais cheio, mesmo cronômetro',
        text: 'O glicogênio subiu (572 × 485 mmol/kg de peso seco, P < 0,05). Mas as duas condições tomaram 2 g/kg no café e 1 g/kg/h durante, e o controle já comia 6 g/kg. Com n = 7 falta poder para ver 1–2%; os autores cogitam expectativa nos estudos sem placebo.',
        design: 'ECR cruzado · placebo · n = 7',
        source: 'Burke et al. J Appl Physiol 2000',
    },
];

export interface NullPin {
    id: string;
    /** Duração da parte medida (min): posição no eixo. */
    at: number;
    title: string;
    result: string;
    detail: string;
}

export const MCLAY: NullPin = { id: 'mclay', at: 26, title: '16 km · McLay 2007', result: '26,10 × 26,16 min', detail: '8,4 × 5,2 g/kg/d · P = 0,494' };
export const SHERMAN: NullPin = { id: 'sherman', at: 80, title: '20,9 km · Sherman 1981', result: 'tempo igual', detail: '3 regimes · corredores' };

export const HAWLEY = {
    title: 'Hawley 1997 · acima de 90 min',
    rows: [
        { label: 'contrarrelógio', value: 3, text: '+2–3%', tt: true },
        { label: 'até a exaustão', value: 20, text: '~20%', tt: false },
    ],
    max: 20,
} as const;

export const BURKE = {
    at: 148,
    title: '100 km · Burke 2000 · placebo',
    rows: [
        { label: 'tempo (min)', a: '147,5', b: '149,1', why: false },
        { label: 'potência (W)', a: '259', b: '253', why: false },
        { label: 'glicogênio (dw)', a: '572', b: '485', why: true },
    ],
    p: 'P = 0,4',
    both: 'nas duas: CHO antes e durante',
} as const;

export const LEDGER = [
    { at: 0, label: 'McLay 2007 · 16 km', value: 'nulo', strong: false },
    { at: 0, label: 'Sherman 1981 · 20,9 km', value: 'nulo', strong: false },
    { at: 1, label: 'Hawley 1997 · > 90 min, contrarrelógio', value: '+2–3%', strong: true },
    { at: 2, label: 'Burke 2000 · 100 km, placebo', value: 'nulo', strong: false },
] as const;

export const TEXT = {
    axis: 'duração da parte medida (min)',
    nil: 'nulo',
    noGain: 'sem ganho',
    short: 'Hawley: tiro de < 5 min, pouco ou nenhum efeito',
    gain: '+2–3% no contrarrelógio',
    ledger: 'duração × efeito da carga',
} as const;
