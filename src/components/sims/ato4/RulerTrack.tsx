import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { NORMAL, READINGS, RULER_MAX, type Reading } from './ruler.content';

/**
 * Palco do slide 63: UMA régua (Areta 2018, mmol/kg de músculo SECO, vasto lateral). O normal 462 ± 132 fica como
 * referência; a cada passo um marcador nasce no normal e desliza até o novo estado (carga → depleção → treino) e fica,
 * esmaecido, quando o passo seguinte chega. Embaixo, a nota: 1967 é outra régua (úmido), não convertida.
 * viewBox = tamanho na tela (1:1).
 */

export const RULER_W = 600;
export const RULER_H = 410;
const X0 = 24;
const X1 = 576;
const sx = (v: number) => X0 + (v / RULER_MAX) * (X1 - X0);
const BAR_Y = 266;
const BAR_H = 16;
const EMPTY = 250;

interface PinProps { r: Reading; step: number; reduce: boolean }

/** Marcador que nasce no normal e desliza até o seu valor (só transform); esmaece quando deixa de ser o passo atual. */
const Pin = ({ r, step, reduce }: PinProps) => {
    const x = sx(r.value);
    const shown = step >= r.at;
    const current = step === r.at;
    const tx = r.side === 'right' ? x + 8 : x - 8;
    const anchor = r.side === 'right' ? 'start' : 'end';
    return (
        <motion.g initial={false} animate={{ x: shown ? 0 : sx(NORMAL.value) - x, opacity: shown ? (current ? 1 : 0.6) : 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE_IN_OUT }}>
            <rect x={x - 2} y={r.top} width={4} height={BAR_Y + BAR_H - r.top} fill={r.color} />
            <SvgText x={tx} y={r.top + 22} text={r.delta} size={28} weight={700} anchor={anchor} color={r.color} />
            <SvgText x={tx} y={r.top + 44} text={`→ ${r.value} · ${r.name}`} size={16} weight={600} anchor={anchor} color="#E5E7EB" />
        </motion.g>
    );
};

export const RulerTrack = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const nx = sx(NORMAL.value);
    const lo = sx(NORMAL.value - NORMAL.sd);
    const hi = sx(NORMAL.value + NORMAL.sd);
    return (
        <svg viewBox={`0 0 ${RULER_W} ${RULER_H}`} width={RULER_W} height={RULER_H} className="block" role="img"
            aria-label="Régua do glicogênio do vasto lateral em mmol/kg de músculo seco: normal 462 ± 132; carga +102 até 564; pouco carboidrato −253 até 209; +10 mL/kg/min de VO₂máx, +67 até 529">
            <SvgText x={X0} y={26} text="glicogênio do vasto lateral · mmol/kg de músculo seco" size={17} weight={700} color="#F3F4F6" />

            {/* Zona do músculo esvaziado (< 250): acende no passo da depleção */}
            <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
                <rect x={X0} y={BAR_Y - 6} width={sx(EMPTY) - X0} height={BAR_H + 12} rx={4} fill="none" stroke={C.risk} strokeWidth={2} strokeDasharray="6 5" />
            </motion.g>

            {/* Régua e faixa normal (± 132 entre pessoas) */}
            <rect x={X0} y={BAR_Y} width={X1 - X0} height={BAR_H} rx={3} fill="rgba(255,255,255,0.16)" />
            <motion.rect x={lo} y={BAR_Y} width={hi - lo} height={BAR_H} fill={C.glycogen} fillOpacity={0.6}
                style={{ originX: 0.5 }} initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : 0.3, ease: EASE_OUT }} />
            {Array.from({ length: RULER_MAX / 100 + 1 }, (_, i) => i * 100).map(v => (
                <g key={v}>
                    <rect x={sx(v) - 1.5} y={BAR_Y + BAR_H} width={3} height={8} fill={C.co2} />
                    <SvgText x={sx(v)} y={BAR_Y + BAR_H + 30} text={String(v)} size={16} anchor="middle" color={C.stone} />
                </g>
            ))}

            {/* Legenda sob a régua */}
            <rect x={(lo + hi) / 2 - 90} y={BAR_Y + 60} width={14} height={14} rx={2} fill={C.glycogen} fillOpacity={0.6} />
            <SvgText x={(lo + hi) / 2 - 70} y={BAR_Y + 73} text="faixa normal: 330–594" size={16} color={C.glycogenSoft} weight={700} />
            <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
                <SvgText x={X0} y={BAR_Y + 73} text="esvaziado < 250" size={16} color={C.risk} weight={700} />
            </motion.g>

            {/* O normal: referência fixa */}
            <rect x={nx - 2} y={186} width={4} height={BAR_Y + BAR_H - 186} fill={C.glycogenSoft} />
            <CountSvgText x={nx - 8} y={212} text="462" size={30} weight={700} anchor="end" color={C.glycogenSoft} />
            <SvgText x={nx - 8} y={234} text="normal ± 132" size={16} anchor="end" color="#E5E7EB" />

            {READINGS.map(r => <Pin key={r.name} r={r} step={step} reduce={reduce} />)}

            <line x1={X0} y1={RULER_H - 56} x2={X1} y2={RULER_H - 56} stroke="#2A3140" strokeWidth={2} />
            <SvgText x={X0} y={RULER_H - 32} text="nota: Bergström 1967 media em g/100 g de músculo úmido," size={16} color={C.caveat} />
            <SvgText x={X0} y={RULER_H - 10} text="outra régua; não convertemos (o fator da água não foi confirmado)" size={16} color={C.caveat} />
        </svg>
    );
};
