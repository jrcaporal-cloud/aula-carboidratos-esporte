import type { CastId } from '../kit/cast';

/**
 * Slide 12 · Cinco Atletas, Cinco Tanques (CastSim). Os personagens vêm de kit/cast.ts (fonte única);
 * aqui fica o que este slide acrescenta: o nível ILUSTRATIVO do tanque, a pergunta fisiológica de cada caso,
 * o ato em que ele volta (conferido no ROTEIRO) e o dado real que espera por ele lá (conferido nos dossiês).
 */
export interface CastExtra {
    /** Nível do tanque no fim do esforço típico (0 → 1). ILUSTRATIVO: forma, não medida. */
    level: number;
    /** A pergunta fisiológica que o caso faz à aula. */
    question: string;
    /** Ato(s) em que o personagem volta, em romanos. */
    acts: readonly string[];
    /** O dado real que o ato dele traz (número grande + legenda + estudo com desenho). */
    stat: string;
    statCaption: string;
    study: string;
}

export const CAST_EXTRA: Record<CastId, CastExtra> = {
    marina: {
        level: 0.08, acts: ['IV', 'V'],
        question: 'Quanto cabe no tanque e quando ele seca?',
        stat: '17%', statCaption: 'das maratonistas batem no muro (28% dos homens)',
        study: 'Smyth 2021 · observacional',
    },
    diego: {
        level: 0.2, acts: ['VI'],
        question: 'Quanto carboidrato por hora o intestino deixa passar?',
        stat: '−60%', statCaption: 'de sintomas GI após 2 semanas de treino intestinal',
        study: 'Costa 2017 · ECR · n = 25',
    },
    lara: {
        level: 0.45, acts: ['VII'],
        question: 'O tanque volta a encher entre dois jogos?',
        stat: '−27%', statCaption: 'de glicogênio 24 h após o jogo, com dieta otimizada',
        study: 'Krustrup 2011 · n = 7',
    },
    tiago: {
        level: 0.35, acts: ['IX'],
        question: 'Quanto o tanque pesa na balança?',
        stat: '1 : 3', statCaption: 'g de glicogênio : g de água, no mínimo (até 1 : 17)',
        study: 'Fernández-Elías 2015 · cruzado · n = 9',
    },
    paulo: {
        level: 0.7, acts: ['IX'],
        question: 'Musculação esvazia o tanque a ponto de importar?',
        stat: '−24%', statCaption: 'do glicogênio do bíceps em 3 séries de rosca',
        study: 'MacDougall 1999 · n = 4',
    },
};

export const CAST_TABS: readonly string[] = ['Marina', 'Diego', 'Lara', 'Tiago', 'Paulo', 'O elenco'];
