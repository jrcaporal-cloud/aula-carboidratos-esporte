/**
 * Slide 110 · O Bochecho. CART2004I, CART2004B, CHAM2009 e BURKE2011 (efeito central), dossiê 03, bloco H.
 * Arquivo só deste slide (o rinse.content.ts é dividido com o slide 111). O corte do cérebro é esquema.
 */

export interface TimeRow {
    label: string;
    min: number;
    text: string;
    strong: boolean;
}

/** Eixo dos cronômetros (zoom honesto: não começa no zero). */
export const AXIS = [58, 62] as const;

export interface RinseColumn {
    title: string;
    study: string;
    lines: readonly string[];
    rows: readonly TimeRow[];
    verdict: string;
    good: boolean;
}

export const COLUMNS: readonly RinseColumn[] = [
    {
        title: 'Na veia',
        study: 'Carter 2004 · n = 6 · 1 g/min',
        lines: ['glicemia 12,4 × 5,9 mmol/L'],
        rows: [
            { label: 'glicose IV', min: 59.9, text: '59,90', strong: true },
            { label: 'soro', min: 60.04, text: '60,04', strong: false },
        ],
        verdict: 'prova igual',
        good: false,
    },
    {
        title: 'Na boca',
        study: 'Carter 2004 · n = 9 · jejum',
        lines: ['malto 6,4% · 5 s · cuspido'],
        rows: [
            { label: 'bochecho', min: 59.57, text: '59,57', strong: true },
            { label: 'água', min: 61.37, text: '61,37', strong: false },
        ],
        verdict: '−1,8 min',
        good: true,
    },
];

/** Regiões do esquema (Chambers 2009), numeradas no desenho. */
export const REGIONS = [
    { n: 1, name: 'ínsula/opérculo frontal' },
    { n: 2, name: 'orbitofrontal' },
    { n: 3, name: 'estriado' },
    { n: 4, name: 'cingulado anterior' },
] as const;

/** Quem acendeu o quê no fMRI e o cronômetro de cada bochecho (Chambers 2009, n = 8 + 8). */
export const FMRI = [
    { rinse: 'glicose', regions: '1 2 3 4', time: '60,4 × 61,6 min', on: true },
    { rinse: 'malto (sem doce)', regions: '1 2 3', time: '62,6 × 64,6 min', on: true },
    { rinse: 'sacarina (doce)', regions: '3 e 4 não', time: 'placebo', on: false },
] as const;

export interface RinseStep {
    tab: string;
    headline: string;
    text: string;
    chip: string;
    /** Dado-chave do painel. */
    key: string;
    keyCaption: string;
    sources: readonly string[];
}

export const RINSE_STEPS: readonly RinseStep[] = [
    {
        tab: 'Na veia',
        headline: 'Glicose no sangue não muda 1 h',
        text: 'Carter 2004, cruzado, 6 ciclistas: glicose IV a 1 g/min levou a glicemia a 12,4 mmol/L e o músculo captou quase o dobro. O contrarrelógio de ~1 h não mudou: 59,90 × 60,04 min.',
        chip: 'ECR cruzado · n = 6 · IV × soro',
        key: '12,4',
        keyCaption: 'mmol/L de glicemia, e a prova igual',
        sources: ['Carter 2004a, MSSE (infusão)'],
    },
    {
        tab: 'Na boca',
        headline: 'Sem engolir nada, ~2 min a menos',
        text: 'Mesmo grupo, mesmo ano, 9 ciclistas em jejum: bochecho de 5 s com maltodextrina, cuspido, a cada 12,5% do trabalho. 59,57 × 61,37 min (p = 0,011); potência 259 × 252 W. FC e esforço percebido iguais.',
        chip: 'ECR cruzado · n = 9 · placebo de água',
        key: '−1,8 min',
        keyCaption: 'sem engolir nada (~2,9%)',
        sources: ['Carter 2004b, MSSE (bochecho) · ~2,9%: cálculo'],
    },
    {
        tab: 'No cérebro',
        headline: 'A boca avisa o cérebro',
        text: 'Chambers 2009: glicose e maltodextrina, que não é doce, melhoraram o contrarrelógio contra adoçante. No fMRI, ativaram ínsula, orbitofrontal e estriado; a sacarina não ativou cingulado nem estriado. O sinal é central (Burke 2011).',
        chip: 'ECRs cruzados + fMRI · n = 8 + 8',
        key: '0 g',
        keyCaption: 'engolidos: o sinal sai da boca',
        sources: ['Chambers 2009, J Physiol', 'Burke 2011 (efeito central)'],
    },
];

/** O que cada estudo usou de controle (a pergunta da turma é sobre isso). Acumula. */
export const CONTROLS = [
    { at: 0, study: 'Carter, veia', control: 'soro fisiológico' },
    { at: 1, study: 'Carter, boca', control: 'água: sabor diferente' },
    { at: 2, study: 'Chambers', control: 'adoçante: doce, sem CHO' },
] as const;
