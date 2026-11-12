/** Slide 125 · Nem 10 g/kg em 12 Horas. Números: dossiê 04 (FUCHS2025). */

export interface Moment {
    stop: string;
    /** Fração do valor pré-exercício (1 = antes). */
    muscle: number;
    liver: number;
    muscleText: string;
    liverText: string;
    phrase: string;
    stat: { value: string; caption: string };
}

/** Escala dos tanques: cabem 160% do valor de antes (o fígado passa de 100%). */
export const TANK_MAX = 1.6;

export const STOPS: readonly string[] = ['antes', 'fim do exercício', '6 h', '12 h'];

export const MOMENTS: readonly Moment[] = [
    {
        stop: 'fim do exercício', muscle: 56 / 159, liver: 110 / 166,
        muscleText: '159 → 56', liverText: '166 → 110',
        phrase: 'O exercício esvazia: músculo −64%, fígado −34%. Em jejum, nada volta em 12 h.',
        stat: { value: '−64%', caption: 'glicogênio muscular no fim do exercício' },
    },
    {
        stop: '6 h', muscle: 0.55, liver: 1.42,
        muscleText: '88 · 55%', liverText: '236 · 142%',
        phrase: 'Com carboidrato, o fígado passa do nível de antes em 6 h. O músculo, não.',
        stat: { value: '142%', caption: 'fígado às 6 h, em relação ao de antes' },
    },
    {
        stop: '12 h', muscle: 0.69, liver: 258 / 166,
        muscleText: '110 · 69%', liverText: '258',
        phrase: 'Às 12 h, depois de 10 g/kg, o músculo ainda está em 69% do que tinha.',
        stat: { value: '69%', caption: 'músculo às 12 h, mesmo com 10 g/kg' },
    },
    {
        stop: '12 h', muscle: 0.69, liver: 258 / 166,
        muscleText: '110 · 69%', liverText: '258',
        phrase: 'Duas provas no mesmo dia: a segunda larga com o músculo devendo.',
        stat: { value: '69%', caption: 'músculo às 12 h, mesmo com 10 g/kg' },
    },
];

export const DESIGN = 'Fuchs 2025 · cruzado · n = 12 ciclistas de elite';
export const PROTOCOL = '10 g/kg em 12 h · sacarose 1,2 g/kg/h nas 6 h iniciais';
export const UNIT = 'mmol/L · ¹³C-MRS, conferido por biópsia';

export const SOURCE = 'Fuchs CJ et al. J Physiol 2025 · DOI 10.1113/JP289115 · PMID 40836481';
