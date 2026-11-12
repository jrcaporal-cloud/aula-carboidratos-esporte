import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Wipe } from './kit/Beat';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { Head, Reveal, SimBox, SourceLine } from './ato9/parts';
import { DESIGNS, KONDO, NCAA, SOURCES, SPORTS, STEPS } from './ato9/refeed.content';

/**
 * Slide 165 · Depois da Pesagem. Composição horizontal, de largura inteira: a curva do glicogênio que não volta (Kondo),
 * duas pistas pesagem → luta (judô × boxe) e a linha do tempo de 1997 até a regra nova. Tom sóbrio no passo das mortes.
 */

/** Curva didática do glicogênio: cai até a pesagem, sobe com a comida e para abaixo da linha de base. */
const KondoCurve = () => {
    const base = 70;
    const trough = base + 0.365 * 260;
    const d = `M40 ${base} L230 ${base} C 380 ${base + 10}, 470 ${trough}, 560 ${trough} C 640 ${trough}, 700 ${base + 60}, 820 ${base + 42} L1080 ${base + 34}`;
    return (
        <svg viewBox="0 0 1136 300" width={1136} height={300} role="img" aria-label="Glicogênio cai 36,5% até a pesagem e, 13 h depois da comida, ainda está abaixo da base">
            <rect x={560} y={30} width={110} height={220} rx={10} fill={C.glucose} opacity={0.16} />
            <SvgText x={615} y={272} text={`${KONDO.choGkg} g/kg em 5 h`} anchor="middle" size={18} color={C.glucoseSoft} />
            <line x1={40} x2={1080} y1={base} y2={base} stroke={C.text} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
            <SvgText x={40} y={base - 14} text="linha de base" size={17} color={C.muted} weight={500} />
            <path d={d} fill="none" stroke={C.glycogen} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={560} x2={560} y1={30} y2={250} stroke={C.text} strokeWidth={3} />
            <SvgText x={548} y={48} text="pesagem" anchor="end" size={18} color={C.text} />
            <SvgText x={548} y={trough + 44} text={`−${KONDO.dropPct}%`} anchor="end" size={30} color={C.glycogenSoft} weight={700} />
            <SvgText x={230} y={272} text={`−${KONDO.lossPct}% do peso em ${KONDO.hours} h`} anchor="middle" size={18} color={C.text} />
            <line x1={1080} x2={1080} y1={base} y2={base + 34} stroke={C.risk} strokeWidth={4} />
            <SvgText x={1070} y={base + 76} text={`+${KONDO.after} h: ainda abaixo`} anchor="end" size={20} color={C.text} weight={700} />
        </svg>
    );
};

const Lanes = () => (
    <div className="flex flex-col gap-8 pt-2">
        {SPORTS.map((s, i) => (
            <Reveal key={s.key} show delay={0.1 + i * 0.25} className="flex items-center gap-8">
                <span className="w-[120px] font-display text-[34px] font-semibold text-white">{s.sport}</span>
                <div className="flex w-[420px] flex-col gap-2">
                    <div className="flex items-center">
                        <span className="block h-5 w-5 rounded-full" style={{ background: C.co2 }} />
                        <span className="block h-[4px]" style={{ width: s.key === 'judo' ? 340 : 90, background: C.co2 }} />
                        <span className="block h-5 w-5 rounded-full" style={{ background: C.text }} />
                    </div>
                    <span className="text-[18px] text-gray-300">{s.weighIn}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="self-start rounded-md px-3 py-1 text-[20px] font-bold" style={{ background: s.color, color: '#04080F' }}>{s.verdict}</span>
                    <span className="text-[20px] text-gray-200">{s.result} <span className="font-mono text-[16px] text-gray-300">· {s.n}</span></span>
                </div>
            </Reveal>
        ))}
    </div>
);

/** Linha do tempo 1997 → 2004: três marcas sóbrias, a regra, e o período medido depois dela. */
const Timeline = ({ step }: { step: number }) => (
    <div className="relative h-full">
        <div className="absolute left-0 right-0 top-[120px] h-[4px]" style={{ background: 'rgba(255,255,255,0.22)' }} />
        <div className="absolute left-[40px] top-[60px] flex gap-3">
            {Array.from({ length: NCAA.deaths }, (_, i) => <span key={i} className="block h-[124px] w-[6px] rounded-sm" style={{ background: C.stone }} />)}
        </div>
        <div className="absolute left-[40px] top-[200px] flex flex-col gap-1">
            <span className="font-display text-[34px] font-semibold text-white">1997</span>
            <span className="w-[300px] text-[20px] leading-snug text-gray-200">restrição de comida e líquido, roupa impermeável, calor</span>
        </div>
        <Wipe show={step >= 3} from="left" className="absolute left-[400px] right-0 top-[40px] h-[300px]">
            <div className="flex h-full">
                <div className="flex w-[260px] flex-col gap-3 pt-[58px]">
                    <span className="block h-[44px] w-[6px] rounded-sm" style={{ background: C.ok }} />
                    <span className="text-[20px] leading-snug text-gray-100">regra nova: peso mínimo pela composição corporal, pesagem perto da luta</span>
                </div>
                <div className="ml-6 flex flex-1 flex-col gap-2">
                    <div className="h-[44px] rounded-md" style={{ background: C.ok, opacity: 0.85, marginTop: 58 }} />
                    <span className="font-display text-[34px] font-semibold text-white">1999–2004</span>
                    <span className="font-display text-[72px] font-bold leading-none" style={{ color: C.ok }}>{NCAA.after}</span>
                    <span className="text-[20px] text-gray-200">perdidos nas 20 h antes da pesagem</span>
                </div>
            </div>
        </Wipe>
    </div>
);

export default function RefeedSim() {
    const { step } = useSlideSteps(STEPS.length);
    return (
        <SimBox className="flex flex-col">
            <Head beat={step} say={STEPS[step]} className="min-h-[68px]" chips={<>
                <DesignChip>{DESIGNS[step]}</DesignChip>
                {step === 0 && <IllustrativeChip />}
            </>} />
            <div className="relative mt-3 flex-1">
                <Reveal show={step === 0} className="absolute inset-0">
                    <Wipe show={step === 0} from="left"><KondoCurve /></Wipe>
                </Reveal>
                <Reveal show={step === 1} className="absolute inset-0">{step === 1 && <Lanes />}</Reveal>
                <Reveal show={step >= 2} className="absolute inset-0"><Timeline step={step} /></Reveal>
            </div>
            <SourceLine>{SOURCES[step]}</SourceLine>
        </SimBox>
    );
}
