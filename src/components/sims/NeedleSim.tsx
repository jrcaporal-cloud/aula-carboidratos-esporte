import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { ViaReviewChip } from './kit/chips';
import { Foot, Lead, SimBox } from './ato4/frame';
import { NEEDLE_LEADS, NEEDLE_MILESTONES, NEEDLE_SOURCE } from './ato4/needle.content';

/**
 * Slide 60 · a agulha de Bergström em prancha chapada: o corte da coxa, a agulha entrando no vasto lateral,
 * o fragmento indo para a lente e a coloração PAS deixando as fibras roxas. Cena que se monta, passo a passo.
 */

const VB_W = 1136;
const VB_H = 300;
const LENS = { cx: 985, cy: 138, r: 122 } as const;
/** Quanto a agulha avança para a ponta entrar no vasto lateral. */
const NEEDLE_IN = -108;

/** Fibras do corte visto na lente (empacotamento hexagonal com leve desalinhamento fixo). */
const FIBERS = (() => {
    const out: { x: number; y: number; r: number }[] = [];
    const gap = 36;
    for (let row = -4; row <= 4; row++) {
        for (let col = -4; col <= 4; col++) {
            const x = LENS.cx + col * gap + (row % 2 ? gap / 2 : 0) + Math.sin(row * 7 + col * 3) * 4;
            const y = LENS.cy + row * gap * 0.88 + Math.cos(row * 5 + col * 11) * 4;
            if (Math.hypot(x - LENS.cx, y - LENS.cy) < LENS.r + 10) out.push({ x, y, r: 15 + (Math.abs(Math.sin(row * col + col)) * 3) });
        }
    }
    return out;
})();

const Thigh = () => (
    <g>
        <ellipse cx={230} cy={150} rx={178} ry={128} fill="#1A2230" stroke={C.stone} strokeWidth={3} />
        <ellipse cx={226} cy={152} rx={150} ry={104} fill="#2A2334" />
        <ellipse cx={334} cy={138} rx={58} ry={72} fill={C.glycogen} fillOpacity={0.32} stroke={C.glycogenSoft} strokeWidth={3} />
        <circle cx={205} cy={160} r={30} fill={C.stone} />
        <SvgText x={205} y={216} text="fêmur" size={18} anchor="middle" color={C.stone} />
        <SvgText x={392} y={40} text="vasto lateral" size={18} anchor="start" color={C.glycogenSoft} />
        <SvgText x={230} y={296} text="corte da coxa" size={18} anchor="middle" color={C.muted} />
    </g>
);

const Needle = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <motion.g initial={false} animate={{ x: step === 1 ? NEEDLE_IN : 0 }}
        transition={{ duration: reduce ? 0 : DUR.morph * 1.6, ease: EASE_IN_OUT }}>
        <polygon points="444,140 416,148 444,156" fill={C.stone} />
        <rect x={444} y={140} width={326} height={16} fill={C.stone} />
        <rect x={456} y={140} width={34} height={7} fill="#04080F" />
        <rect x={770} y={126} width={70} height={44} rx={8} fill={C.co2} />
        <SvgText x={640} y={196} text="agulha de Bergström" size={18} anchor="middle" color={C.stone} />
    </motion.g>
);

/** O fragmento: aparece na janela da agulha e voa para a lente. */
const Fragment = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const atLens = step >= 2;
    return (
        <motion.g initial={false}
            animate={{ x: atLens ? LENS.cx - 473 : step === 1 ? NEEDLE_IN : 0, y: atLens ? LENS.cy - 143 : 0, opacity: step === 1 || step === 2 ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : DUR.morph * 1.4, ease: EASE_IN_OUT }}>
            <rect x={458} y={138} width={30} height={10} rx={4} fill={C.glycogenSoft} />
        </motion.g>
    );
};

const Lens = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const shown = step >= 2;
    const stained = step >= 3;
    return (
        <motion.g initial={false} animate={{ opacity: shown ? 1 : 0, scale: shown || reduce ? 1 : 0.92 }}
            style={{ transformOrigin: `${LENS.cx}px ${LENS.cy}px` }}
            transition={{ duration: reduce ? 0 : DUR.enter, delay: shown ? 0.35 : 0, ease: EASE_OUT }}>
            <defs>
                <clipPath id="needle-lens"><circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} /></clipPath>
            </defs>
            <g clipPath="url(#needle-lens)">
                <rect x={LENS.cx - LENS.r} y={LENS.cy - LENS.r} width={LENS.r * 2} height={LENS.r * 2} fill="#E2DCE8" />
                {FIBERS.map((f, i) => (
                    <g key={i}>
                        <circle cx={f.x} cy={f.y} r={f.r} fill="#F4F1F7" stroke="#B9AFC6" strokeWidth={2} />
                        <motion.circle cx={f.x} cy={f.y} r={f.r} fill={i % 5 === 0 ? '#6D3FD9' : C.glycogen}
                            initial={false} animate={{ opacity: stained ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.enter, delay: stained && !reduce ? stagger(i % 9, 0.1, 0.06) : 0, ease: EASE_OUT }} />
                    </g>
                ))}
            </g>
            <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} fill="none" stroke={C.stone} strokeWidth={4} />
            <SvgText x={LENS.cx} y={LENS.cy + LENS.r + 24} text={stained ? 'PAS: glicogênio em roxo' : 'o fragmento ao microscópio'}
                size={18} anchor="middle" color={stained ? C.glycogenSoft : C.stone} />
        </motion.g>
    );
};

const Timeline = ({ step }: { step: number }) => (
    <ol className="m-0 grid list-none grid-cols-3 gap-6 p-0">
        {NEEDLE_MILESTONES.map(m => {
            const lit = step >= m.from;
            return (
                <li key={m.year} className="flex flex-col gap-1 border-t-[3px] pt-2 transition-[border-color,opacity] duration-300"
                    style={{ borderColor: lit ? C.glycogen : 'rgba(255,255,255,0.18)', opacity: lit ? 1 : 0.6 }}>
                    <span className="font-display text-[24px] font-semibold leading-none text-white">{m.year}</span>
                    <span className="text-[18px] leading-snug text-gray-200">{m.text}</span>
                </li>
            );
        })}
    </ol>
);

export default function NeedleSim() {
    const { step } = useSlideSteps(NEEDLE_LEADS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <SimBox>
            <Lead beat={step} chips={<ViaReviewChip>relato de Harris, via Stout 2025</ViaReviewChip>} className="min-h-[72px]">{NEEDLE_LEADS[step]}</Lead>
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="mt-2 block w-full" style={{ height: VB_H }} role="img"
                aria-label="Corte da coxa com a agulha de biópsia entrando no vasto lateral e o fragmento visto ao microscópio">
                <Thigh />
                <Needle step={step} reduce={reduce} />
                <Fragment step={step} reduce={reduce} />
                <Lens step={step} reduce={reduce} />
            </svg>
            <div className="mt-2"><Timeline step={step} /></div>
            <Foot source={NEEDLE_SOURCE} />
        </SimBox>
    );
}
