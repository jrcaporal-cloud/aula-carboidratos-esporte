/**
 * Slide 67 · O fígado, o segundo limite. Fontes: dossiê 02 · MURRAY2018 (músculo ~500 g, 300–700; fígado ~80 g, 0–160;
 * ~4 g de glicose no sangue), COYLE1986 (n = 7, 71% do VO₂máx: 3,02 × 4,02 h; glicose 2,5 × 4,2–5,2 mM; glicogênio
 * 51,5 mmol/kg/h nas 2 primeiras horas e 23 na 3ª, igual nos dois; ~5 na hora extra, NS), GONZALEZ2016 (treino não
 * aumenta o fígado); dossiê 01/04 · GONZALEZ2015 (¹³C-RM, n = 14, 3 h, 102 g/h); dossiê 03 · ROTHS2026 (31 estudos,
 * 48 efeitos, SMD −0,16 [−0,30; −0,02], ~24 mmol/kg ps [4–45] em ~100 min). Os níveis dos tanques são didáticos.
 */

export interface TankStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    design: string;
    /** Nível didático dos tanques (0–1); `liver` null = o estudo não mediu o fígado. */
    muscle: number;
    liver: number | null;
    /** Glicose no sangue, mM (ponteiro); null = o passo não mostra. */
    glucose: number | null;
    feed: boolean;
}

const COYLE = 'Coyle 1986 (J Appl Physiol)';

export const TANK_STEPS: readonly TankStep[] = [
    {
        tab: 'Dois tanques',
        headline: 'O pequeno segura o sangue',
        text: 'O músculo guarda ~500 g de glicogênio (300–700 g). O fígado guarda ~80 g (0–160 g), oscila entre as refeições e é ele que segura os ~4 g de glicose do sangue. Em atletas de endurance, o fígado em repouso não é maior: o treino não aumenta esse tanque.',
        sources: ['Murray & Rosenbloom 2018 (revisão)', 'Gonzalez 2016 (revisão)'],
        design: 'estoques médios · revisão',
        muscle: 0.9, liver: 0.9, glucose: null, feed: false,
    },
    {
        tab: 'Placebo',
        headline: 'Sem carboidrato: 3 h',
        text: 'Coyle 1986: 7 ciclistas treinados a 71% do VO₂máx até a fadiga, cruzado com placebo aromatizado. A fadiga veio em 3,02 h, precedida de glicose no sangue a 2,5 mM. O fígado não foi medido: a glicemia é o sinal indireto de que ele não acompanhou.',
        sources: [COYLE],
        design: 'cruzado · n = 7 · 71% do VO₂máx',
        muscle: 0.1, liver: null, glucose: 2.5, feed: false,
    },
    {
        tab: 'Carboidrato',
        headline: 'Com carboidrato: 4 h',
        text: 'Com polímero de glicose (2 g/kg aos 20 min, depois 0,4 g/kg a cada 20 min), a glicemia ficou em 4,2–5,2 mM e a fadiga veio em 4,02 h. O músculo gastou igual nas 3 primeiras horas; a hora extra rodou com glicose do sangue e quase nenhum glicogênio.',
        sources: [COYLE],
        design: 'cruzado · n = 7 · 71% do VO₂máx',
        muscle: 0.1, liver: null, glucose: 4.7, feed: true,
    },
    {
        tab: 'Fígado medido',
        headline: 'O fígado fica; o músculo cai',
        text: 'Gonzalez 2015 mediu os dois por ressonância de ¹³C, sem biópsia: 14 ciclistas, 3 h a 50% da potência máxima, 102 g/h de glicose ou de sacarose. O fígado não caiu com nenhuma; o músculo caiu igual em todas as condições. Limites: água com n = 4; intensidade baixa.',
        sources: ['Gonzalez 2015 (Am J Physiol)'],
        design: 'cruzado · n = 14 · 3 h · 102 g/h',
        muscle: 0.55, liver: 0.9, glucose: null, feed: true,
    },
    {
        tab: 'Meta-análise',
        headline: 'Poupa pouco músculo',
        text: 'Rothschild 2026 juntou 31 estudos cruzados com biópsia (48 efeitos): o carboidrato na prova poupa pouco glicogênio muscular, e nenhum moderador mudou isso (modalidade, tipo e taxa de carboidrato, estoque inicial). O ganho vem da glicemia e do fígado.',
        sources: ['Rothschild 2026 (J Appl Physiol)'],
        design: 'meta-análise · 31 estudos · 48 efeitos',
        muscle: 0.55, liver: 0.9, glucose: null, feed: true,
    },
];

export const GLUCOSE_RANGE = [2, 6] as const;

/** Gonzalez 2015, ¹³C-RM, mmol/L (média). */
export const GONZALEZ_ROWS: readonly (readonly [string, string, string])[] = [
    ['glicose', '325 → 345', '101 → 60'],
    ['sacarose', '321 → 348', '114 → 67'],
    ['só água (n = 4)', '454 → 283', '111 → 67'],
];
