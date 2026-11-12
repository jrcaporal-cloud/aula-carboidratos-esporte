import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../lib/motion';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { CountSvgText } from './kit/CountUp';
import { DesignChip, IllustrativeChip, ViaReviewChip } from './kit/chips';
import { sourcesUpTo } from './kit/sources';
import { InfoPanel, Ledger, ShellA } from './ato4/shellA';
import { NEEDLE_LEDGER, NEEDLE_MILESTONES, NEEDLE_STEPS } from './ato4/needle.content';

/**
 * Slide 60 · A agulha de Bergström em prancha chapada, cena que se monta: o corte da coxa, a agulha (cânula com
 * janela + cilindro cortante) entrando no vasto lateral, o fragmento indo para a dosagem de Hultman e, no fim, a
 * lâmina corada com PAS. Linha do tempo 1959 → 1967 no topo; painel com o texto do passo e o que cada ferramenta via.
 */

const W = 600;
const H = 410;
const NEEDLE_IN = -70;
/** Centro da janela da agulha em repouso: de onde o fragmento sai. */
const WIN = { x: 307, y: 164 } as const;
const TUBE = { x: 44, y: 350 } as const;
const LENS = { cx: 412, cy: 334, r: 68 } as const;
const ACCENT = [C.stone, C.glycogenSoft, C.glucose, C.glycogenSoft] as const;

/** Fibras da lâmina (hexagonal, desalinhamento fixo). */
const FIBERS = (() => {
    const out: { x: number; y: number; r: number; dark: boolean }[] = [];
    const gap = 27;
    for (let row = -3; row <= 3; row++) {
        for (let col = -3; col <= 3; col++) {
            const x = LENS.cx + col * gap + (row % 2 ? gap / 2 : 0) + Math.sin(row * 7 + col * 3) * 2.5;
            const y = LENS.cy + row * gap * 0.88 + Math.cos(row * 5 + col * 11) * 2.5;
            if (Math.hypot(x - LENS.cx, y - LENS.cy) < LENS.r + 6) out.push({ x, y, r: 11 + Math.abs(Math.sin(row * col + col)) * 2, dark: (row * 3 + col) % 5 === 0 });
        }
    }
    return out;
})();

const Timeline = ({ step }: { step: number }) => {
    const xs = [52, 166, 280, 400, 528];
    return (
        <g>
            <line x1={xs[0]} y1={38} x2={xs[4]} y2={38} stroke="rgba(255,255,255,0.22)" strokeWidth={3} />
            {NEEDLE_MILESTONES.map((m, i) => {
                const lit = step >= m.at;
                return (
                    <g key={`${m.year}-${m.label}`} opacity={lit ? 1 : 0.6} style={{ transition: 'opacity 300ms' }}>
                        <circle cx={xs[i]} cy={38} r={8} fill={lit ? C.glycogen : '#04080F'} stroke={lit ? C.glycogenSoft : C.co2} strokeWidth={3} />
                        <SvgText x={xs[i]} y={22} text={m.year} size={18} weight={700} anchor="middle" color={lit ? '#fff' : C.muted} />
                        <SvgText x={xs[i]} y={64} text={m.label} size={16} anchor="middle" color={lit ? C.stone : C.muted} />
                    </g>
                );
            })}
        </g>
    );
};

/** Corte transversal da coxa: pele e subcutâneo, músculo, fêmur, vasto lateral (lado de fora, à direita). */
const Thigh = () => (
    <g>
        <ellipse cx={140} cy={170} rx={118} ry={78} fill="#2B2F38" stroke={C.stone} strokeWidth={3} />
        <ellipse cx={138} cy={172} rx={100} ry={63} fill="#2A2334" />
        <ellipse cx={212} cy={162} rx={40} ry={44} fill={C.glycogen} fillOpacity={0.35} stroke={C.glycogenSoft} strokeWidth={3} />
        <circle cx={108} cy={176} r={20} fill={C.stone} />
        <SvgText x={108} y={216} text="fêmur" size={16} anchor="middle" color={C.stone} />
        <SvgText x={262} y={114} text="vasto lateral" size={17} anchor="start" color={C.glycogenSoft} />
    </g>
);

/** A agulha: cânula com janela lateral, cilindro cortante por dentro, empunhadura e estilete. */
const Needle = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <motion.g initial={false} animate={{ x: step === 1 ? NEEDLE_IN : 0 }} transition={{ duration: reduce ? 0 : 0.7, ease: EASE_IN_OUT }}>
        <polygon points="292,156 272,164 292,172" fill={C.stone} />
        <rect x={292} y={156} width={226} height={16} fill={C.stone} />
        <rect x={WIN.x - 15} y={156} width={30} height={7} fill="#04080F" />
        {/* cilindro cortante: desliza para a ponta e fecha a janela */}
        <motion.rect x={WIN.x + 22} y={163} width={190} height={6} fill={C.co2} initial={false}
            animate={{ x: step === 1 ? -36 : 0 }} transition={{ duration: reduce ? 0 : 0.3, delay: step === 1 && !reduce ? 0.72 : 0, ease: EASE_OUT }} />
        <rect x={518} y={146} width={46} height={36} rx={7} fill={C.co2} />
        <rect x={564} y={160} width={30} height={8} rx={3} fill={C.stone} />
        <SvgText x={420} y={146} text="agulha de Bergström" size={17} anchor="middle" color={C.stone} />
        <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.5 : 0 }}>
            <SvgText x={WIN.x} y={196} text="janela lateral" size={16} anchor="middle" color={C.glucoseSoft} />
            <SvgText x={440} y={196} text="cilindro cortante" size={16} anchor="middle" color={C.co2} />
        </motion.g>
    </motion.g>
);

/** O fragmento: nasce na janela, sai com a agulha e cai no tubo da dosagem. */
const Fragment = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const inTube = step >= 2;
    return (
        <motion.g initial={false}
            animate={{ x: inTube ? TUBE.x - WIN.x : step === 1 ? NEEDLE_IN : 0, y: inTube ? TUBE.y - WIN.y : 0, rotate: inTube ? 90 : 0, opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: step === 1 && !reduce ? 0.9 : 0, ease: EASE_IN_OUT }}>
            <rect x={WIN.x - 13} y={WIN.y - 5} width={26} height={10} rx={4} fill={C.glycogenSoft} />
        </motion.g>
    );
};

const Assay = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 2;
    const at = (i: number) => (reduce ? 0 : stagger(i, 0.5, 0.12));
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
            <g transform="translate(0 -18)">
            <rect x={12} y={280} width={294} height={146} rx={14} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" strokeWidth={2} />
            <SvgText x={26} y={306} text="dosagem de Hultman" size={17} color={C.glucoseSoft} />
            <rect x={TUBE.x - 14} y={322} width={28} height={78} rx={10} fill="none" stroke={C.stone} strokeWidth={3} />
            <SvgText x={TUBE.x} y={418} text="fragmento" size={16} anchor="middle" color={C.muted} />
            <line x1={66} y1={362} x2={92} y2={362} stroke={C.co2} strokeWidth={3} />
            {[108, 128, 148].map((x, i) => (
                <motion.polygon key={x} points={hexagon(x, 362, 9)} fill={C.glucose} initial={false}
                    animate={{ opacity: on ? 1 : 0 }} transition={{ duration: DUR.enter, delay: on ? at(i) : 0 }} />
            ))}
            <SvgText x={128} y={392} text="glicose" size={16} anchor="middle" color={C.glucoseSoft} />
            <line x1={164} y1={362} x2={188} y2={362} stroke={C.co2} strokeWidth={3} />
            <CountSvgText x={198} y={358} text="0,6–4,7" size={26} weight={700} color={C.glycogenSoft} run={on} delay={reduce ? 0 : 0.8} duration={0.4} />
            <SvgText x={198} y={382} text="g/100 g úmido" size={16} color={C.stone} />
            <SvgText x={198} y={404} text="(faixa em 1967)" size={16} color={C.muted} />
            </g>
        </motion.g>
    );
};

const hexagon = (cx: number, cy: number, r: number): string =>
    Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');

const Slide = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const on = step >= 3;
    return (
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : DUR.enter }}>
            <clipPath id="needle-lens-a"><circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} /></clipPath>
            <g clipPath="url(#needle-lens-a)">
                <rect x={LENS.cx - LENS.r} y={LENS.cy - LENS.r} width={LENS.r * 2} height={LENS.r * 2} fill="#E2DCE8" />
                {FIBERS.map((f, i) => (
                    <g key={i}>
                        <circle cx={f.x} cy={f.y} r={f.r} fill="#F4F1F7" stroke="#B9AFC6" strokeWidth={2} />
                        <motion.circle cx={f.x} cy={f.y} r={f.r} fill={f.dark ? '#6D3FD9' : C.glycogen} initial={false}
                            animate={{ opacity: on ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.enter, delay: on && !reduce ? stagger(i % 9, 0.35, 0.07) : 0 }} />
                    </g>
                ))}
            </g>
            <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} fill="none" stroke={C.stone} strokeWidth={4} />
            {['corado', 'com PAS:', 'glicogênio', 'em cada fibra'].map((t, i) => (
                <SvgText key={t} x={494} y={300 + i * 22} text={t} size={16} color={i >= 2 ? C.glycogenSoft : C.stone} />
            ))}
        </motion.g>
    );
};

export default function NeedleSim() {
    const { step, setStep } = useSlideSteps(NEEDLE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const s = NEEDLE_STEPS[step];
    return (
        <ShellA tabs={NEEDLE_STEPS.map(n => n.tab)} step={step} onSelect={setStep} layoutId="needle-tabs"
            chips={<>
                <ViaReviewChip>relato de Harris (Stout 2025)</ViaReviewChip>
                {step === 1 && <DesignChip>técnica: Bergström 1975</DesignChip>}
                {step === 3 && <IllustrativeChip>lâmina ilustrativa</IllustrativeChip>}
            </>}>
            <Panel className="shrink-0">
                <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img"
                    aria-label="Linha do tempo de 1959 a 1967; corte da coxa com a agulha de Bergström entrando no vasto lateral; o fragmento vai para a dosagem de glicose e para a lâmina corada com PAS">
                    <Timeline step={step} />
                    <Thigh />
                    <Needle step={step} reduce={reduce} />
                    <Assay step={step} reduce={reduce} />
                    <Fragment step={step} reduce={reduce} />
                    <Slide step={step} reduce={reduce} />
                </svg>
            </Panel>
            <InfoPanel step={step} color={ACCENT[step]} headline={s.headline} text={s.text}
                source={sourcesUpTo(NEEDLE_STEPS.map(n => n.sources), step)}>
                <Ledger rows={NEEDLE_LEDGER} step={step} labelWidth={84} />
            </InfoPanel>
        </ShellA>
    );
}
