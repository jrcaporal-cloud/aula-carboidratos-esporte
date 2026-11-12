import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { Panel, Source } from '../kit/ui';

/**
 * Painel de explicação dos slides 124–126 (Ato VII, parte B): título colorido do passo, texto de pós,
 * livro-caixa que acumula (cada linha entra no seu passo e fica) e a fonte acumulada no pé.
 * A linha nova do passo ganha o pulso do KeyFact: é onde o professor bate.
 */

export interface LedgerRow {
    at: number;
    label: string;
    value: string;
    color: string;
}

interface RefillPanelProps {
    step: number;
    headline: string;
    color: string;
    text: string;
    /** Limitação ou ressalva do passo, em linha menor. */
    note?: string;
    rows: readonly LedgerRow[];
    source: string;
    /** Tamanho do corpo (px): 17 por padrão; 16 quando o texto do passo é longo. */
    size?: number;
    className?: string;
    /** Peça extra entre o texto e o livro-caixa (ex.: o cartão do personagem). */
    children?: ReactNode;
}

const Ledger = ({ step, rows }: { step: number; rows: readonly LedgerRow[] }) => {
    const shown = rows.filter(r => r.at <= step);
    const firstNew = shown.findIndex(r => r.at === step);
    return (
        <div className="flex flex-col gap-0.5 border-t-2 border-white/15 pt-2">
            {shown.map((r, i) => {
                const fresh = r.at === step;
                const value = <span className="font-display text-[18px] font-semibold leading-snug tabular-nums" style={{ color: r.color }}>{r.value}</span>;
                return (
                    <motion.div key={r.label} className="flex items-baseline justify-between gap-3"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT, delay: fresh ? stagger(i - firstNew, 0.45, 0.12) : 0 }}>
                        <span className="text-[16px] leading-tight text-gray-300">{r.label}</span>
                        {fresh && i === firstNew ? <KeyFact color={r.color} delay={0.55}>{value}</KeyFact> : value}
                    </motion.div>
                );
            })}
        </div>
    );
};

export const RefillPanel = ({ step, headline, color, text, note, rows, source, size = 17, className = '', children }: RefillPanelProps) => (
    <Panel className={`flex min-w-0 flex-col gap-2.5 px-5 py-3.5 ${className}`}>
        <motion.div key={step} className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 text-[23px] font-bold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
            <p className="m-0 leading-snug text-gray-100" style={{ fontSize: size }}>{text}</p>
            {note && <p className="m-0 text-[16px] italic leading-snug text-gray-300">{note}</p>}
        </motion.div>
        {children}
        <div className="mt-auto flex flex-col gap-2">
            <Ledger step={step} rows={rows} />
            <Source>{source}</Source>
        </div>
    </Panel>
);
