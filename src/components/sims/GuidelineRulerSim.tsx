import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { CalcChip, DesignChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { MedirLedger, MedirShell } from './ato10/MedirShell';
import { int } from './ato10/units';
import { BANDS, DEFAULT_KG, DURING, GH_MAX, LEDGER, OVERLAPS, RULER_MAX, STEPS, WEIGHTS } from './ato10/guideline.content';

/**
 * Slide 180 · A Régua das Diretrizes (palco + painel). No palco, a escada das quatro faixas diárias (com a carga e o
 * "teste da fala"); depois as zonas em que se cobrem, os gramas do peso escolhido (cálculo) e, embaixo, a régua de g/h
 * de durante a sessão. Nada some: o quadro final tem as duas unidades lado a lado.
 */
const STAGE_W = 640;
const LABEL_W = 196;
const ROW_H = 56;
const at = (v: number, max = RULER_MAX) => `${(v / max) * 100}%`;
const ACCENT = [C.glucose, C.stone, C.glucoseSoft, C.ok] as const;

const WeightPicker = ({ kg, onPick }: { kg: number; onPick: (kg: number) => void }) => (
    <div className="flex items-center gap-1.5">
        <span className="mr-1 text-[16px] text-gray-300">peso do atleta</span>
        {WEIGHTS.map(w => {
            const active = w === kg;
            return (
                <button key={w} type="button" onClick={() => onPick(w)} aria-pressed={active}
                    className="cursor-pointer rounded-lg border-2 px-2 py-0.5 font-mono text-[16px] tabular-nums transition-colors active:scale-[0.97]"
                    style={{ borderColor: active ? C.glucose : 'rgba(255,255,255,0.22)', color: active ? '#04080F' : C.text, background: active ? C.glucose : 'transparent' }}>
                    {w} kg
                </button>
            );
        })}
    </div>
);

const Axis = ({ ticks, max, unit }: { ticks: readonly number[]; max: number; unit: string }) => (
    <div className="flex items-start" style={{ height: 28 }}>
        <span className="shrink-0 pt-1 text-[16px] text-gray-300" style={{ width: LABEL_W }}>{unit}</span>
        <div className="relative h-full flex-1 border-t-2 border-white/40">
            {ticks.map(v => (
                <span key={v} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: at(v, max) }}>
                    <span className="h-1.5 w-[2px] bg-white/50" />
                    <span className="font-mono text-[16px] tabular-nums leading-none text-gray-200">{v}</span>
                </span>
            ))}
        </div>
    </div>
);

/** Zonas de sobreposição: atrás das barras, atravessando as quatro linhas. */
const Overlaps = ({ on }: { on: boolean }) => (
    <div className="pointer-events-none absolute inset-y-0" style={{ left: LABEL_W, right: 0 }}>
        {OVERLAPS.map(o => (
            <motion.div key={o.lo} className="absolute inset-y-0 rounded-md border-x-2"
                style={{ left: at(o.lo), width: at(o.hi - o.lo), borderColor: C.stone, background: 'rgba(231,229,228,0.12)' }}
                initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[16px] font-semibold" style={{ color: C.stone }}>
                    {o.lo}–{o.hi}
                </span>
            </motion.div>
        ))}
    </div>
);

const DailyBands = ({ step, kg }: { step: number; kg: number }) => (
    <div className="relative">
        <Overlaps on={step >= 1} />
        {BANDS.map((b, i) => (
            <div key={b.id} className="flex items-center" style={{ height: ROW_H }}>
                <div className="flex shrink-0 flex-col pr-2 leading-[1.1]" style={{ width: LABEL_W }}>
                    <span className="text-[18px] font-semibold text-white">{b.name}</span>
                    <span className="whitespace-nowrap text-[16px] text-gray-300">{b.load}</span>
                    <span className="whitespace-nowrap text-[16px] italic" style={{ color: C.caveat }}>{b.talk}</span>
                </div>
                <div className="relative z-10 h-full flex-1">
                    <Wipe from="left" delay={stagger(i, 0.1, 0.14)} className="absolute top-[5px] h-[28px]"
                        style={{ left: at(b.lo), width: `calc(${at(b.hi - b.lo)} - 3px)` }}>
                        <div className="flex h-full items-center rounded-lg px-2" style={{ background: C.glucose }}>
                            <span className="text-[18px] font-bold tabular-nums text-[#04080F]">{b.lo}–{b.hi}</span>
                        </div>
                    </Wipe>
                    {step >= 2 && (
                        <motion.span className="absolute top-[34px] whitespace-nowrap" style={{ left: at(b.lo) }}
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i), duration: DUR.enter, ease: EASE_OUT }}>
                            <CountUp key={kg} text={`${int(b.lo * kg)}–${int(b.hi * kg)} g/d`} duration={0.6}
                                className="font-mono text-[16px] font-semibold" style={{ color: C.glucoseSoft }} />
                        </motion.span>
                    )}
                </div>
            </div>
        ))}
    </div>
);

/** Régua de durante a sessão (g/h): bochecho, 30–60 e até 90. */
const DuringStrip = () => (
    <div className="flex flex-col">
        <div className="flex items-center" style={{ height: 38 }}>
            <div className="flex shrink-0 flex-col pr-3 leading-tight" style={{ width: LABEL_W }}>
                <span className="text-[19px] font-semibold text-white">Durante a sessão</span>
                <span className="text-[16px] text-gray-300">independe do peso</span>
            </div>
            <div className="relative h-[30px] flex-1">
                <span className="absolute inset-y-[8px] rounded-md" style={{ left: 0, width: at(8, GH_MAX), background: C.co2 }} />
                <span className="absolute inset-y-0 flex items-center rounded-lg px-2 text-[18px] font-bold text-[#04080F]"
                    style={{ left: at(DURING.mid.lo, GH_MAX), width: `calc(${at(DURING.mid.hi - DURING.mid.lo, GH_MAX)} - 3px)`, background: C.glucose }}>30–60</span>
                <span className="absolute inset-y-0 flex items-center rounded-lg border-[3px] border-dashed px-2 text-[18px] font-bold"
                    style={{ left: at(DURING.long.lo, GH_MAX), width: at(DURING.long.hi - DURING.long.lo, GH_MAX), borderColor: C.ok, color: C.ok }}>até 90</span>
            </div>
        </div>
        <Axis ticks={[0, 30, 60, 90]} max={GH_MAX} unit="g por hora" />
        <div className="relative h-[22px]" style={{ marginLeft: LABEL_W }}>
            {[
                { x: 3, t: '~1 h: bochecho', c: C.caveat },
                { x: 45, t: 'provas longas', c: C.glucoseSoft },
                { x: 78, t: '> 2,5 h, mistura', c: C.ok },
            ].map(l => (
                <span key={l.t} className="absolute w-[120px] -translate-x-1/2 text-center text-[16px] leading-tight" style={{ left: at(l.x, GH_MAX), color: l.c, marginLeft: l.x < 10 ? 52 : 0 }}>{l.t}</span>
            ))}
        </div>
    </div>
);

export default function GuidelineRulerSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const [kg, setKg] = useState(DEFAULT_KG);
    const s = STEPS[step];
    const chips = (
        <>
            {step < 2 && <DesignChip>consenso · sem grau de evidência</DesignChip>}
            <ViaReviewChip>faixas via tabela secundária</ViaReviewChip>
            {step >= 2 && <CalcChip>gramas: cálculo</CalcChip>}
        </>
    );
    const stage = (
        <div className="flex h-full flex-col px-4 py-2">
            <div className="flex h-[28px] shrink-0 items-center justify-between">
                <span className="text-[17px] font-semibold text-gray-200">Por dia · g/kg de peso</span>
                {step >= 2 && <WeightPicker kg={kg} onPick={setKg} />}
            </div>
            <DailyBands step={step} kg={kg} />
            <Axis ticks={Array.from({ length: RULER_MAX + 1 }, (_, v) => v)} max={RULER_MAX} unit="g/kg/d" />
            <Wipe show={step >= 3} from="left" className="mt-1.5 border-t-2 border-white/15 pt-1.5">
                <DuringStrip />
            </Wipe>
        </div>
    );
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-guide-tabs" chips={chips}
            stageWidth={STAGE_W} stage={stage} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<MedirLedger rows={LEDGER} step={step} termWidth={104} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
