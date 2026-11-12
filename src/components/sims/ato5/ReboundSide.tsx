import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { Stamp } from '../kit/Stamp';
import { br } from '../kit/format';
import { ARMS, FOSTER, KUIPERS, MYTH, TEXT } from './rebound.content';

/**
 * Peças do palco do slide 85 além do gráfico: o mito de 1979 em tela cheia (passo 1), que se recolhe num
 * cartão na coluna; a potência dos três braços (passo 4); os 19 de Kuipers e o carimbo (passo 5).
 */

const TRACK = 'rgba(255,255,255,0.08)';

/** Barras de Foster: água × glicose, em minutos até a exaustão. */
const FosterBars = ({ big }: { big: boolean }) => (
    <div className={`flex flex-col ${big ? 'gap-3' : 'gap-1.5'}`}>
        {FOSTER.rows.map((r, i) => (
            <div key={r.label} className="flex items-center gap-3">
                <span className={`${big ? 'w-[90px] text-[22px]' : 'w-[62px] text-[16px]'} shrink-0 text-gray-100`}>{r.label}</span>
                <div className={`relative flex-1 overflow-hidden rounded ${big ? 'h-[34px]' : 'h-[16px]'}`} style={{ background: TRACK }}>
                    <Grow value={r.min / FOSTER.max} color={i === 0 ? C.co2 : C.risk} delay={big ? 0.35 + i * 0.15 : 0} />
                </div>
                <span className={`${big ? 'w-[76px] text-[30px]' : 'w-[40px] text-[16px]'} text-right font-display font-bold tabular-nums text-white`}>{br(r.min)}</span>
            </div>
        ))}
    </div>
);

/** Passo 1: a frase-mito e Foster em tela cheia. Sai por clip-path quando o gráfico de 2003 entra. */
export const MythCover = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="absolute inset-0 z-10 flex flex-col justify-center gap-7 px-12" style={{ background: '#060C17' }}
            initial={false} animate={{ clipPath: show ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)' }}
            transition={{ duration: reduce ? 0 : DUR.bar, ease: EASE_IN_OUT }}>
            <span className="font-display text-[44px] font-bold leading-tight text-white">{MYTH}</span>
            <div className="flex items-end gap-8">
                <div className="flex flex-1 flex-col gap-2">
                    <span className="text-[18px] font-semibold" style={{ color: C.caveat }}>Foster 1979 · 75 g de glicose 30–45 min antes</span>
                    <FosterBars big />
                    <span className="text-[18px] text-gray-300">{FOSTER.caption}</span>
                </div>
                <CountUp text={FOSTER.value} delay={0.5} className="font-display text-[88px] font-bold leading-none" style={{ color: C.risk }} />
            </div>
        </motion.div>
    );
};

const Card = ({ title, color, children }: { title: string; color: string; children: ReactNode }) => (
    <motion.div className="flex flex-col gap-1.5 rounded-xl border-2 px-3 py-2" style={{ borderColor: `${color}99` }}
        initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: DUR.enter, delay: 0.15, ease: EASE_OUT }}>
        <span className="text-[16px] font-bold" style={{ color }}>{title}</span>
        {children}
    </motion.div>
);

const WATT_MAX = 300;

const Watts = () => (
    <Card title={TEXT.watts} color={C.ok}>
        {ARMS.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2">
                <span className="w-[58px] shrink-0 whitespace-nowrap text-[16px] font-bold" style={{ color: a.color }}>{a.before} min</span>
                <div className="relative h-[16px] flex-1 overflow-hidden rounded" style={{ background: TRACK }}>
                    <Grow value={a.watts / WATT_MAX} color={a.color} delay={0.3 + i * 0.1} />
                </div>
                <CountUp text={String(a.watts)} delay={0.3 + i * 0.1} className="w-[40px] text-right font-display text-[22px] font-bold leading-none text-white" />
            </div>
        ))}
    </Card>
);

const Kuipers = () => (
    <Card title="Kuipers 1999 · 19 ciclistas" color={C.insulinSoft}>
        <div className="grid grid-cols-10 gap-[5px]">
            {Array.from({ length: KUIPERS.n }, (_, i) => (
                <motion.span key={i} className="h-[14px] w-[14px] rounded-full"
                    style={{ background: i < KUIPERS.low ? C.risk : 'rgba(148,163,184,0.55)' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: stagger(i, 0.2, 0.025), duration: DUR.text, ease: EASE_OUT }} />
            ))}
        </div>
        <span className="text-[16px] leading-tight text-gray-100">{KUIPERS.caption}</span>
    </Card>
);

/** Coluna à direita do gráfico: acumula Foster (passo 2+), potência (4+) e Kuipers (5). */
export const ReboundColumn = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2">
        {step >= 1 && (
            <div className="relative">
                <Card title="Foster 1979" color={C.risk}>
                    <FosterBars big={false} />
                    <span className="text-[16px] text-gray-200"><span className="font-bold" style={{ color: C.risk }}>{FOSTER.value}</span> até a exaustão a 80%</span>
                </Card>
                {/* passo 5: o conselho que nasceu deste estudo leva o carimbo */}
                {step >= 4 && <span className="absolute -right-2 -top-3"><Stamp verdict="mito" /></span>}
            </div>
        )}
        {step >= 3 && <Watts />}
        {step >= 4 && <Kuipers />}
    </div>
);
