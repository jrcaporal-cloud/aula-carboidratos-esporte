import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip, DesignChip } from './kit/chips';
import { C, PANEL_BG } from './kit/palette';
import { Lead, SimFrame } from './ato6/Frame';
import { BOTTLENECK, CEILING_LEADS, GLUCOSE } from './ato6/oxidation.content';

/**
 * Slide 103 · O Teto de um Grama. Barras pareadas por dose (o que entra × o que se oxida na hora, em g/h):
 * a barra de entrada cresce, a de oxidação para no teto. A sobra fica marcada; depois, onde está o gargalo.
 * (O slide seguinte usa um gráfico de curva; aqui a forma é outra de propósito.)
 */

const GH_MAX = 190;
const pct = (gh: number) => `${(gh / GH_MAX) * 100}%`;
/** g/min → g/h (cálculo: × 60). */
const perHour = (gmin: number) => Math.round(gmin * 60);

const SOURCES = [
    'Hulston 2009 · Jentjens 2005 · Jentjens 2004 (isótopo 13C)',
    'Jeukendrup & Jentjens, Sports Med 2000 · picos de oxidação × 60 = g/h',
    'Jentjens 2004: 1,18 g/min oxidados de 2,4 g/min ingeridos',
    'Jeukendrup & Jentjens, Sports Med 2000',
] as const;

const Bar = ({ value, color, delay, outline = false }: { value: number; color: string; delay: number; outline?: boolean }) => (
    <div className="relative h-[28px] shrink-0 overflow-hidden rounded-md" style={{ width: pct(value), border: outline ? `2px solid ${color}` : 'none' }}>
        {!outline && <Grow value={1} color={color} delay={delay} />}
    </div>
);

const Rows = ({ step }: { step: number }) => (
    <div className="grid grid-cols-[130px_1fr] gap-x-4">
        <div className="flex flex-col gap-6 pt-9">
            {GLUCOSE.map(p => <span key={p.gh} className="flex h-[62px] items-center text-[17px] leading-tight text-gray-400">{p.label}</span>)}
        </div>
        <Bars step={step} />
    </div>
);

const Bars = ({ step }: { step: number }) => (
    <div className="relative flex flex-col gap-6 pt-9">
        {/* teto: ~1,0–1,1 g/min ≈ 60–66 g/h */}
        <motion.div className="absolute bottom-0 top-0 rounded-md" style={{ left: pct(60), width: `calc(${pct(66)} - ${pct(60)})`, background: `${C.glucose}40` }}
            initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter }} />
        <motion.span className="absolute top-0 whitespace-nowrap text-[18px] font-semibold" style={{ left: pct(60), color: C.glucoseSoft }}
            initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            teto ~1 g/min (≈ 60 g/h)
        </motion.span>
        {GLUCOSE.map((p, i) => {
            const ox = perHour(p.ox);
            return (
                <div key={p.gh} className="relative grid grid-cols-[1fr] gap-1.5">
                    <div className="flex items-center gap-3">
                        <Bar value={p.gh} color={C.stone} delay={0} outline />
                        <span className="whitespace-nowrap text-[19px] text-gray-200">entra {p.gh} g/h</span>
                    </div>
                    <div className="flex items-center gap-3" style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 250ms' }}>
                        {step >= 1 && <Bar value={ox} color={C.glucose} delay={stagger(i, 0.1, 0.12)} />}
                        <span className="whitespace-nowrap text-[19px] font-semibold" style={{ color: C.glucoseSoft }}>oxida ~{ox} g/h</span>
                    </div>
                    {step === 2 && p.gh === 144 && (
                        <motion.div className="absolute top-0 flex h-[28px] items-center justify-center rounded-md"
                            style={{ left: pct(ox), width: `calc(${pct(p.gh)} - ${pct(ox)})`, background: `${C.risk}55` }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: DUR.enter }}>
                            <span className="text-[17px] font-semibold text-white">~{p.gh - ox} g/h no caminho</span>
                        </motion.div>
                    )}
                </div>
            );
        })}
    </div>
);

const Bottleneck = () => (
    <div className="flex flex-col gap-3">
        {BOTTLENECK.map((b, i) => (
            <motion.div key={b.organ} className="flex items-center gap-4 rounded-xl px-5 py-3" style={PANEL_BG}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.2, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: b.limit ? C.glucose : 'rgba(255,255,255,0.12)' }}>
                    {b.limit ? <Check size={24} strokeWidth={3} color="#04080F" aria-hidden /> : <X size={24} strokeWidth={3} color="#E5E7EB" aria-hidden />}
                </span>
                <span className="flex flex-col">
                    <span className="text-[24px] font-semibold text-white">{b.organ}</span>
                    <span className="text-[18px]" style={{ color: b.limit ? C.glucoseSoft : '#9CA3AF' }}>{b.detail}</span>
                </span>
            </motion.div>
        ))}
    </div>
);

export default function CeilingSim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{CEILING_LEADS[step]}</Lead></Beat>}
            chips={step >= 1 && step <= 2 ? <><DesignChip>3 ECRs cruzados · n = 7–8 cada</DesignChip><CalcChip>cálculo: g/min × 60</CalcChip></> : <DesignChip>3 ECRs cruzados · n = 7–8 cada</DesignChip>}
            source={SOURCES[step]}>
            <div className="flex h-full items-center gap-10">
                <div className="w-[700px] shrink-0"><Rows step={step} /></div>
                <Beat beat={step} className="flex min-w-0 flex-1 flex-col gap-4">
                    {step === 1 && (
                        <div className="flex flex-col gap-1">
                            <CountUp text="~1 g/min" className="font-display text-[72px] font-bold leading-none" style={{ color: C.glucose }} />
                            <span className="text-[20px] text-gray-300">com uma fonte só</span>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="flex flex-col gap-1">
                            <CountUp text="49%" className="font-display text-[72px] font-bold leading-none" style={{ color: C.glucose }} />
                            <span className="text-[20px] text-gray-300">do que entra a 144 g/h</span>
                        </div>
                    )}
                    {step === 3 && <Bottleneck />}
                </Beat>
            </div>
        </SimFrame>
    );
}
