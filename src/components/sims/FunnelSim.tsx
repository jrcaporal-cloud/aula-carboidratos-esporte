import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { br, signed } from './kit/format';
import { SvgText } from './kit/ui';
import { Appear, Foot, Frame, Headline } from './ato8/parts';
import { FUNNEL_BEATS, FUNNEL_SOURCES, META, MOLECULAR } from './ato8/funnel.content';

/**
 * Slide 141 · Do músculo ao cronômetro. Um funil deitado: a altura de cada trecho é a fração de estudos positivos.
 * 1 boca larga (73–78% com sinal molecular) · 2 o gargalo (37% com desempenho) · 3 a ponta: a meta-análise cruzando o zero.
 * Cada trecho entra por clip-path, da esquerda para a direita, como o olho percorre o funil.
 */

const H = 330;
const MID = H / 2;
/** Meia-altura por fração (100% = 155 unidades). */
const half = (f: number) => f * 155;
const MOUTH = half(0.76);
const NECK = half(0.37);

interface StageProps { left: number; width: number; show: boolean; children: ReactNode }

/** Um trecho do funil, posicionado na faixa e revelado por clip-path. */
const Stage = ({ left, width, show, children }: StageProps) => (
    <div className="absolute top-0" style={{ left, width, height: H }}>
        <Wipe show={show} from="left" duration={0.7} className="h-full w-full">{children}</Wipe>
    </div>
);

/** Trapézio que afunila de `h0` para `h1` (meias-alturas), depois segue reto em `h1`. */
const Body = ({ w, taper, h0, h1, color }: { w: number; taper: number; h0: number; h1: number; color: string }) => (
    <svg viewBox={`0 0 ${w} ${H}`} width={w} height={H} aria-hidden>
        <polygon fill={color} points={`0,${MID - h0} ${taper},${MID - h1} ${w},${MID - h1} ${w},${MID + h1} ${taper},${MID + h1} 0,${MID + h0}`} />
    </svg>
);

/** Ponta do funil: a régua do SMD com o zero tracejado e o IC de 95%. */
const MetaTip = () => {
    const w = 300;
    const x0 = 40;
    const x1 = w - 20;
    const sx = (v: number) => x0 + ((v + 0.3) / 0.9) * (x1 - x0);
    return (
        <svg viewBox={`0 0 ${w} ${H}`} width={w} height={H} role="img" aria-label="SMD 0,17, IC95% −0,15 a 0,49">
            <polygon fill={C.stone} opacity={0.9} points={`0,${MID - NECK} 36,${MID - 6} 36,${MID + 6} 0,${MID + NECK}`} />
            <line x1={sx(0)} x2={sx(0)} y1={MID - 70} y2={MID + 46} stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeDasharray="6 6" />
            <line x1={sx(META.lo)} x2={sx(META.hi)} y1={MID} y2={MID} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            <polygon fill={C.text} points={`${sx(META.est) - 14},${MID} ${sx(META.est)},${MID - 14} ${sx(META.est) + 14},${MID} ${sx(META.est)},${MID + 14}`} />
            <SvgText x={sx(0)} y={MID - 80} text="zero" anchor="middle" size={18} color="#E5E7EB" />
            <SvgText x={sx(META.est)} y={MID - 24} text="IC 95%" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={sx(META.lo)} y={MID + 34} text={signed(META.lo, 2)} anchor="middle" size={18} color={C.text} />
            <SvgText x={sx(META.hi)} y={MID + 34} text={br(META.hi, 2)} anchor="middle" size={18} color={C.text} />
        </svg>
    );
};

export default function FunnelSim() {
    const { step } = useSlideSteps(FUNNEL_BEATS.length);
    return (
        <Frame>
            <Headline beat={step} chips={<DesignChip>{step < 2 ? 'revisão narrativa · contagem de estudos' : 'meta-análise · 9 estudos · atletas treinados'}</DesignChip>}>{FUNNEL_BEATS[step]}</Headline>
            <div className="relative mt-4" style={{ height: H }}>
                <Stage left={0} width={440} show>
                    <Body w={440} taper={0} h0={MOUTH} h1={MOUTH} color={C.insulin} />
                </Stage>
                <Stage left={440} width={396} show={step >= 1}>
                    <Body w={396} taper={110} h0={MOUTH} h1={NECK} color={C.stone} />
                </Stage>
                <Stage left={836} width={300} show={step >= 2}><MetaTip /></Stage>

                {/* textos sobre o funil, em HTML */}
                <div className="absolute left-8 top-[66px] flex w-[380px] flex-col gap-1 text-[#04080F]">
                    <CountUp text="73–78%" className="font-display text-[76px] font-bold leading-none" />
                    <span className="text-[22px] font-semibold leading-snug">dos estudos de train low com mais sinal no músculo</span>
                    <span className="mt-2 flex gap-4 text-[17px] font-semibold">
                        {MOLECULAR.map(m => <span key={m.label}>{m.label} {m.value}</span>)}
                    </span>
                </div>
                <Appear show={step >= 1} delay={0.35} className="absolute left-[565px] top-[112px] flex flex-col text-[#04080F]">
                    <CountUp text="37%" run={step >= 1} delay={0.35} className="font-display text-[72px] font-bold leading-none" />
                    <span className="text-[19px] font-semibold">com melhor desempenho</span>
                </Appear>
                <Appear show={step >= 1} delay={0.6} className="absolute left-[565px] top-[262px] text-[20px] text-gray-200">
                    63% sem mudança <span className="text-gray-400">· 11 estudos</span>
                </Appear>
                <Appear show={step >= 2} delay={0.5} className="absolute left-[880px] top-[10px] flex flex-col">
                    <span className="font-display text-[40px] font-bold leading-none" style={{ color: C.text }}>SMD {br(META.est, 2)}</span>
                </Appear>
                <Appear show={step >= 2} delay={0.7} className="absolute left-[880px] top-[250px] flex flex-col text-[20px] leading-snug text-gray-200">
                    <span>P = {META.p}</span>
                    <span>{META.k} estudos</span>
                </Appear>
            </div>
            <Foot source={step < 2 ? FUNNEL_SOURCES.impey : FUNNEL_SOURCES.gejl} />
        </Frame>
    );
}
