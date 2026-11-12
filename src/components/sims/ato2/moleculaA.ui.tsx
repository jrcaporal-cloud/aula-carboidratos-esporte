import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura comum dos slides 20–24 (Ato II, parte A): abas com nome + selos à direita; palco à esquerda
 * (largura fixa, por slide) e painel à direita com o título colorido do passo, o texto de pós, o que
 * acumula (tabela, caderno, contadores) e a fonte acumulada no pé. Altura total 516 px de projeto.
 */
interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    /** Selos do canto superior direito (DesignChip, CalcChip…). */
    chips?: ReactNode;
    stageWidth: number;
    stage: ReactNode;
    children: ReactNode;
    source: string;
    /** Peça ao lado da fonte, no pé do painel (ex.: Model3DHint). */
    footer?: ReactNode;
}

export const MolFrame = ({ tabs, step, setStep, layoutId, chips, stageWidth, stage, children, source, footer }: FrameProps) => (
    <div className="not-prose flex h-[516px] w-full flex-col gap-3" style={BODY_FONT}>
        <div className="flex min-h-[44px] items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">
            <Panel className="shrink-0" ><div style={{ width: stageWidth }} className="h-full">{stage}</div></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                {children}
                <div className="mt-auto flex items-end justify-between gap-3"><Source>{source}</Source>{footer}</div>
            </Panel>
        </div>
    </div>
);

/** Título colorido e texto do passo: trocam juntos a cada clique (entrada curta, sem esperar a saída). */
export const StepText = ({ step, color, headline, text }: { step: number; color: string; headline: string; text: ReactNode }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{headline}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        </motion.div>
    );
};

/** Entra no passo `at` e fica; só o que é novo no passo atual anima (com atraso, depois da arte). */
export const Accrue = ({ at, step, delay = 0.35, className, children }: { at: number; step: number; delay?: number; className?: string; children: ReactNode }) => {
    const reduce = useReducedMotion();
    const isNew = at === step;
    return (
        <motion.div className={className} initial={isNew && !reduce ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, delay: isNew ? delay : 0, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};
