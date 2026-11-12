import { motion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useMorphPath, type Pt } from '../kit/useMorphPath';
import { GLUCOSE_PTS, MIX_PTS, RATIO_21, type MixPoint } from './mix.content';

/**
 * Oxidação exógena (g/min) × ingestão (g/h) do slide 104, no andar de baixo do palco (não é o OxidationChart do ato).
 * Diagonal = tudo o que entra é oxidado (g/h ÷ 60). A curva principal se transforma da glicose na mistura;
 * a da glicose fica apagada atrás. Curva composta: os pontos vêm de estudos diferentes.
 */

const L = 70;
const R = 630;
const TOP = 202;
const BASE = 408;
const OX_MAX = 2;
const sx = (gh: number) => L + (gh / 150) * (R - L);
const sy = (ox: number) => BASE - (Math.min(ox, OX_MAX) / OX_MAX) * (BASE - TOP);

const interp = (pts: readonly MixPoint[], gh: number): number => {
    const all = [{ gh: 0, ox: 0 }, ...pts];
    for (let i = 1; i < all.length; i++) {
        const a = all[i - 1];
        const b = all[i];
        if (gh <= b.gh) return a.ox + ((b.ox - a.ox) * (gh - a.gh)) / (b.gh - a.gh);
    }
    return all[all.length - 1].ox;
};
const SAMPLES = 37;
const along = (pts: readonly MixPoint[]): Pt[] =>
    Array.from({ length: SAMPLES }, (_, i) => {
        const gh = (144 * i) / (SAMPLES - 1);
        return [sx(gh), sy(interp(pts, gh))];
    });
const GLUCOSE_PATH = along(GLUCOSE_PTS).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

const fade = (on: boolean, delay = 0) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0 },
    transition: { duration: DUR.enter, delay: on ? delay : 0, ease: EASE_OUT },
});

const Dot = ({ p, color, dx = 10, dy = 22, anchor = 'start', big = false }: {
    p: MixPoint; color: string; dx?: number; dy?: number; anchor?: 'start' | 'end' | 'middle'; big?: boolean;
}) => (
    <g>
        <circle cx={sx(p.gh)} cy={sy(p.ox)} r={big ? 9 : 7} fill="#04080F" stroke={color} strokeWidth={4} />
        <SvgText x={sx(p.gh) + dx} y={sy(p.ox) + dy} text={p.label} size={big ? 20 : 16} anchor={anchor} color={big ? '#FFFFFF' : '#E5E7EB'} weight={700} />
    </g>
);

export const MixChart = ({ step }: { step: number }) => {
    const mix = step >= 1;
    const curveRef = useMorphPath(along(mix ? MIX_PTS : GLUCOSE_PTS), 750);
    return (
        <g>
            {/* eixos */}
            <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            <line x1={L} x2={L} y1={BASE} y2={TOP - 6} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            {[0, 0.5, 1, 1.5, 2].map(v => <SvgText key={v} x={L - 10} y={sy(v) + 6} text={String(v).replace('.', ',')} size={16} anchor="end" color={C.muted} weight={500} />)}
            {[0, 30, 60, 90, 120, 150].map(v => <SvgText key={v} x={sx(v)} y={BASE + 22} text={String(v)} size={16} anchor="middle" color={C.muted} weight={500} />)}
            <SvgText x={L + 8} y={TOP + 4} text="oxidação exógena (g/min)" size={16} color="#CBD5E1" weight={600} />
            <SvgText x={R} y={BASE - 10} text="ingestão (g/h)" size={16} anchor="end" color="#CBD5E1" weight={600} />

            {/* faixa da dose moderada e teto de uma fonte */}
            <motion.rect x={sx(38)} y={TOP} width={sx(58) - sx(38)} height={BASE - TOP} rx={6} fill={`${C.stone}2E`} {...fade(step >= 2)} />
            <rect x={L} y={sy(1.1)} width={R - L} height={sy(1.0) - sy(1.1)} fill={`${C.glucose}38`} />
            <SvgText x={sx(3)} y={sy(1.1) - 7} text="teto de uma fonte ~1,0–1,1" size={16} color={C.glucoseSoft} weight={700} />

            {/* diagonal: tudo o que entra é oxidado */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(120)} y2={sy(2)} stroke="#E5E7EB" strokeWidth={2.5} strokeDasharray="8 7" />
            <SvgText x={sx(30) - 10} y={sy(0.5)} text="tudo oxidado" size={16} anchor="end" color="#E5E7EB" weight={600} />

            {/* glicose apagada atrás da mistura */}
            <g opacity={0.45}><motion.path d={GLUCOSE_PATH} fill="none" stroke={C.glucose} strokeWidth={4} {...fade(mix)} /></g>
            <path ref={curveRef} fill="none" stroke={mix ? C.fructose : C.glucose} strokeWidth={5} strokeLinejoin="round" style={{ transition: 'stroke 300ms' }} />

            {GLUCOSE_PTS.map((p, i) => (
                <Dot key={p.gh} p={p} color={C.glucose} dx={i === 2 ? -12 : -12} dy={i === 2 ? 26 : -12} anchor="end" />
            ))}
            <motion.g {...fade(mix, 0.45)}><Dot p={MIX_PTS[1]} color={C.fructose} dx={-16} dy={-12} anchor="end" big /></motion.g>
            <motion.g {...fade(step >= 2, 0.3)}>
                <Dot p={MIX_PTS[0]} color={C.fructose} dx={12} dy={20} />
                <SvgText x={sx(48)} y={TOP + 30} text="48 g/h: 0,57 × 0,60" size={16} anchor="middle" color="#F3F4F6" weight={800} />
            </motion.g>
            <motion.g {...fade(step >= 3, 0.3)}><Dot p={RATIO_21} color={C.fructoseSoft} dx={12} dy={24} /></motion.g>
        </g>
    );
};
