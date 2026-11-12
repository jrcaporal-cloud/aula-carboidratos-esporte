import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape, type SugarKind } from './shapes';

/**
 * Slide 25 · o corte do intestino que se monta e não apaga (viewBox 680 × 420, px de palco).
 * Esquerda: luz do intestino (amido, amilase, borda em escova). Meio: o enterócito (SGLT1, GLUT5, KHK,
 * Na⁺/K⁺-ATPase, GLUT2). Direita: veia porta e fígado. Cada peça entra no passo dela e fica;
 * a cada clique uma molécula percorre UMA vez o trecho novo (≤ 1,2 s).
 */
export const SCENE_W = 680;
export const SCENE_H = 420;

const AP = 330; // membrana apical
const BL = 512; // membrana basolateral
const TOP = 44, BOTTOM = 408;
const Y_SGLT = 274, Y_GLUT5 = 352, Y_PUMP = 104, Y_GLUT2 = 262;
const VEIN_X = 604;
const INK = '#E5E7EB';
const TRAVEL = 1.1;

type Pt = readonly [number, number];

const Piece = ({ k, x, y, s = 0.5 }: { k: SugarKind; x: number; y: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}><SugarShape kind={k} /></g>
);

/** Cadeia de unidades ligadas por traço (amido, maltose, dextrina). */
const Chain = ({ pts, kinds }: { pts: readonly Pt[]; kinds: readonly SugarKind[] }) => (
    <g>
        {pts.slice(1).map((p, i) => <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} stroke={INK} strokeWidth={3} />)}
        {pts.map((p, i) => <Piece key={i} k={kinds[i] ?? 'glc'} x={p[0]} y={p[1]} />)}
    </g>
);

/** Grupo que entra no passo `at` (depois da molécula começar a andar) e fica. */
const At = ({ at, step, delay = 0.3, children }: { at: number; step: number; delay?: number; children: ReactNode }) => (
    <motion.g initial={false} animate={{ opacity: step >= at ? 1 : 0 }}
        transition={{ duration: DUR.enter, delay: step === at ? delay : 0, ease: EASE_OUT }}>
        {children}
    </motion.g>
);

/** Transportador encaixado na membrana (bloco chapado de 30 × 44). */
const Carrier = ({ x, y, color }: { x: number; y: number; color: string }) => (
    <rect x={x - 15} y={y - 22} width={30} height={44} rx={8} fill={color} stroke="#04080F" strokeWidth={2} />
);

const Arrow = ({ d, color, id }: { d: string; color: string; id: string }) => (
    <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" markerEnd={`url(#dg-${id})`} />
);

/** Anatomia fixa: as três regiões, as duas membranas e as microvilosidades. */
const Anatomy = () => (
    <g>
        <rect x={AP} y={TOP} width={BL - AP} height={BOTTOM - TOP} rx={10} fill={`${C.co2}1F`} />
        {Array.from({ length: 15 }, (_, i) => TOP + 10 + i * 24)
            .filter(y => Math.abs(y - Y_SGLT) > 30 && Math.abs(y - Y_GLUT5) > 30)
            .map(y => <rect key={y} x={AP - 30} y={y - 6} width={32} height={12} rx={6} fill="#475569" />)}
        <rect x={AP - 4} y={TOP} width={8} height={BOTTOM - TOP} rx={4} fill={C.co2} />
        <rect x={BL - 4} y={TOP} width={8} height={BOTTOM - TOP} rx={4} fill={C.co2} />
        <SvgText x={14} y={26} text="LUZ DO INTESTINO" size={16} color={C.muted} weight={700} />
        <SvgText x={(AP + BL) / 2} y={26} text="ENTERÓCITO" size={16} color={C.muted} weight={700} anchor="middle" />
        <SvgText x={VEIN_X} y={26} text="SANGUE" size={16} color={C.muted} weight={700} anchor="middle" />
    </g>
);

/** Passo 1: amido → α-amilase → maltose e dextrina ramificada. */
const Starch = ({ step }: { step: number }) => (
    <At at={0} step={step} delay={0}>
        <SvgText x={14} y={56} text="amido" size={16} color={INK} />
        <Chain pts={[[24, 82], [50, 82], [76, 82], [102, 82], [128, 82], [154, 82]]} kinds={[]} />
        <Chain pts={[[76, 82], [76, 112], [102, 112]]} kinds={[]} />
        <SvgText x={86} y={140} text="ramo α-1,6" size={16} color={C.caveat} />
        <Arrow d="M 172 96 L 198 96" color={C.glucose} id="glc" />
        <SvgText x={164} y={56} text="α-amilase" size={16} color={C.stone} weight={700} />
        <Chain pts={[[222, 80], [248, 80]]} kinds={[]} />
        <SvgText x={262} y={86} text="maltose" size={16} color={INK} />
        <Chain pts={[[222, 118], [248, 118], [222, 144]]} kinds={[]} />
        <SvgText x={262} y={124} text="dextrina" size={16} color={INK} />
    </At>
);

/** Passo 2: enzimas presas na borda em escova. */
const Brush = ({ step }: { step: number }) => (
    <At at={1} step={step}>
        <Chain pts={[[24, 196], [50, 196]]} kinds={['glc', 'fru']} />
        <SvgText x={64} y={202} text="sacarose" size={16} color={INK} />
        <SvgText x={292} y={180} text="maltase-glicoamilase" size={16} color={C.stone} weight={700} anchor="end" />
        <SvgText x={292} y={204} text="sacarase-isomaltase" size={16} color={C.stone} weight={700} anchor="end" />
        <SvgText x={292} y={228} text="presas nas microvilosidades" size={16} color={C.caveat} anchor="end" />
    </At>
);

/** Passo 3: SGLT1 com Na⁺ e a bomba de Na⁺/K⁺ que sustenta o gradiente. */
const Sglt1 = ({ step }: { step: number }) => (
    <At at={2} step={step}>
        <SvgText x={14} y={Y_SGLT - 22} text="glicose e galactose livres" size={16} color={INK} />
        {[24, 52, 80, 108].map((x, i) => <Piece key={x} k={i % 2 ? 'gal' : 'glc'} x={x} y={Y_SGLT + 8} />)}
        {[150, 196, 242].map(x => <circle key={x} cx={x} cy={Y_SGLT + 8} r={11} fill={C.stone} />)}
        <SvgText x={196} y={Y_SGLT + 42} text="Na⁺" size={16} color={C.stone} anchor="middle" />
        <Piece k="glc" x={286} y={Y_SGLT - 10} />
        <Piece k="gal" x={286} y={Y_SGLT + 22} />
        <Carrier x={AP} y={Y_SGLT} color={C.glucose} />
        <SvgText x={AP + 24} y={Y_SGLT - 4} text="SGLT1" size={18} color={C.glucoseSoft} weight={800} />
        <SvgText x={AP + 24} y={Y_SGLT + 18} text="glicose ou galactose" size={16} color={INK} />
        <SvgText x={AP + 24} y={Y_SGLT + 38} text="+ Na⁺" size={16} color={INK} />
        <SvgText x={AP + 18} y={184} text="Na⁺ baixo aqui" size={16} color={C.stone} />
        <Carrier x={BL} y={Y_PUMP} color={C.co2} />
        <SvgText x={BL - 22} y={Y_PUMP - 18} text="Na⁺/K⁺-ATPase" size={16} color={C.caveat} weight={700} anchor="end" />
        <SvgText x={BL - 22} y={Y_PUMP + 6} text="ATP → ADP" size={16} color={C.glucoseSoft} weight={700} anchor="end" />
        <Arrow d={`M ${BL + 20} ${Y_PUMP - 10} L ${BL + 52} ${Y_PUMP - 10}`} color={C.stone} id="na" />
        <SvgText x={BL + 60} y={Y_PUMP - 4} text="Na⁺ sai" size={16} color={C.stone} />
        <Arrow d={`M ${BL + 52} ${Y_PUMP + 16} L ${BL + 20} ${Y_PUMP + 16}`} color={C.co2} id="k" />
        <SvgText x={BL + 60} y={Y_PUMP + 22} text="K⁺ entra" size={16} color={C.caveat} />
    </At>
);

/** Passo 4: GLUT5 e a KHK, que já fosforila parte da frutose no enterócito. */
const Glut5 = ({ step }: { step: number }) => (
    <At at={3} step={step}>
        <SvgText x={14} y={Y_GLUT5 - 22} text="frutose livre" size={16} color={INK} />
        {[24, 54, 84, 114].map(x => <Piece key={x} k="fru" x={x} y={Y_GLUT5 + 6} />)}
        <SvgText x={14} y={Y_GLUT5 + 46} text="sem gasto de Na⁺: difusão facilitada" size={16} color={C.caveat} />
        <Piece k="fru" x={286} y={Y_GLUT5} />
        <Carrier x={AP} y={Y_GLUT5} color={C.fructose} />
        <SvgText x={AP + 24} y={Y_GLUT5 - 4} text="GLUT5" size={18} color={C.fructoseSoft} weight={800} />
        <SvgText x={AP + 24} y={Y_GLUT5 + 18} text="frutose, sem Na⁺" size={16} color={INK} />
        <rect x={AP + 18} y={Y_GLUT5 + 30} width={150} height={26} rx={13} fill={`${C.fructose}33`} stroke={C.fructose} strokeWidth={2} />
        <SvgText x={AP + 93} y={Y_GLUT5 + 49} text="KHK → frutose-1-P" size={16} color="#F9FAFB" anchor="middle" />
    </At>
);

/** Passo 5: GLUT2 basolateral, veia porta e fígado. */
const Exit = ({ step }: { step: number }) => (
    <At at={4} step={step}>
        <Carrier x={BL} y={Y_GLUT2} color={C.stone} />
        <SvgText x={BL - 22} y={Y_GLUT2 - 30} text="GLUT2" size={18} color={C.stone} weight={800} anchor="end" />
        <SvgText x={BL - 22} y={Y_GLUT2 - 10} text="as três saem" size={16} color={INK} anchor="end" />
        <rect x={VEIN_X - 20} y={186} width={40} height={160} rx={20} fill="#1E293B" stroke={C.co2} strokeWidth={3} />
        <SvgText x={VEIN_X} y={176} text="veia porta" size={16} color={INK} anchor="middle" />
        <Arrow d={`M ${BL + 20} ${Y_GLUT2} L ${VEIN_X - 26} ${Y_GLUT2}`} color={C.stone} id="out" />
        <Piece k="glc" x={VEIN_X} y={214} s={0.42} />
        <Piece k="gal" x={VEIN_X} y={244} s={0.42} />
        <Piece k="fru" x={VEIN_X} y={300} s={0.42} />
        <path d={`M ${VEIN_X - 66} 372 C ${VEIN_X - 66} 350 ${VEIN_X - 20} 344 ${VEIN_X + 20} 346 C ${VEIN_X + 60} 348 ${VEIN_X + 70} 362 ${VEIN_X + 62} 382 C ${VEIN_X + 54} 400 ${VEIN_X - 10} 408 ${VEIN_X - 40} 402 C ${VEIN_X - 60} 398 ${VEIN_X - 66} 388 ${VEIN_X - 66} 372 Z`} fill={C.glycogen} />
        <SvgText x={VEIN_X} y={382} text="fígado" size={18} color="#F9FAFB" anchor="middle" weight={700} />
    </At>
);

/** Trajetos da molécula em cada clique. */
const TRAVELS: readonly (readonly { k: SugarKind; pts: readonly Pt[] }[])[] = [
    [{ k: 'glc', pts: [[154, 82], [190, 90], [222, 70]] }, { k: 'glc', pts: [[102, 112], [190, 100], [222, 112]] }],
    [{ k: 'glc', pts: [[24, 196], [160, 186], [296, 192]] }, { k: 'fru', pts: [[50, 196], [180, 214], [296, 214]] }],
    [{ k: 'glc', pts: [[286, Y_SGLT - 10], [AP, Y_SGLT], [AP + 70, Y_SGLT - 50], [AP + 110, 220]] }],
    [{ k: 'fru', pts: [[286, Y_GLUT5], [AP, Y_GLUT5], [AP + 40, Y_GLUT5 + 30], [AP + 70, Y_GLUT5 + 42]] }],
    [
        { k: 'glc', pts: [[AP + 110, 220], [BL, Y_GLUT2], [VEIN_X, Y_GLUT2], [VEIN_X, 340]] },
        { k: 'fru', pts: [[AP + 90, 320], [BL, Y_GLUT2], [VEIN_X, Y_GLUT2 + 6], [VEIN_X, 344]] },
    ],
];

const Token = ({ k, pts }: { k: SugarKind; pts: readonly Pt[] }) => (
    <motion.g initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
        animate={{ x: pts.map(p => p[0]), y: pts.map(p => p[1]), opacity: [0, 1, 1, 0] }}
        transition={{ duration: TRAVEL, ease: EASE_IN_OUT, times: pts.map((_, i) => i / (pts.length - 1)),
            opacity: { duration: TRAVEL, times: [0, 0.12, 0.85, 1] } }}>
        <g transform="scale(0.55)"><SugarShape kind={k} /></g>
    </motion.g>
);

const Heads = () => (
    <defs>
        {[['glc', C.glucose], ['na', C.stone], ['k', C.co2], ['out', C.stone]].map(([id, color]) => (
            <marker key={id} id={`dg-${id}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
            </marker>
        ))}
    </defs>
);

export const DigestionScene = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width={SCENE_W} height={SCENE_H} className="block" role="img"
            aria-label="Corte do intestino: amilase e enzimas da borda em escova na luz, SGLT1, GLUT5, KHK, Na⁺/K⁺-ATPase e GLUT2 no enterócito, veia porta e fígado">
            <Heads />
            <Anatomy />
            <Starch step={step} />
            <Brush step={step} />
            <Sglt1 step={step} />
            <Glut5 step={step} />
            <Exit step={step} />
            {!reduce && <g key={`travel-${step}`}>{TRAVELS[step].map((t, i) => <Token key={i} {...t} />)}</g>}
        </svg>
    );
};
