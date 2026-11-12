import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, StepTabs } from '../kit/ui';

/**
 * Moldura palco + painel dos slides 111–113 (Ato VI, parte C). Não é o Frame.tsx do ato (compartilhado).
 * Em cima, abas com nome e selos à direita; embaixo, o palco (largura fixa) e o painel do passo.
 */

/** Altura total da caixa (≤ 516 px de projeto). */
export const PC_H = 516;

interface PcFrameProps {
    tabs: readonly string[];
    step: number;
    onSelect: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    stage: ReactNode;
    panel: ReactNode;
    stageWidth: number;
}

export const PcFrame = ({ tabs, step, onSelect, layoutId, chips, stage, panel, stageWidth }: PcFrameProps) => (
    <div className="not-prose flex w-full flex-col gap-3" style={{ ...BODY_FONT, height: PC_H }}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={onSelect} layoutId={layoutId} />
            {chips && <div className="flex flex-wrap justify-end gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-4">
            <div className="h-full shrink-0" style={{ width: stageWidth }}>
                <Panel className="h-full">{stage}</Panel>
            </div>
            <Panel className="flex min-w-0 flex-1 flex-col gap-2.5 px-5 py-3">{panel}</Panel>
        </div>
    </div>
);

/** "p = 0,25", "n = 12": espaço inquebrável em volta do "=" para o número não ficar sozinho na linha de baixo. */
const keepTogether = (text: string): string => text.replace(/ = /g, '\u00A0=\u00A0');

interface PcHeadProps {
    step: number;
    color: string;
    headline: string;
    text: ReactNode;
}

/** Título colorido + texto de pós do passo: troca a cada clique, com entrada curta. */
export const PcHead = ({ step, color, headline, text }: PcHeadProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div key={step} className="flex flex-col gap-1.5" initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
            <div className="m-0 text-[17px] leading-snug text-gray-100" style={{ textWrap: 'pretty' }}>{typeof text === 'string' ? keepTogether(text) : text}</div>
        </motion.div>
    );
};

/** Destaque em cor dentro do texto do painel. */
export const PcHl = ({ children, color }: { children: ReactNode; color: string }) => (
    <strong className="font-semibold" style={{ color }}>{children}</strong>
);
