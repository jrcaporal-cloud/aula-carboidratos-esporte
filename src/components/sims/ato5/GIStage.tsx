import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountUp } from '../kit/CountUp';
import { br } from '../kit/format';
import { BURDON, ES_AXIS, FOODS, RANGES, THOMAS } from './preGI.content';

/**
 * Palco do slide 86. No alto: o estudo de 1991 (lentilha × batata) e os 19 estudos de Burdon; o quadrado âmbar
 * de Thomas viaja do cartão para a grade (layoutId). Embaixo: o eixo do tamanho de efeito, com a faixa dos
 * efeitos agrupados sem e com CHO durante (negativo = favorece IG baixo). Tudo acumula.
 */

const Box = ({ title, color, children, className = '' }: { title: string; color: string; children: ReactNode; className?: string }) => (
    <div className={`flex flex-col gap-2 rounded-xl border-2 px-3 py-2 ${className}`} style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
        <span className="text-[16px] font-bold" style={{ color }}>{title}</span>
        {children}
    </div>
);

const TILE = 30;

const ThomasCard = () => (
    <Box title={THOMAS.title} color={C.glucose} className="w-[272px] shrink-0">
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
                {FOODS.map(f => (
                    <div key={f.id} className="flex items-center gap-2">
                        <span className="w-[72px] text-[18px] font-semibold text-white">{f.name}</span>
                        <span className="rounded-md px-2 py-0.5 font-mono text-[16px] font-bold"
                            style={{ background: f.win ? C.glucose : 'rgba(255,255,255,0.14)', color: f.win ? '#04080F' : C.text }}>{f.gi}</span>
                    </div>
                ))}
            </div>
            <span className="ml-auto h-[30px] w-[30px] rounded" style={{ background: C.glucose }} aria-hidden />
        </div>
        <div className="flex flex-col gap-0.5">
            <CountUp text={THOMAS.value} delay={0.3} className="whitespace-nowrap font-display text-[36px] font-bold leading-none" style={{ color: C.glucose }} />
            <span className="text-[16px] leading-tight text-gray-100">{THOMAS.caption}</span>
        </div>
    </Box>
);

const Tiles = ({ step }: { step: number }) => {
    const on = step >= 1;
    return (
        <Box title={BURDON.title} color={C.glucoseSoft} className="min-w-0 flex-1">
            <div className="grid grid-cols-7 gap-[7px]" style={{ width: 7 * TILE + 6 * 7 }}>
                {Array.from({ length: BURDON.studies }, (_, i) => (
                    <motion.span key={i} className="rounded" style={{ width: TILE, height: TILE, background: i === 0 ? C.glucose : 'rgba(148,163,184,0.5)' }}
                        initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }}
                        transition={{ duration: DUR.enter, delay: on && step === 1 ? (i === 0 ? 0.1 : stagger(i, 0.3, 0.03)) : 0, ease: EASE_OUT }} />
                ))}
            </div>
            <motion.span className="text-[16px] text-gray-200" initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on ? 0.6 : 0 }}>
                {BURDON.founder}
            </motion.span>
        </Box>
    );
};

/* ---- eixo do tamanho de efeito (SVG em px de projeto) ---- */
const ES = { w: 612, h: 186, x0: 182, x1: 590, rowY: [54, 106] as const, axisY: 146 } as const;
const xOf = (v: number) => ES.x0 + ((v - ES_AXIS.min) / (ES_AXIS.max - ES_AXIS.min)) * (ES.x1 - ES.x0);

const RangeRow = ({ r, i, step, reduce }: { r: (typeof RANGES)[number]; i: number; step: number; reduce: boolean }) => {
    const on = step >= r.at;
    const y = ES.rowY[i];
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.text }}>
            <SvgText x={8} y={y + 6} text={r.label} size={17} color="#F3F4F6" weight={700} />
            <SvgText x={8} y={y + 28} text={r.note} size={16} color={C.caveat} weight={600} />
            <motion.rect x={xOf(r.lo)} y={y - 9} width={xOf(r.hi) - xOf(r.lo)} height={18} rx={9} fill={C.stone}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={false} animate={{ scaleX: on ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : DUR.bar, delay: on && step === r.at ? 0.2 : 0, ease: EASE_IN_OUT }} />
            <SvgText x={xOf(r.lo) - 6} y={y + 6} text={br(r.lo, 2)} anchor="end" size={16} color={C.caveat} weight={700} />
            <SvgText x={xOf(r.hi) + 6} y={y + 6} text={br(r.hi, 2)} size={16} color={C.caveat} weight={700} />
        </motion.g>
    );
};

const EffectAxis = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const on = step >= 1;
    return (
        <motion.div className="rounded-xl border-2 px-1 pt-2" style={{ borderColor: 'rgba(255,255,255,0.18)' }}
            initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <svg viewBox={`0 0 ${ES.w} ${ES.h}`} width={ES.w} height={ES.h} className="block" role="img"
                aria-label="Faixa dos tamanhos de efeito agrupados: sem CHO durante, −0,36 a −0,17; com CHO durante, −0,67 a 0,11; nenhum significativo">
                <SvgText x={8} y={20} text="Burdon 2017 · tamanho de efeito" size={16} color={C.glucoseSoft} weight={700} />
                <SvgText x={xOf(0) - 10} y={20} text="← favorece IG baixo" anchor="end" size={16} color={C.muted} weight={600} />
                <SvgText x={xOf(0) + 10} y={20} text="IG alto →" size={16} color={C.muted} weight={600} />
                <line x1={xOf(0)} x2={xOf(0)} y1={30} y2={ES.axisY} stroke={C.text} strokeWidth={3} />
                <line x1={ES.x0} x2={ES.x1} y1={ES.axisY} y2={ES.axisY} stroke={C.co2} strokeWidth={3} />
                {ES_AXIS.ticks.map(t => (
                    <g key={t}>
                        <line x1={xOf(t)} x2={xOf(t)} y1={ES.axisY} y2={ES.axisY + 8} stroke={C.co2} strokeWidth={3} />
                        <SvgText x={xOf(t)} y={ES.axisY + 28} text={t === 0 ? '0 · sem efeito' : br(t, 1)} anchor="middle" size={16} color={t === 0 ? '#fff' : C.muted} weight={t === 0 ? 700 : 500} />
                    </g>
                ))}
                {RANGES.map((r, i) => <RangeRow key={r.id} r={r} i={i} step={step} reduce={reduce} />)}
                <SvgText x={8} y={ES.axisY + 28} text="faixa por desfecho" size={16} color={C.muted} />
            </svg>
        </motion.div>
    );
};

export const GIStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-3 px-3 py-3">
        <div className="flex gap-3">
            <ThomasCard />
            <Tiles step={step} />
        </div>
        <EffectAxis step={step} />
    </div>
);
