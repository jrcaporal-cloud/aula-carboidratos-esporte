import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Beat, Grow } from './kit/Beat';
import { br, signed } from './kit/format';
import { CalcChip, DesignChip } from './kit/chips';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { BOYS_EDGE, CYCLE, STEPS, type DuelSide } from './ato9/womenYouth.content';

/**
 * Slide 167 · Mulheres e Jovens. Um único instrumento, duas barras, cinco perguntas: as barras ficam, os rótulos
 * e as alturas trocam (homens × mulheres → carga → meninos → calor). A virada final é a inversão a 38 °C.
 */

const BAR_H = 230;

const Bar = ({ side, max, decimals }: { side: DuelSide; max: number; decimals: number }) => {
    const reduce = useReducedMotion();
    const beforeAt = side.before !== undefined ? side.before / max : null;
    return (
        <div className="flex w-[170px] flex-col items-center gap-3">
            <span className="font-mono text-[30px] font-semibold tabular-nums text-white">{br(side.value, decimals)}</span>
            <div className="relative w-[150px] overflow-hidden rounded-t-xl" style={{ height: BAR_H, background: 'rgba(255,255,255,0.06)' }}>
                <Grow value={side.value / max} axis="y" color={side.color} />
                {/* marca do "antes": uma linha tracejada que desce até o valor de partida */}
                <motion.div aria-hidden className="absolute inset-x-0 border-t-[3px] border-dashed" style={{ borderColor: '#04080F', bottom: 0 }}
                    initial={false} animate={{ y: beforeAt === null ? 0 : -beforeAt * BAR_H, opacity: beforeAt === null ? 0 : 1 }}
                    transition={{ duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT }} />
            </div>
            <span className="text-[24px] font-semibold text-gray-100">{side.label}</span>
        </div>
    );
};

/** McNulty 2020: um ponto quase em cima do zero. */
const CycleRuler = () => {
    const x0 = 30;
    const x1 = 470;
    const sx = (v: number) => x0 + ((v + 0.3) / 0.6) * (x1 - x0);
    return (
        <svg viewBox="0 0 500 120" width={500} height={120} role="img" aria-label="Tamanho de efeito −0,06, intervalo −0,16 a 0,04">
            <line x1={x0} x2={x1} y1={60} y2={60} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
            <line x1={sx(0)} x2={sx(0)} y1={24} y2={84} stroke={C.text} strokeWidth={3} strokeDasharray="5 5" />
            <line x1={sx(CYCLE.lo)} x2={sx(CYCLE.hi)} y1={60} y2={60} stroke={C.stone} strokeWidth={6} strokeLinecap="round" />
            <circle cx={sx(CYCLE.es)} cy={60} r={11} fill={C.stone} stroke="#04080F" strokeWidth={3} />
            {[-0.3, 0, 0.3].map(t => <SvgText key={t} x={sx(t)} y={110} text={signed(t, t === 0 ? 0 : 1)} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <SvgText x={sx(CYCLE.es)} y={34} text={`ES ${signed(CYCLE.es, 2)}`} anchor="middle" size={20} color={C.stone} weight={700} />
        </svg>
    );
};

export default function WomenYouthSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    // Mesma grandeza nas duas barras: a cor é a da química (CHO oxidado = âmbar; glicogênio = violeta).
    const color = step === 2 ? C.glycogen : C.glucose;
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={s.say} className="min-h-[68px]" chips={<>
                <DesignChip>{s.design}</DesignChip>
                {step === 3 && <CalcChip />}
            </>} />
            <div className="mt-4 flex min-h-0 flex-1 gap-14">
                <div className="flex w-[480px] shrink-0 flex-col items-center">
                    <span className="text-[18px] text-gray-300">{s.unit}</span>
                    <div className="mt-3 flex items-end gap-16">
                        {s.sides.map((side, i) => <Bar key={i} side={{ ...side, color }} max={s.max} decimals={s.decimals} />)}
                    </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-6 pt-8">
                    <Beat beat={`n${step}`} className="text-[28px] font-semibold leading-snug" style={{ color: C.text }}>{s.note}</Beat>
                    <div className="relative flex-1">
                        <Reveal show={step === 1} className="absolute inset-x-0 top-0"><CycleRuler /><span className="block pl-7 text-[18px] text-gray-300">folicular inicial × outras fases</span></Reveal>
                        <Reveal show={step === 2} className="absolute inset-x-0 top-0 flex items-center gap-3 text-[20px] text-gray-200">
                            <span className="block w-12 border-t-[3px] border-dashed" style={{ borderColor: C.text }} />valor antes da carga
                        </Reveal>
                        <Reveal show={step === 3} className="absolute inset-x-0 top-0">
                            <span className="font-display font-bold leading-none" style={{ fontSize: 96, color: C.glucoseSoft }}>+{BOYS_EDGE}%</span>
                            <span className="block text-[20px] text-gray-200">por kg, meninos × homens</span>
                        </Reveal>
                    </div>
                </div>
            </div>
            <SourceLine>{s.source}</SourceLine>
        </SimBox>
    );
}
