import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { GLUCOSE_MAX, GLUCOSE_ROWS, LIVER_MAX, LIVER_ROWS, SPARED } from './twoTanks.content';

/**
 * Slide 67 · o palco em 4 faixas numeradas, uma por elo, cada uma com UM estudo e a sua unidade:
 * 1 o carboidrato da prova cai no sangue (revisão, g) → 2 o fígado fica cheio (Gonzalez 2015, mmol/L) →
 * 3 a glicemia se mantém (Coyle 1986, mM) → 4 o músculo poupa quase nada (Rothschild 2026, mmol/kg ps).
 * Cada faixa entra no seu passo e fica; antes disso, só a moldura tracejada com o título.
 */

export const CHAIN_W = 640;
const TRACK = '#2A3140';

const Box = ({ label, color, solid = false }: { label: string; color: string; solid?: boolean }) => (
    <span className="whitespace-nowrap rounded-md border-2 px-2 py-0.5 text-[16px] font-bold"
        style={solid ? { background: color, borderColor: color, color: '#04080F' } : { borderColor: color, color }}>{label}</span>
);

const Arrow = () => <span className="text-[20px] font-bold leading-none text-gray-400">→</span>;

/** Elo 1: os dois caminhos que chegam ao mesmo sangue; o músculo tira do sangue e guarda o próprio estoque. */
const BloodMap = () => (
    <div className="flex items-center gap-1.5">
        <div className="flex flex-col items-start gap-1">
            <Box label="CHO na prova" color={C.glucose} solid />
            <Box label="fígado ~80 g" color={C.glycogenSoft} />
        </div>
        <Arrow />
        <Box label="sangue ~4 g" color={C.glucoseSoft} />
        <Arrow />
        <Box label="músculo" color={C.glycogenSoft} />
    </div>
);

/** Elo 2: halteres antes → depois, mesma escala (0–500 mmol/L). Vazado = antes; cheio = depois de 3 h. */
const LiverDumbbells = () => {
    const reduce = useReducedMotion() ?? false;
    const pct = (v: number) => `${(v / LIVER_MAX) * 100}%`;
    return (
        <div className="flex flex-col gap-1">
            {LIVER_ROWS.map((r, i) => {
                const color = r.cho ? C.glucoseSoft : C.risk;
                const left = Math.min(r.pre, r.post);
                return (
                    <div key={r.label} className="flex items-center gap-2">
                        <span className="w-[78px] shrink-0 text-[16px] font-semibold" style={{ color }}>{r.label}</span>
                        <div className="relative h-[18px] flex-1">
                            <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: TRACK }} />
                            <motion.span className="absolute top-1/2 h-[4px] -translate-y-1/2" style={{ left: pct(left), width: pct(Math.abs(r.post - r.pre)), background: color }}
                                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.3 + i * 0.12 }} />
                            <span className="absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[#04080F]" style={{ left: pct(r.pre), borderColor: color }} />
                            <motion.span className="absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: color }}
                                initial={reduce ? false : { left: pct(r.pre) }} animate={{ left: pct(r.post) }} transition={{ duration: DUR.bar, delay: 0.3 + i * 0.12, ease: EASE_OUT }} />
                        </div>
                        <span className="w-[104px] shrink-0 whitespace-nowrap text-right font-display text-[17px] font-bold tabular-nums" style={{ color }}>{r.text}</span>
                    </div>
                );
            })}
        </div>
    );
};

/** Elo 3: glicose no sangue em barras de escala real (0–6 mM) e o tempo até a fadiga ao lado. */
const GlucoseBars = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1">
            {GLUCOSE_ROWS.map((r, i) => {
                const color = r.cho ? C.glucose : C.risk;
                return (
                    <div key={r.label} className="flex items-center gap-2">
                        <span className="w-[92px] shrink-0 text-[16px] font-semibold text-gray-200">{r.label}</span>
                        <div className="relative h-[20px] flex-1">
                            <span className="absolute inset-0 rounded-r-md" style={{ background: TRACK }} />
                            <motion.span className="absolute inset-y-0 left-0 rounded-r-md" style={{ width: `${(r.hi / GLUCOSE_MAX) * 100}%`, background: color, transformOrigin: 'left center' }}
                                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay: 0.3 + i * 0.12, ease: EASE_OUT }} />
                        </div>
                        <span className="w-[76px] shrink-0 text-right font-display text-[17px] font-bold tabular-nums" style={{ color: r.cho ? C.glucoseSoft : C.risk }}>{r.mM}</span>
                        <span className="w-[62px] shrink-0 text-right text-[16px] font-semibold tabular-nums text-white">{r.hours}</span>
                    </div>
                );
            })}
        </div>
    );
};

/** Elo 4: o efeito com o IC 95% numa régua de 0 a 50 mmol/kg ps. */
const SparedScale = () => {
    const reduce = useReducedMotion() ?? false;
    const pct = (v: number) => `${(v / SPARED.max) * 100}%`;
    return (
        <div className="flex items-center gap-6">
            <div className="flex flex-1 flex-col gap-0.5 px-2">
                <div className="relative h-[22px]">
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: TRACK }} />
                    <motion.span className="absolute top-1/2 h-[4px] -translate-y-1/2" style={{ left: pct(SPARED.lo), width: pct(SPARED.hi - SPARED.lo), background: C.glycogenSoft }}
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay: 0.5 }} />
                    {[SPARED.lo, SPARED.hi].map(v => <span key={v} className="absolute top-1/2 h-[14px] w-[3px] -translate-y-1/2" style={{ left: pct(v), background: C.glycogenSoft }} />)}
                    <span className="absolute top-1/2 h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ left: pct(SPARED.value), background: C.glycogenSoft }} />
                </div>
                <div className="relative h-[18px] text-[16px] text-gray-300">
                    {[0, 25, 50].map(v => (
                        <span key={v} className="absolute -translate-x-1/2 tabular-nums leading-none" style={{ left: pct(v) }}>{v}</span>
                    ))}
                </div>
            </div>
            <div className="flex w-[104px] shrink-0 flex-col leading-tight">
                <KeyFact color={C.glycogenSoft} delay={0.8}><span className="font-display text-[26px] font-bold" style={{ color: C.glycogenSoft }}>~24</span></KeyFact>
                <span className="text-[16px] text-gray-200">IC 4–45</span>
            </div>
        </div>
    );
};

export const TanksChain = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-4 gap-2 p-2">
        <Cell n={1} title="O CHO da prova cai no sangue" note="estoques médios · revisão" show={step >= 0} born={step === 0}>
            <BloodMap />
        </Cell>
        <Cell n={2} title="O fígado fica cheio" note="Gonzalez 2015 · mmol/L ○ antes · ● após 3 h" show={step >= 1} born={step === 1}>
            <LiverDumbbells />
        </Cell>
        <Cell n={3} title="A glicemia se mantém" note="Coyle 1986 · glicose (0–6 mM) e fadiga (h)" show={step >= 2} born={step === 2}>
            <GlucoseBars />
        </Cell>
        <Cell n={4} title="O músculo poupa quase nada" note="Rothschild 2026 · mmol/kg ps, ~100 min" show={step >= 3} born={step === 3}>
            <SparedScale />
        </Cell>
    </div>
);
