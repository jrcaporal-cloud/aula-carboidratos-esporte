import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { Beat } from './kit/Beat';
import { SvgText, Source } from './kit/ui';
import { BODY_FONT, C } from './kit/palette';
import { SugarShape, type SugarKind } from './ato2/shapes';
import { BONDS, SOURCE, STEPS, UNITS, restingPlace } from './ato2/sugarFamily.content';

/**
 * Slide 20 · Da Glicose ao Amido. As MESMAS peças se rearranjam a cada passo:
 * monossacarídeos → dissacarídeos → cadeias (maltodextrina, amilose) → ramos (amilopectina) → glicogênio.
 * Só transform e opacidade; as ligações entram depois que as peças pousam.
 */
const LEGEND: readonly { kind: SugarKind; name: string }[] = [
    { kind: 'glc', name: 'glicose' },
    { kind: 'fru', name: 'frutose' },
    { kind: 'gal', name: 'galactose' },
    { kind: 'gyg', name: 'proteína' },
];

const Legend = () => (
    <div className="flex items-center gap-6">
        {LEGEND.map(l => (
            <span key={l.kind} className="flex items-center gap-2 text-[18px] text-gray-200">
                <svg width={26} height={26} viewBox="-26 -26 52 52" aria-hidden><SugarShape kind={l.kind} /></svg>
                {l.name}
            </span>
        ))}
    </div>
);

export default function SugarFamilySim() {
    const { step } = useSlideSteps(STEPS.length);
    const reduce = useReducedMotion();
    const current = STEPS[step];
    const move = { duration: reduce ? 0 : 0.8, ease: EASE_IN_OUT };

    return (
        <div className="not-prose flex flex-col gap-3" style={BODY_FONT}>
            <div className="flex items-center justify-between">
                <Legend />
                <span className="font-mono text-[16px] text-amber-300">{step + 1}/{STEPS.length} · {current.tab}</span>
            </div>

            <svg viewBox="0 0 1136 340" className="w-full" style={{ height: 340 }} role="img" aria-label={current.line}>
                <motion.g key={`bonds-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: reduce ? 0 : 0.7, duration: DUR.text, ease: EASE_OUT }}>
                    {BONDS[step].map((b, i) => (
                        <line key={i} x1={b.a.x} y1={b.a.y} x2={b.b.x} y2={b.b.y} stroke="#E5E7EB" strokeWidth={3} strokeLinecap="round" />
                    ))}
                </motion.g>

                {UNITS.map(u => {
                    const here = current.places[u.id];
                    const p = here ?? restingPlace(u.id, step);
                    return (
                        <motion.g key={u.id} initial={{ x: p.x, y: p.y, scale: p.s * 0.9, opacity: 0 }}
                            animate={{ x: p.x, y: p.y, scale: here ? p.s : p.s * 0.85, opacity: here ? 1 : 0 }}
                            transition={{ ...move, opacity: { duration: here ? DUR.enter : DUR.exit, delay: here ? 0.15 : 0 } }}>
                            <SugarShape kind={u.kind} />
                        </motion.g>
                    );
                })}

                <motion.g key={`labels-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: reduce ? 0 : 0.55, duration: DUR.text, ease: EASE_OUT }}>
                    {current.labels.map(l => (
                        <SvgText key={l.text} x={l.x} y={l.y} text={l.text} size={l.size} color={l.color ?? C.text} anchor={l.anchor ?? 'middle'} />
                    ))}
                </motion.g>
            </svg>

            <Beat beat={step} className="max-w-[1000px]">
                <p className="m-0 text-[27px] leading-snug text-gray-100">{current.line}</p>
            </Beat>
            <Source>{SOURCE}</Source>
        </div>
    );
}
