import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CountUp } from './kit/CountUp';
import { ViaReviewChip } from './kit/chips';
import { SourceLine, StepHeader } from './ato3/shared';
import { GlucoseScale, History, Route } from './ato3/BostonParts';
import { BOSTON_STEPS } from './ato3/boston.content';

/**
 * Slide 48 · Boston, 1923. Tipografia como palco: o ano enorme, o percurso de 42 km correndo embaixo,
 * a régua da glicemia acendendo o vermelho, e por fim o ano vira o primeiro ponto de uma linha do tempo.
 */

export default function Boston1923Sim() {
    const { step } = useSlideSteps(BOSTON_STEPS.length);
    const reduce = useReducedMotion();
    const s = BOSTON_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={<ViaReviewChip>via revisão · original não lido</ViaReviewChip>}>{s.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-6">
                {step < 2 ? (
                    <>
                        <div className="flex items-end gap-10">
                            <span className="font-display text-[150px] font-bold leading-[0.85] text-white">1923</span>
                            {step === 1 && (
                                <motion.div className="flex flex-col pb-2" initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: DUR.enter, ease: EASE_OUT }}>
                                    <CountUp text="< 4 mmol/L" delay={0.5} className="font-display text-[64px] font-bold leading-none" style={{ color: C.risk, wordSpacing: '0.15em' }} />
                                    <span className="text-[20px] text-gray-100">glicemia na chegada</span>
                                </motion.div>
                            )}
                        </div>
                        {step === 0 ? <Route /> : <GlucoseScale />}
                    </>
                ) : (
                    <History />
                )}
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
