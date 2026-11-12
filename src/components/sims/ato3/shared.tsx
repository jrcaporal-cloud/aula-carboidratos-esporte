import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Beat, Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { BODY_FONT } from '../kit/palette';
import { Source } from '../kit/ui';

/**
 * Peças comuns do Ato III · O Motor. Cada slide monta a sua composição; aqui ficam só a frase do passo
 * com os selos, a linha de fonte e a linha de barra, para o mesmo tipo de informação ter a mesma cara.
 */

interface HeaderProps {
    beat: string | number;
    children: ReactNode;
    /** Selos do passo (desenho, ilustrativo, via revisão…): canto superior direito, na linha da frase. */
    chips?: ReactNode;
}

/** A frase do passo (27 px) com os selos à direita: o que o professor conta agora e com que desenho. */
export const StepHeader = ({ beat, children, chips }: HeaderProps) => (
    <div className="flex items-start gap-6">
        <Beat beat={beat} className="m-0 min-w-0 flex-1 text-[27px] font-semibold leading-[1.22] text-white" style={BODY_FONT}>
            {children}
        </Beat>
        {chips && <div className="flex max-w-[340px] shrink-0 flex-wrap justify-end gap-2 pt-1">{chips}</div>}
    </div>
);

/** A fonte do passo: rodapé, à esquerda, largura total. */
export const SourceLine = ({ children }: { children: ReactNode }) => (
    <div className="min-h-[22px] w-full text-left"><Source>{children}</Source></div>
);

interface BarRowProps {
    label: ReactNode;
    /** Valor numérico (escala da barra) e o texto que aparece contando. */
    value: number;
    max: number;
    text: string;
    color: string;
    dim?: boolean;
    delay?: number;
    labelWidth?: number;
}

/** Uma linha "rótulo · barra · número": a barra cresce por escala e o número conta junto. */
export const BarRow = ({ label, value, max, text, color, dim = false, delay = 0, labelWidth = 220 }: BarRowProps) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className="grid items-center gap-4" style={{ gridTemplateColumns: `${labelWidth}px 1fr 96px` }}
            initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: dim ? 0.6 : 1, y: 0 }}
            transition={{ delay, duration: DUR.enter, ease: EASE_OUT }}>
            <span className="text-[19px] leading-tight text-gray-100">{label}</span>
            <div className="relative h-8 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <Grow value={value / max} color={color} delay={delay} />
            </div>
            <CountUp text={text} delay={delay} className="text-right font-display text-[30px] font-semibold leading-none" style={{ color }} />
        </motion.div>
    );
};
