import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Beat } from '../kit/Beat';
import { BODY_FONT } from '../kit/palette';
import { Source } from '../kit/ui';

/**
 * Peças comuns do Ato IX (cada esporte, um tanque). Só composição: nenhum dado mora aqui.
 * A caixa de todo simulador do ato tem 1136 × 500 px de projeto (cabe no palco 1280 × 720 com título e subtítulo).
 */

export const BOX_W = 1136;
export const BOX_H = 500;

/** Raiz do simulador: largura e altura fixas, texto do corpo, fora da tipografia "prose" do slide. */
export const SimBox = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`not-prose relative w-full text-gray-100 ${className}`}
        style={{ ...BODY_FONT, maxWidth: BOX_W, height: BOX_H }}>
        {children}
    </div>
);

/** A frase do passo: o que o professor está contando agora (28 px, troca com esmaecimento curto). */
export const Say = ({ beat, children, size = 28, className = '' }: { beat: string | number; children: ReactNode; size?: number; className?: string }) => (
    <Beat beat={beat} className={`font-semibold leading-[1.2] text-white ${className}`} style={{ fontSize: size }}>
        {children}
    </Beat>
);

/** Selos do passo (desenho, cálculo, ilustrativo): pilha no canto superior direito, trocando com o passo. */
export const Chips = ({ beat, children }: { beat: string | number; children: ReactNode }) => (
    <Beat beat={`c${beat}`} className="flex shrink-0 flex-col items-end gap-2 pt-1">{children}</Beat>
);

interface HeadProps {
    beat: string | number;
    say: ReactNode;
    chips?: ReactNode;
    size?: number;
    className?: string;
}

/** Topo do passo: a frase-chave à esquerda e os selos alinhados com ela, à direita. */
export const Head = ({ beat, say, chips, size, className = '' }: HeadProps) => (
    <div className={`flex items-start justify-between gap-6 ${className}`}>
        <Say beat={beat} size={size} className="min-w-0 flex-1">{say}</Say>
        {chips && <Chips beat={beat}>{chips}</Chips>}
    </div>
);

/** A fonte do passo: rodapé, à esquerda, largura total. */
export const SourceLine = ({ children }: { children: ReactNode }) => (
    <div className="w-full shrink-0 pt-3"><Source>{children}</Source></div>
);

/** Número grande em Clash Display (64–96 px), com cor da química. */
export const Big = ({ children, color, size = 84, style }: { children: ReactNode; color: string; size?: number; style?: CSSProperties }) => (
    <span className="font-display font-bold leading-none tracking-tight tabular-nums" style={{ color, fontSize: size, ...style }}>
        {children}
    </span>
);

/** Bloco que entra pousando quando `show` liga (opacidade + 10 px). Fica montado: sem salto de layout. */
export const Reveal = ({ show, delay = 0, children, className = '', style }: {
    show: boolean; delay?: number; children: ReactNode; className?: string; style?: CSSProperties;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className={className} style={style} aria-hidden={!show}
            initial={false}
            animate={{ opacity: show ? 1 : 0, y: show || reduce ? 0 : 10 }}
            transition={{ delay: show ? delay : 0, duration: show ? DUR.enter : DUR.exit, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};
