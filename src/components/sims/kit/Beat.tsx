import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';

/**
 * Coreografia comum da aula. Tudo aqui anima só transform, opacity ou clip-path (composição na GPU):
 * na videochamada o codec aguenta bem mudanças grandes e lentas, e borra brilho, degradê e partícula fina.
 */

interface BeatProps {
    /** Chave do passo: trocar a chave troca o texto com um esmaecimento curto. */
    beat: string | number;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/**
 * A frase do passo: o que o professor está contando agora. Sai rápido (0,18 s) e entra pousando (0,3 s).
 * Sem AnimatePresence: a nova frase simplesmente substitui a antiga, sem esperar a saída.
 */
export const Beat = ({ beat, children, className = '', style }: BeatProps) => {
    const reduce = useReducedMotion();
    return (
        <motion.div key={beat} className={className} style={style}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

type WipeFrom = 'left' | 'right' | 'top' | 'bottom';

const HIDDEN: Record<WipeFrom, string> = {
    left: 'inset(0% 100% 0% 0% round 16px)',
    right: 'inset(0% 0% 0% 100% round 16px)',
    top: 'inset(0% 0% 100% 0% round 16px)',
    bottom: 'inset(100% 0% 0% 0% round 16px)',
};
const SHOWN = 'inset(0% 0% 0% 0% round 16px)';

interface WipeProps {
    show?: boolean;
    from?: WipeFrom;
    delay?: number;
    duration?: number;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

/** Revela um bloco "desenhando" de um lado para o outro (clip-path): bom para gráficos, tabelas e cartões. */
export const Wipe = ({ show = true, from = 'left', delay = 0, duration = DUR.morph, className = '', style, children }: WipeProps) => {
    const reduce = useReducedMotion();
    if (reduce) {
        return (
            <motion.div className={className} style={style} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
                transition={{ duration: DUR.text }}>
                {children}
            </motion.div>
        );
    }
    return (
        <motion.div className={className} style={style} initial={{ clipPath: HIDDEN[from] }}
            animate={{ clipPath: show ? SHOWN : HIDDEN[from] }}
            transition={{ delay: show ? delay : 0, duration: show ? duration : DUR.exit, ease: EASE_IN_OUT }}>
            {children}
        </motion.div>
    );
};

interface GrowProps {
    /** Fração preenchida, 0 → 1. */
    value: number;
    /** 'x' cresce da esquerda; 'y' cresce de baixo. */
    axis?: 'x' | 'y';
    color: string;
    delay?: number;
    className?: string;
    style?: CSSProperties;
}

/**
 * Barra que cresce por escala (não por largura/altura): quem a contém define o tamanho máximo.
 * A mudança de valor entre passos também anima, partindo de onde estava.
 */
export const Grow = ({ value, axis = 'x', color, delay = 0, className = '', style }: GrowProps) => {
    const reduce = useReducedMotion();
    const v = Math.max(0, Math.min(1, value));
    const scale = axis === 'x' ? { scaleX: v } : { scaleY: v };
    const start = axis === 'x' ? { scaleX: 0 } : { scaleY: 0 };
    return (
        <motion.div aria-hidden className={`absolute inset-0 ${className}`}
            style={{ background: color, transformOrigin: axis === 'x' ? 'left center' : 'center bottom', ...style }}
            initial={reduce ? false : start} animate={scale}
            transition={{ delay, duration: reduce ? 0 : DUR.bar, ease: EASE_OUT }} />
    );
};
