import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { sample, useMorphPath, type Pt } from '../kit/useMorphPath';
import { SvgText } from '../kit/ui';
import { I_MAX, I_MIN, LAYERS, crossoverAt, mixAt, type Mix } from './crossover.content';

/** Áreas empilhadas das 4 fontes × intensidade (720 × 300, viewBox 1:1). O treino transforma as áreas. */
const CHART_W = 720;
const H = 300;
const X0 = 56;
const X1 = 700;
const Y0 = 12;
const Y1 = 262;
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

export const CrossoverChart = ({ intensity, trained }: { intensity: number; trained: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative shrink-0" style={{ width: CHART_W, height: H }}>
            <svg className="absolute inset-0" width={CHART_W} height={H} viewBox={`0 0 ${CHART_W} ${H}`} role="img"
                aria-label="Fração da energia por fonte conforme a intensidade">
                {LAYERS.map(l => <Area key={l.key} k={l.key} trained={trained} color={l.color} opacity={l.opacity} />)}
                <line x1={X0} y1={yOf(0.5)} x2={X1} y2={yOf(0.5)} stroke="#04080F" strokeWidth={3} strokeDasharray="8 8" />
                <line x1={X0} y1={Y1 + 2} x2={X1} y2={Y1 + 2} stroke="#94A3B8" strokeWidth={3} />
                {[25, 45, 65, 85].map(v => <SvgText key={v} x={xOf(v)} y={Y1 + 26} text={`${v}%`} anchor="middle" color="#E5E7EB" size={17} />)}
                <SvgText x={xOf(75)} y={Y1 + 26} text="do VO₂máx" anchor="middle" color="#9CA3AF" size={16} />
                {[0, 50, 100].map(v => <SvgText key={v} x={X0 - 10} y={yOf(v / 100) + 6} text={`${v}%`} anchor="end" color="#E5E7EB" size={16} />)}
            </svg>
            {/* cruzamento: onde CHO = 50% da energia */}
            <motion.div className="absolute flex flex-col items-center" style={{ left: -60, top: Y0 - 2, width: 120 }}
                initial={false} animate={{ x: xOf(crossoverAt(trained)) }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }}>
                <span className="rounded-md px-2 text-[16px] font-bold text-[#04080F]" style={{ background: '#F3F4F6' }}>cruzamento</span>
                <span className="w-[3px] bg-[#04080F]" style={{ height: yOf(0.5) - Y0 - 22 }} />
            </motion.div>
            {/* cursor da intensidade atual */}
            <div className="absolute w-[4px] rounded-full bg-white" style={{ left: -2, top: Y0 + 26, height: Y1 - Y0 - 24, transform: `translateX(${xOf(intensity)}px)` }} />
        </div>
    );
};

