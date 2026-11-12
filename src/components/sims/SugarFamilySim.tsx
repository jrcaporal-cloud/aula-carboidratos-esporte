import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { SvgText } from './kit/ui';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { SugarShape } from './ato2/shapes';
import { Accrue, MolFrame, StepText } from './ato2/moleculaA.ui';
import { Inset14, Inset16 } from './ato2/sugarRings';
import { BONDS, FICHA, STAGE_H, STAGE_W, STEPS, UNITS, restingPlace, type Bond, type Oxidation } from './ato2/sugarFamily.content';

/**
 * Slide 20 · Da Glicose ao Amido. No palco, as MESMAS peças se rearranjam a cada passo
 * (monossacarídeos → dissacarídeos → cadeias α-1,4 → ramos α-1,6 → amilose × amilopectina × glicogênio),
 * com lupas químicas das duas ligações. No painel, a ficha acumula: forma · do que é feita · oxidação no exercício.
 */
const OX: Record<Oxidation, { text: string; color: string }> = {
    alta: { text: 'alta', color: C.glucoseSoft },
    menor: { text: '25–50% menor', color: C.caveat },
    nd: { text: 'não avaliada', color: C.muted },
    estoque: { text: '(estoque)', color: C.glycogenSoft },
};

const Bonds = ({ bonds, color, width, step, reduce }: { bonds: Bond[]; color: string; width: number; step: number; reduce: boolean }) => (
    <motion.g key={`${color}-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.7, duration: DUR.text, ease: EASE_OUT }}>
        {bonds.map((b, i) => <line key={i} x1={b.a.x} y1={b.a.y} x2={b.b.x} y2={b.b.y} stroke={color} strokeWidth={width} strokeLinecap="round" />)}
    </motion.g>
);

const Stage = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const current = STEPS[step];
    const move = { duration: reduce ? 0 : 0.85, ease: EASE_IN_OUT };
    return (
        <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} width={STAGE_W} height={STAGE_H} className="block" role="img"
            aria-label="Unidades de açúcar que se rearranjam: monossacarídeos, dissacarídeos, cadeias e ramos">
            <Bonds bonds={BONDS[step].a14} color="#E5E7EB" width={3} step={step} reduce={reduce} />
            <Bonds bonds={BONDS[step].a16} color={C.glycogenSoft} width={5} step={step} reduce={reduce} />
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
                    <SvgText key={l.text + l.x} x={l.x} y={l.y} text={l.text} size={l.size} color={l.color ?? C.text}
                        anchor={l.anchor ?? 'middle'} weight={l.weight ?? 600} />
                ))}
            </motion.g>
            {current.inset === '14' && <Inset14 key="i14" />}
            {current.inset === '16' && <Inset16 key="i16" />}
        </svg>
    );
};

const Ficha = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-0 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300">
                <th className="pb-1 font-normal">forma</th>
                <th className="pb-1 font-normal">do que é feita</th>
                <th className="pb-1 text-right font-normal">oxidação no exercício</th>
            </tr>
        </thead>
        <tbody>
            {FICHA.filter(r => r.at <= step).map((r, i) => (
                <motion.tr key={r.name} initial={r.at === step ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: r.at === step ? 0.5 + i * 0.04 : 0, ease: EASE_OUT }}
                    className="text-[16px] leading-[22px]">
                    <td className="font-semibold text-gray-50">{r.name}</td>
                    <td className="text-gray-200">{r.what}</td>
                    <td className="text-right font-semibold tabular-nums" style={{ color: OX[r.ox].color }}>{OX[r.ox].text}</td>
                </motion.tr>
            ))}
        </tbody>
    </table>
);

export default function SugarFamilySim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    return (
        <MolFrame tabs={STEPS.map(x => x.tab)} step={step} setStep={setStep} layoutId="sugar-tabs" stageWidth={STAGE_W}
            stage={<Stage step={step} />}
            chips={<><IllustrativeChip>estrutura esquemática</IllustrativeChip><DesignChip>oxidação: revisão narrativa</DesignChip></>}
            source={sourcesUpTo(STEPS.map(x => x.sources), step)}>
            <StepText step={step} color={s.color} headline={s.headline} text={s.text} />
            <Accrue at={0} step={step}><Ficha step={step} /></Accrue>
        </MolFrame>
    );
}
