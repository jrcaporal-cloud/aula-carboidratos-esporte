import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { STAIRS } from './glycolysis.content';

/** A escada (6 degraus, 140 px cada) com o portão da PFK entre o 3º e o 4º. Área: 840 × 360 px. */
const STEP_W = 140;
const TOP = (i: number) => 44 + i * 52;
const H = 360;
const DIM = '#111827';

export const Staircase = ({ lit, gateOpen }: { lit: number; gateOpen: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative shrink-0" style={{ width: STEP_W * STAIRS.length, height: H }}>
            {STAIRS.map((s, i) => {
                const on = i < lit;
                return (
                    <div key={s.label.join('')} className="absolute" style={{ left: i * STEP_W, top: TOP(i), width: STEP_W - 6, height: H - TOP(i) }}>
                        <div className="absolute inset-0 rounded-t-xl border-[3px] transition-colors duration-500"
                            style={{ background: on ? C.glucose : DIM, borderColor: on ? C.glucose : '#334155', transitionDelay: on ? `${stagger(i, 0, 0.12)}s` : '0s' }} />
                        <div className="relative px-3 pt-2 text-[18px] font-bold leading-[1.15] transition-colors duration-500"
                            style={{ color: on ? '#04080F' : '#9CA3AF', transitionDelay: on ? `${stagger(i, 0, 0.12)}s` : '0s' }}>
                            {s.label.map(line => <div key={line}>{line}</div>)}
                        </div>
                        {s.atp && (
                            <motion.span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[22px] font-bold"
                                style={{ top: -36, color: s.atp.startsWith('+') ? C.glucoseSoft : C.caveat }}
                                initial={false} animate={{ opacity: on ? 1 : 0 }}
                                transition={{ delay: on ? 0.3 : 0, duration: DUR.enter, ease: EASE_OUT }}>
                                {s.atp}
                            </motion.span>
                        )}
                    </div>
                );
            })}
            {/* o portão da PFK: gira para trás quando os sinais de energia baixa chegam */}
            <div className="absolute" style={{ left: 3 * STEP_W - 12, top: TOP(2) - 96, width: 14, height: 96 }}>
                <motion.div className="absolute inset-0 rounded-md"
                    style={{ background: gateOpen ? C.ok : C.stone, transformOrigin: '50% 100%' }}
                    initial={false} animate={{ rotate: gateOpen && !reduce ? -78 : 0, opacity: gateOpen && reduce ? 0.35 : 1 }}
                    transition={{ duration: DUR.bar, ease: EASE_IN_OUT }} />
                
            </div>
            <span className="absolute font-display text-[24px] font-bold transition-colors duration-300"
                style={{ left: 3 * STEP_W - 92, top: TOP(2) - 92, color: gateOpen ? C.ok : C.stone }}>PFK</span>
            {gateOpen && (
                <motion.span className="absolute whitespace-nowrap text-[18px] font-semibold"
                    style={{ left: 3 * STEP_W + 22, top: TOP(2) - 60, color: C.ok }}
                    initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: DUR.enter, ease: EASE_OUT }}>
                    ADP · AMP · Pi
                </motion.span>
            )}
        </div>
    );
};
