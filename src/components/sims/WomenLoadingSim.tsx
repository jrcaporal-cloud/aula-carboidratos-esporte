import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { KeyFact, Reveal } from './kit/rhythm';
import { sourcesUpTo } from './kit/sources';
import { Bars1995, Dumbbells, EnergyBlocks, LoadGrid } from './ato5/WomenCharts';
import { Ledger, LoadingFrame, LoadingPanel } from './ato5/LoadingFrame';
import { CELLS, LEDGER, STEPS, TAKEAWAY, TEXT, type Cell } from './ato5/womenLoading.content';

/**
 * Slide 83 · O Mito da Mulher que Não Carrega, palco + painel. O palco é uma grade 2 × 2 que se acende em ordem,
 * como a história do mito sendo corrigido: 1995 (+41% × 0%) → 75% de quê? (ilustrativo) → James 2001 com g/kg de
 * massa magra → Tarnopolsky 2001 com energia extra. Os quatro quadros ficam: o fim é a história inteira.
 */
const CHARTS: readonly ComponentType[] = [Bars1995, EnergyBlocks, Dumbbells, LoadGrid];
const ACCENT = [C.risk, C.glucose, C.glycogenSoft, C.ok] as const;

const Frame = ({ cell, i, step }: { cell: Cell; i: number; step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const shown = step >= cell.at;
    const current = step === cell.at;
    const Chart = CHARTS[i];
    return (
        <motion.div className="flex min-h-0 flex-col gap-1 rounded-xl border-2 px-3 py-2"
            style={{ borderColor: current ? ACCENT[i] : 'rgba(255,255,255,0.16)', background: '#0B1220' }}
            initial={false} animate={{ opacity: shown ? 1 : 0, scale: shown || reduce ? 1 : 0.97 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <div className="flex items-baseline gap-2">
                <span className="font-display text-[22px] font-bold leading-none" style={{ color: ACCENT[i] }}>{cell.year}</span>
                <span className="text-[16px] font-semibold leading-tight text-white">{cell.title}</span>
            </div>
            {cell.note && <span className="text-[15px] leading-none text-gray-300">{cell.note}</span>}
            <div className="min-h-0 flex-1">{shown && <Chart />}</div>
        </motion.div>
    );
};

export default function WomenLoadingSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const last = step === STEPS.length - 1;
    const ledger = LEDGER.map(l => ({ ...l, color: l.value === 'só eles' || l.value === 'menos g/kg' ? C.risk : C.ok }));
    return (
        <LoadingFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="women-loading-tabs" stageWidth={680}
            chips={<>
                <DesignChip>{s.design}</DesignChip>
                {step >= 1 && <IllustrativeChip>barras de energia: ilustrativas</IllustrativeChip>}
            </>}
            stage={
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-3 p-3">
                    {CELLS.map((c, i) => <Frame key={c.title} cell={c} i={i} step={step} />)}
                </div>
            }
            panel={
                <LoadingPanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(t => t.source), step)}
                    ledger={<Ledger title={TEXT.ledger} items={ledger} step={step} />}>
                    {last && (
                        <Reveal order={1} delay={0.5}>
                            <KeyFact color={C.glucose} delay={0.7}>
                                <span className="block rounded-xl border-2 px-3 py-1 text-[19px] font-semibold leading-snug"
                                    style={{ borderColor: C.glucose, color: C.glucoseSoft }}>{TAKEAWAY}</span>
                            </KeyFact>
                        </Reveal>
                    )}
                </LoadingPanel>
            } />
    );
}
