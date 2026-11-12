/** Slide 42 · A Escada da Glicólise. PFK: HEARRIS2018; lactato: BROOKS2018; ATP total = cálculo pelo P/O (HINKLE2005). */

export interface Stair {
    label: readonly string[];
    /** Selo de ATP no degrau (gasto ou ganho). */
    atp?: string;
}

/** Degraus de cima para baixo (a glicose "desce" em energia). */
export const STAIRS: readonly Stair[] = [
    { label: ['glicose'] },
    { label: ['glicose-6-P'], atp: '−1 ATP' },
    { label: ['frutose-6-P'] },
    { label: ['frutose-', '1,6-bisP'], atp: '−1 ATP' },
    { label: ['2 triose-P'] },
    { label: ['2 piruvato'], atp: '+4 ATP' },
];

export interface GlycoStep {
    phrase: string;
    /** Quantos degraus estão acesos. */
    lit: number;
    gateOpen: boolean;
    fork: boolean;
    source: string;
}

export const GLYCO_STEPS: readonly GlycoStep[] = [
    {
        phrase: 'A glicose desce uma escada de reações. Já no primeiro degrau a fibra gasta ATP: investe antes de lucrar.',
        lit: 3, gateOpen: false, fork: false,
        source: 'Hearris MA et al. Nutrients 2018;10(3):298 (revisão).',
    },
    {
        phrase: 'A PFK é o portão da escada. ADP, AMP e Pi, os sinais de ATP em queda, abrem a passagem.',
        lit: 4, gateOpen: true, fork: false,
        source: 'Hearris MA et al. Nutrients 2018;10(3):298 (revisão).',
    },
    {
        phrase: 'Na descida, a glicose devolve 4 ATP. Saldo de 2 por glicose: pouco, mas rápido e sem oxigênio.',
        lit: 6, gateOpen: true, fork: false,
        source: 'Estequiometria da glicólise (saldo calculado).',
    },
    {
        phrase: 'O piruvato tem duas saídas, e as duas funcionam o tempo todo. Lactato é saída normal, não erro.',
        lit: 6, gateOpen: true, fork: true,
        source: 'Brooks GA. Cell Metab 2018;27:757-85 · Hinkle PC. Biochim Biophys Acta 2005;1706:1-11 (P/O).',
    },
];
