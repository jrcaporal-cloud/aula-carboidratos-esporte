import { motion } from 'framer-motion';
import { Brain, Droplets, Syringe, type LucideIcon } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { Grow, Wipe } from './kit/Beat';
import { CalcChip, DesignChip, IllustrativeChip } from './kit/chips';
import { C } from './kit/palette';
import { sourcesUpTo } from './kit/sources';
import { KeyFact } from './kit/rhythm';
import { Model3DHint } from './kit/Model3DHint';
import { Panel } from './kit/ui';
import { PbRow, PbShell, PbSidePanel } from './ato6/pbShell';
import { RinseHead } from './ato6/RinseHead';
import {
    AXIS, COLUMNS, CONTROLS, FMRI, REGIONS, RINSE_STEPS, type RinseColumn,
} from './ato6/mouthrinse.content';

/**
 * Slide 110 · O Bochecho, em tríptico + painel. Três quadros que se somam: à esquerda, empilhados, a seringa
 * (glicose na veia, prova igual) e o bochecho cuspido (quase 2 min a menos); à direita, o corte sagital com o caminho
 * receptor oral → tronco → ínsula → recompensa (Chambers 2009). O painel conta o passo e guarda o controle de cada estudo.
 */

const ACCENT = [C.caveat, C.glucose, C.glucoseSoft] as const;
const ICONS: readonly LucideIcon[] = [Syringe, Droplets];
const frac = (min: number) => (min - AXIS[0]) / (AXIS[1] - AXIS[0]);

const ColumnHead = ({ Icon, title, study }: { Icon: LucideIcon; title: string; study: string }) => (
    <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: C.glucose }}>
            <Icon size={22} strokeWidth={2.5} color="#04080F" aria-hidden />
        </span>
        <div className="flex flex-col leading-tight">
            <span className="text-[20px] font-bold text-white">{title}</span>
            <span className="whitespace-nowrap text-[16px] text-gray-300">{study}</span>
        </div>
    </div>
);

/** Cartão da seringa ou do bochecho: protocolo, cronômetro com eixo de 58 a 62 min e o veredito. */
const TimeCard = ({ col, Icon }: { col: RinseColumn; Icon: LucideIcon }) => (
    <div className="flex flex-col gap-1.5">
        <ColumnHead Icon={Icon} title={col.title} study={col.study} />
        {col.lines.map(l => <span key={l} className="text-[17px] leading-snug text-gray-100">{l}</span>)}
        <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] text-gray-300">min (eixo 58–62)</span>
            <motion.span className="whitespace-nowrap rounded-md border-2 px-2 py-0.5 text-[16px] font-bold"
                style={{ borderColor: col.good ? C.ok : C.caveat, color: col.good ? C.ok : C.caveat }}
                initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: 'spring', stiffness: 480, damping: 26 }}>
                {col.verdict}
            </motion.span>
        </div>
        {col.rows.map((r, i) => (
            <div key={r.label} className="grid grid-cols-[84px_1fr_62px] items-center gap-2">
                <span className="text-[16px] text-gray-200">{r.label}</span>
                <div className="relative h-[12px] overflow-hidden rounded bg-white/10">
                    <div className="absolute inset-y-0 left-0" style={{ width: `${frac(r.min) * 100}%` }}>
                        <Grow value={1} color={r.strong ? C.glucose : C.co2} delay={stagger(i, 0.3, 0.15)} />
                    </div>
                </div>
                <span className="text-right font-display text-[20px] font-bold tabular-nums" style={{ color: r.strong ? C.glucoseSoft : '#E5E7EB' }}>{r.text}</span>
            </div>
        ))}
    </div>
);

/** Antes do passo 3, a cabeça aparece apagada, como a pergunta; no passo 3 o caminho e as regiões acendem. */
const BrainColumn = ({ live }: { live: boolean }) => (
    <div className="flex h-full flex-col gap-1.5">
        <ColumnHead Icon={Brain} title={live ? 'No cérebro' : 'E se for o cérebro?'} study={live ? 'Chambers 2009 · fMRI' : 'a pergunta seguinte'} />
        <div style={{ opacity: live ? 1 : 0.6, transition: 'opacity 300ms' }}><RinseHead live={live} /></div>
        {live && <>
        <div className="grid grid-cols-2 gap-x-3 text-[16px] leading-snug text-gray-200">
            {REGIONS.map(r => <span key={r.n}><b className="text-white">{r.n}</b> {r.name}</span>)}
        </div>
        <table className="w-full text-left text-[16px]">
            <tbody>
                {FMRI.map((f, i) => (
                    <motion.tr key={f.rinse} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stagger(i, 0.9, 0.12), duration: DUR.enter, ease: EASE_OUT }}>
                        <td className="font-semibold" style={{ color: f.on ? C.glucoseSoft : '#D1D5DB' }}>{f.rinse}</td>
                        <td className="font-mono text-[15px] text-gray-100">{f.regions}</td>
                        <td className="text-right tabular-nums text-gray-100">{f.time}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
        </>}
    </div>
);

const Controls = ({ step }: { step: number }) => (
    <table className="w-full border-separate border-spacing-y-0.5 text-left">
        <thead>
            <tr className="text-[15px] text-gray-300"><th className="font-normal">estudo</th><th className="text-right font-normal">controle</th></tr>
        </thead>
        <tbody>
            {CONTROLS.filter(c => c.at <= step).map(c => (
                <PbRow key={c.study} at={c.at} step={step} className="text-[17px]">
                    <td className="font-semibold text-white">{c.study}</td>
                    <td className="text-right text-gray-100">{c.control}</td>
                </PbRow>
            ))}
        </tbody>
    </table>
);

export default function MouthRinseSim() {
    const { step, setStep } = useSlideSteps(RINSE_STEPS.length);
    const s = RINSE_STEPS[step];
    return (
        <PbShell tabs={RINSE_STEPS.map(r => r.tab)} step={step} setStep={setStep} layoutId="rinse-tabs"
            chips={<><DesignChip>{s.chip}</DesignChip>{step >= 1 && <CalcChip>~2,9%: cálculo</CalcChip>}{step === 2 && <IllustrativeChip>cérebro: esquema</IllustrativeChip>}<Model3DHint label="cérebro" /></>}>
            <Panel className="grid w-[690px] shrink-0 grid-cols-[282px_1fr] gap-4 px-4 py-3">
                <div className="flex min-w-0 flex-col gap-3 border-r-2 border-white/15 pr-4">
                    {COLUMNS.map((col, i) => (
                        <div key={col.title} className={i === 0 ? 'border-b-2 border-white/15 pb-3' : ''}>
                            {step >= i ? <Wipe from="top"><TimeCard col={col} Icon={ICONS[i]} /></Wipe> : <div className="h-[150px]" />}
                        </div>
                    ))}
                </div>
                <div className="min-w-0"><BrainColumn live={step >= 2} /></div>
            </Panel>
            <PbSidePanel step={step} headline={s.headline} color={ACCENT[step]} text={s.text}
                source={sourcesUpTo(RINSE_STEPS.map(r => r.sources), step)}>
                <div className="flex items-baseline gap-3">
                    <KeyFact key={step} color={ACCENT[step]} delay={0.5}>
                        <span className="font-display text-[44px] font-bold leading-none" style={{ color: ACCENT[step] }}>{s.key}</span>
                    </KeyFact>
                    <span className="text-[17px] leading-snug text-gray-200">{s.keyCaption}</span>
                </div>
                <Controls step={step} />
            </PbSidePanel>
        </PbShell>
    );
}
