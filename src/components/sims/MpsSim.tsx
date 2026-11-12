import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { br } from './kit/format';
import { CalcChip, DesignChip } from './kit/chips';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { ARMS, DESIGN, FSR_MAX, INSULIN_FOLD, INSULIN_MAX, REPLICAS, SOURCE_MAIN, SOURCE_REPLICAS, STEPS } from './ato9/mps.content';

/**
 * Slide 163 · Insulina Sobe, Síntese Não. Gráfico espelhado: a insulina cresce para cima do eixo das doses,
 * a síntese proteica para baixo. Em cima, escada; embaixo, três barras na mesma linha: o desacoplamento à vista.
 */

const UP_H = 140;
const DOWN_H = 105;

/** Barra que cresce para baixo (a síntese): escala a partir do topo. */
const DownBar = ({ value, color, show }: { value: number; color: string; show: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div aria-hidden className="absolute inset-x-0 top-0 rounded-b-md" style={{ background: color, height: `${value * 100}%`, transformOrigin: 'center top' }}
            initial={false} animate={{ scaleY: show ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : DUR.bar, ease: EASE_OUT }} />
    );
};

const Mirror = ({ step }: { step: number }) => (
    <div className="flex w-[640px] flex-col">
        <span className="mb-2 text-[18px] font-semibold" style={{ color: C.insulinSoft }}>insulina · U·6h/L</span>
        <div className="flex gap-8 pl-4">
            {ARMS.map(a => (
                <div key={a.dose} className="relative w-[130px]" style={{ height: UP_H }}>
                    <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-md" style={{ height: `${(a.insulin / INSULIN_MAX) * 100}%` }}>
                        <Grow value={step >= 1 ? 1 : 0} axis="y" color={C.insulin} />
                    </div>
                    <Reveal show={step >= 1} delay={0.4} className="absolute inset-x-0 text-center font-mono text-[22px] text-white"
                        style={{ bottom: `calc(${(a.insulin / INSULIN_MAX) * 100}% + 6px)` }}>{br(a.insulin)}</Reveal>
                </div>
            ))}
        </div>
        {/* eixo: as doses de CHO */}
        <div className="my-1 flex items-center gap-8 rounded-lg py-2 pl-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {ARMS.map(a => (
                <span key={a.dose} className="w-[130px] text-center font-mono text-[22px] font-semibold" style={{ color: C.glucose }}>{a.dose}</span>
            ))}
            <span className="text-[16px] leading-tight text-gray-300">g/kg/h<br />de CHO</span>
        </div>
        <div className="relative flex gap-8 pl-4">
            {ARMS.map(a => (
                <div key={a.dose} className="relative w-[130px]" style={{ height: DOWN_H }}>
                    <div className="absolute inset-x-0 top-0" style={{ height: `${(a.fsrN / FSR_MAX) * 100}%` }}>
                        <DownBar value={1} color={C.protein} show={step >= 2} />
                    </div>
                    <Reveal show={step >= 2} delay={0.45} className="absolute inset-x-0 text-center font-mono text-[22px] font-semibold"
                        style={{ top: `calc(${(a.fsrN / FSR_MAX) * 100}% - 36px)`, color: '#04080F' }}>{a.fsr}</Reveal>
                </div>
            ))}
        </div>
        <span className="mt-3 text-[18px] font-semibold" style={{ color: C.proteinSoft }}>síntese proteica · %/h</span>
    </div>
);

export default function MpsSim() {
    const { step } = useSlideSteps(STEPS.length);
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={STEPS[step]} className="min-h-[68px]" chips={<>
                <DesignChip>{step < 3 ? DESIGN : 'cruzado · n = 9 / paralelo · n = 13'}</DesignChip>
                {step === 1 && <CalcChip />}
            </>} />
            <div className="mt-3 flex min-h-0 flex-1 gap-12">
                <Mirror step={step} />
                <div className="flex min-w-0 flex-1 flex-col pt-10">
                    <div className="relative mt-4 flex-1">
                        <Reveal show={step === 0} className="absolute inset-0 flex flex-col gap-3">
                            <span className="font-display font-bold leading-none" style={{ fontSize: 80, color: C.proteinSoft }}>0,3</span>
                            <span className="text-[22px] text-gray-200">g/kg/h de proteína nos três braços</span>
                        </Reveal>
                        <Reveal show={step === 1} className="absolute inset-0">
                            <span className="font-display font-bold leading-none" style={{ fontSize: 96, color: C.insulinSoft }}>~{INSULIN_FOLD}×</span>
                        </Reveal>
                        <Reveal show={step === 2} className="absolute inset-0 flex flex-col gap-3">
                            <span className="font-display font-bold leading-none tabular-nums" style={{ fontSize: 56, color: C.proteinSoft }}>{ARMS.map(a => a.fsr).join(' · ')}</span>
                            <span className="text-[22px] text-gray-200">%/h · diferença não significativa</span>
                        </Reveal>
                        <Reveal show={step === 3} className="absolute inset-0 flex flex-col gap-5">
                            {REPLICAS.map(r => (
                                <div key={r.who} className="flex flex-col gap-1">
                                    <span className="text-[22px] font-semibold text-white">{r.who}</span>
                                    <span className="text-[20px] leading-snug text-gray-200">{r.what}</span>
                                </div>
                            ))}
                        </Reveal>
                    </div>
                </div>
            </div>
            <SourceLine>{step < 3 ? SOURCE_MAIN : SOURCE_REPLICAS}</SourceLine>
        </SimBox>
    );
}
