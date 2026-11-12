import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { Beat } from './kit/Beat';
import { BigStat } from './kit/Stamp';
import { CalcChip } from './kit/chips';
import { Source } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { FAT_G_EQUIV, SOURCE, STEPS, ZOOM_OUT, side } from './ato2/stores.content';

/**
 * Slide 24 · Quanto Cabe no Corpo. Quadrados com área proporcional: 4 g → ~100 g → ~400–500 g.
 * No fim a câmera se afasta (escala) e a gordura entra ao lado, para dar a ordem de grandeza.
 */
const BASE = 40; // margem esquerda do palco
const FLOOR = 44; // distância do chão até a base dos quadrados

interface Square { id: string; grams: number; x: number; from: number; color: string; dashed?: boolean }

const SQUARES: readonly Square[] = [
    { id: 'blood', grams: 4, x: BASE, from: 0, color: C.glucose },
    { id: 'liver', grams: 100, x: BASE + 72, from: 1, color: C.glycogen },
    { id: 'muscle-max', grams: 500, x: BASE + 240, from: 2, color: C.glycogenSoft, dashed: true },
    { id: 'muscle', grams: 400, x: BASE + 240, from: 2, color: C.glycogen },
];

const NAMES = [
    { text: 'sangue', x: BASE - 10, from: 0 },
    { text: 'fígado', x: BASE + 90, from: 1 },
    { text: 'músculo', x: BASE + 330, from: 2 },
] as const;

export default function StoresSim() {
    const { step } = useSlideSteps(STEPS.length);
    const reduce = useReducedMotion();
    const s = STEPS[step];
    const z = s.zoom;
    const zoomed = z < 1;
    const move = { duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT };

    return (
        <div className="not-prose flex flex-col gap-4" style={BODY_FONT}>
            <div className="grid grid-cols-[620px_1fr] gap-8 rounded-2xl p-5" style={PANEL_BG}>
                <div className="relative h-[370px] overflow-hidden">
                    <div className="absolute inset-x-0 h-[3px] bg-slate-500" style={{ bottom: FLOOR - 3 }} aria-hidden />
                    {SQUARES.map(q => {
                        const on = step >= q.from && !(q.dashed && zoomed);
                        const w = side(q.grams);
                        return (
                            <motion.div key={q.id} className="absolute left-0 rounded-[3px]"
                                style={{
                                    bottom: FLOOR, width: w, height: w, transformOrigin: 'left bottom',
                                    background: q.dashed ? 'transparent' : q.color,
                                    border: q.dashed ? `3px dashed ${q.color}` : 'none',
                                }}
                                initial={{ x: q.x, scale: 0.9, opacity: 0 }}
                                animate={{ x: BASE + (q.x - BASE) * z, scale: on ? z : z * 0.9, opacity: on ? 1 : 0 }}
                                transition={{ ...move, opacity: { duration: DUR.enter, ease: EASE_OUT } }} />
                        );
                    })}
                    <motion.div className="absolute left-0 rounded-[3px]"
                        style={{ bottom: FLOOR, width: side(FAT_G_EQUIV), height: side(FAT_G_EQUIV), transformOrigin: 'left bottom', background: C.fat }}
                        initial={{ x: 230, scale: ZOOM_OUT * 0.9, opacity: 0 }}
                        animate={{ x: 230, scale: zoomed ? ZOOM_OUT : ZOOM_OUT * 0.9, opacity: zoomed ? 1 : 0 }}
                        transition={{ delay: zoomed ? 0.5 : 0, duration: DUR.morph, ease: EASE_OUT }} />

                    {NAMES.map(n => (
                        <motion.span key={n.text} className="absolute bottom-0 text-[18px] text-gray-200" style={{ left: n.x }}
                            animate={{ opacity: step >= n.from && !zoomed ? 1 : 0 }} transition={{ duration: DUR.text }}>
                            {n.text}
                        </motion.span>
                    ))}
                    <motion.span className="absolute bottom-0 left-[20px] text-[18px] text-gray-200"
                        animate={{ opacity: zoomed ? 1 : 0 }} transition={{ delay: zoomed ? 0.6 : 0, duration: DUR.text }}>
                        carboidrato
                    </motion.span>
                    <motion.span className="absolute bottom-0 left-[310px] text-[18px] text-gray-200"
                        animate={{ opacity: zoomed ? 1 : 0 }} transition={{ delay: zoomed ? 0.6 : 0, duration: DUR.text }}>
                        gordura (só para escala)
                    </motion.span>
                    {step === 2 && (
                        <motion.span className="absolute right-0 top-2 text-[16px] text-gray-300"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            tracejado = 500 g
                        </motion.span>
                    )}
                </div>

                <div className="flex flex-col justify-center gap-5">
                    {zoomed && (
                        <motion.span className="self-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: DUR.enter }}>
                            <CalcChip>cálculo: 4 e 9 kcal/g; 70 kg, 15% de gordura</CalcChip>
                        </motion.span>
                    )}
                    <Beat beat={step}>
                        <BigStat value={s.value} caption={s.caption} size={zoomed ? 96 : s.value.length > 6 ? 64 : 84}
                            color={step === 0 ? C.glucose : zoomed ? C.fat : C.glycogenSoft} />
                    </Beat>
                    {zoomed && (
                        <motion.div className="flex flex-col items-start gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: DUR.enter }}>
                            <span className="text-[20px] leading-snug text-gray-200">carboidrato ≈ 2.000–2.400 kcal<br />gordura ≈ 94.500 kcal</span>
                        </motion.div>
                    )}
                </div>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
