import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Tank } from './kit/Tank';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { CastBadge } from './ato9/CastBadge';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { ACUTE, CURL, FIBERS, HYPER, SOURCES, STEPS } from './ato9/strength.content';

/**
 * Slide 162 · Paulo e o Carbo Pós-Treino. O tanque do bíceps (símbolo da aula) baixa só um quarto com a rosca;
 * abre em três tanques por fibra; depois o veredito das revisões: força (19 quadrados) e hipertrofia (um número).
 */

/** Passos 1–2: o bíceps de Paulo e a perda por série. */
const Biceps = ({ step }: { step: number }) => {
    const level = step >= 1 ? 1 - CURL[1].drop / 100 : 1;
    return (
        <div className="flex h-full items-center gap-12 pl-6">
            <Tank level={level} label="bíceps" value={step >= 1 ? `−${CURL[1].drop}%` : 'cheio'} width={130} height={280} active />
            <div className="flex flex-col gap-5">
                {CURL.map((c, i) => (
                    <Reveal key={c.label} show={step >= 1} delay={0.3 + i * 0.25} className="flex items-baseline gap-4">
                        <span className="w-[120px] text-[22px] text-gray-200">{c.label}</span>
                        <span className="font-display text-[56px] font-bold leading-none" style={{ color: C.glycogenSoft }}>−{c.drop}%</span>
                    </Reveal>
                ))}
                <Reveal show={step >= 1} delay={0.8}>
                    <span className="text-[20px] text-gray-300">gasta um quarto; não esvazia</span>
                </Reveal>
            </div>
        </div>
    );
};

/** Passo 3: três tanques, um por tipo de fibra. */
const Fibers = () => (
    <div className="flex h-full items-end gap-14 pb-2 pl-6">
        {FIBERS.map(f => (
            <div key={f.label} className="flex flex-col items-center gap-2">
                <span className="font-display text-[40px] font-bold leading-none" style={{ color: f.drop >= 40 ? C.glycogenSoft : C.text }}>−{f.drop}%</span>
                <Tank level={1 - f.drop / 100} label={f.label} width={96} height={230} active={f.drop >= 40} />
            </div>
        ))}
    </div>
);

/** Passo 4: os estudos agudos da revisão, um quadrado por estudo. */
const Acute = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    const cells = [...Array(ACUTE.nulls).fill('nulo'), ...Array(ACUTE.positives).fill('positivo')] as string[];
    return (
        <div className="flex h-full flex-col justify-center gap-5 pl-6">
            <div className="flex w-[590px] flex-wrap gap-3">
                {cells.map((kind, i) => (
                    <motion.span key={i} className="block h-[46px] w-[46px] rounded-lg"
                        style={{ background: kind === 'nulo' ? 'rgba(148,163,184,0.45)' : C.glucose }}
                        initial={false} animate={{ opacity: show ? 1 : 0, scale: show || reduce ? 1 : 0.9 }}
                        transition={{ delay: show ? stagger(i, 0.15, 0.03) : 0, duration: DUR.enter, ease: EASE_OUT }} />
                ))}
            </div>
            <div className="flex gap-8 text-[22px]">
                <span className="text-gray-200"><b className="font-mono text-white">{ACUTE.nulls}</b> sem efeito</span>
                <span style={{ color: C.glucoseSoft }}><b className="font-mono">{ACUTE.positives}</b> a favor, sobretudo com jejum ou &gt;10 séries</span>
            </div>
            <span className="text-[18px] text-gray-300">estudos agudos da revisão</span>
        </div>
    );
};

/** Passo 5: o número da meta-análise de hipertrofia. */
const Hypertrophy = ({ show }: { show: boolean }) => (
    <div className="flex h-full flex-col justify-center gap-3 pl-6">
        <div className="flex items-baseline gap-5">
            <span className="text-[28px] text-gray-300">SMD</span>
            <CountUp text={HYPER.smd} run={show} className="font-display font-bold leading-none" style={{ fontSize: 120, color: C.glucose }} />
        </div>
        <span className="text-[26px] text-gray-100">p = {HYPER.p} · intervalo inclui o zero</span>
        <span className="text-[20px] text-gray-300">a energia do dia fecha a conta, não o shake</span>
    </div>
);

export default function StrengthSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <SimBox className="flex flex-col">
            <div className="flex min-h-0 flex-1 gap-10">
                <div className="w-[270px] shrink-0 pt-2"><CastBadge id="paulo" /></div>
                <div className="flex min-w-0 flex-1 flex-col pl-8" style={{ borderLeft: '2px solid rgba(255,255,255,0.14)' }}>
                    <Head beat={step} say={s.say} className="min-h-[68px]" chips={s.design ? <DesignChip>{s.design}</DesignChip> : undefined} />
                    <div className="relative mt-4 flex-1">
                        <Reveal show={step <= 1} className="absolute inset-0"><Biceps step={step} /></Reveal>
                        <Reveal show={step === 2} className="absolute inset-0">{step === 2 && <Fibers />}</Reveal>
                        <Reveal show={step === 3} className="absolute inset-0"><Acute show={step === 3} /></Reveal>
                        <Reveal show={step === 4} className="absolute inset-0"><Hypertrophy show={step === 4} /></Reveal>
                    </div>
                </div>
            </div>
            <SourceLine>{SOURCES[step]}</SourceLine>
        </SimBox>
    );
}
