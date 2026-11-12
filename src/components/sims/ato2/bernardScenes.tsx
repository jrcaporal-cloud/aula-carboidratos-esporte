import { motion, useReducedMotion } from 'framer-motion';
import { EASE_IN_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HEX } from './geometry';

/**
 * Quadros chapados da história de Claude Bernard (slide 21), um por cartão do storyboard.
 * Cada desenho ocupa um viewBox 300 × 150 (renderizado ~1:1): silhueta grande, pouca linha, texto ≥ 16.
 */
const INK = '#E5E7EB';
const DARK = '#04080F';
const VB = '0 0 300 150';

/** Tubo de ensaio com o sangue "doce" (âmbar). */
const Tube = ({ x, y }: { x: number; y: number }) => (
    <g>
        <rect x={x} y={y} width={34} height={112} rx={17} fill="none" stroke={INK} strokeWidth={3.5} />
        <rect x={x + 5} y={y + 46} width={24} height={61} rx={12} fill={C.glucose} />
    </g>
);

export const Scene1848 = () => (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
        <g fill={C.co2}>
            <rect x={30} y={62} width={120} height={46} rx={23} />
            <circle cx={160} cy={54} r={26} />
            <polygon points="140,40 144,14 158,34" /><polygon points="162,32 176,10 180,40" />
            <rect x={170} y={52} width={30} height={17} rx={8} />
            {[40, 66, 104, 128].map(x => <rect key={x} x={x} y={96} width={14} height={44} rx={6} />)}
            <rect x={4} y={60} width={36} height={10} rx={5} transform="rotate(-28 30 66)" />
            <circle cx={166} cy={48} r={4} fill={DARK} />
        </g>
        <Tube x={232} y={14} />
        <SvgText x={249} y={146} text="glicose" size={16} color={C.glucoseSoft} anchor="middle" weight={700} />
    </svg>
);

/** Fígado (violeta = glicogênio) e o frasco com o pó isolado. */
const LIVER = 'M14 74 C14 36 70 22 128 28 C182 34 206 50 186 84 C166 118 116 138 74 132 C38 126 14 108 14 74 Z';

export const Scene1855 = () => (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
        <path d={LIVER} fill={C.glycogen} />
        <SvgText x={104} y={88} text="fígado" size={18} color={INK} anchor="middle" weight={700} />
        <g transform="translate(222 8)">
            <rect x={18} y={0} width={22} height={28} fill="none" stroke={INK} strokeWidth={3.5} />
            <path d="M18 28 L0 118 C-2 128 4 134 14 134 L44 134 C54 134 60 128 58 118 L40 28" fill="none" stroke={INK} strokeWidth={3.5} />
            <path d="M8 86 L50 86 L57 120 C58 126 54 129 48 129 L10 129 C4 129 0 126 1 120 Z" fill={INK} />
        </g>
    </svg>
);

/** A memória de 1857, com o título (francês, como foi publicado). */
export const Scene1857 = () => (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
        <rect x={20} y={6} width={260} height={138} rx={8} fill={INK} />
        {['Nouvelles recherches', 'expérimentales sur les', 'phénomènes glycogéniques', 'du foie'].map((t, i) => (
            <text key={t} x={150} y={34 + i * 24} textAnchor="middle" fontSize={18} fontWeight={700} fill={DARK}
                style={{ fontFamily: 'var(--font-body)' }}>{t}</text>
        ))}
        <rect x={60} y={124} width={180} height={8} rx={4} fill={C.co2} />
    </svg>
);

/** Meio interno: o fígado repõe, os tecidos retiram, o nível do sangue fica constante. Laço lento (fluxo = conteúdo). */
const FLOW = 'M 96 66 L 150 66 L 150 96 L 222 96';
const FLOW_PTS: readonly (readonly [number, number])[] = [[96, 66], [150, 66], [150, 96], [222, 96]];

const Flow = ({ on }: { on: boolean }) => {
    const reduce = useReducedMotion();
    if (reduce || !on) return null;
    return (
        <g>
            {[0, 1, 2].map(i => (
                <motion.g key={i} initial={{ x: FLOW_PTS[0][0], y: FLOW_PTS[0][1], opacity: 0 }}
                    animate={{ x: FLOW_PTS.map(p => p[0]), y: FLOW_PTS.map(p => p[1]), opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.8, delay: 0.6 + i * 1.1, repeat: Infinity, repeatDelay: 0.5, ease: EASE_IN_OUT, times: [0, 0.3, 0.55, 1] }}>
                    <polygon points={HEX} fill={C.glucose} transform="scale(0.5)" />
                </motion.g>
            ))}
        </g>
    );
};

export const SceneMilieu = ({ live }: { live: boolean }) => (
    <svg viewBox={VB} className="h-full w-full" aria-hidden>
        <path d="M6 70 C6 42 40 32 72 36 C104 40 114 52 104 74 C94 96 66 110 42 106 C18 102 6 92 6 70 Z" fill={C.glycogen} />
        <SvgText x={56} y={132} text="fígado" size={16} color={C.glycogenSoft} anchor="middle" weight={700} />
        <rect x={118} y={20} width={64} height={110} rx={12} fill="none" stroke={INK} strokeWidth={3.5} />
        <rect x={123} y={60} width={54} height={65} rx={8} fill={C.glucoseDeep} />
        <line x1={110} y1={60} x2={190} y2={60} stroke={INK} strokeWidth={3} strokeDasharray="7 5" />
        <SvgText x={150} y={146} text="sangue" size={16} color={INK} anchor="middle" weight={700} />
        <path d={FLOW} fill="none" stroke={C.glucose} strokeWidth={4} strokeLinejoin="round" opacity={0.7} />
        <rect x={226} y={60} width={66} height={66} rx={14} fill={`${C.co2}38`} stroke={C.co2} strokeWidth={3} />
        <SvgText x={259} y={146} text="tecidos" size={16} color={INK} anchor="middle" weight={700} />
        <Flow on={live} />
    </svg>
);
