import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';
import { SIM_H } from './units';

/**
 * Moldura palco + painel dos slides 186–188 (Ato X, parte B: decidir). Peça própria da parte B
 * (a parte A usa MedirShell): abas com nome e selos no alto; palco à esquerda; painel à direita com o título
 * colorido do passo, o texto de pós, o livro-caixa que acumula e a fonte acumulada no pé.
 */

interface DecideShellProps {
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
    /** Bloco que acumula (livro-caixa, número-chave) entre o texto e a fonte. */
    ledger?: ReactNode;
    sources: string;
}

export const DecideShell = ({ tabs, step, setStep, layoutId, chips, stageWidth, stage, accent, headline, text, ledger, sources }: DecideShellProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ height: SIM_H }}>
            <div className="flex min-h-[44px] items-center justify-between gap-4">
                <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
                {chips && <div className="flex flex-wrap justify-end gap-2">{chips}</div>}
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="relative shrink-0">
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

export interface DecideRow {
    /** Passo em que a linha entra (e fica). */
    at: number;
    term: string;
    value: string;
    color: string;
}

/** Livro-caixa: termo à esquerda, valor à direita; a linha nova entra deslizando, as antigas ficam. */
export const DecideLedger = ({ rows, step, title }: { rows: readonly DecideRow[]; step: number; title?: string }) => {
    const reduce = useReducedMotion() ?? false;
    const shown = rows.filter(r => r.at <= step);
    return (
        <div className="flex flex-col border-t-2 border-white/15 pt-2">
            {title && <span className="pb-1 text-[15px] font-semibold text-gray-300">{title}</span>}
            {shown.map((r, i) => (
                <motion.div key={r.term} className="flex items-baseline justify-between gap-3 py-[3px]"
                    initial={reduce || r.at !== step ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.enter, delay: stagger(i, 0.35, 0.06), ease: EASE_OUT }}>
                    <span className="min-w-0 text-[16px] leading-tight text-gray-100">{r.term}</span>
                    <span className="shrink-0 text-right text-[17px] font-bold leading-tight tabular-nums" style={{ color: r.color }}>{r.value}</span>
                </motion.div>
            ))}
        </div>
    );
};

/** Moldura tracejada do quadro que ainda vai entrar: mostra a estrutura do palco sem adiantar o dado. */
export const DecideSlot = ({ label }: { label: string }) => (
    <div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-600">
        <span className="text-[17px] font-semibold text-slate-500">{label}</span>
    </div>
);
