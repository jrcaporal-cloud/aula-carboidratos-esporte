import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Droplet, Dumbbell } from 'lucide-react';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { BODY_FONT, C } from '../kit/palette';
import { FORCE, LANES, ORGANS, type OrganKey } from './rescue.content';

/**
 * Slide 49 · o palco: tríptico músculo × sangue × cérebro (cada coluna acumula os seus fatos) e, embaixo, as raias:
 * tempo extra até a nova fadiga (Coggan 1987) e, no último passo, a força sustentada (Nybo 2003).
 * Loop permitido (fluxo que é o conteúdo): a glicose da bolsa descendo pela veia, 3 gotas, ciclo de 2,8 s, só com a IV ligada.
 */

const ORGAN_STYLE: Record<OrganKey, { color: string; Icon: typeof Brain }> = {
    muscle: { color: C.glycogenSoft, Icon: Dumbbell },
    blood: { color: C.glucose, Icon: Droplet },
    brain: { color: C.stone, Icon: Brain },
};
const SPACED = { wordSpacing: '0.12em' } as const;
const CYCLE = 2.8;

/** A veia na coluna do sangue: 3 gotas de glicose descendo em laço (parado com movimento reduzido). */
const Vein = ({ on }: { on: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div aria-hidden className="absolute bottom-3 right-3 top-12 w-[16px] rounded-full" style={{ background: 'rgba(245,158,11,0.18)' }}>
            {on && !reduce && [0, 1, 2].map(i => (
                <motion.span key={i} className="absolute left-[2px] h-[12px] w-[12px] rounded-[3px]" style={{ background: C.glucoseSoft, top: 0 }}
                    initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 150], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: CYCLE, ease: 'linear', repeat: Infinity, repeatDelay: 0.3, delay: (i * CYCLE) / 3, times: [0, 0.12, 0.85, 1] }} />
            ))}
        </div>
    );
};

const Organ = ({ o, step }: { o: (typeof ORGANS)[number]; step: number }) => {
    const { color, Icon } = ORGAN_STYLE[o.key];
    const live = o.facts.some(f => f.at <= step);
    return (
        <motion.div className="relative flex min-w-0 flex-1 flex-col gap-2 rounded-xl border-2 px-3 py-2"
            initial={false} animate={{ opacity: live ? 1 : 0.6 }} transition={{ duration: DUR.enter }}
            style={{ borderColor: live ? `${color}99` : 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2">
                <Icon size={26} strokeWidth={2.5} style={{ color }} aria-hidden />
                <span className="text-[20px] font-bold" style={{ color }}>{o.name}</span>
            </div>
            {!live && <span className="text-[17px] leading-snug text-gray-300">e o comando central?</span>}
            {o.facts.filter(f => f.at <= step).map((f, i) => (
                <motion.div key={f.big} className="flex flex-col pr-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.enter, delay: f.at === step ? 0.3 + i * 0.12 : 0, ease: EASE_OUT }}>
                    <span className="whitespace-nowrap text-[22px] font-extrabold leading-tight" style={{ color: f.risk ? C.risk : '#FFFFFF', ...BODY_FONT }}>{f.big}</span>
                    <span className="text-[16px] leading-tight text-gray-300">{f.small}</span>
                </motion.div>
            ))}
            {o.key === 'blood' && <Vein on={step >= 1} />}
        </motion.div>
    );
};

export const Triptych = ({ step }: { step: number }) => (
    <div className="flex h-[248px] gap-3">
        {ORGANS.map(o => <Organ key={o.key} o={o} step={step} />)}
    </div>
);

interface LaneGroupProps {
    title: string;
    rows: readonly { key: string; label: string; value: number; text: string; color: string }[];
    max: number;
    on: boolean;
}

const LaneGroup = ({ title, rows, max, on }: LaneGroupProps) => (
    <div className="flex min-w-0 flex-1 flex-col gap-2" style={{ opacity: on ? 1 : 0.6 }}>
        <span className="text-[16px] font-semibold text-gray-300">{title}</span>
        {rows.map((r, i) => (
            <div key={r.key} className="grid items-center gap-2" style={{ gridTemplateColumns: '84px 1fr 66px' }}>
                <span className="whitespace-nowrap text-[17px] font-semibold text-white">{r.label}</span>
                <div className="relative h-[26px] overflow-hidden rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    {on && <Grow value={r.value / max} color={r.color} delay={0.15 + i * 0.12} />}
                </div>
                <span className="whitespace-nowrap text-right font-display text-[20px] font-bold" style={{ color: r.color, ...SPACED }}>
                    {on ? <CountUp text={r.text} delay={0.15 + i * 0.12} /> : '—'}
                </span>
            </div>
        ))}
    </div>
);

export const RescueLanes = ({ step }: { step: number }) => (
    <div className="flex gap-6">
        <LaneGroup title="tempo extra até a nova fadiga" rows={LANES} max={50} on={step >= 1} />
        <LaneGroup title="força sustentada 2 min (Nybo)" rows={FORCE} max={260} on={step >= 3} />
    </div>
);
