import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { sample, useMorphPath } from '../kit/useMorphPath';
import type { Trend } from './t1d.content';

/** Leitor de glicose contínua chapado: valor, seta de tendência (gira) e o traçado recente (se transforma). */

const ROTATION: Record<Trend, number> = { flat: 0, slight: 45, down: 90, double: 90 };
const TRACE_W = 220;
const TRACE_H = 96;
const LOW = 4;
const HIGH = 8;

interface CgmReaderProps {
    reading: string;
    trend: Trend;
    trace: readonly number[];
}

export const CgmReader = ({ reading, trend, trace }: CgmReaderProps) => {
    const reduce = useReducedMotion();
    const pts = sample(trace.length, 0, trace.length - 1, i => trace[Math.round(i)],
        (x, y) => [10 + (x / (trace.length - 1)) * (TRACE_W - 20), TRACE_H - ((y - LOW) / (HIGH - LOW)) * TRACE_H]);
    const pathRef = useMorphPath(pts);
    const turn = { duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT };
    return (
        <div className="flex w-[250px] shrink-0 flex-col gap-3 rounded-[24px] p-4" style={{ background: '#111827', border: '3px solid #475569' }}
            role="img" aria-label={`sensor: ${reading} mmol/L, seta ${trend}`}>
            <span className="text-[16px] text-gray-300">glicose do sensor</span>
            <div className="flex items-center gap-4">
                <span className="font-mono text-[60px] font-bold leading-none tabular-nums text-white">{reading}</span>
                <div className="flex flex-col">
                    <motion.span className="flex" initial={false} animate={{ rotate: ROTATION[trend] }} transition={turn}>
                        <ArrowRight size={44} strokeWidth={3.2} color={C.glucoseSoft} aria-hidden />
                    </motion.span>
                    <motion.span className="-mt-3 flex" initial={false} animate={{ rotate: 90, opacity: trend === 'double' ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : DUR.enter, ease: EASE_OUT }}>
                        <ArrowRight size={44} strokeWidth={3.2} color={C.glucoseSoft} aria-hidden />
                    </motion.span>
                </div>
            </div>
            <span className="-mt-2 text-[16px] text-gray-300">mmol/L · faixa âmbar &lt; 7,0</span>
            <svg viewBox={`0 0 ${TRACE_W} ${TRACE_H}`} width={TRACE_W - 4} height={TRACE_H} aria-hidden>
                {/* faixa abaixo de 7,0 mmol/L: é nela que a tabela de correção vale */}
                <rect x={0} y={TRACE_H - ((7 - LOW) / (HIGH - LOW)) * TRACE_H} width={TRACE_W} height={((7 - LOW) / (HIGH - LOW)) * TRACE_H} fill={C.glucose} opacity={0.12} />
                <path ref={pathRef} fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
};
