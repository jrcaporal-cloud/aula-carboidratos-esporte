import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { CountUp } from '../kit/CountUp';
import { SOLEM } from './oneDayLoad.content';

/**
 * Média e IC95% do Solem 2025 (slide 81): ciclismo × corrida, em mmol/kg de PESO SECO.
 * O intervalo se abre do centro (scaleX), o ponto pousa e o número conta. Eixo próprio: não é a unidade do tanque.
 */
const at = (v: number) => `${(v / SOLEM.max) * 100}%`;

export const SolemInterval = ({ show }: { show: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className="flex flex-col gap-1.5 rounded-xl border-2 px-3 py-2" style={{ borderColor: 'rgba(196,181,253,0.45)' }}
            initial={false} animate={{ opacity: show ? 1 : 0, y: show || reduce ? 0 : 10 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <span className="text-[16px] font-semibold text-white">Solem 2025 · ganho, média e IC95%</span>
            {SOLEM.rows.map((r, i) => (
                <div key={r.label} className="flex items-center gap-2">
                    <span className="w-[70px] shrink-0 text-[16px] text-gray-100">{r.label}</span>
                    <div className="relative h-[30px] flex-1 [container-type:inline-size]">
                        <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/15" />
                        <motion.span className="absolute top-1/2 h-[8px] -translate-y-1/2 rounded-full"
                            style={{ left: at(r.lo), width: `calc(${at(r.hi)} - ${at(r.lo)})`, background: i === 0 ? C.glycogen : C.glycogenSoft, transformOrigin: 'center' }}
                            initial={false} animate={{ scaleX: show ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.bar, delay: show ? 0.25 + i * 0.12 : 0, ease: EASE_OUT }} />
                        <span className="absolute top-1/2 h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#04080F]"
                            style={{ left: at(r.mean), background: C.text }} />
                    </div>
                    {show ? <CountUp text={r.text} delay={0.35 + i * 0.12} duration={0.7} className="w-[54px] text-right font-mono text-[19px] font-bold" style={{ color: C.glycogenSoft }} />
                        : <span className="w-[54px]" />}
                </div>
            ))}
            <div className="relative ml-[78px] mr-[62px] h-[18px]">
                {SOLEM.ticks.map(t => (
                    <span key={t} className="absolute -translate-x-1/2 font-mono text-[15px] text-gray-300" style={{ left: at(t) }}>{t}</span>
                ))}
            </div>
            <span className="text-[15px] leading-snug text-gray-300">{SOLEM.unit}</span>
        </motion.div>
    );
};
