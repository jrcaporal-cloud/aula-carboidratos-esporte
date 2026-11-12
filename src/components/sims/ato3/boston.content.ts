/** Slide 48 · Boston, 1923. Levine, Gordon & Derick (JAMA 1924) citado em HEARRIS2018: original NÃO lido. */

export const BOSTON_STEPS = [
    {
        phrase: 'Boston, 1923. Levine e colegas medem a glicose no sangue de maratonistas ao cruzar a chegada.',
        source: 'Levine SA, Gordon B, Derick CL. JAMA 1924;82:1778-9, citado em Hearris MA et al. Nutrients 2018;10(3):298.',
    },
    {
        phrase: 'Na chegada, a glicemia estava abaixo de 4 mmol/L: hipoglicemia no fim da prova.',
        source: 'Hearris MA et al. Nutrients 2018;10(3):298 (revisão que cita Levine 1924).',
    },
    {
        phrase: 'Fica a pista: a fadiga tardia tem um pé no sangue. Copenhague e Austin vão testá‑la.',
        source: 'Christensen & Hansen 1939 · Coggan & Coyle 1987 (próximo slide).',
    },
] as const;

export const ROUTE_MARKS = [0, 10, 20, 30, 42.195] as const;

export const HISTORY = [
    { year: '1923', place: 'Boston', what: 'glicemia baixa na chegada' },
    { year: '1939', place: 'Copenhague', what: 'glicose na exaustão' },
    { year: '1987', place: 'Austin', what: 'glicose na veia' },
] as const;
