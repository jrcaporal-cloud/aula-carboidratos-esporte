import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { DIMMER, FOLD_MAX, HANSEN_ROWS, IMPEY_ROWS, NODES, type SignalNode } from './signal.content';

/**
 * Slide 69 · palco do glicogênio como sinal. Em cima: o dimmer (467 × 103 mmol/kg ps, clicável) e a cascata
 * AMPK → p53 → PGC-1α → mitocôndria, cada nó com o par de barras alto × baixo (vezes o repouso). Com o tanque baixo,
 * pulsos de sinal percorrem a cascata em laço lento (o fluxo é o conteúdo). Embaixo: Hansen 2005 (uma perna × a outra)
 * e o funil de Impey 2018 (sinal em 73–78% dos estudos × desempenho em 37%).
 */

export const SIGNAL_W = 660;
const TRACK_H = 150;
const knobY = (v: number) => TRACK_H * (1 - v / DIMMER.max);

const Dimmer = ({ low, onPick }: { low: boolean; onPick: (low: boolean) => void }) => {
    const reduce = useReducedMotion() ?? false;
    const value = low ? DIMMER.low : DIMMER.high;
    return (
        <div className="flex w-[130px] shrink-0 flex-col gap-2">
            <span className="text-[16px] font-semibold leading-tight" style={{ color: C.glycogenSoft }}>glicogênio<br />mmol/kg ps</span>
            <div className="flex items-start gap-3">
                <div className="relative w-[34px] rounded-full bg-white/[0.08]" style={{ height: TRACK_H }}>
                    <motion.div className="absolute inset-0 origin-bottom rounded-full" style={{ background: C.glycogen }}
                        initial={false} animate={{ scaleY: value / DIMMER.max }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
                    <motion.div className="absolute left-[-8px] top-0 h-[18px] w-[50px] rounded-md border-[3px] border-[#04080F]" style={{ background: C.stone }}
                        initial={false} animate={{ y: knobY(value) - 9 }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_IN_OUT }} />
                </div>
                <div className="relative w-[76px]" style={{ height: TRACK_H }}>
                    {([['alto', DIMMER.high, false], ['baixo', DIMMER.low, true]] as const).map(([label, v, isLow]) => (
                        <button key={label} type="button" onClick={() => onPick(isLow)} aria-pressed={low === isLow}
                            className="absolute left-0 flex -translate-y-1/2 cursor-pointer flex-col items-start text-left"
                            style={{ top: knobY(v), opacity: low === isLow ? 1 : 0.6 }}>
                            <span className="font-display text-[28px] font-semibold leading-none text-white">{v}</span>
                            <span className="text-[16px] text-gray-300">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BAR_H = 70;

const FoldBar = ({ v, color, label, delay, text }: { v: number; color: string; label: string; delay: number; text?: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[16px] font-bold tabular-nums text-white">{text ?? `${br(v, 1)}×`}</span>
            <div className="relative w-[30px] overflow-hidden rounded-md bg-white/[0.07]" style={{ height: BAR_H }}>
                <motion.div className="absolute inset-0 origin-bottom" style={{ background: color }} initial={false}
                    animate={{ scaleY: v / FOLD_MAX }} transition={{ duration: reduce ? 0 : DUR.bar, delay, ease: EASE_OUT }} />
            </div>
            <span className="text-[15px] text-gray-300">{label}</span>
        </div>
    );
};

const NodeCard = ({ n, step }: { n: SignalNode; step: number }) => {
    const shown = step >= n.at;
    const low = step >= 1;
    return (
        <motion.div className="flex w-[104px] flex-col items-center gap-1 rounded-xl border-2 px-1 py-2" initial={false}
            animate={{ opacity: shown ? 1 : 0.6 }} transition={{ duration: DUR.enter }}
            style={{ borderColor: shown ? C.insulin : '#3A4152', background: '#0B1220' }}>
            <span className="font-display font-semibold leading-none text-white" style={{ fontSize: n.name.length > 8 ? 16 : 18 }}>{n.name}</span>
            <span className="text-[15px] leading-tight text-gray-300">{n.read}</span>
            {n.high !== null && n.low !== null && shown ? (
                <div className="mt-1 flex gap-2">
                    <FoldBar v={n.high} color={C.co2} label="alto" delay={0.1} text={n.id === 'pgc' ? '~3×' : undefined} />
                    <FoldBar v={low ? n.low : 0} color={C.insulin} label="baixo" delay={0.35} text={!low ? '?' : n.id === 'pgc' ? '~3×' : undefined} />
                </div>
            ) : (
                <span className="mt-2 text-[16px] leading-snug text-gray-300" style={{ height: BAR_H + 44 }}>{shown ? 'alvo do sinal; não medido aqui' : '?'}</span>
            )}
        </motion.div>
    );
};

/** Pulsos de sinal (azul) correndo pela cascata quando o tanque está baixo. */
const Pulses = ({ on }: { on: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    if (!on || reduce) return null;
    return (
        <div className="pointer-events-none absolute left-0 right-0 top-[62px] h-[14px] [container-type:inline-size]">
            {[0, 1, 2].map(i => (
                <motion.span key={i} className="absolute left-0 top-0 block h-[14px] w-[14px] rounded-full border-2 border-[#04080F]"
                    style={{ background: C.insulin }} initial={{ x: '0cqw', opacity: 0 }}
                    animate={{ x: ['0cqw', '95cqw'], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5, delay: i * 1.1, ease: 'linear' }} />
            ))}
        </div>
    );
};

const Hansen = ({ show }: { show: boolean }) => (
    <motion.div className="flex w-[270px] shrink-0 flex-col gap-1" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <span className="text-[16px] font-semibold text-gray-200">Hansen 2005 · perna LOW × HIGH</span>
        {HANSEN_ROWS.map((r, i) => (
            <motion.div key={r.what} className="flex items-baseline gap-2" initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : -8 }}
                transition={{ duration: DUR.enter, delay: show ? 0.2 + i * 0.15 : 0, ease: EASE_OUT }}>
                <span className="w-[30px] shrink-0 font-display text-[20px] font-bold" style={{ color: r.mark === '=' ? C.stone : C.insulinSoft }}>{r.mark}</span>
                <span className="text-[16px] leading-snug text-gray-100"><b className="text-white">{r.what}</b>: {r.result}</span>
            </motion.div>
        ))}
    </motion.div>
);

const Funnel = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="flex flex-1 flex-col gap-[6px]" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <span className="text-[16px] font-semibold text-gray-200">Impey 2018 · % dos estudos com efeito</span>
            {IMPEY_ROWS.map((r, i) => (
                <div key={r.label} className="flex items-center gap-2">
                    <span className="w-[132px] shrink-0 whitespace-nowrap text-[16px] text-gray-100">{r.label}</span>
                    <div className="relative h-[22px] flex-1 overflow-hidden rounded bg-white/[0.07]">
                        <motion.div className="absolute inset-0 origin-left" style={{ background: r.signal ? C.insulin : C.ok }} initial={false}
                            animate={{ scaleX: show ? r.pct / 100 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? 0.2 + i * 0.15 : 0, ease: EASE_OUT }} />
                    </div>
                    <span className="w-[96px] shrink-0 whitespace-nowrap text-right text-[16px] font-bold tabular-nums" style={{ color: r.signal ? C.insulinSoft : C.ok }}>{r.pct}% de {r.of}</span>
                </div>
            ))}
        </motion.div>
    );
};

export const SignalStage = ({ step, onPick }: { step: number; onPick: (low: boolean) => void }) => (
    <div className="flex h-full flex-col gap-3 px-4 py-3">
        <div className="flex items-start gap-3">
            <Dimmer low={step >= 1} onPick={onPick} />
            <div className="relative flex flex-1 items-start justify-between pt-6">
                <Pulses on={step >= 1} />
                {NODES.map((n, i) => (
                    <div key={n.id} className="relative flex items-start">
                        {i > 0 && <ArrowRight size={20} strokeWidth={3} color={C.insulin} className="absolute left-[-22px] top-[26px]" aria-hidden />}
                        <NodeCard n={n} step={step} />
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-auto flex items-start gap-6 border-t-2 border-white/10 pt-3">
            <Hansen show={step >= 3} />
            <Funnel show={step >= 4} />
        </div>
    </div>
);
