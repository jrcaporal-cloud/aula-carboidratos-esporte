import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { Grow } from './kit/Beat';
import { CalcChip, DesignChip } from './kit/chips';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { PaFrame, PaSide } from './ato6/paFrame';
import { DESIGN, LESSONS, MECHANISMS, POSITIVE, RECIPE, STEPS, TOTAL } from './ato6/forest.content';

/**
 * Slide 101 · 82% dos Ensaios. À esquerda, a revisão sistemática (Stellingwerff & Cox): uma "chuva" de 61 ensaios
 * que se organiza em 50 × 11 e ganha, embaixo, a régua da duração com os dois mecanismos. À direita, no último passo,
 * a meta-análise (Vandenbogaerde & Hopkins), outro conjunto de estudos: a faixa de −2% a +6% e a bebida que chega ao topo.
 */

const TILE = 28;
const GAP = 6;
const CELL = TILE + GAP;
const FIELD_W = 600;
const FIELD_H = 214;
const NULL_X = 10 * CELL + 46;

/** Posição pseudoaleatória fixa: a "chuva" é a mesma em todo ensaio da aula. */
const scatter = (i: number): { x: number; y: number; r: number } => {
    const a = Math.sin(i * 12.9898) * 43758.5453;
    const b = Math.sin(i * 78.233) * 12345.6789;
    const fa = a - Math.floor(a);
    const fb = b - Math.floor(b);
    return { x: fa * (FIELD_W - TILE), y: 30 + fb * (FIELD_H - TILE - 30), r: (fa - 0.5) * 50 };
};

/** Grade final: 50 positivos em 10 × 5; 11 nulos em 3 colunas à direita. */
const sorted = (i: number): { x: number; y: number; r: number } => {
    if (i < POSITIVE) return { x: (i % 10) * CELL, y: 40 + Math.floor(i / 10) * CELL, r: 0 };
    const k = i - POSITIVE;
    return { x: NULL_X + (k % 3) * CELL, y: 40 + Math.floor(k / 3) * CELL, r: 0 };
};

const Tiles = ({ ordered }: { ordered: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative shrink-0" style={{ width: FIELD_W, height: FIELD_H }}>
            {Array.from({ length: TOTAL }, (_, i) => {
                const p = ordered ? sorted(i) : scatter(i);
                return (
                    <motion.div key={i} className="absolute left-0 top-0 rounded-md" style={{ width: TILE, height: TILE, background: '#475569' }}
                        initial={reduce ? false : { opacity: 0, y: p.y - 50, x: p.x, rotate: p.r }}
                        animate={{ opacity: 1, x: p.x, y: p.y, rotate: p.r }}
                        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : stagger(i, 0, 0.007), ease: EASE_IN_OUT }}>
                        <motion.span className="absolute inset-0 rounded-md" style={{ background: C.glucose }}
                            initial={false} animate={{ opacity: ordered && i < POSITIVE ? 1 : 0 }}
                            transition={{ duration: DUR.enter, delay: ordered ? 0.55 : 0 }} />
                    </motion.div>
                );
            })}
            <motion.div className="absolute left-0 top-0 flex w-full items-baseline" initial={false} animate={{ opacity: ordered ? 1 : 0 }}
                transition={{ duration: DUR.enter, delay: ordered ? 0.75 : 0 }}>
                <span className="text-[20px] font-semibold" style={{ color: C.glucoseSoft }}>50 com benefício · 82%</span>
                <span className="absolute text-[20px] font-semibold text-gray-200" style={{ left: NULL_X }}>11 sem mudança · 18%</span>
            </motion.div>
        </div>
    );
};

/** Régua da duração (passo 3): o ganho cresce com o tempo de prova e o mecanismo muda. */
const Duration = ({ on }: { on: boolean }) => (
    <motion.div className="flex flex-col gap-2" initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
        transition={{ duration: DUR.enter, delay: on ? 0.15 : 0, ease: EASE_OUT }}>
        <div className="flex items-center gap-3">
            <span className="text-[17px] font-semibold text-gray-200">duração da prova</span>
            <div className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-white/15">
                {on && <Grow value={1} color={C.glucose} delay={0.2} />}
            </div>
            <span className="whitespace-nowrap text-[17px] font-semibold" style={{ color: C.glucoseSoft }}>ganho maior · p = 0,0036</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {MECHANISMS.map((m, i) => (
                <motion.div key={m.when} className="flex flex-col rounded-xl border-2 px-4 py-2.5" style={{ borderColor: `${m.color}88` }}
                    initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : 12 }}
                    transition={{ duration: DUR.enter, delay: on ? stagger(i, 0.35, 0.15) : 0, ease: EASE_OUT }}>
                    <span className="text-[22px] font-bold" style={{ color: m.color }}>{m.when} · {m.what}</span>
                    <span className="text-[17px] leading-snug text-gray-200">{m.note}</span>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

const Stage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col justify-between gap-3 px-5 py-4">
        <Tiles ordered={step >= 1} />
        <Duration on={step >= 2} />
    </div>
);

/** Faixa de −2% a +6% (o zero separa prejuízo de ganho). */
const Range = () => {
    const pos = (v: number) => `${((v + 2) / 8) * 100}%`;
    return (
        <div className="flex flex-col gap-1">
            <div className="relative h-[22px] w-full">
                <div className="absolute inset-y-0 left-0 overflow-hidden rounded-l-md" style={{ width: pos(0) }}><Grow value={1} color={C.risk} /></div>
                <div className="absolute inset-y-0 right-0 overflow-hidden rounded-r-md" style={{ left: pos(0) }}><Grow value={1} color={C.ok} delay={0.25} /></div>
                <span className="absolute -top-[5px] h-[32px] w-[4px] -translate-x-1/2 bg-white" style={{ left: pos(0) }} />
            </div>
            <div className="flex items-baseline justify-between">
                <KeyFact color={C.risk} delay={0.5}><span className="font-display text-[34px] font-bold leading-none" style={{ color: C.risk }}>−2%</span></KeyFact>
                <span className="text-[16px] text-gray-200">0 = sem efeito · potência média</span>
                <span className="font-display text-[34px] font-bold leading-none" style={{ color: C.ok }}>+6%</span>
            </div>
        </div>
    );
};

const Recipe = () => (
    <motion.div className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.enter, delay: 0.5, ease: EASE_OUT }}>
        <span className="text-[17px] font-semibold text-white">no topo: bebida de 3–10%, em g/kg/h</span>
        <div className="flex items-baseline gap-x-3">
            {RECIPE.map(r => (
                <span key={r.what} className="whitespace-nowrap text-[16px]"><b style={{ color: r.color }}>{r.amount} g</b> <span className="text-gray-200">{r.what}</span></span>
            ))}
        </div>
        <span className="flex flex-wrap items-center gap-2 text-[16px] text-gray-200">≈ 63 g/h de carboidrato a 70 kg <CalcChip>0,9 × 70</CalcChip></span>
        <span className="text-[16px] leading-snug" style={{ color: '#FDA4AF' }}>menos benefício: frutose &gt; 0,25 g/kg/h; +10 °C no ambiente</span>
    </motion.div>
);

export default function DuringForestSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="forest-tabs"
            chips={step === 3
                ? <div className="flex flex-col items-end gap-1.5"><DesignChip>à esquerda · {DESIGN[0]}</DesignChip><DesignChip>à direita · {DESIGN[1]}</DesignChip></div>
                : <DesignChip>{DESIGN[0]}</DesignChip>}
            stage={<Stage step={step} />}
            panel={
                <PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={step === 3 ? [] : LESSONS}
                    source={sourcesUpTo(STEPS.map(t => t.sources), step)}>
                    {step === 1 && (
                        <div className="flex items-baseline gap-3">
                            <KeyFact color={C.glucose} delay={0.3}><span className="font-display text-[56px] font-bold leading-none" style={{ color: C.glucose }}>82%</span></KeyFact>
                            <span className="text-[17px] text-gray-200">dos ensaios com benefício</span>
                        </div>
                    )}
                    {step === 3 && <><Range /><Recipe /></>}
                </PaSide>
            } />
    );
}
