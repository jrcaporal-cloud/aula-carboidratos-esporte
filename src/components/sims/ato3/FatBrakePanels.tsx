import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { PDH_BARS } from './fatbrake.content';

/** Painéis da direita do slide 45: a gordura medida, a PDH por potência e a fosforilase a que não sobe. */

export const FatOxPanel = ({ high }: { high: boolean }) => (
    <div className="flex flex-col gap-2">
        <span className="text-[19px] text-gray-300">gordura oxidada, corpo inteiro</span>
        <div className="flex items-end gap-6">
            <div className="flex flex-col">
                <span className="font-display text-[84px] font-bold leading-none tabular-nums transition-colors duration-300"
                    style={{ color: high ? '#6B7280' : C.fat }}>32</span>
                <span className="text-[19px] text-gray-100">kJ/min a 55%</span>
            </div>
            {high && (
                <div className="flex flex-col">
                    <CountUp text="19" delay={0.5} className="font-display text-[84px] font-bold leading-none" style={{ color: C.fat }} />
                    <span className="text-[19px] text-gray-100">kJ/min a 75%</span>
                </div>
            )}
        </div>
    </div>
);

const BAR_H = 220;
const PDH_MAX = 3.6;

export const PdhPanel = () => (
    <div className="flex flex-col gap-3">
        <span className="text-[19px] text-gray-300">PDH ativa · mmol·kg⁻¹·min⁻¹</span>
        <div className="flex items-end gap-5" style={{ height: BAR_H + 70 }}>
            {PDH_BARS.map((b, i) => (
                <div key={b.label} className="flex w-[84px] flex-col items-center gap-2">
                    <CountUp text={b.text} delay={stagger(i, 0.1, 0.12)} className="font-display text-[26px] font-semibold" style={{ color: C.glucose }} />
                    <div className="relative w-full overflow-hidden rounded-t-md" style={{ height: (b.value / PDH_MAX) * BAR_H }}>
                        <Grow axis="y" value={1} color={C.glucose} delay={stagger(i, 0.1, 0.12)} />
                    </div>
                    <span className="text-[18px] text-gray-100">{b.label}</span>
                </div>
            ))}
        </div>
    </div>
);

/** Fosforilase a: faixa de 21,4–29,6% em 35, 65 e 90%; aos 10 min a 90%, cai para 15,3%. Escala 0–40%. */
const PH_H = 230;
const y = (pct: number) => PH_H - (pct / 40) * PH_H;

export const PhosphorylasePanel = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-3">
            <span className="text-[19px] text-gray-300">fosforilase na forma a · % do total</span>
            <div className="relative w-[440px]" style={{ height: PH_H }}>
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-slate-400" />
                <motion.div className="absolute left-0 right-[120px] rounded-md" style={{ top: y(29.6), height: y(21.4) - y(29.6), background: C.glycogen, transformOrigin: 'left center' }}
                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, ease: EASE_OUT }} />
                <span className="absolute left-3 text-[20px] font-bold text-white" style={{ top: y(29.6) + 8 }}>21–30%</span>
                <span className="absolute left-0 text-[17px] text-gray-100" style={{ top: y(21.4) + 8 }}>a 35, 65 e 90% (1º min)</span>
                <motion.div className="absolute flex flex-col items-start" style={{ left: 336, top: y(15.3) - 13 }}
                    initial={reduce ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="h-[26px] w-[26px] rounded-full" style={{ background: C.stone }} />
                    <span className="mt-1 text-[20px] font-bold" style={{ color: C.stone }}>15,3%</span>
                    <span className="text-[17px] text-gray-100">90%, 10 min</span>
                </motion.div>
            </div>
        </div>
    );
};
