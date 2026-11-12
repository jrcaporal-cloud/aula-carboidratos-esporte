import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura palco + painel dos slides 60–64 (Ato IV, parte A). Só destes cinco: a parte B tem a dela (frame.tsx).
 * Abas com nome e selos numa linha; embaixo, o palco e o painel explicativo lado a lado (ou a composição do slide).
 * Caixa: 1136 × 500 px de projeto.
 */

interface ShellProps {
    tabs: readonly string[];
    step: number;
    onSelect: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

export const ShellA = ({ tabs, step, onSelect, layoutId, chips, children }: ShellProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={onSelect} layoutId={layoutId} />
            {chips && <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-4">{children}</div>
    </div>
);

interface InfoProps {
    step: number;
    color: string;
    headline: string;
    text: ReactNode;
    /** Livro-caixa, tabela ou número-chave: fica no pé do painel, acima da fonte. */
    children?: ReactNode;
    source: string;
    className?: string;
}

/** Painel explicativo: título colorido do passo, o texto de pós e, no pé, o que acumula + a fonte acumulada. */
export const InfoPanel = ({ step, color, headline, text, children, source, className = '' }: InfoProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <Panel className={`flex min-w-0 flex-1 flex-col gap-3 px-5 py-4 ${className}`}>
            <motion.div key={step} className="flex flex-col gap-2" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{headline}</h3>
                <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
            </motion.div>
            <div className="mt-auto flex flex-col gap-3">
                {children}
                <Source>{source}</Source>
            </div>
        </Panel>
    );
};

export interface LedgerRow {
    /** Passo em que a linha entra (e fica). */
    at: number;
    label: string;
    text: ReactNode;
    color?: string;
}

/** Livro-caixa de duas colunas: cada linha entra no seu passo e não sai mais. */
export const Ledger = ({ rows, step, labelWidth = 104 }: { rows: readonly LedgerRow[]; step: number; labelWidth?: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5">
            {rows.filter(r => r.at <= step).map((r, i) => (
                <motion.div key={r.label} className="grid items-baseline gap-3" style={{ gridTemplateColumns: `${labelWidth}px 1fr` }}
                    initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.35, 0.1) : 0, ease: EASE_OUT }}>
                    <span className="text-[16px] font-semibold leading-snug" style={{ color: r.color ?? '#F3F4F6' }}>{r.label}</span>
                    <span className="text-[16px] leading-snug text-gray-200">{r.text}</span>
                </motion.div>
            ))}
        </div>
    );
};
