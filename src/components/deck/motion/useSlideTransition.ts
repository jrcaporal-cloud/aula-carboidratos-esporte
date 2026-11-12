import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { Chapter } from '../../../data/chapters';
import { DECK } from '../slides';
import { IS_PREVIEW } from '../presenterChannel';
import { slideChange, type SlideChange } from './slideTransition';
import type { SlideMotion } from './transitions';

/** Tempo que a abertura do ato fica na tela. A pergunta termina de entrar em ~0,6 s; sobra ~1,8 s para ler. */
export const OPENING_HOLD_MS = 2400;

/** Teclas de avançar/voltar (as mesmas do useDeckNavigation): qualquer uma fecha a abertura na hora. */
const NAV_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Enter', 'Backspace']);

export interface Opening {
    chapter: Chapter;
    /** Muda a cada abertura nova (reinicia a animação). */
    key: number;
}

interface TransitionState {
    prev: number;
    change: SlideChange;
    opening: Opening | null;
    /** Contador de aberturas: a chave nunca se repete (uma abertura saindo e outra entrando não colidem). */
    seq: number;
}

const sectionAt = (i: number) => DECK[i]?.section ?? '';

/**
 * Deriva, a cada troca de slide, a direção e se ela abriu um ato novo. A abertura fecha sozinha, ou com
 * qualquer comando de avançar/voltar — que passa adiante e navega: ela nunca esconde o que o clique mudou.
 */
export const useSlideTransition = (index: number) => {
    const reduced = useReducedMotion() ?? false;
    const [state, setState] = useState<TransitionState>({ prev: index, change: { d: 1, kind: 'lateral', opens: null }, opening: null, seq: 0 });

    // Padrão "valor anterior no estado": ajusta durante o render, sem efeito.
    if (state.prev !== index) {
        const change = slideChange(state.prev, index, sectionAt, !IS_PREVIEW);
        const seq = change.opens ? state.seq + 1 : state.seq;
        setState({ prev: index, change, seq, opening: change.opens ? { chapter: change.opens, key: seq } : null });
    }

    const closeOpening = useCallback(() => setState(s => (s.opening ? { ...s, opening: null } : s)), []);

    useEffect(() => {
        if (!state.opening) return undefined;
        const timer = window.setTimeout(closeOpening, OPENING_HOLD_MS);
        const onKey = (e: KeyboardEvent) => { if (NAV_KEYS.has(e.key)) closeOpening(); };
        window.addEventListener('keydown', onKey, true);
        return () => { window.clearTimeout(timer); window.removeEventListener('keydown', onKey, true); };
    }, [state.opening, closeOpening]);

    // Instante da última troca (ver SECTION_VARIANTS.exit). Atualizado depois que a saída já começou.
    const navAtRef = useRef(0);
    useEffect(() => { navAtRef.current = performance.now(); }, [index]);

    const motion: SlideMotion = { d: state.change.d, kind: state.change.kind, reduced, nav: navAtRef };
    return { motion, opening: state.opening, closeOpening };
};
