import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { Beat } from './kit/Beat';
import { Head, SimBox, SourceLine } from './ato9/parts';
import { ERODED, STEPS, TEETH } from './ato9/dental.content';

/**
 * Slide 170 · O Preço no Sorriso (curto). Uma arcada de 20 dentes chapados: 9 ganham a cor da erosão (45%).
 * À direita, um número por passo, em tipografia grande. Recurso: cena desenhada + número que conta.
 */

const AW = 520;
const AH = 380;

interface Tooth { x: number; y: number; rot: number; eroded: boolean; rank: number }

/** Distribui as 9 erosões ao longo da arcada (sem amontoar num lado); `rank` dá a ordem de entrada. */
const buildArch = (): Tooth[] =>
    Array.from({ length: TEETH }, (_, i) => {
        const t = Math.PI + ((i + 0.5) / TEETH) * Math.PI;
        const eroded = Math.floor(((i + 1) * ERODED) / TEETH) > Math.floor((i * ERODED) / TEETH);
        const rank = Math.floor((i * ERODED) / TEETH);
        return { x: AW / 2 + 215 * Math.cos(t), y: 350 + 290 * Math.sin(t), rot: (t * 180) / Math.PI + 90, eroded, rank };
    });

const ARCH = buildArch();

const Arch = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <svg viewBox={`0 0 ${AW} ${AH}`} width={AW} height={AH} role="img" aria-label={`${ERODED} de ${TEETH} dentes com erosão`}>
            {ARCH.map((th, i) => (
                <g key={i} transform={`translate(${th.x.toFixed(1)} ${th.y.toFixed(1)}) rotate(${th.rot.toFixed(1)})`}>
                    <rect x={-17} y={-24} width={34} height={48} rx={12} fill={C.text} />
                    {th.eroded && (
                        <motion.path d="M-17 -6 Q-8 4 0 -4 Q8 -12 17 -2 L17 12 Q17 24 5 24 L-5 24 Q-17 24 -17 12 Z" fill={C.risk}
                            initial={false} animate={{ opacity: show ? 1 : 0 }}
                            transition={{ delay: show && !reduce ? 0.2 + th.rank * 0.06 : 0, duration: reduce ? 0 : 0.35, ease: EASE_OUT }} />
                    )}
                </g>
            ))}
        </svg>
    );
};

export default function DentalSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={s.say} className="min-h-[68px]" chips={<DesignChip>{s.design}</DesignChip>} />
            <div className="flex min-h-0 flex-1 items-center gap-12">
                <Arch show />
                <Beat beat={step} className="flex flex-col gap-3">
                    <CountUp text={s.big} className="font-display font-bold leading-none" style={{ fontSize: 112, color: step === 1 ? C.glucose : C.risk }} />
                    <span className="max-w-[420px] text-[24px] leading-snug text-gray-100">{s.caption}</span>
                    {s.extra && <span className="text-[22px] text-gray-300">{s.extra}</span>}
                </Beat>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </SimBox>
    );
}
