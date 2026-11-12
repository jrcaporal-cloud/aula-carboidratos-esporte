import { motion, useReducedMotion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { KIND, RULER, STUDY_BAND, WEEK, type SessionKind } from './planner.content';

/**
 * Palco do slide 143: a semana em colunas. Em cima, a sessão (botão: o clique troca o tipo); no meio, o glicogênio
 * ao começar a sessão numa régua em mmol/kg ps (Areta 2018), com as linhas ~560 / 462 / ~210 atravessando a semana;
 * embaixo, o carboidrato do dia e o contador de sessões com pouco contra a faixa dos estudos (30–50%).
 */

const CHART_H = 218;
const MAX = 600;
const AXIS_W = 92;
const y = (v: number) => CHART_H * (1 - v / MAX);

const CARD: Record<SessionKind, { bg: string; fg: string; border: string }> = {
    neutral: { bg: 'rgba(255,255,255,0.06)', fg: C.text, border: 'rgba(255,255,255,0.22)' },
    leve: { bg: 'rgba(255,255,255,0.06)', fg: C.text, border: 'rgba(255,255,255,0.34)' },
    chave: { bg: C.glucose, fg: '#04080F', border: C.glucose },
    low: { bg: '#04080F', fg: C.caveat, border: C.caveat },
};

const CHO: Record<'alto' | 'normal' | 'baixo', { bg: string; fg: string; border: string }> = {
    alto: { bg: C.glucose, fg: '#04080F', border: C.glucose },
    normal: { bg: `${C.glucose}38`, fg: C.glucoseSoft, border: `${C.glucose}99` },
    baixo: { bg: 'transparent', fg: C.caveat, border: C.caveat },
};

const Column = ({ i, kind, onPick }: { i: number; kind: SessionKind; onPick: (i: number) => void }) => {
    const reduce = useReducedMotion() ?? false;
    const look = KIND[kind];
    const card = CARD[kind];
    const cho = CHO[look.cho];
    return (
        <div className="flex flex-1 flex-col items-stretch gap-2">
            <button type="button" onClick={() => onPick(i)} aria-label={`${WEEK[i].day}: ${WEEK[i].session}, ${look.tag}`}
                className="flex h-[70px] cursor-pointer flex-col items-center justify-center rounded-xl border-[3px] leading-tight transition-[transform,background-color,color,border-color] duration-200 active:scale-[0.97]"
                style={{ background: card.bg, color: card.fg, borderColor: card.border }}>
                <span className="text-[16px] font-semibold opacity-90">{WEEK[i].day}</span>
                <span className="text-[16px] font-bold">{WEEK[i].session}</span>
                <span className="flex items-center gap-1 text-[16px] font-semibold">{kind === 'low' && <Moon size={14} strokeWidth={3} />}{look.tag}</span>
            </button>
            <div className="relative" style={{ height: CHART_H }}>
                <motion.div className="absolute inset-x-[14px] bottom-0 rounded-t-lg"
                    style={{ height: CHART_H, background: C.glycogen, transformOrigin: 'center bottom', border: kind === 'chave' ? `3px solid ${C.glucose}` : 'none' }}
                    initial={false} animate={{ scaleY: look.glycogen / MAX }}
                    transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
            </div>
            <span className="rounded-lg border-2 py-0.5 text-center text-[16px] font-bold"
                style={{ background: cho.bg, color: cho.fg, borderColor: cho.border }}>{look.cho}</span>
        </div>
    );
};

/** Linhas da régua atravessando a semana. */
const Ruler = ({ step }: { step: number }) => (
    <div className="pointer-events-none absolute inset-x-0" style={{ top: 78, height: CHART_H }}>
        <span className="absolute left-0 top-[-24px] text-[16px] text-gray-300">mmol/kg ps</span>
        {RULER.map(r => (
            <motion.div key={r.label} className="absolute inset-x-0 flex items-center" style={{ top: y(r.value) - 12 }}
                initial={false} animate={{ opacity: step >= r.at ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === r.at ? 0.5 : 0 }}>
                <span className="w-[84px] text-[19px] font-bold tabular-nums" style={{ color: r.value > 500 ? C.glucoseSoft : r.value < 300 ? C.caveat : '#FFFFFF' }}>{r.label}</span>
                <span className="h-0 flex-1 border-t-[3px] border-dashed" style={{ borderColor: r.value > 500 ? `${C.glucose}cc` : r.value < 300 ? `${C.caveat}cc` : 'rgba(255,255,255,0.55)' }} />
            </motion.div>
        ))}
    </div>
);

/** Contador de sessões com pouco contra a faixa dos estudos. */
const Counter = ({ low, show }: { low: number; show: boolean }) => {
    const pct = Math.round((low / WEEK.length) * 100);
    const inBand = pct >= STUDY_BAND.lo && pct <= STUDY_BAND.hi;
    return (
        <motion.div className="flex items-center gap-4" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <span className="w-[230px] shrink-0 text-[18px] font-semibold text-gray-100">
                com pouco: <span className="font-bold tabular-nums" style={{ color: inBand ? C.ok : C.risk }}>{low} de 7 ({pct}%)</span>
            </span>
            <div className="relative h-[18px] flex-1 rounded-md" style={{ background: 'rgba(255,255,255,0.07)', containerType: 'inline-size' }}>
                <div className="absolute inset-y-0 rounded-md border-2" style={{ left: `${STUDY_BAND.lo}%`, width: `${STUDY_BAND.hi - STUDY_BAND.lo}%`, borderColor: C.stone, background: `${C.stone}2E` }} />
                <motion.div className="absolute -top-[5px] left-0 h-[28px] w-[6px] rounded-sm" style={{ background: inBand ? C.ok : C.risk }}
                    initial={false} animate={{ x: `${pct}cqw` }} transition={{ duration: DUR.morph, ease: EASE_OUT }} />
            </div>
            <span className="shrink-0 text-[16px] text-gray-300">estudos: 30–50%</span>
        </motion.div>
    );
};

export const PlannerBoard = ({ step, kindOf, onPick }: { step: number; kindOf: (i: number) => SessionKind; onPick: (i: number) => void }) => {
    const low = WEEK.filter((_, i) => kindOf(i) === 'low').length;
    return (
        <div className="flex flex-col gap-3">
            <div className="relative flex gap-1" style={{ paddingLeft: AXIS_W }}>
                {WEEK.map((d, i) => <Column key={d.day} i={i} kind={kindOf(i)} onPick={onPick} />)}
                <Ruler step={step} />
                <span className="absolute bottom-[4px] left-0 text-[16px] text-gray-300">CHO do dia</span>
            </div>
            <Counter low={low} show={step >= 2} />
            <motion.span className="text-[16px] text-gray-300" initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: 0.4 }}>
                clique numa sessão para trocar: leve → chave → pouco
            </motion.span>
        </div>
    );
};
