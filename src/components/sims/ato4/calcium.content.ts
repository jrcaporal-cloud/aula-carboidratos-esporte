/**
 * Slide 66 · O cálcio que falha. Fonte: dossiê 01/02 · ORTENBLAD2011 (31/85; 4 h CHO 59/normal; água 29/77),
 * GEJL2014 (32/86; r = 0,30), ORTENBLAD2013 (causa não estabelecida).
 */

export interface Pair {
    title: string;
    /** Glicogênio e liberação de Ca²⁺ do RS, % do valor antes. */
    gly: number;
    ca: number;
    caText?: string;
}

export interface CalciumStage {
    lead: string;
    a: Pair;
    b?: Pair;
    note: string;
}

const ORT: Pair = { title: 'Ørtenblad 2011', gly: 31, ca: 85 };

export const CALCIUM_STAGES: readonly CalciumStage[] = [
    {
        lead: 'Esquiadores de elite, antes da prova: glicogênio do braço e liberação de cálcio do retículo em 100%.',
        a: { title: 'braço · antes', gly: 100, ca: 100 },
        note: 'Biópsia do tríceps e da coxa antes, logo após, 4 h e 22 h depois.',
    },
    {
        lead: 'Depois de 1 h de esqui, o braço fica com 31% do glicogênio, e o retículo solta cálcio a 85%.',
        a: { title: 'braço · após 1 h', gly: 31, ca: 85 },
        note: 'Na perna, o glicogênio ficou em 71%, e o cálcio não mudou.',
    },
    {
        lead: 'Quatro horas depois: com carboidrato, o cálcio volta ao normal. Só com água, cai mais.',
        a: { title: '+4 h com carboidrato', gly: 59, ca: 100, caText: 'normal' },
        b: { title: '+4 h só com água', gly: 29, ca: 77 },
        note: 'Só com água, o cálcio só normalizou depois de mais 18 h com carboidrato.',
    },
    {
        lead: 'Outro grupo, outro esporte, mesmo achado: 32% e 86%. Mas a correlação é fraca.',
        a: ORT,
        b: { title: 'Gejl 2014', gly: 32, ca: 86 },
        note: '',
    },
    {
        lead: 'Os próprios autores avisam: glicogênio e cálcio andam juntos, mas a causa não está provada.',
        a: ORT,
        b: { title: 'Gejl 2014', gly: 32, ca: 86 },
        note: '',
    },
];

export const CALCIUM_SOURCE = 'Ørtenblad et al. 2011; Gejl et al. 2014; Ørtenblad, Westerblad & Nielsen 2013';
