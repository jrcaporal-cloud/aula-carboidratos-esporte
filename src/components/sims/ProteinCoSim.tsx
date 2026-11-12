import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { Narration, RecTop } from './ato7/RecFrame';
import { CravenForest, MargolisForest, VanLoonBars } from './ato7/ProteinCards';
import { CONDITIONS, PROTEIN_CALC, PROTEIN_CHIPS, PROTEIN_STEPS } from './ato7/protein.content';

/**
 * Slide 122 · Proteína Ajuda? Depende. Tríptico + faixa de narração (composição diferente dos slides 120–121):
 * em cima, três cartões que se acendem em ordem e ficam (van Loon 2000 → Margolis 2021 → Craven 2021);
 * embaixo, o texto do passo à esquerda e o caderno "só ajuda se…" à direita, que acumula.
 */

const ACCENT = [C.proteinSoft, C.glycogenSoft, C.proteinSoft, C.stone, C.glucose] as const;

interface CardProps {
    title: string;
    sub: string;
    at: number;
    step: number;
    children: ReactNode;
}

const Card = ({ title, sub, at, step, children }: CardProps) => (
    <Panel state={step >= at ? (step === at ? 'active' : 'idle') : 'dim'} glow={C.protein} className="flex flex-1 flex-col gap-1 px-3 pt-2.5">
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-[19px] font-bold text-white">{title}</span>
            <span className="text-[15px] text-gray-300">{sub}</span>
        </div>
        {children}
    </Panel>
);

const Notebook = ({ step }: { step: number }) => (
    <div className="flex w-[400px] shrink-0 flex-col gap-2">
        <span className="font-display text-[22px] font-semibold leading-none text-white">Só ajuda se…</span>
        {CONDITIONS.map(c => {
            const on = step >= c.at;
            return (
                <div key={c.text} className="flex items-start gap-3 transition-opacity duration-300" style={{ opacity: on ? 1 : 0.6 }}>
                    <motion.span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[3px]"
                        initial={false} animate={{ scale: on && step === c.at ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: EASE_OUT }}
                        style={{ borderColor: on ? C.ok : 'rgba(255,255,255,0.4)', background: on ? C.ok : 'transparent' }}>
                        {on && <Check size={18} strokeWidth={3.5} color="#04080F" aria-hidden />}
                    </motion.span>
                    <span className="text-[18px] leading-snug text-white">{c.text}</span>
                </div>
            );
        })}
    </div>
);

export default function ProteinCoSim() {
    const { step, setStep } = useSlideSteps(PROTEIN_STEPS.length);
    const s = PROTEIN_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <RecTop tabs={PROTEIN_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="protein-tabs"
                chips={<>
                    {PROTEIN_CHIPS[step].map(c => <DesignChip key={c}>{c}</DesignChip>)}
                    {PROTEIN_CALC[step] && <CalcChip>{PROTEIN_CALC[step]}</CalcChip>}
                </>} />
            <div className="flex h-[256px] shrink-0 gap-3">
                <Card title="van Loon 2000" sub="a cada 30 min, 5 h" at={0} step={step}><VanLoonBars step={step} /></Card>
                <Card title="Margolis 2021" sub="CHO + PTN × CHO" at={2} step={step}><MargolisForest step={step} /></Card>
                <Card title="Craven 2021" sub="até 8 h" at={3} step={step}><CravenForest step={step} /></Card>
            </div>
            <Panel className="flex min-h-0 flex-1 gap-6 px-5 py-3">
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                    <Narration step={step} headline={s.headline} color={ACCENT[step]} size={17}>{s.text}</Narration>
                    <motion.div key={`src-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text }}>
                        <Source>{sourcesUpTo(PROTEIN_STEPS.map(p => p.sources), step)}</Source>
                    </motion.div>
                </div>
                <Notebook step={step} />
            </Panel>
        </div>
    );
}
