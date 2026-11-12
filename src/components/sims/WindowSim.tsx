import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Source } from './kit/ui';
import { Grow } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { HeadRow, Phrase } from './ato7/parts';
import {
    BAR_H, BLOCKS, DESIGN, LANES, NEAR_ONLY, PHRASES, PINS, RATE_MAX, SOURCE, TICKS, TRACK_W, type LaneId,
} from './ato7/window.content';

/**
 * Slide 120 · A janela que fecha devagar.
 * Faixas de taxa (Ivy 1988) numa régua de 4 h; no passo 4 a régua "abre" para 24 h e as primeiras horas
 * viram uma fresta à esquerda, com os pinos do Parkin 1997 (igual às 8 e às 24 h).
 */
const LABEL_W = 200;
const LANE_H = BAR_H + 40;
const NEAR = 4;
const FAR = 24;

interface LaneProps {
    id: LaneId;
    step: number;
    far: boolean;
    x: (t: number) => number;
}

const Lane = ({ id, step, far, x }: LaneProps) => {
    const reduce = useReducedMotion();
    const lane = LANES.find(l => l.id === id);
    const blocks = BLOCKS.filter(b => b.lane === id);
    const move = { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT };
    const unit = TRACK_W / NEAR;
    return (
        <div className="flex items-end gap-4">
            <div className="flex flex-col gap-1 pb-2" style={{ width: LABEL_W }}>
                <span className="text-[24px] font-semibold text-white">{lane?.name}</span>
                <span className="text-[16px] text-gray-300">{far ? lane?.meals : lane?.dose}</span>
            </div>
            <div className="relative overflow-hidden" style={{ width: TRACK_W, height: LANE_H }}>
                {/* camada que encolhe: o que está em horas (faixas, janela) */}
                <motion.div className="absolute inset-0" style={{ transformOrigin: 'left center' }}
                    animate={{ scaleX: far ? NEAR / FAR : 1 }} transition={move}>
                    <div className="absolute bottom-0 left-0 rounded-lg" style={{ width: 2 * unit, height: BAR_H, background: 'rgba(255,255,255,0.07)' }} />
                    {blocks.map(b => (
                        <div key={`${b.from}`} className="absolute bottom-0 overflow-hidden rounded-t-lg"
                            style={{ left: b.from * unit + 6, width: (b.to - b.from) * unit - 12, height: BAR_H }}>
                            <Grow axis="y" value={step >= b.showAt ? b.rate / RATE_MAX : 0} color={C.glycogen} />
                        </div>
                    ))}
                    {id === 'now' && (
                        <motion.div className="absolute bottom-0 rounded-t-lg border-2 border-dashed"
                            style={{ left: 2 * unit + 6, width: 2 * unit - 12, height: BAR_H * 0.5, borderColor: 'rgba(203,213,225,0.45)' }}
                            animate={{ opacity: step >= 1 && !far ? 1 : 0 }} transition={{ duration: DUR.text }} />
                    )}
                </motion.div>
                {/* rótulos fora da camada: andam com a régua sem achatar */}
                {blocks.map(b => (
                    <motion.div key={`n${b.from}`} className="absolute left-0 w-0" style={{ bottom: (BAR_H * b.rate) / RATE_MAX + 6 }}
                        animate={{ x: x((b.from + b.to) / 2), opacity: step >= b.showAt && !far ? 1 : 0 }}
                        transition={{ x: move, opacity: { duration: DUR.text, delay: step >= b.showAt ? 0.25 : 0 } }}>
                        <span className="block -translate-x-1/2 font-display text-[40px] font-bold leading-none tabular-nums"
                            style={{ color: b.rate === RATE_MAX ? C.glycogenSoft : C.text }}>{b.label}</span>
                    </motion.div>
                ))}
                {id === 'now' && (
                    <motion.span className="absolute bottom-3 text-[16px] text-gray-300" style={{ left: 2 * unit + 24 }}
                        animate={{ opacity: step >= 1 && !far ? 1 : 0 }} transition={{ duration: DUR.text }}>
                        2–4 h: não mostrado no resumo
                    </motion.span>
                )}
                {id === 'late' && (
                    <motion.span className="absolute rounded-md px-2 py-0.5 text-[18px] font-semibold"
                        style={{ left: 2 * unit + 24, bottom: (BAR_H * 4.1) / RATE_MAX + 12, color: '#04080F', background: C.stone }}
                        initial={false} animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? 0 : 6 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT, delay: step === 2 ? 0.5 : 0 }}>
                        45% mais lenta
                    </motion.span>
                )}
                {/* a dose: onde o carboidrato entra */}
                <motion.div className="absolute left-0 top-1 w-0" animate={{ x: x(lane?.doseAt ?? 0) }} transition={move}>
                    <span className="block w-max whitespace-nowrap rounded-md px-2 py-0.5 text-[16px] font-bold"
                        style={{ background: C.glucose, color: '#04080F', transform: lane?.doseAt ? 'translateX(-50%)' : 'none' }}>
                        CHO
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default function WindowSim() {
    const { step } = useSlideSteps(PHRASES.length);
    const reduce = useReducedMotion();
    const far = step >= 3;
    const tMax = far ? FAR : NEAR;
    const x = (t: number) => (t / tMax) * TRACK_W;
    const move = { duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT };

    return (
        <div className="not-prose flex flex-col gap-3">
            <HeadRow chips={<DesignChip>{DESIGN[step]}</DesignChip>}>
                <Phrase beat={step}>{PHRASES[step]}</Phrase>
            </HeadRow>

            <div className="relative flex flex-col gap-3">
                {/* faixa de cima: "primeiras 2 h" e os pinos de 8 e 24 h */}
                <div className="relative h-8" style={{ marginLeft: LABEL_W + 16, width: TRACK_W, clipPath: "inset(0)", overflow: "clip" }}>
                    <motion.span className="absolute left-0 top-0 text-[18px] font-semibold" style={{ color: C.caveat }}
                        animate={{ opacity: far ? 0 : 1 }} transition={{ duration: DUR.text }}>
                        primeiras 2 h
                    </motion.span>
                    {PINS.map(t => (
                        <motion.div key={t} className="absolute left-0 top-0 w-0" animate={{ x: far ? x(t) : TRACK_W / 2, opacity: far ? 1 : 0 }}
                            transition={{ x: move, opacity: { duration: DUR.text, delay: far ? 0.6 : 0 } }}>
                            <span className="block w-max whitespace-nowrap rounded-md px-2 text-[18px] font-bold"
                                style={{ background: C.stone, color: '#04080F', transform: t === FAR ? 'translateX(-100%)' : 'translateX(-50%)' }}>
                                {t} h: igual
                            </span>
                        </motion.div>
                    ))}
                </div>
                <Lane id="now" step={step} far={far} x={x} />
                <Lane id="late" step={step} far={far} x={x} />
                {/* linhas dos pinos, atravessando as duas faixas */}
                {PINS.map(t => (
                    <motion.div key={`l${t}`} aria-hidden className="absolute top-8 w-0" style={{ left: LABEL_W + 16, height: 2 * LANE_H + 12 }}
                        animate={{ x: Math.min(x(t), TRACK_W - 3), opacity: far ? 1 : 0 }}
                        transition={{ x: move, opacity: { duration: DUR.text, delay: far ? 0.6 : 0 } }}>
                        <span className="block h-full w-[3px]" style={{ background: C.stone }} />
                    </motion.div>
                ))}
            </div>

            {/* régua do tempo: as marcas deslizam quando ela abre de 4 para 24 h */}
            <div className="flex items-start gap-4">
                <span className="text-[16px] leading-tight text-gray-300" style={{ width: LABEL_W }}>
                    barras: µmol/g/h<br />eixo: horas após o exercício
                </span>
                <div className="relative h-11 border-t-2 border-white/40" style={{ width: TRACK_W, clipPath: "inset(0)", overflow: "clip" }}>
                    {TICKS.map(t => (
                        <motion.div key={t} className="absolute left-0 top-0 w-0"
                            animate={{ x: t > tMax ? TRACK_W - 40 : x(t), opacity: t > tMax || (far && NEAR_ONLY.includes(t)) ? 0 : 1 }}
                            transition={{ x: move, opacity: { duration: DUR.text } }}>
                            <span className="block h-2 w-[2px] bg-white/60" />
                            <span className="block w-max whitespace-nowrap pt-1 text-[18px] tabular-nums text-gray-200"
                                style={{ transform: t === 0 ? 'none' : t === tMax ? 'translateX(-100%)' : 'translateX(-50%)' }}>
                                {t} h
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
