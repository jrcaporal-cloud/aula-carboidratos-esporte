import type { CastId } from '../kit/cast';

/**
 * Slide 12 · Cinco Atletas, Cinco Tanques (CastSim). Os personagens vêm de kit/cast.ts (fonte única);
 * aqui fica só o que este slide acrescenta: o nível ilustrativo do tanque no fim do esforço típico e o ato em que cada um volta.
 */
export interface CastExtra {
    /** Nível do tanque no fim do esforço típico (0 → 1). ILUSTRATIVO: forma, não medida. */
    level: number;
    /** Quando o tanque é lido (legenda curta). */
    when: string;
    /** Onde o personagem volta na aula (conferido no ROTEIRO). */
    returns: string;
    /** A frase do passo: que tipo de problema de tanque ele traz. */
    beat: string;
}

export const CAST_EXTRA: Record<CastId, CastExtra> = {
    marina: { level: 0.08, when: 'no km 32', returns: 'volta nos Atos IV e V', beat: 'O tanque que seca antes da chegada.' },
    diego: { level: 0.2, when: 'no fim da prova', returns: 'volta no Ato VI', beat: 'O tanque que precisa ser reposto no caminho.' },
    lara: { level: 0.45, when: 'no fim do jogo', returns: 'volta no Ato VII', beat: 'O tanque que não tem tempo de encher.' },
    tiago: { level: 0.35, when: 'na pesagem', returns: 'volta no Ato IX', beat: 'O tanque que pesa na balança.' },
    paulo: { level: 0.7, when: 'no fim do treino', returns: 'volta no Ato IX', beat: 'O tanque que esvazia só em parte.' },
};

export const CAST_FINAL_BEAT = 'Cinco tanques, cinco perguntas diferentes.';
