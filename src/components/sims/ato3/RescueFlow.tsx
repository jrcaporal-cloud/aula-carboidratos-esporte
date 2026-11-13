import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { ChainCell as Cell, ScaleBar as Bar } from './chainStrip';
import { FORCE, LANES } from './rescue.content';

/**
 * Slide 49 · o palco em 4 faixas, uma por elo: 1 na exaustão o açúcar do sangue acabou → 2 três resgates, três tempos →
 * 3 o músculo não era o limite (glicogênio parado, ¾ do CHO vindo da bolsa) → 4 o cérebro sente a hipoglicemia (força).
 * COGGAN1987 nas faixas 1–3, NYBO2003 na 4.
 */

/** Régua de glicemia (2–6 mM): o ponteiro sai de 5,0 e para em 3,1 na exaustão. */
const G_MIN = 2;
const G_MAX = 6;
const gx = (mm: number) => ((mm - G_MIN) / (G_MAX - G_MIN)) * 100;

const Glycemia = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-center gap-4">
            <div className="relative h-[52px] flex-1 [container-type:inline-size]">
                <div className="absolute inset-x-0 top-[14px] h-[10px] rounded-full bg-white/10" />
                <div className="absolute top-[14px] h-[10px] rounded-l-full" style={{ left: 0, width: `${gx(3.5)}%`, background: 'rgba(239,68,68,0.35)' }} />
                {[2, 3, 4, 5, 6].map(v => (
                    <span key={v} className="absolute top-[30px] -translate-x-1/2 text-[16px] tabular-nums text-gray-400" style={{ left: `${gx(v)}%` }}>{v}</span>
                ))}
                <span className="absolute top-[11px] ml-[-8px] h-[16px] w-[16px] rounded-full border-[3px] border-gray-300" style={{ left: `${gx(5)}%` }} />
                <motion.span className="absolute top-[8px] ml-[-3px] h-[22px] w-[6px] rounded-sm" style={{ background: C.risk, left: `${gx(3.1)}%` }}
                    initial={reduce ? false : { x: `${gx(5) - gx(3.1)}cqw` }} animate={{ x: '0cqw' }}
                    transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }} />
            </div>
            <div className="flex w-[150px] shrink-0 flex-col leading-tight">
                <KeyFact color={C.risk} delay={1.2}><span className="font-display text-[24px] font-bold" style={{ color: C.risk }}>3,1 mM</span></KeyFact>
                <span className="text-[16px] text-gray-300">na fadiga; era 5,0</span>
            </div>
        </div>
    );
};

/** Barra 100% do carboidrato oxidado na infusão: ¾ veio da bolsa. */
const Share = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <span className="w-[108px] shrink-0 text-[16px] font-semibold text-gray-200">CHO oxidado</span>
                <div className="flex h-[28px] flex-1 overflow-hidden rounded-md">
                    <motion.div className="flex h-full items-center px-2 text-[16px] font-bold" style={{ width: '75%', background: C.glucose, color: '#04080F', transformOrigin: 'left center' }}
                        initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, delay: 0.3, ease: EASE_OUT }}>
                        ~¾ da bolsa · 1,13 g/min
                    </motion.div>
                    <div className="h-full flex-1 bg-white/15" />
                </div>
            </div>
            <span className="text-[16px] leading-snug text-gray-200">
                glicogênio do vasto lateral: <b style={{ color: C.glycogenSoft }}>~40 mmol/kg, sem mudar</b> · glicemia 5,1 mM
            </span>
        </div>
    );
};

export const RescueFlow = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-4 gap-2">
        <Cell n={1} title="O açúcar do sangue acabou" note="70% VO₂máx · 170 min" show={step >= 0} born={step === 0}>
            <Glycemia />
        </Cell>
        <Cell n={2} title="Três resgates" note="tempo extra até nova fadiga" show={step >= 1} born={step === 1}>
            {LANES.map((l, i) => <Bar key={l.key} label={l.label} value={l.value} text={l.text} max={50} color={l.color} delay={0.25 + i * 0.15} labelWidth={92} thin />)}
        </Cell>
        <Cell n={3} title="O músculo não era o limite" note="com glicose na veia" show={step >= 2} born={step === 2}>
            <Share />
        </Cell>
        <Cell n={4} title="O cérebro sente a falta" note="força de 2 min após 3 h" show={step >= 3} born={step === 3}>
            {FORCE.map((f, i) => <Bar key={f.key} label={f.label} value={f.value} text={f.text} max={260} color={f.color} delay={0.25 + i * 0.15} labelWidth={92} thin />)}
        </Cell>
    </div>
);
