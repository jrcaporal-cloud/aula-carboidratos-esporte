import { C } from '../kit/palette';
import { Grow } from '../kit/Beat';
import { BigStat } from '../kit/Stamp';
import { CalcChip, DesignChip, ViaReviewChip } from '../kit/chips';
import { Source } from '../kit/ui';
import { CHOICE, FUEL, SIGNAL } from './roles.content';

/** O miolo de cada cartão aberto do slide 11. Largura fixa: o texto não reflui enquanto o cartão cresce. */
export const DETAIL_W = 560;

const Bar = ({ label, value, text, color, delay }: { label: string; value: number; text: string; color: string; delay: number }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-[20px] text-gray-100">
            <span>{label}</span>
            <span className="font-mono tabular-nums" style={{ color }}>{text}</span>
        </div>
        <div className="relative h-6 overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Grow value={value} color={color} delay={delay} />
        </div>
    </div>
);

export const FuelDetail = () => (
    <div className="flex flex-col gap-4" style={{ width: DETAIL_W }}>
        <div className="flex flex-col gap-3">
            <span className="text-[16px] text-gray-300">kJ por litro de O₂ consumido</span>
            {FUEL.bars.map((b, i) => (
                <Bar key={b.label} label={b.label} value={b.value / FUEL.max} text={`${String(b.value).replace('.', ',')} kJ`} color={b.color} delay={0.2 + i * 0.1} />
            ))}
        </div>
        <BigStat value={FUEL.stat} caption={FUEL.caption} color={C.glucose} size={64} delay={0.3} />
        <div className="flex items-center gap-3"><CalcChip>{FUEL.calc}</CalcChip><Source>{FUEL.source}</Source></div>
    </div>
);

export const SignalDetail = () => (
    <div className="flex flex-col gap-4" style={{ width: DETAIL_W }}>
        <span className="text-[22px] leading-snug text-gray-100">Treinar com glicogênio baixo: em quantos estudos…</span>
        <div className="flex flex-col gap-4">
            {SIGNAL.bars.map((b, i) => (
                <Bar key={b.label} label={b.label} value={b.value} text={b.text} color={i === 0 ? C.insulin : C.glucoseSoft} delay={0.2 + i * 0.15} />
            ))}
        </div>
        <span className="text-[24px] font-semibold leading-snug text-white">O sinal aparece mais vezes do que o resultado.</span>
        <div className="flex items-center gap-3"><DesignChip>{SIGNAL.design}</DesignChip><Source>{SIGNAL.source}</Source></div>
    </div>
);

const pctOf = (g: number): string => `${(g / CHOICE.max) * 100}%`;

export const ChoiceDetail = () => (
    <div className="flex flex-col gap-3" style={{ width: DETAIL_W }}>
        <BigStat value={CHOICE.stat} caption={CHOICE.caption} color={C.ok} size={56} delay={0.3} />
        <div className="relative flex flex-col gap-1.5">
            {CHOICE.bands.map((b, i) => (
                <div key={b.label} className="relative h-7">
                    <div className="absolute inset-y-0 overflow-hidden rounded-md" style={{ left: pctOf(b.from), width: pctOf(b.to - b.from) }}>
                        <Grow value={1} color={C.ok} delay={0.2 + i * 0.08} style={{ opacity: 0.35 + i * 0.2 }} />
                    </div>
                    <span className="absolute inset-y-0 flex items-center pr-3 text-[16px] text-gray-200"
                        style={{ right: `calc(100% - ${pctOf(b.from)})` }}>{b.label}</span>
                </div>
            ))}
            <div className="relative h-6 font-mono text-[16px] text-gray-300">
                {[0, 3, 6, 9, 12].map(g => (
                    <span key={g} className="absolute -translate-x-1/2" style={{ left: pctOf(g) }}>{g}</span>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-3"><ViaReviewChip>{CHOICE.via}</ViaReviewChip><Source>{CHOICE.source}</Source></div>
    </div>
);
