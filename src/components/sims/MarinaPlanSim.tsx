import { useSlideSteps } from '../../store/useSlideSteps';
import { C, PANEL_BG } from './kit/palette';
import { Source } from './kit/ui';
import { Beat } from './kit/Beat';
import { castOf } from './kit/cast';
import { CalcChip, FictionChip } from './kit/chips';
import { BreakfastView, FoodStack, GaugeView } from './ato5/MarinaViews';
import { BEATS, SOURCES, TEXT } from './ato5/marinaPlan.content';

/**
 * Slide 87 · Marina, Três Dias Antes (caso fictício + cálculo). A ficha da Marina fica fixa à esquerda;
 * à direita, a régua de g/kg leva o marcador do prato de macarrão (1,7) até a meta (10), a meta vira
 * comida empilhada (~580 g) e, por fim, o café de 3 h antes da largada.
 */
const marina = castOf('marina');
const Icon = marina.icon;

const Profile = () => (
    <div className="flex h-full flex-col rounded-2xl px-6 py-6" style={PANEL_BG}>
        <div className="flex flex-col gap-4">
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-2" style={{ borderColor: C.stone }}>
                <Icon size={40} color={C.stone} strokeWidth={2.2} aria-hidden />
            </span>
            <span className="font-display text-[44px] font-bold leading-none text-white">{marina.name}</span>
            <span className="text-[20px] leading-snug text-gray-100">{TEXT.profile}<br />{TEXT.sport}</span>
            <span className="text-[20px] leading-snug text-gray-300">{TEXT.goal}</span>
        </div>
    </div>
);

const View = ({ step }: { step: number }) => {
    if (step === 2) return <FoodStack />;
    if (step === 3) return <BreakfastView />;
    return <GaugeView target={step === 1} />;
};

export default function MarinaPlanSim() {
    const { step } = useSlideSteps(BEATS.length);
    const viewKey = step <= 1 ? 'gauge' : `v${step}`;
    return (
        <div className="not-prose flex w-full flex-col gap-3" style={{ maxHeight: 516 }}>
            <div className="flex gap-5" style={{ height: 476 }}>
                <div className="w-[260px] shrink-0"><Profile /></div>
                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex min-h-[80px] items-start justify-between gap-4">
                        <Beat beat={step} className="max-w-[640px] text-[28px] font-semibold leading-snug text-white">{BEATS[step]}</Beat>
                        <div className="flex shrink-0 gap-2"><FictionChip /><CalcChip /></div>
                    </div>
                    <div className="relative flex-1 overflow-hidden rounded-2xl" style={PANEL_BG}>
                        <Beat beat={viewKey} className="h-full"><View step={step} /></Beat>
                    </div>
                </div>
            </div>
            <Source>{SOURCES[step]}</Source>
        </div>
    );
}
