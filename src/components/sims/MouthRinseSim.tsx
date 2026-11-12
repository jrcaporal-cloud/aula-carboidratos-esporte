import { motion } from 'framer-motion';
import { Brain, Droplets, Syringe } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { C, PANEL_BG } from './kit/palette';
import { Chip } from './kit/ui';
import { Lead, SimFrame } from './ato6/Frame';
import {
    AXIS, BRAINS, IV_ROWS, RINSE_DESIGN, RINSE_LEADS, RINSE_ROWS, RINSE_SOURCES, type TimeRow,
} from './ato6/rinse.content';

/**
 * Slide 110 · O Bochecho. Dois cronômetros: a glicose na veia não muda a prova de 1 h; o bochecho cuspido muda.
 * Depois, três cérebros esquemáticos: glicose e maltodextrina acendem a recompensa; a sacarina não.
 */

const frac = (min: number) => (min - AXIS[0]) / (AXIS[1] - AXIS[0]);

const Stopwatch = ({ title, Icon, rows, dim }: { title: string; Icon: typeof Syringe; rows: readonly TimeRow[]; dim: boolean }) => (
    <div className="flex flex-col gap-3 rounded-2xl px-6 py-5" style={{ ...PANEL_BG, opacity: dim ? 0.65 : 1, transition: 'opacity 300ms' }}>
        <span className="flex items-center gap-3 text-[22px] font-semibold text-white">
            <Icon size={26} color={C.glucose} aria-hidden />{title}
        </span>
        {rows.map((r, i) => (
            <div key={r.label} className="grid grid-cols-[210px_1fr_120px] items-center gap-4">
                <span className="text-[20px] text-gray-200">{r.label}</span>
                <div className="relative h-[26px] overflow-hidden rounded-md bg-white/8">
                    <div className="absolute inset-y-0 left-0" style={{ width: `${frac(r.min) * 100}%` }}>
                        <Grow value={1} color={r.strong ? C.glucose : C.co2} delay={stagger(i, 0.15, 0.15)} />
                    </div>
                </div>
                <span className="text-right font-mono text-[20px] tabular-nums" style={{ color: r.strong ? C.glucoseSoft : '#D1D5DB' }}>{r.text}</span>
            </div>
        ))}
    </div>
);

/** Cérebro esquemático: contorno chapado; a "recompensa" acende (ou não) por opacidade. */
const BrainCard = ({ name, taste, active, i }: { name: string; taste: string; active: boolean; i: number }) => (
    <motion.div className="flex flex-1 flex-col items-center gap-3 rounded-2xl px-4 py-5" style={PANEL_BG}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: stagger(i, 0.1, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
        <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.span className="absolute inset-0 rounded-full" style={{ background: C.glucose }}
                initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }}
                transition={{ delay: stagger(i, 0.5, 0.15), duration: DUR.morph, ease: EASE_OUT }} />
            <Brain size={96} strokeWidth={1.8} color={active ? '#04080F' : '#6B7280'} className="relative" aria-hidden />
        </div>
        <span className="text-[26px] font-bold text-white">{name}</span>
        <span className="text-[18px] text-gray-400">{taste}</span>
        <span className="text-[19px] font-semibold" style={{ color: active ? C.glucoseSoft : '#9CA3AF' }}>
            {active ? 'recompensa acende' : 'recompensa não acende'}
        </span>
    </motion.div>
);

export default function MouthRinseSim() {
    const { step } = useSlideSteps(3);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{RINSE_LEADS[step]}</Lead></Beat>}
            chips={<><DesignChip>{RINSE_DESIGN[step]}</DesignChip>{step === 2 && <Chip color={C.caveat}>esquema</Chip>}</>}
            source={RINSE_SOURCES[step]}>
            <div className="flex h-full flex-col justify-center gap-6">
                {step < 2 ? (
                    <div className="flex flex-col gap-4">
                        <Stopwatch title="Infusão venosa, 1 g/min" Icon={Syringe} rows={IV_ROWS} dim={step === 1} />
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                                <Stopwatch title="Bochecho de 5 s, a cada 12,5% da prova" Icon={Droplets} rows={RINSE_ROWS} dim={false} />
                            </motion.div>
                        )}
                        <span className="text-[17px] text-gray-400">eixo dos cronômetros de 58 a 62 min</span>
                    </div>
                ) : (
                    <div className="flex gap-5">
                        {BRAINS.map((b, i) => <BrainCard key={b.name} {...b} i={i} />)}
                    </div>
                )}
            </div>
        </SimFrame>
    );
}
