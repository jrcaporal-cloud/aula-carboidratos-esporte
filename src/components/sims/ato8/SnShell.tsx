import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura dos slides 145–149 (Ato VIII, parte B) no formato palco + painel da refação de 12/11.
 * Abas com nome e selos no alto; embaixo, o palco (arte que acumula) e o painel (texto do passo,
 * livro-caixa que acumula e fonte acumulada). Altura 500 px de projeto.
 */
export const SnShell = ({ tabs, step, setStep, layoutId, chips, children }: {
    tabs: readonly string[];
    step: number;
    setStep: (s: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3" style={BODY_FONT}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">{children}</div>
    </div>
);

/** Painel explicativo: título colorido + texto de pós do passo; embaixo, o que acumula e a fonte. */
export const SnPanel = ({ step, color, headline, text, children, source, className = '' }: {
    step: number;
    color: string;
    headline: string;
    text: ReactNode;
    children?: ReactNode;
    source: string;
    className?: string;
}) => (
    <Panel className={`flex min-w-0 flex-1 flex-col gap-3 px-5 py-4 ${className}`}>
        <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        </motion.div>
        <div className="mt-auto flex flex-col gap-3">
            {children}
            <Source>{source}</Source>
        </div>
    </Panel>
);

export interface LedgerRow {
    /** Passo em que a linha entra (e fica). */
    at: number;
    label: string;
    value: string;
    color?: string;
}

/** Livro-caixa do painel: cada linha entra no seu passo e não sai mais. */
export const SnLedger = ({ rows, step, valueWidth = 190 }: { rows: readonly LedgerRow[]; step: number; valueWidth?: number }) => (
    <div className="flex flex-col">
        {rows.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between gap-3 border-t-2 border-white/10 py-[5px]"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.35, 0.1) : 0, ease: EASE_OUT }}>
                <span className="text-[16px] leading-tight text-gray-300">{r.label}</span>
                <span className="shrink-0 text-right text-[18px] font-bold leading-tight tabular-nums"
                    style={{ color: r.color ?? '#F3F4F6', maxWidth: valueWidth }}>{r.value}</span>
            </motion.div>
        ))}
    </div>
);
