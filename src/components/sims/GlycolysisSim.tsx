import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { SourceLine, StepHeader } from './ato3/shared';
import { Staircase } from './ato3/Staircase';
import { GLYCO_STEPS } from './ato3/glycolysis.content';

/**
 * Slide 42 · A Escada da Glicólise. Cena que se monta: os degraus acendem de cima para baixo,
 * o portão da PFK gira quando ADP/AMP/Pi chegam, e no fim o piruvato se bifurca (PDH × lactato).
 */

const FORK_X = 880;
const FORK_FROM = 836;

const ForkBox = ({ top, height, color, delay, children }: { top: number; height: number; color: string; delay: number; children: ReactNode }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className="absolute flex flex-col justify-center gap-1 rounded-2xl border-[3px] px-4"
            style={{ left: FORK_X, top, width: 1136 - FORK_X, height, borderColor: color, background: '#0B1220' }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: DUR.enter, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

const Fork = () => {
    const reduce = useReducedMotion();
    return (
        <>
            <motion.svg className="absolute left-0 top-0" width={1136} height={360} viewBox="0 0 1136 360" aria-hidden
                initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: DUR.bar, ease: EASE_OUT }}>
                <path d={`M ${FORK_FROM} 330 C 860 330, 860 112, ${FORK_X} 112`} fill="none" stroke={C.caveat} strokeWidth={4} />
                <path d={`M ${FORK_FROM} 330 C 860 330, 860 300, ${FORK_X} 300`} fill="none" stroke={C.lactate} strokeWidth={4} />
            </motion.svg>
            <ForkBox top={22} height={180} color={C.caveat} delay={0.25}>
                <span className="text-[22px] font-bold text-white">mitocôndria</span>
                <span className="text-[18px] text-gray-200">via PDH, rumo ao Krebs</span>
                <span className="mt-1 text-[21px] font-semibold" style={{ color: C.glucoseSoft }}>~30–32 ATP por glicose</span>
                <span className="self-start"><CalcChip>cálculo pelo P/O</CalcChip></span>
            </ForkBox>
            <ForkBox top={232} height={128} color={C.lactate} delay={0.4}>
                <span className="text-[22px] font-bold" style={{ color: C.lactate }}>lactato</span>
                <span className="text-[18px] leading-snug text-gray-200">devolve o NAD⁺ à escada; forma-se mesmo com O₂</span>
            </ForkBox>
        </>
    );
};

export default function GlycolysisSim() {
    const { step } = useSlideSteps(GLYCO_STEPS.length);
    const s = GLYCO_STEPS[step];
    const reduce = useReducedMotion();
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={step === 3 ? <DesignChip>lactato: revisão</DesignChip> : undefined}>{s.phrase}</StepHeader>
            <div className="relative mt-auto h-[360px] w-full">
                <Staircase lit={s.lit} gateOpen={s.gateOpen} />
                {step === 2 && (
                    <motion.div className="absolute flex flex-col items-start gap-2" style={{ left: FORK_X + 20, top: 150 }}
                        initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: DUR.enter, ease: EASE_OUT }}>
                        <span className="text-[18px] text-gray-300">saldo</span>
                        <span className="font-display text-[64px] font-bold leading-none" style={{ color: C.glucose, wordSpacing: '0.18em' }}>2 ATP</span>
                        <CalcChip>4 − 2, por glicose</CalcChip>
                    </motion.div>
                )}
                {s.fork && <Fork />}
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
