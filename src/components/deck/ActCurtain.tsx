import { useEffect, useRef } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import type { Chapter } from '../../data/chapters';
import { CHAPTERS } from '../../data/chapters';
import { FitStage, PAD_X_SELF, SLIDE_WIDTH } from './FitStage';
import { ActTrail } from './motion/ActTrail';
import { useMotionStore } from './motion/motionStore';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';

/** Duração da varredura (entrada e saída). */
export const CURTAIN_WIPE_S = 0.5;

/** A escala do palco assenta em ~320 ms: mede o nó de novo depois disso. */
const REMEASURE_MS = 360;

/** Numeral romano com serifa: na fonte de título o "III" vira três barras. */
const NUMERAL_FONT = "Georgia, 'Times New Roman', serif";

/** Põe a glicose personagem em cima do nó do ato atual enquanto a abertura está na tela. */
const useGlucoseOnNode = (nodeRef: React.RefObject<HTMLSpanElement | null>, rootRef: React.RefObject<HTMLDivElement | null>) => {
    const present = useIsPresent();
    useEffect(() => {
        if (!present) return undefined;
        let placed: { x: number; y: number; size: number } | null = null;
        const measure = () => {
            const node = nodeRef.current?.getBoundingClientRect();
            const base = rootRef.current?.parentElement?.getBoundingClientRect();
            if (!node || !base || node.width === 0) return;
            const size = node.width * 2;
            placed = { x: node.left - base.left + node.width / 2, y: node.top - base.top - size * 0.55, size };
            useMotionStore.getState().setStop(placed);
        };
        const frame = requestAnimationFrame(measure);
        const again = window.setTimeout(measure, REMEASURE_MS);
        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(again);
            // Só solta a glicose se o pouso ainda é desta abertura (uma nova pode já ter assumido).
            if (placed && useMotionStore.getState().stop === placed) useMotionStore.getState().setStop(null);
        };
    }, [present, nodeRef, rootRef]);
};

/**
 * Abertura de ato: uma cortina chapada varre a tela da esquerda para a direita com um fio na cor do ato;
 * mostra o numeral grande, o nome, a pergunta do ato e a trilha dos dez atos (a glicose pousa no nó atual),
 * e sai pelo outro lado revelando o primeiro slide. Não bloqueia a navegação: qualquer avanço a fecha.
 * Com movimento reduzido, vira um esmaecimento simples.
 */
export const ActCurtain = ({ chapter }: { chapter: Chapter }) => {
    const reduce = useReducedMotion() ?? false;
    const nodeRef = useRef<HTMLSpanElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    useGlucoseOnNode(nodeRef, rootRef);
    const act = Math.max(CHAPTERS.indexOf(chapter), 0);
    const wipe = reduce
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            initial: { clipPath: 'inset(0% 100% 0% 0%)' },
            animate: { clipPath: 'inset(0% 0% 0% 0%)' },
            exit: { clipPath: 'inset(0% 0% 0% 100%)' },
        };
    const rise = (dx: number, delay: number) => ({
        initial: reduce ? false : { opacity: 0, x: dx },
        animate: { opacity: 1, x: 0 },
        transition: { delay, duration: 0.35, ease: EASE_OUT },
    });
    return (
        <motion.div
            ref={rootRef}
            aria-hidden
            data-act-opening={chapter.roman}
            className="pointer-events-none absolute inset-0 z-[24]"
            style={{ backgroundColor: '#05070d' }}
            {...wipe}
            transition={{ duration: reduce ? 0.25 : CURTAIN_WIPE_S, ease: EASE_IN_OUT }}
        >
            {/* fio na cor do ato, na borda que avança: a camada inteira desliza (só transform); chapado, sem brilho */}
            {!reduce && (
                <motion.div className="absolute inset-0" initial={{ x: '0%', opacity: 1 }} animate={{ x: '100%', opacity: 0 }} transition={{ duration: CURTAIN_WIPE_S, ease: EASE_IN_OUT }}>
                    <span className="absolute inset-y-0 left-0 w-[6px]" style={{ background: chapter.color }} />
                </motion.div>
            )}
            <FitStage width={SLIDE_WIDTH} padX={PAD_X_SELF}>
                <div className="flex flex-col gap-14 px-16 font-body text-white select-none">
                    <div className="flex items-center gap-12">
                        <motion.span
                            className="shrink-0 leading-[0.9]"
                            style={{ fontFamily: NUMERAL_FONT, fontSize: 210, color: chapter.color }}
                            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT }}
                        >
                            {chapter.roman}
                        </motion.span>
                        <div className="flex min-w-0 flex-col gap-3">
                            <motion.span className="font-mono text-[20px] uppercase tracking-[0.35em]" style={{ color: chapter.color }} {...rise(-24, 0.12)}>
                                Ato {chapter.roman} de {CHAPTERS.length}
                            </motion.span>
                            <motion.h2 className="m-0 font-display text-[64px] font-bold leading-[1.02] tracking-tight" {...rise(-36, 0.16)}>
                                {chapter.title}
                            </motion.h2>
                            <motion.span className="h-[4px] w-[120px] rounded-full" style={{ background: chapter.color, transformOrigin: 'left' }}
                                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.22, duration: DUR.enter, ease: EASE_OUT }} />
                            <motion.p className="m-0 max-w-[760px] text-[26px] leading-snug text-gray-200"
                                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: DUR.enter, ease: EASE_OUT }}>
                                {chapter.question}
                            </motion.p>
                        </div>
                    </div>
                    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: DUR.enter, ease: EASE_OUT }}>
                        <ActTrail current={act} nodeRef={nodeRef} reduced={reduce} />
                    </motion.div>
                </div>
            </FitStage>
        </motion.div>
    );
};
