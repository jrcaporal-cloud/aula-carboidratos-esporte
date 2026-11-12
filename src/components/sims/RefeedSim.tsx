import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { FrameB, LedgerB, PanelB, StageBlock, StageLabel } from './ato9/FrameB';
import { KONDO, LANES, LEDGER, NCAA, STEPS, type Lane } from './ato9/refeed.content';

/**
 * Slide 165 · Depois da Pesagem, palco + painel. O palco empilha três faixas que ficam: a curva do glicogênio que
 * não volta (Kondo), as duas réguas pesagem → luta (judô × boxe) e a linha do tempo 1997 → regra da NCAA.
 * No passo de 1997 (o pico do Ato IX) as faixas de cima esmaecem e as três marcas entram uma a uma, em tom sóbrio.
 */

const ACCENT = [C.glycogenSoft, C.ok, C.stone, C.ok] as const;
const BASE_Y = 36;
const PER_PCT = 1.7;
const TROUGH_Y = BASE_Y + Number(KONDO.dropPct.replace(',', '.')) * PER_PCT;

/** Curva didática: cai até a pesagem, sobe com a comida e para abaixo da base (o ponto final não tem número). */
const KondoCurve = () => {
    const d = `M20 ${BASE_Y} L120 ${BASE_Y} C 200 ${BASE_Y + 2}, 250 ${TROUGH_Y}, 300 ${TROUGH_Y} C 340 ${TROUGH_Y}, 360 84, 400 72 C 460 62, 540 58, 600 56`;
    return (
        <svg viewBox="0 0 648 118" width={648} height={118} role="img"
            aria-label="Glicogênio cai 36,5% até a pesagem e, 13 horas depois, ainda está abaixo da base">
            <rect x={300} y={BASE_Y} width={80} height={118 - BASE_Y} fill={C.glucose} opacity={0.16} />
            <line x1={20} x2={640} y1={BASE_Y} y2={BASE_Y} stroke={C.text} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
            <SvgText x={20} y={BASE_Y - 10} text="base" size={16} color={C.muted} weight={500} />
            <path d={d} fill="none" stroke={C.glycogen} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={300} x2={300} y1={8} y2={118} stroke={C.text} strokeWidth={3} />
            <SvgText x={308} y={22} text="pesagem" size={17} color={C.text} />
            <SvgText x={20} y={90} text={`−${KONDO.lossPct}% em ${KONDO.hours} h · −${KONDO.lossKg} kg`} size={16} color={C.text} weight={500} />
            <SvgText x={292} y={116} text={`−${KONDO.dropPct}%`} anchor="end" size={24} color={C.glycogenSoft} weight={700} />
            <SvgText x={388} y={114} text={`${KONDO.choGkg} g/kg em ${KONDO.mealHours} h`} size={16} color={C.glucoseSoft} />
            <line x1={600} x2={600} y1={BASE_Y} y2={56} stroke={C.risk} strokeWidth={4} />
            <SvgText x={640} y={84} text={`${KONDO.after} h depois: abaixo da base`} anchor="end" size={17} color={C.text} weight={700} />
        </svg>
    );
};

/** Régua pesagem → luta: a distância é desenho (o rótulo dá as horas). */
const LaneRow = ({ lane, delay }: { lane: Lane; delay: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-center gap-4">
            <span className="w-[64px] text-[22px] font-semibold text-white">{lane.sport}</span>
            <div className="flex w-[236px] flex-col gap-1">
                <div className="flex items-center">
                    <span className="block h-4 w-4 shrink-0 rounded-full" style={{ background: C.co2 }} />
                    <motion.span className="block h-[4px] origin-left" style={{ width: 200 * lane.gap, background: C.co2 }}
                        initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }}
                        transition={{ duration: DUR.bar, delay, ease: EASE_OUT }} />
                    <span className="block h-4 w-4 shrink-0 rounded-full" style={{ background: C.text }} />
                </div>
                <span className="text-[15px] leading-tight text-gray-300">{lane.gapLabel}</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="rounded-md px-2 py-0.5 text-[17px] font-bold" style={{ background: lane.color, color: '#04080F' }}>{lane.verdict}</span>
                <span className="font-mono text-[15px] text-gray-200">{lane.regain}</span>
            </div>
        </div>
    );
};

/** 1997 → 2004: três marcas sóbrias, a regra e o período medido depois dela. */
const Timeline = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex items-stretch gap-3">
            <div className="flex items-end gap-2.5 pb-1">
                {Array.from({ length: NCAA.deaths }, (_, i) => (
                    <motion.span key={i} className="block h-[44px] w-[8px] origin-bottom rounded-sm" style={{ background: C.stone }}
                        initial={reduce ? false : { scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: DUR.enter, delay: 0.2 + i * 0.3, ease: EASE_OUT }} />
                ))}
            </div>
            <div className="flex w-[184px] flex-col gap-0.5">
                <span className="font-display text-[26px] font-semibold leading-none text-white">1997</span>
                <span className="text-[16px] leading-snug text-gray-100">{NCAA.window}</span>
                <span className="text-[15px] leading-snug text-gray-300">hipertermia e desidratação</span>
            </div>
            <Wipe show={step >= 3} from="left" className="flex min-w-0 flex-1 gap-3">
                <div className="flex w-[180px] flex-col gap-0.5 border-l-[3px] pl-3" style={{ borderColor: C.ok }}>
                    <span className="text-[16px] font-semibold text-white">regra NCAA</span>
                    <span className="text-[15px] leading-snug text-gray-200">peso mínimo pela composição</span>
                    <span className="text-[15px] leading-snug text-gray-200">pesagem perto da luta</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-white">1999–2004 · {NCAA.wrestlers} lutadores</span>
                    <span className="flex items-baseline gap-2">
                        {step >= 3 && <CountUp text={NCAA.loss} delay={0.5} className="font-display text-[40px] font-bold leading-none" style={{ color: C.ok }} />}
                        <span className="text-[15px] leading-tight text-gray-200">{NCAA.lossKg} nas<br />20 h antes</span>
                    </span>
                </div>
            </Wipe>
        </div>
    );
};

export default function RefeedSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const last = step === STEPS.length - 1;
    const focus = (i: number) => last || step === i || (i === 2 && step === 3);
    return (
        <FrameB tabs={STEPS.map(x => x.tab)} step={step} onSelect={setStep} layoutId="refeed-tabs"
            chips={<><DesignChip>{s.design}</DesignChip><IllustrativeChip>forma da curva ilustrativa</IllustrativeChip></>}
            stage={
                <div className="flex h-full flex-col gap-1.5 px-4 py-2">
                    <StageBlock shown focus={focus(0)} className="flex flex-col gap-1">
                        <StageLabel color={C.glycogenSoft}>o glicogênio · Kondo 2021</StageLabel>
                        <Wipe from="left"><KondoCurve /></Wipe>
                    </StageBlock>
                    <StageBlock shown={step >= 1} focus={focus(1)} className="flex flex-col gap-1.5 border-t-2 border-white/10 pt-1.5">
                        <StageLabel>pesagem → luta · Reale 2016 e 2017</StageLabel>
                        {step >= 1 && LANES.map((l, i) => <LaneRow key={l.key} lane={l} delay={0.15 + i * 0.25} />)}
                    </StageBlock>
                    <StageBlock shown={step >= 2} focus={focus(2)} className="flex flex-col gap-1 border-t-2 border-white/10 pt-1.5">
                        <StageLabel color={C.stone}>três mortes e uma regra · CDC 1998, Oppliger 2006</StageLabel>
                        {step >= 2 && <Timeline step={step} />}
                    </StageBlock>
                </div>
            }
            panel={
                <PanelB step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                    source={sourcesUpTo(STEPS.map(x => x.source), step)}
                    ledger={<LedgerB title="o que fica" items={LEDGER} step={step} />} />
            } />
    );
}
