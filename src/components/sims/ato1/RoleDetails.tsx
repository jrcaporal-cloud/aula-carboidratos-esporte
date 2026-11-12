import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { CHOICE, FUEL, SIGNAL } from './roles.content';

/** Os mini-diagramas de cada papel no slide 11, desenhados com eixo e unidade. Largura útil ~330 px. */

const br = (n: number): string => String(n).replace('.', ',');

/** Combustível: kJ por litro de O₂, escala de 0 a 22 (sem eixo truncado: a diferença é pequena e é real). */
export const FuelDiagram = () => (
    <div className="flex flex-col gap-2">
        {FUEL.bars.map((b, i) => (
            <div key={b.label} className="flex items-center gap-2">
                <span className="w-[70px] shrink-0 text-[17px] text-gray-100">{b.label}</span>
                <div className="relative h-6 flex-1 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="absolute inset-y-0 left-0" style={{ width: `${(b.value / FUEL.max) * 100}%` }}>
                        <Grow value={1} color={b.color} delay={0.15 + i * 0.12} />
                    </div>
                </div>
                <span className="w-[46px] shrink-0 text-right font-mono text-[17px] tabular-nums" style={{ color: b.color }}>{br(b.value)}</span>
            </div>
        ))}
        <div className="flex items-center gap-2">
            <span className="w-[70px] shrink-0 text-[14px] text-gray-300">kJ / L O₂</span>
            <div className="relative mr-[54px] h-5 flex-1 font-mono text-[14px] text-gray-400">
                {[0, 10, 20].map(t => (
                    <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / FUEL.max) * 100}%` }}>{t}</span>
                ))}
            </div>
        </div>
        <div className="flex items-baseline gap-3">
            <CountUp text={FUEL.stat} delay={0.4} className="font-display text-[44px] font-bold leading-none" style={{ color: C.glucose }} />
            <span className="text-[17px] leading-tight text-gray-200">{FUEL.caption}</span>
        </div>
    </div>
);

const DOT = 11;

/** Sinal: cada bolinha é um estudo; acesa = mostrou o desfecho (Impey 2018). */
export const SignalDiagram = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[16px] text-gray-300">cada bolinha = um estudo de train low</span>
            {SIGNAL.rows.map((r, row) => {
                const perf = r.label === 'desempenho';
                const color = perf ? C.glucoseSoft : C.insulin;
                return (
                    <div key={r.label} className="flex items-center gap-2">
                        <span className="w-[98px] shrink-0 text-[16px]" style={{ color: perf ? C.glucoseSoft : '#F3F4F6', fontWeight: perf ? 700 : 400 }}>{r.label}</span>
                        <div className="flex flex-1 gap-[3px]">
                            {Array.from({ length: r.n }, (_, i) => (
                                <span key={i} className="relative rounded-full" style={{ width: DOT, height: DOT, background: 'rgba(255,255,255,0.18)' }}>
                                    {i < r.hit && (
                                        <motion.span className="absolute inset-0 rounded-full" style={{ background: color }}
                                            initial={reduce ? false : { opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.15 + row * 0.18 + i * 0.03, duration: 0.25, ease: EASE_OUT }} />
                                    )}
                                </span>
                            ))}
                        </div>
                        <span className="w-[44px] shrink-0 text-right font-mono text-[16px] font-semibold tabular-nums" style={{ color }}>{r.pct}</span>
                    </div>
                );
            })}
        </div>
    );
};

const pctOf = (g: number): string => `${(g / CHOICE.max) * 100}%`;

/** Escolha: régua de 0 a 12 g/kg/dia com as quatro faixas de carga. */
export const ChoiceDiagram = () => (
    <div className="flex flex-col gap-1.5">
        {CHOICE.bands.map((b, i) => (
            <div key={b.label} className="flex items-center gap-2">
                <span className="w-[96px] shrink-0 text-[16px] text-gray-100">{b.label}</span>
                <div className="relative h-5 flex-1">
                    <div className="absolute inset-y-0 overflow-hidden rounded-md" style={{ left: pctOf(b.from), width: pctOf(b.to - b.from) }}>
                        <Grow value={1} color={C.ok} delay={0.15 + i * 0.1} style={{ opacity: 0.45 + i * 0.18 }} />
                    </div>
                </div>
                <span className="w-[48px] shrink-0 text-right font-mono text-[16px] tabular-nums" style={{ color: C.ok }}>{b.from}–{b.to}</span>
            </div>
        ))}
        <div className="flex items-center gap-2">
            <span className="w-[96px] shrink-0 text-[14px] text-gray-300">g/kg por dia</span>
            <div className="relative mr-[56px] h-5 flex-1 font-mono text-[14px] text-gray-400">
                {[0, 3, 6, 9, 12].map(g => (
                    <span key={g} className="absolute -translate-x-1/2" style={{ left: pctOf(g) }}>{g}</span>
                ))}
            </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="shrink-0 font-display text-[26px] font-bold leading-none tabular-nums" style={{ color: C.ok }}>{CHOICE.marina}</span>
            <span className="text-[16px] leading-tight text-gray-200">{CHOICE.marinaCaption}</span>
        </div>
    </div>
);
