/**
 * Slide 124 · O Fígado Prefere Sacarose. Números: dossiê 04 (FUCHS2016, CASEY2000, DECOMBAZ2011, GONZALEZ2017, BLOM1987)
 * e dossiê 01 (TAPPY2010, extração hepática da frutose). Os contornos são desenho; o nível é proporcional ao número.
 */
import { C } from '../kit/palette';

export type Lane = 'sacarose' | 'glicose';

export interface OrganFill {
    from: number;
    to: number;
    /** Texto do valor inicial e final (vírgula decimal). */
    fromText: string;
    toText: string;
}

/** Escalas de desenho: fígado até 100 g, músculo até 160 mmol/L (Fuchs 2016). */
export const LIVER_MAX = 100;
export const MUSCLE_MAX = 160;

export const LANES: readonly { id: Lane; label: string; sub: string; color: string; liver: OrganFill; muscle: OrganFill }[] = [
    {
        id: 'sacarose', label: 'sacarose', sub: 'glicose + frutose', color: C.fructose,
        liver: { from: 53.6, to: 86.8, fromText: '53,6', toText: '86,8 g' },
        muscle: { from: 85, to: 140, fromText: '85', toText: '140' },
    },
    {
        id: 'glicose', label: 'glicose', sub: 'só glicose', color: C.glucose,
        liver: { from: 49.3, to: 65.7, fromText: '49,3', toText: '65,7 g' },
        muscle: { from: 86, to: 136, fromText: '86', toText: '136' },
    },
];

/** Décombaz 2011: síntese hepática líquida (g/h), maltodextrina 2:1 com o açúcar indicado; 69 g/h por 6,5 h. */
export const DECOMBAZ: readonly { label: string; value: number; text: string; color: string }[] = [
    { label: 'malto + galactose', value: 8.6, text: '8,6', color: C.stone },
    { label: 'malto + frutose', value: 8.1, text: '8,1', color: C.fructose },
    { label: 'malto + glicose', value: 3.7, text: '3,7', color: C.glucose },
];
export const DECOMBAZ_MAX = 10;

export interface LiverStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    /** Limitação ou ressalva do passo (linha menor, abaixo do texto). */
    note: string;
    sources: readonly string[];
}

export const LIVER_STEPS: readonly LiverStep[] = [
    {
        tab: 'O desenho',
        headline: 'Exaustão, depois 5 h de açúcar',
        color: C.glucose,
        text: 'Fuchs 2016: 15 ciclistas treinados, ensaio cruzado. Depois de pedalar até a exaustão, cada um tomou 1,5 g/kg/h de sacarose ou de glicose por 5 h. A ¹³C-MRS mede o glicogênio do fígado e do músculo sem biópsia, aos 0, 120 e 300 min; a ressonância mede o volume do fígado.',
        note: 'Limitação: mede glicogênio, não desempenho.',
        sources: ['Fuchs 2016 (J Appl Physiol)'],
    },
    {
        tab: 'Fígado',
        headline: 'Com sacarose, o fígado transborda',
        color: C.fructoseSoft,
        text: 'O glicogênio do fígado foi de 53,6 para 86,8 g com sacarose e de 49,3 para 65,7 g com glicose: +3,4 g/h a favor da sacarose (IC95% 1,6–5,1; P < 0,001). O volume do fígado aumentou só com a sacarose. Explicação provável: o fígado extrai quase toda a frutose que chega pela veia porta.',
        note: 'O mecanismo vem de revisão (Tappy 2010); o estudo mediu o resultado, não a via.',
        sources: ['Tappy 2010 (revisão)'],
    },
    {
        tab: 'Músculo',
        headline: 'No músculo, empate',
        color: C.glycogenSoft,
        text: 'No mesmo estudo, o músculo foi de 85 para 140 mmol/L com sacarose e de 86 para 136 com glicose (P = 0,673). A 1,5 g/kg/h, os dois braços passam da dose que satura a reposição muscular. Frutose sozinha é outra história: 3,2 contra 6,2 mmol/kg/h da sacarose (Blom 1987, n = 5–7 por grupo).',
        note: 'Blom 1987: grupos pequenos e doses a cada 2 h, baixas para hoje.',
        sources: ['Blom 1987 (MSSE)'],
    },
    {
        tab: 'Galactose também',
        headline: 'Outros desenhos, o mesmo dobro',
        color: C.fructoseSoft,
        text: 'Décombaz 2011 (duplo-cego, n = 10): 69 g/h por 6,5 h de maltodextrina com frutose, galactose ou glicose (2:1). Fígado: 8,1 e 8,6 contra 3,7 g/h; volume +9–10% contra +2%. Casey 2000 (n = 6): 1 g/kg em 4 h, +25 g com sacarose e +13 g com glicose; com placebo, nada. Nos dois, o músculo não diferiu.',
        note: 'Desempenho: só o Casey testou; o tempo até a exaustão não diferiu (35, 40 e 46 min).',
        sources: ['Décombaz 2011 (MSSE)', 'Casey 2000 (AJP Endo)'],
    },
    {
        tab: 'A regra',
        headline: 'Músculo pede quantidade. Fígado pede frutose.',
        color: C.text,
        text: 'Gonzalez 2017 (revisão): ≥ 1,2 g/kg/h parece maximizar o músculo, e a frutose não o acelera; o fígado repõe ~2 vezes mais com glicose + frutose ou sacarose. A mistura alivia o intestino acima de ~1,2 g/min. Serve a quem treina de novo no mesmo dia.',
        note: 'Amostras de 6 a 15 ciclistas: falta medir o ganho em prova.',
        sources: ['Gonzalez 2017 (revisão)'],
    },
];

/** Livro-caixa do painel: cada linha entra no passo `at` e fica. */
export const LIVER_LEDGER: readonly { at: number; label: string; value: string; color: string }[] = [
    { at: 1, label: 'fígado · Fuchs 2016', value: '+3,4 g/h', color: C.fructoseSoft },
    { at: 2, label: 'músculo · Fuchs 2016', value: 'igual · P = 0,673', color: C.glycogenSoft },
    { at: 3, label: 'fígado · Décombaz 2011', value: '8,1 · 8,6 × 3,7 g/h', color: C.fructoseSoft },
    { at: 3, label: 'fígado · Casey 2000', value: '+25 × +13 g', color: C.fructoseSoft },
    { at: 4, label: 'síntese · Gonzalez 2017', value: 'fígado ~2×', color: C.text },
];

/** Selos de desenho por passo (canto superior direito). */
export const LIVER_CHIPS: readonly (readonly string[])[] = [
    ['Fuchs 2016 · cruzado · n = 15 · ¹³C-MRS'],
    ['Fuchs 2016 · cruzado · n = 15 · ¹³C-MRS'],
    ['Fuchs 2016 · cruzado · n = 15 · ¹³C-MRS'],
    ['Décombaz 2011 · duplo-cego · n = 10', 'Casey 2000 · n = 6'],
    ['Gonzalez 2017 · revisão'],
];
