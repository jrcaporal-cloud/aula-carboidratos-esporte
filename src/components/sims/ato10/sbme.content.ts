import { C } from '../kit/palette';

/** Slide 181 · A Diretriz Brasileira Parou em 2009 (SBME2009, JEUKENDRUP-JENTJENS2000, JENTJENS2004, BURKE2011 — dossiê 07). */

export interface Milestone {
    year: number;
    who: string;
}

export const MILESTONES: readonly Milestone[] = [
    { year: 2000, who: 'teto de uma fonte' },
    { year: 2004, who: 'glicose + frutose' },
    { year: 2009, who: 'diretriz SBME' },
    { year: 2011, who: 'consenso COI' },
];

export interface LensStat {
    value: string;
    caption: string;
    color: string;
}

export interface Lens {
    line: string;
    /** Anos acesos na linha do tempo. */
    focus: readonly number[];
    stats: readonly LensStat[];
    quote?: string;
    chip?: string;
    design?: string;
}

export const LENSES: readonly Lens[] = [
    {
        line: 'A diretriz brasileira ainda fala em % da energia e põe um teto por hora.',
        focus: [2009],
        stats: [
            { value: '60–70%', caption: 'da energia diária', color: C.stone },
            { value: '5–8 g/kg', caption: 'por dia, para recuperar', color: C.glucose },
            { value: '80 g/h', caption: 'teto durante o exercício', color: C.stone },
        ],
        quote: '“Mesmo com uso combinado de diversos carboidratos, sua ingestão não deve exceder 80g/hora.”',
    },
    {
        line: 'Mas o teto de uma fonte só já tinha sido rompido em 2004, misturando glicose e frutose.',
        focus: [2000, 2004],
        stats: [
            { value: '~1,0 g/min', caption: 'oxidação máxima com uma fonte só (2000)', color: C.co2 },
            { value: '1,26 g/min', caption: 'glicose + frutose, contra 0,83 só glicose', color: C.fructose },
        ],
        chip: '1,26 g/min ≈ 76 g/h oxidados',
        design: 'cruzado · n = 8 · isótopo ¹³C/¹⁴C',
    },
    {
        line: 'Em 2011 o consenso do COI troca % por g/kg e aceita até 90 g/h com mistura.',
        focus: [2011],
        stats: [
            { value: '3–12 g/kg', caption: 'por dia, conforme a carga de treino', color: C.glucose },
            { value: '90 g/h', caption: 'em provas acima de 2,5 h, com transportadores diferentes', color: C.ok },
        ],
    },
    {
        line: 'Por que % engana: os mesmos 60% viram o dobro de carboidrato.',
        focus: [2009],
        stats: [
            { value: '300 g', caption: '60% de 2.000 kcal · 4,3 g/kg num atleta de 70 kg', color: C.glucoseSoft },
            { value: '600 g', caption: '60% de 4.000 kcal · 8,6 g/kg no mesmo atleta', color: C.glucose },
        ],
        chip: 'cálculo: 4 kcal/g',
    },
];

export const SOURCE = 'Hernandez AJ, Nahas RM (eds.). Rev Bras Med Esporte 2009 · Jeukendrup AE, Jentjens R. Sports Med 2000 · Jentjens RL et al. J Appl Physiol 2004 · Burke LM et al. J Sports Sci 2011.';
