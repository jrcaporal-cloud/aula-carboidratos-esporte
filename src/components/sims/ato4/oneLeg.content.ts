/** Slide 61 · Dois cientistas, uma bicicleta. Fonte: dossiê 02/04 (BERGSTROM1966, via Stout 2025 e Solem 2025). */

export interface LegStage {
    /** Rótulo da parada na régua dos dias. */
    stop: string;
    lead: string;
    /** Nível ilustrativo do tanque da perna que pedalou (a parada fica sempre em 0,5). */
    worked: number;
    workedTag: string;
}

export const REST_LEVEL = 0.5;

export const LEG_STAGES: readonly LegStage[] = [
    { stop: 'antes', lead: 'Dois cientistas, uma bicicleta: cada um pedala com uma perna. A outra perna é o controle.', worked: 0.5, workedTag: 'igual' },
    { stop: 'exaustão', lead: 'Até a exaustão: só a perna que pedalou esvazia. A parada não muda.', worked: 0.12, workedTag: 'vazia' },
    { stop: '1 dia de CHO alto', lead: 'Depois de 1 dia de dieta rica em carboidrato, a perna exercitada já passa a parada.', worked: 0.6, workedTag: 'acima' },
    { stop: '3º dia', lead: 'No 3º dia, 50–60% acima. A supercompensação é local: só no músculo que trabalhou.', worked: 0.78, workedTag: '+50–60%' },
];

export const ONE_LEG_SOURCE = 'Bergström & Hultman 1966; Stout 2025';
