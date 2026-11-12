import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { StepTabs } from '../kit/ui';

/**
 * Moldura dos slides 160–164 (Ato IX, parte A) no formato palco + painel: abas com nome e selos no alto,
 * corpo livre embaixo, texto do passo e livro-caixa que acumula. Só composição: os dados moram nos *.content.ts.
 */

export const A9_H = 500;

interface FrameProps {
    tabs: readonly string[];
    step: number;
    onSelect: (i: number) => void;
    layoutId: string;
    /** Selos do passo (desenho, cálculo, caso fictício), à direita das abas. */
    chips: ReactNode;
    children: ReactNode;
}

export const A9Frame = ({ tabs, step, onSelect, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose flex w-full flex-col gap-3 text-gray-100" style={{ ...BODY_FONT, height: A9_H }}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={onSelect} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">{children}</div>
    </div>
);

/** Título colorido + texto de pós do passo; troca pousando (sem esperar a saída). */
export const StepText = ({ step, color, headline, text, size = 18 }: {
    step: number; color: string; headline: string; text: string; size?: number;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.div key={step} className="flex flex-col gap-2"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
            <p className="m-0 leading-snug text-gray-100" style={{ fontSize: size }}>{text}</p>
        </motion.div>
    );
};

export interface LedgerRow {
    /** Passo em que a linha entra (e fica). */
    at: number;
    label: string;
    value: string;
    color?: string;
}

/** Livro-caixa do slide: cada linha entra no seu passo e fica; a do passo atual vem com a cor cheia. */
export const Ledger = ({ rows, step, title }: { rows: readonly LedgerRow[]; step: number; title?: string }) => (
    <div className="flex flex-col gap-[3px]">
        {title && <span className="text-[15px] text-gray-300">{title}</span>}
        {rows.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between gap-3 border-t-2 border-white/10 pt-[3px]"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.45, 0.1) : 0, ease: EASE_OUT }}>
                <span className="text-[16px] leading-tight text-gray-200">{r.label}</span>
                <span className="shrink-0 whitespace-nowrap font-mono text-[18px] font-semibold tabular-nums"
                    style={{ color: r.at === step ? r.color ?? '#F9FAFB' : '#E5E7EB' }}>{r.value}</span>
            </motion.div>
        ))}
    </div>
);
