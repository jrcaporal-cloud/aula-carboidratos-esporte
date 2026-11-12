import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { SourceLine, StepHeader } from './ato3/shared';
import { LiverTap } from './ato3/LiverTap';
import { LIVER_STEPS } from './ato3/liver.content';

/**
 * Slide 47 · Quem Defende os 4 Gramas. O fígado como torneira: abre ≤2× no moderado e 7–8× no intenso,
 * mais do que o músculo consome (3–4×), e o copo de 4 g transborda. À direita, o multiplicador do passo.
 */

const SPACED = { wordSpacing: '0.15em' } as const;

const Readout = ({ step }: { step: number }) => {
    if (step === 0) {
        return (
            <>
                <CountUp text="~4 g" className="font-display text-[96px] font-bold leading-none" style={{ color: C.glucose, ...SPACED }} />
                <span className="text-[21px] leading-snug text-gray-100">de glicose no sangue de uma pessoa de 70 kg</span>
            </>
        );
    }
    if (step === 1) {
        return (
            <>
                <CountUp text="até 2×" className="font-display text-[96px] font-bold leading-none" style={{ color: C.glucose, ...SPACED }} />
                <span className="text-[21px] leading-snug text-gray-100">produção de glicose pelo fígado, abaixo de 60% do VO₂máx</span>
            </>
        );
    }
    if (step === 2) {
        return (
            <div className="flex gap-10">
                <div className="flex flex-col gap-1">
                    <CountUp text="7–8×" className="font-display text-[88px] font-bold leading-none" style={{ color: C.glucose }} />
                    <span className="text-[20px] text-gray-100">o fígado produz</span>
                </div>
                <div className="flex flex-col gap-1">
                    <CountUp text="3–4×" delay={0.3} className="font-display text-[88px] font-bold leading-none" style={{ color: C.stone }} />
                    <span className="text-[20px] text-gray-100">o músculo usa</span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2 rounded-2xl border-[3px] p-5" style={{ borderColor: C.insulin }}>
            <span className="font-display text-[30px] font-bold leading-tight text-white" style={SPACED}>diabetes tipo 1</span>
            <span className="text-[20px] leading-snug text-gray-100">a mesma subida aparece, e a insulina que corrige não vem do pâncreas</span>
            <span className="text-[17px] text-gray-300">volta no Ato IX</span>
        </div>
    );
};

export default function LiverTapSim() {
    const { step } = useSlideSteps(LIVER_STEPS.length);
    const reduce = useReducedMotion();
    const s = LIVER_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={<DesignChip>revisão</DesignChip>}>{s.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 items-center gap-12">
                <LiverTap tap={s.tap} drain={s.drain} level={s.level} handle={s.handle} />
                <motion.div key={step} className="flex min-w-0 flex-1 flex-col gap-3"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <Readout step={step} />
                </motion.div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
