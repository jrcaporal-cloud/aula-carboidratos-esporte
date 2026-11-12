import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { StepTabs } from '../kit/ui';

/**
 * Moldura comum aos slides 25, 26, 27 e 29 (Ato II, parte B): abas com nome à esquerda, selos à direita,
 * e o corpo embaixo (palco + painel, na ordem que cada slide quiser). Altura fixa de 500 px de projeto.
 */
interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips: ReactNode;
    children: ReactNode;
}

export const AbsorbFrame = ({ tabs, step, setStep, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3" style={BODY_FONT}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex flex-wrap items-center justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">{children}</div>
    </div>
);

/** Título colorido e texto do passo: troca com subida curta a cada clique (sem esperar a saída). */
export const StepText = ({ step, headline, color, text }: { step: number; headline: string; color: string; text: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div key={step} className="flex flex-col gap-2" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        </motion.div>
    );
};

