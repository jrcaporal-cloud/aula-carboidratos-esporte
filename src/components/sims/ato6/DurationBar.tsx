import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { FictionsChip } from '../kit/chips';
import { BAR_LANES, BAR_MAX, BAR_SEGMENTS, BAR_TICKS, CASES } from './clock.content';

/**
 * Slide 112 · o palco: uma barra horizontal da DURAÇÃO da prova (0 a 10+ h), em escala linear.
 * As faixas do consenso acendem uma por passo e ficam (bochecho → 30–60 → até 90 com mistura); a fronteira de
 * 120 g/h entra num trilho tracejado acima da faixa longa e a ultramaratona (ISSN) num trilho abaixo.
 * No último passo, Marina e Diego (casos fictícios) viram pinos rotulados na barra.
 */

const DARK = '#04080F';
const TRACK = '#1E293B';
const LANE_H = 26;
const MAIN_H = 40;
const GAP = 4;

const pos = (h: number) => `${(h / BAR_MAX) * 100}%`;
const span = (from: number, to: number) => ({ left: pos(from), width: `calc(${((to - from) / BAR_MAX) * 100}% - 3px)` });

/** Uma linha da barra: rótulo à esquerda (a legenda do trilho), o trilho à direita. */
const Row = ({ label, height, children }: { label: ReactNode; height: number; children?: ReactNode }) => (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3" style={{ height }}>
        <span className="flex justify-end text-right text-[16px] font-semibold leading-tight text-gray-200">{label}</span>
        <div className="relative h-full">{children}</div>
    </div>
);

/** Trilho extra sobre a faixa longa (2,5 h em diante): tracejado = fronteira experimental. */
const Lane = ({ show, text, color, dashed }: { show: boolean; text: string; color: string; dashed: boolean }) => (
    <motion.div className="absolute inset-y-0 flex items-center rounded-md border-2 px-3 text-[16px] font-semibold"
        style={{ ...span(2.5, BAR_MAX), borderColor: color, borderStyle: dashed ? 'dashed' : 'solid', color }}
        initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        {text}
    </motion.div>
);

/** Pino de um caso fictício: círculo com a letra sobre a barra principal, na hora em que a prova termina. */
const PinDot = ({ hours, letter, delay }: { hours: number; letter: string; delay: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.span className="absolute top-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-[17px] font-extrabold"
            style={{ left: pos(hours), x: '-50%', y: '-50%', color: DARK, border: `3px solid ${DARK}` }}
            initial={reduce ? false : { opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 24, delay }}>
            {letter}
        </motion.span>
    );
};

/** Rótulo do pino, na linha de baixo e alinhado à mesma hora (o da direita cresce para a esquerda). */
const PinLabel = ({ c, delay }: { c: (typeof CASES)[number]; delay: number }) => {
    const right = c.hours > BAR_MAX / 2;
    return (
        <motion.div className="absolute top-1/2 flex items-center gap-2 whitespace-nowrap"
            style={{ left: pos(c.hours), x: right ? 'calc(-100% + 16px)' : '-16px', y: '-50%' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, delay, ease: EASE_OUT }}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[16px] font-extrabold" style={{ color: DARK }}>{c.letter}</span>
            <span className="text-[16px] text-gray-100"><strong className="text-white">{c.label}</strong> · {c.race} · {c.weight}</span>
        </motion.div>
    );
};

export const DurationBar = ({ step }: { step: number }) => (
    <div className="flex flex-col" style={{ gap: GAP }}>
        <Row label={step >= BAR_LANES.fronteira.at ? BAR_LANES.fronteira.label : ''} height={LANE_H}>
            <Lane show={step >= BAR_LANES.fronteira.at} text={BAR_LANES.fronteira.text} color={BAR_LANES.fronteira.color} dashed />
        </Row>
        <Row label="consenso COI" height={MAIN_H}>
            {BAR_SEGMENTS.map(s => {
                const lit = step >= s.at;
                const current = step === s.at;
                return (
                    <motion.div key={s.id} className="absolute inset-y-0 flex items-center justify-center overflow-hidden rounded-md text-[17px] font-bold"
                        style={{ ...span(s.from, s.to), color: DARK, outline: current ? '3px solid #F9FAFB' : 'none', outlineOffset: 2 }}
                        initial={false} animate={{ backgroundColor: lit ? s.color : TRACK }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        {lit && <span className="whitespace-nowrap px-1">{s.text}</span>}
                    </motion.div>
                );
            })}
            {step >= 4 && CASES.map((c, i) => <PinDot key={c.id} hours={c.hours} letter={c.letter} delay={0.25 + i * 0.15} />)}
        </Row>
        <Row label={step >= BAR_LANES.ultra.at ? BAR_LANES.ultra.label : ''} height={LANE_H}>
            <Lane show={step >= BAR_LANES.ultra.at} text={BAR_LANES.ultra.text} color={BAR_LANES.ultra.color} dashed={false} />
        </Row>
        <Row label="horas de prova" height={20}>
            <span className="absolute inset-x-0 top-0 h-[2px] bg-white/30" />
            {BAR_TICKS.map(t => (
                <span key={t.h} className="absolute top-0 -translate-x-1/2 font-mono text-[16px] leading-[20px] text-gray-300" style={{ left: pos(t.h) }}>{t.text}</span>
            ))}
        </Row>
        <Row label={step >= 4 ? <FictionsChip /> : ''} height={28}>
            {step >= 4 && CASES.map((c, i) => <PinLabel key={c.id} c={c} delay={0.5 + i * 0.15} />)}
        </Row>
    </div>
);
