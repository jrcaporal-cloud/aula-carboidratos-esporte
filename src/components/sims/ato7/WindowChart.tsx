import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { C } from '../kit/palette';
import { IVY_ARMS, RATE_MAX, type ArmKind, type IvyCell } from './window.content';

/**
 * Slide 120 · embaixo da fibra, dois elos rotulados.
 * Elo 1 (Ivy 1988): duas séries no tempo, uma linha por braço (comeu logo × comeu 2 h depois), uma coluna por
 * janela de 2 h. Cada célula diz se houve refeição naquela janela e mostra a taxa (mmol/kg ww/h) numa régua 0–8.
 * No passo do atraso, as duas células "2 h logo após comer" ganham o mesmo contorno: é ali que mora o −45%.
 * Elo 2 (Parkin 1997): o mesmo atraso (3 primeiras refeições em 0–4 h × 2–6 h), com as cores dos braços: glicogênio
 * igual às 8 e às 24 h.
 */

export const CHART_H = 240;

const ARM_STYLE: Record<ArmKind, { fill: string; label: string }> = {
    now: { fill: C.glycogen, label: '#FFFFFF' },
    late: { fill: 'rgba(139,92,246,0.35)', label: '#E5E7EB' },
};

const appear = (on: boolean, fresh: boolean, delay = 0.2) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0 },
    transition: { duration: DUR.enter, delay: on && fresh ? delay : 0, ease: EASE_OUT },
});

export const ArmSwatch = ({ arm, size = 16 }: { arm: ArmKind; size?: number }) => (
    <span aria-hidden className="shrink-0 rounded-[4px] border-[3px]"
        style={{ width: size, height: size, borderColor: C.glycogen, background: ARM_STYLE[arm].fill }} />
);

/** Etiqueta do que o braço comeu naquela janela: refeição (âmbar) ou jejum (neutro). */
const MealTag = ({ meal }: { meal: boolean }) => (
    <span className="flex items-center gap-1.5 whitespace-nowrap text-[16px] font-semibold leading-none"
        style={{ color: meal ? C.glucoseSoft : C.caveat }}>
        {meal
            ? <><span aria-hidden className="h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent" style={{ borderBottomColor: C.glucose }} />comeu 2 g/kg</>
            : 'ainda sem CHO'}
    </span>
);

const Cell = ({ cell, arm, step, mark }: { cell: IvyCell; arm: ArmKind; step: number; mark: boolean }) => {
    const on = step >= cell.at;
    const fresh = step === cell.at;
    return (
        <div className="relative flex h-[52px] flex-col justify-center gap-1 rounded-lg px-2.5"
            style={{ borderWidth: mark ? 3 : 2, borderColor: mark ? C.stone : 'rgba(148,163,184,0.35)', borderStyle: on ? 'solid' : 'dashed', transition: 'border-color 300ms' }}>
            <motion.div className="flex flex-col gap-1" {...appear(on, fresh)}>
                {cell.rate === null ? (
                    <span className="text-[16px] font-semibold leading-tight text-gray-300">não relatado no resumo</span>
                ) : (
                    <>
                        <MealTag meal={cell.meal} />
                        <div className="flex items-center gap-2">
                            <div className="relative h-[16px] flex-1 overflow-hidden rounded-[4px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                {on && <Grow value={cell.rate / RATE_MAX} color={ARM_STYLE[arm].fill} delay={fresh ? 0.3 : 0} />}
                            </div>
                            <span className="w-[40px] text-right font-display text-[22px] font-bold leading-none tabular-nums"
                                style={{ color: arm === 'now' ? C.glycogenSoft : '#F3F4F6' }}>{cell.text}</span>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const LinkTitle = ({ n, children, sub }: { n: number; children: ReactNode; sub: string }) => (
    <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full font-display text-[15px] font-bold"
            style={{ background: '#F3F4F6', color: '#04080F' }}>{n}</span>
        <span className="text-[17px] font-bold text-white">{children}</span>
        <span className="text-[16px] text-gray-300">{sub}</span>
    </div>
);

const ParkinRow = ({ step }: { step: number }) => (
    <motion.div className="flex flex-col gap-1 rounded-xl border-2 px-3 py-1.5" {...appear(step >= 3, step === 3, 0.1)}
        style={{ borderColor: '#475569' }}>
        <LinkTitle n={2} sub="cruzado · n = 6 · 5 refeições em 24 h">Parkin 1997: o dia seguinte</LinkTitle>
        <div className="flex items-center gap-2.5 whitespace-nowrap text-[17px] font-semibold text-gray-100">
            <span className="text-gray-300">3 primeiras em</span>
            <span className="flex items-center gap-1.5"><ArmSwatch arm="now" />0–4 h</span>
            <span className="font-display text-[22px] font-bold leading-none" style={{ color: C.stone }}>=</span>
            <span className="flex items-center gap-1.5"><ArmSwatch arm="late" />2–6 h</span>
            <span className="ml-auto" style={{ color: C.stone }}>glicogênio às 8 h e 24 h: igual</span>
        </div>
    </motion.div>
);

export const WindowChart = ({ step }: { step: number }) => (
    <div className="flex w-[616px] flex-col gap-1.5" style={{ height: CHART_H }}>
        <LinkTitle n={1} sub="cruzado · n = 12 · taxa em mmol/kg ww/h">Ivy 1988: as primeiras 4 h</LinkTitle>
        <div className="grid grid-cols-[168px_1fr_1fr] items-center gap-x-2 gap-y-1">
            <motion.span className="flex items-center gap-1.5 text-[16px] font-semibold leading-tight" style={{ color: C.stone }}
                {...appear(step >= 2, step === 2, 0.6)}>
                <span aria-hidden className="h-[16px] w-[22px] shrink-0 rounded-[4px] border-[3px]" style={{ borderColor: C.stone }} />
                2 h após comer
            </motion.span>
            <span className="text-center text-[16px] font-semibold text-gray-300">0–2 h após o treino</span>
            <span className="text-center text-[16px] font-semibold text-gray-300">2–4 h</span>
            {IVY_ARMS.map(a => (
                <div key={a.arm} className="contents">
                    <span className="flex items-center gap-2 text-[17px] font-bold leading-tight" style={{ color: ARM_STYLE[a.arm].label }}>
                        <ArmSwatch arm={a.arm} />{a.label}
                    </span>
                    {a.cells.map((c, i) => (
                        <Cell key={i} cell={c} arm={a.arm} step={step} mark={step >= 2 && c.firstAfterMeal} />
                    ))}
                </div>
            ))}
        </div>
        <ParkinRow step={step} />
    </div>
);
