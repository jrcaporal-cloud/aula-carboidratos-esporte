import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { BigStat } from './kit/Stamp';
import { DesignChip } from './kit/chips';
import { br } from './kit/format';
import { Frame } from './ato10/Frame';
import { DESIGNS, LINES, MARKERS, MASSON, REF_BAND, RULER_MAX, SOURCE } from './ato10/intake.content';

/**
 * Slide 182 · O Que os Atletas Comem. À esquerda, 100 quadrados: 46 acesos = quem atinge a meta (Masson 2016).
 * À direita, uma régua vertical de g/kg/d com a faixa de treino alto; os marcadores do futebol sobem até o valor medido.
 */
const up = (v: number) => `${(v / RULER_MAX) * 100}%`;

const Waffle = () => (
    <div className="grid grid-cols-10 gap-[5px]" role="img" aria-label={`${MASSON.pct} atingiam a meta`}>
        {Array.from({ length: 100 }, (_, i) => {
            const on = i < MASSON.filled;
            return (
                <motion.span key={i} className="block h-[23px] w-[23px] rounded-[5px]"
                    style={{ background: on ? C.glucose : 'rgba(255,255,255,0.12)' }}
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: on ? 0.1 + i * 0.012 : 0.05, duration: DUR.text, ease: EASE_OUT }} />
            );
        })}
    </div>
);

const VerticalRuler = ({ step }: { step: number }) => (
    <div className="relative ml-14 h-full w-[70px]">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-white/40" />
        {/* faixa de referência */}
        <div className="absolute left-[3px] w-[44px] rounded-r-lg" style={{ bottom: up(REF_BAND.lo), height: up(REF_BAND.hi - REF_BAND.lo), background: 'rgba(245,158,11,0.28)' }} />
        <span className="absolute left-[54px] whitespace-nowrap text-[16px] text-gray-300" style={{ bottom: `calc(${up(REF_BAND.hi)} - 22px)` }}>
            {REF_BAND.lo}–{REF_BAND.hi} g/kg/d · {REF_BAND.label}
        </span>
        {[0, 3, 6, 9, 12].map(v => (
            <span key={v} className="absolute -left-9 w-7 text-right font-mono text-[16px] tabular-nums text-gray-300" style={{ bottom: `calc(${up(v)} - 10px)` }}>{v}</span>
        ))}
        {MARKERS.map(m => {
            const on = step >= m.from;
            const fresh = step === m.from;
            return (
                <motion.div key={m.id} className="absolute left-0 flex items-center" style={{ bottom: `calc(${up(m.value)} - 14px)` }}
                    initial={false} animate={{ opacity: on ? (fresh ? 1 : 0.7) : 0, x: on ? 0 : -12 }}
                    transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="h-[4px] w-[64px] rounded" style={{ background: C.text }} />
                    <span className="ml-3 font-display text-[28px] font-bold tabular-nums leading-none text-white">{br(m.value, m.value === 5.44 ? 2 : 1)}</span>
                    <span className="ml-3 whitespace-nowrap text-[18px] text-gray-200">{m.label}</span>
                </motion.div>
            );
        })}
    </div>
);

export default function IntakeRealitySim() {
    const { step } = useSlideSteps(LINES.length);
    return (
        <Frame step={step} line={LINES[step]} chips={<DesignChip>{DESIGNS[step]}</DesignChip>} source={SOURCE}>
            <div className="flex h-full gap-6">
                <motion.div className="flex w-[560px] shrink-0 items-center gap-8 rounded-2xl px-7" style={PANEL_BG}
                    animate={{ opacity: step === 0 ? 1 : 0.7 }} transition={{ duration: DUR.enter }}>
                    <Waffle />
                    <div className="flex flex-col gap-5">
                        <BigStat value={MASSON.pct} caption="atingiam a meta de carboidrato" color={C.glucose} size={72} />
                        <p className="m-0 text-[18px] leading-snug text-gray-200">
                            mas <span className="font-semibold text-white">{MASSON.protein}</span> comiam ≥ 1,2 g/kg/d de proteína
                        </p>
                    </div>
                </motion.div>
                <motion.div className="relative flex-1 rounded-2xl py-6" style={PANEL_BG}
                    animate={{ opacity: step === 0 ? 0.6 : 1 }} transition={{ duration: DUR.enter }}>
                    <span className="absolute left-5 top-3 text-[16px] text-gray-300">g/kg de peso por dia</span>
                    <div className="h-full pt-6"><VerticalRuler step={step} /></div>
                </motion.div>
            </div>
        </Frame>
    );
}
