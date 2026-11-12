import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { Lead, SimFrame } from './ato6/Frame';
import { DESIGN, EVENTS, GH_MAX, LEADS, SOURCES, type EventRow } from './ato6/gireality.content';

/**
 * Slide 113 · A Vida Real do Intestino. Gráfico de pontos por prova (média ± DP de g/h) contra a linha dos 90 g/h;
 * a maratona em foco; a coluna de sintomas graves; e, no fim, a linha do ultra-trail entra no mesmo gráfico.
 */

const pos = (gh: number) => `${(Math.max(0, Math.min(gh, GH_MAX)) / GH_MAX) * 100}%`;
const GI_MAX = 100;
const GRID = 'grid grid-cols-[230px_1fr_170px] items-center gap-5';

const GiBar = ({ from = 0, to, label, delay }: { from?: number; to: number; label: string; delay: number }) => (
    <div className="relative h-[30px]">
        <div className="absolute inset-y-0 overflow-hidden rounded-md" style={{ left: `${(from / GI_MAX) * 100}%`, width: `${((to - from) / GI_MAX) * 100}%` }}>
            <Grow value={1} color={C.risk} delay={delay} />
        </div>
        <span className={`absolute inset-y-0 ${from > 0 ? 'left-0' : 'right-0'} flex items-center font-mono text-[18px] font-semibold text-[#FDA4AF]`}>{label}</span>
    </div>
);

const Row = ({ e, i, step }: { e: EventRow; i: number; step: number }) => {
    const focus = step === 1 ? e.id === 'mar' : true;
    const approx = e.id === 'imh' || e.id === 'ima';
    return (
        <motion.div className={GRID}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: focus ? 1 : 0.6, x: 0 }}
            transition={{ delay: step === 0 ? stagger(i, 0.1) : 0, duration: DUR.enter, ease: EASE_OUT }}>
            <span className="text-[21px] font-semibold text-gray-100">{e.name}</span>
            <div className="relative h-[38px]">
                <span className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-white/50"
                    style={{ left: pos(e.mean - e.sd), right: `calc(100% - ${pos(e.mean + e.sd)})` }} />
                <span className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: pos(e.mean), background: C.glucose }} />
                <span className="absolute top-1/2 ml-[18px] -translate-y-1/2 rounded px-1 font-mono text-[18px] font-semibold text-white"
                    style={{ left: pos(e.mean), background: '#04080F' }}>{e.mean}</span>
            </div>
            <div style={{ opacity: step >= 2 ? 1 : 0, transition: 'opacity 300ms' }}>
                {step >= 2 && <GiBar to={e.severe ?? 0} label={`${approx ? '~' : ''}${e.severe}%`} delay={stagger(i, 0.15, 0.08)} />}
            </div>
        </motion.div>
    );
};

/** Linha do ultra-trail (revisão de 8 estudos): sem média em g/h, só "a maioria abaixo de 90"; sintomas de qualquer grau. */
const UltraRow = () => (
    <motion.div className={`${GRID} border-t-2 border-white/20 pt-3`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: DUR.enter, ease: EASE_OUT }}>
        <span className="flex flex-col leading-tight">
            <span className="text-[21px] font-semibold text-white">ultra-trail</span>
            <span className="text-[16px] text-gray-400">GI de qualquer grau</span>
        </span>
        <div className="relative h-[38px]">
            <div className="absolute inset-y-[8px] left-0 flex items-center rounded-md px-3" style={{ width: pos(90), background: 'rgba(245,158,11,0.28)' }}>
                <span className="text-[18px] font-semibold text-white">a maioria abaixo de 90 g/h</span>
            </div>
        </div>
        <GiBar from={65} to={82} label="65–82%" delay={0.3} />
    </motion.div>
);

export default function GIRealitySim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<DesignChip>{DESIGN[step]}</DesignChip>}
            source={SOURCES[step]}>
            <div className="relative flex flex-col gap-2">
                <div className={`${GRID} text-[17px] text-gray-400`}>
                    <span />
                    <span className="relative h-[22px]">
                        <span className="absolute left-0">0</span>
                        <span className="absolute -translate-x-1/2 font-semibold text-white" style={{ left: pos(90) }}>90 g/h</span>
                        <span className="absolute right-0">{GH_MAX} g/h</span>
                    </span>
                    <span style={{ opacity: step >= 2 ? 1 : 0, color: '#FDA4AF' }}>GI graves</span>
                </div>
                <div className={`pointer-events-none absolute bottom-0 top-[30px] w-full ${GRID}`}>
                    <span />
                    <span className="relative h-full">
                        <span className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white/70" style={{ left: pos(90) }} />
                    </span>
                </div>
                {EVENTS.map((e, i) => <Row key={e.id} e={e} i={i} step={step} />)}
                {step === 3 && <UltraRow />}
            </div>
        </SimFrame>
    );
}
