import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_OUT } from '../../lib/motion';
import { C } from './kit/palette';
import { Source } from './kit/ui';
import { DesignChip } from './kit/chips';
import { HeadRow, Phrase } from './ato7/parts';
import { Organ } from './ato7/Organ';
import {
    DECOMBAZ_NOTE, DESIGN, LIVER_DECOMBAZ, LIVER_FUCHS, LIVER_NOTE, MUSCLE_FUCHS, MUSCLE_NOTE, PHRASES, SOURCE,
    type Fill, type Sugar,
} from './ato7/liver.content';

/**
 * Slide 124 · O fígado prefere sacarose.
 * Tela dividida: fígados à esquerda, músculos à direita, cada par enchendo com sacarose × glicose (Fuchs 2016).
 * Depois o lado do fígado troca para o trio do Décombaz 2011 (frutose, galactose, glicose).
 */
const SUGAR_COLOR: Record<Sugar, string> = { sacarose: C.fructose, frutose: C.fructose, galactose: C.stone, glicose: C.glucose };

interface OrganSetProps {
    kind: 'liver' | 'muscle';
    fills: readonly Fill[];
    filled: boolean;
    width: number;
}

const OrganSet = ({ kind, fills, filled, width }: OrganSetProps) => (
    <div className="flex items-start justify-center gap-6">
        {fills.map((f, i) => (
            <div key={f.sugar} className="flex flex-col items-center gap-2">
                <Organ kind={kind} level={filled ? f.to : f.from} width={width} delay={i * 0.08} />
                <span className="rounded-md px-2.5 py-0.5 text-[20px] font-bold" style={{ background: SUGAR_COLOR[f.sugar], color: '#04080F' }}>{f.sugar}</span>
                <span className="text-[20px] tabular-nums text-gray-100">{filled ? f.text : f.text.replace(/ → [\d,]+/, '')}</span>
            </div>
        ))}
    </div>
);

const Note = ({ show, children, color = C.stone }: { show: boolean; children: string; color?: string }) => (
    <motion.span className="self-center rounded-lg border-[3px] px-3 py-1 text-[20px] font-semibold"
        style={{ borderColor: color, color }} initial={false}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }} transition={{ delay: show ? 0.6 : 0, duration: DUR.enter, ease: EASE_OUT }}>
        {children}
    </motion.span>
);

const Half = ({ title, dim, children }: { title: string; dim: boolean; children: React.ReactNode }) => (
    <motion.div className="flex flex-1 flex-col gap-4" animate={{ opacity: dim ? 0.6 : 1 }} transition={{ duration: DUR.enter }}>
        <span className="font-display text-[30px] font-semibold leading-none text-white">{title}</span>
        {children}
    </motion.div>
);

export default function LiverRefillSim() {
    const { step } = useSlideSteps(PHRASES.length);
    const decombaz = step === 3;
    const last = step === 4;
    return (
        <div className="not-prose flex flex-col gap-4">
            <HeadRow chips={<DesignChip>{DESIGN[step]}</DesignChip>}>
                <Phrase beat={step} width={780} size={last ? 34 : 28}>{PHRASES[step]}</Phrase>
            </HeadRow>
            <div className="flex gap-10">
                <Half title="fígado" dim={step === 2}>
                    {decombaz ? (
                        <motion.div key="dec" className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter }}>
                            <OrganSet kind="liver" fills={LIVER_DECOMBAZ} filled width={156} />
                            <span className="self-center text-[18px] text-gray-300">{DECOMBAZ_NOTE}</span>
                        </motion.div>
                    ) : (
                        <motion.div key="fuchs" className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter }}>
                            <OrganSet kind="liver" fills={LIVER_FUCHS} filled={step >= 1} width={220} />
                            <Note show={step >= 1} color={C.fructoseSoft}>{LIVER_NOTE}</Note>
                        </motion.div>
                    )}
                </Half>
                <span aria-hidden className="w-[3px] self-stretch rounded-full bg-white/15" />
                <Half title="músculo" dim={step === 1 || decombaz}>
                    <OrganSet kind="muscle" fills={MUSCLE_FUCHS} filled={step >= 2} width={220} />
                    <Note show={step >= 2 && !decombaz}>{MUSCLE_NOTE}</Note>
                </Half>
            </div>
            <Source>{SOURCE}</Source>
        </div>
    );
}
