import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { br } from './kit/format';
import { sourcesUpTo } from './kit/sources';
import { MedirLedger, MedirShell } from './ato10/MedirShell';
import { BELOW, LEDGER, MARKERS, REF_BAND, RULER_MAX, STEPS, WAFFLES } from './ato10/intake.content';

/**
 * Slide 182 · O Que os Atletas Comem (palco + painel). No palco, dois "pratos" de 100 quadrados dos mesmos 116 amadores
 * (carboidrato × proteína na meta); à direita, a régua vertical de g/kg/d com a faixa de treino alto, onde sobem os
 * futebolistas; embaixo, no fim, quem costuma ficar abaixo. Tudo fica até o quadro final.
 */
const STAGE_W = 660;
const SQ = 15;
const GAP = 3;
const RULER_H = 290;
const up = (v: number) => RULER_H - (v / RULER_MAX) * RULER_H;
const ACCENT = [C.glucoseSoft, C.glucose, C.glucose, C.caveat] as const;

const Waffle = ({ lit, color }: { lit: number; color: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="grid grid-cols-10" style={{ gap: GAP }} role="img" aria-label={`${lit} de 100`}>
            {Array.from({ length: 100 }, (_, i) => {
                // enche de baixo para cima, como um prato que se serve
                const on = 99 - i < lit;
                return (
                    <motion.span key={i} className="block rounded-[4px]" style={{ width: SQ, height: SQ, background: on ? color : 'rgba(255,255,255,0.13)' }}
                        initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: on ? 0.15 + (99 - i) * 0.008 : 0.05, duration: DUR.text, ease: EASE_OUT }} />
                );
            })}
        </div>
    );
};

const Plates = () => (
    <div className="flex gap-5">
        {WAFFLES.map((w, i) => (
            <motion.div key={w.id} className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.5, duration: DUR.enter, ease: EASE_OUT }}>
                <CountUp text={w.value} delay={0.3 + i * 0.5} className="font-display text-[44px] font-bold leading-none tabular-nums" style={{ color: w.text }} />
                <span className="text-[16px] leading-tight text-gray-200">{w.caption}</span>
                <Waffle lit={w.lit} color={w.color} />
            </motion.div>
        ))}
    </div>
);

const Ruler = ({ step }: { step: number }) => (
    <div className="relative ml-9" style={{ height: RULER_H }}>
        <div className="absolute inset-y-0 left-0 w-[3px] bg-white/45" />
        <div className="absolute left-[3px] w-[40px] rounded-r-md" style={{ top: up(REF_BAND.hi), height: up(REF_BAND.lo) - up(REF_BAND.hi), background: 'rgba(245,158,11,0.30)' }} />
        <span className="absolute left-[50px] whitespace-nowrap text-[16px]" style={{ top: up(REF_BAND.hi) + 4, color: C.glucoseSoft }}>{REF_BAND.label}</span>
        {[0, 3, 6, 9, 12].map(v => (
            <span key={v} className="absolute -left-9 w-7 text-right font-mono text-[16px] tabular-nums text-gray-300" style={{ top: up(v) - 11 }}>{v}</span>
        ))}
        {MARKERS.map(m => {
            const on = step >= m.from;
            return (
                <motion.div key={m.id} className="absolute left-0 flex items-center" style={{ top: up(m.value) - 13 }}
                    initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : -14 }} transition={{ duration: DUR.enter, delay: on ? 0.2 : 0, ease: EASE_OUT }}>
                    <span className="h-[4px] w-[30px] rounded" style={{ background: C.text }} />
                    <span className="ml-2 text-[22px] font-bold tabular-nums leading-none text-white">{br(m.value, m.value === 5.44 ? 2 : 1)}</span>
                    <span className="ml-2 whitespace-nowrap text-[16px] text-gray-200">{m.label}</span>
                </motion.div>
            );
        })}
        {step >= 2 && (
            <motion.span className="absolute left-[50px] whitespace-nowrap rounded-md border-2 px-1.5 text-[16px] font-semibold"
                style={{ top: up(4.2) + 18, borderColor: C.risk, color: C.risk }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: DUR.enter }}>
                véspera: abaixo
            </motion.span>
        )}
    </div>
);

const Below = () => (
    <div className="flex flex-col gap-1">
        {BELOW.map((b, i) => (
            <motion.div key={b.who} className="flex items-baseline gap-2 text-[16px] leading-tight"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stagger(i, 0.3, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="shrink-0 font-semibold text-white">{b.who}:</span>
                <span className="text-gray-200">{b.how}</span>
                <span className="ml-auto shrink-0" style={{ color: C.caveat }}>{b.src}</span>
            </motion.div>
        ))}
    </div>
);

export default function IntakeRealitySim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const stage = (
        <div className="flex h-full flex-col gap-2 px-4 py-3">
            <div className="flex min-h-0 flex-1 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[17px] font-semibold text-gray-100">Os mesmos 116 amadores</span>
                    <Plates />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[16px] text-gray-300">g/kg/d</span>
                    <motion.div initial={false} animate={{ opacity: step >= 1 ? 1 : 0.6 }} transition={{ duration: DUR.enter }}>
                        <Ruler step={step} />
                    </motion.div>
                </div>
            </div>
            <Wipe show={step >= 3} from="left" className="border-t-2 border-white/15 pt-2">
                {step >= 3 && <Below />}
            </Wipe>
        </div>
    );
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-intake-tabs"
            chips={<DesignChip>{s.design}</DesignChip>}
            stageWidth={STAGE_W} stage={stage} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<MedirLedger rows={LEDGER} step={step} termWidth={96} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
