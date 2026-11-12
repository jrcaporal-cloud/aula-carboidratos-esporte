import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { EXHAUSTED_STEP, LEFT_AFTER, POOL_FOCUS, WATER_STEP, type Pool } from './pools.content';

/**
 * Slide 65 · corte longitudinal de uma fibra (como na MET): sarcolema, espaço subsarcolemal com mitocôndrias e núcleo,
 * três miofibrilas com sarcômeros (linha Z, bandas I e A, zona H, linha M), tríades nas junções A–I (túbulo T entre
 * duas cisternas do retículo), retículo longitudinal e mitocôndrias intermiofibrilares na altura da linha Z.
 * Os grânulos de glicogênio moram nos três endereços. No alto, a trilha de escala: coxa → fibra → sarcômero → grânulo.
 */

export const FIBER_W = 680;
export const FIBER_H = 440;

const L = 200; // sarcômero
const ZS = [-160, 40, 240, 440, 640] as const;
const HALF_I = 45; // meia banda I
const MF = [[150, 210], [264, 324], [378, 436]] as const;
const GAPS = [[210, 264], [324, 378]] as const;
const SUB = [96, 150] as const;

const hash = (n: number) => {
    const s = Math.sin(n * 91.7) * 12345.678;
    return s - Math.floor(s);
};

interface Granule { x: number; y: number; pool: Pool; rank: number }

/** Grânulos em posições fixas (pseudoaleatórias), nunca em cima de mitocôndria, núcleo ou tríade. */
const GRANULES: readonly Granule[] = (() => {
    const out: Granule[] = [];
    // subsarcolemal: entre as mitocôndrias e o núcleo
    [[36, 112], [64, 136], [176, 110], [204, 138], [236, 116], [264, 140], [372, 112], [402, 138], [438, 116], [612, 140], [644, 134]].forEach(([x, y], i) =>
        out.push({ pool: 'sub', x, y, rank: hash(i + 40) }));
    // intermiofibrilar: acima e abaixo do retículo, na altura da banda I
    GAPS.forEach(([y0, y1], g) => ZS.slice(1).forEach((z, k) => [-60, -34, 30, 58].forEach((dx, j) => {
        const n = g * 100 + k * 10 + j;
        if (hash(n) < 0.25) return;
        const x = z + dx;
        if (x < 14 || x > FIBER_W - 12) return;
        out.push({ pool: 'inter', x, y: j % 2 ? y0 + 8 : y1 - 8, rank: hash(n + 7) });
    })));
    // intramiofibrilar: dentro das miofibrilas, banda I, de um lado da linha Z
    [[0, 1, -24], [0, 3, 22], [1, 1, 26], [1, 2, -22], [1, 4, 0], [2, 2, 24], [2, 3, -26], [0, 2, 0]].forEach(([m, k, dx], i) => {
        const z = ZS[k];
        const x = dx === 0 ? z - 30 : z + dx;
        const [y0, y1] = MF[m];
        out.push({ pool: 'intra', x, y: y0 + 16 + hash(i + 70) * (y1 - y0 - 32), rank: hash(i + 90) });
    });
    return out;
})();

const MF_I = '#283040';
const MF_A = '#4A5469';
const MF_H = '#3B4457';

const Myofibril = ({ y0, y1 }: { y0: number; y1: number }) => (
    <g>
        <rect x={0} y={y0} width={FIBER_W} height={y1 - y0} fill={MF_I} />
        {ZS.map(z => (
            <g key={z}>
                <rect x={z + HALF_I} y={y0} width={L - 2 * HALF_I} height={y1 - y0} fill={MF_A} />
                <rect x={z + 80} y={y0} width={40} height={y1 - y0} fill={MF_H} />
                <rect x={z + 98.5} y={y0} width={3} height={y1 - y0} fill="#7B8496" />
                <rect x={z - 2.5} y={y0} width={5} height={y1 - y0} fill={C.caveat} />
            </g>
        ))}
    </g>
);

const SR = '#64748B';

/** Tríade (cisterna · túbulo T · cisterna) e o retículo longitudinal que liga as cisternas sobre a banda A. */
const Reticulum = ({ cy }: { cy: number }) => (
    <g>
        {ZS.map(z => (
            <g key={z}>
                <rect x={z + HALF_I + 20} y={cy - 4} width={L - 2 * HALF_I - 40} height={8} rx={4} fill={SR} />
                {[z + HALF_I, z + L - HALF_I].map(jx => (
                    <g key={jx}>
                        <rect x={jx - 21} y={cy - 11} width={13} height={22} rx={5} fill={SR} />
                        <rect x={jx + 8} y={cy - 11} width={13} height={22} rx={5} fill={SR} />
                        <circle cx={jx} cy={cy} r={6} fill={C.stone} />
                    </g>
                ))}
                <ellipse cx={z} cy={cy} rx={20} ry={13} fill="#3F6B5C" stroke="#7FB8A3" strokeWidth={2} />
            </g>
        ))}
    </g>
);

const Mito = ({ cx, cy, rx }: { cx: number; cy: number; rx: number }) => (
    <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={15} fill="#3F6B5C" stroke="#7FB8A3" strokeWidth={2} />
        {[-0.5, 0, 0.5].map(f => <line key={f} x1={cx + f * rx} y1={cy - 9} x2={cx + f * rx} y2={cy + 9} stroke="#7FB8A3" strokeWidth={2} />)}
    </g>
);

/** Trilha de escala no alto: quatro lentes, da coxa ao grânulo. */
const LENSES = [
    { x: 30, name: 'coxa', unit: 'centímetros' },
    { x: 200, name: 'fibra', unit: 'micrômetros' },
    { x: 370, name: 'sarcômero', unit: 'micrômetros' },
    { x: 530, name: 'grânulo', unit: '10–45 nm' },
] as const;

const LensIcon = ({ i, x }: { i: number; x: number }) => {
    const y = 34;
    if (i === 0) return <path d={`M ${x - 9} ${y - 16} C ${x - 14} ${y}, ${x - 8} ${y + 12}, ${x - 4} ${y + 16} L ${x + 6} ${y + 16} C ${x + 4} ${y + 4}, ${x + 12} ${y - 6}, ${x + 9} ${y - 16} Z`} fill={C.caveat} />;
    if (i === 1) return <g>{[[-7, -6], [7, -6], [0, 6], [-9, 8], [9, 8]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={y + dy} r={6} fill={MF_A} stroke={C.caveat} strokeWidth={2} />)}</g>;
    if (i === 2) return <g><rect x={x - 16} y={y - 10} width={32} height={20} fill={MF_I} /><rect x={x - 9} y={y - 10} width={18} height={20} fill={MF_A} /><rect x={x - 17} y={y - 10} width={3} height={20} fill={C.caveat} /><rect x={x + 14} y={y - 10} width={3} height={20} fill={C.caveat} /></g>;
    return <g>{[[0, 0], [-8, -6], [8, -6], [-8, 7], [8, 7], [0, -11], [0, 11]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={y + dy} r={5} fill={C.glycogenSoft} />)}</g>;
};

const Trail = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <g>
        {LENSES.map((l, i) => (
            <motion.g key={l.name} initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: step === 0 || i === 3 ? 1 : 0.75, x: 0 }}
                transition={{ duration: DUR.enter, delay: reduce ? 0 : i * 0.14, ease: EASE_OUT }}>
                <circle cx={l.x} cy={34} r={25} fill="#0B1220" stroke={i === 3 ? C.glycogenSoft : C.co2} strokeWidth={3} />
                <LensIcon i={i} x={l.x} />
                <SvgText x={l.x + 34} y={30} text={l.name} size={17} color="#F9FAFB" weight={700} />
                <SvgText x={l.x + 34} y={51} text={l.unit} size={16} color={i === 3 ? C.glycogenSoft : C.caveat} weight={600} />
                {i < 3 && <path d={`M ${l.x + 128} 34 L ${l.x + 142} 34`} stroke={C.co2} strokeWidth={3} markerEnd="url(#pools-arrow)" />}
            </motion.g>
        ))}
    </g>
);

/** Quanto sobra do endereço no passo (1 = cheio). */
const leftOf = (pool: Pool, step: number): number =>
    step === EXHAUSTED_STEP ? LEFT_AFTER.exhausted[pool] : step >= WATER_STEP ? LEFT_AFTER.water[pool] : 1;

const GranuleView = ({ g, i, step, reduce }: { g: Granule; i: number; step: number; reduce: boolean }) => {
    const focus = POOL_FOCUS[step];
    const full = g.rank < leftOf(g.pool, step);
    const lit = focus === null || focus === g.pool;
    const pop = focus === g.pool;
    return (
        <g>
            <circle cx={g.x} cy={g.y} r={6.5} fill="none" stroke={C.glycogenSoft} strokeWidth={2} strokeDasharray="3 3" opacity={full ? 0 : 0.85} />
            <motion.circle cx={g.x} cy={g.y} r={7} stroke="#04080F" strokeWidth={1.5} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={false}
                animate={{ opacity: full ? (lit ? 1 : 0.6) : 0, scale: full ? (pop && !reduce ? [1, 1.45, 1] : 1) : 0.3, fill: lit ? C.glycogenSoft : C.glycogen }}
                transition={{ duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : Math.min((i % 12) * 0.05, 0.5), ease: EASE_OUT }} />
        </g>
    );
};

/** Número do endereço na margem esquerda; acende no passo do endereço e fica. */
const BADGES: readonly { pool: Pool; y: number; at: number }[] = [
    { pool: 'sub', y: 123, at: 1 }, { pool: 'inter', y: 237, at: 2 }, { pool: 'intra', y: 294, at: 3 },
];

const Badge = ({ y, n, shown, current }: { y: number; n: number; shown: boolean; current: boolean }) => (
    <motion.g initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: DUR.enter }}>
        <circle cx={16} cy={y} r={14} fill={current ? C.glycogenSoft : '#0B1220'} stroke={C.glycogenSoft} strokeWidth={3} />
        <text x={16} y={y + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill={current ? '#04080F' : '#FFFFFF'} style={{ fontFamily: 'var(--font-body)' }}>{n}</text>
    </motion.g>
);

export const PoolsFiber = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${FIBER_W} ${FIBER_H}`} width={FIBER_W} height={FIBER_H} className="block" role="img"
            aria-label="Corte longitudinal de fibra muscular: sarcolema, miofibrilas com sarcômeros, tríades, retículo, mitocôndrias e glicogênio em três endereços">
            <defs>
                <marker id="pools-arrow" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill={C.co2} />
                </marker>
                <clipPath id="pools-clip"><rect x={0} y={80} width={FIBER_W} height={FIBER_H - 80} /></clipPath>
            </defs>
            <Trail step={step} reduce={reduce} />
            <motion.g clipPath="url(#pools-clip)" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.morph }}>
                <rect x={0} y={SUB[0]} width={FIBER_W} height={FIBER_H - SUB[0]} fill="#141B28" />
                {MF.map(([a, b]) => <Myofibril key={a} y0={a} y1={b} />)}
                {GAPS.map(([a, b]) => <Reticulum key={a} cy={(a + b) / 2} />)}
                <rect x={0} y={86} width={FIBER_W} height={10} fill={C.stone} />
                <rect x={81} y={92} width={8} height={138} fill={C.stone} />
                <Mito cx={124} cy={123} rx={36} />
                <Mito cx={320} cy={123} rx={36} />
                <ellipse cx={530} cy={123} rx={62} ry={20} fill="#2E3A55" stroke={C.insulinSoft} strokeWidth={2.5} />
                <SvgText x={530} y={129} text="núcleo" size={16} anchor="middle" color={C.insulinSoft} weight={700} />
                <SvgText x={FIBER_W - 8} y={116} text="sarcolema ↑" size={16} anchor="end" color={C.stone} weight={700} />
                <SvgText x={96} y={174} text="túbulo T" size={16} color={C.stone} weight={700} />
                <SvgText x={320} y={104} text="mitocôndria" size={16} anchor="middle" color="#9FD3BF" weight={700} />
                <SvgText x={385} y={231} text="retículo (RS)" size={16} anchor="middle" color="#CBD5E1" weight={700} />
                <SvgText x={285} y={318} text="tríade ↓" size={16} anchor="middle" color={C.stone} weight={700} />
                <SvgText x={634} y={186} text="linha Z →" size={16} anchor="end" color="#FFFFFF" weight={700} />
                <SvgText x={140} y={428} text="banda A" size={16} anchor="middle" color="#FFFFFF" weight={700} />
                <SvgText x={240} y={428} text="banda I" size={16} anchor="middle" color="#FFFFFF" weight={700} />
                {GRANULES.map((g, i) => <GranuleView key={i} g={g} i={i} step={step} reduce={reduce} />)}
                {BADGES.map((b, i) => <Badge key={b.pool} y={b.y} n={i + 1} shown={step >= b.at} current={step === b.at} />)}
            </motion.g>
        </svg>
    );
};
