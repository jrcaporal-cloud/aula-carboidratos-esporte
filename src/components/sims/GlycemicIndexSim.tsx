import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { Beat, Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip, IllustrativeChip } from './kit/chips';
import { Source, SvgText } from './kit/ui';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { toPath, useMorphPath } from './kit/useMorphPath';
import { AXIS, FOODS, H, LOADS, W } from './ato2/glycemic.content';

/**
 * Slide 29 · Índice Glicêmico: o Que Ele Mede. A curva de glicemia se transforma de um alimento em outro
 * (useMorphPath) com a área sob a curva preenchida; o IG conta junto. Depois, carga glicêmica e o limite do IG.
 */
interface Step { food: number; line: string; panel: 'gi' | 'load' | 'limit' }

const STEPS: readonly Step[] = [
    { food: 0, panel: 'gi', line: 'Glicemia por 2 h, em jejum. A área sob a curva da glicose vale 100.' },
    { food: 1, panel: 'gi', line: 'A mesma quantidade de carboidrato num cereal matinal: área menor, IG ~65.' },
    { food: 2, panel: 'gi', line: 'Numa leguminosa seca, IG ~31. Gordura e proteína do alimento também achatam a curva.' },
    { food: 1, panel: 'load', line: 'O IG não diz quanto se comeu. A carga glicêmica junta qualidade e quantidade.' },
    { food: 1, panel: 'limit', line: 'O IG mede o sangue em repouso, não a prova. Volta em “A Refeição de 3–4 Horas” e no “Mito ou Verdade?”.' },
];

const Chart = ({ food, dim }: { food: number; dim: boolean }) => {
    const f = FOODS[food];
    const lineRef = useMorphPath(f.line, 700);
    const areaRef = useMorphPath(f.area, 700);
    return (
        <motion.svg viewBox={`0 0 ${W} ${H}`} className="h-[340px] w-[700px]" role="img" aria-label={`Curva de glicemia: ${f.name}`}
            animate={{ opacity: dim ? 0.6 : 1 }} transition={{ duration: DUR.enter }}>
            <path ref={areaRef} fill={C.glucose} fillOpacity={0.35} />
            {food > 0 && <path d={toPath(FOODS[0].line)} fill="none" stroke="#E5E7EB" strokeWidth={3} strokeDasharray="9 7" />}
            <path ref={lineRef} fill="none" stroke={C.glucose} strokeWidth={6} strokeLinejoin="round" />
            <line x1={AXIS.X0} y1={AXIS.BASE} x2={AXIS.X1} y2={AXIS.BASE} stroke="#94A3B8" strokeWidth={3} />
            <line x1={AXIS.X0} y1={40} x2={AXIS.X0} y2={AXIS.BASE} stroke="#94A3B8" strokeWidth={3} />
            {AXIS.ticks.map(t => <SvgText key={t.t} x={t.x} y={AXIS.BASE + 28} text={String(t.t)} size={18} anchor="middle" color="#D1D5DB" />)}
            <SvgText x={AXIS.X1} y={AXIS.BASE + 56} text="minutos" size={18} anchor="end" color="#D1D5DB" />
            <SvgText x={AXIS.X0 - 10} y={AXIS.BASE - 4} text="jejum" size={16} anchor="end" color="#D1D5DB" />
            <SvgText x={AXIS.X0 + 12} y={34} text="glicemia" size={18} color="#D1D5DB" />
            {food > 0 && <SvgText x={AXIS.X1} y={60} text="- - glicose" size={18} anchor="end" color="#E5E7EB" />}
        </motion.svg>
    );
};

/** Faixas de IG usadas na literatura do esporte: baixo ≤ 55, alto ≥ 70. */
const GiScale = ({ gi }: { gi: number }) => (
    <div className="flex flex-col gap-2">
        <div className="relative h-[16px] w-full rounded-full bg-slate-700 [container-type:inline-size]">
            <div className="absolute inset-y-0 left-0 rounded-l-full" style={{ width: '55%', background: C.co2 }} />
            <div className="absolute inset-y-0 right-0 rounded-r-full" style={{ width: '30%', background: C.glucoseDeep }} />
            <div className="absolute -top-[8px] left-0 w-0">
                <motion.span className="block h-[32px] w-[6px] -translate-x-1/2 rounded bg-white" initial={false}
                    animate={{ x: `${gi}cqw` }} transition={{ duration: 0.7, ease: EASE_OUT }} />
            </div>
        </div>
        <div className="flex justify-between text-[16px] text-gray-300">
            <span>baixo ≤ 55</span><span>alto ≥ 70</span>
        </div>
    </div>
);

const LoadPanel = () => (
    <div className="flex flex-col gap-4">
        <span className="text-[20px] text-gray-200">CG = IG × gramas de CHO ÷ 100 · cereal, IG 65</span>
        {LOADS.map((l, i) => (
            <div key={l.label} className="flex flex-col gap-1">
                <span className="text-[18px] text-gray-200">{l.label}</span>
                <div className="flex items-center gap-3">
                    <div className="relative h-[36px] flex-1 overflow-hidden rounded-lg bg-slate-800">
                        <Grow value={l.load / 45} color={C.glucose} delay={0.15 + i * 0.15} />
                    </div>
                    <CountUp text={String(l.load)} delay={0.15 + i * 0.15} className="w-[64px] font-display text-[40px] font-bold" style={{ color: C.glucose }} />
                </div>
            </div>
        ))}
    </div>
);

export default function GlycemicIndexSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const f = FOODS[s.food];
    return (
        <div className="not-prose flex flex-col gap-3" style={BODY_FONT}>
            <div className="grid grid-cols-[700px_1fr] items-center gap-8 rounded-2xl px-5 py-3" style={PANEL_BG}>
                <Chart food={s.food} dim={s.panel === 'limit'} />
                <div className="flex flex-col gap-5">
                    {s.panel === 'load' ? <LoadPanel /> : (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="text-[20px] text-gray-200">{f.name}</span>
                                <span className="flex items-baseline gap-3">
                                    <span className="font-display text-[28px] font-semibold text-gray-300">IG</span>
                                    <CountUp key={f.gi} text={String(f.gi)} className="font-display text-[88px] font-bold leading-none" style={{ color: C.glucose }} />
                                </span>
                            </div>
                            <GiScale gi={f.gi} />
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-start justify-between gap-6">
                <Beat beat={step} className="max-w-[880px]">
                    <p className={`m-0 leading-snug text-gray-100 ${s.panel === 'limit' ? 'text-[30px] font-semibold' : 'text-[27px]'}`}>{s.line}</p>
                </Beat>
                <span className="mt-1 flex shrink-0 flex-col items-end gap-2">
                    <IllustrativeChip />
                    {s.panel === 'load' && <CalcChip>cálculo pela definição de CG</CalcChip>}
                </span>
            </div>
            <Source>Jenkins DJ et al. Am J Clin Nutr 1981 · Atkinson FS et al. Am J Clin Nutr 2021 · Burdon CA et al. Sports Med 2017</Source>
        </div>
    );
}
