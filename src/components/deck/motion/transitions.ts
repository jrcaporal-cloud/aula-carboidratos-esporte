import { createContext, useContext } from 'react';
import type { TargetAndTransition, Variants } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import type { TransitionKind } from './slideTransition';

/** Cliques mais rápidos que isto (passador em rajada) tiram o slide anterior na hora: nunca empilham simuladores saindo. */
export const RAPID_NAV_MS = 260;

export interface SlideMotion {
    /** 1 avançando, -1 voltando. */
    d: 1 | -1;
    kind: TransitionKind;
    reduced: boolean;
    /** Instante (performance.now) da última troca de slide; lido quando a saída começa. */
    nav: { current: number };
}

const EASE_IN = [0.4, 0, 1, 1] as const;

const isRapid = (m: SlideMotion): boolean => performance.now() - m.nav.current < RAPID_NAV_MS;

/**
 * Troca do slide inteiro (≤ 0,45 s, sem fila): no mesmo ato o slide novo entra de lado (40 px) enquanto
 * o velho sai para o outro lado; na abertura de ato ele só cresce 1,5% por baixo da cortina.
 * Movimento reduzido: só esmaecer.
 */
export const SECTION_VARIANTS: Variants = {
    enter: (m: SlideMotion) => {
        if (m.reduced) return { opacity: 0 };
        if (m.kind === 'act') return { opacity: 0, scale: 0.985, x: 0 };
        return { opacity: 0, x: m.d * 40, scale: 1 };
    },
    center: (m: SlideMotion) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        // A opacidade do novo espera 80 ms: o velho já quase sumiu e os títulos não se sobrepõem.
        transition: m.reduced
            ? { duration: 0.2 }
            : { duration: 0.42, ease: EASE_OUT, opacity: { duration: 0.3, delay: 0.08, ease: 'easeOut' } },
    }),
    exit: (m: SlideMotion) => {
        if (isRapid(m)) return { opacity: 0, transition: { duration: 0 } };
        if (m.reduced || m.kind === 'act') return { opacity: 0, transition: { duration: 0.2 } };
        return { opacity: 0, x: m.d * -48, transition: { duration: 0.24, ease: EASE_IN, opacity: { duration: 0.16, ease: 'easeIn' } } };
    },
};

/**
 * Passado como `onUpdate` da section: obriga o framer a animar a opacidade no JS em vez do WAAPI.
 * Com WAAPI, no fim da animação havia um quadro com a opacidade inicial (0) — o slide piscava.
 */
export const KEEP_JS_ANIMATION = (): void => undefined;

const NO_NAV = { current: 0 };

export const SlideMotionContext = createContext<SlideMotion>({ d: 1, kind: 'lateral', reduced: false, nav: NO_NAV });

export const useSlideMotion = (): SlideMotion => useContext(SlideMotionContext);

interface Layer {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
}

/**
 * Parallax de entrada: o cabeçalho anda menos e chega primeiro; o conteúdo vem 60 ms depois e anda mais.
 * `offset` = deslocamento extra (px) em relação ao slide; `delay` em segundos.
 */
export const enterLayer = (m: SlideMotion, offset: number, delay: number): Layer => {
    if (m.reduced) {
        return { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } };
    }
    const from = m.kind === 'act' ? { opacity: 0, y: offset * 0.3, x: 0 } : { opacity: 0, x: m.d * offset, y: 0 };
    return {
        initial: from,
        animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.42, delay, ease: EASE_OUT } },
    };
};
