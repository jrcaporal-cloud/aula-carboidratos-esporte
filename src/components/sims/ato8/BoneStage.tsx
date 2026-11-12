import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useMorphPath, type Pt } from '../kit/useMorphPath';
import { BONE_LINES, HAMMOND_BARS, HEIKURA_BARS, type BoneLine } from './bone.content';

/**
 * Palco do Osso: no alto, o P1NP do dia 0 ao dia 6 nas três dietas de Fensham (as linhas saem planas e se dobram
 * no passo 2; só os extremos são dados). Embaixo, os cartões de Heikura 2019 (tamanho de efeito) e Hammond 2019
 * (glicogênio 17 h depois + βCTX), que entram e ficam. O esquema do REDs fica no painel.
 */

const W = 608;
const H = 232;
const X0 = 62;
const X1 = 300;
const sy = (p: number) => 36 + (100 - p) * 6.1;

const LinePath = ({ line, bent }: { line: BoneLine; bent: boolean }) => {
    const end = bent ? line.end : 100;
    const pts: Pt[] = [[X0, sy(100)], [(X0 + X1) / 2, sy((100 + end) / 2)], [X1, sy(end)]];
    const ref = useMorphPath(pts, 800);
    return <path ref={ref} fill="none" stroke={line.color} strokeWidth={6} strokeLinecap="round" />;
};

const Chart = ({ bent }: { bent: boolean }) => (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="P1NP em jejum do dia 0 ao dia 6 nas três dietas">
        <SvgText x={0} y={14} text="P1NP em jejum (% do início)" size={16} weight={600} color="#CBD5E1" />
        {[100, 90, 80].map(p => (
            <g key={p}>
                <line x1={X0} x2={X1} y1={sy(p)} y2={sy(p)} stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
                <SvgText x={X0 - 12} y={sy(p) + 6} text={`${p}%`} anchor="end" size={16} color={C.muted} weight={500} />
            </g>
        ))}
        <SvgText x={X0} y={H - 4} text="dia 0" anchor="middle" size={16} color="#CBD5E1" />
        <SvgText x={X1} y={H - 4} text="dia 6" anchor="middle" size={16} color="#CBD5E1" />
        {BONE_LINES.map(l => <LinePath key={l.id} line={l} bent={bent} />)}
        {BONE_LINES.map(l => <circle key={l.id} cx={X0} cy={sy(100)} r={7} fill={l.color} />)}
        {BONE_LINES.map((l, i) => {
            const y = bent ? sy(l.end) : sy(100) - 8 + i * 40;
            return (
                <motion.g key={l.id} initial={false} animate={{ y }} transition={{ duration: DUR.draw, ease: EASE_OUT }}>
                    {bent && <motion.circle cx={X1} cy={0} r={8} fill={l.color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, duration: DUR.enter }} />}
                    <SvgText x={X1 + 22} y={-4} text={l.label} size={17} weight={600} color={l.color} />
                    {bent && <SvgText x={X1 + 22} y={18} text={l.effect} size={18} weight={700} color="#F3F4F6" />}
                </motion.g>
            );
        })}
    </svg>
);

const Card = ({ show, title, sub, children }: { show: boolean; title: string; sub: string; children: ReactNode }) => (
    <motion.div className="flex flex-col gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}
        initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }} transition={{ duration: DUR.enter, ease: EASE_OUT }} aria-hidden={!show}>
        <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-bold text-white">{title}</span>
            <span className="text-[16px] text-gray-300">{sub}</span>
        </div>
        {show && children}
    </motion.div>
);

const Bar = ({ label, frac, text, color, i }: { label: string; frac: number; text: string; color: string; i: number }) => (
    <div className="flex h-[24px] items-center gap-2">
        <span className="w-[118px] shrink-0 whitespace-nowrap text-[16px] leading-none text-gray-200">{label}</span>
        <div className="relative h-[16px] flex-1 overflow-hidden rounded-[4px]" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="absolute inset-y-0 left-0" style={{ width: `${frac * 100}%` }}>
                <Grow value={1} color={color} delay={stagger(i, 0.15, 0.12)} />
            </div>
        </div>
        <span className="w-[40px] shrink-0 text-right text-[17px] font-bold tabular-nums" style={{ color }}>{text}</span>
    </div>
);

export const BoneStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2">
        <Chart bent={step >= 1} />
        <div className="mt-auto grid grid-cols-2 gap-3">
            <Card show={step >= 2} title="Heikura 2019 · LCHF × CHO" sub="tamanho de efeito em jejum (d)">
                {HEIKURA_BARS.map((b, i) => <Bar key={b.label} label={b.label} frac={b.d / 1.5} text={b.text} color={C.fat} i={i} />)}
            </Card>
            <Card show={step >= 3} title="Hammond 2019 · 17 h depois" sub="glicogênio muscular (mmol/kg ps)">
                {HAMMOND_BARS.map((b, i) => (
                    <Bar key={b.label} label={b.label} frac={b.v / 340} text={`${b.v}`} color={b.color} i={i} />
                ))}
            </Card>
        </div>
    </div>
);

/** REDs 2023: duas entradas para o mesmo modelo (sem limiar numérico). */
export const RedsInputs = () => (
    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.enter, delay: 0.2, ease: EASE_OUT }}>
        <div className="flex flex-col gap-2">
            <span className="rounded-lg border-[3px] whitespace-nowrap px-2 py-[2px] text-[16px] font-semibold text-white" style={{ borderColor: C.stone }}>baixa energia</span>
            <span className="rounded-lg border-[3px] whitespace-nowrap px-2 py-[2px] text-[16px] font-semibold text-white" style={{ borderColor: C.glucose }}>baixo carboidrato</span>
        </div>
        <ArrowRight size={30} strokeWidth={3} color="#F3F4F6" />
        <span className="rounded-xl border-[3px] border-white px-3 py-2 font-display text-[28px] font-bold leading-none text-white">REDs</span>
    </motion.div>
);
