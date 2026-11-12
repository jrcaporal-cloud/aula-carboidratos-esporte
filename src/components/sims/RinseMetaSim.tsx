import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Beat } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { ForestPlot, type ForestRow } from './kit/ForestPlot';
import { C, PANEL_BG } from './kit/palette';
import { Stamp } from './kit/Stamp';
import { Lead, SimFrame } from './ato6/Frame';
import { FED, META_DESIGN, META_LEADS, META_SOURCES } from './ato6/rinse.content';

/**
 * Slide 111 · O Tamanho Real do Bochecho. O gráfico de floresta da meta-análise (potência pequena, tempo nulo),
 * depois o estado alimentar que encolhe o efeito e o ensaio nulo bem controlado. Fecha com o carimbo "depende".
 */

const ROWS: readonly ForestRow[] = [
    { id: 'pot', label: 'Potência média', sub: '16 ensaios · n = 175', est: 0.25, lo: 0.04, hi: 0.46, kind: 'pooled', color: C.glucose, right: '0,25 (0,04 a 0,46)' },
    { id: 'tempo', label: 'Tempo para completar', sub: 'negativo = mais rápido · p = 0,25', est: -0.13, lo: -0.36, hi: 0.1, kind: 'pooled', color: '#CBD5E1', right: '−0,13 (−0,36 a 0,10)' },
];

const Fed = () => (
    <div className="flex gap-5">
        {FED.map((f, i) => (
            <motion.div key={f.label} className="flex flex-1 items-center gap-6 rounded-2xl px-6 py-4" style={PANEL_BG}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.1, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                <CountUp text={f.value} delay={stagger(i, 0.2, 0.12)} className="font-display text-[64px] font-bold leading-none"
                    style={{ color: i === 0 ? C.glucose : C.glucoseSoft }} />
                <span className="flex flex-col">
                    <span className="text-[24px] font-semibold text-white">{f.label}</span>
                    <span className="font-mono text-[18px] text-gray-400">{f.watts}</span>
                </span>
            </motion.div>
        ))}
    </div>
);

const Null = () => (
    <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 rounded-2xl px-6 py-4" style={PANEL_BG}>
            <span className="font-display text-[56px] font-bold leading-none text-gray-200">p = 0,277</span>
            <span className="text-[20px] leading-snug text-gray-300">sacarose × placebo adoçado,<br />jejum e alimentado</span>
        </div>
        <Stamp verdict="depende" size="lg" />
    </div>
);

export default function RinseMetaSim() {
    const { step } = useSlideSteps(4);
    const rows = step === 0 ? ROWS.slice(0, 1) : ROWS;
    return (
        <SimFrame
            lead={<Beat beat={`l${step}`}><Lead>{META_LEADS[step]}</Lead></Beat>}
            chips={<DesignChip>{META_DESIGN[step]}</DesignChip>}
            source={META_SOURCES[step]}>
            <div className="flex h-full flex-col justify-center gap-6">
                {/* no último passo a floresta sai: fica só o ensaio nulo e o veredito */}
                {step < 3 && <div className="h-[210px] shrink-0" style={{ opacity: step === 2 ? 0.7 : 1, transition: 'opacity 300ms' }}>
                    <ForestPlot rows={rows} width={1136} height={210} domain={[-0.5, 0.7]} ticks={[-0.4, -0.2, 0, 0.2, 0.4, 0.6]}
                        axisLabel="diferença padronizada (SMD), bochecho × placebo" decimals={2} labelWidth={330} valueWidth={230} />
                </div>}
                {step < 2 && (
                    <Beat beat={`n${step}`} className="flex items-baseline gap-5">
                        <CountUp text={step === 0 ? 'SMD 0,25' : 'p = 0,25'} className="font-display text-[72px] font-bold leading-none"
                            style={{ color: step === 0 ? C.glucose : '#E5E7EB' }} />
                        <span className="text-[22px] text-gray-300">{step === 0 ? 'efeito pequeno na potência' : 'no tempo: não significativo'}</span>
                    </Beat>
                )}
                {step === 2 && <Fed />}
                {step === 3 && <Null />}
            </div>
        </SimFrame>
    );
}
