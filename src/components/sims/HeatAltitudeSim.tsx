import { Check, X } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { br } from './kit/format';
import { CountUp } from './kit/CountUp';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB, StageBlock, StageLabel } from './ato9/FrameB';
import { HeatDial } from './ato9/HeatDial';
import { Altimeter, Thermometer } from './ato9/Instruments';
import { ALT, EXO_DOWN, FEBBRAIO_DOSES, GLY_UP, HEAT, LEDGER, STEPS, WOMEN_DROP } from './ato9/heatAltitude.content';

/**
 * Slide 166 · Calor e Altitude, palco + painel. Em cima, o calor: termômetro (a temperatura de cada estudo), o mostrador
 * de dois ponteiros (glicogênio × glicose bebida, Jentjens) e o placar de Febbraio. Embaixo, a altitude: altímetro,
 * a fatia do CHO na energia e a glicose bebida (Péronnet) e o sinal invertido nas mulheres (Braun). Nada sai.
 */

const ACCENT = [C.glucoseSoft, C.glycogenSoft, C.stone, C.glucoseSoft, C.glucoseSoft] as const;

/** Cada passo mostra a temperatura do SEU estudo; na altitude o termômetro fica sem leitura (não há dado de calor ali). */
const thermoReading = (step: number): string => {
    if (step >= 3) return '—';
    if (step === 2) return HEAT.febbraio.temp;
    return step === 1 ? HEAT.hot.temp : HEAT.cool.temp;
};

const DialLegend = ({ hot }: { hot: boolean }) => (
    <div className="flex flex-col gap-1">
        {[
            { label: 'glicogênio queimado', c: C.glycogenSoft, from: HEAT.cool.glycogen, to: HEAT.hot.glycogen, d: `+${GLY_UP}%` },
            { label: 'glicose bebida oxidada', c: C.glucoseSoft, from: HEAT.cool.exo, to: HEAT.hot.exo, d: `−${EXO_DOWN}%` },
        ].map(r => (
            <div key={r.label} className="flex flex-col">
                <span className="flex items-center gap-2 text-[16px] text-gray-200">
                    <span className="block h-[6px] w-6 rounded-full" style={{ background: r.c }} />{r.label}
                </span>
                <span className="font-mono text-[19px] font-bold leading-tight tabular-nums" style={{ color: r.c }}>
                    {br(r.from, 2)}{hot && <> → {br(r.to, 2)} <span className="text-[17px]">({r.d})</span></>}
                </span>
            </div>
        ))}
    </div>
);

/** Placar de Febbraio 1996: a 33 °C nenhuma solução venceu o placebo; a 5 °C, a de 7% venceu. */
const FebbraioBoard = () => (
    <div className="flex flex-col gap-1 rounded-xl border-2 px-2.5 py-1.5" style={{ borderColor: 'rgba(231,229,228,0.5)' }}>
        <span className="text-[15px] text-gray-300">Febbraio 1996 · até a fadiga</span>
        {[{ temp: '33 °C', win: null }, { temp: '5 °C', win: '7%' }].map(row => (
            <div key={row.temp} className="flex items-center gap-1">
                <span className="w-[46px] shrink-0 whitespace-nowrap font-mono text-[15px] font-semibold text-white">{row.temp}</span>
                {FEBBRAIO_DOSES.map(d => {
                    const won = row.win === d;
                    const Icon = won ? Check : X;
                    return (
                        <span key={d} className="flex items-center gap-0.5 whitespace-nowrap rounded-md px-1 py-0.5 font-mono text-[15px] font-semibold"
                            style={{ background: won ? C.ok : 'rgba(255,255,255,0.08)', color: won ? '#04080F' : '#D1D5DB' }}>
                            <Icon size={14} strokeWidth={3} aria-hidden />{d}
                        </span>
                    );
                })}
            </div>
        ))}
    </div>
);

const ShareBar = ({ label, value, max, unit, color, decimals }: { label: string; value: number; max: number; unit: string; color: string; decimals: number }) => (
    <div className="flex items-center gap-2">
        <span className="w-[100px] text-[16px] leading-tight text-gray-200">{label}</span>
        <div className="relative h-[18px] w-[130px] overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Grow value={value / max} color={color} />
        </div>
        <span className="font-mono text-[17px] font-bold tabular-nums text-white">{br(value, decimals)}{unit}</span>
    </div>
);

export default function HeatAltitudeSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const altitude = step >= 3;
    const last = step === STEPS.length - 1;
    const hot = step >= 1;
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="heat-alt-tabs"
            chips={<><DesignChip>{s.design}</DesignChip>{hot && <CalcChip>−{EXO_DOWN}%: cálculo</CalcChip>}</>}
            stage={
                <div className="flex h-full flex-col gap-1.5 px-4 py-2.5">
                    <StageBlock shown focus={!altitude || last} className="flex flex-col gap-1">
                        <StageLabel color={C.risk}>calor · Jentjens 2002 · Febbraio 1996</StageLabel>
                        <div className="flex items-start gap-3.5">
                            <Thermometer active={!altitude} level={hot && !altitude ? 0.82 : 0.4} reading={thermoReading(step)} />
                            <HeatDial glycogen={hot ? HEAT.hot.glycogen : HEAT.cool.glycogen} exo={hot ? HEAT.hot.exo : HEAT.cool.exo}
                                ghost={hot ? { glycogen: HEAT.cool.glycogen, exo: HEAT.cool.exo } : undefined} />
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <DialLegend hot={hot} />
                                <StageBlock shown={step >= 2} focus>{step >= 2 && <FebbraioBoard />}</StageBlock>
                            </div>
                        </div>
                    </StageBlock>
                    <StageBlock shown={altitude} focus={altitude} className="flex flex-col gap-1 border-t-2 border-white/10 pt-1.5">
                        <StageLabel color={C.co2}>altitude · Péronnet 2006 · Braun 2000</StageLabel>
                        <div className="flex items-start gap-3.5">
                            <Altimeter active={altitude} up={altitude} reading={altitude ? '4.300 m' : 'nível do mar'} />
                            {altitude && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[15px] text-gray-300">CHO na energia · 77% do VO₂máx</span>
                                    <ShareBar label="nível do mar" value={ALT.choShare.sea} max={100} unit="%" color={C.co2} decimals={1} />
                                    <ShareBar label="4.300 m" value={ALT.choShare.alt} max={100} unit="%" color={C.glucose} decimals={1} />
                                    <span className="text-[15px] text-gray-300">glicose bebida oxidada · 40 min</span>
                                    <ShareBar label="nível do mar" value={ALT.exoGrams.sea} max={24} unit=" g" color={C.co2} decimals={1} />
                                    <ShareBar label="4.300 m" value={ALT.exoGrams.alt} max={24} unit=" g" color={C.glucose} decimals={1} />
                                </div>
                            )}
                            <StageBlock shown={step >= 4} focus className="flex min-w-0 flex-1 flex-col gap-1 pt-3">
                                {step >= 4 && <>
                                    <CountUp text={WOMEN_DROP} delay={0.3} className="font-display text-[56px] font-bold leading-none" style={{ color: C.glucoseSoft }} />
                                    <span className="text-[16px] leading-snug text-gray-100">oxidação de CHO em 16 mulheres a 4.300 m</span>
                                </>}
                            </StageBlock>
                        </div>
                    </StageBlock>
                </div>
            }
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={step >= 1 ? <LedgerB title="o que fica" items={LEDGER} step={step} /> : undefined} />
            } />
    );
}
