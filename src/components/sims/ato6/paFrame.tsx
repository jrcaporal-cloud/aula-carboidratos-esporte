import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { BODY_FONT, C } from '../kit/palette';
import { Panel, Source, StepTabs } from '../kit/ui';

/**
 * Moldura palco + painel dos slides 100–105 (Ato VI, parte A). Não é o Frame.tsx do ato (compartilhado):
 * em cima, abas com nome e selos à direita; à esquerda, o palco (arte/gráfico); à direita, o painel com o
 * título colorido do passo, o texto de pós, as lições que acumulam e a fonte acumulada no pé.
 */

/** Altura total da caixa (≤ 516 px de projeto) e largura do palco. */
export const PA_H = 506;
export const STAGE_W = 652;
/** Área útil do palco (dentro da borda de 2 px), usada como viewBox dos desenhos. */
export const STAGE_INNER_W = 648;
export const STAGE_INNER_H = 446;

interface PaFrameProps {
    tabs: readonly string[];
    step: number;
    onSelect: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    stage: ReactNode;
    panel: ReactNode;
    /** Largura do palco, se o slide quiser outra proporção. */
    stageWidth?: number;
}

export const PaFrame = ({ tabs, step, onSelect, layoutId, chips, stage, panel, stageWidth = STAGE_W }: PaFrameProps) => (
    <div className="not-prose flex w-full flex-col gap-3" style={{ ...BODY_FONT, height: PA_H }}>
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={onSelect} layoutId={layoutId} />
            {chips && <div className="flex flex-wrap justify-end gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-4">
            <div className="h-full shrink-0" style={{ width: stageWidth }}>
                <Panel className="h-full">{stage}</Panel>
            </div>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">{panel}</Panel>
        </div>
    </div>
);

export interface Lesson {
    /** Passo em que a lição entra (e fica). */
    at: number;
    text: string;
    color?: string;
}

interface PaSideProps {
    step: number;
    color: string;
    headline: string;
    text: ReactNode;
    /** Bloco do passo entre o texto e as lições (número-chave, régua…). */
    children?: ReactNode;
    lessons?: readonly Lesson[];
    source: string;
}

/** Painel: título colorido + texto do passo (troca a cada clique); lições que acumulam; fonte no pé. */
export const PaSide = ({ step, color, headline, text, children, lessons = [], source }: PaSideProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <>
            <motion.div key={`head-${step}`} className="flex flex-col gap-2" initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <h3 className="m-0 text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color }}>{headline}</h3>
                <div className="m-0 text-[17px] leading-snug text-gray-100" style={{ textWrap: 'pretty' }}>{text}</div>
            </motion.div>
            {children}
            <div className="mt-auto flex flex-col gap-2.5">
                {lessons.some(l => l.at <= step) && <Lessons step={step} lessons={lessons} />}
                <Source>{source}</Source>
            </div>
        </>
    );
};

/** Lições do slide: uma por passo, ficam até o fim (o quadro final é a soma). */
const Lessons = ({ step, lessons }: { step: number; lessons: readonly Lesson[] }) => (
    <ul className="m-0 flex list-none flex-col gap-1 border-t-2 border-white/15 p-0 pt-2.5">
        {lessons.filter(l => l.at <= step).map((l, i) => (
            <motion.li key={l.text} className="flex items-baseline gap-2.5 text-[16px] leading-snug text-gray-100"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: DUR.enter, delay: l.at === step ? stagger(i, 0.35, 0.05) : 0, ease: EASE_OUT }}>
                <span aria-hidden className="h-[10px] w-[10px] shrink-0 translate-y-[1px] rounded-sm" style={{ background: l.color ?? C.glucose }} />
                <span>{l.text}</span>
            </motion.li>
        ))}
    </ul>
);

/** Destaque em cor dentro do texto do painel. */
export const Hl = ({ children, color = C.glucoseSoft }: { children: ReactNode; color?: string }) => (
    <strong className="font-semibold" style={{ color }}>{children}</strong>
);
