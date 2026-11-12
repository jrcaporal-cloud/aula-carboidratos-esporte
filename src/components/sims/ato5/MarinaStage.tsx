import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { br } from '../kit/format';
import { AXIS, BREAKFAST, choOf, DAY_FOODS, KG, PASTA, TARGET_G_PER_KG, type FoodPortion } from './marinaPlan.content';

/**
 * Palco do slide 87: uma régua em gramas de carboidrato com a mesma régua em g/kg ao lado (58 kg), e três barras
 * na MESMA escala: o prato da véspera (101 g), o dia de carga empilhado alimento por alimento (~578 g, bate na
 * meta de 580 g) e o café da prova (~100 g). À direita, a lista do cardápio: clicar tira o alimento da pilha.
 */
const W = 320;
const H = 420;
const P = { x0: 50, x1: 272, y0: 26, y1: 372 } as const;
const BAR_W = 54;
const BARS = { eve: 88, load: 161, cafe: 234 } as const;

const yOf = (g: number) => P.y1 - (g / AXIS.maxG) * (P.y1 - P.y0);
const hOf = (g: number) => (g / AXIS.maxG) * (P.y1 - P.y0);

/** Tons do cardápio: alternância âmbar forte / claro (todo segmento é carboidrato). */
const shade = (i: number): string => (i % 2 === 0 ? C.glucose : C.glucoseSoft);
const CAFE_SHADES = [C.glucose, C.glucoseSoft, C.glucose] as const;

interface StackProps {
    foods: readonly FoodPortion[];
    off: readonly string[];
    cx: number;
    colors: (i: number) => string;
    on: boolean;
    delay: number;
}

/** Pilha de alimentos: cada segmento cresce de baixo (scaleY) e desliza (y) quando um de baixo sai. */
const Stack = ({ foods, off, cx, colors, on, delay }: StackProps) => {
    const reduce = useReducedMotion() ?? false;
    const hiddenOf = (f: FoodPortion) => !on || off.includes(f.name);
    /** Base de cada segmento = soma dos que estão abaixo e continuam na pilha. */
    const bottoms = foods.reduce<readonly number[]>((acc, f, i) => [...acc, acc[i] + (hiddenOf(f) ? 0 : choOf(f))], [0]);
    return (
        <g>
            {foods.map((f, i) => {
                const g = choOf(f);
                const hidden = hiddenOf(f);
                const bottom = bottoms[i];
                return (
                    <motion.rect key={f.name} x={cx - BAR_W / 2} y={0} width={BAR_W} height={hOf(g)} fill={colors(i)} stroke="#04080F" strokeWidth={1.5}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
                        initial={false} animate={{ y: yOf(bottom) - hOf(g), scaleY: hidden ? 0 : 1 }}
                        transition={{ duration: reduce ? 0 : DUR.morph, delay: on && !hidden ? delay + stagger(i, 0, 0.07) : 0, ease: EASE_OUT }} />
                );
            })}
        </g>
    );
};

interface ChartProps {
    step: number;
    off: readonly string[];
}

export const MarinaChart = ({ step, off }: ChartProps) => {
    const pasta = choOf(PASTA);
    const cafe = BREAKFAST.reduce((s, f) => s + choOf(f), 0);
    const target = KG * TARGET_G_PER_KG;
    const show = (at: number) => ({ initial: false, animate: { opacity: step >= at ? 1 : 0 }, transition: { duration: DUR.enter, delay: step === at ? 0.15 : 0 } });
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block shrink-0" role="img"
            aria-label="Gramas de carboidrato: véspera 101 g, um dia de carga 578 g (meta 580 g, 10 g/kg), café da prova 100 g">
            <SvgText x={4} y={14} text="g CHO" size={16} color={C.muted} weight={700} />
            <SvgText x={W - 2} y={14} text="g/kg" anchor="end" size={16} color={C.glycogenSoft} weight={700} />
            {/* faixa ISSN 8–12 g/kg */}
            <motion.g {...show(1)}>
                <rect x={P.x0} y={yOf(AXIS.band[1] * KG)} width={P.x1 - P.x0} height={yOf(AXIS.band[0] * KG) - yOf(AXIS.band[1] * KG)} fill="rgba(139,92,246,0.18)" />
                <SvgText x={P.x1 - 4} y={yOf(AXIS.band[1] * KG) + 20} text="ISSN 8–12 g/kg" anchor="end" size={16} color={C.glycogenSoft} weight={700} />
            </motion.g>
            {AXIS.ticksG.map(g => <SvgText key={g} x={P.x0 - 8} y={yOf(g) + 6} text={String(g)} anchor="end" size={16} color={C.muted} />)}
            {AXIS.ticksGkg.map(k => (
                <g key={k}>
                    <line x1={P.x1} x2={P.x1 + 6} y1={yOf(k * KG)} y2={yOf(k * KG)} stroke={C.glycogenSoft} strokeWidth={2} />
                    <SvgText x={P.x1 + 10} y={yOf(k * KG) + 6} text={String(k)} size={16} color={C.glycogenSoft} />
                </g>
            ))}
            <line x1={P.x0} x2={P.x0} y1={P.y0} y2={P.y1} stroke={C.co2} strokeWidth={2} />
            <line x1={P.x1} x2={P.x1} y1={P.y0} y2={P.y1} stroke={C.glycogenSoft} strokeWidth={2} />
            <line x1={P.x0} x2={P.x1} y1={P.y1} y2={P.y1} stroke={C.co2} strokeWidth={3} />

            {/* véspera: o prato */}
            <motion.rect x={BARS.eve - BAR_W / 2} y={yOf(pasta)} width={BAR_W} height={hOf(pasta)} fill={C.glucoseDeep}
                style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ duration: DUR.bar, delay: 0.2, ease: EASE_OUT }} />
            <CountSvgText x={BARS.eve} y={yOf(pasta) - 10} text={`${Math.round(pasta)}`} anchor="middle" size={20} color="#fff" weight={800} delay={0.3} />

            {/* meta: contorno do que falta (passo 2) e linha dos 580 g */}
            <motion.g {...show(1)}>
                <rect x={BARS.load - BAR_W / 2} y={yOf(target)} width={BAR_W} height={hOf(target)} fill="none" stroke={C.glucose} strokeWidth={2.5} strokeDasharray="7 6" />
                <line x1={P.x0} x2={P.x1} y1={yOf(target)} y2={yOf(target)} stroke={C.glucose} strokeWidth={2.5} />
                <SvgText x={P.x0 + 4} y={yOf(target) - 8} text={`meta ${target} g`} size={16} color={C.glucose} weight={800} />
            </motion.g>
            <Stack foods={DAY_FOODS} off={off} cx={BARS.load} colors={shade} on={step >= 2} delay={0.15} />

            {/* café da prova */}
            <Stack foods={BREAKFAST} off={[]} cx={BARS.cafe} colors={i => CAFE_SHADES[i] ?? C.glucose} on={step >= 3} delay={0.15} />
            <motion.g {...show(3)}>
                <CountSvgText key={`c-${step >= 3}`} x={BARS.cafe} y={yOf(cafe) - 10} text={`${Math.round(cafe)}`} anchor="middle" size={20} color="#fff" weight={800} delay={0.5} />
            </motion.g>

            {[
                { x: BARS.eve, t: 'véspera', at: 0 },
                { x: BARS.load, t: '1 dia', at: 1 },
                { x: BARS.cafe, t: 'café', at: 3 },
            ].map(b => (
                <motion.g key={b.t} {...show(b.at)}>
                    <SvgText x={b.x} y={P.y1 + 24} text={b.t} anchor="middle" size={16} color={C.text} weight={700} />
                </motion.g>
            ))}
            <SvgText x={(P.x0 + P.x1) / 2} y={P.y1 + 44} text={`mesma escala · ${KG} kg`} anchor="middle" size={16} color={C.muted} />
        </svg>
    );
};

interface ListProps {
    step: number;
    off: readonly string[];
    total: number;
    onToggle: (name: string) => void;
}

/** Cardápio do dia de carga (passo 3+) e o café (passo 4). Clicar num alimento tira/devolve ele da pilha. */
export const MarinaList = ({ step, off, total, onToggle }: ListProps) => (
    <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1 leading-tight">
        <div className="flex flex-col gap-0.5">
            <span className="text-[16px] font-bold" style={{ color: C.glucoseSoft }}>véspera · {Math.round(choOf(PASTA))} g · {br(choOf(PASTA) / KG)} g/kg</span>
            <div className="flex items-center gap-2 px-1">
                <span className="h-[14px] w-[14px] shrink-0 rounded-sm" style={{ background: C.glucoseDeep }} />
                <span className="flex-1 text-[16px] text-gray-100">macarrão à bolonhesa <span className="text-gray-300">{PASTA.grams} g</span></span>
                <span className="w-[40px] text-right font-mono text-[16px] font-bold text-white">{Math.round(choOf(PASTA))}</span>
            </div>
        </div>
        {step >= 2 && (
            <motion.div className="flex flex-col gap-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter }}>
                <span className="text-[16px] font-bold" style={{ color: C.glucose }}>1 dia de carga · {Math.round(total)} g · {br(total / KG)} g/kg</span>
                <span className="px-1 text-[16px] text-gray-300">clique para tirar um alimento</span>
                {DAY_FOODS.map((f, i) => {
                    const out = off.includes(f.name);
                    return (
                        <motion.button key={f.name} type="button" onClick={() => onToggle(f.name)} aria-pressed={!out}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-1 text-left"
                            initial={{ opacity: 0, x: -6 }} animate={{ opacity: out ? 0.6 : 1, x: 0 }}
                            transition={{ duration: DUR.enter, delay: step === 2 ? stagger(i, 0.15, 0.07) : 0, ease: EASE_OUT }}>
                            <span className="h-[14px] w-[14px] shrink-0 rounded-sm" style={{ background: out ? 'transparent' : shade(i), border: `2px solid ${shade(i)}` }} />
                            <span className={`flex-1 text-[16px] text-gray-100 ${out ? 'line-through' : ''}`}>{f.name} <span className="text-gray-300">{f.grams} g</span></span>
                            <span className="w-[40px] text-right font-mono text-[16px] font-bold text-white">{Math.round(choOf(f))}</span>
                        </motion.button>
                    );
                })}
            </motion.div>
        )}
        {step >= 3 && (
            <motion.div className="flex flex-col gap-0.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: 0.2, ease: EASE_IN_OUT }}>
                <span className="text-[16px] font-bold" style={{ color: C.glucose }}>café 3 h antes · ~{Math.round(BREAKFAST.reduce((t, f) => t + choOf(f), 0))} g · 1,7 g/kg</span>
                {BREAKFAST.map((f, i) => (
                    <div key={f.name} className="flex items-center gap-2 px-1">
                        <span className="h-[14px] w-[14px] shrink-0 rounded-sm" style={{ background: CAFE_SHADES[i] }} />
                        <span className="flex-1 text-[16px] text-gray-100">{f.name} <span className="text-gray-300">{f.grams} g</span></span>
                        <span className="w-[40px] text-right font-mono text-[16px] font-bold text-white">{Math.round(choOf(f))}</span>
                    </div>
                ))}
            </motion.div>
        )}
    </div>
);
