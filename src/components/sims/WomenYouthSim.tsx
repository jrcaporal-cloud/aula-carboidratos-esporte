import { ArrowRight, Thermometer } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CalcChip, DesignChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB, StageBlock, StageLabel } from './ato9/FrameB';
import { CellHead, CycleRuler, HBars, VBars } from './ato9/WomenYouthCharts';
import { BOYS_EDGE, LEDGER, LEITES, LOAD_1995, LOAD_2001, STEPS, TIMMONS, WALLIS } from './ato9/womenYouth.content';

/**
 * Slide 167 · Mulheres e Jovens, palco + painel. O palco é uma grade que se completa: em cima, as três perguntas
 * sobre mulheres (oxidação, ciclo, carga: o "% da energia" que vira g/kg); embaixo, os meninos, com a vantagem
 * que se inverte a 38 °C. Cada célula entra no seu passo e fica; o grupo de comparação é sempre neutro (ardósia).
 */

const ACCENT = [C.glucoseSoft, C.stone, C.glycogenSoft, C.glucoseSoft, C.glucoseSoft] as const;

export default function WomenYouthSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const last = step === STEPS.length - 1;
    const cell = (i: number) => ({ shown: step >= i, focus: last || step === i });
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="women-youth-tabs"
            chips={<><DesignChip>{s.design}</DesignChip>{step >= 3 && <CalcChip>+{BOYS_EDGE}%: cálculo</CalcChip>}</>}
            stage={
                <div className="flex h-full flex-col gap-2 px-4 py-2.5">
                    <StageLabel color={C.glucoseSoft}>mulheres</StageLabel>
                    <div className="flex items-start gap-4">
                        <StageBlock {...cell(0)} className="flex w-[140px] flex-col gap-2">
                            <CellHead title="Wallis 2006" sub="pico de oxidação, g/min" />
                            <VBars max={0.8} bars={[
                                { label: 'H', value: WALLIS.men, color: C.co2 },
                                { label: 'M', value: WALLIS.women, color: C.glucose },
                            ]} />
                        </StageBlock>
                        <StageBlock {...cell(1)} className="flex w-[200px] flex-col gap-2">
                            <CellHead title="McNulty 2020" sub="folicular inicial × outras" color={C.stone} />
                            {step >= 1 && <CycleRuler />}
                            <span className="text-[15px] leading-tight text-gray-300">faixa clara: efeito trivial</span>
                        </StageBlock>
                        <StageBlock {...cell(2)} className="flex min-w-0 flex-1 flex-col gap-2">
                            <CellHead title="1995 → 2001" sub="a carga de glicogênio" color={C.glycogenSoft} />
                            {step >= 2 && (
                                <div className="flex items-end gap-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <VBars max={80} height={80} width={30} bars={[
                                            { label: 'H', value: LOAD_1995.men, text: `+${LOAD_1995.men}%`, color: C.co2 },
                                            { label: 'M', value: LOAD_1995.women, text: `${LOAD_1995.women}%`, color: C.glycogen },
                                        ]} />
                                        <span className="text-[15px] leading-tight text-gray-300">75% da energia</span>
                                    </div>
                                    <ArrowRight size={24} strokeWidth={3} color={C.text} className="mb-12 shrink-0" aria-hidden />
                                    <div className="flex flex-col items-center gap-1">
                                        <VBars max={220} height={80} width={30} decimals={0} delay={0.3} bars={[
                                            { label: 'H', value: LOAD_2001.men.after, before: LOAD_2001.men.before, color: C.co2 },
                                            { label: 'M', value: LOAD_2001.women.after, before: LOAD_2001.women.before, color: C.glycogen },
                                        ]} />
                                        <span className="text-[15px] leading-tight text-gray-300">12 g/kg MM · mmol/kg</span>
                                    </div>
                                </div>
                            )}
                        </StageBlock>
                    </div>
                    <div className="border-t-2 border-white/10" />
                    <StageLabel color={C.glucoseSoft}>jovens</StageLabel>
                    <div className="flex items-start gap-6">
                        <StageBlock {...cell(3)} className="flex w-[290px] flex-col gap-2">
                            <CellHead title="Timmons 2003" sub="CHO ingerido oxidado, mg/kg/min" />
                            {step >= 3 && <HBars max={10} bars={[
                                { label: 'homens', value: TIMMONS.men, color: C.co2 },
                                { label: 'meninos', value: TIMMONS.boys, color: C.glucose },
                            ]} />}
                        </StageBlock>
                        <StageBlock {...cell(4)} className="flex min-w-0 flex-1 flex-col gap-2">
                            <span className="flex items-center gap-1.5">
                                <Thermometer size={20} strokeWidth={2.6} color={C.risk} aria-hidden />
                                <CellHead title="Leites 2016 · 38 °C" sub="mg/kg de massa magra/min" />
                            </span>
                            {step >= 4 && <HBars max={3} bars={[
                                { label: 'homens', value: LEITES.men, color: C.co2 },
                                { label: 'meninos', value: LEITES.boys, color: C.glucose },
                            ]} />}
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
