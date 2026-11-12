import { motion, useReducedMotion } from 'framer-motion';
import { Droplet } from 'lucide-react';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { castOf } from '../kit/cast';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { useTween } from '../kit/useTween';
import { SvgText } from '../kit/ui';
import {
    FOO_DAYS, LEVERS, PLASMA_GAIN_ML, SWEAT_ML, TIAGO_AFTER_FIBER, TIAGO_START, TIAGO_TARGET, WATER_MAX, WATER_MIN,
} from './weightCut.content';

/**
 * Palco do slide 164 (640 × 420). À esquerda, o Tiago (fictício) na balança e as três alavancas rápidas; cada uma
 * acende no passo do seu estudo. À direita, acumulam: a razão glicogênio : água (piso 3, até 17), o "cantil" que
 * não existe (2 L de suor × 55 mL) e a dieta pobre em fibra. A balança só se mexe com o dado da fibra.
 */

export const STAGE_W = 640;
export const STAGE_H = 420;
const RIGHT_X = 262;
const RIGHT_W = STAGE_W - RIGHT_X;
const WATER = C.caveat;

const Block = ({ show, y, children }: { show: boolean; y: number; children: ReactNode }) => (
    <motion.div className="absolute flex flex-col gap-1" style={{ left: RIGHT_X, top: y, width: RIGHT_W }}
        initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
        {children}
    </motion.div>
);
const Title = ({ children }: { children: ReactNode }) => <span className="text-[16px] font-semibold text-gray-200">{children}</span>;

const Scale = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const kg = useTween(step >= 4 ? TIAGO_AFTER_FIBER : TIAGO_START, reduce, 900);
    const t = castOf('tiago');
    const Icon = t.icon;
    return (
        <div className="absolute left-0 top-0 flex w-[240px] flex-col gap-2">
            <div className="flex items-center gap-2">
                <Icon size={26} strokeWidth={2.2} color={C.text} aria-hidden />
                <span className="text-[22px] font-semibold text-white">{t.name}</span>
                <span className="text-[16px] text-gray-300">{t.sport}</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="h-4 w-[210px] rounded-t-xl" style={{ background: '#475569' }} />
                <div className="flex h-[112px] w-[230px] flex-col items-center justify-center gap-1 rounded-2xl" style={{ background: '#1E293B', border: `3px solid ${C.co2}` }}>
                    <div className="flex h-[64px] w-[180px] items-center justify-center rounded-xl" style={{ background: '#04080F' }}>
                        <span className="font-mono text-[44px] font-bold tabular-nums text-white">{br(kg, 2)}</span>
                    </div>
                    <span className="text-[16px] text-gray-300">kg · alvo {br(TIAGO_TARGET)} na pesagem</span>
                </div>
            </div>
        </div>
    );
};

/** As três alavancas rápidas; a do passo acende. */
const Levers = ({ step }: { step: number }) => (
    <div className="absolute left-0 flex w-[240px] flex-col gap-2" style={{ top: 186 }}>
        <Title>o que sai rápido</Title>
        {LEVERS.map((l, i) => {
            const lit = step >= l.at;
            const color = l.key === 'gly' ? C.glycogen : l.key === 'gut' ? C.stone : WATER;
            return (
                <motion.div key={l.key} className="flex items-center gap-2 rounded-lg border-2 px-2 py-1 text-[16px]"
                    initial={false} animate={{ opacity: lit || step === 0 ? 1 : 0.6 }}
                    transition={{ duration: DUR.enter, delay: step === 0 ? stagger(i, 0.2) : 0 }}
                    style={{ borderColor: step === l.at ? color : 'rgba(255,255,255,0.15)', color: '#F3F4F6' }}>
                    <span className="block h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />{l.label}
                </motion.div>
            );
        })}
        <motion.p className="m-0 text-[15px] leading-snug text-gray-300" initial={false} animate={{ opacity: step >= 4 ? 1 : 0 }}
            transition={{ duration: DUR.enter, delay: step === 4 ? 0.6 : 0 }}>
            Desidratar à força fica fora: o ACSM (2021) pede regras contra técnicas perigosas.
        </motion.p>
    </div>
);

/** 1 g de glicogênio e as 17 gramas possíveis de água; as 3 primeiras são o piso. */
const Ratio = ({ step }: { step: number }) => {
    const reduce = useReducedMotion();
    const count = step >= 2 ? WATER_MAX : WATER_MIN;
    return (
        <Block show={step >= 1} y={0}>
            <div className="flex items-baseline justify-between">
                <Title>glicogênio : água (g)</Title>
                <span className="font-display text-[30px] font-bold leading-none text-white">1 : {count}</span>
            </div>
            <div className="flex items-start gap-2">
                <span className="block h-[34px] w-[34px] shrink-0 rounded-md" style={{ background: C.glycogen }} />
                <div className="flex flex-wrap gap-[4px]" style={{ width: 9 * 30 }}>
                    {Array.from({ length: WATER_MAX }, (_, i) => {
                        const on = i < count;
                        const floor = i < WATER_MIN;
                        return (
                            <motion.span key={i} className="flex h-[26px] w-[26px] items-center justify-center rounded-md"
                                style={floor ? { background: WATER } : { border: `2px solid ${WATER}` }}
                                initial={false} animate={{ opacity: on ? 1 : 0.12, scale: on || reduce ? 1 : 0.85 }}
                                transition={{ delay: on ? stagger(i - (step >= 2 ? WATER_MIN : 0), 0.2, 0.04) : 0, duration: DUR.enter, ease: EASE_OUT }}>
                                <Droplet size={15} strokeWidth={2.4} color={floor ? '#04080F' : WATER} aria-hidden />
                            </motion.span>
                        );
                    })}
                </div>
            </div>
            <span className="text-[15px] text-gray-300">cheio: piso, pouca água (400 mL) · contorno: só com água plena (~3,2 L)</span>
        </Block>
    );
};

/** King 2018: 2 L de suor × ~55 mL devolvidos ao plasma, na mesma escala. */
const Canteen = ({ show }: { show: boolean }) => (
    <Block show={show} y={142}>
        <Title>2 L de suor × água devolvida ao plasma</Title>
        {[{ label: 'suor', ml: SWEAT_ML, color: C.co2 }, { label: 'plasma', ml: PLASMA_GAIN_ML, color: WATER }].map((r, i) => (
            <div key={r.label} className="flex items-center gap-2">
                <span className="w-[56px] text-[16px] text-gray-300">{r.label}</span>
                <div className="relative h-[24px] w-[200px] overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Grow value={show ? r.ml / SWEAT_ML : 0} color={r.color} delay={0.2 + i * 0.3} />
                </div>
                <span className="whitespace-nowrap font-mono text-[17px] font-semibold tabular-nums text-white">{r.ml.toLocaleString('pt-BR')} mL</span>
            </div>
        ))}
    </Block>
);

/** Foo 2022: a massa cai em degraus pequenos ao longo dos dias de pouca fibra. */
const Fiber = ({ show }: { show: boolean }) => {
    const W = RIGHT_W;
    const x = (i: number) => 30 + i * ((W - 150) / 2);
    const y = (kg: number) => 18 + (-kg / 0.6) * 70;
    return (
        <Block show={show} y={250}>
            <div className="flex items-baseline justify-between">
                <Title>&lt; 10 g de fibra por dia · massa (kg)</Title>
                <span className="font-display text-[30px] font-bold leading-none" style={{ color: C.stone }}>−0,74%</span>
            </div>
            <svg viewBox={`0 0 ${W} 120`} width={W} height={120} role="img" aria-label="Massa −0,40 kg no dia 4 e −0,58 kg na manhã do 5º dia">
                <line x1={x(0)} x2={x(2)} y1={y(0)} y2={y(0)} stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" />
                <motion.polyline points={FOO_DAYS.map((d, i) => `${x(i)},${y(d.kg)}`).join(' ')} fill="none" stroke={C.stone} strokeWidth={4}
                    initial={false} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: DUR.draw, delay: show ? 0.2 : 0, ease: EASE_OUT }} />
                {FOO_DAYS.map((d, i) => (
                    <g key={d.day}>
                        <circle cx={x(i)} cy={y(d.kg)} r={7} fill={C.stone} />
                        <SvgText x={x(i)} y={116} text={d.day} anchor="middle" size={16} color={C.muted} weight={500} />
                        {i > 0 && <SvgText x={x(i) + 10} y={y(d.kg) - 10} text={br(d.kg, 2)} size={17} color="#F9FAFB" weight={700} />}
                    </g>
                ))}
            </svg>
        </Block>
    );
};

export const WeightStage = ({ step }: { step: number }) => (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
        <Scale step={step} />
        <Levers step={step} />
        <Ratio step={step} />
        <Canteen show={step >= 3} />
        <Fiber show={step >= 4} />
    </div>
);
