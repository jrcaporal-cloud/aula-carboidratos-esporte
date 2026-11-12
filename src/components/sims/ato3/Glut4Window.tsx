import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';

/** Linha do tempo da sensibilidade à insulina depois do treino (MIKINES1988): ~48 h, não 5 dias. 0 → 120 h. */
const AT_48H = 48 / 120;

export const Glut4Window = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="relative h-[64px] w-full">
                <div className="absolute inset-y-0 left-0 overflow-hidden rounded-lg" style={{ width: `${AT_48H * 100}%` }}>
                    <Grow value={1} color={C.insulin} />
                    <motion.span className="absolute inset-0 flex items-center px-4 text-[20px] font-bold text-[#04080F]"
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: DUR.enter, ease: EASE_OUT }}>
                        mais sensível
                    </motion.span>
                </div>
                <div className="absolute inset-y-[22px] right-0 rounded-md border-[3px] border-dashed border-slate-500" style={{ left: `${AT_48H * 100 + 2}%` }} />
            </div>
            <div className="relative h-[26px] w-full text-[18px] text-gray-100">
                <span className="absolute left-0">fim do treino</span>
                <span className="absolute -translate-x-1/2 font-semibold" style={{ left: `${AT_48H * 100}%`, color: C.insulinSoft }}>48 h</span>
                <span className="absolute right-0">5 dias: some (n = 3)</span>
            </div>
            <motion.div className="mt-2 flex flex-col gap-2 text-[19px] leading-snug text-gray-100"
                initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: DUR.enter, ease: EASE_OUT }}>
                <span>Km da insulina: <b style={{ color: C.insulinSoft }}>52 → 40 µU/mL</b> às 48 h</span>
            </motion.div>
        </div>
    );
};
