import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { Chip, Panel, Source, StepTabs } from './kit/ui';
import { FatBrakeDiagram } from './ato3/FatBrakeDiagram';
import { PdhBars, PhosphorylaseBand } from './ato3/FatBrakePanels';
import { FAT_ROWS, FAT_STEPS, type FatRow } from './ato3/fatbrake.content';

/**
 * Slide 45 · Por que a Gordura Trava no Alto. Palco em quatro quadros que se acumulam: o díptico 55% × 75% da Wmáx
 * (carnitina livre → acetilcarnitina, a CPT-I sem carnitina, 3 AGL × 1 AGL passando) e, embaixo, a PDH por potência e a
 * fosforilase a que não sobe (Howlett 1998). Painel com o texto do passo e o livro-caixa que acumula.
 */

const W = 660;
const H = 428;
const ACCENT = [C.fat, C.glucoseSoft, C.glucoseSoft, C.glycogenSoft] as const;
const TONE: Record<FatRow['tone'], string> = { fat: C.fat, glucose: C.glucoseSoft, glycogen: C.glycogenSoft, neutral: C.stone };

const Chips = ({ step }: { step: number }) => (
    <>
        {step <= 1 && <IllustrativeChip>fichas ilustrativas</IllustrativeChip>}
        <DesignChip>{step <= 1 ? 'isótopos + biópsias · n = 8' : 'biópsias · n = 7 não treinados'}</DesignChip>
        {step === 1 && <Chip>CPT-I não medida</Chip>}
    </>
);

/** Moldura do quadro que ainda vai entrar: mostra a estrutura do palco sem adiantar o dado. */
const SLOTS = [
    { at: 1, x: 340, y: 0, w: 320, h: 240, label: '75% Wmáx' },
    { at: 2, x: 0, y: 252, w: 320, h: 172, label: 'PDH × potência' },
    { at: 3, x: 350, y: 252, w: 310, h: 172, label: 'fosforilase a' },
] as const;

const Slots = ({ step }: { step: number }) => (
    <g>
        {SLOTS.map(sl => (
            <motion.g key={sl.label} initial={false} animate={{ opacity: step < sl.at ? 1 : 0 }} transition={{ duration: DUR.exit }}>
                <rect x={sl.x + 1} y={sl.y + 1} width={sl.w - 2} height={sl.h - 2} rx={14} fill="none" stroke="#334155" strokeWidth={2} strokeDasharray="8 8" />
                <text x={sl.x + sl.w / 2} y={sl.y + sl.h / 2 + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill="#64748B" style={{ fontFamily: 'var(--font-body)' }}>{sl.label}</text>
            </motion.g>
        ))}
    </g>
);

export default function FatBrakeSim() {
    const { step, setStep } = useSlideSteps(FAT_STEPS.length);
    const s = FAT_STEPS[step];
    return (
        <div className="not-prose flex h-[500px] w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <StepTabs labels={FAT_STEPS.map(f => f.tab)} step={step} onSelect={setStep} layoutId="fat-tabs" />
                <div className="flex flex-wrap justify-end gap-2"><Chips step={step} /></div>
            </div>
            <div className="flex min-h-0 flex-1 gap-4">
                <Panel className="shrink-0 px-2 py-1">
                    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
                        aria-label="55% contra 75% da Wmáx: carnitina livre e acetilada na porta CPT-I; PDH ativa e fosforilase a por intensidade">
                        <Slots step={step} />
                        <FatBrakeDiagram step={step} />
                        <PdhBars show={step >= 2} />
                        <g transform="translate(350 0)"><PhosphorylaseBand show={step >= 3} /></g>
                    </svg>
                </Panel>
                <Panel className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-3">
                    <motion.div key={step} className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                        <h3 className="m-0 font-display text-[24px] font-semibold leading-tight" style={{ color: ACCENT[step] }}>{s.headline}</h3>
                        <p className="m-0 text-[17px] leading-snug text-gray-100">{s.text}</p>
                    </motion.div>
                    <div className="mt-auto flex flex-col gap-2">
                        <div className="flex flex-col">
                            {FAT_ROWS.filter(r => r.at <= step).map((r, i) => (
                                <motion.div key={r.label} className="flex items-baseline justify-between gap-3 border-t-2 border-white/10 py-0.5"
                                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: DUR.enter, delay: r.at === step ? stagger(i, 0.4, 0.1) : 0, ease: EASE_OUT }}>
                                    <span className="min-w-0 text-[16px] font-semibold leading-tight text-gray-100">{r.label}</span>
                                    <span className="shrink-0 font-display text-[19px] font-bold leading-tight tabular-nums" style={{ color: TONE[r.tone] }}>{r.value}</span>
                                </motion.div>
                            ))}
                        </div>
                        <Source>{sourcesUpTo(FAT_STEPS.map(f => f.sources), step)}</Source>
                    </div>
                </Panel>
            </div>
        </div>
    );
}
