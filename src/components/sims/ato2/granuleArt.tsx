import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HEX } from './geometry';
import { MAX_TIERS } from './granule.content';

/**
 * Palco do slide 22 (viewBox 640 × 456). Em cima, à esquerda, o centro do grânulo ampliado (camadas 1–4,
 * dendrograma: cada cadeia de comprimento igual carrega dois ramos α-1,6); à direita, o grânulo inteiro em
 * 12 anéis. Embaixo, duas lupas: o começo (glicogenina + primer) e a ponta (fosforilase para 4 antes do ramo).
 */
export const GR_W = 640;
export const GR_H = 456;

/* ---------- dendrograma (centro ampliado) ---------- */
const Y0 = 150;
const X0 = 50;
const LEN = 110;
const OFFSET = [64, 32, 16] as const; // afastamento vertical dos filhos de cada camada

interface Chain { id: string; tier: number; d: string; bx: readonly number[]; y: number }

const buildChains = (): Chain[] => {
    const out: Chain[] = [];
    const grow = (id: string, tier: number, x0: number, y: number, d: string) => {
        const bx = [x0 + 40, x0 + 80];
        out.push({ id, tier, d, bx: tier < 4 ? bx : [], y });
        if (tier >= 4) return;
        const off = OFFSET[tier - 1];
        [[bx[0], y - off], [bx[1], y + off]].forEach(([cx, cy], i) =>
            grow(`${id}${i}`, tier + 1, cx, cy, `M ${cx} ${y} L ${cx} ${cy} L ${cx + LEN} ${cy}`));
    };
    grow('c', 1, X0, Y0, `M ${X0} ${Y0} L ${X0 + LEN} ${Y0}`);
    return out;
};
const CHAINS = buildChains();

const Dendrogram = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <g>
        <SvgText x={14} y={24} text="centro ampliado · camadas 1 a 4" size={17} color={C.muted} weight={700} />
        {CHAINS.map(c => {
            const shown = step >= (c.tier === 1 ? 0 : 1);
            const outer = c.tier === 4 && step >= 3;
            return (
                <motion.path key={c.id} d={c.d} fill="none" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
                    stroke={outer ? C.glucose : C.glycogen}
                    initial={false} animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : DUR.bar, delay: shown && step === 1 ? (c.tier - 2) * 0.22 : 0, ease: EASE_OUT }} />
            );
        })}
        {CHAINS.flatMap(c => c.bx.map(x => ({ key: `${c.id}-${x}`, x, y: c.y, tier: c.tier }))).map(p => (
            <motion.circle key={p.key} cx={p.x} cy={p.y} r={5} fill={C.stone} initial={false}
                animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.2 + (p.tier - 1) * 0.22 : 0 }} />
        ))}
        <rect x={20} y={Y0 - 13} width={26} height={26} rx={6} fill={C.protein} />
        <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 1 ? 0.8 : 0 }}>
            <SvgText x={80} y={118} text="α-1,6" size={16} anchor="end" color={C.glycogenSoft} weight={800} />
            <SvgText x={14} y={286} text="cadeias por camada: 1 → 2 → 4 → 8" size={16} color="#E5E7EB" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 3 ? 0.5 : 0 }}>
            <SvgText x={404} y={Y0 + 6} text="pontas" size={16} anchor="end" color={C.glucoseSoft} weight={800} />
        </motion.g>
    </g>
);

/* ---------- grânulo inteiro ---------- */
const RC = { x: 532, y: 128 };
const ringR = (k: number) => 12 + 8.3 * k;

const Rings = ({ step, tiers, reduce }: { step: number; tiers: number; reduce: boolean }) => (
    <g>
        {Array.from({ length: MAX_TIERS }, (_, k) => {
            const on = k < tiers;
            const shell = step === 3 && k === MAX_TIERS - 1;
            const ghost = step === 4 && k >= tiers;
            return (
                <motion.circle key={k} cx={RC.x} cy={RC.y} r={ringR(k)} fill="none"
                    stroke={shell ? C.glucose : C.glycogen} strokeWidth={ghost ? 2 : 6.5} strokeDasharray={ghost ? '5 6' : undefined}
                    initial={false} animate={{ opacity: on ? (k % 2 ? 1 : 0.7) : ghost ? 0.7 : 0 }}
                    transition={{ duration: reduce ? 0 : DUR.enter, delay: on && k > 0 ? Math.min(k * 0.05, 0.5) : 0 }} />
            );
        })}
        <rect x={RC.x - 8} y={RC.y - 8} width={16} height={16} rx={4} fill={C.protein} />
        <SvgText x={RC.x} y={262} text="grânulo inteiro" size={17} anchor="middle" color={C.muted} weight={700} />
        <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 2 ? 0.5 : 0 }}>
            <SvgText x={RC.x} y={286} text="12 camadas · ~44 nm" size={16} anchor="middle" color="#E5E7EB" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 4 ? 0.5 : 0 }}>
            <circle cx={RC.x} cy={RC.y} r={ringR(6) + 5} fill="none" stroke="#F3F4F6" strokeWidth={3} strokeDasharray="9 6" />
            <SvgText x={RC.x} y={RC.y + 6} text="~25 nm" size={18} anchor="middle" color="#F9FAFB" weight={800} />
        </motion.g>
    </g>
);

/* ---------- lupas de baixo ---------- */
const Bead = ({ x, y, color = C.glucose }: { x: number; y: number; color?: string }) => (
    <polygon points={HEX} fill={color} transform={`translate(${x} ${y}) scale(0.4)`} />
);

const Box = ({ x, title, color }: { x: number; title: string; color: string }) => (
    <g>
        <rect x={x} y={298} width={306} height={154} rx={12} fill="none" stroke={C.co2} strokeWidth={2} />
        <SvgText x={x + 12} y={322} text={title} size={17} color={color} weight={800} />
    </g>
);

const Primer = () => (
    <g>
        <Box x={4} title="o começo · glicogenina" color={C.proteinSoft} />
        <rect x={20} y={360} width={34} height={34} rx={8} fill={C.protein} />
        <SvgText x={37} y={418} text="Tyr" size={16} anchor="middle" color={C.proteinSoft} weight={700} />
        <line x1={54} y1={377} x2={70} y2={377} stroke="#E5E7EB" strokeWidth={3} />
        {Array.from({ length: 10 }, (_, i) => <Bead key={i} x={80 + i * 21} y={377} />)}
        <SvgText x={174} y={352} text="10–20 glicoses (α-1,4)" size={16} anchor="middle" color="#E5E7EB" />
        <SvgText x={70} y={424} text="doador: UDP-glicose" size={16} color="#E5E7EB" />
    </g>
);

const A_Y = 368;
const B_Y = 420;
const BX = (i: number) => 346 + i * 21;
const AX = (i: number) => BX(2) + i * 21;

const Tip = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: DUR.enter, delay: step === 3 ? 0.2 : 0 }}>
        <Box x={330} title="a ponta" color={C.glucoseSoft} />
        <SvgText x={628} y={322} text="fosforilase → glicose-1-P" size={16} anchor="end" color={C.glucoseSoft} weight={700} />
        {Array.from({ length: 7 }, (_, i) => <Bead key={`b${i}`} x={BX(i)} y={B_Y} color={C.glycogen} />)}
        <line x1={AX(0)} y1={B_Y - 10} x2={AX(0)} y2={A_Y + 10} stroke={C.glycogenSoft} strokeWidth={4} />
        {Array.from({ length: 4 }, (_, i) => <Bead key={`a${i}`} x={AX(i)} y={A_Y} />)}
        {[4, 5, 6, 7].map(i => (
            <g key={`gone${i}`}>
                <polygon points={HEX} fill="none" stroke={C.glucoseSoft} strokeWidth={4} strokeDasharray="6 5" transform={`translate(${AX(i)} ${A_Y}) scale(0.4)`} />
                {step === 3 && !reduce && (
                    <motion.g initial={{ opacity: 1, x: 0, y: 0 }} animate={{ opacity: 0, x: 18, y: -26 }}
                        transition={{ duration: 0.5, delay: 0.5 + (7 - i) * 0.14, ease: EASE_OUT }}>
                        <Bead x={AX(i)} y={A_Y} />
                    </motion.g>
                )}
            </g>
        ))}
        <SvgText x={AX(0) + 12} y={398} text="para 4 antes do ramo" size={16} color="#E5E7EB" />
        <SvgText x={342} y={446} text="desramificadora → glicose livre" size={16} color="#E5E7EB" />
    </motion.g>
);

export const GranuleStage = ({ step, tiers }: { step: number; tiers: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${GR_W} ${GR_H}`} width={GR_W} height={GR_H} className="block" role="img"
            aria-label="Glicogênio: centro ampliado com cadeias e ramos, grânulo inteiro em camadas, glicogenina e ação da fosforilase">
            <Dendrogram step={step} reduce={reduce} />
            <Rings step={step} tiers={tiers} reduce={reduce} />
            <Primer />
            <Tip step={step} reduce={reduce} />
        </svg>
    );
};
