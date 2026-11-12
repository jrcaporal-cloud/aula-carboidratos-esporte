/** Slide 121 · Quatro Horas Entre Duas Sessões. Números: dossiê 04 (ALGHANNAM2016, CRAVEN2021, JENTJENS2003, KERKSICK2017). */

export type ArmId = 'high' | 'low';

export interface Arm {
    id: ArmId;
    dose: string;
    /** Glicogênio no fim das 4 h de recuperação (mmol/kg peso seco). */
    start: number;
    /** Tempo da 2ª corrida até a exaustão (min). */
    minutes: number;
}

export const ARMS: readonly Arm[] = [
    { id: 'high', dose: '1,2 g/kg/h', start: 269, minutes: 80 },
    { id: 'low', dose: '0,3 g/kg/h', start: 157, minutes: 48 },
];

/** Glicogênio na exaustão, igual nos dois braços (~72–78 mmol/kg ps). */
export const FLOOR = 75;
export const FLOOR_BAND: readonly [number, number] = [72, 78];

export const X_MAX = 90;
export const Y_MAX = 300;

export const PHRASES: readonly string[] = [
    'Correr até a exaustão, recuperar 4 h com carboidrato a cada 30 min, correr de novo.',
    'No fim das 4 h, quem recebeu 1,2 g/kg/h tinha 269; quem recebeu 0,3, só 157.',
    'Os dois param no mesmo piso. Quem larga mais alto demora mais a chegar lá.',
    'Intervalo curto: comece cedo, repita a cada hora ou menos, ~1–1,2 g/kg/h.',
];

export const DESIGN = 'Alghannam 2016 · medidas repetidas · n = 10';

export const FACTS: readonly { big: string; text: string; ref: string }[] = [
    { big: '+23,5', text: 'mmol/kg/h de ressíntese com CHO × água (IC95% 19,0–27,9)', ref: 'Craven 2021 · meta-análise · 10 ensaios, n = 86' },
    { big: '1,2', text: 'g/kg/h quando a recuperação dura menos de 4 h', ref: 'ISSN 2017 · posicionamento' },
];

export const SOURCE = 'Alghannam AF et al. Med Sci Sports Exerc 2016;48(1):123-31 · Craven J et al. Sports Med Open 2021;7:9 · Kerksick CM et al. JISSN 2017;14:33';
