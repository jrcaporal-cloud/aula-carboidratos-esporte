import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { br } from '../../sims/kit/format';
import { DUR, EASE_OUT } from '../../../lib/motion';

/*
 * Placar da oxidação exógena (pico, g/min) nas etapas do teto e das duas pistas. Barras chapadas
 * numa régua de 0 a 2 g/min, com a linha do teto de ~1 g/min. Só números medidos (dossiês 01 e 03).
 */

interface Bar { label: string; value: number; text: string; color: string }
interface Board { title: string; bars: readonly Bar[]; note?: string }

const SCALE = 2;
const GLC = 'só glicose';

const BOARDS: Readonly<Record<number, Board>> = {
    3: { title: 'oxidação exógena · g/min', bars: [{ label: GLC, value: 1.05, text: '~1,0–1,1', color: C.glucose }] },
    4: { title: 'oxidação exógena · g/min', bars: [{ label: GLC, value: 1.05, text: '~1,0–1,1', color: C.glucose }], note: 'GLUT2 apical: não se sustentou' },
    5: {
        title: 'pico de oxidação exógena · g/min',
        bars: [
            { label: `${GLC} (1,2 ou 1,8)`, value: 0.83, text: '0,80–0,83', color: C.glucose },
            { label: 'glicose 1,2 + frutose 0,6', value: 1.26, text: br(1.26, 2), color: C.fructose },
        ],
    },
    6: {
        title: 'pico de oxidação exógena · g/min',
        bars: [
            { label: `${GLC} (1,2)`, value: 1.06, text: br(1.06, 2), color: C.glucose },
            { label: '1:1 · 144 g/h', value: 1.75, text: br(1.75, 2), color: C.fructose },
        ],
    },
};

const W = 330;

export const EnteroHud = ({ step }: { step: number }) => {
    const board = BOARDS[step];
    if (!board) return null;
    return (
        <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}
            className="rounded-xl bg-[rgba(4,10,20,0.92)] px-4 py-3" style={{ width: W + 32 }}
        >
            <p className="mb-2 text-[14px] font-mono uppercase tracking-wider text-gray-400">{board.title}</p>
            <div className="space-y-2.5">
                {board.bars.map((b, i) => (
                    <div key={b.label}>
                        <div className="mb-1 text-[16px] text-gray-200">{b.label}</div>
                        <div className="flex items-center gap-3">
                            <div className="relative h-7 shrink-0" style={{ width: W * 0.86 }}>
                                <motion.div
                                    className="absolute left-0 top-0.5 h-6 origin-left rounded-[4px]" style={{ width: (b.value / SCALE) * W * 0.86, background: b.color }}
                                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, ease: EASE_OUT, delay: 0.15 + i * 0.12 }}
                                />
                                {/* teto de ~1 g/min */}
                                <div className="absolute top-0 bottom-0 w-[3px] bg-white" style={{ left: (1 / SCALE) * W * 0.86 - 1 }} aria-hidden />
                            </div>
                            <span className="text-[22px] font-semibold tabular-nums text-white" style={{ fontFamily: 'var(--font-display)' }}>{b.text}</span>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-[14px] text-gray-400">linha branca: teto de ~1 g/min com uma só fonte</p>
            {board.note && <p className="mt-1.5 text-[16px] font-semibold" style={{ color: C.risk }}>✕ {board.note}</p>}
        </motion.div>
    );
};
