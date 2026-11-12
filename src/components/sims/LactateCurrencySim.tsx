import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Stamp } from './kit/Stamp';
import { CountUp } from './kit/CountUp';
import { AnimalChip, DesignChip } from './kit/chips';
import { SourceLine, StepHeader } from './ato3/shared';
import { LactateMap } from './ato3/LactateMap';
import { LACTATE_STEPS } from './ato3/lactate.content';

/**
 * Slide 43 · Lactato é Moeda, não Lixo. Um mapa de órgãos em que o lactato circula como moeda:
 * a lixeira do passo 1 vira lançadeira (moedas "L" viajando), depois o fluxo medido (HUI2017) e o atalho glicose → lactato → Krebs.
 */

const OldReading = ({ stamped }: { stamped: boolean }) => (
    <div className="relative flex flex-col gap-4">
        <p className="m-0 text-[30px] font-semibold leading-tight" style={{ color: stamped ? '#6B7280' : '#E5E7EB' }}>
            “lactato = resíduo da falta de oxigênio”
        </p>
        {stamped && <span className="self-start"><Stamp verdict="mito" size="lg" /></span>}
    </div>
);

const FLUX = [
    { text: '1,1×', caption: 'alimentado' },
    { text: '2,5×', caption: 'em jejum' },
] as const;

const Flux = () => (
    <div className="flex flex-col gap-5">
        <span className="text-[18px] leading-snug text-gray-300">fluxo do lactato na circulação, comparado ao da glicose</span>
        <div className="flex gap-10">
            {FLUX.map((f, i) => (
                <div key={f.text} className="flex flex-col gap-1">
                    <CountUp text={f.text} delay={stagger(i, 0.2, 0.25)} className="font-display text-[84px] font-bold leading-none" style={{ color: C.lactate }} />
                    <span className="text-[20px] text-gray-100">{f.caption}</span>
                </div>
            ))}
        </div>
    </div>
);

const CHAIN = [
    { label: 'glicose', color: C.glucose },
    { label: 'lactato', color: C.lactate },
    { label: 'Krebs', color: C.caveat },
] as const;

const Chain = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-4">
            <span className="text-[18px] text-gray-300">em jejum, nos tecidos</span>
            <div className="flex items-center gap-2">
                {CHAIN.map((c, i) => (
                    <motion.div key={c.label} className="flex items-center gap-2"
                        initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stagger(i, 0.15, 0.2), duration: DUR.enter, ease: EASE_OUT }}>
                        {i > 0 && <ArrowRight size={28} strokeWidth={3} className="text-gray-400" aria-hidden />}
                        <span className="rounded-xl border-[3px] px-3 py-2 text-[24px] font-bold" style={{ borderColor: c.color, color: c.color }}>{c.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const RIGHT = [
    () => <OldReading stamped={false} />,
    () => <OldReading stamped />,
    () => <Flux />,
    () => <Chain />,
];

export default function LactateCurrencySim() {
    const { step } = useSlideSteps(LACTATE_STEPS.length);
    const reduce = useReducedMotion();
    const s = LACTATE_STEPS[step];
    const right = RIGHT[step]();
    const panelKey = step <= 1 ? 'old' : step;
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-4 overflow-hidden">
            <StepHeader beat={step} chips={step >= 2 ? <AnimalChip>camundongo · ¹³C · repouso</AnimalChip> : step === 1 ? <DesignChip>revisão</DesignChip> : undefined}>{s.phrase}</StepHeader>
            <div className="flex min-h-0 flex-1 items-center gap-10">
                <LactateMap step={step} />
                <motion.div key={panelKey} className="min-w-0 flex-1"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    {right}
                </motion.div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </div>
    );
}
