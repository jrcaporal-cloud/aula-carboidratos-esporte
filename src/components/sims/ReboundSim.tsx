import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { GlycemiaChart } from './ato5/GlycemiaChart';
import { ARMS, BEATS, DESIGNS, FOSTER, MYTH, SOURCES, TEXT } from './ato5/rebound.content';

/**
 * Slide 85 · O Fantasma do Rebote. Começa pela frase-mito ocupando o gráfico e o −19% de Foster (1979);
 * a frase sai por clip-path e revela o gráfico de Moseley: três glicemias de largada que, em 10 min de pedal,
 * se encontram (useMorphPath). Fecha com as três potências quase iguais.
 */
/** Barras a partir do zero: a diferença real (268–276 W) tem de parecer pequena, como é. */
const WATT_MAX = 300;

const FosterCard = () => (
    <div className="flex h-full flex-col justify-center gap-3 px-8">
        <span className="font-display text-[40px] font-bold leading-none text-gray-300">{FOSTER.year}</span>
        <CountUp text={FOSTER.value} delay={0.15} className="font-display text-[96px] font-bold leading-none" style={{ color: C.risk }} />
        <span className="text-[22px] text-gray-100">{FOSTER.detail}</span>
    </div>
);

const HypoCard = () => (
    <div className="flex h-full flex-col justify-center gap-4 px-8">
        <span className="text-[22px] font-semibold text-white">{TEXT.hypoTitle}</span>
        {ARMS.map((a, i) => (
            <motion.div key={a.id} className="flex items-baseline gap-4" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="w-[90px] font-mono text-[20px] font-bold" style={{ color: a.color }}>{a.label}</span>
                <span className="font-display text-[44px] font-bold leading-none text-white">{a.hypo}</span>
                <span className="text-[20px] text-gray-300">{TEXT.ofEight}</span>
            </motion.div>
        ))}
        <span className="text-[20px] text-gray-100">{TEXT.hypoNote}</span>
    </div>
);

const WattsCard = () => (
    <div className="flex h-full flex-col justify-center gap-5 px-8">
        <span className="text-[22px] font-semibold text-white">{TEXT.watts}</span>
        {ARMS.map((a, i) => (
            <div key={a.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[20px] font-bold" style={{ color: a.color }}>{a.label}</span>
                    <CountUp text={`${a.watts} W`} delay={0.1 + i * 0.1} className="font-display text-[40px] font-bold leading-none text-white" />
                </div>
                <div className="relative h-[24px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Grow value={a.watts / WATT_MAX} color={a.color} delay={0.1 + i * 0.1} />
                </div>
            </div>
        ))}
    </div>
);

const SideCard = ({ step }: { step: number }) => {
    if (step === 0) return <FosterCard />;
    if (step === 3) return <WattsCard />;
    if (step === 2) return <HypoCard />;
    return (
        <div className="flex h-full flex-col justify-center gap-4 px-8">
            <span className="font-display text-[64px] font-bold leading-none" style={{ color: C.glucose }}>{TEXT.dose}</span>
            <span className="text-[22px] text-gray-100">{TEXT.doseDetail}</span>
        </div>
    );
};

export default function ReboundSim() {
    const { step } = useSlideSteps(BEATS.length);
    const reduce = useReducedMotion();
    const myth = step === 0;
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ maxHeight: 516 }}>
            <div className="flex min-h-[80px] items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[800px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                <div className="flex flex-col items-end gap-2">
                    <Beat beat={DESIGNS[step]}><DesignChip>{DESIGNS[step]}</DesignChip></Beat>
                    {step >= 1 && <IllustrativeChip />}
                </div>
            </div>
            <div className="flex gap-5" style={{ height: 392 }}>
                <div className="relative w-[700px] shrink-0 overflow-hidden rounded-2xl px-2 py-2" style={PANEL_BG}>
                    <GlycemiaChart open={step >= 2} showTen={step >= 2} />
                    <motion.div className="absolute inset-0 flex items-center justify-center px-14" style={{ background: '#060C17' }}
                        initial={false}
                        animate={{ clipPath: myth ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)' }}
                        transition={{ duration: reduce ? 0 : DUR.bar, ease: EASE_IN_OUT }}>
                        <span className="font-display text-[52px] font-bold leading-tight text-white">{MYTH}</span>
                    </motion.div>
                </div>
                <div className="relative flex-1 overflow-hidden rounded-2xl" style={PANEL_BG}>
                    <Beat beat={step} className="h-full"><SideCard step={step} /></Beat>
                </div>
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
