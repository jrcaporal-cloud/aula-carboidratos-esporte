import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip, DesignChip } from './kit/chips';
import { SourceLine, StepHeader } from './ato3/shared';
import { ENGINES, OXY_STEPS } from './ato3/oxygen.content';

/**
 * Slide 46 · O Preço do Oxigênio. Dois cilindros de O₂ lado a lado: primeiro o mesmo litro rende energias diferentes,
 * depois o cilindro do motor a gordura cresce (~7,7% a mais de O₂ para o mesmo trabalho), e o gancho para o Supernova.
 */

const CYL_W = 128;
const CYL_H = 210;
const O2 = '#CBD5E1';
/** A Clash Display tem espaço estreito: número e unidade colam sem isto. */
const SPACED = { wordSpacing: '0.2em' } as const;

const Engine = ({ e, step }: { e: (typeof ENGINES)[number]; step: number }) => {
    const reduce = useReducedMotion();
    const color = e.key === 'cho' ? C.glucose : C.fat;
    const sameWork = step >= 2;
    return (
        <div className="flex w-[330px] flex-col items-center gap-3">
            <span className="text-[22px] font-bold" style={{ color }}>{e.label}</span>
            <div className="relative flex items-end justify-center" style={{ width: CYL_W, height: CYL_H * 1.1 }}>
                <motion.div className="relative flex items-center justify-center rounded-[28px] border-[3px]"
                    style={{ width: CYL_W, height: CYL_H, borderColor: O2, background: O2, transformOrigin: 'center bottom' }}
                    initial={false} animate={{ scaleY: sameWork ? e.scale : 1 }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }}>
                    <span className="font-display text-[34px] font-bold text-[#04080F]">O₂</span>
                </motion.div>
            </div>
            <span className="font-display text-[30px] font-semibold tabular-nums text-white" style={SPACED}>{sameWork ? e.need : '1 L'}</span>
            <div className="relative h-[54px] w-full">
                {step >= 1 && !sameWork && (
                    <div className="flex items-center gap-3">
                        <div className="relative h-8 flex-1 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <Grow value={e.value / 22} color={color} delay={0.1} />
                        </div>
                        <CountUp text={e.kj} delay={0.1} className="w-[124px] font-display text-[30px] font-semibold" style={{ color, ...SPACED }} />
                    </div>
                )}
                {step >= 1 && !sameWork && <span className="absolute left-0 top-9 text-[17px] text-gray-300">{e.kcal} por litro</span>}
                {sameWork && <span className="block text-center text-[19px] text-gray-100">para o mesmo trabalho</span>}
            </div>
        </div>
    );
};

const Delta = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    if (step < 2) return null;
    return (
        <motion.div key={step === 3 ? 'hook' : 'delta'} className="flex flex-col gap-3"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
            {step === 2 ? (
                <>
                    <CountUp text="~7,7%" delay={0.4} className="font-display text-[88px] font-bold leading-none" style={{ color: C.fat }} />
                    <span className="text-[21px] leading-snug text-gray-100">mais O₂ queimando gordura</span>
                    <span className="self-start"><CalcChip>cálculo: 21,1 ÷ 19,6</CalcChip></span>
                </>
            ) : (
                <div className="flex flex-col gap-2 rounded-2xl border-[3px] p-5" style={{ borderColor: C.glucose }}>
                    <span className="font-display text-[30px] font-bold leading-tight text-white" style={SPACED}>Projeto Supernova</span>
                    <span className="text-[20px] leading-snug text-gray-100">dieta rica em gordura: mais O₂ no ritmo de prova</span>
                    <span className="text-[17px] text-gray-300">volta no Ato VIII</span>
                </div>
            )}
        </motion.div>
    );
};

export default function OxygenPriceSim() {
    const { step } = useSlideSteps(OXY_STEPS.length);
    const s = OXY_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={step === 3 ? <DesignChip>elite · não randomizado</DesignChip> : step === 0 ? undefined : <DesignChip>artigo teórico</DesignChip>}>{s.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 items-center gap-6">
                {ENGINES.map(e => <Engine key={e.key} e={e} step={step} />)}
                <div className="ml-6 min-w-0 flex-1"><Delta step={step} /></div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
