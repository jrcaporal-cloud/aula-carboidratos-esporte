import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { FIBER_SOURCE, FIBER_VB, FIBERS, meanLeft, STAGES } from './ato4/fiber.content';

/**
 * Slide 64 · Gollnick 1974 como corte histológico chapado: cada fibra é roxa (PAS) enquanto tem glicogênio.
 * O passador (ou os botões) sobe a intensidade; as fibras lentas se apagam primeiro, as rápidas só no intenso.
 */

const MOSAIC_W = 500;
const MOSAIC_H = (MOSAIC_W * FIBER_VB.h) / FIBER_VB.w;
/** Cor do PAS em três tons (cheia, parcial, vazia): no codec da chamada, meio-tom contínuo vira lama. */
const stain = (left: number) => (left >= 0.66 ? 1 : left >= 0.33 ? 0.45 : 0);

const Mosaic = ({ stage }: { stage: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${FIBER_VB.w} ${FIBER_VB.h}`} className="block shrink-0" style={{ width: MOSAIC_W, height: MOSAIC_H }} role="img"
            aria-label="Corte de músculo com fibras coradas pelo PAS, esvaziando conforme a intensidade">
            <ellipse cx={FIBER_VB.w / 2} cy={FIBER_VB.h / 2} rx={FIBER_VB.w / 2 - 4} ry={FIBER_VB.h / 2 - 4} fill="#D9D3E2" />
            {FIBERS.map((f, i) => (
                <g key={i}>
                    <circle cx={f.x} cy={f.y} r={f.r} fill={f.type === 'I' ? '#1B1F2A' : '#3A4150'} />
                    <motion.circle cx={f.x} cy={f.y} r={f.r} fill={C.glycogen} initial={false} animate={{ opacity: stain(f.left[stage]) }}
                        transition={{ duration: reduce ? 0 : DUR.draw, delay: reduce ? 0 : (i % 7) * 0.04, ease: EASE_OUT }} />
                    {f.type === 'I' && <circle cx={f.x} cy={f.y} r={f.r - 2} fill="none" stroke={C.stone} strokeWidth={4} />}
                </g>
            ))}
        </svg>
    );
};

const Intensity = ({ stage, onPick }: { stage: number; onPick: (s: number) => void }) => (
    <div className="flex items-center gap-2" role="group" aria-label="Intensidade, % do VO₂máx">
        {STAGES.slice(1).map((s, i) => {
            const on = stage === i + 1;
            return (
                <button key={s.label} type="button" onClick={() => onPick(i + 1)} aria-pressed={on}
                    className="cursor-pointer rounded-xl border-2 px-4 py-1.5 font-display text-[24px] font-semibold transition-colors duration-200"
                    style={{ borderColor: on ? C.glycogenSoft : 'rgba(255,255,255,0.2)', color: on ? '#fff' : C.muted, background: on ? 'rgba(139,92,246,0.3)' : 'transparent' }}>
                    {s.label}
                </button>
            );
        })}
        <span className="ml-2 text-[18px] text-gray-300">do VO₂máx</span>
    </div>
);

/** Barras do glicogênio que sobra, por tipo: mostra a ordem de esvaziamento sem depender do mosaico. */
const TypeBars = ({ stage }: { stage: number }) => (
    <div className="flex flex-col gap-3">
        {(['I', 'II'] as const).map(t => (
            <div key={t} className="flex items-center gap-3">
                <span className="w-[130px] text-[19px] text-gray-100">{t === 'I' ? 'lentas (I)' : 'rápidas (II)'}</span>
                <div className="relative h-[24px] flex-1 overflow-hidden rounded bg-white/10">
                    <Grow value={meanLeft(t, stage)} color={C.glycogen} />
                </div>
            </div>
        ))}
        <span className="text-[16px] text-gray-400">glicogênio que sobra, média por tipo</span>
    </div>
);

export default function FiberOrderSim() {
    const { step, setStep } = useSlideSteps(STAGES.length);
    const stage = STAGES[step];
    return (
        <SimBox>
            <div className="flex flex-1 gap-8">
                <Mosaic stage={step} />
                <div className="flex flex-1 flex-col gap-5 pt-1">
                    <Lead beat={step} chips={<><DesignChip>histoquímica PAS + ATPase · ciclismo · homens</DesignChip><IllustrativeChip /></>} stacked className="min-h-[150px]">{stage.lead}</Lead>
                    <Intensity stage={step} onPick={setStep} />
                    <div className="flex min-h-[96px] items-end gap-4">
                        <motion.span key={stage.ratio || 'rest'} className="font-display text-[88px] font-bold leading-none tabular-nums"
                            style={{ color: C.glycogenSoft }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                            {stage.ratio || 'repouso'}
                        </motion.span>
                        {stage.ratio && <span className="max-w-[230px] pb-2 text-[18px] leading-snug text-gray-200">esvaziamento em relação a 31% do VO₂máx</span>}
                    </div>
                    <TypeBars stage={step} />
                </div>
            </div>
            <Foot source={FIBER_SOURCE} />
        </SimBox>
    );
}
