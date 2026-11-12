import { motion } from 'framer-motion';
import { DUR } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useMorphPath, type Pt } from '../kit/useMorphPath';
import { GLUCOSE, MIX, MIX_CURVE, interp, type OxPoint } from './oxidation.content';

/**
 * Oxidação exógena (g/min) × ingestão (g/h), compartilhado pelos slides 103 (o teto) e 104 (a mistura).
 * A diagonal é "tudo o que entra é oxidado" (g/h ÷ 60). A curva principal se transforma (useMorphPath)
 * da glicose para a mistura glicose + frutose.
 */

const GH_MAX = 150;
const OX_MAX = 2.5;
const SAMPLES = 31;

export interface OxidationChartProps {
    width: number;
    height: number;
    /** Qual curva desenhar (a troca anima). */
    curve: 'none' | 'glucose' | 'mix';
    /** Mostra a curva da glicose apagada por trás (para comparar com a mistura). */
    ghostGlucose?: boolean;
    showCeiling?: boolean;
    /** Área entre a diagonal e a curva: o que entrou e não foi oxidado. */
    showGap?: boolean;
    /** Destaca a região de ~48 g/h (dose moderada). */
    focusLow?: boolean;
}

export const OxidationChart = ({ width, height, curve, ghostGlucose = false, showCeiling = false, showGap = false, focusLow = false }: OxidationChartProps) => {
    const pad = { l: 64, r: 24, t: 20, b: 54 };
    const sx = (gh: number) => pad.l + (gh / GH_MAX) * (width - pad.l - pad.r);
    const sy = (ox: number) => height - pad.b - (Math.min(ox, OX_MAX) / OX_MAX) * (height - pad.t - pad.b);
    const along = (pts: readonly OxPoint[] | null): Pt[] =>
        Array.from({ length: SAMPLES }, (_, i) => {
            const gh = (144 * i) / (SAMPLES - 1);
            return [sx(gh), sy(pts ? interp(pts, gh) : 0)];
        });
    const target = curve === 'mix' ? MIX_CURVE : curve === 'glucose' ? GLUCOSE : null;
    const pathRef = useMorphPath(along(target), 750);
    const glucosePath = along(GLUCOSE).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const identityEnd = OX_MAX * 60;
    const gapPoly = [...Array.from({ length: SAMPLES }, (_, i) => (144 * i) / (SAMPLES - 1)).map(gh => `${sx(gh)},${sy(gh / 60)}`),
        ...Array.from({ length: SAMPLES }, (_, i) => 144 - (144 * i) / (SAMPLES - 1)).map(gh => `${sx(gh)},${sy(interp(GLUCOSE, gh))}`)].join(' ');
    const points = curve === 'mix' ? MIX : curve === 'glucose' ? GLUCOSE : [];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Oxidação exógena por ingestão de carboidrato">
            {/* eixos */}
            <line x1={pad.l} x2={width - pad.r} y1={sy(0)} y2={sy(0)} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            <line x1={pad.l} x2={pad.l} y1={sy(0)} y2={pad.t} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            {[0, 0.5, 1, 1.5, 2, 2.5].map(v => (
                <SvgText key={v} x={pad.l - 12} y={sy(v) + 6} text={String(v).replace('.', ',')} anchor="end" size={16} color={C.muted} weight={500} />
            ))}
            {[0, 30, 60, 90, 120, 150].map(v => (
                <SvgText key={v} x={sx(v)} y={sy(0) + 26} text={String(v)} anchor="middle" size={16} color={C.muted} weight={500} />
            ))}
            <SvgText x={(pad.l + width - pad.r) / 2} y={height - 4} text="ingestão (g/h)" anchor="middle" size={17} color="#CBD5E1" weight={500} />
            <SvgText x={pad.l + 10} y={pad.t + 12} text="oxidação exógena (g/min)" size={17} color="#CBD5E1" weight={500} />

            {/* foco na dose moderada */}
            <motion.rect x={sx(36)} y={pad.t} width={sx(60) - sx(36)} height={sy(0) - pad.t} rx={6} fill={C.co2}
                initial={false} animate={{ opacity: focusLow ? 0.18 : 0 }} transition={{ duration: DUR.enter }} />
            {/* teto */}
            <motion.rect x={pad.l} y={sy(1.1)} width={width - pad.l - pad.r} height={sy(1.0) - sy(1.1)} fill={C.glucose}
                initial={false} animate={{ opacity: showCeiling ? 0.22 : 0 }} transition={{ duration: DUR.enter }} />
            {showCeiling && <SvgText x={pad.l + 14} y={sy(1.1) - 10} text="teto ~1,0–1,1" size={18} color={C.glucoseSoft} />}
            {/* o que entrou e não foi oxidado */}
            <motion.polygon points={gapPoly} fill={C.risk} initial={false} animate={{ opacity: showGap ? 0.22 : 0 }} transition={{ duration: DUR.enter }} />
            {showGap && <SvgText x={sx(128)} y={sy(1.62)} text="entrou, não oxidou" anchor="middle" size={18} color="#FDA4AF" />}

            {/* diagonal: ingerido = oxidado */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(identityEnd)} y2={sy(OX_MAX)} stroke="#E5E7EB" strokeWidth={2.5} strokeDasharray="8 8" />
            <SvgText x={sx(66) - 10} y={sy(66 / 60) - 12} text="tudo oxidado" anchor="end" size={16} color="#E5E7EB" />

            {ghostGlucose && <path d={glucosePath} fill="none" stroke={C.glucose} strokeWidth={4} opacity={0.4} />}
            <path ref={pathRef} fill="none" stroke={curve === 'mix' ? C.fructose : C.glucose} strokeWidth={5} strokeLinejoin="round"
                style={{ opacity: curve === 'none' ? 0 : 1, transition: 'opacity 300ms, stroke 300ms' }} />
            {points.map(p => (
                <motion.g key={`${curve}-${p.gh}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: DUR.text }}>
                    <circle cx={sx(p.gh)} cy={sy(p.ox)} r={8} fill="#04080F" stroke={curve === 'mix' ? C.fructose : C.glucose} strokeWidth={4} />
                    <SvgText x={sx(p.gh) + (p.gh > 120 ? -14 : 12)} y={sy(p.ox) + (p.gh > 120 ? -16 : 26)} anchor={p.gh > 120 ? 'end' : 'start'}
                        text={p.gh > 120 ? p.ox.toFixed(2).replace('.', ',') : `${p.ox.toFixed(2).replace('.', ',')} · ${p.label}`}
                        size={p.gh > 120 ? 22 : 16} color="#F9FAFB" />
                </motion.g>
            ))}
        </svg>
    );
};
