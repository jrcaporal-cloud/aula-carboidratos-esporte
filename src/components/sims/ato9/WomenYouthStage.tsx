import { PersonStanding, Thermometer, Venus } from 'lucide-react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br, signed } from '../kit/format';
import { BOYS_EDGE, CYCLE, LEITES, LOAD_1995, LOAD_2001, TIMMONS, WALLIS } from './womenYouth.content';
import { BEFORE, GroupLabel, MeasureSide, StudyBand } from './studyBand';

/**
 * Slide 167 · o palco em duas cadeias de faixas numeradas, um estudo por faixa e uma medida por estudo, cada uma com
 * o seu eixo e a sua unidade: MULHERES (1 Wallis 2006, 2 McNulty 2020, 3 Tarnopolsky 1995, 4 James 2001) e
 * JOVENS (5 Timmons 2003, 6 Leites 2016). O grupo de comparação (homens) é sempre cinza.
 */

const MIN = -0.3;
const MAX = 0.3;

/** McNulty 2020: o efeito da folicular inicial (ponto) e o intervalo de credibilidade (traço) sobre o zero. */
const CycleRow = () => {
    const w = 236;
    const sx = (v: number) => 10 + ((v - MIN) / (MAX - MIN)) * (w - 20);
    return (
        <div className="flex items-center gap-2">
            <svg viewBox={`0 0 ${w} 46`} width={w} height={46} role="img"
                aria-label={`Tamanho de efeito ${br(CYCLE.es, 2)}, intervalo ${br(CYCLE.lo, 2)} a ${br(CYCLE.hi, 2)}`}>
                <line x1={sx(MIN)} x2={sx(MAX)} y1={14} y2={14} stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
                <line x1={sx(0)} x2={sx(0)} y1={2} y2={26} stroke={C.text} strokeWidth={2} strokeDasharray="4 4" />
                <line x1={sx(CYCLE.lo)} x2={sx(CYCLE.hi)} y1={14} y2={14} stroke={C.stone} strokeWidth={7} strokeLinecap="round" />
                <circle cx={sx(CYCLE.es)} cy={14} r={8} fill={C.stone} stroke="#04080F" strokeWidth={3} />
                {[MIN, 0, MAX].map(t => (
                    <SvgText key={t} x={sx(t)} y={44} text={signed(t, t === 0 ? 0 : 1)} anchor={t === MIN ? 'start' : t === MAX ? 'end' : 'middle'} size={16} color={C.muted} weight={500} />
                ))}
            </svg>
            <span className="whitespace-nowrap font-mono text-[17px] font-bold tabular-nums text-white">{br(CYCLE.es, 2)}</span>
        </div>
    );
};

/** "antes → depois" com o antes em cinza (a mesma cor da base da barra). */
const BeforeAfter = ({ before, after }: { before: number; after: number }) => (
    <><span style={{ color: '#94A3B8' }}>{before}</span> → {after}</>
);

/** Legenda da barra do James 2001: cinza = antes, violeta = depois da carga. */
const Legend = () => (
    <span className="flex items-center gap-2 text-[16px] text-gray-300">
        <span className="flex items-center gap-1"><span className="block h-3 w-3 rounded-sm" style={{ background: BEFORE }} />antes</span>
        <span className="flex items-center gap-1"><span className="block h-3 w-3 rounded-sm" style={{ background: C.glycogen }} />depois</span>
    </span>
);

/** Leites 2016 foi no calor: a mesma medida do Timmons, a 38 °C. */
const Hot = () => (
    <span className="flex items-center gap-0.5 text-[16px] font-semibold" style={{ color: C.risk }}>
        <Thermometer size={16} strokeWidth={2.6} aria-hidden />a 38 °C
    </span>
);

export const WomenYouthStage = ({ step }: { step: number }) => {
    const band = (i: number) => ({ n: i + 1, show: step >= i, born: step === i });
    return (
        <div className="flex h-full flex-col gap-1 p-2">
            <GroupLabel icon={Venus} color={C.glucoseSoft}>mulheres</GroupLabel>
            <StudyBand {...band(0)} title="Wallis 2006" meta="8 H + 8 M · 90 g/h">
                <MeasureSide measure="CHO bebido" unit="pico, g/min" max={0.8} labelWidth={74} valueWidth={44} rows={[
                    { label: 'homens', value: WALLIS.men, text: br(WALLIS.men, 2), color: BEFORE },
                    { label: 'mulheres', value: WALLIS.women, text: br(WALLIS.women, 2), color: C.glucose },
                ]} />
            </StudyBand>
            <StudyBand {...band(1)} title="McNulty 2020" meta="78 estudos">
                <div className="grid grid-cols-[132px_1fr] items-center gap-2">
                    <div className="flex flex-col whitespace-nowrap leading-tight">
                        <span className="text-[16px] font-semibold text-gray-100">folicular inicial</span>
                        <span className="text-[16px] text-gray-300">ES × outras fases</span>
                    </div>
                    <CycleRow />
                </div>
            </StudyBand>
            <StudyBand {...band(2)} title="Tarnopolsky 1995" meta="CHO a 75% da energia">
                <MeasureSide measure="glicogênio" unit="ganho, %" max={50} labelWidth={74} valueWidth={52} rows={[
                    { label: 'homens', value: LOAD_1995.men, text: `+${LOAD_1995.men}%`, color: BEFORE },
                    { label: 'mulheres', value: LOAD_1995.women, text: `${LOAD_1995.women}%`, color: C.glycogen },
                ]} />
            </StudyBand>
            <StudyBand {...band(3)} title="James 2001" meta="12 g/kg MM por dia">
                <MeasureSide measure="glicogênio" unit="mmol/kg" legend={<Legend />} max={210} labelWidth={74} valueWidth={98} rows={[
                    { label: 'homens', value: LOAD_2001.men.after, base: LOAD_2001.men.before, text: <BeforeAfter before={LOAD_2001.men.before} after={LOAD_2001.men.after} />, color: C.glycogen },
                    { label: 'mulheres', value: LOAD_2001.women.after, base: LOAD_2001.women.before, text: <BeforeAfter before={LOAD_2001.women.before} after={LOAD_2001.women.after} />, color: C.glycogen },
                ]} />
            </StudyBand>
            <div className="mt-0.5"><GroupLabel icon={PersonStanding} color={C.glucoseSoft}>jovens</GroupLabel></div>
            <StudyBand {...band(4)} title="Timmons 2003" meta="12 meninos + 10 H">
                <MeasureSide measure="CHO bebido" unit="mg/kg/min" max={10} labelWidth={74} valueWidth={36} deltaWidth={50} rows={[
                    { label: 'homens', value: TIMMONS.men, text: br(TIMMONS.men, 1), color: BEFORE },
                    { label: 'meninos', value: TIMMONS.boys, text: br(TIMMONS.boys, 1), color: C.glucose, delta: `+${BOYS_EDGE}%`, deltaColor: C.glucoseSoft },
                ]} />
            </StudyBand>
            <StudyBand {...band(5)} title="Leites 2016" meta="7 meninos + 9 H">
                <MeasureSide measure="CHO bebido" unit="mg/kg MM/min" legend={<Hot />} max={3} labelWidth={74} valueWidth={36} deltaWidth={50} rows={[
                    { label: 'homens', value: LEITES.men, text: br(LEITES.men, 1), color: BEFORE },
                    { label: 'meninos', value: LEITES.boys, text: br(LEITES.boys, 1), color: C.glucose },
                ]} />
            </StudyBand>
        </div>
    );
};
