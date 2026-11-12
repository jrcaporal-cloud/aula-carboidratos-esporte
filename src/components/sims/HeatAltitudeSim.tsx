import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Grow } from './kit/Beat';
import { br } from './kit/format';
import { CalcChip, DesignChip } from './kit/chips';
import { Altimeter, Thermometer } from './ato9/Instruments';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { ALT, EXO_DOWN, GAUGE_MAX, GLY_UP, HEAT, STEPS, WOMEN_DROP } from './ato9/heatAltitude.content';

/**
 * Slide 166 · Calor e Altitude. Dois instrumentos nas bordas (termômetro × altímetro) e, no meio,
 * o que o músculo queima. O instrumento do cenário acende; o outro apaga. Recurso: cena que muda de cenário.
 */

interface GaugeProps {
    label: string;
    value: number;
    max: number;
    unit: string;
    color: string;
    delta?: string;
    dim?: boolean;
    decimals?: number;
}

const Gauge = ({ label, value, max, unit, color, delta, dim = false, decimals = 2 }: GaugeProps) => (
    <div className="flex flex-col gap-2 transition-opacity duration-300" style={{ opacity: dim ? 0.6 : 1 }}>
        <span className="text-[20px] text-gray-200">{label}</span>
        <div className="flex items-center gap-4">
            <div className="relative h-10 w-[420px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Grow value={value / max} color={color} />
            </div>
            <span className="w-[120px] font-mono text-[24px] tabular-nums text-white">{br(value, decimals)} <span className="text-[16px] text-gray-300">{unit}</span></span>
            {delta && <span className="font-display text-[30px] font-bold" style={{ color }}>{delta}</span>}
        </div>
    </div>
);

const HeatPanel = ({ step }: { step: number }) => {
    const hot = step >= 1;
    const h = hot ? HEAT.hot : HEAT.cool;
    return (
        <div className="flex flex-col gap-6">
            <Gauge label="glicogênio queimado" value={h.glycogen} max={GAUGE_MAX} unit="g/min" color={C.glycogen} delta={hot ? `+${GLY_UP}%` : undefined} dim={step === 2} />
            <Gauge label="glicose bebida e oxidada (30 min finais)" value={h.exo} max={GAUGE_MAX} unit="g/min" color={C.glucose} delta={hot ? `−${EXO_DOWN}%` : undefined} dim={step === 2} />
            <div className="relative h-[110px]">
                <Reveal show={step === 2} className="absolute inset-0 flex items-start gap-5">
                    <span className="whitespace-nowrap font-display text-[48px] font-bold leading-none" style={{ color: C.stone }}>0 de 3</span>
                    <span className="text-[22px] leading-snug text-gray-100">doses (4,2%, 7%, 14%) prolongaram a 33 °C; a 5 °C, a de 7% venceu o placebo</span>
                </Reveal>
            </div>
        </div>
    );
};

const AltPanel = () => (
    <div className="flex flex-col gap-6">
        <Gauge label="CHO na energia · nível do mar" value={ALT.choShare.sea} max={100} unit="%" color={C.co2} decimals={1} />
        <Gauge label="CHO na energia · 4.300 m" value={ALT.choShare.alt} max={100} unit="%" color={C.glucose} decimals={1} />
        <span className="text-[20px] text-gray-200">glicose bebida e oxidada em 40 min: <b className="font-mono text-white">{br(ALT.exoGrams.sea)} g</b> no nível do mar × <b className="font-mono text-white">{br(ALT.exoGrams.alt)} g</b> na altitude</span>
    </div>
);

const WomenPanel = () => (
    <div className="flex flex-col gap-3">
        <span className="font-display font-bold leading-none" style={{ fontSize: 96, color: C.glucoseSoft }}>−{WOMEN_DROP}%</span>
        <span className="text-[22px] text-gray-100">na oxidação de CHO a 4.300 m, corrigida pelo gasto</span>
        <span className="text-[20px] text-gray-300">"altitude pede mais CHO" foi medido em homens</span>
    </div>
);

export default function HeatAltitudeSim() {
    const { step } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const altitude = step >= 3;
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={s.say} className="min-h-[68px]" chips={<>
                <DesignChip>{s.design}</DesignChip>
                {(step === 1) && <CalcChip />}
            </>} />
            <div className="mt-4 flex min-h-0 flex-1 items-start gap-10">
                <Thermometer active={!altitude} level={step >= 1 && !altitude ? 0.82 : 0.4} reading={step >= 1 && !altitude ? HEAT.hot.temp : HEAT.cool.temp} />
                <div className="relative h-full min-w-0 flex-1 pt-6">
                    <Reveal show={!altitude} className="absolute inset-0 pt-6"><HeatPanel step={Math.min(step, 2)} /></Reveal>
                    <Reveal show={step === 3} className="absolute inset-0 pt-6">{step === 3 && <AltPanel />}</Reveal>
                    <Reveal show={step === 4} className="absolute inset-0 pt-6">{step === 4 && <WomenPanel />}</Reveal>
                </div>
                <Altimeter active={altitude} up={altitude} reading={altitude ? '4.300 m' : 'nível do mar'} />
            </div>
            <SourceLine>{s.source}</SourceLine>
        </SimBox>
    );
}
