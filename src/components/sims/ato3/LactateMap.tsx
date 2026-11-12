import { motion, useReducedMotion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { DESTINATIONS } from './lactate.content';

/** Mapa da lançadeira (680 × 360): fibra rápida → lixo (passo 1) ou → fibra lenta, coração e fígado. */
const W = 680;
const H = 360;
const SRC = { x: 180, y: 182 };
const HUB = { x: 300, y: 182 };
const DEST_X = 440;
const NODE_H = 72;
const midY = (top: number) => top + NODE_H / 2;

const Coin = ({ to, i, color, letter, back = false }: { to: number; i: number; color: string; letter: string; back?: boolean }) => {
    const reduce = useReducedMotion();
    const pts = back
        ? { x: [DEST_X, 250, SRC.x - 90], y: [midY(to) + 20, H - 6, SRC.y + 56] }
        : { x: [SRC.x, HUB.x, DEST_X - 14], y: [SRC.y, HUB.y, midY(to)] };
    const end = { x: pts.x[2], y: pts.y[2] };
    return (
        <motion.span aria-hidden className="absolute flex h-[30px] w-[30px] items-center justify-center rounded-full text-[16px] font-bold text-[#04080F]"
            style={{ left: -15, top: -15, background: color }}
            initial={reduce ? end : { x: pts.x[0], y: pts.y[0], opacity: 0 }}
            animate={reduce ? end : { ...pts, opacity: 1 }}
            transition={{ delay: back ? 0.55 : 0.1 + i * 0.12, duration: back ? 0.6 : 0.7, ease: EASE_IN_OUT }}>
            {letter}
        </motion.span>
    );
};

export const LactateMap = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const shuttle = step >= 1;
    return (
        <div className="relative shrink-0" style={{ width: W, height: H }}>
            <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
                {shuttle ? DESTINATIONS.map(d => (
                    <path key={d.key} d={`M ${SRC.x} ${SRC.y} L ${HUB.x} ${HUB.y} L ${DEST_X} ${midY(d.top)}`} fill="none" stroke={C.lactate} strokeWidth={4} strokeLinejoin="round" />
                )) : (
                    <path d={`M ${SRC.x} ${SRC.y} L ${HUB.x + 40} ${SRC.y}`} fill="none" stroke="#475569" strokeWidth={4} strokeDasharray="10 8" />
                )}
                {shuttle && (
                    <path d={`M ${DEST_X} ${midY(280) + 20} Q 250 ${H + 20} ${SRC.x - 90} ${SRC.y + 56}`} fill="none" stroke={C.glucose} strokeWidth={4} strokeDasharray="10 8" />
                )}
            </svg>

            <div className="absolute flex flex-col justify-center rounded-2xl border-[3px] px-4"
                style={{ left: 0, top: SRC.y - NODE_H / 2, width: SRC.x, height: NODE_H, borderColor: C.lactate, background: '#0B1220' }}>
                <span className="text-[21px] font-bold text-white">fibra rápida</span>
                <span className="text-[16px] text-gray-300">faz lactato</span>
            </div>

            {!shuttle && (
                <motion.div className="absolute flex flex-col items-center gap-1 text-gray-400" style={{ left: HUB.x + 50, top: SRC.y - 44 }}
                    initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: DUR.enter, ease: EASE_OUT }}>
                    <Trash2 size={64} strokeWidth={2.5} aria-hidden />
                    <span className="text-[18px]">descarte</span>
                </motion.div>
            )}

            {shuttle && DESTINATIONS.map((d, i) => (
                    <motion.div key={d.key} className="absolute flex flex-col justify-center rounded-2xl border-[3px] px-4"
                        style={{ left: DEST_X, top: d.top, width: W - DEST_X, height: NODE_H, borderColor: d.key === 'figado' ? C.glucose : C.lactate, background: '#0B1220' }}
                        initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: step === 1 ? i * 0.08 : 0, duration: DUR.enter, ease: EASE_OUT }}>
                        <span className="text-[21px] font-bold text-white">{d.label}</span>
                        <span className="text-[16px] text-gray-300">{d.role}</span>
                    </motion.div>
            ))}

            {shuttle && (
                <div key={step} className="absolute left-0 top-0">
                    {DESTINATIONS.map((d, i) => <Coin key={d.key} to={d.top} i={i} color={C.lactate} letter="L" />)}
                    <Coin to={280} i={0} color={C.glucose} letter="G" back />
                </div>
            )}
        </div>
    );
};
