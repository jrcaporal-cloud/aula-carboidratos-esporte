import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C, PANEL_BG } from './kit/palette';
import { Grow, Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { Frame } from './ato10/Frame';
import { DESIGNS, LINES, METHODS, ROUTLEDGE, SOURCE, type Method } from './ato10/methods.content';

/**
 * Slide 183 · Como se Mede o Glicogênio. Três instrumentos lado a lado; o passo acende um de cada vez.
 * No último passo um painel "abre" por cima (Wipe) com o teste independente: a biópsia despenca, o ultrassom fica parado.
 */
const MethodCard = ({ m, state }: { m: Method; state: 'on' | 'off' | 'past' }) => {
    const Icon = m.icon;
    return (
        <motion.div className="flex h-full flex-col gap-4 rounded-2xl border-2 px-6 py-5" style={PANEL_BG}
            animate={{ opacity: state === 'on' ? 1 : 0.65, borderColor: state === 'on' ? m.color : 'rgba(255,255,255,0.10)' }}
            transition={{ duration: DUR.enter, ease: EASE_OUT }}>
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: m.color }}>
                    <Icon size={26} strokeWidth={2.4} color="#04080F" aria-hidden />
                </span>
                <span className="text-[24px] font-semibold text-white">{m.name}</span>
            </div>
            <motion.div className="flex flex-1 flex-col justify-center gap-1 pb-4" initial={false} animate={{ opacity: state === 'off' ? 0 : 1 }} transition={{ duration: DUR.enter }}>
                <CountUp text={m.big} run={state !== 'off'} className="font-display text-[60px] font-bold leading-none" style={{ color: m.color }} />
                <span className="text-[18px] text-gray-200">{m.bigCaption}</span>
                <ul className="m-0 mt-6 flex list-none flex-col gap-2 p-0">
                    {m.notes.map(n => <li key={n} className="text-[19px] leading-snug text-gray-200">{n}</li>)}
                </ul>
            </motion.div>
        </motion.div>
    );
};

interface PairProps {
    title: string;
    before: number;
    after: number;
    max: number;
    color: string;
    unit?: string;
    foot: string;
}

/** Antes × depois do jogo, em barras que crescem de baixo; cada par na própria escala. */
const Pair = ({ title, before, after, max, color, unit, foot }: PairProps) => (
    <div className="flex flex-1 flex-col gap-3">
        <span className="text-[22px] font-semibold text-white">{title}</span>
        <div className="flex h-[250px] items-end gap-6">
            {[{ v: before, k: 'antes' }, { v: after, k: 'depois' }].map((b, i) => (
                <div key={b.k} className="flex w-[110px] flex-col items-center gap-2">
                    <CountUp text={String(b.v)} delay={0.3 + i * 0.2} className="font-display text-[34px] font-bold leading-none text-white" />
                    <div className="relative w-full overflow-hidden rounded-t-lg" style={{ height: (b.v / max) * 150 }}>
                        <Grow value={1} axis="y" color={color} delay={0.25 + i * 0.2} />
                    </div>
                    <span className="text-[18px] text-gray-200">{b.k}</span>
                </div>
            ))}
        </div>
        <span className="text-[18px] text-gray-300">{unit ? `${unit} · ` : ''}{foot}</span>
    </div>
);

export default function MethodsSim() {
    const { step } = useSlideSteps(LINES.length);
    const focus = Math.min(step, 2);
    return (
        <Frame step={step} line={LINES[step]} chips={<DesignChip>{DESIGNS[step]}</DesignChip>} source={SOURCE}>
            <div className="relative h-full">
                <div className="grid h-full grid-cols-3 gap-4">
                    {METHODS.map((m, i) => (
                        <MethodCard key={m.id} m={m} state={i === focus ? 'on' : i < focus ? 'past' : 'off'} />
                    ))}
                </div>
                <Wipe show={step === 3} from="right" className="absolute inset-0 flex items-center gap-12 rounded-2xl border-2 px-12"
                    style={{ background: '#060C17', borderColor: C.stone }}>
                    {step === 3 && (
                        <>
                            <Pair title="Glicogênio na biópsia" before={ROUTLEDGE.glycogen.before} after={ROUTLEDGE.glycogen.after}
                                max={ROUTLEDGE.glycogen.before} color={C.glycogen} unit={ROUTLEDGE.glycogen.unit} foot="antes × depois do jogo: caiu ~40%" />
                            <Pair title="Escore do ultrassom" before={ROUTLEDGE.score.before} after={ROUTLEDGE.score.after}
                                max={ROUTLEDGE.score.after} color={C.stone} foot={`antes × depois do jogo: não mudou (${ROUTLEDGE.p})`} />
                        </>
                    )}
                </Wipe>
            </div>
        </Frame>
    );
}
