import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT } from '../kit/palette';
import { StepTabs } from '../kit/ui';

/**
 * Peças comuns da parte B do Ato III (slides 46–49: oxigênio, fígado, Boston, resgate), no formato palco + painel.
 * Só a moldura (abas com nome + selos à direita) e o texto do passo; cada slide monta o seu palco e o seu livro-caixa.
 */

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    /** Selos do passo (desenho do estudo, cálculo, ilustrativo…): à direita das abas. */
    chips?: ReactNode;
    children: ReactNode;
}

/** Caixa do simulador: 1136 × 500 de projeto. Abas no alto, palco e painel embaixo. */
export const MotorFrame = ({ tabs, step, setStep, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose flex h-[500px] w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex flex-wrap justify-end gap-2">{chips}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-4">{children}</div>
    </div>
);

interface StepTextProps {
    step: number;
    color: string;
    headline: string;
    text: string;
}

/** A Clash Display não tem os subscritos (₂): eles vão na fonte do corpo, o resto do título fica na display. */
const withSubscripts = (text: string): ReactNode[] =>
    text.split(/([₀-₉]+)/).map((part, i) => (/[₀-₉]/.test(part) ? <span key={i} style={BODY_FONT}>{part}</span> : part));

/** Título colorido do passo (24 px) e o texto de pós (17 px). Troca com uma entrada curta a cada clique. */
export const StepText = ({ step, color, headline, text }: StepTextProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div key={step} className="flex flex-col gap-2"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color }}>{withSubscripts(headline)}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
        </motion.div>
    );
};
