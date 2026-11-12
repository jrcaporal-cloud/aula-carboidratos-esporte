import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { cg } from './glycemic.content';

/**
 * Slide 29 · o bloco de baixo do painel, por passo: o dado-chave (passos 1–4), a calculadora de carga
 * glicêmica com a porção arrastável (passo 5) e o quadro "mede × não mede" (passo 6, que guarda a carga).
 */
const KEYS: readonly { value: string; caption: string }[] = [
    { value: '100', caption: 'IG = área do alimento ÷ área da glicose × 100' },
    { value: '65 ± 5', caption: 'cereais matinais, média do grupo' },
    { value: '31 ± 3', caption: 'leguminosas secas, média do grupo' },
    { value: '> 4.000', caption: 'itens nas tabelas de 2021; ~2.100 pelo método ISO' },
];

const GI = 65;

const LoadRow = ({ grams, delay = 0 }: { grams: number; delay?: number }) => (
    <div className="grid grid-cols-[64px_1fr_48px] items-center gap-3 text-[16px]">
        <span className="text-gray-200">{grams} g</span>
        <div className="relative h-[22px] overflow-hidden rounded bg-slate-800">
            <Grow value={cg(GI, grams) / 65} color={C.glucose} delay={delay} />
        </div>
        <span className="text-right font-display text-[24px] font-bold tabular-nums" style={{ color: C.glucoseSoft }}>{cg(GI, grams)}</span>
    </div>
);

const LoadCalc = () => {
    const [grams, setGrams] = useState(40);
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[16px] text-gray-200">CG = IG × gramas de CHO ÷ 100 · cereal de IG 65</span>
            <LoadRow grams={20} delay={0.4} />
            <LoadRow grams={60} delay={0.55} />
            <label className="flex items-center gap-3 text-[16px] text-gray-200">
                <span className="w-[64px] shrink-0">porção</span>
                <input type="range" min={10} max={100} step={5} value={grams} onChange={e => setGrams(Number(e.target.value))}
                    onPointerUp={e => e.currentTarget.blur()}
                    aria-label="gramas de carboidrato na porção" className="min-w-0 flex-1 accent-amber-500" />
                <span className="w-[120px] shrink-0 text-right tabular-nums"><b>{grams} g</b> → CG <b style={{ color: C.glucoseSoft }}>{cg(GI, grams)}</b></span>
            </label>
        </div>
    );
};

const MEASURES = {
    mede: 'a glicemia de 2 h de um alimento isolado, em jejum e em repouso',
    nao: 'quanto se comeu (→ CG), a refeição mista, o desempenho na prova',
} as const;

const Limits = () => (
    <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3 text-[16px] leading-snug">
            {(['mede', 'nao'] as const).map((k, c) => (
                <motion.div key={k} className="flex flex-col gap-1 rounded-xl border-2 px-3 py-2"
                    style={{ borderColor: k === 'mede' ? C.ok : C.risk }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: 0.3 + c * 0.15, ease: EASE_OUT }}>
                    <span className="font-semibold" style={{ color: k === 'mede' ? C.ok : C.risk }}>{k === 'mede' ? 'mede' : 'não mede'}</span>
                    <span className="text-gray-100">{MEASURES[k]}</span>
                </motion.div>
            ))}
        </div>
        <span className="text-[16px] text-gray-200">CG do cereal de IG 65: <b style={{ color: C.glucoseSoft }}>13</b> (20 g) · <b style={{ color: C.glucoseSoft }}>39</b> (60 g)</span>
    </div>
);

export const GlycemicBottom = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    if (step === 4) return <LoadCalc />;
    if (step === 5) return <Limits />;
    const k = KEYS[step];
    return (
        <motion.div key={step} className="flex flex-col gap-1" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: DUR.enter, delay: 0.3 }}>
            <KeyFact color={C.glucose} delay={0.5} className="self-start">
                <CountUp text={k.value} delay={0.3} className="font-display text-[52px] font-bold leading-none" style={{ color: C.glucose }} />
            </KeyFact>
            <span className="text-[16px] leading-tight text-gray-200">{k.caption}</span>
        </motion.div>
    );
};
