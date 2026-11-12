import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { CountUp } from './kit/CountUp';
import { AnimalChip, DesignChip } from './kit/chips';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Panel, Source } from './kit/ui';
import { AbsorbFrame, StepText } from './ato2/AbsorbFrame';
import { FructoseGrid } from './ato2/FructoseGrid';
import { PATH_STEPS, type PathChip } from './ato2/fructosePath.content';

/**
 * Slide 27 · O Caminho da Frutose e da Galactose. Palco em grade (estação × açúcar) que se monta e não apaga:
 * a frutose passa pelo intestino, pelo fígado e chega ao músculo; a galactose entra na linha de baixo;
 * o último passo compara as duas pela porta de entrada. Painel: texto do passo + dado-chave + fontes acumuladas.
 */
const CHIP: Record<PathChip, ReactElement> = {
    animal: <AnimalChip>camundongo · traçadores</AnimalChip>,
    review: <DesignChip>revisão · traçadores · humanos</DesignChip>,
    lecoultre: <DesignChip>cruzado · n = 7 · traçadores</DesignChip>,
    leijssen: <DesignChip>cruzado randomizado · n = 8 · ¹³C</DesignChip>,
    summary: <DesignChip>síntese: camundongo, revisão, n = 7, n = 8</DesignChip>,
};

export default function FructosePathSim() {
    const { step, setStep } = useSlideSteps(PATH_STEPS.length);
    const s = PATH_STEPS[step];
    return (
        <AbsorbFrame tabs={PATH_STEPS.map(p => p.tab)} step={step} setStep={setStep} layoutId="fructose-tabs"
            chips={s.chips.map(c => <span key={c}>{CHIP[c]}</span>)}>
            <Panel className="shrink-0 px-1 py-1"><FructoseGrid step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-3">
                <StepText step={step} headline={s.headline} color={s.color} text={s.text} />
                <div className="mt-auto flex flex-col gap-2">
                    <motion.div key={`k-${step}`} className="flex flex-col gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: DUR.enter, delay: 0.3, ease: EASE_OUT }}>
                        <KeyFact color={s.color} delay={0.45} className="self-start">
                            <CountUp text={s.key} delay={0.3} className="font-display text-[44px] font-bold leading-none" style={{ color: s.color }} />
                        </KeyFact>
                        <span className="text-[16px] leading-tight text-gray-200">{s.keyCaption}</span>
                    </motion.div>
                    <Source>{sourcesUpTo(PATH_STEPS.map(p => p.sources), step)}</Source>
                </div>
            </Panel>
        </AbsorbFrame>
    );
}
