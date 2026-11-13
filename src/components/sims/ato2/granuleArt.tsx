import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HEX } from './geometry';
import { MAX_TIERS, TIER_PCT } from './granule.content';

/**
 * Palco do slide 22 (viewBox 640 × 448): a cadeia de construção em 4 quadros numerados, um por passo, lidos em Z:
 * 1 glicogenina (o primer) → 2 ramos (cadeias que dobram, centro ampliado) → 3 camadas (o grânulo inteiro, até 12)
 * → 4 a casca (glicose por camada, com eixo: a camada 12 guarda metade). Antes do passo, só a moldura tracejada com o
 * título, para o aluno ver o caminho inteiro. Nada some; a quebra (fosforilase) fica para "Síntese não é Quebra ao Contrário".
 */
export const GR_W = 640;
export const GR_H = 448;

const QW = 314;
const QH = 218;
const Q_POS = [[0, 0], [326, 0], [0, 230], [326, 230]] as const;
const DARK = '#04080F';

/** Quadro numerado: moldura (sólida quando ativo, tracejada antes), número e título; o desenho entra no passo dele. */
const Quad = ({ n, title, show, born, children }: { n: number; title: string; show: boolean; born: boolean; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    const [x, y] = Q_POS[n - 1];
    return (
        <g transform={`translate(${x} ${y})`}>
            <rect x={1} y={1} width={QW - 2} height={QH - 2} rx={12} fill="none" strokeWidth={2}
                stroke={show ? '#475569' : '#334155'} strokeDasharray={show ? undefined : '8 7'} />
            <circle cx={22} cy={22} r={12} fill={show ? '#F3F4F6' : '#334155'} />
            <text x={22} y={27} textAnchor="middle" fontSize={15} fontWeight={800} fill={show ? DARK : '#94A3B8'}
                style={{ fontFamily: 'var(--font-body)' }}>{n}</text>
            <SvgText x={42} y={28} text={title} size={17} weight={800} color={show ? '#FFFFFF' : '#94A3B8'} />
            {show && (
                <motion.g initial={born && !reduce ? { opacity: 0 } : false} animate={{ opacity: 1 }}
                    transition={{ duration: DUR.enter, delay: born ? 0.15 : 0, ease: EASE_OUT }}>
                    {children}
                </motion.g>
            )}
        </g>
    );
};

const Bead = ({ x, y, color = C.glucose }: { x: number; y: number; color?: string }) => (
    <polygon points={HEX} fill={color} transform={`translate(${x} ${y}) scale(0.4)`} />
);

/* ---------- 1 · glicogenina ---------- */
const Primer = ({ born }: { born: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            <SvgText x={166} y={74} text="10–20 glicoses (α-1,4)" size={16} anchor="middle" color="#E5E7EB" />
            <rect x={14} y={92} width={36} height={36} rx={8} fill={C.protein} />
            <SvgText x={32} y={150} text="Tyr" size={16} anchor="middle" color={C.proteinSoft} weight={700} />
            <line x1={50} y1={110} x2={66} y2={110} stroke="#E5E7EB" strokeWidth={3} />
            {Array.from({ length: 10 }, (_, i) => (
                <motion.g key={i} initial={born && !reduce ? { opacity: 0 } : false} animate={{ opacity: 1 }}
                    transition={{ duration: DUR.enter, delay: born ? 0.3 + i * 0.06 : 0 }}>
                    <Bead x={78 + i * 22} y={110} />
                </motion.g>
            ))}
            <SvgText x={14} y={182} text="a proteína prende a 1ª glicose" size={16} color="#E5E7EB" />
            <SvgText x={14} y={204} text="doador: UDP-glicose" size={16} color={C.caveat} />
        </g>
    );
};

/* ---------- 2 · ramos (centro ampliado, camadas 1–4) ---------- */
const D_Y0 = 112;
const D_X0 = 44;
const LEN = 66;
const OFFSET = [36, 18, 9] as const;

interface Chain { id: string; tier: number; d: string; bx: readonly number[]; y: number }

const buildChains = (): Chain[] => {
    const out: Chain[] = [];
    const grow = (id: string, tier: number, x0: number, y: number, d: string) => {
        const bx = [x0 + 22, x0 + 44];
        out.push({ id, tier, d, bx: tier < 4 ? bx : [], y });
        if (tier >= 4) return;
        const off = OFFSET[tier - 1];
        [[bx[0], y - off], [bx[1], y + off]].forEach(([cx, cy], i) =>
            grow(`${id}${i}`, tier + 1, cx, cy, `M ${cx} ${y} L ${cx} ${cy} L ${cx + LEN} ${cy}`));
    };
    grow('c', 1, D_X0, D_Y0, `M ${D_X0} ${D_Y0} L ${D_X0 + LEN} ${D_Y0}`);
    return out;
};
const CHAINS = buildChains();

const Branches = ({ born }: { born: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const t = (tier: number) => (born && !reduce ? 0.2 + (tier - 1) * 0.22 : 0);
    return (
        <g>
            {CHAINS.map(c => (
                <motion.path key={c.id} d={c.d} fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" stroke={C.glycogen}
                    initial={born && !reduce ? { pathLength: 0 } : false} animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : DUR.bar, delay: t(c.tier), ease: EASE_OUT }} />
            ))}
            {CHAINS.flatMap(c => c.bx.map(x => ({ key: `${c.id}-${x}`, x, y: c.y }))).map(p => (
                <circle key={p.key} cx={p.x} cy={p.y} r={4} fill={C.stone} />
            ))}
            <rect x={14} y={D_Y0 - 13} width={26} height={26} rx={6} fill={C.protein} />
            <circle cx={244} cy={64} r={4} fill={C.stone} />
            <SvgText x={254} y={70} text="= ramo" size={16} color={C.stone} weight={700} />
            <SvgText x={254} y={90} text="α-1,6" size={16} color={C.stone} weight={700} />
            <SvgText x={14} y={204} text="cadeias por camada: 1 → 2 → 4 → 8" size={16} color="#E5E7EB" />
        </g>
    );
};

/* ---------- 3 · camadas (grânulo inteiro) ---------- */
const RC = { x: 96, y: 128 };
const ringR = (k: number) => 9 + 6.6 * k;

const Rings = ({ born, shell }: { born: boolean; shell: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            {Array.from({ length: MAX_TIERS }, (_, k) => {
                const outer = shell && k === MAX_TIERS - 1;
                return (
                    <motion.circle key={k} cx={RC.x} cy={RC.y} r={ringR(k)} fill="none"
                        stroke={outer ? C.glucose : C.glycogen} strokeWidth={outer ? 5.5 : 4.5}
                        initial={born && !reduce ? { opacity: 0 } : false} animate={{ opacity: outer ? 1 : k % 2 ? 1 : 0.7 }}
                        transition={{ duration: DUR.enter, delay: born && !reduce ? 0.15 + k * 0.05 : 0 }} />
                );
            })}
            <rect x={RC.x - 6} y={RC.y - 6} width={12} height={12} rx={3} fill={C.protein} />
            <SvgText x={196} y={84} text="12 camadas" size={18} color={C.glycogenSoft} weight={800} />
            <SvgText x={196} y={116} text="~55.000" size={18} color="#F9FAFB" weight={800} />
            <SvgText x={196} y={136} text="glicoses" size={16} color="#E5E7EB" />
            <SvgText x={196} y={168} text="~44 nm" size={18} color="#F9FAFB" weight={800} />
            <SvgText x={196} y={204} text="teto teórico" size={16} color={C.caveat} />
        </g>
    );
};

/* ---------- 4 · a casca (glicose por camada, com eixo) ---------- */
const H_X0 = 56;
const H_X1 = 300;
const H_Y0 = 182;
const H_PX = 2.2; // px por ponto percentual (50% = 110 px)
const hy = (pct: number) => H_Y0 - pct * H_PX;
const BAND = (H_X1 - H_X0) / MAX_TIERS;
const bx = (k: number) => H_X0 + BAND * k + BAND / 2;

const Shell = ({ born }: { born: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            <SvgText x={14} y={56} text="% da glicose do grânulo" size={16} color={C.caveat} />
            {[0, 25, 50].map(v => (
                <g key={v}>
                    <line x1={H_X0} y1={hy(v)} x2={H_X1} y2={hy(v)} stroke={v === 0 ? '#94A3B8' : '#334155'} strokeWidth={2} />
                    <SvgText x={H_X0 - 8} y={hy(v) + 6} text={String(v)} size={16} anchor="end" color="#D1D5DB" />
                </g>
            ))}
            {TIER_PCT.map((v, k) => {
                const outer = k === MAX_TIERS - 1;
                const h = Math.max(v * H_PX, 2);
                return (
                    <motion.rect key={k} x={bx(k) - 7} y={H_Y0 - h} width={14} height={h} rx={2} fill={outer ? C.glucose : C.glycogen}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
                        initial={born && !reduce ? { scaleY: 0 } : false} animate={{ scaleY: 1 }}
                        transition={{ duration: reduce ? 0 : DUR.bar, delay: born ? stagger(k, 0.25, 0.04) : 0, ease: EASE_OUT }} />
                );
            })}
            <motion.g initial={born && !reduce ? { opacity: 0 } : false} animate={{ opacity: 1 }}
                transition={{ duration: DUR.enter, delay: born ? 1 : 0 }}>
                <SvgText x={bx(MAX_TIERS - 1) - 14} y={hy(50) + 22} text="50%" size={20} anchor="end" color={C.glucoseSoft} weight={800} />
            </motion.g>
            <SvgText x={bx(0)} y={H_Y0 + 20} text="1" size={16} anchor="middle" color="#D1D5DB" />
            <SvgText x={bx(MAX_TIERS - 1)} y={H_Y0 + 20} text="12" size={16} anchor="middle" color="#D1D5DB" />
            <SvgText x={(H_X0 + H_X1) / 2} y={H_Y0 + 20} text="camada (centro → casca)" size={16} anchor="middle" color={C.caveat} />
        </g>
    );
};

export const GranuleStage = ({ step }: { step: number }) => (
    <svg viewBox={`0 0 ${GR_W} ${GR_H}`} width={GR_W} height={GR_H} className="block" role="img"
        aria-label="Glicogênio em quatro quadros: glicogenina, ramos que dobram, até 12 camadas, a camada externa com metade da glicose">
        <Quad n={1} title="Glicogenina: o primer" show={step >= 0} born={step === 0}><Primer born={step === 0} /></Quad>
        <Quad n={2} title="Ramos: as cadeias dobram" show={step >= 1} born={step === 1}><Branches born={step === 1} /></Quad>
        <Quad n={3} title="Camadas: até 12" show={step >= 2} born={step === 2}><Rings born={step === 2} shell={step >= 3} /></Quad>
        <Quad n={4} title="Casca: metade da glicose" show={step >= 3} born={step === 3}><Shell born={step === 3} /></Quad>
    </svg>
);
