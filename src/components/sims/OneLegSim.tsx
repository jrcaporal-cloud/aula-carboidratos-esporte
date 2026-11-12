import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Tank } from './kit/Tank';
import { DesignChip, IllustrativeChip, ViaReviewChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { LEG_STAGES, ONE_LEG_SOURCE, REST_LEVEL } from './ato4/oneLeg.content';

/**
 * Slide 61 · o cicloergômetro de Bergström e Hultman visto de cima: cada um pedala com uma perna.
 * A cor da perna acompanha o tanque dela; os dois tanques (pedalou × parada) divergem dia a dia na régua de baixo.
 */

const AXLE = { x: 310, y: 176 } as const;

interface LegProps { hip: readonly [number, number]; foot: readonly [number, number]; level: number; reduce: boolean }

/** Perna vista de cima: base cinza; o violeta por cima acende conforme o glicogênio. */
const Leg = ({ hip, foot, level, reduce }: LegProps) => (
    <g strokeLinecap="round">
        <line x1={hip[0]} y1={hip[1]} x2={foot[0]} y2={foot[1]} stroke="#3A4152" strokeWidth={22} />
        <motion.line x1={hip[0]} y1={hip[1]} x2={foot[0]} y2={foot[1]} stroke={C.glycogen} strokeWidth={22}
            initial={false} animate={{ opacity: Math.min(1, level * 1.3) }} transition={{ duration: reduce ? 0 : DUR.draw, ease: EASE_OUT }} />
    </g>
);

/** Um cientista sentado de lado: tronco, cabeça, a perna que pedala e a que descansa. */
const Scientist = ({ side, worked, reduce }: { side: 'left' | 'right'; worked: number; reduce: boolean }) => {
    const s = side === 'left' ? -1 : 1;
    const cx = AXLE.x + s * 200;
    const hipY = AXLE.y + 22;
    const pedal = [AXLE.x + s * 72, AXLE.y] as const;
    return (
        <g>
            <Leg hip={[cx - s * 30, hipY]} foot={pedal} level={worked} reduce={reduce} />
            <Leg hip={[cx - s * 30, hipY + 30]} foot={[cx - s * 70, hipY + 112]} level={REST_LEVEL} reduce={reduce} />
            <rect x={cx - 34} y={AXLE.y - 50} width={68} height={128} rx={30} fill="#566074" />
            <circle cx={cx + s * 26} cy={AXLE.y + 12} r={26} fill={C.stone} />
        </g>
    );
};

const Bike = () => (
    <g>
        <rect x={AXLE.x - 14} y={34} width={28} height={92} rx={10} fill={C.co2} />
        <rect x={AXLE.x - 6} y={110} width={12} height={170} fill="#566074" />
        <rect x={AXLE.x - 72} y={AXLE.y - 5} width={144} height={10} rx={5} fill={C.stone} />
        <rect x={AXLE.x - 92} y={AXLE.y - 14} width={24} height={28} rx={5} fill={C.stone} />
        <rect x={AXLE.x + 68} y={AXLE.y - 14} width={24} height={28} rx={5} fill={C.stone} />
        <SvgText x={AXLE.x} y={24} text="cicloergômetro, visto de cima" size={17} anchor="middle" color={C.muted} />
    </g>
);

const Scene = ({ worked, reduce }: { worked: number; reduce: boolean }) => (
    <svg viewBox="0 0 620 330" className="block h-[288px] w-[541px] shrink-0" role="img"
        aria-label="Bergström e Hultman em lados opostos do mesmo cicloergômetro, cada um pedalando com uma perna">
        <Bike />
        <Scientist side="left" worked={worked} reduce={reduce} />
        <Scientist side="right" worked={worked} reduce={reduce} />
        <SvgText x={AXLE.x - 200} y={318} text="Bergström · esquerda" size={18} anchor="middle" color={C.stone} />
        <SvgText x={AXLE.x + 200} y={318} text="Hultman · direita" size={18} anchor="middle" color={C.stone} />
    </svg>
);

/** Régua dos dias: o marcador anda de parada em parada (posição em cqw, só transform). */
const DayTrack = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const last = LEG_STAGES.length - 1;
    return (
        <div className="relative mx-6 [container-type:inline-size]">
            <div className="h-[4px] w-full rounded bg-white/20" />
            <motion.div className="absolute left-0 top-0 h-[4px] w-full origin-left rounded" style={{ background: C.glycogen }}
                initial={false} animate={{ scaleX: step / last }} transition={{ duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT }} />
            <motion.div className="absolute top-[-8px] w-0" initial={false} animate={{ x: `${(step / last) * 100}cqw` }}
                transition={{ duration: reduce ? 0 : DUR.morph, ease: EASE_IN_OUT }}>
                <span className="absolute left-[-10px] block h-5 w-5 rounded-full border-[3px] border-[#04080F]" style={{ background: C.glycogenSoft }} />
            </motion.div>
            <div className="relative mt-3 h-[26px]">
                {LEG_STAGES.map((s, i) => (
                    <span key={s.stop} className="absolute whitespace-nowrap text-[18px] transition-colors duration-300"
                        style={{ left: `${(i / last) * 100}%`, transform: `translateX(${i === 0 ? '0' : i === last ? '-100%' : '-50%'})`, color: i === step ? '#fff' : C.muted, fontWeight: i === step ? 700 : 400 }}>
                        {s.stop}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default function OneLegSim() {
    const { step } = useSlideSteps(LEG_STAGES.length);
    const reduce = useReducedMotion() ?? false;
    const stage = LEG_STAGES[step];
    const done = step === LEG_STAGES.length - 1;
    return (
        <SimBox>
            <Lead beat={step} chips={<><DesignChip>autoexperimento · n = 2 · uma perna</DesignChip><ViaReviewChip>relato de Harris, via Stout 2025</ViaReviewChip><IllustrativeChip /></>} className="min-h-[72px]">{stage.lead}</Lead>
            <div className="flex items-end gap-6">
                <Scene worked={stage.worked} reduce={reduce} />
                <div className="flex flex-1 items-end justify-center gap-10 pb-2">
                    <Tank level={stage.worked} label="pedalou" value={stage.workedTag} width={88} height={210} active />
                    <Tank level={REST_LEVEL} label="ficou parada" value="controle" width={88} height={210} />
                    <motion.div className="flex w-[150px] flex-col gap-1 pb-10" initial={false}
                        animate={{ opacity: done ? 1 : 0, y: done || reduce ? 0 : 8 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <span className="font-display text-[34px] font-semibold leading-none" style={{ color: C.glycogenSoft }}>local</span>
                        <span className="text-[18px] leading-snug text-gray-200">a dieta foi a mesma para as duas pernas</span>
                    </motion.div>
                </div>
            </div>
            <div className="mt-3"><DayTrack step={step} reduce={reduce} /></div>
            <Foot source={ONE_LEG_SOURCE} />
        </SimBox>
    );
}
