import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { ARM_ROWS, GEJL_ROWS, RECOVERY_ROWS, type GlyCaRow } from './calcium.content';

/**
 * Slide 66 · o palco em 5 faixas, uma por elo: 1 o gatilho (DHPR → RyR1 → Ca²⁺ → troponina C; SERCA devolve) →
 * 2 1 h de esqui: o braço seca e o Ca²⁺ cai, a perna é o controle (ORTENBLAD2011) → 3 4 h depois, CHO × água
 * (mesmo estudo; às 22 h só o Ca²⁺, sem barra de glicogênio) → 4 outro grupo repete (GEJL2014) → 5 junto não é causa:
 * r = 0,30, r² ≈ 0,09 (conta nossa) e o "?" no elo glicogênio → RyR1. Nenhum traço liga fisicamente glicogênio e RyR1:
 * o elo é lógico (setas tracejadas com "?"), não desenho de anatomia. Barras em % do valor antes, a trilha inteira = 100%.
 */

const DARK = '#04080F';

const Pill = ({ text, color, dashed = false }: { text: string; color: string; dashed?: boolean }) => (
    <span className="flex h-[28px] shrink-0 items-center rounded-md border-2 px-2 text-[16px] font-bold leading-none"
        style={{ borderColor: color, borderStyle: dashed ? 'dashed' : 'solid', color }}>{text}</span>
);

const Arrow = ({ dashed = false }: { dashed?: boolean }) => (
    <span className="shrink-0 text-[17px] font-bold" style={{ color: dashed ? C.co2 : '#E5E7EB' }}>{dashed ? '⇢' : '→'}</span>
);

/** Trilho RyR1 → troponina com o Ca²⁺ correndo (é o fluxo que o elo ensina). */
const CaTrack = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative h-[32px] min-w-[80px] flex-1">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[16px] font-bold leading-none" style={{ color: C.insulinSoft }}>Ca²⁺</span>
            <span className="absolute inset-x-0 top-[23px] h-[2px] bg-white/25" />
            {[0, 1, 2].map(i => (
                <motion.span key={i} className="absolute top-[18px] ml-[-6px] h-[12px] w-[12px] rounded-full border-2"
                    style={{ background: C.insulinSoft, borderColor: DARK, left: reduce ? `${20 + i * 30}%` : 0 }}
                    animate={reduce ? undefined : { left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                    transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'linear' }} />
            ))}
        </div>
    );
};

const Trigger = () => (
    <div className="flex flex-col gap-1">
        <div className="flex items-end gap-1.5">
            <Pill text="DHPR" color={C.glucoseSoft} />
            <Arrow />
            <Pill text="RyR1" color={C.insulinSoft} />
            <CaTrack />
            <Pill text="troponina C" color={C.caveat} />
        </div>
        <span className="text-[16px] leading-tight text-gray-300">↩ a SERCA devolve o Ca²⁺ ao RS, gastando ATP</span>
    </div>
);

/** Barra 0–100% do valor antes (a trilha inteira = 100%) + valor à direita. */
const PctBar = ({ v, color, delay }: { v: number; color: string; delay: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex min-w-0 items-center gap-1.5">
            <div className="relative h-[18px] flex-1 rounded-sm bg-white/10">
                <motion.div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${v}%`, background: color, transformOrigin: 'left center' }}
                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay, ease: EASE_OUT }} />
            </div>
            <span className="w-[44px] shrink-0 text-right font-display text-[18px] font-bold leading-none tabular-nums" style={{ color }}>{v}%</span>
        </div>
    );
};

const ROW = 'grid grid-cols-[136px_1fr_1fr] items-center gap-3';

const GlyCaTable = ({ rows, head = false }: { rows: readonly GlyCaRow[]; head?: boolean }) => (
    <div className="flex flex-col gap-1">
        {head && (
            <div className={`${ROW} text-[16px] font-bold leading-none`}>
                <span />
                <span style={{ color: C.glycogenSoft }}>glicogênio total</span>
                <span style={{ color: C.insulinSoft }}>Ca²⁺ liberado</span>
            </div>
        )}
        {rows.map((r, i) => (
            <div key={r.label} className={ROW}>
                <span className="text-[16px] font-semibold leading-tight text-gray-200">{r.label}</span>
                <PctBar v={r.gly} color={C.glycogen} delay={0.25 + i * 0.2} />
                {r.ca !== null
                    ? <PctBar v={r.ca} color={C.insulin} delay={0.35 + i * 0.2} />
                    : <span className="text-[16px] font-bold leading-none" style={{ color: C.insulinSoft }}>{r.caText}</span>}
            </div>
        ))}
    </div>
);

/** r = 0,30 → r² ≈ 0,09: 9 de 100 partes da variação acesas numa trilha. */
const Variance = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-center gap-3">
            <span className="shrink-0 whitespace-nowrap text-[20px] font-bold leading-none text-white">r = 0,30</span>
            <span className="shrink-0 whitespace-nowrap text-[16px] font-bold" style={{ color: C.caveat }}>→ r² ≈ 0,09</span>
            <div className="relative h-[18px] flex-1 rounded-sm bg-white/10">
                <motion.div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: '9%', background: C.insulin, transformOrigin: 'left center' }}
                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay: 0.3, ease: EASE_OUT }} />
            </div>
            <span className="shrink-0 whitespace-nowrap text-[16px] font-bold" style={{ color: C.insulinSoft }}>~9 de 100</span>
        </div>
    );
};

/** O elo proposto: lógico, tracejado, com "?". Não é ligação física. */
const Doubt = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-center gap-2">
            <Pill text="glicogênio intramiofibrilar" color={C.glycogenSoft} dashed />
            <Arrow dashed />
            <motion.span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border-[3px] font-display text-[18px] font-bold"
                style={{ borderColor: C.stone, color: C.stone }}
                initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1.35, 1], opacity: 1 }}
                transition={{ duration: DUR.bar, delay: 0.7, ease: EASE_OUT }}>?</motion.span>
            <Arrow dashed />
            <Pill text="RyR1" color={C.insulinSoft} dashed />
        </div>
    );
};

export const CalciumFlow = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col justify-between gap-1.5 p-2">
        <Cell n={1} title="O gatilho" note="túbulo T → RS → fibra" show={step >= 0} born={step === 0}>
            <Trigger />
        </Cell>
        <Cell n={2} title="1 h de esqui" note="Ørtenblad 2011 · % do valor antes" show={step >= 1} born={step === 1}>
            <GlyCaTable rows={ARM_ROWS} head />
        </Cell>
        <Cell n={3} title="4 h depois" note="mesmo estudo · CHO × água sorteado" show={step >= 2} born={step === 2}>
            <GlyCaTable rows={RECOVERY_ROWS} />
            <span className="text-[16px] leading-tight text-gray-300">22 h (água, depois 18 h de CHO): <b style={{ color: C.insulinSoft }}>Ca²⁺ normal</b></span>
        </Cell>
        <Cell n={4} title="Outro grupo repete" note="Gejl 2014 · triatletas" show={step >= 3} born={step === 3}>
            <GlyCaTable rows={GEJL_ROWS} />
            <span className="text-[16px] leading-tight text-gray-300">potência de pico −5,5 a −8,9%; volta só com CHO</span>
        </Cell>
        <Cell n={5} title="Junto não é causa" note="r do Gejl 2014" show={step >= 4} born={step === 4}>
            <Variance />
            <Doubt />
        </Cell>
    </div>
);
