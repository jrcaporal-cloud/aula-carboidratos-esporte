import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { SvgText } from './kit/ui';
import { MedirLedger, MedirShell } from './ato10/MedirShell';
import { PercentScene } from './ato10/SbmePercent';
import { BARS, GH_MAX, LEDGER, LEGEND, STEPS, TICKS, YEAR_X, type Bar } from './ato10/sbme.content';

/**
 * Slide 181 · A Diretriz Brasileira Parou em 2009. Linha do tempo que é também gráfico, TUDO em g/h (g/min × 60 rotulado
 * como cálculo): o teto de 80 g/h da SBME nasce em 2009 e corre até hoje; os passos acendem o que veio antes (2000, 2004)
 * e depois (2011), e a barra de 90 g/h atravessa a linha. A legenda cobre cada cor e o traço. No último passo o palco
 * vira a conta dos 60% (ato10/SbmePercent), com o gráfico resumido numa linha no alto.
 */
const STAGE_W = 660;
const W = 628;
const H = 300;
const PL = 46;
const PR = 12;
const PT = 30;
const PB = 254;
const BAR_W = 34;
const xOf = (year: number) => PL + (YEAR_X[year] ?? 1) * (W - PL - PR);
const yOf = (gh: number) => PB - (gh / GH_MAX) * (PB - PT);
const Y_80 = yOf(80);
const ACCENT = [C.stone, C.fructose, C.ok, C.glucose] as const;

const BarMark = ({ b, fresh }: { b: Bar; fresh: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const x = xOf(b.year) + b.dx - (b.kind === 'outline' ? 42 : BAR_W / 2);
    const w = b.kind === 'outline' ? 84 : BAR_W;
    const top = yOf(b.hi);
    const h = yOf(b.lo) - top;
    const outline = b.kind === 'outline';
    return (
        <g>
            <motion.rect x={x} y={top} width={w} height={h} rx={5}
                fill={outline ? 'none' : b.color} stroke={outline ? b.color : 'none'} strokeWidth={outline ? 3 : 0} strokeDasharray={outline ? '8 6' : undefined}
                style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                initial={reduce || !fresh ? false : { scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ duration: DUR.bar, delay: outline ? 0 : 0.2, ease: EASE_OUT }} />
            {b.id === 'coi'
                ? <text x={x + w / 2} y={top + 58} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>
                    <tspan x={x + w / 2}>até</tspan><tspan x={x + w / 2} dy={18}>90</tspan></text>
                : <SvgText x={x + w / 2} y={top - 8} text={b.label} anchor="middle" size={16} color={outline ? C.caveat : b.id === 'ox2000' ? '#E5E7EB' : b.color} />}
        </g>
    );
};

const Chart = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Carboidrato por hora: o que se oxidava, o que se bebia e o que as diretrizes aceitam, de 2000 a 2011">
            {[0, 30, 60, 90, 120].map(v => (
                <g key={v}>
                    <line x1={PL} x2={W - PR} y1={yOf(v)} y2={yOf(v)} stroke="rgba(255,255,255,0.10)" strokeWidth={2} />
                    <SvgText x={PL - 8} y={yOf(v) + 6} text={String(v)} anchor="end" color="#D1D5DB" />
                </g>
            ))}
            <SvgText x={4} y={14} text="g por hora" color="#D1D5DB" />
            <line x1={PL} x2={W - PR} y1={PB} y2={PB} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
            {BARS.filter(b => b.at <= step).map(b => <BarMark key={b.id} b={b} fresh={b.at === step} />)}
            {/* o teto de 2009 corre até hoje */}
            <motion.path d={`M ${xOf(2009) - 26} ${Y_80} L ${W - PR} ${Y_80}`} stroke={C.risk} strokeWidth={4} strokeDasharray="12 8" fill="none"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DUR.draw, ease: EASE_IN_OUT }} />
            <SvgText x={W - PR} y={Y_80 + 24} text="teto SBME 80" anchor="end" color={C.risk} size={17} weight={700} />
            <SvgText x={W - PR} y={Y_80 + 44} text="vale até hoje" anchor="end" color={C.risk} size={16} />
            {step >= 2 && (
                <motion.circle cx={xOf(2011)} cy={Y_80} r={9} fill="none" stroke="#fff" strokeWidth={3}
                    initial={reduce ? false : { opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transition={{ duration: DUR.enter, delay: 0.7, ease: EASE_OUT }} />
            )}
            {TICKS.map(t => (
                <motion.g key={t.year} initial={false} animate={{ opacity: t.at <= step ? 1 : 0 }} transition={{ duration: DUR.enter }}>
                    <SvgText x={xOf(t.year)} y={PB + 21} text={t.top} anchor="middle" color="#fff" size={18} weight={700} />
                    <SvgText x={xOf(t.year)} y={PB + 39} text={t.sub} anchor="middle" color="#D1D5DB" size={16} weight={500} />
                </motion.g>
            ))}
        </svg>
    );
};

/** Legenda: uma entrada para cada cor e para o traço do teto; cada uma acende no passo em que a marca entra. */
const Legend = ({ step }: { step: number }) => (
    <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[16px] leading-tight text-gray-200">
        {LEGEND.map(l => (
            <span key={l.key} className="flex items-center gap-1.5 transition-opacity duration-300" style={{ opacity: l.at <= step ? 1 : 0.6 }}>
                {l.kind === 'line'
                    ? <span className="h-0 w-5 shrink-0 border-t-[4px] border-dashed" style={{ borderColor: l.color }} />
                    : <span className={`h-3.5 w-5 shrink-0 rounded-sm ${l.kind === 'outline' ? 'border-2 border-dashed' : ''}`}
                        style={l.kind === 'outline' ? { borderColor: l.color } : { background: l.color }} />}
                <span className="whitespace-nowrap">{l.label}</span>
            </span>
        ))}
    </div>
);

export default function SbmeSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const chips = (
        <>
            {step === 0 && <DesignChip>diretriz nacional · painel</DesignChip>}
            {(step === 1 || step === 2) && <DesignChip>2004: cruzado · n = 8 · isótopos</DesignChip>}
            {step >= 1 && step < 3 && <CalcChip>g/h = g/min × 60 (cálculo)</CalcChip>}
            {step >= 3 && <CalcChip>% → g/kg: cálculo (4 kcal/g · 70 kg)</CalcChip>}
        </>
    );
    const stage = (
        <div className="flex h-full flex-col gap-2 px-4 py-3">
            {step < 3 ? (
                <>
                    <Legend step={step} />
                    <Chart step={step} />
                </>
            ) : <PercentScene />}
        </div>
    );
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-sbme-tabs" chips={chips}
            stageWidth={STAGE_W} stage={stage} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<MedirLedger rows={LEDGER} step={step} termWidth={112} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
