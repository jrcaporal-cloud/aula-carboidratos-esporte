/** Slide 49 · O Resgate pela Veia. COGGAN1987 (n = 7, cruzado); CHRISTENSEN1939 (via Noakes 2022 / Bergström 1967); NYBO2003 (n = 8). */

export const RESCUE_STEPS = [
    {
        phrase: 'Austin, 1987. Sete ciclistas pedalam a 70% do VO₂máx até a exaustão, e a glicemia despenca.',
        source: 'Coggan AR, Coyle EF. J Appl Physiol 1987;63(6):2388-95.',
    },
    {
        phrase: '20 min de descanso. Depois, nova tentativa com placebo, carboidrato oral ou glicose na veia.',
        source: 'Coggan AR, Coyle EF. J Appl Physiol 1987;63(6):2388-95.',
    },
    {
        phrase: 'Glicose na veia: 43 min a mais, com o glicogênio da coxa parado em ~40 mmol/kg. Faltava açúcar no sangue.',
        source: 'Coggan AR, Coyle EF. J Appl Physiol 1987;63(6):2388-95.',
    },
    {
        phrase: 'Copenhague já tinha visto isso em 1939: 200 g de glicose em dois atletas exaustos, e cerca de mais 1 h.',
        source: 'Christensen EH, Hansen O. Skand Arch Physiol 1939;81:172-9, segundo Noakes TD. Nutrients 2022;14:862.',
    },
    {
        phrase: 'A hipoglicemia cansa também o comando: com placebo, o cérebro ativou menos o músculo, e a força caiu.',
        source: 'Nybo L. Med Sci Sports Exerc 2003;35(4):589-94.',
    },
] as const;

export const LANES = [
    { key: 'pla', label: 'placebo', minutes: 10, text: '10 min', color: '#94A3B8' },
    { key: 'oral', label: 'carboidrato oral', minutes: 26, text: '26 min', color: '#FCD34D' },
    { key: 'iv', label: 'glicose IV · 1,13 g/min', minutes: 43, text: '43 min', color: '#F59E0B' },
] as const;

/** Força média na contração sustentada de 2 min (N), após 3 h de bicicleta (NYBO2003). */
export const FORCE = [
    { label: 'antes', value: 248, text: '248 N', key: 'b' },
    { label: 'com glicose', value: 222, text: '222 N', key: 'g' },
    { label: 'com placebo', value: 197, text: '197 N', key: 'p' },
] as const;
