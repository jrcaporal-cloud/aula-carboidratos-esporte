import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { ForestPlot } from '../kit/ForestPlot';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { LANE_AXIS, LANE_GROUPS, META_ROWS, TROM_AXIS, TROM_ROWS } from './rinsemeta.content';

/**
 * Slide 111 · o palco. Em cima, a floresta da meta-análise (potência e, depois, tempo) e a revisão anterior;
 * embaixo, dois ensaios que entram e ficam: Lane 2013 (barras de watts, jejum × alimentado) e
 * Trommelen 2015 (cronômetros, o nulo bem feito). Placebo sempre cinza, carboidrato sempre âmbar.
 */

const FOREST_W = 640;
const FOREST_H = 150;
const FOREST_H_BIG = 220;
const PLACEBO = '#64748B';

/** Título do cartão com a legenda embutida: "placebo" em cinza, o carboidrato em âmbar. */
const Title = ({ study, unit, cho }: { study: string; unit: string; cho: string }) => (
    <span className="whitespace-nowrap text-[16px] font-semibold text-white">
        {study} · {unit}: <span style={{ color: '#94A3B8' }}>placebo</span> × <span style={{ color: C.glucose }}>{cho}</span>
    </span>
);

const Card = ({ study, unit, cho, foot, children }: { study: string; unit: string; cho: string; foot: string; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}
            initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <Title study={study} unit={unit} cho={cho} />
            <div className="relative min-h-0 flex-1">{children}</div>
            <span className="text-[16px] text-gray-300">{foot}</span>
        </motion.div>
    );
};

const laneW = (w: number) => `${((w - LANE_AXIS[0]) / (LANE_AXIS[1] - LANE_AXIS[0])) * 100}%`;

/** Barra horizontal de watts (cresce da esquerda; o eixo começa em 260 W) com o valor na ponta. */
const Bar = ({ w, color, delay, best }: { w: number; color: string; delay: number; best?: boolean }) => (
    <div className="relative h-[20px]">
        <div className="absolute inset-y-0 left-0 overflow-hidden rounded-r-md" style={{ width: laneW(w) }}>
            <Grow value={1} color={color} delay={delay} />
        </div>
        <span className={`absolute top-1/2 ml-2 -translate-y-1/2 font-mono text-[16px] ${best ? 'font-bold text-white' : 'text-gray-200'}`}
            style={{ left: laneW(w) }}>{w}</span>
    </div>
);

/** Lane 2013: um par de barras (W) por estado alimentar, com o ganho do bochecho ao lado do rótulo. */
const LaneChart = ({ fresh }: { fresh: boolean }) => (
    <div className="flex h-full flex-col justify-center gap-2.5">
        {LANE_GROUPS.map((g, i) => (
            <div key={g.id} className="grid grid-cols-[86px_1fr] items-center gap-2">
                <span className="flex flex-col leading-tight">
                    <span className="text-[16px] text-gray-100">{g.label}</span>
                    <span className="font-display text-[20px] font-bold" style={{ color: i === 0 ? C.glucose : C.glucoseSoft }}>{g.gain}</span>
                </span>
                <div className="flex flex-col gap-1 border-l-2 border-white/30 pr-10">
                    <Bar w={g.placebo} color={PLACEBO} delay={fresh ? stagger(i, 0.3, 0.2) : 0} />
                    <Bar w={g.rinse} color={C.glucose} delay={fresh ? stagger(i, 0.4, 0.2) : 0} best={g.id === 'alim'} />
                </div>
            </div>
        ))}
    </div>
);

const tPos = (min: number) => `${((min - TROM_AXIS[0]) / (TROM_AXIS[1] - TROM_AXIS[0])) * 100}%`;

const Dot = ({ min, color, up }: { min: number; color: string; up: boolean }) => (
    <>
        <span className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: tPos(min), background: color, border: '3px solid #04080F' }} />
        <span className={`absolute -translate-x-1/2 font-mono text-[16px] font-semibold text-gray-50 ${up ? '-top-[3px]' : 'bottom-[-3px]'}`}
            style={{ left: tPos(min) }}>{br(min, 1)}</span>
    </>
);

/** Trommelen 2015: dois cronômetros por estado alimentar (min); a sacarose não fica à esquerda do placebo. */
const TromChart = () => (
    <div className="flex h-full flex-col justify-center gap-1">
        {TROM_ROWS.map(r => (
            <div key={r.id} className="grid grid-cols-[86px_1fr] items-center gap-2">
                <span className="text-[16px] text-gray-100">{r.label}</span>
                <div className="relative h-[54px]">
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/25" />
                    <Dot min={r.placebo} color={PLACEBO} up={false} />
                    <Dot min={r.sucrose} color={C.glucose} up />
                </div>
            </div>
        ))}
        <div className="grid grid-cols-[86px_1fr] gap-2 text-[16px] text-gray-400">
            <span />
            <span className="flex justify-between font-mono"><span>67 min</span><span>70 min</span></span>
        </div>
    </div>
);

/** Revisão de 2013, em grande nos dois primeiros passos: 11 estudos, 9 positivos (quadrados âmbar). */
const DeAtaideBlock = () => (
    <div className="flex shrink-0 flex-col gap-2 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <span className="text-[17px] font-semibold text-white">Revisão sistemática anterior (2013): 11 estudos de bochecho</span>
        <div className="flex items-center gap-5">
            <div className="flex gap-1.5" role="img" aria-label="9 de 11 estudos positivos">
                {Array.from({ length: 11 }, (_, i) => (
                    <motion.span key={i} className="h-7 w-7 rounded-md" style={{ background: i < 9 ? C.glucose : PLACEBO }}
                        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: DUR.enter, delay: stagger(i, 0.4, 0.04), ease: EASE_OUT }} />
                ))}
            </div>
            <span className="font-display text-[26px] font-bold leading-none" style={{ color: C.glucose }}>9 de 11</span>
        </div>
        <span className="text-[16px] leading-snug text-gray-100">
            +5,05 W (IC95% 0,90 a 9,2) nos 7 estudos com potência, mas com <strong style={{ color: C.glucoseSoft }}>I² = 52%</strong>: positivo e heterogêneo
        </span>
    </div>
);

/** A mesma revisão, compacta, quando os dois ensaios entram. */
const DeAtaideStrip = () => (
    <p className="m-0 shrink-0 rounded-lg px-3 py-1.5 text-[16px] leading-snug text-gray-100" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <strong className="text-white">Revisão de 2013:</strong> 9 de 11 positivos · +5,05 W (IC95% 0,90 a 9,2) ·{' '}
        <strong style={{ color: C.glucoseSoft }}>I² = 52%</strong>
    </p>
);

export const RinseMetaStage = ({ step }: { step: number }) => {
    // a floresta é grande enquanto está sozinha e cede espaço quando os dois ensaios entram
    const forestH = step < 2 ? FOREST_H_BIG : FOREST_H;
    return (
        <div className="flex h-full flex-col gap-2 px-3 pb-3 pt-2">
            <div className="shrink-0" style={{ height: forestH }}>
                <ForestPlot rows={step === 0 ? META_ROWS.slice(0, 1) : META_ROWS} width={FOREST_W} height={forestH}
                    domain={[-0.5, 0.7]} ticks={[-0.4, -0.2, 0, 0.2, 0.4, 0.6]}
                    axisLabel="SMD, bochecho × placebo (IC95%)" decimals={2} labelWidth={196} valueWidth={176} />
            </div>
            {step < 2 ? <DeAtaideBlock /> : <DeAtaideStrip />}
            <div className="flex min-h-0 flex-1 gap-3">
                {step >= 2 && (
                    <Card study="Lane 2013" unit="W" cho="bochecho" foot="potência média · eixo desde 260 W">
                        <LaneChart fresh={step === 2} />
                    </Card>
                )}
                {step >= 3 && (
                    <Card study="Trommelen" unit="min" cho="sacarose" foot="2015 · menor = mais rápido · p = 0,277">
                        <TromChart />
                    </Card>
                )}
            </div>
        </div>
    );
};
