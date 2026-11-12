import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';

/**
 * A porta da mitocôndria (CPT-I) com carnitina, gordura e acetil-CoA (600 × 330).
 * Baixa intensidade: carnitina livre, 3 de 4 AGL entram. Alta: a PDH enche de acetil-CoA, 4 de 6 carnitinas
 * ficam presas como acetilcarnitina e só 1 AGL passa.
 */
const W = 600;
const H = 330;
const WALL_X = 292;
const DOOR = { top: 132, bottom: 198 };
const DOOR_MID = (DOOR.top + DOOR.bottom) / 2;
const FAT_QUEUE = [24, 86, 148, 210] as const;
const FAT_INSIDE = [{ x: 350, y: 250 }, { x: 420, y: 250 }, { x: 490, y: 250 }] as const;
const CARN_FREE = [{ x: 140, y: 214 }, { x: 186, y: 214 }, { x: 232, y: 214 }, { x: 140, y: 258 }, { x: 186, y: 258 }, { x: 232, y: 258 }] as const;
const AC_SLOTS = [{ x: 352, y: 36 }, { x: 420, y: 36 }, { x: 488, y: 36 }, { x: 352, y: 80 }, { x: 420, y: 80 }, { x: 488, y: 80 }] as const;
const MOVE = { duration: DUR.draw, ease: EASE_IN_OUT };

export const FatBrakeDiagram = ({ high }: { high: boolean }) => {
    const reduce = useReducedMotion();
    const t = reduce ? { duration: 0 } : MOVE;
    const passing = high ? 1 : 3;
    const bound = high ? 4 : 0;
    const acetyl = high ? 6 : 2;
    return (
        <div className="relative shrink-0" style={{ width: W, height: H }}>
            <span className="absolute left-0 top-0 text-[18px] text-gray-300">citosol</span>
            <span className="absolute right-0 text-[18px] text-gray-300" style={{ top: DOOR_MID + 30 }}>mitocôndria</span>
            {/* membrana com a porta CPT-I: a porta é o centro da cena (lima = aberta à gordura; neutra = travada) */}
            <div className="absolute w-[22px] rounded-md bg-slate-600" style={{ left: WALL_X, top: 28, height: DOOR.top - 36 }} />
            <div className="absolute w-[22px] rounded-md bg-slate-600" style={{ left: WALL_X, top: DOOR.bottom + 8, height: H - DOOR.bottom - 8 }} />
            <div className="absolute rounded-xl border-[4px] transition-colors duration-500"
                style={{ left: WALL_X - 14, top: DOOR.top - 8, width: 50, height: DOOR.bottom - DOOR.top + 16, borderColor: high ? C.stone : C.fat }} />
            <span className="absolute font-display text-[22px] font-bold transition-colors duration-500"
                style={{ left: WALL_X + 46, top: DOOR_MID - 16, color: high ? C.stone : C.fat }}>CPT-I</span>

            <span className="absolute text-[18px] font-semibold" style={{ left: 352, top: 4, color: C.glucoseSoft }}>acetil-CoA da PDH</span>
            {AC_SLOTS.map((p, i) => (
                <motion.span key={`ac${i}`} aria-hidden className="absolute flex h-[34px] w-[34px] items-center justify-center rounded-md text-[16px] font-bold text-[#04080F]"
                    style={{ left: p.x, top: p.y, background: C.glucose }}
                    initial={false} animate={{ opacity: i < acetyl ? 1 : 0, scale: i < acetyl ? 1 : 0.9 }} transition={{ ...t, delay: reduce ? 0 : i * 0.05 }}>
                    Ac
                </motion.span>
            ))}

            <span className="absolute text-[18px] font-semibold text-white" style={{ left: 120, top: 300 }}>carnitina livre</span>
            {CARN_FREE.map((p, i) => {
                const isBound = i < bound;
                const slot = AC_SLOTS[i];
                const via = { x: WALL_X - 4 - p.x, y: DOOR_MID - 15 - p.y };
                const to = isBound ? { x: [0, via.x, slot.x + 36 - p.x], y: [0, via.y, slot.y + 3 - p.y] } : { x: 0, y: 0 };
                return (
                    <motion.span key={`c${i}`} aria-hidden className="absolute flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[16px] font-bold text-[#04080F]"
                        style={{ left: p.x, top: p.y }} initial={false} animate={to} transition={{ ...t, delay: reduce ? 0 : 0.25 + i * 0.06 }}>
                        C
                    </motion.span>
                );
            })}

            <span className="absolute text-[18px] font-semibold" style={{ left: 36, top: 114, color: C.fat }}>gordura (AGL)</span>
            {FAT_QUEUE.map((x, i) => {
                // a pílula mais perto da porta (a última da fila) entra primeiro
                const order = FAT_QUEUE.length - 1 - i;
                const goes = order < passing;
                const dest = FAT_INSIDE[order] ?? FAT_INSIDE[0];
                const to = goes ? { x: [0, WALL_X - 18 - x, dest.x - x], y: [0, DOOR_MID - 15 - 150, dest.y - 150] } : { x: 0, y: 0 };
                return (
                    <motion.span key={`f${x}`} aria-hidden className="absolute flex h-[30px] w-[58px] items-center justify-center rounded-full text-[16px] font-bold text-[#04080F]"
                        style={{ left: x, top: 150, background: C.fat }} initial={false} animate={to} transition={{ ...t, delay: reduce ? 0 : order * 0.08 }}>
                        AGL
                    </motion.span>
                );
            })}
            <span className="absolute text-[18px] font-semibold" style={{ left: 350, top: 290, color: C.fat }}>β-oxidação</span>
        </div>
    );
};
