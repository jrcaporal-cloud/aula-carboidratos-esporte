import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { castOf } from './kit/cast';
import { DesignChip, FictionChip } from './kit/chips';
import { sample, useMorphPath } from './kit/useMorphPath';
import { Foot, Lead, SimBox } from './ato4/frame';
import { planSpeed, WAFFLES, WALL_LEADS, WALL_SOURCE, wallSpeed } from './ato4/wall.content';

/**
 * Slide 68 · a volta da Marina: a linha do ritmo planejado se transforma na do muro (morfose). Depois, à direita,
 * dois quadros de 100 corredores com os 28% e 17% reais de Smyth 2021.
 */

const W = 560;
const H = 280;
const X0 = 30;
const X1 = 540;
const KM = 42.2;
const sx = (km: number) => X0 + (km / KM) * (X1 - X0);
const sy = (v: number) => 60 + (1 - v) * 420;
const toPts = (f: (km: number) => number) => sample(43, 0, KM, f, (km, v) => [sx(km), sy(v)] as const);
const PLAN = toPts(planSpeed);
const WALL = toPts(wallSpeed);

const PaceChart = ({ crashed }: { crashed: boolean }) => {
    const ref = useMorphPath(crashed ? WALL : PLAN, 800);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }} className="block shrink-0" role="img"
            aria-label="Velocidade da Marina ao longo da maratona, com queda a partir do km 32">
            <line x1={X0} y1={sy(1)} x2={X1} y2={sy(1)} stroke="#3A4152" strokeWidth={2} />
            <SvgText x={X0} y={sy(1) - 16} text="ritmo planejado" size={17} color={C.caveat} />
            <path ref={ref} fill="none" stroke={crashed ? C.risk : C.stone} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
            <motion.g initial={false} animate={{ opacity: crashed ? 1 : 0 }} transition={{ duration: DUR.enter, delay: crashed ? 0.5 : 0 }}>
                <line x1={sx(32)} y1={sy(1) + 18} x2={sx(32)} y2={H - 40} stroke={C.stone} strokeWidth={3} />
                <SvgText x={sx(32) - 12} y={sy(1) + 44} text="km 32" size={20} anchor="end" color={C.stone} weight={700} />
                <SvgText x={sx(33) + 4} y={sy(1 / 1.4) - 16} text="−40%" size={22} color={C.risk} weight={700} />
            </motion.g>
            <line x1={X0} y1={H - 24} x2={X1} y2={H - 24} stroke={C.co2} strokeWidth={2} />
            {[0, 10, 20, 30, 42].map(k => <SvgText key={k} x={sx(Math.min(k, KM))} y={H - 4} text={`${k}`} size={16} anchor="middle" color={C.muted} />)}
        </svg>
    );
};

const Marina = () => {
    const m = castOf('marina');
    const Icon = m.icon;
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
                <Icon size={44} strokeWidth={2.2} color="#FFFFFF" aria-hidden />
                <span className="font-display text-[40px] font-semibold leading-none text-white">{m.name}</span>
            </div>
            <span className="text-[22px] text-gray-200">{m.age} anos · {m.kg} kg · {m.sport}</span>
            <span className="text-[22px] italic text-gray-100">{m.dilemma}</span>
            <span className="self-start"><FictionChip /></span>
        </div>
    );
};

/** 100 corredores; os que batem no muro se pintam em sequência (atraso com teto). */
const Waffle = ({ pct, who }: { pct: number; who: string }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col items-start gap-3">
            <div className="grid grid-cols-10 gap-[4px]">
                {Array.from({ length: 100 }, (_, i) => (
                    <motion.span key={i} className="block h-[17px] w-[17px] rounded-[3px]" initial={false}
                        animate={{ backgroundColor: i < pct ? C.risk : '#2A3140' }}
                        transition={{ duration: reduce ? 0 : DUR.text, delay: reduce ? 0 : Math.min(i * 0.02, 0.6), ease: EASE_OUT }} />
                ))}
            </div>
            <span className="font-display text-[44px] font-semibold leading-none" style={{ color: C.risk }}>{pct}%</span>
            <span className="text-[20px] text-gray-200">{who}</span>
        </div>
    );
};

export default function WallStatsSim() {
    const { step } = useSlideSteps(WALL_LEADS.length);
    const stats = step >= 2;
    return (
        <SimBox>
            <Lead beat={step} chips={stats
                ? <><DesignChip>observacional · N = 1.928.813 · OR 1,43</DesignChip>{step === 3 && <DesignChip>muro inferido pelo ritmo; glicogênio não medido</DesignChip>}</>
                : <DesignChip>a queda desenhada é a média de Smyth 2021</DesignChip>} className="min-h-[72px]">{WALL_LEADS[step]}</Lead>
            <div className="mt-4 flex flex-1 items-start gap-12">
                <PaceChart crashed={step >= 1} />
                <div className="flex-1 pt-2">
                    {stats
                        ? <motion.div className="flex gap-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter }}>
                            {WAFFLES.map(w => <Waffle key={w.who} pct={w.pct} who={w.who} />)}
                        </motion.div>
                        : <Marina />}
                </div>
            </div>
            <Foot source={WALL_SOURCE} />
        </SimBox>
    );
}
