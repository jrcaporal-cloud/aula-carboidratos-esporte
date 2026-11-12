import { motion, useReducedMotion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { LANES } from './rescue.content';

/** Raias do resgate (escala 0–60 min): cada raia corre até o tempo extra que rendeu. */
const SCALE = 60;
const SPACED = { wordSpacing: '0.15em' } as const;

export const FirstBout = () => (
    <div className="flex items-center gap-16">
        <div className="flex items-center gap-5">
            <Timer size={84} strokeWidth={2.2} className="text-gray-200" aria-hidden />
            <div className="flex flex-col">
                <CountUp text="~170 min" duration={1.1} className="font-display text-[84px] font-bold leading-none text-white" style={SPACED} />
                <span className="text-[20px] text-gray-100">até a primeira exaustão</span>
            </div>
        </div>
        <div className="flex flex-col">
            <span className="font-display text-[64px] font-bold leading-none" style={{ color: C.risk, ...SPACED }}>5,0 → 3,1</span>
            <span className="text-[20px] text-gray-100">glicose no sangue, mM</span>
        </div>
    </div>
);

interface LanesProps { run: boolean; showHistoric: boolean }

export const RescueLanes = ({ run, showHistoric }: LanesProps) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex w-full flex-col gap-4">
            <span className="text-[18px] text-gray-300">tempo extra até a nova exaustão</span>
            {LANES.map((l, i) => (
                <div key={l.key} className="grid items-center gap-5" style={{ gridTemplateColumns: '290px 1fr 130px' }}>
                    <span className="text-[21px] font-semibold text-white">{l.label}</span>
                    <div className="relative h-10 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        {run && <Grow value={l.minutes / SCALE} color={l.color} delay={stagger(i, 0.1, 0.12)} />}
                    </div>
                    <span className="font-display text-[34px] font-semibold leading-none" style={{ color: l.color, ...SPACED }}>
                        {run ? <CountUp text={l.text} delay={stagger(i, 0.1, 0.12)} /> : '—'}
                    </span>
                </div>
            ))}
            {showHistoric && (
                <motion.div className="mt-2 grid items-center gap-5 border-t-[3px] border-slate-700 pt-5" style={{ gridTemplateColumns: '290px 1fr 130px' }}
                    initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="text-[21px] font-semibold text-white">1939 · 200 g · 2 atletas</span>
                    <div className="relative h-10 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <Grow value={60 / SCALE} color={C.glucoseDeep} delay={0.2} />
                    </div>
                    <span className="font-display text-[34px] font-semibold leading-none" style={{ color: C.glucoseSoft, ...SPACED }}>~1 h</span>
                </motion.div>
            )}
        </div>
    );
};
