import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { C } from './kit/palette';
import { KeyFact } from './kit/rhythm';
import { Chip } from './kit/ui';
import { PaFrame, PaSide } from './ato6/paFrame';
import { CHAIN, LAYERS, LESSONS, QUESTION, SOURCE, STATIONS, STEPS, TEAM } from './ato6/gatorade.content';

/**
 * Slide 100 · Gainesville, 1965. Linha do tempo que acumula: o trilho cresce até a estação do passo e cada estação
 * deixa um cartão no palco (a pergunta, o copo que se enche camada a camada, o placar, o produto). No fim, os quatro
 * cartões contam a história inteira; o painel diz o que ela é (fonte institucional) e o que não é (evidência de efeito).
 */

const Rail = ({ step }: { step: number }) => (
    <div className="relative mx-10 h-[52px] shrink-0">
        <div className="absolute left-0 right-0 top-[11px] h-[4px] overflow-hidden rounded-full bg-white/15">
            <Grow value={step / (STATIONS.length - 1)} color={C.glucose} />
        </div>
        {STATIONS.map((date, i) => (
            <div key={date} className="absolute top-0 flex w-0 flex-col items-center" style={{ left: `${(i / (STATIONS.length - 1)) * 100}%` }}>
                <span className="h-[26px] w-[26px] shrink-0 rounded-full border-[3px] transition-colors duration-300"
                    style={{ borderColor: i <= step ? C.glucose : 'rgba(255,255,255,0.3)', background: i === step ? C.glucose : '#04080F' }} />
                <span className="mt-0.5 whitespace-nowrap font-mono text-[15px] tabular-nums" style={{ color: i === step ? C.glucoseSoft : '#CBD5E1' }}>{date}</span>
            </div>
        ))}
    </div>
);

/** Cartão de uma estação: entra no seu passo e fica; o do passo atual tem a borda acesa. */
const Card = ({ at, step, title, children }: { at: number; step: number; title: string; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    const shown = step >= at;
    return (
        <motion.div className="flex min-h-0 flex-col gap-1.5 rounded-xl border-2 px-4 py-3"
            style={{ borderColor: step === at ? `${C.glucose}AA` : 'rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.03)' }}
            initial={false} animate={{ opacity: shown ? 1 : 0, y: shown || reduce ? 0 : 12 }}
            transition={{ duration: DUR.enter, delay: shown && step === at ? 0.25 : 0, ease: EASE_OUT }}>
            <span className="font-mono text-[15px] text-gray-300">{STATIONS[at]} · {title}</span>
            {shown && children}
        </motion.div>
    );
};

const rise = (i: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: stagger(i, 0.35, 0.12), duration: DUR.enter, ease: EASE_OUT },
});

const Question = () => (
    <>
        <p className="m-0 text-[19px] font-semibold leading-snug text-white">
            <span style={{ color: C.glucose }}>“</span>{QUESTION}<span style={{ color: C.glucose }}>”</span>
        </p>
        <div className="mt-auto flex items-center gap-1">
            {CHAIN.map((p, i) => (
                <motion.span key={p.name} className="flex items-center gap-1" {...rise(i)}>
                    {i > 0 && <ArrowRight size={16} color={C.muted} aria-hidden />}
                    <span className="flex flex-col leading-tight">
                        <span className="text-[16px] font-semibold text-white">{p.name.split(' ').pop()}</span>
                        <span className="text-[15px]" style={{ color: i === 2 ? C.glucoseSoft : '#CBD5E1' }}>{p.role}</span>
                    </span>
                </motion.span>
            ))}
        </div>
    </>
);

/** O copo se enche de baixo para cima, uma camada por vez. */
const Glass = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex min-h-0 flex-1 items-center gap-4">
            <div className="relative flex h-[86px] w-[58px] shrink-0 flex-col-reverse overflow-hidden rounded-b-2xl border-[3px] border-slate-300 border-t-0">
                {LAYERS.map((l, i) => (
                    <motion.div key={l.name} className="h-1/4 w-full" style={{ background: l.color, originY: 1 }}
                        initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }}
                        transition={{ duration: 0.22, delay: 0.3 + i * 0.2, ease: EASE_OUT }} />
                ))}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
                {[...LAYERS].reverse().map(l => (
                    <span key={l.name} className="flex items-center gap-2 text-[16px] leading-tight text-gray-100">
                        <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: l.color }} />{l.name}
                    </span>
                ))}
                <span className="mt-1 text-[15px] leading-snug text-gray-300">{TEAM}</span>
            </div>
        </div>
    );
};

const Score = () => (
    <>
        <span className="text-[16px] leading-snug text-gray-100">1º/10: calouros com a bebida × time B sem ela. No dia seguinte:</span>
        <div className="mt-auto flex items-center gap-3">
            <div className="flex flex-col items-center rounded-lg px-3 py-1" style={{ background: C.glucose }}>
                <span className="text-[15px] font-bold text-[#04080F]">FLÓRIDA</span>
                <CountUp text="14" delay={0.4} className="font-display text-[32px] font-bold leading-none text-[#04080F]" />
            </div>
            <span className="font-display text-[28px] text-gray-400">×</span>
            <div className="flex flex-col items-center rounded-lg bg-white/10 px-3 py-1">
                <span className="text-[15px] font-bold text-gray-200">LSU · 5ª</span>
                <CountUp text="7" delay={0.4} className="font-display text-[32px] font-bold leading-none text-gray-100" />
            </div>
        </div>
    </>
);

const Product = () => (
    <>
        <span className="text-[16px] leading-snug text-gray-100">1967: licença à Stokely-Van Camp</span>
        <div className="mt-auto flex flex-col">
            <span className="text-[16px] text-gray-200">mais de</span>
            <KeyFact color={C.glucose} delay={0.5}>
                <CountUp text="US$ 280 mi" delay={0.35} className="font-display text-[38px] font-bold leading-none" style={{ color: C.glucose }} />
            </KeyFact>
            <span className="mt-1 text-[16px] leading-snug text-gray-200">em royalties à UF desde 1972</span>
        </div>
    </>
);

const Stage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 px-4 pb-4 pt-3">
        <Rail step={step} />
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
            <Card at={0} step={step} title="a pergunta"><Question /></Card>
            <Card at={1} step={step} title="a bebida"><Glass /></Card>
            <Card at={2} step={step} title="o teste"><Score /></Card>
            <Card at={3} step={step} title="o produto"><Product /></Card>
        </div>
    </div>
);

export default function GatoradeSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <PaFrame tabs={STEPS.map(t => t.tab)} step={step} onSelect={setStep} layoutId="gatorade-tabs"
            chips={<Chip color={C.stone}>fonte institucional · UF</Chip>}
            stage={<Stage step={step} />} stageWidth={700}
            panel={<PaSide step={step} color={s.color} headline={s.headline} text={s.text} lessons={LESSONS} source={SOURCE} />} />
    );
}
