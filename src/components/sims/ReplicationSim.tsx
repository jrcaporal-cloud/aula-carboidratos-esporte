import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { BODY_FONT, C } from './kit/palette';
import { Grow } from './kit/Beat';
import { CountUp } from './kit/CountUp';
import { DesignChip } from './kit/chips';
import { Panel, Source } from './kit/ui';
import { SnShell } from './ato8/SnShell';
import {
    ARM_COLOR, REPLICATION_CHIPS, REPLICATION_SOURCES, REPLICATION_TABS, SN1_ROWS, SN2_ROWS, SN3, SN3_RESULT, STUDY_TEXT, type DivRow,
} from './ato8/replication.content';

/**
 * Slide 146 · A crise de confiança evitada. Tríptico: Supernova 1, 2 e 3 lado a lado, cada coluna com o seu
 * desenho, o seu gráfico e a sua fonte. A crítica entra no passo 1 e fica; a réplica, o rebote e o Supernova 3
 * se somam. O quadro final é o mesmo veredito três vezes.
 */

const INK = '#04080F';
const HALF = 96;

/** Barras que abrem do centro: direita = mais rápido. O número conta até o valor. */
const Diverging = ({ rows, max, unit }: { rows: readonly DivRow[]; max: number; unit: string }) => (
    <div className="flex flex-col gap-[6px]">
        <div className="flex text-[16px] leading-none text-gray-300">
            <span className="w-[58px]">{unit}</span>
            <span className="pr-2 text-right" style={{ width: HALF }}>← lento</span>
            <span className="pl-2" style={{ width: HALF }}>rápido →</span>
        </div>
        {rows.map((r, i) => {
            const color = ARM_COLOR[r.id];
            const w = (Math.abs(r.value) / max) * HALF;
            const right = r.value > 0;
            return (
                <div key={r.id} className="flex h-[30px] items-center">
                    <span className="w-[58px] text-[17px] font-bold" style={{ color }}>{r.name}</span>
                    <div className="relative h-full" style={{ width: HALF * 2 }}>
                        <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-white/45" />
                        <div className="absolute top-[5px] h-[20px] overflow-hidden rounded-[4px]" style={{ width: w, left: right ? HALF : HALF - w }}>
                            <Grow value={1} color={color} delay={stagger(i, 0.1, 0.12)} style={{ transformOrigin: right ? 'left center' : 'right center' }} />
                        </div>
                    </div>
                    <CountUp text={r.label} delay={stagger(i, 0.3, 0.12)} className="ml-auto whitespace-nowrap text-[20px] font-bold" style={{ color }} />
                </div>
            );
        })}
    </div>
);

const Fade = ({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
    <motion.div className={className} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.enter, delay, ease: EASE_OUT }}>
        {children}
    </motion.div>
);

const Column = ({ title, sub, active, children, source }: { title: string; sub: string; active: boolean; children: ReactNode; source?: string }) => (
    <Panel state={active ? 'active' : 'idle'} glow={C.caveat} className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3">
        <div className="flex items-baseline justify-between gap-2">
            <h3 className="m-0 text-[22px] font-semibold leading-tight text-white" style={BODY_FONT}>{title}</h3>
            <span className="text-[16px] text-gray-300">{sub}</span>
        </div>
        {children}
        {source && <div className="mt-auto"><Source>{source}</Source></div>}
    </Panel>
);

const Token = ({ up, color, i }: { up: boolean; color: string; i: number }) => (
    <motion.span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[3px]"
        style={{ borderColor: color, background: up ? color : 'transparent', color: up ? INK : color }}
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: stagger(i, 0.15, 0.04), duration: 0.3, ease: EASE_OUT }}>
        {up ? <ArrowUp size={20} strokeWidth={3} /> : <ArrowDown size={20} strokeWidth={3} />}
    </motion.span>
);

const Sn3Tokens = () => (
    <div className="flex flex-col gap-2">
        {([['HCHO', SN3.hcho, C.glucose, SN3_RESULT.hcho], ['LCHF', SN3.lchf, C.fat, SN3_RESULT.lchf]] as const).map(([name, list, color, verdict], r) => (
            <div key={name} className="flex flex-col gap-1">
                <div className="flex items-center gap-[6px]">
                    <span className="w-[58px] text-[17px] font-bold" style={{ color }}>{name}</span>
                    {list.map((up, i) => <Token key={i} up={up} color={color} i={i + r * 6} />)}
                </div>
                <span className="ml-[58px] text-[16px] font-semibold" style={{ color }}>{verdict}</span>
            </div>
        ))}
    </div>
);

const Body = ({ children }: { children: ReactNode }) => <p className="m-0 text-[16px] leading-snug text-gray-100">{children}</p>;

export default function ReplicationSim() {
    const { step, setStep } = useSlideSteps(REPLICATION_TABS.length);
    return (
        <SnShell tabs={REPLICATION_TABS} step={step} setStep={setStep} layoutId="replication-tabs"
            chips={<DesignChip>{REPLICATION_CHIPS[step]}</DesignChip>}>
            <Column title="Supernova 1" sub="2015–16 · n = 29" active={step === 0} source={REPLICATION_SOURCES.sn1}>
                <Diverging rows={SN1_ROWS} max={7} unit="10 km" />
                <Body>{STUDY_TEXT.sn1}</Body>
                <Fade className="flex gap-2 rounded-xl border-2 border-white/20 px-3 py-2" delay={0.3}>
                    <RotateCcw size={22} strokeWidth={2.5} className="mt-[2px] shrink-0" color={C.caveat} />
                    <p className="m-0 text-[16px] leading-snug" style={{ color: C.caveat }}><b className="text-white">A crítica.</b> {STUDY_TEXT.critique}</p>
                </Fade>
            </Column>
            <Column title="Supernova 2" sub="2017 · n = 26" active={step === 1 || step === 2} source={step >= 1 ? REPLICATION_SOURCES.sn2 : undefined}>
                {step === 0 && <p className="m-0 mt-2 text-[18px] leading-snug text-gray-300">Com as mesmas três dietas, o resultado se repetiria?</p>}
                {step >= 1 && (
                    <Fade className="flex flex-col gap-2">
                        <Diverging rows={SN2_ROWS} max={140} unit="10 km" />
                        <Body>{STUDY_TEXT.sn2}</Body>
                    </Fade>
                )}
                {step >= 2 && (
                    <Fade className="rounded-xl px-3 py-2 text-[17px] font-semibold leading-snug" delay={0.1}>
                        <span className="rounded-md px-2 py-[1px]" style={{ background: C.fat, color: INK }}>sem rebote</span>{' '}
                        <span className="text-white">{STUDY_TEXT.rebound}</span>
                    </Fade>
                )}
            </Column>
            <Column title="Supernova 3" sub="2019 · n = 13" active={step === 3} source={step >= 3 ? REPLICATION_SOURCES.sn3 : undefined}>
                {step < 3 ? (
                    <p className="m-0 mt-2 text-[18px] leading-snug text-gray-300">E se bastassem poucos dias para desligar a via do carboidrato?</p>
                ) : (
                    <Fade className="flex flex-col gap-3">
                        <Body>{STUDY_TEXT.sn3}</Body>
                        <Sn3Tokens />
                        <p className="m-0 text-[17px] font-semibold leading-snug text-white">{STUDY_TEXT.reverted}</p>
                    </Fade>
                )}
            </Column>
        </SnShell>
    );
}
