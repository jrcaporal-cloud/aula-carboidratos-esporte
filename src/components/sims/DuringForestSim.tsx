import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { C, PANEL_BG } from './kit/palette';
import { Lead, SimFrame } from './ato6/Frame';
import { LEADS, MECHANISMS, POSITIVE, SOURCES, TOTAL } from './ato6/forest.content';

/**
 * Slide 101 · 82% dos Ensaios. Uma "chuva" de 61 ensaios espalhados que se organiza em 50 × 11.
 * Depois: o ganho cresce com a duração, e a meta-análise mostra que a formulação vai de −2% a +6%.
 */

const TILE = 34;
const GAP = 8;
const CELL = TILE + GAP;
const FIELD_W = 600;
const FIELD_H = 330;

/** Posição pseudoaleatória fixa (mesma a cada carga): a "chuva" não muda entre ensaios da aula. */
const scatter = (i: number): { x: number; y: number; r: number } => {
    const a = Math.sin(i * 12.9898) * 43758.5453;
    const b = Math.sin(i * 78.233) * 12345.6789;
    const fa = a - Math.floor(a);
    const fb = b - Math.floor(b);
    return { x: fa * (FIELD_W - TILE), y: fb * (FIELD_H - TILE), r: (fa - 0.5) * 50 };
};

/** Grade final: 50 positivos em 10 × 5; 11 nulos em 3 colunas à direita. */
const sorted = (i: number): { x: number; y: number; r: number } => {
    if (i < POSITIVE) return { x: (i % 10) * CELL, y: 60 + Math.floor(i / 10) * CELL, r: 0 };
    const k = i - POSITIVE;
    return { x: 10 * CELL + 40 + (k % 3) * CELL, y: 60 + Math.floor(k / 3) * CELL, r: 0 };
};

const Tiles = ({ ordered }: { ordered: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="absolute inset-0">
            {Array.from({ length: TOTAL }, (_, i) => {
                const p = ordered ? sorted(i) : scatter(i);
                const positive = i < POSITIVE;
                return (
                    <motion.div key={i} className="absolute left-0 top-0 rounded-md" style={{ width: TILE, height: TILE, background: '#475569' }}
                        initial={reduce ? false : { opacity: 0, y: p.y - 60, x: p.x, rotate: p.r }}
                        animate={{ opacity: 1, x: p.x, y: p.y, rotate: p.r }}
                        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : stagger(i, 0, 0.007), ease: EASE_IN_OUT }}>
                        <motion.span className="absolute inset-0 rounded-md" style={{ background: C.glucose }}
                            initial={false} animate={{ opacity: ordered && positive ? 1 : 0 }}
                            transition={{ duration: DUR.enter, delay: ordered ? 0.55 : 0 }} />
                    </motion.div>
                );
            })}
            {ordered && (
                <>
                    <motion.span className="absolute left-0 top-0 text-[22px] font-semibold" style={{ color: C.glucoseSoft }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: DUR.enter }}>
                        50 com benefício
                    </motion.span>
                    <motion.span className="absolute top-0 text-[22px] font-semibold text-gray-300" style={{ left: 10 * CELL + 40 }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: DUR.enter }}>
                        11 nulos
                    </motion.span>
                </>
            )}
        </div>
    );
};

const Mechanisms = () => (
    <div className="flex flex-col gap-3">
        {MECHANISMS.map((m, i) => (
            <motion.div key={m.when} className="flex items-baseline gap-4 rounded-xl px-5 py-3" style={PANEL_BG}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.2, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="w-[86px] shrink-0 text-[24px] font-bold tabular-nums" style={{ color: C.glucose }}>{m.when}</span>
                <span className="flex flex-col">
                    <span className="text-[24px] font-semibold text-white">{m.what}</span>
                    <span className="text-[18px] text-gray-400">{m.note}</span>
                </span>
            </motion.div>
        ))}
    </div>
);

/** Faixa de −2% a +6%: o zero separa prejuízo (vermelho) de ganho (verde). */
const Range = () => {
    const pos = (v: number) => (v + 2) / 8;
    return (
        <div className="flex flex-col gap-3">
            <div className="relative h-[28px] w-full">
                <div className="absolute inset-y-0 left-0 overflow-hidden rounded-l-md" style={{ width: `${pos(0) * 100}%` }}>
                    <Grow value={1} color={C.risk} />
                </div>
                <div className="absolute inset-y-0 right-0 overflow-hidden rounded-r-md" style={{ left: `${pos(0) * 100}%` }}>
                    <Grow value={1} color={C.ok} delay={0.25} />
                </div>
                <span className="absolute -top-[6px] h-[40px] w-[4px] -translate-x-1/2 bg-white" style={{ left: `${pos(0) * 100}%` }} />
                <span className="absolute top-[38px] -translate-x-1/2 text-[18px] text-gray-200" style={{ left: `${pos(0) * 100}%` }}>0</span>
            </div>
            <div className="flex justify-between font-display text-[44px] font-bold leading-none">
                <span style={{ color: C.risk }}>−2%</span>
                <span style={{ color: C.ok }}>+6%</span>
            </div>
            <span className="text-[18px] text-gray-300">potência média no contrarrelógio, conforme a bebida</span>
        </div>
    );
};

const DESIGN = ['revisão sistemática · 61 ECRs · n = 679', 'meta-análise · 88 estudos · 155 estimativas'] as const;

export default function DuringForestSim() {
    const { step } = useSlideSteps(4);
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={<DesignChip>{DESIGN[step === 3 ? 1 : 0]}</DesignChip>}
            source={SOURCES[step]}>
            <div className="flex h-full items-center gap-10">
                {/* no último passo os ensaios ficam como contexto, ainda legíveis */}
                <div className="relative shrink-0" style={{ width: FIELD_W, height: FIELD_H, opacity: step === 3 ? 0.7 : 1, transition: 'opacity 300ms' }}>
                    <Tiles ordered={step >= 1} />
                </div>
                <Beat beat={step} className="flex min-w-0 flex-1 flex-col justify-center gap-6">
                    {step === 0 && <span className="text-[22px] leading-snug text-gray-300">cada quadrado: um ensaio randomizado</span>}
                    {step === 1 && (
                        <div className="flex flex-col gap-1">
                            <CountUp text="82%" className="font-display text-[96px] font-bold leading-none" style={{ color: C.glucose }} />
                            <span className="text-[20px] text-gray-300">dos ensaios com benefício</span>
                        </div>
                    )}
                    {step === 2 && <Mechanisms />}
                    {step === 3 && <Range />}
                </Beat>
            </div>
        </SimFrame>
    );
}
