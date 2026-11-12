import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { Beat } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IndustryChip } from './kit/chips';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Lead, SimFrame } from './ato6/Frame';
import { DOSES, HEADLINE, LEADS, POINTS, SOURCE } from './ato6/dose.content';

/**
 * Slide 102 · A Curva de Smith. Composição guiada pela tipografia: o número grande conta até o ganho
 * enquanto, embaixo, uma faixa de gráfico desenha a curva até o ótimo (~78 g/h) e marca o retorno decrescente.
 */

const W = 820;
const H = 340;
const X0 = 70;
const X1 = W - 80;
const Y0 = 296;
const Y1 = 22;
const sx = (dose: number) => X0 + (dose / 120) * (X1 - X0);
const sy = (gain: number) => Y0 - (gain / 5) * (Y0 - Y1);
const pathOf = (pts: readonly { dose: number; gain: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.dose).toFixed(1)} ${sy(p.gain).toFixed(1)}`).join(' ');

const LOW = POINTS.slice(0, 5);
const HIGH = POINTS.slice(4);
/** Onde o ponteiro para em cada passo. */
const POINTER = [null, POINTS[4], POINTS[5], POINTS[5]] as const;

const Strip = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const ptr = POINTER[step];
    const draw = (show: boolean, delay = 0) => ({
        initial: { pathLength: 0 },
        animate: { pathLength: show ? 1 : 0 },
        transition: { duration: reduce ? 0 : DUR.draw, delay, ease: EASE_IN_OUT },
    });
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="max-w-full" role="img" aria-label="Ganho no contrarrelógio por dose de carboidrato">
            {/* zona de retorno decrescente */}
            <motion.rect x={sx(78)} y={Y1 - 6} width={X1 - sx(78)} height={Y0 - Y1 + 6} rx={8} fill={C.co2}
                initial={{ opacity: 0 }} animate={{ opacity: step === 3 ? 0.16 : 0 }} transition={{ duration: DUR.enter }} />
            {step === 3 && <SvgText x={(sx(78) + X1) / 2 + 8} y={Y1 + 70} text="retorno decrescente" anchor="middle" size={20} color="#E5E7EB" />}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            {[0, 1, 2, 3, 4, 5].map(g => (
                <SvgText key={g} x={X0 - 14} y={sy(g) + 6} text={`${g}%`} anchor="end" size={16} color={C.muted} weight={500} />
            ))}
            {DOSES.map((d, i) => (
                <motion.circle key={d} cx={sx(d)} cy={Y0} r={7} fill={step === 0 ? C.glucose : '#475569'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i, 0.1, 0.04), duration: DUR.text }} />
            ))}
            {[0, 30, 60, 90, 120].map(d => (
                <SvgText key={d} x={sx(d)} y={Y0 + 30} text={`${d}`} anchor="middle" size={16} color={C.muted} weight={500} />
            ))}
            <SvgText x={W - 4} y={Y0 + 6} text="g/h" anchor="end" size={16} color={C.muted} weight={500} />
            <motion.path d={pathOf(LOW)} fill="none" stroke={C.glucose} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...draw(step >= 1)} />
            <motion.path d={pathOf(HIGH)} fill="none" stroke={C.glucose} strokeWidth={5} strokeLinecap="round" {...draw(step >= 2, 0.1)} />
            {POINTS.slice(1).map(p => {
                const shown = p.dose <= (step >= 2 ? 78 : step >= 1 ? 48 : -1);
                return (
                    <motion.circle key={p.dose} cx={sx(p.dose)} cy={sy(p.gain)} r={8} fill="#04080F" stroke={C.glucose} strokeWidth={4}
                        initial={{ opacity: 0 }} animate={{ opacity: shown ? 1 : 0 }} transition={{ delay: shown ? 0.6 : 0, duration: DUR.text }} />
                );
            })}
            {ptr && (
                <motion.g initial={false} animate={{ x: sx(ptr.dose), y: sy(ptr.gain) }} transition={{ duration: DUR.morph, ease: EASE_IN_OUT }}>
                    <circle cx={0} cy={0} r={13} fill={C.glucose} />
                </motion.g>
            )}
        </svg>
    );
};

export default function DoseResponseSim() {
    const { step } = useSlideSteps(4);
    const head = HEADLINE[step];
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{LEADS[step]}</Lead></Beat>}
            chips={step === 3 ? <IndustryChip /> : <DesignChip>ECR duplo-cego · n = 51 · 4 centros</DesignChip>}
            source={SOURCE}>
            <div className="flex h-full items-center gap-6">
                <Beat beat={step} className="flex w-[300px] shrink-0 flex-col gap-2">
                    <CountUp text={head.value} className="font-display text-[88px] font-bold leading-[0.95]" style={{ color: C.glucose }} />
                    <motion.span className="text-[22px] leading-snug text-gray-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>{head.caption}</motion.span>
                </Beat>
                <Strip step={step} />
            </div>
        </SimFrame>
    );
}
