/** Slide 47 · Quem Defende os 4 Gramas. WASSERMAN2009 (~4 g, 70 kg); MARLISS2002 (≤2× no moderado; 7–8× e 3–4× no intenso). */

export interface LiverStep {
    phrase: string;
    /** Abertura da torneira (largura relativa do jato) e do ralo (consumo pelo músculo). */
    tap: number;
    drain: number;
    /** Nível do copo: 0,5 = glicemia normal. */
    level: number;
    handle: number;
    source: string;
}

export const LIVER_STEPS: readonly LiverStep[] = [
    {
        phrase: 'No sangue inteiro circulam ~4 g de glicose. O músculo bebe dela sem parar; o fígado repõe.',
        tap: 0.18, drain: 0.18, level: 0.5, handle: 12,
        source: 'Wasserman DH. Four grams of glucose. Am J Physiol Endocrinol Metab 2009;296:E11-21.',
    },
    {
        phrase: 'Abaixo de 60% do VO₂máx, glucagon e insulina abrem a torneira até 2 vezes. A glicemia fica no lugar.',
        tap: 0.36, drain: 0.36, level: 0.5, handle: 32,
        source: 'Marliss EB, Vranic M. Diabetes 2002;51(Suppl 1):S271-83.',
    },
    {
        phrase: 'Acima de 80%, as catecolaminas abrem a torneira 7–8 vezes; o consumo sobe só 3–4. A glicemia sobe.',
        tap: 1, drain: 0.5, level: 0.74, handle: 80,
        source: 'Marliss EB, Vranic M. Diabetes 2002;51(Suppl 1):S271-83.',
    },
    {
        phrase: 'Glicemia alta depois de um tiro é fisiologia, não falha. Na exaustão, a insulina sobe por 40–60 min para corrigir.',
        tap: 0.36, drain: 0.5, level: 0.74, handle: 32,
        source: 'Marliss EB, Vranic M. Diabetes 2002;51(Suppl 1):S271-83.',
    },
];
