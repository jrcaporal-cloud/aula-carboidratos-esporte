import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';

/**
 * Torneira (fígado) → copo (sangue, ~4 g) → ralo (músculo). 600 × 340.
 * Jatos por scaleX, nível por scaleY, manopla por rotate: tudo por transform.
 */
const W = 600;
const H = 340;
const CUP = { x: 210, y: 150, w: 150, h: 150 };
const STREAM_X = CUP.x + CUP.w / 2;
const MAX_STREAM = 52;

interface TapProps { tap: number; drain: number; level: number; handle: number }

export const LiverTap = ({ tap, drain, level, handle }: TapProps) => {
    const reduce = useReducedMotion();
    const t = { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT };
    const high = level > 0.6;
    return (
        <div className="relative shrink-0" style={{ width: W, height: H }}>
            {/* fígado e o cano da torneira */}
            <div className="absolute flex items-center justify-center rounded-[24px] border-[3px] text-[22px] font-bold text-white"
                style={{ left: 0, top: 18, width: 170, height: 76, borderColor: C.glycogen, background: '#0B1220' }}>fígado</div>
            <div className="absolute rounded-r-md" style={{ left: 170, top: 46, width: STREAM_X - 170 + 16, height: 22, background: '#64748B' }} />
            <div className="absolute rounded-b-md" style={{ left: STREAM_X - 16, top: 46, width: 32, height: 52, background: '#64748B' }} />
            <motion.div className="absolute h-[10px] w-[64px] rounded-full bg-slate-300" style={{ left: STREAM_X - 50, top: 26, transformOrigin: '100% 50%' }}
                initial={false} animate={{ rotate: -handle }} transition={t} />

            {/* jato do fígado */}
            <motion.div className="absolute" style={{ left: STREAM_X - MAX_STREAM / 2, top: 98, width: MAX_STREAM, height: CUP.y - 98 + CUP.h * 0.2, background: C.glucose }}
                initial={false} animate={{ scaleX: tap }} transition={t} />

            {/* copo = sangue */}
            <div className="absolute overflow-hidden rounded-b-2xl border-[4px] border-t-0" style={{ left: CUP.x, top: CUP.y, width: CUP.w, height: CUP.h, borderColor: '#E5E7EB' }}>
                <motion.div className="absolute inset-0" style={{ background: C.glucose, transformOrigin: 'center bottom' }}
                    initial={false} animate={{ scaleY: level }} transition={t} />
                <div className="absolute inset-x-0 border-t-[3px] border-dashed border-[#04080F]" style={{ top: CUP.h * 0.5 - 4 }} />
            </div>
            <span className="absolute text-[20px] font-bold text-white" style={{ left: CUP.x + CUP.w + 14, top: CUP.y + CUP.h * 0.5 - 18 }}>~4 g</span>
            <span className="absolute text-[18px] text-gray-300" style={{ left: CUP.x, top: CUP.y + CUP.h + 8 }}>sangue</span>
            <motion.span className="absolute text-[19px] font-bold" style={{ left: CUP.x + CUP.w + 14, top: CUP.y - 6, color: C.glucoseSoft }}
                initial={false} animate={{ opacity: high ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: high ? 0.6 : 0 }}>
                glicemia sobe
            </motion.span>

            {/* ralo → músculo */}
            <motion.div className="absolute" style={{ left: CUP.x + CUP.w - 30, top: CUP.y + CUP.h, width: 20, height: 34, background: C.glucose, transformOrigin: 'center top' }}
                initial={false} animate={{ scaleX: 0.4 + drain }} transition={t} />
            <motion.div className="absolute" style={{ left: CUP.x + CUP.w - 30, top: CUP.y + CUP.h + 22, width: 440 - (CUP.x + CUP.w - 30), height: 16, background: C.glucose, transformOrigin: 'center center' }}
                initial={false} animate={{ scaleY: 0.4 + drain }} transition={t} />
            <div className="absolute flex items-center justify-center rounded-[24px] border-[3px] text-[22px] font-bold text-white"
                style={{ left: 440, top: CUP.y + CUP.h - 10, width: 160, height: 76, borderColor: C.stone, background: '#0B1220' }}>músculo</div>
        </div>
    );
};
