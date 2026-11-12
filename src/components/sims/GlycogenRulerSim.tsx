import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp, Equal } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { DesignChip, ViaReviewChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { RulerTrack } from './ato4/RulerTrack';
import { BODY_STORES, GRAMS_MAX, MAG_MAX, MAGNITUDE, MARKS, RULER_LEADS, RULER_SOURCE, TRAINING } from './ato4/ruler.content';

/**
 * Slide 63 · a régua do glicogênio. Em cima, a régua grande com marcadores que deslizam (normal, carga, depleção);
 * embaixo, a leitura do passo: o tamanho do efeito, os estoques em gramas, o que o treino muda.
 */

/** Régua de magnitude de Areta: onde cai o |efeito| deste passo. */
const Magnitude = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const mark = MARKS[Math.min(step, 2)];
    const size = Math.abs(mark.value - MARKS[0].value);
    return (
        <div className="mx-8 [container-type:inline-size]">
            <div className="relative h-[28px]">
                <motion.div className="absolute top-0 w-0" initial={false} animate={{ x: `${(size / MAG_MAX) * 100}cqw` }}
                    transition={{ duration: reduce ? 0 : DUR.morph * 1.8, ease: EASE_IN_OUT }}>
                    <span className="absolute left-[-12px] top-0 block h-0 w-0 border-x-[12px] border-t-[18px] border-x-transparent" style={{ borderTopColor: mark.color }} />
                </motion.div>
            </div>
            <div className="relative flex h-[14px]">
                {MAGNITUDE.map((m, i) => (
                    <div key={m.label} className="h-full" style={{ width: `${((m.to - m.from) / MAG_MAX) * 100}%`, background: `rgba(231,229,228,${0.12 + i * 0.16})` }} />
                ))}
            </div>
            <div className="relative h-[30px]">
                {MAGNITUDE.map(m => (
                    <span key={m.label} className="absolute top-1 -translate-x-1/2 whitespace-nowrap text-[17px] text-gray-200" style={{ left: `${(((m.from + m.to) / 2) / MAG_MAX) * 100}%` }}>{m.label}</span>
                ))}
            </div>
            <p className="m-0 text-[16px] text-gray-400">tamanho do efeito na régua de Areta (25 · 75 · 150 · 250 mmol/kg)</p>
        </div>
    );
};

const Grams = () => (
    <div className="mx-8 flex flex-col gap-5">
        {BODY_STORES.map((s, i) => (
            <div key={s.name} className="flex items-center gap-5">
                <span className="w-[110px] text-[22px] font-semibold text-gray-100">{s.name}</span>
                <div className="relative h-[34px] flex-1">
                    <div className="absolute top-[15px] h-[4px] rounded" style={{ left: `${(s.range[0] / GRAMS_MAX) * 100}%`, width: `${((s.range[1] - s.range[0]) / GRAMS_MAX) * 100}%`, background: C.co2 }} />
                    <div className="absolute inset-y-0 left-0 overflow-hidden rounded-md" style={{ width: `${(s.grams / GRAMS_MAX) * 100}%` }}>
                        <Grow value={1} color={s.color} delay={stagger(i, 0.1)} />
                    </div>
                </div>
                <span className="w-[200px] font-display text-[30px] font-semibold tabular-nums text-white">~{s.grams} g
                    <span className="ml-2 font-body text-[16px] font-normal text-gray-400">{s.range[0]}–{s.range[1]}</span></span>
            </div>
        ))}
    </div>
);

const ICON = { up: ArrowUp, down: ArrowDown, same: Equal } as const;

const Training = () => (
    <ul className="m-0 mx-8 flex list-none flex-col gap-4 p-0">
        {TRAINING.map((t, i) => {
            const Icon = ICON[t.dir];
            return (
                <motion.li key={t.text} className="flex items-center gap-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger(i, 0.05), duration: DUR.enter, ease: EASE_OUT }}>
                    <Icon size={30} strokeWidth={3} color={t.dir === 'same' ? C.stone : C.glycogenSoft} aria-hidden />
                    <span className="text-[23px] leading-snug text-gray-50">{t.text}</span>
                    <span className="ml-auto whitespace-nowrap font-mono text-[16px] text-gray-400">{t.src}</span>
                </motion.li>
            );
        })}
    </ul>
);

const Reading = ({ step }: { step: number }) => {
    if (step === 3) return <Grams />;
    if (step === 4) return <Training />;
    if (step === 0) {
        return <p className="m-0 mx-8 text-[22px] leading-snug text-gray-200">462 ± 132 entre os estudos: homens, VO₂máx 53 ± 8 mL/kg/min, dieta com carboidrato habitual.</p>;
    }
    return <Magnitude step={step} />;
};

export default function GlycogenRulerSim() {
    const { step } = useSlideSteps(RULER_LEADS.length);
    return (
        <SimBox>
            <Lead beat={step} chips={step === 3
                ? <ViaReviewChip>estimativas médias, via revisão (Hargreaves 2012)</ViaReviewChip>
                : <DesignChip>meta-análise · 181 estudos · vasto lateral</DesignChip>} className="min-h-[72px]">{RULER_LEADS[step]}</Lead>
            {/* gramas e treino são outra régua: a de mmol/kg sai da tela em vez de ficar apagada atrás */}
            {step < 3 && <div className="mt-3"><RulerTrack step={step} /></div>}
            <div className={step < 3 ? 'mt-5 min-h-[130px]' : 'mt-10'}><Reading step={step} /></div>
            <Foot source={RULER_SOURCE} />
        </SimBox>
    );
}
