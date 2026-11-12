import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { castOf } from '../kit/cast';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { Tank } from '../kit/Tank';
import { SvgText } from '../kit/ui';
import { GROUPS, HYPER, REVIEW, TANKS, type Finding } from './strength.content';

/**
 * Palco do slide 162 (640 × 420). No alto, o Paulo e a frase dele. No meio, seis tanques (bíceps, coxa e três tipos
 * de fibra) que baixam no seu passo e ficam: nenhum esvazia. Embaixo, à esquerda, os 49 estudos da revisão de força;
 * à direita, a régua do SMD de hipertrofia. Nada some: o último passo mostra tudo.
 */

export const STAGE_W = 640;
export const STAGE_H = 420;

const Fade = ({ show, className = '', style, children }: { show: boolean; className?: string; style?: CSSProperties; children: ReactNode }) => (
    <motion.div className={className} style={style} initial={false}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        {children}
    </motion.div>
);

const Paulo = () => {
    const p = castOf('paulo');
    const Icon = p.icon;
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Icon size={28} strokeWidth={2.2} color={C.text} aria-hidden />
            </span>
            <div className="flex flex-col">
                <span className="text-[18px] text-gray-200"><b className="text-[22px] text-white">{p.name}</b> · {p.age} anos · {p.kg} kg · {p.sport}</span>
                <span className="text-[18px] italic text-gray-100">{p.dilemma}</span>
            </div>
        </div>
    );
};

/** Seis tanques em três grupos; cada um baixa no passo do seu estudo. */
const Tanks = ({ step }: { step: number }) => (
    <div className="flex items-end gap-5">
        {GROUPS.map(g => {
            const tanks = TANKS.filter(t => t.group === g.key);
            const shown = g.key === 'biceps' || step >= g.at;
            return (
                <Fade key={g.key} show={shown} className="flex flex-col gap-1">
                    <span className="whitespace-nowrap text-[16px] font-semibold text-gray-200">{g.label} <span className="font-normal text-gray-300">· {g.who}</span></span>
                    <div className="flex justify-center gap-3">
                        {tanks.map(t => {
                            const done = step >= t.at;
                            return (
                                <div key={t.key} className="flex flex-col items-center">
                                    <Tank level={done ? 1 - t.drop / 100 : 1} value={done ? `−${t.drop}%` : 'cheio'} label={t.label}
                                        width={48} height={90} active={step === t.at} />
                                </div>
                            );
                        })}
                    </div>
                </Fade>
            );
        })}
    </div>
);

const CELL_COLOR: Record<Finding, string> = { positivo: C.glucose, nulo: '#64748B', contra: C.stone };

/** Henselmans 2022: os 49 estudos, um quadrado cada, por desenho. */
/** Índice do primeiro quadrado de cada linha (o escalonamento corre pelos 49). */
const OFFSETS = REVIEW.map((_, i) => REVIEW.slice(0, i).reduce((a, r) => a + r.cells.length, 0));

const Review = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <Fade show={show} className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold text-gray-200">força · 49 estudos da revisão</span>
            {REVIEW.map((r, ri) => (
                <div key={r.key} className="flex items-center gap-2">
                    <span className="w-[74px] shrink-0 text-[15px] text-gray-300">{r.label}</span>
                    <div className="flex w-[270px] flex-wrap gap-[2px]">
                        {r.cells.map((c, i) => {
                            const k = OFFSETS[ri] + i;
                            return (
                                <motion.span key={i} className="block h-[12px] w-[12px] rounded-[2px]"
                                    style={c === 'contra' ? { border: `2px solid ${C.stone}` } : { background: CELL_COLOR[c] }}
                                    initial={false} animate={{ opacity: show ? 1 : 0, scale: show || reduce ? 1 : 0.7 }}
                                    transition={{ delay: show ? stagger(k, 0.2, 0.012) : 0, duration: DUR.enter, ease: EASE_OUT }} />
                            );
                        })}
                    </div>
                </div>
            ))}
            <div className="mt-1 flex gap-3 text-[15px] text-gray-300">
                <span className="flex items-center gap-1"><i className="block h-3 w-3 rounded-[2px]" style={{ background: C.glucose }} />a favor do CHO</span>
                <span className="flex items-center gap-1"><i className="block h-3 w-3 rounded-[2px]" style={{ background: '#64748B' }} />não positivo</span>
                <span className="flex items-center gap-1"><i className="block h-3 w-3 rounded-[2px]" style={{ border: `2px solid ${C.stone}` }} />contra</span>
            </div>
        </Fade>
    );
};

/** Henselmans 2026: os SMD de hipertrofia numa régua com o zero no meio. */
const Ruler = ({ show }: { show: boolean }) => {
    const W = 270;
    const x0 = 14;
    const x1 = W - 14;
    const sx = (v: number) => x0 + ((v + 0.5) / 1) * (x1 - x0);
    return (
        <Fade show={show} className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold text-gray-200">hipertrofia · SMD</span>
            <svg viewBox={`0 0 ${W} 116`} width={W} height={116} role="img" aria-label="SMD 0,15 nos 11 ECRs, 0,15 nos isocalóricos, −0,26 com imagem direta">
                <line x1={sx(0)} x2={sx(0)} y1={2} y2={94} stroke={C.text} strokeWidth={2.5} strokeDasharray="5 5" />
                {HYPER.map((h, i) => {
                    const y = 14 + i * 28;
                    const main = i === 0;
                    return (
                        <motion.g key={h.key} initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : -8 }}
                            transition={{ duration: DUR.enter, delay: show ? 0.3 + i * 0.18 : 0, ease: EASE_OUT }}>
                            <SvgText x={x0 - 12} y={y} text={`${h.label}: ${br(h.smd, 2)}${h.note ? ` · ${h.note}` : ''}`} size={16} color={main ? C.glucoseSoft : '#E5E7EB'} weight={main ? 700 : 600} />
                            <circle cx={sx(h.smd)} cy={y + 12} r={main ? 7 : 6} fill={main ? C.glucose : C.co2} />
                        </motion.g>
                    );
                })}
                <line x1={x0} x2={x1} y1={96} y2={96} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                {[-0.5, 0, 0.5].map(t => <SvgText key={t} x={sx(t)} y={114} text={br(t, t === 0 ? 0 : 1)} anchor="middle" size={16} color={C.muted} weight={500} />)}
            </svg>
        </Fade>
    );
};

export const StrengthStage = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-2" style={{ width: STAGE_W, height: STAGE_H }}>
        <Paulo />
        <Tanks step={step} />
        <div className="mt-auto flex items-end justify-between gap-4">
            <Review show={step >= 3} />
            <Ruler show={step >= 4} />
        </div>
    </div>
);
