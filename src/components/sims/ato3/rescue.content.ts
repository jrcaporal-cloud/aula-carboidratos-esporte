/**
 * Slide 49 · O Resgate pela Veia. Cadeia em 4 faixas (ato3/RescueFlow) + raias de tempo e de força.
 * COGGAN1987 (cruzado, n = 7, não cego): 170 ± 9 min; 5,0 → 3,1 mM; R 0,87 → 0,81; 10 / 26 / 43 min; IV 1,13 g/min ≈ ¾ do CHO
 * oxidado; glicemia 5,1 mM na infusão; glicogênio do vasto lateral ~40 mmol/kg sem mudar.
 * NYBO2003 (MSSE, cruzado, n = 8): 4,5 → 3,0 mM; 248 / 222 / 197 N; ativação central ↓ com placebo.
 * NYBO2003 (Acta, n = 6): captação cerebral de glicose 0,34 → 0,28 µmol/g/min.
 * Copenhague 1939 saiu daqui: está no slide de Boston, 1923.
 */

export interface RescueStep {
    tab: string;
    headline: string;
    text: string;
    sources: readonly string[];
    stat: string;
    statCaption: string;
    /** Limitação do desenho, numa linha. */
    limit: string;
}

const COGGAN = 'Coggan & Coyle 1987 (J Appl Physiol)';

export const RESCUE_STEPS: readonly RescueStep[] = [
    {
        tab: 'A exaustão',
        headline: 'Até a primeira exaustão',
        text: 'Coggan e Coyle (Austin, 1987): 7 ciclistas a 70% do VO₂máx até a fadiga, 170 ± 9 min. Na exaustão, a glicose plasmática tinha caído de 5,0 para 3,1 mM e o R de 0,87 para 0,81: menos carboidrato oxidado. Cruzado, 3 condições, 1 semana entre elas.',
        sources: [COGGAN],
        stat: '170 min', statCaption: 'até a primeira fadiga (± 9)',
        limit: 'n = 7; tempo até a exaustão, não prova contra o relógio.',
    },
    {
        tab: 'Três resgates',
        headline: 'Três resgates, três tempos',
        text: 'Depois de 20 min de repouso, nova tentativa com placebo, polímero de glicose oral (3 g/kg) ou glicose na veia em clamp euglicêmico. Tempo extra até a nova fadiga: 10 ± 1, 26 ± 4 (P < 0,05) e 43 ± 5 min (P < 0,01).',
        sources: [COGGAN],
        stat: '43 min', statCaption: 'a mais com glicose IV, contra 10 com placebo',
        limit: 'o placebo oral não cega a infusão; oral e IV diferem na velocidade de entrada.',
    },
    {
        tab: 'Músculo parado',
        headline: 'O glicogênio da coxa ficou parado',
        text: 'Durante a infusão, a glicemia ficou em 5,1 mM e o glicogênio do vasto lateral em ~40 mmol/kg, sem mudar. A glicose infundida (1,13 g/min) respondeu por ~¾ da oxidação de carboidrato: o músculo quase vazio voltou a trabalhar com açúcar do sangue.',
        sources: [COGGAN],
        stat: '~¾', statCaption: 'do carboidrato oxidado veio da bolsa (1,13 g/min)',
        limit: 'resumo truncado; glicogênio medido no vasto lateral.',
    },
    {
        tab: 'O comando',
        headline: 'A hipoglicemia cansa o comando',
        text: 'Nybo 2003 (cruzado, n = 8): depois de 3 h de bicicleta com placebo, glicose a 3,0 mM e ativação central menor (interpolação de abalo); com glicose, igual à basal. Em outro estudo do grupo (n = 6), a captação cerebral de glicose caiu de 0,34 para 0,28 µmol/g/min.',
        sources: ['Nybo 2003 (MSSE)', 'Nybo et al. 2003 (Acta Physiol Scand)'],
        stat: '197 N', statCaption: 'força sustentada com placebo (248 antes, 222 com glicose)',
        limit: 'n pequeno; a técnica de Kety-Schmidt é invasiva e tem limites.',
    },
];

/** Raias de tempo extra (min, escala 0–50) e de força (N, escala 0–260). */
export const LANES = [
    { key: 'pla', label: 'placebo', value: 10, text: '10 min', color: '#94A3B8' },
    { key: 'oral', label: 'CHO oral', value: 26, text: '26 min', color: '#FCD34D' },
    { key: 'iv', label: 'glicose IV', value: 43, text: '43 min', color: '#F59E0B' },
] as const;

export const FORCE = [
    { key: 'b', label: 'antes', value: 248, text: '248 N', color: '#E7E5E4' },
    { key: 'g', label: 'glicose', value: 222, text: '222 N', color: '#F59E0B' },
    { key: 'p', label: 'placebo', value: 197, text: '197 N', color: '#94A3B8' },
] as const;
