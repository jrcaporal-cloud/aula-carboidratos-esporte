import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { BODY_STORES, DIETS_1967, G100_TO_MMOL, GRAMS_MAX, NORMAL, RULER_MAX } from './ruler.content';

/**
 * Palco do slide 63: três réguas empilhadas que se acumulam.
 * A · 1967 em g/100 g de músculo úmido, com a escala em mmol/kg úmido contando embaixo (a conta é nossa).
 * B · a régua de hoje (Areta 2018, mmol/kg SECO): normal ± 132; carga e depleção deslizam do normal; +67 do treino.
 * C · o corpo todo em gramas (músculo × fígado). Entre A e B, o aviso: úmido ≠ seco, não convertemos.
 * viewBox = tamanho na tela (1:1).
 */

export const RULER_W = 600;
export const RULER_H = 410;
const X0 = 24;
const X1 = 576;
const sxA = (g: number) => X0 + (g / 5) * (X1 - X0);
const sxB = (v: number) => X0 + (v / RULER_MAX) * (X1 - X0);
const C0 = 250;
const sxC = (g: number) => C0 + (g / GRAMS_MAX) * (X1 - C0);
const BAR_Y = 270;

const Ruler1967 = ({ reduce }: { reduce: boolean }) => (
    <g>
        <SvgText x={X0} y={18} text="1967 · g/100 g de músculo úmido" size={16} weight={700} color={C.caveat} />
        <SvgText x={424} y={18} text="gordura+proteína" size={16} weight={700} anchor="end" color={C.fat} />
        <SvgText x={476} y={18} text="mista" size={16} weight={700} anchor="end" color={C.stone} />
        <SvgText x={X1} y={18} text="carboidrato" size={16} weight={700} anchor="end" color={C.glucose} />
        <rect x={X0} y={53} width={X1 - X0} height={6} rx={3} fill="rgba(255,255,255,0.22)" />
        {[0, 1, 2, 3, 4, 5].map(g => (
            <g key={g}>
                <rect x={sxA(g) - 1.5} y={48} width={3} height={16} fill={C.co2} />
                <SvgText x={sxA(g)} y={42} text={String(g)} size={16} anchor="middle" color={C.stone} />
                <CountSvgText x={sxA(g)} y={84} text={String(Math.round(g * G100_TO_MMOL))} size={16} anchor="middle" color={C.glucoseSoft}
                    delay={reduce ? 0 : 0.5} duration={0.6} />
            </g>
        ))}
        {DIETS_1967.map(d => (
            <polygon key={d.g} points={`${sxA(d.g)},46 ${sxA(d.g) + 9},56 ${sxA(d.g)},66 ${sxA(d.g) - 9},56`} fill={d.color} stroke="#04080F" strokeWidth={2} />
        ))}
        <SvgText x={X0} y={106} text="mmol/kg úmido (÷ 0,162 g/mmol)" size={16} color={C.glucoseSoft} />
        <SvgText x={X1} y={106} text="carboidrato: 3,31 ≈ 204 mmol/kg" size={16} weight={700} anchor="end" color={C.glucose} />
        <rect x={X0} y={118} width={X1 - X0} height={3} fill="rgba(148,163,184,0.5)" />
        <SvgText x={X0} y={142} text="≠  úmido × seco: sem fator confirmado, não convertemos" size={17} weight={700} color={C.stone} />
    </g>
);

interface PinProps { value: number; shown: boolean; top: number; color: string; big: string; sub: string; reduce: boolean }

/** Marcador que nasce no normal e desliza até o seu valor (só transform). */
const Pin = ({ value, shown, top, color, big, sub, reduce }: PinProps) => {
    const x = sxB(value);
    return (
        <motion.g initial={false} animate={{ x: shown ? 0 : sxB(NORMAL.value) - x, opacity: shown ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }}>
            <rect x={x - 2} y={top} width={4} height={BAR_Y + 14 - top} fill={color} />
            <SvgText x={x + 8} y={top + 20} text={big} size={28} weight={700} color={color} />
            <SvgText x={x + 8} y={top + 40} text={sub} size={16} color={C.stone} />
        </motion.g>
    );
};

const RulerToday = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 1;
    const nx = sxB(NORMAL.value);
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
            <rect x={X0} y={BAR_Y} width={X1 - X0} height={14} rx={3} fill="rgba(255,255,255,0.16)" />
            <motion.rect x={sxB(NORMAL.value - NORMAL.sd)} y={BAR_Y} width={sxB(2 * NORMAL.sd) - X0} height={14} fill={C.glycogen} fillOpacity={0.55}
                style={{ originX: 0.5 }} initial={false} animate={{ scaleX: on ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : DUR.bar, delay: on && step === 1 && !reduce ? 0.3 : 0, ease: EASE_OUT }} />
            {Array.from({ length: RULER_MAX / 100 + 1 }, (_, i) => i * 100).map(v => (
                <g key={v}>
                    <rect x={sxB(v) - 1.5} y={BAR_Y + 14} width={3} height={8} fill={C.co2} />
                    <SvgText x={sxB(v)} y={BAR_Y + 40} text={String(v)} size={16} anchor="middle" color={C.stone} />
                </g>
            ))}
            <SvgText x={X0} y={BAR_Y + 62} text="hoje · mmol/kg de músculo seco · vasto lateral" size={16} weight={700} color={C.caveat} />
            <rect x={nx - 2} y={206} width={4} height={BAR_Y + 14 - 206} fill={C.glycogenSoft} />
            <CountSvgText x={nx - 8} y={232} text="462" size={30} weight={700} anchor="end" color={C.glycogenSoft} run={on} />
            <SvgText x={nx - 8} y={252} text="normal ± 132" size={16} anchor="end" color={C.stone} />
            <Pin value={564} shown={step >= 2} top={152} color={C.glucose} big="+102" sub="→ 564 · carga" reduce={reduce} />
            <Pin value={209} shown={step >= 2} top={156} color={C.risk} big="−253" sub="→ 209 · pouco carboidrato" reduce={reduce} />
            <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                <motion.g initial={false} animate={{ clipPath: step >= 3 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                    transition={{ duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT }}>
                    <path d={`M ${nx + 2} 260 H ${sxB(529) - 6}`} stroke={C.stone} strokeWidth={4} />
                    <polygon points={`${sxB(529)},260 ${sxB(529) - 10},254 ${sxB(529) - 10},266`} fill={C.stone} />
                </motion.g>
                <SvgText x={(nx + sxB(529)) / 2} y={250} text="+67" size={18} weight={700} anchor="middle" color={C.stone} />
            </motion.g>
        </motion.g>
    );
};

const Body = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 4;
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
            <SvgText x={X0} y={354} text="corpo todo, em gramas · estimativas de revisão" size={16} weight={700} color={C.caveat} />
            {BODY_STORES.map((s, i) => {
                const y = 364 + i * 24;
                return (
                    <g key={s.name}>
                        <SvgText x={X0} y={y + 14} text={`${s.name} ~${s.grams} g · ${s.range[0]}–${s.range[1]}`} size={16} weight={700} color={s.color === C.glycogen ? C.glycogenSoft : s.color} />
                        <rect x={sxC(s.range[0])} y={y + 6} width={sxC(s.range[1]) - sxC(s.range[0])} height={4} fill={C.co2} />
                        <motion.rect x={C0} y={y} width={sxC(s.grams) - C0} height={16} rx={3} fill={s.color} style={{ originX: 0 }}
                            initial={false} animate={{ scaleX: on ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.bar, delay: on && !reduce ? 0.2 + i * 0.12 : 0, ease: EASE_OUT }} />
                    </g>
                );
            })}
        </motion.g>
    );
};

export const RulerTrack = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${RULER_W} ${RULER_H}`} width={RULER_W} height={RULER_H} className="block" role="img"
            aria-label="Régua de 1967 em g/100 g de músculo úmido; régua atual em mmol/kg de músculo seco com normal 462, carga +102, depleção −253 e +67 por 10 mL/kg/min de VO₂máx; estoques do corpo, músculo 500 g e fígado 80 g">
            <g transform="translate(0 4)">
                <Ruler1967 reduce={reduce} />
                <RulerToday step={step} reduce={reduce} />
                <Body step={step} reduce={reduce} />
            </g>
        </svg>
    );
};
