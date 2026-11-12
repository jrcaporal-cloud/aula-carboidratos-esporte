/**
 * Slide 67 · O fígado, o segundo limite. Fontes: dossiê 02 · MURRAY2018 (500 g × 80 g), COYLE1986 (3,02 × 4,02 h;
 * glicose 2,5 mM × 4,2–5,2 mM); dossiê 01 · GONZALEZ2015 (¹³C-RM); dossiê 03 · ROTHS2026 (~24 mmol/kg, SMD −0,16).
 * Os níveis dos tanques são didáticos; os números escritos são os dos estudos.
 */

export interface TankStage {
    lead: string;
    muscle: number;
    /** null = o estudo não mediu o fígado. */
    liver: number | null;
    /** Glicose no sangue, mM (ponteiro do mostrador); null = não se aplica. */
    glucose: number | null;
    feed: boolean;
    design: string;
}

export const TANK_STAGES: readonly TankStage[] = [
    {
        lead: 'Dois tanques: o músculo guarda cerca de 500 g; o fígado, cerca de 80 g, e é ele que segura a glicose do sangue.',
        muscle: 0.9, liver: 0.9, glucose: null, feed: false, design: 'estoques médios, via revisão',
    },
    {
        lead: 'Coyle 1986, com placebo: fadiga em 3 h, com a glicose do sangue em 2,5 mM.',
        muscle: 0.1, liver: null, glucose: 2.5, feed: false, design: 'cruzado · n = 7 ciclistas · 71% do VO₂máx',
    },
    {
        lead: 'Com carboidrato: o músculo gastou igual nas 3 primeiras horas, mas a fadiga só veio em 4 h.',
        muscle: 0.1, liver: null, glucose: 4.7, feed: true, design: 'cruzado · n = 7 ciclistas · 71% do VO₂máx',
    },
    {
        lead: 'Medindo o fígado por ressonância: com carboidrato na prova, ele não cai. O músculo cai do mesmo jeito.',
        muscle: 0.55, liver: 0.9, glucose: null, feed: true, design: 'cruzado · n = 14 ciclistas · 3 h · 102 g/h',
    },
    {
        lead: 'Na meta-análise de 31 estudos, o carboidrato na prova poupa pouco glicogênio muscular.',
        muscle: 0.55, liver: 0.9, glucose: null, feed: true, design: 'meta-análise · 31 estudos · 48 efeitos',
    },
];

export const GLUCOSE_RANGE = [2, 6] as const;

export const TWO_TANKS_SOURCE = 'Murray & Rosenbloom 2018; Coyle 1986; Gonzalez 2015; Rothschild 2026';
