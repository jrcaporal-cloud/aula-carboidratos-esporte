import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Wipe } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip, IllustrativeChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { MedirLedger, MedirShell } from './ato10/MedirShell';
import { Monitor, SensorDrawing } from './ato10/CgmParts';
import { BOWLER, LEDGER, MATKIN, STEPS, THOMAS } from './ato10/cgm.content';

/**
 * Slide 185 · Glicose Contínua em Atleta (palco + painel). No alto, o sensor em corte (a glicose sai do capilar e chega ao
 * filamento, em laço lento) e o monitor de 24 h com o selo "curva ilustrativa" preso à curva até o fim. Embaixo, um
 * cartão por estudo entra a cada passo e fica: subelite (Thomas 2016), elite (Bowler 2025), REDs (Matkin-Hussey 2026).
 */
const STAGE_W = 680;
const ACCENT = [C.glucose, C.glucoseSoft, C.ok, C.stone] as const;

/** Cartão de estudo: a moldura e o título já estão na tela (a agenda do slide); o conteúdo entra no passo dele. */
const Tile = ({ show, title, color, children }: { show: boolean; title: string; color: string; children: ReactNode }) => (
    <motion.div className="flex h-full flex-col gap-1.5 rounded-xl border-2 px-3 py-2" initial={false}
        animate={{ opacity: show ? 1 : 0.6, borderColor: show ? `${color}80` : 'rgba(255,255,255,0.16)' }} transition={{ duration: DUR.enter }}>
        <span className="text-[16px] font-semibold leading-tight" style={{ color: show ? color : '#D1D5DB' }}>{title}</span>
        <Wipe show={show} from="top" className="flex min-h-0 flex-1 flex-col gap-1.5">{show && children}</Wipe>
    </motion.div>
);

const People = () => (
    <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-5 gap-x-1 gap-y-0.5 self-start">
            {Array.from({ length: 10 }, (_, i) => (
                <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger(i, 0.3, 0.04), duration: DUR.text }}>
                    <User size={26} strokeWidth={2.6} color={i < THOMAS.lit ? C.glucose : '#6B7280'} fill={i < THOMAS.lit ? C.glucose : 'none'} aria-hidden />
                </motion.span>
            ))}
        </div>
        <span className="text-[16px] leading-tight text-gray-100"><b className="text-[22px]" style={{ color: C.glucoseSoft }}>4 de 10</b> &gt; 70% do tempo acima de 6,0</span>
        <span className="text-[16px] leading-tight text-gray-100"><b className="text-[22px] text-white">3 de 10</b> jejum na faixa de pré-diabetes</span>
    </div>
);

const Stat = ({ value, unit, caption, color, delay = 0 }: { value: string; unit?: string; caption: string; color: string; delay?: number }) => (
    <div className="flex flex-col leading-tight">
        <span className="flex items-baseline gap-1">
            <CountUp text={value} delay={delay} className="text-[26px] font-bold tabular-nums" style={{ color }} />
            {unit && <span className="text-[16px] text-gray-300">{unit}</span>}
        </span>
        <span className="text-[16px] text-gray-200">{caption}</span>
    </div>
);

export default function CgmSim() {
    const { step, setStep } = useSlideSteps(STEPS.length);
    const s = STEPS[step];
    const stage = (
        <div className="flex h-full flex-col gap-2 px-3 py-2">
            <div className="flex items-start gap-2">
                <SensorDrawing />
                <Monitor lit={step === 1} />
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5">
                <Tile show={step >= 1} title="Subelite · n = 10" color={C.glucoseSoft}><People /></Tile>
                <Tile show={step >= 2} title="Elite · n = 12 · 8,4 g/kg/d" color={C.ok}>
                    <Stat value={BOWLER.mean} unit="mg/dL" caption="média de 24 h" color={C.ok} delay={0.3} />
                    <Stat value={BOWLER.night} unit="mg/dL" caption="média noturna" color={C.ok} delay={0.45} />
                    <Stat value={BOWLER.mage} unit="mg/dL" caption="variabilidade (MAGE)" color={C.ok} delay={0.6} />
                </Tile>
                <Tile show={step >= 3} title="REDs × controle · n = 18" color={C.stone}>
                    <Stat value={MATKIN.night} caption="glicose noturna" color={C.stone} delay={0.3} />
                    <Stat value={MATKIN.mage} caption="variabilidade (MAGE)" color={C.stone} delay={0.45} />
                    <motion.span className="mt-auto text-[16px] leading-tight text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: DUR.enter, ease: EASE_OUT }}>
                        2024: sem consenso para interpretar
                    </motion.span>
                </Tile>
            </div>
        </div>
    );
    return (
        <MedirShell tabs={STEPS.map(t => t.tab)} step={step} setStep={setStep} layoutId="ato10-cgm-tabs"
            chips={<><DesignChip>{s.design}</DesignChip><IllustrativeChip>curva de 24 h: ilustrativa</IllustrativeChip></>}
            stageWidth={STAGE_W} stage={stage} accent={ACCENT[step]} headline={s.headline} text={s.text}
            ledger={<MedirLedger rows={LEDGER} step={step} termWidth={120} />}
            sources={sourcesUpTo(STEPS.map(t => t.sources), step)} />
    );
}
