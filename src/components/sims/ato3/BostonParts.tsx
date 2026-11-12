import { motion, useReducedMotion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { HISTORY, ROUTE_MARKS } from './boston.content';

/** Peças do slide 48: o percurso da maratona, a régua da glicemia e a linha do tempo 1923 → 1939 → 1987. */
const TRACK_W = 1000;
const KM = 42.195;

export const Route = () => {
    const reduce = useReducedMotion();
    return (
        <div className="relative h-[120px]" style={{ width: TRACK_W + 40 }}>
            <div className="absolute left-0 top-[40px] h-[6px] rounded-full bg-slate-500" style={{ width: TRACK_W }} />
            {ROUTE_MARKS.map(km => (
                <div key={km} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: (km / KM) * TRACK_W, top: 30 }}>
                    <span className="h-[26px] w-[4px] bg-slate-400" />
                    <span className="mt-2 whitespace-nowrap text-[18px] text-gray-100">{km === KM ? '42 km' : br(km, 0)}</span>
                </div>
            ))}
            <Flag size={34} strokeWidth={2.5} className="absolute" style={{ left: TRACK_W - 4, top: -4, color: C.text }} aria-hidden />
            <motion.span aria-hidden className="absolute h-[30px] w-[30px] rounded-full" style={{ left: -15, top: 28, background: C.glucose }}
                initial={reduce ? false : { x: 0 }} animate={{ x: TRACK_W }} transition={{ delay: 0.2, duration: 1, ease: EASE_IN_OUT }} />
        </div>
    );
};

/** Régua de 0 a 8 mmol/L; a faixa abaixo de 4 acende em vermelho. */
const SCALE_W = 760;
const MAX = 8;

export const GlucoseScale = () => {
    const reduce = useReducedMotion();
    return (
        <div className="relative h-[120px]" style={{ width: SCALE_W }}>
            <div className="absolute left-0 top-[30px] h-[40px] w-full rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <motion.div className="absolute left-0 top-[30px] h-[40px] rounded-lg" style={{ width: (4 / MAX) * SCALE_W, background: C.risk, transformOrigin: 'left center' }}
                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: DUR.bar, ease: EASE_OUT }} />
            <span className="absolute top-[36px] px-4 text-[20px] font-bold text-white">hipoglicemia</span>
            {[0, 2, 4, 6, 8].map(v => (
                <span key={v} className="absolute -translate-x-1/2 text-[18px] text-gray-100" style={{ left: (v / MAX) * SCALE_W, top: 80 }}>{v}</span>
            ))}
            <span className="absolute right-0 top-0 text-[17px] text-gray-300">mmol/L</span>
        </div>
    );
};

export const History = () => {
    const reduce = useReducedMotion();
    return (
        <div className="relative h-[300px] w-full">
            <div className="absolute left-[20px] right-[40px] top-[124px] h-[6px] rounded-full bg-slate-500" />
            {HISTORY.map((h, i) => (
                <motion.div key={h.year} className="absolute flex w-[340px] flex-col gap-1" style={{ left: i * 392, top: 0 }}
                    initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger(i, 0.1, 0.18), duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="font-display text-[96px] font-bold leading-[0.9]" style={{ color: i === 0 ? C.glucose : C.text }}>{h.year}</span>
                    <span className="mt-[16px] h-[34px] w-[34px] rounded-full border-[5px]" style={{ borderColor: i === 0 ? C.glucose : C.text, background: '#04080F' }} />
                    <span className="mt-3 text-[28px] font-bold text-white">{h.place}</span>
                    <span className="text-[22px] leading-snug text-gray-200">{h.what}</span>
                </motion.div>
            ))}
        </div>
    );
};
