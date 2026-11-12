import { motion, useReducedMotion } from 'framer-motion';
import { Ban } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import type { KeyState } from './glut4.content';

/**
 * A porta (GLUT4) na membrana da fibra, com duas fechaduras embaixo: insulina (via PI3K) e contração.
 * Cena em HTML sobre um SVG só de linhas (texto em HTML fica nítido no codec). 500 × 340 px.
 */

const W = 500;
const DOOR_X = 250;
const DOTS = [150, 200, 250, 300, 350] as const;
/** Ordem de passagem: o centro primeiro, as pontas por último. */
const PASS_ORDER = [2, 1, 3, 0, 4] as const;
const MEMBRANE = '#475569';
type DotIndex = (typeof PASS_ORDER)[number];

interface DoorProps {
    step: number;
    insulin: KeyState;
    contraction: KeyState;
    pass: number;
    /** Mostra a via de cada chave (só nos passos da wortmanina). */
    detail: boolean;
}

const lineColor = (s: KeyState, color: string) => (s === 'on' ? color : s === 'blocked' ? C.text : MEMBRANE);

const KeyPill = ({ x, label, detail, color, state }: { x: number; label: string; detail?: string; color: string; state: KeyState }) => {
    const on = state === 'on';
    return (
        <div className="absolute flex h-[70px] w-[214px] flex-col justify-center rounded-2xl border-[3px] px-4 transition-colors duration-300"
            style={{ left: x, top: 252, borderColor: state === 'off' ? MEMBRANE : state === 'blocked' ? C.text : color, background: on ? color : '#0B1220' }}>
            <span className="text-[22px] font-bold leading-tight" style={{ color: on ? '#04080F' : '#F3F4F6' }}>{label}</span>
            {detail && <span className="text-[16px] leading-tight" style={{ color: on ? '#04080F' : '#D1D5DB' }}>{detail}</span>}
        </div>
    );
};

export const Glut4Door = ({ step, insulin, contraction, pass, detail }: DoorProps) => {
    const reduce = useReducedMotion();
    const both = insulin === 'on' && contraction === 'on';
    const open = both ? 46 : insulin === 'on' || contraction === 'on' ? 32 : 0;
    // Passo bloqueado: a porta chega a abrir com a insulina e fecha quando a wortmanina entra.
    const blink = insulin === 'blocked' && contraction === 'off' && !reduce;
    const doorX = blink ? [0, 32, 32, 0] : open;
    const doorT = blink ? { duration: 1.1, times: [0, 0.3, 0.55, 1], ease: EASE_IN_OUT } : { duration: DUR.morph, ease: EASE_IN_OUT };
    const passing = new Set<number>(PASS_ORDER.slice(0, pass));

    return (
        <div className="relative h-[340px] shrink-0" style={{ width: W }}>
            <span className="absolute left-0 top-0 text-[17px] text-gray-300">sangue</span>
            <span className="absolute left-0 top-[150px] text-[17px] text-gray-300">dentro da fibra</span>
            <span className="absolute text-[20px] font-bold" style={{ left: DOOR_X + 74, top: 74, color: C.caveat }}>GLUT4</span>

            <svg className="absolute inset-0" width={W} height={340} viewBox={`0 0 ${W} 340`} aria-hidden>
                <line x1={125} y1={252} x2={DOOR_X - 18} y2={142} stroke={lineColor(insulin, C.insulin)} strokeWidth={4}
                    strokeDasharray={insulin === 'blocked' ? '10 8' : undefined} />
                <line x1={375} y1={252} x2={DOOR_X + 18} y2={142} stroke={lineColor(contraction, C.stone)} strokeWidth={4} />
            </svg>

            {/* membrana com o vão da porta */}
            <div className="absolute h-6 rounded-sm" style={{ left: 0, top: 110, width: DOOR_X - 64, background: MEMBRANE }} />
            <div className="absolute h-6 rounded-sm" style={{ left: DOOR_X + 64, top: 110, width: W - DOOR_X - 64, background: MEMBRANE }} />
            {[-1, 1].map(side => (
                <motion.div key={side} className="absolute h-[38px] w-[58px] rounded-lg border-[3px]"
                    style={{ left: side < 0 ? DOOR_X - 60 : DOOR_X + 2, top: 103, borderColor: C.caveat, background: '#0B1220' }}
                    animate={{ x: Array.isArray(doorX) ? doorX.map(v => v * side) : doorX * side }} transition={doorT} />
            ))}

            {/* glicoses: as que passam atravessam o vão e pousam dentro da fibra */}
            <div key={step} className="absolute inset-0">
                {DOTS.map((x0, i) => {
                    const goes = passing.has(i);
                    const xEnd = DOOR_X - 60 + i * 30;
                    const target = { x: [0, DOOR_X - x0, xEnd - x0], y: [0, 96, 181] };
                    return (
                        <motion.span key={x0} aria-hidden className="absolute h-[22px] w-[22px] rounded-full"
                            style={{ left: x0 - 11, top: 28, background: C.glucose }}
                            initial={{ x: 0, y: 0 }}
                            animate={goes ? (reduce ? { x: xEnd - x0, y: 181 } : target) : { x: 0, y: 0 }}
                            transition={{ delay: 0.25 + PASS_ORDER.indexOf(i as DotIndex) * 0.07, duration: 0.65, ease: EASE_OUT }} />
                    );
                })}
            </div>

            {insulin === 'blocked' && (
                <motion.div className="absolute flex items-center gap-2 rounded-xl border-[3px] px-3 py-1"
                    style={{ left: 20, top: 186, borderColor: C.text, background: '#04080F', color: C.text }}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: step === 1 ? 0.5 : 0, duration: DUR.enter, ease: EASE_OUT }}>
                    <Ban size={22} strokeWidth={3} aria-hidden />
                    <span className="text-[19px] font-semibold">wortmanina</span>
                </motion.div>
            )}

            <KeyPill x={18} label="insulina" detail={detail ? 'via PI3K' : undefined} color={C.insulin} state={insulin} />
            <KeyPill x={268} label="contração" detail={detail ? 'outra via' : undefined} color={C.stone} state={contraction} />
        </div>
    );
};
