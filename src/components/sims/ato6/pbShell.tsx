import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura palco + painel dos slides 106, 108, 109 e 110 (Ato VI, parte B). Caixa de 1136 × 500 px de projeto:
 * abas com nome e selos no alto; embaixo, o palco (à esquerda) e o painel do passo (à direita).
 */

interface ShellProps {
    tabs: readonly string[];
    step: number;
    setStep: (step: number) => void;
    layoutId: string;
    /** Selos do passo (desenho do estudo, caso fictício, esquema), alinhados à direita das abas. */
    chips?: ReactNode;
    children: ReactNode;
}

export const PbShell = ({ tabs, step, setStep, layoutId, chips, children }: ShellProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3" style={BODY_FONT}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex flex-wrap justify-end gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-4">{children}</div>
    </div>
);

interface SidePanelProps {
    step: number;
    headline: string;
    color: string;
    text: string;
    /** Livro-caixa, tabela ou número-chave (acumula entre passos). */
    children?: ReactNode;
    source: string;
    className?: string;
}

/** Painel do passo: título colorido, texto de pós (troca a cada clique), o bloco que acumula e a fonte acumulada. */
export const PbSidePanel = ({ step, headline, color, text, children, source, className = '' }: SidePanelProps) => (
    <Panel className={`flex min-w-0 flex-1 flex-col gap-3 px-5 py-4 ${className}`}>
        <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{headline}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100" style={{ textWrap: 'pretty' }}>{text}</p>
        </motion.div>
        <div className="mt-auto flex flex-col gap-3">
            {children}
            <Source>{source}</Source>
        </div>
    </Panel>
);

/** Linha que entra no passo `at` e fica (livro-caixa que acumula). */
export const PbRow = ({ at, step, i = 0, children, className = '' }: {
    at: number; step: number; i?: number; children: ReactNode; className?: string;
}) => (
    <motion.tr className={className} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.enter, delay: at === step ? 0.45 + i * 0.12 : 0, ease: EASE_OUT }}>
        {children}
    </motion.tr>
);
