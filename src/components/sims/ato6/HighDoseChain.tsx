import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { MORTON_BAND, PODL, RAVI, VIRI } from './highdose.content';

/**
 * Slide 105 · o palco em 4 faixas, uma por elo e um estudo por faixa (cada um na sua escala):
 * 1 entra e oxida mais (Ravikanti, maratonistas, g/min) → 2 o estoque endógeno fica igual (Podlogar, ciclistas, g/min) →
 * 3 o tempo de prova não foi medido (Viribay, carga interna em UA) → 4 desempenho: não demonstrado (Morton 2026, régua de g/h).
 */

interface BarProps {
    label: string;
    value: number;
    max: number;
    text: string;
    color: string;
    delay: number;
    tag?: string;
}

/** Barra horizontal com escala real a partir do zero; `tag` em cinza depois do valor (proporção, dose de referência). */
const Bar = ({ label, value, max, text, color, delay, tag }: BarProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-center gap-2 leading-none">
            <span className="w-[62px] shrink-0 text-[16px] font-semibold text-gray-200">{label}</span>
            <div className="relative h-[16px] flex-1">
                <motion.div className="absolute inset-y-0 left-0 rounded-r-md" style={{ width: `${(value / max) * 100}%`, background: color, transformOrigin: 'left center' }}
                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay, ease: EASE_OUT }} />
            </div>
            <span className="w-[58px] shrink-0 text-right font-display text-[18px] font-bold tabular-nums" style={{ color }}>{text}</span>
            <span className="w-[66px] shrink-0 text-[16px] text-gray-300">{tag}</span>
        </div>
    );
};

/** Faixa 1 · Ravikanti: oxidação exógena na 2ª hora (g/min), escala 0–2. */
const Oxidation = () => (
    <div className="flex flex-col gap-1">
        {RAVI.map((d, i) => (
            <Bar key={d.gh} label={`${d.gh} g/h`} value={d.exo} max={2} text={br(d.exo, 2)} color={C.glucose} delay={stagger(i, 0.25, 0.15)} tag={d.ratio} />
        ))}
        <span className="text-[16px] leading-tight text-gray-300">g/min, 2ª hora · à direita, a proporção</span>
    </div>
);

/** Faixa 2 · Podlogar: endógena (estoque) + exógena (bebida) empilhadas, g/min, escala 0–4. */
const Stores = () => {
    const reduce = useReducedMotion() ?? false;
    const MAX = 4;
    return (
        <div className="flex flex-col gap-1.5">
            {PODL.map((d, i) => (
                <div key={d.gh} className="flex items-center gap-2 leading-none">
                    <span className="w-[62px] shrink-0 text-[16px] font-semibold text-gray-200">{d.gh} g/h</span>
                    <div className="flex h-[22px] flex-1">
                        <motion.div className="flex h-full items-center justify-center rounded-l-md text-[16px] font-bold text-white"
                            style={{ width: `${(d.endo / MAX) * 100}%`, background: C.glycogen, transformOrigin: 'left center' }}
                            initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay: stagger(i, 0.2, 0.15), ease: EASE_OUT }}>
                            {br(d.endo, 2)}
                        </motion.div>
                        <motion.div className="flex h-full items-center justify-center rounded-r-md text-[16px] font-bold"
                            style={{ width: `${(d.exo / MAX) * 100}%`, background: C.glucose, color: '#04080F' }}
                            initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: DUR.enter, delay: stagger(i, 0.6, 0.15), ease: EASE_OUT }}>
                            {br(d.exo, 2)}
                        </motion.div>
                    </div>
                    <span className="w-[50px] shrink-0 text-[16px] text-gray-300">{d.ratio}</span>
                </div>
            ))}
            <div className="flex flex-wrap gap-x-4 text-[16px] font-semibold leading-tight">
                <span style={{ color: C.glycogenSoft }}>■ endógena (p = 0,786)</span>
                <span style={{ color: C.glucoseSoft }}>■ exógena (p = 0,026)</span>
            </div>
            <span className="text-[16px] leading-tight text-gray-300">g/min · à direita, maltodextrina:frutose</span>
        </div>
    );
};

/** Faixa 3 · Viribay: o que foi medido (carga interna, UA) e a linha vazia do tempo de prova. */
const Outcome = () => (
    <div className="flex flex-col gap-1.5">
        {VIRI.map((d, i) => (
            <Bar key={d.gh} label={`${d.gh} g/h`} value={d.load} max={5000} text={String(d.load)} color={C.stone} delay={stagger(i, 0.25, 0.15)} tag="UA" />
        ))}
        <div className="flex items-center gap-2 leading-none">
            <span className="w-[62px] shrink-0 text-[16px] font-semibold text-gray-200">prova</span>
            <div className="flex h-[22px] flex-1 items-center justify-center rounded-md border-2 border-dashed text-[16px] font-bold"
                style={{ borderColor: '#FDA4AF', color: '#FDA4AF' }}>
                tempo: não medido
            </div>
        </div>
    </div>
);

/** Faixa 4 · régua de g/h: 120–200 g/h com eficácia ainda não demonstrada (Morton 2026). */
const RULER_TICKS = [0, 60, 90, 120, 200] as const;
const rx = (gh: number) => `${(gh / 200) * 100}%`;

const Verdict = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1">
            <div className="relative h-[24px] w-full">
                <div className="absolute inset-x-0 top-[10px] h-[4px] rounded-full bg-white/25" />
                <motion.div className="absolute inset-y-0 flex items-center justify-center rounded-md border-2 border-dashed text-[16px] font-bold text-white"
                    style={{ left: rx(MORTON_BAND[0]), width: `${((MORTON_BAND[1] - MORTON_BAND[0]) / 200) * 100}%`, borderColor: '#FFFFFF', background: '#04080F' }}
                    initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: DUR.enter, delay: 0.3, ease: EASE_OUT }}>
                    não demonstrado
                </motion.div>
            </div>
            <div className="relative h-[20px] w-full">
                {RULER_TICKS.map(v => (
                    <span key={v} className="absolute -translate-x-1/2 text-[16px] font-semibold tabular-nums text-gray-300"
                        style={{ left: `clamp(8px, ${rx(v)}, calc(100% - 18px))` }}>{v}</span>
                ))}
            </div>
            <span className="text-[16px] leading-tight text-gray-300">g/h · eficácia de 120–200 g/h ainda não demonstrada</span>
        </div>
    );
};

export const HighDoseChain = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-[100px_104px_110px_1fr] gap-2 p-2">
        <Cell n={1} title="Entra e oxida mais" note="Ravikanti 2025 · 8 maratonistas" show={step >= 0} born={step === 0}>
            <Oxidation />
        </Cell>
        <Cell n={2} title="O estoque fica igual" note="Podlogar 2022 · 11 ciclistas" show={step >= 1} born={step === 1}>
            <Stores />
        </Cell>
        <Cell n={3} title="O tempo não foi medido" note="Viribay 2020 · 20 corredores · carga interna" show={step >= 2} born={step === 2}>
            <Outcome />
        </Cell>
        <Cell n={4} title="Desempenho: não demonstrado" note="Morton 2026 · revisão" show={step >= 3} born={step === 3}>
            <Verdict />
        </Cell>
    </div>
);
