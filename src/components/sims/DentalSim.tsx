import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Grow, Wipe } from './kit/Beat';
import { DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB, StageBlock } from './ato9/FrameB';
import { CellHead } from './ato9/WomenYouthCharts';
import { ERODED, HABITS, LEDGER, NEEDLEMAN, ODDS, PRACTICE, STEPS, TEETH, type PctBar } from './ato9/dental.content';

/**
 * Slide 170 · O Preço no Sorriso, palco + painel. À esquerda, a arcada de 20 dentes chapados: 9 ganham a cor da erosão
 * (45%). À direita do palco, os três estudos se empilham e ficam: prevalências de Londres 2012, o hábito (escova × bebe)
 * e a razão de chances do esporte coletivo com o intervalo. O fecho prático entra no último passo.
 */

const AW = 520;
const AH = 380;
const ACCENT = [C.risk, C.glucoseSoft, C.risk] as const;

interface Tooth { x: number; y: number; rot: number; eroded: boolean; rank: number }

/** Distribui as 9 erosões ao longo da arcada (sem amontoar num lado); `rank` dá a ordem de entrada. */
const ARCH: readonly Tooth[] = Array.from({ length: TEETH }, (_, i) => {
    const t = Math.PI + ((i + 0.5) / TEETH) * Math.PI;
    const eroded = Math.floor(((i + 1) * ERODED) / TEETH) > Math.floor((i * ERODED) / TEETH);
    const rank = Math.floor((i * ERODED) / TEETH);
    return { x: AW / 2 + 215 * Math.cos(t), y: 350 + 290 * Math.sin(t), rot: (t * 180) / Math.PI + 90, eroded, rank };
});

const Arch = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${AW} ${AH}`} width={280} height={205} role="img" aria-label={`${ERODED} de ${TEETH} dentes com erosão`}>
            {ARCH.map((th, i) => (
                <g key={i} transform={`translate(${th.x.toFixed(1)} ${th.y.toFixed(1)}) rotate(${th.rot.toFixed(1)})`}>
                    <rect x={-17} y={-24} width={34} height={48} rx={12} fill={C.text} />
                    {th.eroded && (
                        <motion.path d="M-17 -6 Q-8 4 0 -4 Q8 -12 17 -2 L17 12 Q17 24 5 24 L-5 24 Q-17 24 -17 12 Z" fill={C.risk}
                            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: reduce ? 0 : 0.3 + th.rank * 0.07, duration: 0.35, ease: EASE_OUT }} />
                    )}
                </g>
            ))}
        </svg>
    );
};

const PctRows = ({ bars, labelW = 110 }: { bars: readonly PctBar[]; labelW?: number }) => (
    <div className="flex flex-col gap-1">
        {bars.map((b, i) => (
            <div key={b.label} className="flex items-center gap-2">
                <span className="text-[16px] text-gray-100" style={{ width: labelW }}>{b.label}</span>
                <div className="relative h-[18px] w-[150px] overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <Grow value={b.value / 100} color={b.color} delay={0.1 + i * 0.1} />
                </div>
                <span className="font-mono text-[17px] font-bold tabular-nums" style={{ color: b.color === C.co2 ? C.text : b.color }}>{b.value}%</span>
            </div>
        ))}
    </div>
);

/** Razão de chances (Gallagher 2018) com o IC 95% e a linha do "sem diferença" em 1. */
const OddsPlot = () => {
    const sx = (v: number) => 16 + (v / 4) * 300;
    return (
        <svg viewBox="0 0 330 70" width={330} height={70} role="img" aria-label="Razão de chances 2,0, IC 95% 1,3 a 3,1">
            <line x1={sx(0)} x2={sx(4)} y1={34} y2={34} stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
            <line x1={sx(1)} x2={sx(1)} y1={10} y2={50} stroke={C.text} strokeWidth={3} strokeDasharray="5 5" />
            <line x1={sx(ODDS.lo)} x2={sx(ODDS.hi)} y1={34} y2={34} stroke={C.risk} strokeWidth={7} strokeLinecap="round" />
            <rect x={sx(ODDS.or) - 9} y={25} width={18} height={18} fill={C.risk} stroke="#04080F" strokeWidth={3} />
            <SvgText x={sx(ODDS.or) + 14} y={20} text="OR 2,0 (1,3–3,1)" size={16} color={C.text} weight={700} />
            {[0, 1, 2, 3, 4].map(t => <SvgText key={t} x={sx(t)} y={66} text={String(t)} anchor="middle" size={16} color={C.muted} weight={500} />)}
        </svg>
    );
};

export default function DentalSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const last = step === STEPS.length - 1;
    const cell = (i: number) => ({ shown: step >= i, focus: last || step === i });
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="dental-tabs"
            chips={<DesignChip>{s.design}</DesignChip>}
            stage={
                <div className="flex h-full gap-4 px-4 py-3">
                    <div className="flex w-[280px] shrink-0 flex-col gap-2">
                        <Arch />
                        <span className="text-[16px] leading-snug text-gray-200">
                            <b className="font-mono" style={{ color: C.risk }}>{ERODED} de {TEETH}</b> dentes = 45% dos atletas · 1 dente = 5%
                        </span>
                        <Wipe show={last} from="left" className="mt-auto rounded-xl border-2 px-3 py-2" style={{ borderColor: C.ok }}>
                            <span className="block text-[15px] text-gray-300">na orientação</span>
                            <span className="block text-[18px] font-semibold leading-snug text-white">{PRACTICE}</span>
                        </Wipe>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                        <StageBlock {...cell(0)} className="flex flex-col gap-1.5">
                            <CellHead title="Needleman 2013 · Londres 2012" sub="prevalência em 278 atletas" color={C.risk} />
                            <PctRows bars={NEEDLEMAN} />
                        </StageBlock>
                        <StageBlock {...cell(1)} className="flex flex-col gap-1.5 border-t-2 border-white/10 pt-2">
                            <CellHead title="Gallagher 2019" sub="hábito relatado, 352 atletas" color={C.glucoseSoft} />
                            {step >= 1 && <PctRows bars={HABITS} labelW={140} />}
                        </StageBlock>
                        <StageBlock {...cell(2)} className="flex flex-col gap-1 border-t-2 border-white/10 pt-2">
                            <CellHead title="Gallagher 2018" sub="chance de erosão: coletivo × endurance" color={C.risk} />
                            {step >= 2 && <Wipe from="left"><OddsPlot /></Wipe>}
                        </StageBlock>
                    </div>
                </div>
            }
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={<LedgerB title="o que fica" items={LEDGER} step={step} />} />
            } />
    );
}
