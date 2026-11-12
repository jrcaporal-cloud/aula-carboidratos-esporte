import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura comum dos slides 84–87 (Ato V, parte B), no formato palco + painel da Glicólise:
 * abas com nome e selos no alto; palco à esquerda; painel de pós à direita (título colorido, texto,
 * limitação, extra e a fonte que acumula). Altura total 500 px de projeto (a caixa aceita até 516).
 */

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips: ReactNode;
    /** Largura do palco em px de projeto (o painel fica com o resto de 1136). */
    stageWidth: number;
    stage: ReactNode;
    panel: ReactNode;
}

export const PreRaceFrame = ({ tabs, step, setStep, layoutId, chips, stageWidth, stage, panel }: FrameProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">
            <div className="shrink-0" style={{ width: stageWidth }}>
                <Panel className="h-full">{stage}</Panel>
            </div>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">{panel}</Panel>
        </div>
    </div>
);

interface NarrationProps {
    step: number;
    headline: string;
    color: string;
    text: string;
    /** Linha de limitação do estudo (vai no tom neutro de ressalva). */
    limit?: string;
}

/** Título colorido + texto do passo + limitação. Troca a cada passo (entra pousando, sem esperar a saída). */
export const Narration = ({ step, headline, color, text, limit }: NarrationProps) => (
    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{headline}</h3>
        <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        {limit && (
            <p className="m-0 text-[16px] leading-snug" style={{ color: C.caveat }}>
                <span className="font-semibold">Limitação: </span>{limit}
            </p>
        )}
    </motion.div>
);

/** Rodapé do painel: a linha de fonte acumulada, sempre colada embaixo. */
export const PanelFoot = ({ children, sources }: { children?: ReactNode; sources: string }) => (
    <div className="mt-auto flex flex-col gap-3">
        {children}
        <Source>{sources}</Source>
    </div>
);

/** Lista "para a prática" que acumula um item por passo (o último passo mostra todos). */
export const Takeaways = ({ items, step, color, title = 'Para a prática' }: { items: readonly string[]; step: number; color: string; title?: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[16px] font-bold" style={{ color }}>{title}</span>
        {items.slice(0, step + 1).map((t, i) => (
            <motion.span key={t} className="text-[16px] leading-snug text-gray-100"
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: DUR.enter, delay: i === step ? 0.35 : 0, ease: EASE_OUT }}>
                {t}
            </motion.span>
        ))}
    </div>
);
