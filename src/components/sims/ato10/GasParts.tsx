import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { EQUATIONS, ISOTOPE_CHAIN, NEEDLES, RER_MAX, RER_MIN, STOICH } from './gas.content';

/**
 * Slide 184 · peças do palco: o circuito do gás (com o único laço do slide: O₂ entrando e CO₂ saindo, o fluxo que É o
 * conteúdo), a estequiometria, as equações, o mostrador do RER e a trilha do ¹³C.
 */

const LANE_W = 92;

/** Bolinhas que correm pela seta: ≤ 3 por trilho, ciclo de 2,8 s com pausa. Com movimento reduzido, ficam paradas. */
const Flow = ({ color, count = 3, offset = 0 }: { color: string; count?: number; offset?: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative h-[14px]" style={{ width: LANE_W }}>
            <span className="absolute inset-x-0 top-[6px] h-[3px] rounded bg-white/30" />
            {Array.from({ length: count }, (_, i) => (
                <motion.span key={i} className="absolute top-0 block h-[14px] w-[14px] rounded-full border-2 border-[#04080F]" style={{ background: color }}
                    initial={{ x: reduce ? i * 30 : 0, opacity: reduce ? 1 : 0 }}
                    animate={reduce ? undefined : { x: [0, LANE_W - 14], opacity: [0, 1, 1, 0] }}
                    transition={reduce ? undefined : { duration: 2.8, times: [0, 0.15, 0.85, 1], repeat: Infinity, repeatDelay: 0.6, delay: offset + i * 0.9, ease: 'linear' }} />
            ))}
        </div>
    );
};

const Pill = ({ label, color }: { label: string; color: string }) => (
    <span className="whitespace-nowrap rounded-xl border-[3px] px-3 py-1 text-[20px] font-bold" style={{ borderColor: color, color }}>{label}</span>
);

export const GasCircuit = ({ buffer }: { buffer: boolean }) => (
    <div className="flex items-center justify-center gap-2">
        <Pill label="O₂ entra" color={C.caveat} />
        <Flow color={C.caveat} />
        <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-white/25 px-3 py-1.5">
            <span className="text-[16px] text-gray-300">músculo</span>
            <div className="flex gap-1.5">
                <span className="rounded-md px-2 py-0.5 text-[16px] font-semibold text-[#04080F]" style={{ background: C.glucose }}>carboidrato</span>
                <span className="rounded-md px-2 py-0.5 text-[16px] font-semibold text-[#04080F]" style={{ background: C.fat }}>gordura</span>
            </div>
        </div>
        <div className="flex flex-col gap-1.5">
            <Flow color={C.co2} offset={0.4} />
            <motion.div initial={false} animate={{ opacity: buffer ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                {buffer && <Flow color={C.stone} count={2} offset={0.2} />}
            </motion.div>
        </div>
        <div className="flex flex-col items-start gap-1">
            <Pill label="CO₂ sai" color={C.co2} />
            <motion.span className="whitespace-nowrap text-[16px] font-semibold" style={{ color: C.stone }}
                initial={false} animate={{ opacity: buffer ? 1 : 0, y: buffer ? 0 : -4 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                + CO₂ do bicarbonato
            </motion.span>
        </div>
    </div>
);

export const Stoichiometry = () => (
    <div className="flex flex-col gap-1.5">
        <span className="text-[16px] font-semibold text-gray-300">Estequiometria</span>
        {STOICH.map(s => (
            <div key={s.fuel} className="flex flex-col leading-tight">
                <span className="whitespace-nowrap text-[16px] text-gray-100">{s.eq}</span>
                <span className="text-[17px] font-semibold tabular-nums text-white"><b style={{ color: s.color }}>{s.fuel}</b>: RER = {s.rer}</span>
            </div>
        ))}
    </div>
);

export const Equations = ({ error }: { error: boolean }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-[16px] font-semibold text-gray-300">g/min, a 50–75% do VO₂máx</span>
        {EQUATIONS.map((e, i) => (
            <motion.div key={e.what} className="flex flex-col leading-tight" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stagger(i, 0.2, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="whitespace-nowrap text-[16px] text-gray-100"><b style={{ color: e.color }}>{e.what}</b> = <span className="tabular-nums">{e.eq}</span></span>
                <span className="text-[16px] tabular-nums" style={{ color: e.color }}>exemplo: {e.ex}{error ? ` ± ${e.err}` : ''} g/min (cálculo)</span>
            </motion.div>
        ))}
    </div>
);

const pos = (rer: number) => `${((rer - RER_MIN) / (RER_MAX - RER_MIN)) * 100}%`;
const TICKS = [0.7, 0.8, 0.9, 1.0, 1.1] as const;

const Needle = ({ rer, label, color }: { rer: number; label: string; color: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="absolute inset-y-0 left-0 w-0" initial={reduce ? false : { x: `${((NEEDLES.steady - RER_MIN) / (RER_MAX - RER_MIN)) * 100}cqw` }}
            animate={{ x: `${((rer - RER_MIN) / (RER_MAX - RER_MIN)) * 100}cqw` }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }}>
            <span className="absolute -left-[8px] top-[2px] block h-[30px] w-[16px] rounded-full border-[3px] border-[#04080F]" style={{ background: color }} />
            <span className="absolute -top-[22px] -translate-x-1/2 whitespace-nowrap text-[16px] font-semibold" style={{ color }}>{label}</span>
        </motion.div>
    );
};

export const RerGauge = ({ sprint }: { sprint: boolean }) => (
    <div className="flex flex-col gap-0.5 pt-5">
        <div className="relative h-[34px] [container-type:inline-size]">
            <div className="absolute inset-y-[3px] left-0 flex items-center rounded-l-lg pl-2 text-[16px] font-semibold text-[#04080F]" style={{ width: pos(0.85), background: C.fat }}>mais gordura</div>
            <div className="absolute inset-y-[3px] flex items-center justify-end pr-2 text-[16px] font-semibold text-[#04080F]" style={{ left: pos(0.85), width: `calc(${pos(1.0)} - ${pos(0.85)})`, background: C.glucose }}>mais CHO</div>
            <div className="absolute inset-y-[3px] right-0 flex items-center justify-end rounded-r-lg pr-2 text-[16px] font-semibold text-white" style={{ left: pos(1.0), background: '#9F1239' }}>não vale</div>
            <div className="absolute inset-y-0 w-[3px] bg-white" style={{ left: pos(1.0) }} />
            <Needle rer={NEEDLES.steady} label="exemplo: 2,7 ÷ 3,0 = 0,90" color={C.glucoseSoft} />
            {sprint && <Needle rer={NEEDLES.sprint} label="tiro (exemplo)" color={C.risk} />}
        </div>
        <div className="relative h-[20px]">
            {TICKS.map((t, i) => (
                <span key={t} className={`absolute font-mono text-[16px] tabular-nums text-gray-200 ${i === 0 ? '' : '-translate-x-1/2'}`} style={{ left: pos(t) }}>{br(t, 2)}</span>
            ))}
        </div>
    </div>
);

export const IsotopeChain = () => (
    <div className="flex items-center gap-1">
        {ISOTOPE_CHAIN.map((s, i) => (
            <motion.div key={s.title} className="flex items-center gap-1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.2, 0.15), duration: DUR.enter, ease: EASE_OUT }}>
                <div className="flex flex-col rounded-lg border-2 px-2 py-0.5 leading-tight" style={{ borderColor: i === 3 ? C.glucose : 'rgba(255,255,255,0.25)' }}>
                    <span className="text-[17px] font-semibold text-white">{s.title}</span>
                    <span className="whitespace-nowrap text-[16px] text-gray-300">{s.sub}</span>
                </div>
                {i < ISOTOPE_CHAIN.length - 1 && <ArrowRight size={20} strokeWidth={2.6} color={C.glucose} aria-hidden />}
            </motion.div>
        ))}
    </div>
);
