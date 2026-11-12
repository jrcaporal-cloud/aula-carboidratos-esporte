import { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { DECK } from '../slides';
import { actOfSection } from '../acts';
import { GLYPH_PX, GlucoseGlyph, type GlucoseForm } from './GlucoseGlyph';
import { perchAfterTitle, type Perch } from './glucosePlace';
import { useMotionStore, type GlucoseStop } from './motionStore';

interface GlucoseCharacterProps {
    index: number;
    /** Visão geral, modelo 3D ou outro painel por cima: a glicose se recolhe. */
    hidden: boolean;
}

const SPRING_X = { type: 'spring', stiffness: 150, damping: 22, mass: 1 } as const;
const SPRING_Y = { type: 'spring', stiffness: 95, damping: 17, mass: 1 } as const;
/** Depois da entrada do slide (≤ 0,45 s) mede de novo: o título já parou de deslizar. */
const SETTLE_MS = 480;

/** Atos em que a glicose está guardada (IV O Tanque, V Antes da Largada, VII Depois da Chegada): vira elo de glicogênio. */
const STORED_ACTS = new Set([3, 4, 6]);
const formOf = (index: number): GlucoseForm => (STORED_ACTS.has(actOfSection(DECK[index]?.section ?? '')) ? 'stored' : 'free');

/** Fim da última linha do título do slide `index`, em px relativos ao deck. Sem título (capa, citação): null. */
const measureTitle = (index: number, root: HTMLElement): Perch | null => {
    const h2 = document.querySelector<HTMLElement>(`section[data-deck-index="${index}"] h2`);
    if (!h2 || !h2.textContent?.trim()) return null;
    const range = document.createRange();
    range.selectNodeContents(h2);
    const lines = Array.from(range.getClientRects()).filter(r => r.width > 0);
    const last = lines[lines.length - 1];
    if (!last) return null;
    const base = root.getBoundingClientRect();
    const box = { left: last.left - base.left, top: last.top - base.top, right: last.right - base.left, bottom: last.bottom - base.top };
    return perchAfterTitle(box, h2.getBoundingClientRect().right - base.left);
};

/**
 * A glicose personagem: mora acima do slide e abaixo dos controles; a cada troca de slide viaja num arco
 * (mola + um pulo) e pousa depois do título. Na abertura de ato pousa no nó do ato, na trilha.
 * Posição em motion values (sem re-render por quadro); ignora o mouse.
 */
export const GlucoseCharacter = ({ index, hidden }: GlucoseCharacterProps) => {
    const reduced = useReducedMotion() ?? false;
    const rootRef = useRef<HTMLDivElement>(null);
    const hopRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(-300);
    const y = useMotionValue(-300);
    const scale = useMotionValue(0.4);
    const opacity = useMotionValue(0);
    const stop = useMotionStore(s => s.stop);
    const form = formOf(index);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;
        const travel = (target: GlucoseStop, hop: boolean) => {
            const shown = opacity.get() > 0.05;
            const s = target.size / GLYPH_PX;
            if (!shown || reduced) {
                x.set(target.x); y.set(target.y); scale.set(s);
            } else {
                animate(x, target.x, SPRING_X);
                animate(y, target.y, SPRING_Y);
                animate(scale, s, { duration: 0.4 });
                const far = Math.hypot(target.x - x.get(), target.y - y.get()) > 8;
                if (hop && far && hopRef.current) {
                    animate(hopRef.current, { y: [0, -target.size * 0.8, 0], scale: [1, 1.12, 1] }, { duration: 0.6, ease: 'easeInOut' });
                }
            }
            animate(opacity, hidden ? 0 : 1, { duration: hidden ? 0.2 : 0.3 });
        };
        const place = (hop: boolean) => {
            const perch = stop ? { ...stop, visible: true } : measureTitle(index, root);
            if (perch?.visible) travel(perch, hop);
            else animate(opacity, 0, { duration: 0.2 });
        };
        let frame = requestAnimationFrame(() => place(true));
        const settle = window.setTimeout(() => place(false), SETTLE_MS);
        // O slide muda de tamanho (simulador carregando, janela redimensionada): acompanha sem pulo.
        const stage = document.querySelector(`section[data-deck-index="${index}"] .deck-stage > div`);
        const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => place(false)); });
        if (stage && !stop) observer.observe(stage);
        const onResize = () => place(false);
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(settle);
            observer.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, [index, stop, hidden, reduced, x, y, scale, opacity]);

    return (
        <div ref={rootRef} aria-hidden className="absolute inset-0 z-[25] pointer-events-none overflow-hidden">
            <motion.div
                data-glucose
                className="absolute left-0 top-0"
                style={{ x, y, scale, opacity, width: GLYPH_PX, height: GLYPH_PX, marginLeft: -GLYPH_PX / 2, marginTop: -GLYPH_PX / 2, willChange: 'transform' }}
            >
                <div ref={hopRef}>
                    <GlucoseGlyph form={form} />
                </div>
            </motion.div>
        </div>
    );
};
