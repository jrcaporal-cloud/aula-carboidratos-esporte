import { motion, useReducedMotion } from 'framer-motion';
import { Check, CircleHelp } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow, Wipe } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { Panel, SvgText } from '../kit/ui';
import { BALSOM, BALSOM_GAIN, BALSOM_RATIO, COLUMNS, LEATT, LEATT_SAVED, XIE_ROWS } from './teamSport.content';

/**
 * Tríptico do slide 161: músculo → tiro → jogada. Cada coluna abre (Wipe) no seu passo e fica inteira;
 * no último passo, cada uma ganha o veredito no pé. A nitidez cai da esquerda para a direita.
 */

const Big = ({ text, color, run }: { text: string; color: string; run: boolean }) => (
    <CountUp text={text} run={run} delay={0.5} className="font-display text-[44px] font-bold leading-none" style={{ color }} />
);

/** Leatt 1989: glicogênio gasto no jogo, placebo × CHO. */
const Muscle = ({ show }: { show: boolean }) => (
    <div className="flex flex-col gap-1">
    <span className="text-[16px] text-gray-300">glicogênio gasto no jogo · mmol/kg ps</span>
    <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
            {[{ label: 'placebo', v: LEATT.placebo, color: C.co2 }, { label: 'CHO 7%', v: LEATT.cho, color: C.glucose }].map((r, i) => (
                <div key={r.label} className="flex items-center gap-2">
                    <span className="w-[64px] text-[16px] text-gray-200">{r.label}</span>
                    <div className="relative h-[26px] w-[84px] overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <Grow value={show ? r.v / LEATT.placebo : 0} color={r.color} delay={0.25 + i * 0.15} />
                    </div>
                    <span className="font-mono text-[18px] tabular-nums text-white">{r.v}</span>
                </div>
            ))}
        </div>
        <KeyFact color={C.glycogen} delay={0.6} className="mr-3"><Big text={`−${LEATT_SAVED}%`} color={C.glycogenSoft} run={show} /></KeyFact>
    </div>
    </div>
);

const Note = ({ children }: { children: ReactNode }) => <span className="text-[16px] leading-snug text-gray-300">{children}</span>;

/** Balsom 1999a: tiros de 6 s completados; 1 quadrado = 10 tiros. */
const Sprints = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    const rows = [{ label: 'glicogênio baixo', v: BALSOM.low, sd: BALSOM.lowSd, color: C.co2 }, { label: 'glicogênio alto', v: BALSOM.high, sd: BALSOM.highSd, color: C.glycogen }];
    return (
        <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
                {rows.map((r, ri) => (
                    <div key={r.label} className="flex flex-col gap-1">
                        <span className="text-[16px] text-gray-200">{r.label} · <b className="font-mono text-white">{r.v} ± {r.sd}</b></span>
                        <div className="flex w-[170px] flex-wrap gap-[3px]">
                            {Array.from({ length: Math.round(r.v / 10) }, (_, i) => (
                                <motion.span key={i} className="block h-[12px] w-[12px] rounded-[2px]" style={{ background: r.color }}
                                    initial={false} animate={{ opacity: show ? 1 : 0, scale: show || reduce ? 1 : 0.8 }}
                                    transition={{ delay: show ? stagger(i, 0.2 + ri * 0.25, 0.015) : 0, duration: DUR.enter, ease: EASE_OUT }} />
                            ))}
                        </div>
                    </div>
                ))}
                <span className="text-[15px] text-gray-300">1 quadrado = 10 tiros de 6 s</span>
            </div>
            <div className="flex flex-col items-end gap-1">
                <KeyFact color={C.glycogen} delay={0.6} className="mr-3"><Big text={`${br(BALSOM_RATIO)}×`} color={C.glycogenSoft} run={show} /></KeyFact>
                <span className="font-mono text-[16px] text-white">+{BALSOM_GAIN}%</span>
            </div>
        </div>
    );
};

/** Xie 2026: g de Hedges e IC 95%; o do carboidrato cruza o zero. */
const Skill = ({ show }: { show: boolean }) => {
    const W = 336;
    const x0 = 96;
    const x1 = W - 12;
    const sx = (v: number) => x0 + ((v + 0.4) / 1.2) * (x1 - x0);
    return (
        <svg viewBox={`0 0 ${W} 110`} width={W} height={110} role="img" aria-label="Carboidrato g 0,26, IC −0,09 a 0,61; cafeína g 0,04, IC −0,21 a 0,29">
            <line x1={sx(0)} x2={sx(0)} y1={4} y2={88} stroke={C.text} strokeWidth={2.5} strokeDasharray="5 5" />
            <SvgText x={0} y={106} text="g de Hedges" size={16} color={C.muted} weight={500} />
            {[0, 0.25, 0.5].map(t => <SvgText key={t} x={sx(t)} y={106} text={br(t, t === 0 ? 0 : 2)} anchor="middle" size={16} color={C.muted} weight={500} />)}
            {XIE_ROWS.map((r, i) => {
                const y = 18 + i * 40;
                const color = i === 0 ? C.glucose : C.co2;
                return (
                    <motion.g key={r.key} initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : -10 }}
                        transition={{ duration: DUR.enter, delay: show ? 0.3 + i * 0.2 : 0, ease: EASE_OUT }}>
                        <SvgText x={0} y={y + 6} text={r.label} size={16} color={i === 0 ? C.glucoseSoft : '#E5E7EB'} />
                        <line x1={sx(r.lo)} x2={sx(r.hi)} y1={y} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />
                        <polygon points={`${sx(r.lo)},${y} ${sx(r.g)},${y - 9} ${sx(r.hi)},${y} ${sx(r.g)},${y + 9}`} fill={color} />
                        <SvgText x={x1} y={y + 24} text={r.text} anchor="end" size={16} color="#F3F4F6" />
                    </motion.g>
                );
            })}
        </svg>
    );
};

const Verdict = ({ show, text, tone }: { show: boolean; text: string; tone: 'ok' | 'stone' }) => {
    const color = tone === 'ok' ? C.ok : C.stone;
    const Icon = tone === 'ok' ? Check : CircleHelp;
    return (
        <motion.div className="flex items-center gap-2 self-start rounded-lg border-2 px-2 py-1 text-[17px] font-semibold"
            style={{ borderColor: color, color }}
            initial={false} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <Icon size={18} strokeWidth={3} aria-hidden />{text}
        </motion.div>
    );
};

const GRAPHS: readonly ((show: boolean) => ReactNode)[] = [
    show => <><Muscle show={show} /><Note>0,5 L a 7% (≈70 g) · glicemia igual · desempenho não medido</Note></>,
    show => <Sprints show={show} />,
    show => <><Skill show={show} /><Note>p = 0,118 · 67 efeitos · um grupo pesou muito</Note></>,
];

export const TeamColumns = ({ step }: { step: number }) => (
    <div className="flex min-h-0 flex-1 gap-4">
        {COLUMNS.map((c, i) => (
            <Panel key={c.key} state={step === i ? 'active' : 'idle'} glow={C.glucose} className="min-w-0 flex-1">
                <Wipe show={step >= i} from="left" className="flex h-full flex-col gap-[6px] px-4 py-2">
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[24px] font-semibold text-white">{c.title}</span>
                        <span className="text-[16px] text-gray-300">{c.who}</span>
                    </div>
                    <span className="font-mono text-[14px] text-gray-300">{c.design}</span>
                    <div className="mt-1 flex flex-col gap-2">{GRAPHS[i](step >= i)}</div>
                    <div className="mt-auto"><Verdict show={step >= 3} text={c.verdict} tone={c.verdictTone} /></div>
                </Wipe>
            </Panel>
        ))}
    </div>
);
