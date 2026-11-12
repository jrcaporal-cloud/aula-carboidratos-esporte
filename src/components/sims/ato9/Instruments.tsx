import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';

/** Os dois cenários do slide 166, compactos: termômetro e altímetro chapados, com uma única coisa que se mexe em cada um. */

interface InstrumentProps {
    active: boolean;
    /** Texto embaixo (ex.: "35 °C", "4.300 m", "—"). */
    reading: string;
}

const frame = (active: boolean) => ({ opacity: active ? 1 : 0.6, transition: 'opacity 300ms' });

/** Termômetro: a coluna sobe por scaleY (Grow); `level` 0 → 1. */
export const Thermometer = ({ level, active, reading }: InstrumentProps & { level: number }) => (
    <div className="flex w-[96px] flex-col items-center gap-1.5" style={frame(active)} role="img" aria-label={`termômetro: ${reading}`}>
        <span className="text-[16px] text-gray-300">calor</span>
        <div className="relative h-[84px] w-[26px] overflow-hidden rounded-t-full" style={{ background: 'rgba(255,255,255,0.1)', border: '3px solid #64748B' }}>
            <Grow value={level} axis="y" color={C.risk} />
        </div>
        <span className="-mt-3 block h-[36px] w-[36px] rounded-full" style={{ background: C.risk, border: '3px solid #64748B' }} />
        <span className="whitespace-nowrap font-display text-[20px] font-semibold text-white">{reading}</span>
    </div>
);

/** Altímetro: um marcador sobe a encosta da montanha (translateY). */
export const Altimeter = ({ up, active, reading }: InstrumentProps & { up: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex w-[96px] flex-col items-center gap-1.5" style={frame(active)} role="img" aria-label={`altímetro: ${reading}`}>
            <span className="text-[16px] text-gray-300">altitude</span>
            <div className="relative h-[80px] w-[96px]">
                <svg viewBox="0 0 96 80" width={96} height={80} aria-hidden className="absolute inset-0">
                    <polygon points="4,80 48,6 92,80" fill="#334155" />
                    <polygon points="36,26 48,6 60,26 54,23 48,30 42,23" fill={C.caveat} />
                </svg>
                <motion.span className="absolute left-1/2 block h-[20px] w-[20px] rounded-full" style={{ background: C.text, marginLeft: -10, top: 0, border: '3px solid #04080F' }}
                    initial={false} animate={{ y: up ? 8 : 60 }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            </div>
            <span className="whitespace-nowrap font-display text-[20px] font-semibold text-white">{reading}</span>
        </div>
    );
};
