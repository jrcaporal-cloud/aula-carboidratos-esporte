import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Panel, Source, SvgText } from './kit/ui';
import { DesignChip, IllustrativeChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { ShellA } from './ato4/shellA';
import { LEG_CARDS, LEG_LEVEL, LEG_POINTS, LEG_TABS, ONE_LEG_SOURCES } from './ato4/oneLeg.content';

/**
 * Slide 61 · composição em duas faixas: em cima, a bicicleta vista de cima (cada um pedala com uma perna) e o
 * caderno das duas pernas ao longo dos dias (barras que se acumulam, a faixa da dieta, a chave do +50–60%);
 * embaixo, o tríptico desenho → resultado → leitura, que se preenche e fica.
 */

const AXLE = { x: 220, y: 100 } as const;
const BASE = 160;
const UNIT = 66;
const GROUP_X = [96, 218, 340, 462] as const;

interface LegProps { hip: readonly [number, number]; foot: readonly [number, number]; level: number; reduce: boolean }

/** Perna vista de cima: base cinza; o violeta por cima acompanha o glicogênio. */
const Leg = ({ hip, foot, level, reduce }: LegProps) => (
    <g strokeLinecap="round">
        <line x1={hip[0]} y1={hip[1]} x2={foot[0]} y2={foot[1]} stroke="#3A4152" strokeWidth={18} />
        <motion.line x1={hip[0]} y1={hip[1]} x2={foot[0]} y2={foot[1]} stroke={C.glycogen} strokeWidth={18}
            initial={false} animate={{ opacity: Math.min(1, 0.15 + level * 0.6) }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
    </g>
);

const Scientist = ({ side, level, reduce, name }: { side: -1 | 1; level: number; reduce: boolean; name: string }) => {
    const cx = AXLE.x + side * 150;
    return (
        <g>
            <Leg hip={[cx - side * 22, AXLE.y + 4]} foot={[AXLE.x + side * 58, AXLE.y]} level={level} reduce={reduce} />
            <Leg hip={[cx - side * 22, AXLE.y + 30]} foot={[cx + side * 8, 182]} level={1} reduce={reduce} />
            <rect x={cx - 26} y={58} width={52} height={92} rx={24} fill="#566074" />
            <circle cx={cx + side * 18} cy={AXLE.y} r={19} fill={C.stone} />
            <SvgText x={cx} y={20} text={name} size={17} weight={700} anchor="middle" color={C.stone} />
            <SvgText x={cx} y={42} text={side < 0 ? 'pedala a esquerda' : 'pedala a direita'} size={16} anchor="middle" color={C.glycogenSoft} />
        </g>
    );
};

const Scene = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <svg viewBox="0 0 440 200" width={440} height={200} className="block shrink-0" role="img"
        aria-label="Bergström e Hultman em lados opostos do mesmo cicloergômetro, cada um pedalando com uma perna">
        <rect x={AXLE.x - 22} y={AXLE.y + 18} width={44} height={56} rx={8} fill={C.co2} />
        <rect x={AXLE.x - 64} y={AXLE.y - 5} width={128} height={10} rx={5} fill={C.stone} />
        <SvgText x={AXLE.x} y={20} text="o mesmo" size={16} anchor="middle" color={C.muted} />
        <SvgText x={AXLE.x} y={40} text="cicloergômetro" size={16} anchor="middle" color={C.muted} />
        <Scientist side={-1} name="Bergström" level={LEG_LEVEL[step]} reduce={reduce} />
        <Scientist side={1} name="Hultman" level={LEG_LEVEL[step]} reduce={reduce} />
        <motion.g initial={false} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <SvgText x={AXLE.x} y={194} text="efeito local" size={20} weight={700} anchor="middle" color={C.glycogenSoft} />
        </motion.g>
    </svg>
);

/** O caderno: glicogênio das duas pernas em cada parada, relativo à perna parada. */
const Notebook = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <svg viewBox="0 0 670 200" width={670} height={200} className="block" role="img"
        aria-label="Glicogênio da perna que pedalou e da parada: antes, na exaustão, no dia 1 e no dia 3, quando a exercitada está 50 a 60% acima">
        <rect x={16} y={18} width={16} height={16} fill={C.glycogen} />
        <SvgText x={40} y={32} text="pedalou" size={16} color={C.stone} />
        <rect x={120} y={18} width={16} height={16} fill="#5B6375" />
        <SvgText x={144} y={32} text="parada" size={16} color={C.stone} />
        <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter }}>
            <rect x={276} y={14} width={232} height={26} rx={6} fill={C.glucose} fillOpacity={0.18} stroke={C.glucose} strokeWidth={2} />
            <SvgText x={392} y={33} text="dieta rica em carboidrato" size={16} anchor="middle" color={C.glucoseSoft} />
        </motion.g>
        <line x1={30} y1={BASE} x2={510} y2={BASE} stroke={C.co2} strokeWidth={2} />
        {LEG_POINTS.map((p, i) => {
            const on = step >= p.at;
            const x = GROUP_X[i];
            return (
                <motion.g key={p.label} initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
                    <motion.rect x={x - 46} y={BASE - UNIT * p.worked} width={40} height={UNIT * p.worked} fill={C.glycogen}
                        style={{ originX: 0.5, originY: 1 }} initial={false} animate={{ scaleY: on ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : DUR.bar, delay: on && !reduce ? stagger(0, 0.15) : 0, ease: EASE_OUT }} />
                    <rect x={x + 6} y={BASE - UNIT} width={40} height={UNIT} fill="#5B6375" />
                    <SvgText x={x} y={186} text={p.label} size={17} anchor="middle" color={on && step === p.at ? '#fff' : C.stone} />
                </motion.g>
            );
        })}
        <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 3 ? 0.5 : 0 }}>
            <path d={`M 514 ${BASE - UNIT * 1.55} h 10 V ${BASE - UNIT} h -10`} fill="none" stroke={C.glycogenSoft} strokeWidth={3} />
            <SvgText x={532} y={BASE - UNIT * 1.27 + 9} text="+50–60%" size={24} weight={700} color={C.glycogenSoft} />
            <SvgText x={532} y={BASE - UNIT * 1.27 + 32} text="no 3º dia" size={16} color={C.stone} />
        </motion.g>
    </svg>
);

const Cards = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="grid h-[176px] shrink-0 grid-cols-3 gap-4">
            {LEG_CARDS.map((c, i) => {
                const shown = step >= c.at;
                const live = c.lines.some(l => l.at === step);
                return (
                    <motion.div key={c.title} className="flex" initial={false} animate={{ opacity: shown ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : DUR.enter }}>
                    <Panel state={live ? 'active' : 'idle'} glow={C.glycogenSoft} className="flex-1 px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="m-0 font-display text-[22px] font-semibold leading-tight" style={{ color: i === 2 ? C.glycogenSoft : C.stone }}>{c.title}</h3>
                            {c.lines.filter(l => l.at <= step).map(l => (
                                <motion.p key={l.text} className="m-0 text-[16px] leading-snug text-gray-100" initial={reduce ? false : { opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: l.at === step && !reduce ? 0.3 : 0, ease: EASE_OUT }}>
                                    {l.text}
                                </motion.p>
                            ))}
                        </div>
                    </Panel>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default function OneLegSim() {
    const { step, setStep } = useSlideSteps(LEG_TABS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <ShellA tabs={LEG_TABS} step={step} onSelect={setStep} layoutId="one-leg-tabs"
            chips={<>
                <DesignChip>autoexperimento · n = 2</DesignChip>
                <ViaReviewChip>Nature 1966, via Stout</ViaReviewChip>
                <IllustrativeChip>alturas ilustrativas</IllustrativeChip>
            </>}>
            <div className="flex w-full flex-col gap-2">
                <Panel className="flex shrink-0 items-center gap-2 px-1 py-0.5">
                    <Scene step={step} reduce={reduce} />
                    <Notebook step={step} reduce={reduce} />
                </Panel>
                <Cards step={step} />
                <Source>{sourcesUpTo(ONE_LEG_SOURCES, step)}</Source>
            </div>
        </ShellA>
    );
}
