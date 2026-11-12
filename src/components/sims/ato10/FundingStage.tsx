import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { DecideSlot } from './DecideShell';
import { FUNNEL, QUALITY, STUDIES } from './funding.content';

/**
 * Palco do slide 188 (Quem Paga o Estudo): o funil de Heneghan 2012 em escala linear (431 alegações → 3 estudos de
 * alta qualidade) e, embaixo, os 74 estudos avaliáveis (3 acendem) com os critérios de qualidade em barras.
 */

const MAX_W = 290;
const MAX_N = FUNNEL[0].n;

const Funnel = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-2">
        {FUNNEL.map((r, i) => {
            const on = step >= r.at;
            const last = i === FUNNEL.length - 1;
            const delay = r.at === step ? stagger(i, 0.1, 0.18) : 0;
            return (
                <div key={r.n} className="flex h-[42px] items-center gap-3">
                    <div className="relative h-[34px] overflow-hidden rounded-md" style={{ width: Math.max((r.n / MAX_N) * MAX_W, 7) }}>
                        {on && <Grow value={1} color={last ? C.risk : C.co2} delay={delay} />}
                        {!on && <div className="absolute inset-0 rounded-md border-2 border-dashed border-slate-600" />}
                    </div>
                    {on && (
                        <motion.span className="flex items-baseline gap-2.5 whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay, duration: DUR.enter }}>
                            <CountUp text={String(r.n)} delay={delay} className="font-display text-[32px] font-bold leading-none"
                                style={{ color: last ? C.risk : '#fff' }} />
                            <span className="text-[18px] text-gray-200">{r.label}</span>
                        </motion.span>
                    )}
                </div>
            );
        })}
    </div>
);

const StudyDots = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-2">
            <div className="grid w-[290px] grid-cols-[repeat(15,16px)] gap-[3px]">
                {Array.from({ length: STUDIES.total }, (_, i) => {
                    const high = i < STUDIES.high;
                    return (
                        <motion.span key={i} className="block h-[16px] w-[16px] rounded-[4px] border-2"
                            style={{ borderColor: high ? C.ok : '#475569', background: high ? C.ok : 'transparent' }}
                            initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: high ? 0.9 : stagger(i, 0.1, 0.006), duration: DUR.text, ease: EASE_OUT }} />
                    );
                })}
            </div>
            <span className="text-[15px] leading-snug text-gray-200">74 estudos avaliáveis · <b style={{ color: C.ok }}>3 de alta qualidade</b></span>
        </div>
    );
};

const QualityBars = () => (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
        {QUALITY.map((q, i) => {
            const risk = q.label === 'alto risco de viés';
            return (
                <div key={q.label} className="flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[15px] leading-tight text-gray-200">{q.label}</span>
                        <span className="text-[17px] font-bold tabular-nums leading-tight" style={{ color: risk ? C.risk : '#fff' }}>{q.shown}</span>
                    </div>
                    <div className="relative h-[10px] overflow-hidden rounded bg-slate-800">
                        <Grow value={q.pct / 100} color={risk ? C.risk : C.co2} delay={stagger(i, 0.3, 0.12)} />
                    </div>
                </div>
            );
        })}
    </div>
);

export const FundingStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-3 p-4">
        <span className="text-[16px] font-semibold text-gray-300">do anúncio ao estudo (escala linear)</span>
        <Funnel step={step} />
        <div className="mt-1 min-h-0 flex-1 border-t-2 border-white/15 pt-3">
            {step < 2 ? <DecideSlot label="a qualidade dos 74 estudos" /> : (
                <div className="flex h-full gap-6">
                    <StudyDots />
                    <QualityBars />
                </div>
            )}
        </div>
    </div>
);
