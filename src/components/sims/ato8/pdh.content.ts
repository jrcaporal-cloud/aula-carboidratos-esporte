/** Slide 147 · A torneira fechada (dossiê 05·STELLINGWERFF2006 e 05·HAVEMANN2006). */

export const PDH_BEATS = [
    'Cinco dias de gordura, um dia de CHO: o tanque volta a encher igual.',
    'Mas a torneira fechou: a PDH, a porta do carboidrato na mitocôndria, abre menos.',
    'No sprint de 1 minuto, sai menos glicogênio do mesmo tanque.',
    'Na prova: o ritmo médio igual, o ataque mais fraco.',
] as const;

export interface PdhArm {
    id: 'hcho' | 'fat';
    name: string;
    sub: string;
    /** Glicogênio de repouso (µmol/g peso seco). */
    glycogen: number;
    /** Atividade da PDH (mmol/kg peso úmido/min). */
    pdh: number;
    /** Glicogenólise no sprint de 1 min. */
    sprint: number;
}

export const ARMS: readonly PdhArm[] = [
    { id: 'hcho', name: 'CHO alto', sub: '5 dias, 10,3 g/kg/d', glycogen: 873, pdh: 2.39, sprint: 50.5 },
    { id: 'fat', name: 'gordura → CHO', sub: '5 dias de gordura + 1 de CHO', glycogen: 868, pdh: 1.69, sprint: 37.3 },
];

export const PDH_SOURCES = {
    stell: 'Stellingwerff T et al. Am J Physiol Endocrinol Metab 2006;290(2):E380-8.',
    havemann: 'Havemann L et al. J Appl Physiol 2006;100(1):194-202.',
} as const;
