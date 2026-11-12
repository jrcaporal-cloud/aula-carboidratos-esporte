import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';
import { SIM_H } from './units';

/**
 * Moldura palco + painel dos slides 180–185 (Ato X, parte A: ler, medir).
 * Abas com nome e selos no alto; palco à esquerda (largura do slide); painel à direita com o título colorido do passo,
 * o texto de pós, o livro-caixa que acumula e a fonte acumulada no pé.
 */

interface MedirShellProps {
    tabs: readonly string[];
    step: number;
    setStep: (step: number) => void;
    layoutId: string;
    chips?: ReactNode;
    /** Largura do palco em px de projeto (o painel fica com o resto de 1136). */
    stageWidth: number;
    stage: ReactNode;
    accent: string;
    headline: string;
    text: ReactNode;
    /** Bloco que acumula (livro-caixa, tabela) entre o texto e a fonte. */
    ledger?: ReactNode;
    sources: string;
}

export const MedirShell = ({ tabs, step, setStep, layoutId, chips, stageWidth, stage, accent, headline, text, ledger, sources }: MedirShellProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="flex min-h-[44px] items-center justify-between gap-4">
                <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
                {chips && <div className="flex flex-wrap justify-end gap-2">{chips}</div>}
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="relative shrink-0" >
                    <div style={{ width: stageWidth }} className="h-full">{stage}</div>
                </Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
                    <motion.div key={step} className="flex flex-col gap-1.5"
                        initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color: accent }}>{headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2.5">
                        {ledger}
                        <Source>{sources}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export interface LedgerRow {
    /** Passo em que a linha entra (e fica). */
    at: number;
    term: string;
    text: string;
    color: string;
}

/** Livro-caixa do slide: uma linha por passo; a linha nova entra deslizando, as antigas ficam. */
export const MedirLedger = ({ rows, step, termWidth = 112 }: { rows: readonly LedgerRow[]; step: number; termWidth?: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5 border-t-2 border-white/15 pt-2.5">
            {rows.filter(r => r.at <= step).map((r, i) => (
                <motion.div key={r.term} className="flex items-baseline gap-3"
                    initial={reduce || r.at !== step ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: stagger(i, 0.35, 0.06), ease: EASE_OUT }}>
                    <span className="shrink-0 font-semibold text-[16px] leading-tight tabular-nums" style={{ color: r.color, width: termWidth }}>{r.term}</span>
                    <span className="text-[16px] leading-tight text-gray-200">{r.text}</span>
                </motion.div>
            ))}
        </div>
    );
};
