import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip } from './kit/chips';
import { Frame } from './ato10/Frame';
import { int } from './ato10/units';
import { BANDS, DEFAULT_KG, LINES, OVERLAPS, RULER_MAX, SOURCE, WEIGHTS } from './ato10/guideline.content';

/**
 * Slide 180 · A Régua das Diretrizes. As quatro faixas de g/kg/d entram como uma escada na régua de 0 a 12;
 * depois acendem as zonas em que se cobrem; no fim cada faixa ganha os gramas reais do peso escolhido (cálculo).
 */
const at = (v: number) => `${(v / RULER_MAX) * 100}%`;
const LABEL_W = 260;
const ROW_H = 84;

const WeightPicker = ({ kg, onPick }: { kg: number; onPick: (kg: number) => void }) => (
    <div className="flex items-center gap-2">
        {WEIGHTS.map(w => {
            const active = w === kg;
            return (
                <button key={w} type="button" onClick={() => onPick(w)} aria-pressed={active}
                    className="cursor-pointer rounded-lg border-2 px-2.5 py-1 font-mono text-[17px] tabular-nums transition-colors active:scale-[0.97]"
                    style={{ borderColor: active ? C.glucose : 'rgba(255,255,255,0.2)', color: active ? '#04080F' : C.text, background: active ? C.glucose : 'transparent' }}>
                    {w} kg
                </button>
            );
        })}
    </div>
);

export default function GuidelineRulerSim() {
    const { step } = useSlideSteps(LINES.length);
    const [kg, setKg] = useState(DEFAULT_KG);
    const showOverlap = step >= 1;
    const showGrams = step >= 2;

    return (
        <Frame step={step} line={LINES[step]} chips={showGrams ? <CalcChip>cálculo: g/kg × peso</CalcChip> : undefined} source={SOURCE}>
            <div className="flex h-full flex-col">
                <div className="relative flex flex-1 flex-col justify-center">
                    {BANDS.map((b, i) => (
                        <div key={b.id} className="flex items-center" style={{ height: ROW_H }}>
                            <div className="flex shrink-0 flex-col pr-4" style={{ width: LABEL_W }}>
                                <span className="text-[22px] font-semibold leading-tight text-white">{b.name}</span>
                                <span className="text-[16px] leading-tight text-gray-300">{b.load}</span>
                            </div>
                            <div className="relative z-10 h-full flex-1">
                                <Wipe from="left" delay={stagger(i, 0.1, 0.14)} className="absolute top-[12px] h-[46px]"
                                    style={{ left: at(b.lo), width: `calc(${at(b.hi - b.lo)} - 4px)` }}>
                                    <div className="flex h-full items-center rounded-xl px-3" style={{ background: C.glucose }}>
                                        <span className="font-display text-[22px] font-bold tabular-nums text-[#04080F]">{b.lo}–{b.hi}</span>
                                    </div>
                                </Wipe>
                                {showGrams && (
                                    <motion.span className="absolute top-[60px] z-10 whitespace-nowrap rounded-md px-1.5" style={{ left: at(b.lo), background: '#04080F' }}
                                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i), duration: DUR.enter, ease: EASE_OUT }}>
                                        <CountUp key={kg} text={`${int(b.lo * kg)}–${int(b.hi * kg)} g`} duration={0.6}
                                            className="font-mono text-[18px] font-semibold" style={{ color: C.glucoseSoft }} />
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    ))}
                    {/* zonas de sobreposição: atravessam as linhas da escada */}
                    <div className="pointer-events-none absolute inset-y-0" style={{ left: LABEL_W, right: 0 }}>
                        {OVERLAPS.map(o => (
                            <motion.div key={o.lo} className="absolute inset-y-0 z-0 rounded-lg border-x-2"
                                style={{ left: at(o.lo), width: at(o.hi - o.lo), borderColor: C.stone, background: 'rgba(231,229,228,0.10)' }}
                                initial={false} animate={{ opacity: showOverlap ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                                <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap font-mono text-[16px] font-semibold" style={{ color: C.stone }}>
                                    {o.lo}–{o.hi}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* eixo: g/kg/dia de 0 a 12 */}
                <div className="flex items-start" style={{ height: 52 }}>
                    <div className="shrink-0 pr-4 pt-1" style={{ width: LABEL_W }}>
                        {showGrams ? <WeightPicker kg={kg} onPick={setKg} /> : <span className="text-[16px] text-gray-300">g/kg de peso por dia</span>}
                    </div>
                    <div className="relative h-full flex-1 border-t-2 border-white/40">
                        {Array.from({ length: RULER_MAX + 1 }, (_, v) => (
                            <span key={v} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: at(v) }}>
                                <span className="h-2 w-[2px] bg-white/50" />
                                <span className="font-mono text-[16px] tabular-nums text-gray-200">{v}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Frame>
    );
}
