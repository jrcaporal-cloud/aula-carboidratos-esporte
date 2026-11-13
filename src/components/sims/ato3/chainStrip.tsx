import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';

/**
 * Faixas da cadeia de causa (slides 46 e 49): número + título + nota à esquerda, o desenho à direita. Cada faixa entra
 * no seu passo e fica; antes disso, só a moldura tracejada com o título, para o aluno ver o caminho inteiro.
 */

const DARK = '#04080F';

export interface CellProps {
    n: number;
    title: string;
    /** Linha de apoio sob o título (unidade, legenda, desenho do estudo). */
    note: string;
    show: boolean;
    born: boolean;
    children: ReactNode;
}

/** Faixa do palco: número + título + nota à esquerda, o desenho à direita. Antes do passo, só a moldura tracejada. */
export const ChainCell = ({ n, title, note, show, born, children }: CellProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="grid min-h-0 grid-cols-[188px_1fr] items-center gap-3 rounded-xl border-2 px-3 py-1.5"
            style={{ borderColor: show ? '#475569' : '#334155', borderStyle: show ? 'solid' : 'dashed', transition: 'border-color 300ms' }}>
            <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold"
                        style={{ background: show ? '#F3F4F6' : '#334155', color: show ? DARK : '#94A3B8' }}>{n}</span>
                    <span className="text-[17px] font-bold leading-tight" style={{ color: show ? '#FFFFFF' : '#94A3B8' }}>{title}</span>
                </div>
                {show && <span className="text-[16px] leading-tight text-gray-300">{note}</span>}
            </div>
            {show ? (
                <motion.div className="flex min-w-0 flex-col justify-center gap-1"
                    initial={born && !reduce ? { opacity: 0, x: 10 } : false} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: born ? 0.15 : 0, ease: EASE_OUT }}>
                    {children}
                </motion.div>
            ) : <span />}
        </div>
    );
};

/** Barra horizontal com escala real a partir do zero. */
export const ScaleBar = ({ label, value, text, max, color, delay, labelWidth = 78, thin = false }: { label: string; value: number; text: string; max: number; color: string; delay: number; labelWidth?: number; thin?: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className={`flex items-center gap-2 ${thin ? 'leading-none' : ''}`}>
            <span className="shrink-0 text-[16px] font-semibold text-gray-200" style={{ width: labelWidth }}>{label}</span>
            <div className={`relative flex-1 ${thin ? 'h-[18px]' : 'h-[24px]'}`}>
                <motion.div className="absolute inset-y-0 left-0 rounded-r-md" style={{ width: `${(value / max) * 100}%`, background: color, transformOrigin: 'left center' }}
                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay, ease: EASE_OUT }} />
            </div>
            <span className="w-[74px] text-right font-display text-[19px] font-bold tabular-nums" style={{ color }}>{text}</span>
        </div>
    );
};

