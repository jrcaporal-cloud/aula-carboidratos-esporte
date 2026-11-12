import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { CHAPTERS } from '../../../data/chapters';
import { C } from '../../sims/kit/palette';
import { EASE_OUT } from '../../../lib/motion';

interface ActTrailProps {
    current: number;
    /** Nó do ato atual: a abertura mede a posição para a glicose pousar em cima. */
    nodeRef: RefObject<HTMLSpanElement | null>;
    reduced: boolean;
}

const NODE = 24;
const LINE = 4;
const COLS = CHAPTERS.length;
/** Centro da primeira e da última coluna (a linha liga os nós, não as bordas). */
const EDGE = `${100 / (COLS * 2)}%`;
const DARK = '#04080F';

/**
 * A trilha dos dez atos: os já vistos cheios na cor de cada um, o atual com anel branco, os próximos
 * vazios. A linha acesa avança do ato anterior até o atual. Chapada: sem brilho nem pulsar.
 */
export const ActTrail = ({ current, nodeRef, reduced }: ActTrailProps) => {
    const color = CHAPTERS[current].color;
    const litWidth = `${(current / COLS) * 100}%`;
    return (
        <div className="relative grid w-full" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            <div className="absolute rounded-full bg-white/15" style={{ left: EDGE, right: EDGE, height: LINE, top: NODE / 2 - LINE / 2 }} />
            <motion.div
                className="absolute rounded-full origin-left"
                style={{ left: EDGE, width: litWidth, height: LINE, top: NODE / 2 - LINE / 2, background: color }}
                initial={reduced ? false : { scaleX: current === 0 ? 0 : (current - 1) / current }}
                animate={{ scaleX: 1, transition: { delay: 0.3, duration: 0.55, ease: EASE_OUT } }}
            />
            {CHAPTERS.map((ch, i) => {
                const seen = i < current;
                const isNow = i === current;
                const lit = seen || isNow;
                return (
                    <div key={ch.roman} className="relative flex flex-col items-center px-1 text-center">
                        <span
                            ref={isNow ? nodeRef : undefined}
                            className="relative block rounded-full"
                            style={{
                                width: NODE,
                                height: NODE,
                                background: lit ? ch.color : DARK,
                                border: `3px solid ${isNow ? C.text : lit ? ch.color : C.co2}`,
                                outline: isNow ? `3px solid ${ch.color}` : undefined,
                                outlineOffset: 2,
                            }}
                        />
                        <span
                            className="mt-3 font-body leading-tight text-[15px]"
                            style={{ color: isNow ? C.text : seen ? '#D1D5DB' : C.co2, fontWeight: isNow ? 600 : 400 }}
                        >
                            <span className="font-mono text-[15px]" style={{ color: lit ? ch.color : undefined }}>{ch.roman}</span>
                            <br />
                            {ch.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
