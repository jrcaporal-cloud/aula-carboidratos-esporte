import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { HEX } from './geometry';

/**
 * Uma pista de enzima (slide 23): substrato numa ponta, produto na outra, a enzima no meio
 * e glicoses que atravessam UMA vez quando o passo muda (sem laço). `dir` diz o sentido.
 */
export type Dir = 'right' | 'left' | 'both';

interface Token { from: 'left' | 'right'; delay: number }

const tokensFor = (dir: Dir): Token[] =>
    dir === 'both'
        ? [{ from: 'left', delay: 0 }, { from: 'right', delay: 0.45 }]
        : [0, 0.15, 0.3].map(delay => ({ from: dir === 'right' ? 'left' : 'right', delay }));

const Hex = () => (
    <svg width={30} height={30} viewBox="-26 -26 52 52" aria-hidden>
        <polygon points={HEX} fill={C.glucose} />
    </svg>
);

const Travel = ({ token }: { token: Token }) => {
    const reduce = useReducedMotion();
    if (reduce) return null;
    const start = token.from === 'left' ? '0cqw' : 'calc(100cqw - 30px)';
    const end = token.from === 'left' ? 'calc(100cqw - 30px)' : '0cqw';
    return (
        <motion.div className="absolute left-0 top-1/2 -mt-[15px]"
            initial={{ x: start, opacity: 0 }}
            animate={{ x: [start, end], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, delay: token.delay, ease: EASE_IN_OUT, opacity: { duration: 0.8, delay: token.delay, times: [0, 0.15, 0.8, 1] } }}>
            <Hex />
        </motion.div>
    );
};

interface LaneProps {
    dir: Dir;
    enzyme: string;
    color: string;
    left: ReactNode;
    right: ReactNode;
    /** Muda a cada passo: as glicoses atravessam de novo. */
    run: string;
    dim?: boolean;
}

export const Lane = ({ dir, enzyme, color, left, right, run, dim = false }: LaneProps) => {
    const Arrow = dir === 'left' ? ChevronLeft : ChevronRight;
    return (
        <motion.div className="flex items-center gap-3" animate={{ opacity: dim ? 0.6 : 1 }} transition={{ duration: DUR.enter }}>
            <div className="w-[150px] shrink-0">{left}</div>
            <div className="relative h-[64px] flex-1 rounded-2xl bg-slate-800 [container-type:inline-size]">
                <div className="absolute inset-0 flex items-center justify-between px-3 text-slate-500" aria-hidden>
                    {dir === 'both' ? <ChevronLeft size={30} strokeWidth={3} /> : <Arrow size={30} strokeWidth={3} />}
                    <Arrow size={30} strokeWidth={3} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-xl px-4 py-1.5 text-[20px] font-semibold" style={{ background: color, color: '#04080F' }}>{enzyme}</span>
                </div>
                {tokensFor(dir).map((t, i) => <Travel key={`${run}-${i}`} token={t} />)}
            </div>
            <div className="w-[150px] shrink-0">{right}</div>
        </motion.div>
    );
};

/** Bloco de molécula numa ponta da pista. */
export const Molecule = ({ name, color, note }: { name: string; color: string; note?: string }) => (
    <div className="flex flex-col items-center gap-1 rounded-xl border-[3px] px-2 py-2 text-center" style={{ borderColor: color }}>
        <span className="text-[20px] font-semibold leading-tight" style={{ color }}>{name}</span>
        {note && <span className="text-[16px] leading-tight text-gray-300">{note}</span>}
    </div>
);
