import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Droplet } from 'lucide-react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Tank } from '../kit/Tank';
import { SMYTH, STORES, TANK_LEVELS, type Store } from './wall.content';

/** Peças do slide 10 (O Km 32): a faixa dos quatro estoques e a grade de 100 corredores de Smyth. */

const QUESTION_AT = 3;

const Badge = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <motion.span aria-hidden className="absolute right-2 top-1/2 -mt-[14px] flex h-7 w-7 items-center justify-center rounded-full border-2 text-[18px] font-bold"
            style={{ borderColor: C.glycogenSoft, color: C.glycogenSoft, background: '#04080F' }}
            initial={false} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 26 }}>
            ?
        </motion.span>
    );
};

const StoreIcon = ({ store, step }: { store: Store; step: number }) => {
    const lv = TANK_LEVELS[step];
    if (store.id === 'muscle') return <Tank level={lv.muscle} width={28} height={42} active={step >= 1} />;
    if (store.id === 'liver') return <Tank level={lv.liver} width={28} height={42} active={step >= 1} />;
    if (store.id === 'blood') return <Droplet size={32} color={C.glucose} strokeWidth={2.2} aria-hidden />;
    return <Brain size={32} color={C.co2} strokeWidth={2.2} aria-hidden />;
};

/** Os quatro lugares onde há glicose (2 × 2): no passo da pergunta, viram os quatro candidatos. */
export const StoresStrip = ({ step }: { step: number }) => {
    const asked = step >= QUESTION_AT;
    return (
        <div className="flex h-full flex-col gap-2 px-3 py-2">
            <motion.span key={asked ? 'q' : 'e'} className="text-[20px] font-semibold leading-tight"
                style={{ color: asked ? C.glycogenSoft : C.text }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                {asked ? 'O que acabou no km 32? Quatro candidatos' : 'Onde há glicose no corpo da Marina'}
                <span className="text-[16px] font-normal text-gray-300"> · níveis ilustrativos</span>
            </motion.span>
            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2">
                {STORES.map(s => (
                    <div key={s.id} className="relative flex items-center gap-3 rounded-xl border-2 pl-2 pr-10"
                        style={{ borderColor: asked ? `${C.glycogenSoft}80` : 'rgba(255,255,255,0.12)' }}>
                        <div className="flex w-[36px] shrink-0 justify-center"><StoreIcon store={s} step={step} /></div>
                        <span className="w-[74px] shrink-0 text-[18px] font-semibold text-white">{s.name}</span>
                        <span className="flex min-w-0 flex-col">
                            <span className="font-mono text-[20px] font-semibold leading-tight tabular-nums" style={{ color: s.id === 'blood' ? C.glucoseSoft : C.glycogenSoft }}>{s.amount}</span>
                            <span className="text-[16px] leading-tight text-gray-300">{s.note}</span>
                        </span>
                        <Badge show={asked} />
                    </div>
                ))}
            </div>
        </div>
    );
};

/** Embaralhamento fixo (semente): os corredores que acendem ficam espalhados como numa multidão, sempre os mesmos. */
const scatter = (seed: number): readonly number[] => {
    const order = Array.from({ length: 100 }, (_, i) => i);
    let s = seed;
    const rand = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
    return order.reduce<number[]>((acc, _, i) => {
        const j = i + Math.floor(rand() * (100 - i));
        const next = [...acc];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
    }, order);
};
const ORDER_MEN = scatter(7);
const ORDER_WOMEN = scatter(23);

interface GridProps {
    lit: number;
    order: readonly number[];
    color: string;
    delay: number;
}

const DOT = 11;

/** 100 corredores; `lit` deles acendem em ordem espalhada, tudo em < 1 s. */
const Grid = ({ lit, order, color, delay }: GridProps) => {
    const reduce = useReducedMotion();
    const rank = new Map(order.slice(0, lit).map((cell, i) => [cell, i]));
    return (
        <div className="grid grid-cols-[repeat(20,11px)] gap-[3px]" role="img" aria-label={`${lit} de 100 corredores batem no muro`}>
            {Array.from({ length: 100 }, (_, cell) => {
                const r = rank.get(cell);
                return (
                    <span key={cell} className="relative rounded-full" style={{ width: DOT, height: DOT, background: 'rgba(255,255,255,0.16)' }}>
                        {r !== undefined && (
                            <motion.span className="absolute inset-0 rounded-full" style={{ background: color }}
                                initial={reduce ? false : { opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: delay + r * 0.022, duration: 0.25, ease: EASE_OUT }} />
                        )}
                    </span>
                );
            })}
        </div>
    );
};

/** Smyth 2021: duas faixas de 100 corredores, homens (28 acendem) e depois mulheres (17). */
export const RunnerGrids = () => (
    <div className="flex flex-col gap-1.5">
        {([['men', C.glucose, 0.1, ORDER_MEN], ['women', C.glucoseSoft, 0.6, ORDER_WOMEN]] as const).map(([k, color, delay, order]) => {
            const g = SMYTH[k];
            return (
                <div key={k} className="flex items-center gap-3">
                    <div className="flex w-[134px] shrink-0 flex-col">
                        <span className="font-display text-[40px] font-bold leading-none tabular-nums" style={{ color }}>{g.lit}%</span>
                        <span className="text-[17px] font-semibold leading-tight text-white">{g.label}</span>
                        <span className="text-[16px] leading-tight text-gray-200">{g.detail}</span>
                    </div>
                    <Grid lit={g.lit} order={order} color={color} delay={delay} />
                </div>
            );
        })}
    </div>
);
