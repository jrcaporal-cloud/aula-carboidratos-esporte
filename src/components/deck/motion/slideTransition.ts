import type { Chapter } from '../../../data/chapters';
import { curtainForCrossing } from '../acts';

/** `lateral` = mesmo ato, voltando ou saltando; `act` = avançou um slide e abriu um ato novo (a abertura cobre a troca). */
export type TransitionKind = 'lateral' | 'act';

export interface SlideChange {
    d: 1 | -1;
    kind: TransitionKind;
    /** Ato que abre (só no avanço em sequência para um ato posterior). */
    opens: Chapter | null;
}

/**
 * Como o slide `to` entra vindo de `from`. A abertura de ato só toca no avanço de UM slide
 * (passador): saltos pela visão geral ou pelo endereço e o voltar nunca a mostram.
 */
export const slideChange = (from: number, to: number, sectionAt: (i: number) => string, allowOpening = true): SlideChange => {
    const d = to >= from ? 1 : -1;
    const opens = allowOpening && to === from + 1 ? curtainForCrossing(sectionAt(from), sectionAt(to)) : null;
    return { d, kind: opens ? 'act' : 'lateral', opens };
};
