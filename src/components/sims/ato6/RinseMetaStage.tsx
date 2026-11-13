import { ForestPlot } from '../kit/ForestPlot';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { ChainCell as Cell, ScaleBar as Bar } from '../ato3/chainStrip';
import { LANE_GAINS, LANE_MAX, META_ROWS, TROM_AXIS, TROM_ROWS } from './rinsemeta.content';

/**
 * Slide 111 · o palco em 3 faixas numeradas, um estudo e um eixo por faixa (componente comum ato3/chainStrip):
 * 1 a meta-análise (SMD; potência no passo 1, tempo no 2) → 2 Lane 2013 (ganho de potência, %) →
 * 3 Trommelen 2015 (tempo, min). Antes do passo, só a moldura tracejada com o título.
 */

const FOREST_W = 412;
const FOREST_H = 146;
const PLACEBO = '#94A3B8';

/** Linha de apoio do desenho (o que o eixo mede). */
const Caption = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[16px] leading-tight text-gray-300">{children}</span>
);

const tPos = (min: number) => `${((min - TROM_AXIS[0]) / (TROM_AXIS[1] - TROM_AXIS[0])) * 100}%`;

const Dot = ({ min, color }: { min: number; color: string }) => (
    <span className="absolute top-1/2 h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: tPos(min), background: color, border: '3px solid #04080F' }} />
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
    <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />{label}
    </span>
);

const TROM_GRID = 'grid grid-cols-[86px_1fr_110px] items-center gap-2';

/** Trommelen 2015: placebo doce × sacarose por estado alimentar, no eixo de minutos (67 a 70). */
const TromChart = () => (
    <div className="flex flex-col gap-0.5">
        <div className="flex gap-4 text-[16px] text-gray-200">
            <LegendDot color={PLACEBO} label="placebo doce" />
            <LegendDot color={C.glucose} label="sacarose" />
            <span className="text-gray-300">menor = mais rápido</span>
        </div>
        {TROM_ROWS.map(r => (
            <div key={r.id} className={TROM_GRID}>
                <span className="text-[16px] text-gray-100">{r.label}</span>
                <div className="relative h-[24px]">
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/25" />
                    <Dot min={r.placebo} color={PLACEBO} />
                    <Dot min={r.sucrose} color={C.glucose} />
                </div>
                <span className="whitespace-nowrap text-right font-mono text-[16px] text-gray-100">
                    {br(r.placebo, 1)} × <span style={{ color: C.glucoseSoft }}>{br(r.sucrose, 1)}</span>
                </span>
            </div>
        ))}
        <div className={`${TROM_GRID} text-[16px] text-gray-400`}>
            <span />
            <span className="flex justify-between font-mono">{[67, 68, 69, 70].map(t => <span key={t}>{t}</span>)}</span>
            <span className="font-mono">min</span>
        </div>
    </div>
);

export const RinseMetaStage = ({ step }: { step: number }) => (
    <div className="grid h-full grid-rows-[1.25fr_1fr_1fr] gap-2 p-2">
        <Cell n={1} title="Somados: real e pequeno" note="meta-análise · 16 ensaios · SMD" show born={step === 0}>
            <div style={{ height: FOREST_H }}>
                <ForestPlot rows={step === 0 ? META_ROWS.slice(0, 1) : META_ROWS} width={FOREST_W} height={FOREST_H}
                    domain={[-0.5, 0.7]} ticks={[-0.4, -0.2, 0, 0.2, 0.4, 0.6]}
                    axisLabel="SMD bochecho × placebo (IC95%)" decimals={2} labelWidth={92} valueWidth={62} />
            </div>
        </Cell>
        <Cell n={2} title="Maior em jejum" note={'Lane 2013 · ECR · n\u00A0=\u00A012'} show={step >= 2} born={step === 2}>
            <Caption>ganho de potência média com o bochecho (eixo desde 0)</Caption>
            {LANE_GAINS.map((g, i) => (
                <Bar key={g.id} label={g.label} value={g.value} text={g.text} max={LANE_MAX} color={g.color}
                    delay={0.3 + i * 0.15} labelWidth={92} />
            ))}
        </Cell>
        <Cell n={3} title="Nem sempre aparece" note={'Trommelen 2015 · ECR · n\u00A0=\u00A014'} show={step >= 3} born={step === 3}>
            <TromChart />
        </Cell>
    </div>
);
