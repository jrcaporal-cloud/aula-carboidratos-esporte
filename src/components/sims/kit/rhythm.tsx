import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { EASE_OUT } from '../../../lib/motion';
import { C } from './palette';

/**
 * Ritmo do passo (portado da aula de nitrato, sem brilho por causa da videochamada).
 * O que entra num passo aparece em ordem: 0 = arte · 1 = número · 2 = legenda/fonte.
 * Para reiniciar a sequência a cada passo, dê `key={step}` ao bloco que contém os <Reveal>.
 */

/** Atraso (s) entre as ordens do <Reveal>. */
export const REVEAL_GAP = 0.16;

interface RevealProps {
    order?: number;
    /** Atraso extra (s), somado ao da ordem. */
    delay?: number;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

/** Entrada escalonada (opacidade + subida curta). Sem `exit`: troca rápida de passo não prende texto velho. */
export const Reveal = ({ order = 0, delay = 0, className, style, children }: RevealProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className={className} style={style}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: delay + order * REVEAL_GAP, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

interface KeyFactProps {
    /** Cor do anel (a cor da ideia: C.glucose, C.glycogen, C.risk…). */
    color?: string;
    /** Atraso (s) do destaque, normalmente o mesmo do <Reveal order={1}>. */
    delay?: number;
    className?: string;
    children: ReactNode;
}

/**
 * Destaque do dado-chave do passo: pulso curto de escala e um anel chapado de 3 px que se abre e some.
 * Um por passo, no máximo: é onde o professor bate. Sem box-shadow difuso (o codec borra).
 */
export const KeyFact = ({ color = C.glucose, delay = REVEAL_GAP, className = '', children }: KeyFactProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.span className={`relative inline-block ${className}`}
            initial={reduce ? false : { scale: 0.92 }}
            animate={reduce ? undefined : { scale: [0.92, 1.08, 1] }}
            transition={{ duration: 0.7, delay, times: [0, 0.45, 1], ease: EASE_OUT }}>
            {!reduce && (
                <motion.span aria-hidden className="pointer-events-none absolute -inset-2 rounded-xl"
                    style={{ border: `3px solid ${color}` }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.9, 1.04, 1.16] }}
                    transition={{ duration: 1.0, delay: delay + 0.15, ease: 'easeOut' }} />
            )}
            <span className="relative">{children}</span>
        </motion.span>
    );
};
