import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura palco + painel dos slides 65–69 (Ato IV, parte B). Abas com nome e selos na linha de cima;
 * palco à esquerda (largura fixa do slide) e painel à direita com o título colorido do passo, o texto de pós,
 * o livro-caixa que acumula e a fonte acumulada no pé.
 */

interface StageLayoutProps {
    tabs: readonly string[];
    step: number;
    onSelect: (i: number) => void;
    layoutId: string;
    chips: ReactNode;
    stage: ReactNode;
    stageWidth: number;
    panel: ReactNode;
}

export const StageLayout = ({ tabs, step, onSelect, layoutId, chips, stage, stageWidth, panel }: StageLayoutProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={onSelect} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">
            <Panel className="relative shrink-0 overflow-hidden" ><div style={{ width: stageWidth }} className="h-full">{stage}</div></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">{panel}</Panel>
        </div>
    </div>
);

/** Título colorido e texto do passo: trocam juntos, com uma entrada curta. */
export const StepText = ({ step, color, headline, text }: { step: number; color: string; headline: string; text: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div key={step} className="flex flex-col gap-2" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{headline}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        </motion.div>
    );
};

/** Linha do livro-caixa: entra no passo `at` e fica. */
export interface LedgerRow {
    at: number;
    cells: readonly ReactNode[];
    color?: string;
    strong?: boolean;
}

interface LedgerProps {
    head: readonly ReactNode[];
    rows: readonly LedgerRow[];
    step: number;
    /** Largura de cada coluna (a primeira estica). */
    cols?: readonly string[];
}

export const Ledger = ({ head, rows, step, cols }: LedgerProps) => {
    const reduce = useReducedMotion() ?? false;
    const shown = rows.filter(r => r.at <= step);
    return (
        <table className="w-full border-separate border-spacing-y-[3px] text-left">
            {cols && <colgroup>{cols.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>}
            <thead>
                <tr className="text-[15px] text-gray-300">
                    {head.map((h, i) => <th key={i} className={`font-normal ${i > 0 ? 'text-right' : ''}`}>{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {shown.map((r, i) => (
                    <motion.tr key={i} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.45, 0.1) : 0, ease: EASE_OUT }}
                        className={r.strong ? 'text-[18px] font-bold' : 'text-[16px] font-semibold'} style={{ color: r.color ?? '#F3F4F6' }}>
                        {r.cells.map((c, j) => <td key={j} className={`leading-tight ${j > 0 ? 'text-right tabular-nums' : ''}`}>{c}</td>)}
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
};

/** Pé do painel: livro-caixa (opcional) e fonte acumulada. */
export const PanelFoot = ({ children, source }: { children?: ReactNode; source: string }) => (
    <div className="mt-auto flex flex-col gap-3">
        {children}
        <Source>{source}</Source>
    </div>
);
