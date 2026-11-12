import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';

/** Os dois cenários do slide 166: termômetro e altímetro, chapados, com uma única coisa que se mexe em cada um. */

interface InstrumentProps {
    active: boolean;
    /** Texto grande embaixo (ex.: "35 °C", "4.300 m"). */
    reading: string;
}

const frame = (active: boolean) => ({ opacity: active ? 1 : 0.6, transition: 'opacity 300ms' });

/** Termômetro: a coluna sobe por scaleY (Grow); `level` 0 → 1. */
export const Thermometer = ({ level, active, reading }: InstrumentProps & { level: number }) => (
    <div className="flex w-[130px] flex-col items-center gap-3" style={frame(active)} role="img" aria-label={`termômetro em ${reading}`}>
        <span className="text-[18px] text-gray-300">calor</span>
        <div className="relative h-[200px] w-[36px] overflow-hidden rounded-t-full" style={{ background: 'rgba(255,255,255,0.1)', border: '3px solid #64748B' }}>
            <Grow value={level} axis="y" color={C.risk} />
        </div>
        <span className="-mt-4 block h-[58px] w-[58px] rounded-full" style={{ background: C.risk, border: '3px solid #64748B' }} />
        <span className="whitespace-nowrap font-display text-[26px] font-semibold text-white">{reading}</span>
    </div>
);

/** Altímetro: um marcador sobe a encosta da montanha (translateY). */
export const Altimeter = ({ up, active, reading }: InstrumentProps & { up: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex w-[150px] flex-col items-center gap-3" style={frame(active)} role="img" aria-label={`altímetro em ${reading}`}>
            <span className="text-[18px] text-gray-300">altitude</span>
            <div className="relative h-[260px] w-[150px]">
                <svg viewBox="0 0 150 260" width={150} height={260} aria-hidden className="absolute inset-0">
                    <polygon points="0,260 75,30 150,260" fill="#334155" />
                    <polygon points="56,100 75,30 94,100 85,92 75,104 65,92" fill={C.caveat} />
                </svg>
                <motion.span className="absolute left-1/2 block h-[26px] w-[26px] rounded-full" style={{ background: C.text, marginLeft: -13, top: 0, border: '3px solid #04080F' }}
                    initial={false} animate={{ y: up ? 34 : 228 }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            </div>
            <span className="whitespace-nowrap font-display text-[26px] font-semibold text-white">{reading}</span>
        </div>
    );
};
