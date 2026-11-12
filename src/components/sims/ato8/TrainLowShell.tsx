import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura dos slides 140–144 (Ato VIII, parte A) no formato palco + painel da refação de 12/11:
 * abas com nome à esquerda, selos do passo à direita, e o corpo (palco e painel) embaixo. Altura 500 px de projeto.
 */
export const TrainLowShell = ({ tabs, step, setStep, layoutId, chips, children }: {
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

/**
 * Painel explicativo: título colorido do passo + texto de pós (troca a cada passo) e, embaixo, o que acumula
 * (livro-caixa, número-chave) e a fonte acumulada.
 */
export const StepPanel = ({ step, color, headline, text, children, source, className = '' }: {
    step: number;
    color: string;
    headline: string;
    text: ReactNode;
    children?: ReactNode;
    source: string;
    className?: string;
}) => (
    <Panel className={`flex min-w-0 flex-col gap-3 px-5 py-4 ${className}`}>
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
