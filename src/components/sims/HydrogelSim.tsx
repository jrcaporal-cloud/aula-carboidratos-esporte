import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow, Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { C, PANEL_BG } from './kit/palette';
import { SvgText } from './kit/ui';
import { Lead, SimFrame } from './ato6/Frame';
import { DESIGN, FORMATS, LEADS, META, SOURCES } from './ato6/hydrogel.content';

/**
 * Slide 108 · Formato e Hidrogel. Primeiro uma fileira de formatos com a mesma oxidação; depois a tela se divide:
 * à esquerda o mecanismo (gel no estômago, esvaziamento mais rápido em repouso), à direita o efeito medido
 * (a balança da meta-análise parada). Por fim, o positivo isolado.
 */

const Formats = () => (
    <div className="grid grid-cols-4 gap-5">
        {FORMATS.map((f, i) => (
            <motion.div key={f.name} className="flex flex-col gap-3 rounded-2xl p-6" style={PANEL_BG}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="text-[24px] font-semibold text-white">{f.name}</span>
                <CountUp text={f.ox} delay={stagger(i, 0.2)} className="font-display text-[72px] font-bold leading-none" style={{ color: C.glucose }} />
                <span className="text-[18px] text-gray-400">g/min, pico</span>
            </motion.div>
        ))}
    </div>
);

/** Meia-vida de esvaziamento gástrico em repouso: barras horizontais (minutos). */
const Emptying = () => (
    <div className="flex flex-col gap-4">
        {[{ label: 'hidrogel', min: 21, color: C.glucose }, { label: 'bebida comum', min: 37, color: C.co2 }].map((r, i) => (
            <div key={r.label} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                    <span className="text-[20px] text-gray-200">{r.label}</span>
                    <span className="font-display text-[34px] font-bold" style={{ color: r.color }}>{r.min} min</span>
                </div>
                <div className="relative h-[20px] overflow-hidden rounded-md bg-white/8" style={{ width: '100%' }}>
                    <div className="absolute inset-y-0 left-0" style={{ width: `${(r.min / 40) * 100}%` }}>
                        <Grow value={1} color={r.color} delay={stagger(i, 0.2, 0.15)} />
                    </div>
                </div>
            </div>
        ))}
        <span className="text-[18px] text-gray-400">meia-vida de esvaziamento, em repouso</span>
    </div>
);

/** Balança da meta-análise: o travessão fica nivelado (nenhuma diferença). */
/** Balança da meta-análise (Sutehall 2022): o travessão assenta nivelado — nenhuma diferença. */
const Balance = () => (
    <svg viewBox="0 0 440 150" width={440} height={150} role="img" aria-label="Meta-análise: balança nivelada, hidrogel igual à bebida comum">
        <SvgText x={220} y={22} text="meta-análise, 5 estudos" anchor="middle" size={18} color="#E5E7EB" />
        <polygon points="220,58 196,140 244,140" fill="#475569" />
        <motion.g initial={{ rotate: -8 }} animate={{ rotate: 0 }} transition={{ duration: 0.9, ease: EASE_IN_OUT }}>
            {/* círculo invisível centrado no pivô: o giro acontece em torno dele */}
            <circle cx={220} cy={58} r={210} fill="transparent" />
            <line x1={40} x2={400} y1={58} y2={58} stroke="#E5E7EB" strokeWidth={6} strokeLinecap="round" />
            <rect x={10} y={62} width={120} height={18} rx={6} fill={C.glucose} />
            <rect x={310} y={62} width={120} height={18} rx={6} fill={C.co2} />
            <SvgText x={70} y={106} text="hidrogel" anchor="middle" size={18} color={C.glucoseSoft} />
            <SvgText x={370} y={106} text="bebida comum" anchor="middle" size={18} color="#CBD5E1" />
        </motion.g>
    </svg>
);

const MetaRows = () => (
    <div className="flex gap-3">
        {META.map((m, i) => (
            <motion.div key={m.outcome} className="flex flex-1 flex-col rounded-xl px-4 py-3" style={PANEL_BG}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.5, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="text-[18px] text-gray-300">{m.outcome}</span>
                <span className="font-display text-[30px] font-bold text-white">p = {m.p}</span>
            </motion.div>
        ))}
    </div>
);

/** Passo do Rowe: a meta-análise vira uma linha e o ensaio isolado ganha o seu cartão, separado. */
const Rowe = () => (
    <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-4 rounded-xl px-5 py-3" style={PANEL_BG}>
            <span className="text-[20px] text-gray-300">meta-análise, 5 estudos</span>
            <span className="ml-auto font-display text-[30px] font-bold text-white">p = 0,59</span>
        </div>
        <motion.div className="flex flex-col gap-1 rounded-xl px-5 py-4" style={{ background: C.stone }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: DUR.enter, ease: EASE_OUT }}>
            <span className="text-[19px] font-semibold text-[#1F2937]">outro estudo: um ensaio só (Rowe 2022, n = 11)</span>
            <span className="flex items-baseline gap-4">
                <span className="font-display text-[56px] font-bold leading-none text-[#04080F]">+2,1%</span>
                <span className="text-[19px] leading-snug text-[#1F2937]">hidrogel × bebida comum,<br />5 km após 2 h</span>
            </span>
        </motion.div>
    </div>
);

export default function HydrogelSim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<DesignChip>{DESIGN[step]}</DesignChip>}
            source={SOURCES[step]}>
            {step === 0 ? <div className="flex h-full items-center"><div className="w-full"><Formats /></div></div> : (
                <div className="grid h-full grid-cols-[1fr_4px_1fr] gap-8">
                    <div className="flex flex-col gap-4" style={{ opacity: step >= 2 ? 0.7 : 1, transition: 'opacity 300ms' }}>
                        <span className="text-[22px] font-bold uppercase tracking-wide" style={{ color: C.glucoseSoft }}>mecanismo</span>
                        <Emptying />
                    </div>
                    <span className="rounded-full bg-white/25" />
                    {step >= 2 ? (
                        <Wipe from="left" className="flex flex-col gap-4">
                            <span className="text-[22px] font-bold uppercase tracking-wide text-white">efeito medido</span>
                            {step === 2 ? <><Balance /><MetaRows /></> : <Rowe />}
                        </Wipe>
                    ) : <div />}
                </div>
            )}
        </SimFrame>
    );
}
