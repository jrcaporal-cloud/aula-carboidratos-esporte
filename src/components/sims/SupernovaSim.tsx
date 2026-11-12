import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Beat, Grow } from './kit/Beat';
import { CalcChip, DesignChip } from './kit/chips';
import { br } from './kit/format';
import { Foot, Frame, Headline } from './ato8/parts';
import { RaceLanes } from './ato8/RaceLanes';
import { O2, SUPERNOVA_BEATS, SUPERNOVA_SOURCES } from './ato8/supernova.content';

/**
 * Slide 145 · Projeto Supernova (slide-âncora do ato). Três raias de marchadores de elite.
 * 1 as dietas · 2 a gordura do LCHF dispara · 3 a prova: cada marchador anda até a sua melhora no 10 km
 * · 4 o porquê: o preço do O₂ do Ato III (21,1 × 19,6 kJ/L) · 5 o desenho: IC90% e limitações.
 */

const O2_MAX = 22;

const O2Price = () => (
    <div className="flex items-center gap-10">
        <div className="flex w-[560px] flex-col gap-1">
            <span className="flex items-center gap-3 text-[17px] text-gray-300">energia de 1 litro de O₂ (kJ)</span>
            {([['carboidrato', O2.cho, C.glucose], ['gordura', O2.fat, C.fat]] as const).map(([label, v, color], i) => (
                <div key={label} className="flex h-[30px] items-center gap-3">
                    <span className="w-[120px] text-[19px] text-gray-100">{label}</span>
                    <div className="relative h-[24px] flex-1 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Grow value={v / O2_MAX} color={color} delay={i * 0.15} />
                    </div>
                    <span className="w-[64px] text-right text-[22px] font-bold tabular-nums" style={{ color }}>{br(v, 1)}</span>
                </div>
            ))}
        </div>
        <p className="m-0 max-w-[420px] text-[22px] leading-snug text-gray-100">
            No ritmo de prova, o LCHF pagou mais O₂.
        </p>
    </div>
);

/** O desenho, em frase (o selo do topo já diz "não randomizado"): o que ele não diz. */
const Caveats = () => (
    <p className="m-0 max-w-[900px] text-[22px] leading-snug text-gray-100">
        Dieta escolhida em parte pelo atleta, sem cegamento possível. O IC 90% do LCHF vai de −8,5% a +5,3%.
    </p>
);

export default function SupernovaSim() {
    const { step } = useSlideSteps(SUPERNOVA_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={<><DesignChip>não randomizado · comida fornecida · 3 semanas</DesignChip>{step === 3 && <CalcChip>~7,7% a menos: cálculo</CalcChip>}</>} size={28}>{SUPERNOVA_BEATS[step]}</Headline>
            <div className="mt-5">
                <RaceLanes raced={step >= 2} showFat={step === 1 || step === 2} showCi={step >= 4} showDiet={step < 2} />
            </div>
            <div className="mt-1">
                {step === 3 && <Beat beat="o2"><O2Price /></Beat>}
                {step === 4 && <Beat beat="desenho"><Caveats /></Beat>}
            </div>
            <Foot source={step === 3 ? SUPERNOVA_SOURCES.o2 : SUPERNOVA_SOURCES.burke} />
        </Frame>
    );
}
