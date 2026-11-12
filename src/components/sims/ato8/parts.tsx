import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { Beat } from '../kit/Beat';
import { BODY_FONT } from '../kit/palette';
import { Source } from '../kit/ui';

/**
 * Peças comuns do Ato VIII (Treinar com Pouco). Caixa do simulador: 1136 × 504 px de projeto.
 * Nada aqui fica em loop: tudo é consequência de um passo e termina.
 */

export const FRAME_H = 504;

/** Raiz de todo simulador do ato: altura fixa, fora da tipografia "prose" do slide. */
export const Frame = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`not-prose relative flex w-full flex-col overflow-hidden ${className}`} style={{ ...BODY_FONT, height: FRAME_H }}>
        {children}
    </div>
);

/**
 * Linha do topo: a frase do passo (26–34 px) à esquerda e, no canto superior direito, os selos do passo
 * (desenho do estudo, ilustrativo, cálculo). Os selos ficam só aqui: o conteúdo não os repete.
 */
export const Headline = ({ beat, children, chips, size = 28, className = '', style }: {
    beat: string | number; children: ReactNode; chips?: ReactNode; size?: number; className?: string; style?: CSSProperties;
}) => (
    <div className={`flex items-start justify-between gap-6 ${className}`} style={style}>
        <Beat beat={beat} className="min-w-0 flex-1">
            <p className="m-0 font-semibold leading-[1.18] text-white" style={{ fontSize: size, textWrap: 'balance' }}>{children}</p>
        </Beat>
        {chips && <div className="flex max-w-[440px] shrink-0 flex-wrap justify-end gap-2 pt-1">{chips}</div>}
    </div>
);

/** Rodapé: a fonte curta, à esquerda, largura total. */
export const Foot = ({ source }: { source: string }) => (
    <div className="mt-auto pt-3"><Source>{source}</Source></div>
);

/**
 * Marcador que anda num trilho em % da largura (sem animar `left`): o trilho declara
 * `[container-type:inline-size]` e o marcador, de largura zero, desliza por `x` em cqw.
 */
export const TrackMark = ({ at, children, delay = 0, className = '' }: {
    at: number; children: ReactNode; delay?: number; className?: string;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className={`absolute top-0 bottom-0 left-0 w-0 ${className}`}
            initial={false} animate={{ x: `${at}cqw` }}
            transition={{ duration: reduce ? 0 : DUR.draw, delay, ease: EASE_IN_OUT }}>
            {children}
        </motion.div>
    );
};

/** Esmaece e desloca de leve ao aparecer; some rápido. Para blocos que entram num passo e ficam. */
export const Appear = ({ show, children, delay = 0, className = '', style, y = 10 }: {
    show: boolean; children: ReactNode; delay?: number; className?: string; style?: CSSProperties; y?: number;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className={className} style={style} initial={false}
            animate={{ opacity: show ? 1 : 0, y: show || reduce ? 0 : y }}
            transition={{ duration: show ? DUR.enter : DUR.exit, delay: show ? delay : 0, ease: [0.23, 1, 0.32, 1] }}
            aria-hidden={!show}>
            {children}
        </motion.div>
    );
};
