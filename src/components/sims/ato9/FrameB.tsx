import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura palco + painel da parte B do Ato IX (slides 165–170): abas com nome e selos no alto, palco à esquerda,
 * painel à direita com o título colorido do passo, o texto de pós, um bloco livre e o livro-caixa que acumula,
 * com a fonte acumulada no pé. Caixa: 1136 × 512 px de projeto.
 */

interface FrameProps {
    tabs: readonly string[];
    step: number;
    onSelect: (i: number) => void;
    layoutId: string;
    chips: ReactNode;
    stage: ReactNode;
    panel: ReactNode;
    /** Largura do palco em px de projeto (o painel fica com o resto de 1136). */
    stageWidth?: number;
}

export const FrameB = ({ tabs, step, onSelect, layoutId, chips, stage, panel, stageWidth = 680 }: FrameProps) => (
    <div className="not-prose flex h-[512px] w-full flex-col gap-3 text-gray-100" style={BODY_FONT}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={onSelect} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">
            <Panel className="shrink-0"><div className="relative h-full" style={{ width: stageWidth }}>{stage}</div></Panel>
            {panel}
        </div>
    </div>
);

interface PanelProps {
    step: number;
    headline: string;
    color: string;
    text: string;
    /** Bloco do passo entre o texto e o livro-caixa (dado-chave). */
    children?: ReactNode;
    /** Livro-caixa que acumula (fica no pé, acima da fonte). */
    ledger?: ReactNode;
    source: string;
}

export const PanelB = ({ step, headline, color, text, children, ledger, source }: PanelProps) => (
    <Panel className="flex min-w-0 flex-1 flex-col gap-2.5 px-5 py-4">
        <motion.div key={step} className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        </motion.div>
        {children}
        <div className="mt-auto flex flex-col gap-2">
            {ledger}
            <Source>{source}</Source>
        </div>
    </Panel>
);

export interface LedgerItem {
    /** Passo em que a linha entra (e fica). */
    at: number;
    label: string;
    value: string;
    color: string;
}

/** Livro-caixa de duas colunas: cada linha entra no seu passo e não sai mais. */
export const LedgerB = ({ title, items, step }: { title: string; items: readonly LedgerItem[]; step: number }) => (
    <div className="flex flex-col gap-0.5 border-t-2 border-white/15 pt-2">
        <span className="text-[15px] text-gray-300">{title}</span>
        {items.filter(r => r.at <= step).map((r, i) => (
            <motion.div key={r.label} className="flex items-baseline justify-between gap-3"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.5, 0.1) : 0, ease: EASE_OUT }}>
                <span className="text-[16px] leading-snug text-gray-100">{r.label}</span>
                <span className="shrink-0 font-mono text-[17px] font-bold tabular-nums" style={{ color: r.color }}>{r.value}</span>
            </motion.div>
        ))}
    </div>
);

/** Rótulo de seção do palco (ex.: "1 · o glicogênio"), 16 px. */
export const StageLabel = ({ children, color = '#D1D5DB' }: { children: ReactNode; color?: string }) => (
    <span className="text-[16px] font-semibold uppercase tracking-wide" style={{ color }}>{children}</span>
);

/** Bloco do palco que entra no seu passo e esmaece (≥ 0,6) quando o foco passa a outro bloco; no fim fica legível. */
export const StageBlock = ({ shown, focus, className = '', children }: {
    shown: boolean; focus: boolean; className?: string; children: ReactNode;
}) => (
    <motion.div className={className} initial={false}
        animate={{ opacity: shown ? (focus ? 1 : 0.6) : 0, y: shown ? 0 : 10 }}
        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        {children}
    </motion.div>
);
