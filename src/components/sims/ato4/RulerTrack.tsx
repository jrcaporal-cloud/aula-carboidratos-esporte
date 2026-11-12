import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { MARKS, RULER_MAX, type RulerMark } from './ruler.content';

/**
 * A régua grande do glicogênio muscular (0–700 mmol/kg dw). Cada marcador nasce no "normal" e desliza
 * até o seu valor (posição em cqw: só transform). O trecho entre o normal e o deslocado se pinta na cor do efeito.
 */

const NORMAL = MARKS[0].value;
const pos = (v: number) => (v / RULER_MAX) * 100;

const Pin = ({ mark, shown, reduce }: { mark: RulerMark; shown: boolean; reduce: boolean }) => (
    <motion.div className="absolute bottom-0 left-0 w-0" initial={false}
        animate={{ x: `${pos(shown ? mark.value : NORMAL)}cqw`, opacity: shown ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : DUR.morph * 1.8, ease: EASE_IN_OUT }}>
        <div className="absolute bottom-0 left-[-2px] h-[70px] w-[5px] rounded" style={{ background: mark.color }} />
        <div className="absolute bottom-[72px] left-0 flex -translate-x-1/2 flex-col items-center">
            <span className="font-display text-[40px] font-semibold leading-none tabular-nums" style={{ color: mark.color }}>{mark.flag}</span>
            <span className="text-[18px] text-gray-200">{mark.label}</span>
        </div>
    </motion.div>
);

/** Trecho pintado entre o normal e o valor deslocado (escala a partir do normal). */
const Span = ({ mark, shown, reduce }: { mark: RulerMark; shown: boolean; reduce: boolean }) => {
    const left = Math.min(NORMAL, mark.value);
    const width = Math.abs(mark.value - NORMAL);
    return (
        <motion.div className="absolute top-0 h-[16px]"
            style={{ left: `${pos(left)}%`, width: `${pos(width)}%`, background: mark.color, transformOrigin: mark.value > NORMAL ? 'left' : 'right' }}
            initial={false} animate={{ scaleX: shown ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.morph * 1.8, ease: EASE_IN_OUT }} />
    );
};

export const RulerTrack = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative mx-8 [container-type:inline-size]">
            <div className="relative h-[132px]">
                {MARKS.map(m => <Pin key={m.id} mark={m} shown={step >= m.from} reduce={reduce} />)}
            </div>
            <div className="relative h-[16px] rounded-sm bg-white/15">
                {MARKS.slice(1).map(m => <Span key={m.id} mark={m} shown={step >= m.from} reduce={reduce} />)}
            </div>
            <div className="relative mt-1 h-[44px]">
                {Array.from({ length: RULER_MAX / 100 + 1 }, (_, i) => i * 100).map(v => (
                    <div key={v} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${pos(v)}%` }}>
                        <span className="h-[10px] w-[3px]" style={{ background: C.co2 }} />
                        <span className="font-mono text-[16px] text-gray-300">{v}</span>
                    </div>
                ))}
                <span className="absolute right-0 top-[38px] translate-y-1 text-[16px] text-gray-400">mmol/kg de músculo seco · vasto lateral</span>
            </div>
        </div>
    );
};
