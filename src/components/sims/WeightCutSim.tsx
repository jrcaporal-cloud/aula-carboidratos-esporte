import { motion, useReducedMotion } from 'framer-motion';
import { Droplet } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { br } from './kit/format';
import { useTween } from './kit/useTween';
import { castOf } from './kit/cast';
import { CalcChip, DesignChip, FictionChip } from './kit/chips';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import {
    FIBER_DROP_PCT, LEVERS, PLASMA_GAIN_ML, STEPS, SWEAT_ML, TIAGO_AFTER_FIBER, TIAGO_START, TIAGO_TARGET, WATER_MAX, WATER_MIN,
} from './ato9/weightCut.content';

/**
 * Slide 164 · A Balança e a Água. A balança de pesagem do Tiago (caso fictício) à esquerda;
 * à direita, o que a balança não mostra: a água que viaja com o glicogênio (1:3 a 1:17), que não é reserva, e a fibra.
 */

const WATER = C.caveat;

const Scale = ({ kg }: { kg: number }) => {
    const tiago = castOf('tiago');
    const Icon = tiago.icon;
    return (
        <div className="flex w-[400px] shrink-0 flex-col gap-5">
            <div className="flex items-center gap-3">
                <Icon size={30} strokeWidth={2.2} color={C.text} aria-hidden />
                <span className="font-display text-[30px] font-semibold text-white">{tiago.name}</span>
                <span className="text-[18px] text-gray-300">judô −73 kg</span>
                <FictionChip />
            </div>
            {/* balança chapada: prato, corpo e visor */}
            <div className="flex flex-col items-center">
                <div className="h-5 w-[360px] rounded-t-xl" style={{ background: '#475569' }} />
                <div className="flex h-[230px] w-[380px] flex-col items-center justify-center gap-3 rounded-2xl" style={{ background: '#1E293B', border: `3px solid ${C.co2}` }}>
                    <div className="flex h-[96px] w-[260px] items-center justify-center rounded-xl" style={{ background: '#04080F' }}>
                        <span className="font-mono text-[60px] font-bold tabular-nums" style={{ color: C.text }}>{br(kg)}</span>
                    </div>
                    <span className="text-[18px] text-gray-300">kg · alvo {br(TIAGO_TARGET)} na véspera</span>
                </div>
            </div>
        </div>
    );
};

/** 1 g de glicogênio (violeta) e os gramas de água que viajam com ele. */
const WaterRatio = ({ count }: { count: number }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-2">
                <span className="block h-[52px] w-[52px] rounded-lg" style={{ background: C.glycogen }} />
                <span className="text-[16px] text-gray-200">1 g</span>
            </div>
            <span className="pt-2 font-display text-[40px] font-bold leading-none text-gray-300">+</span>
            <div className="flex flex-col gap-3">
                <div className="flex w-[400px] flex-wrap gap-2">
                    {Array.from({ length: WATER_MAX }, (_, i) => (
                        <motion.span key={i} className="flex h-[40px] w-[40px] items-center justify-center rounded-lg" style={{ background: WATER }}
                            initial={false} animate={{ opacity: i < count ? 1 : 0.08, scale: i < count || reduce ? 1 : 0.92 }}
                            transition={{ delay: i < count ? stagger(i - WATER_MIN, 0.1, 0.03) : 0, duration: DUR.enter, ease: EASE_OUT }}>
                            <Droplet size={20} strokeWidth={2.4} color="#04080F" aria-hidden />
                        </motion.span>
                    ))}
                </div>
                <span className="font-display text-[48px] font-bold leading-none text-white">1 : {count}</span>
                <span className="text-[18px] text-gray-300">{count === WATER_MIN ? 'pouca água na recuperação (piso)' : 'água reposta à vontade'}</span>
            </div>
        </div>
    );
};

const NotACanteen = ({ show }: { show: boolean }) => (
    <div className="flex flex-col gap-5">
        {[{ label: 'suor perdido', ml: SWEAT_ML, color: C.co2 }, { label: 'devolvido ao plasma pelo glicogênio', ml: PLASMA_GAIN_ML, color: WATER }].map((r, i) => (
            <div key={r.label} className="flex flex-col gap-2">
                <span className="text-[20px] text-gray-200">{r.label} · <b className="font-mono text-white">{r.ml.toLocaleString('pt-BR')} mL</b></span>
                <div className="relative h-10 w-[560px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Grow value={show ? r.ml / SWEAT_ML : 0} color={r.color} delay={i * 0.3} />
                </div>
            </div>
        ))}
    </div>
);

const Fiber = () => (
    <div className="flex flex-col gap-3">
        <span className="font-display text-[88px] font-bold leading-none" style={{ color: C.text }}>−{br(FIBER_DROP_PCT, 2)}%</span>
        <span className="text-[22px] text-gray-200">da massa na manhã do 5º dia</span>
        <span className="text-[22px] text-white">no Tiago: ~{br(TIAGO_START - TIAGO_AFTER_FIBER, 2)} kg</span>
        <span className="text-[18px] text-gray-300">variação individual grande: o desvio-padrão passou da média</span>
    </div>
);

export default function WeightCutSim() {
    const { step } = useSlideSteps(STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const kg = useTween(step >= 4 ? TIAGO_AFTER_FIBER : TIAGO_START, reduce, 900);
    const s = STEPS[step];
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={s.say} className="min-h-[68px]" chips={s.design ? <>
                <DesignChip>{s.design}</DesignChip>
                {step === 4 && <CalcChip />}
            </> : undefined} />
            <div className="mt-5 flex min-h-0 flex-1 gap-12">
                <Scale kg={kg} />
                <div className="relative min-w-0 flex-1">
                    <Reveal show={step === 0} className="absolute inset-0 flex flex-col gap-5 pt-14">
                        {LEVERS.map((l, i) => (
                            <Reveal key={l} show={step === 0} delay={0.15 + i * 0.12} className="flex items-center gap-4 text-[26px] text-gray-100">
                                <span className="block h-4 w-4 rounded-full" style={{ background: i === 0 ? C.glycogen : C.co2 }} />{l}
                            </Reveal>
                        ))}
                    </Reveal>
                    <Reveal show={step === 1 || step === 2} className="absolute inset-0 pt-10"><WaterRatio count={step >= 2 ? WATER_MAX : WATER_MIN} /></Reveal>
                    <Reveal show={step === 3} className="absolute inset-0 pt-12"><NotACanteen show={step === 3} /></Reveal>
                    <Reveal show={step === 4} className="absolute inset-0 pt-10">{step === 4 && <Fiber />}</Reveal>
                </div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </SimBox>
    );
}
