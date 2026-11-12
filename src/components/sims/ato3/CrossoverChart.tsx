import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { sample, useMorphPath, type Pt } from '../kit/useMorphPath';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { I_MAX, I_MIN, LAYERS, VANLOON, crossoverAt, mixAt, type Mix } from './crossover.content';

/**
 * Áreas empilhadas das 4 fontes × intensidade (viewBox 660 × 300, 1:1), com eixos e unidade, rótulo dentro de cada área,
 * o cruzamento (CHO = 50%) e o cursor da intensidade. O treino transforma as áreas. Abaixo, `VanLoonStrip`: os pontos
 * medidos em escala própria (kJ/min × %Wmáx), separados de propósito do modelo.
 */
export const CHART_W = 660;
const H = 300;
const X0 = 64;
const X1 = 644;
const Y0 = 30;
const Y1 = 244;
const N = 25;

const xOf = (I: number) => X0 + ((I - I_MIN) / (I_MAX - I_MIN)) * (X1 - X0);
const yOf = (frac: number) => Y1 - frac * (Y1 - Y0);

type LayerKey = keyof Mix;
const ORDER: readonly LayerKey[] = LAYERS.map(l => l.key);
const below = (m: Mix, k: LayerKey) => ORDER.slice(0, ORDER.indexOf(k)).reduce((acc, key) => acc + m[key], 0);

const areaPoints = (k: LayerKey, trained: boolean): Pt[] => {
    const upper = sample(N, I_MIN, I_MAX, I => { const m = mixAt(I, trained); return below(m, k) + m[k]; }, (x, y) => [xOf(x), yOf(y)]);
    const lower = sample(N, I_MIN, I_MAX, I => below(mixAt(I, trained), k), (x, y) => [xOf(x), yOf(y)]);
    return [...upper, ...lower.reverse()];
};

const Area = ({ k, trained, color, opacity }: { k: LayerKey; trained: boolean; color: string; opacity: number }) => {
    const ref = useMorphPath(areaPoints(k, trained), 700);
    return <path ref={ref} fill={color} fillOpacity={opacity} />;
};

/** Rótulo no meio da área, na intensidade `labelAt`; acompanha a área quando o treino a desloca. */
const AreaLabel = ({ k, label, at, trained, dark }: { k: LayerKey; label: string; at: number; trained: boolean; dark: boolean }) => {
    const m = mixAt(at, trained);
    const y = yOf(below(m, k) + m[k] / 2) + 6;
    return (
        <motion.g initial={false} animate={{ x: xOf(at), y }} transition={{ duration: 0.7, ease: EASE_IN_OUT }}>
            <text textAnchor="middle" fontSize={17} fontWeight={800} fill={dark ? '#04080F' : '#FFFFFF'} style={{ fontFamily: 'var(--font-body)' }}>{label}</text>
        </motion.g>
    );
};

export const CrossoverChart = ({ intensity, trained }: { intensity: number; trained: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative shrink-0" style={{ width: CHART_W, height: H }}>
            <svg className="absolute inset-0" width={CHART_W} height={H} viewBox={`0 0 ${CHART_W} ${H}`} role="img"
                aria-label="Fração da energia por fonte conforme a intensidade (modelo ilustrativo)">
                {LAYERS.map(l => <Area key={l.key} k={l.key} trained={trained} color={l.color} opacity={l.opacity} />)}
                {LAYERS.map(l => <AreaLabel key={l.key} k={l.key} label={l.label} at={l.labelAt} trained={trained} dark={l.key === 'agl' || l.key === 'plasmaGlucose'} />)}
                <line x1={X0} y1={yOf(0.5)} x2={X1} y2={yOf(0.5)} stroke="#04080F" strokeWidth={3} strokeDasharray="8 8" />
                <line x1={X0} y1={Y1 + 2} x2={X1} y2={Y1 + 2} stroke="#94A3B8" strokeWidth={3} />
                <line x1={X0 - 2} y1={Y0} x2={X0 - 2} y2={Y1 + 2} stroke="#94A3B8" strokeWidth={3} />
                {[25, 35, 45, 55, 65, 75, 85].map(v => <SvgText key={v} x={xOf(v)} y={Y1 + 24} text={`${v}`} anchor="middle" color="#E5E7EB" size={17} />)}
                <SvgText x={X1} y={Y1 + 50} text="intensidade, % do VO₂máx" anchor="end" color="#D1D5DB" size={16} weight={700} />
                {[0, 25, 50, 75, 100].map(v => <SvgText key={v} x={X0 - 10} y={yOf(v / 100) + 6} text={`${v}`} anchor="end" color="#E5E7EB" size={16} />)}
                <SvgText x={0} y={18} text="% da energia" color="#D1D5DB" size={16} weight={700} />
            </svg>
            <motion.div className="absolute flex flex-col items-center" style={{ left: -60, top: Y0 - 4, width: 120 }}
                initial={false} animate={{ x: xOf(crossoverAt(trained)) }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <span className="rounded-md px-2 text-[16px] font-bold text-[#04080F]" style={{ background: '#F3F4F6' }}>cruzamento</span>
                <span className="w-[3px] bg-[#04080F]" style={{ height: yOf(0.5) - Y0 - 22 }} />
            </motion.div>
            <div className="absolute w-[4px] rounded-full bg-white" style={{ left: -2, top: Y0 + 26, height: Y1 - Y0 - 24, transform: `translateX(${xOf(intensity)}px)` }} />
        </div>
    );
};

/** Pontos medidos (VANLOON2001): gordura oxidada a 55 e 75% da Wmáx, média ± EP, numa régua própria de 0 a 40 kJ/min. */
const S_H = 66;
const SX0 = 230;
const SX1 = 640;
const kx = (kj: number) => SX0 + (kj / 40) * (SX1 - SX0);
const AXIS_Y = 40;

export const VanLoonStrip = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const [hi, lo] = VANLOON;
    return (
        <div className="relative" style={{ width: CHART_W, height: S_H }}>
        {/* moldura do quadro que ainda vai entrar (passo "Medido") */}
        <motion.div className="absolute inset-x-1 inset-y-0 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-700 text-[18px] font-bold text-slate-500"
            initial={false} animate={{ opacity: show ? 0 : 1 }} transition={{ duration: DUR.exit }}>medido · van Loon 2001</motion.div>
        <motion.svg viewBox={`0 0 ${CHART_W} ${S_H}`} width={CHART_W} height={S_H} className="relative block" role="img"
            aria-label="Medido por van Loon 2001: gordura oxidada 32 kJ/min a 55% e 19 a 75% da Wmáx"
            initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <SvgText x={0} y={26} text="medido · van Loon 2001" size={16} color="#FFFFFF" weight={800} />
            <SvgText x={0} y={50} text="gordura oxidada, kJ/min" size={16} color={C.fat} weight={700} />
            <line x1={SX0} y1={AXIS_Y} x2={SX1} y2={AXIS_Y} stroke="#94A3B8" strokeWidth={3} />
            {[0, 10, 20, 30, 40].map(v => <SvgText key={v} x={kx(v)} y={AXIS_Y + 22} text={`${v}`} size={16} anchor="middle" color="#D1D5DB" />)}
            <motion.path d={`M ${kx(hi.kj) - 14} ${AXIS_Y} L ${kx(lo.kj) + 16} ${AXIS_Y}`} stroke={C.fat} strokeWidth={5} markerEnd="url(#vl-head)"
                initial={false} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? 0.6 : 0, ease: EASE_OUT }} />
            <defs>
                <marker id="vl-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={3} markerHeight={3} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={C.fat} />
                </marker>
            </defs>
            {VANLOON.map(p => (
                <g key={p.label}>
                    <line x1={kx(p.kj - p.err)} y1={AXIS_Y} x2={kx(p.kj + p.err)} y2={AXIS_Y} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
                    <circle cx={kx(p.kj)} cy={AXIS_Y} r={9} fill={C.fat} stroke="#04080F" strokeWidth={3} />
                    <SvgText x={kx(p.kj)} y={AXIS_Y - 16} text={`${p.label}: ${p.kj}`} size={16} anchor="middle" color="#F3F4F6" weight={700} />
                </g>
            ))}
        </motion.svg>
        </div>
    );
};
