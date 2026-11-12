import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SugarShape, type SugarKind } from './shapes';

/**
 * Detalhe de cada estação da digestão (slide 25), viewBox 560 × 240. Peças de açúcar em escala 0,7.
 * Desenho chapado: o que entra à esquerda, o que sai à direita.
 */
const INK = '#E5E7EB';

const P = ({ k, x, y, s = 0.7 }: { k: SugarKind; x: number; y: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}><SugarShape kind={k} /></g>
);

const Row = ({ kinds, x, y, gap = 32 }: { kinds: readonly SugarKind[]; x: number; y: number; gap?: number }) => (
    <g>
        {kinds.slice(1).map((_, i) => (
            <line key={i} x1={x + gap * i} y1={y} x2={x + gap * (i + 1)} y2={y} stroke={INK} strokeWidth={3} />
        ))}
        {kinds.map((k, i) => <P key={i} k={k} x={x + gap * i} y={y} />)}
    </g>
);

const Arrow = ({ x, y }: { x: number; y: number }) => (
    <g>
        <line x1={x} y1={y} x2={x + 46} y2={y} stroke={C.glucose} strokeWidth={6} strokeLinecap="round" />
        <polygon points={`${x + 44},${y - 13} ${x + 64},${y} ${x + 44},${y + 13}`} fill={C.glucose} />
    </g>
);

const Svg = ({ children, label }: { children: ReactNode; label: string }) => (
    <svg viewBox="0 0 560 240" className="h-[240px] w-[560px]" role="img" aria-label={label}>{children}</svg>
);

const G8: SugarKind[] = ['glc', 'glc', 'glc', 'glc', 'glc', 'glc', 'glc'];

export const Amylase = () => (
    <Svg label="Amilase corta o amido em maltose e dextrinas">
        <Row kinds={G8} x={30} y={90} />
        <Row kinds={['glc', 'glc', 'glc']} x={62} y={140} />
        <line x1={62} y1={90} x2={62} y2={140} stroke={INK} strokeWidth={3} />
        <SvgText x={110} y={200} text="amido" size={20} anchor="middle" />
        <Arrow x={250} y={110} />
        <Row kinds={['glc', 'glc']} x={360} y={70} />
        <SvgText x={444} y={77} text="maltose" size={18} />
        <Row kinds={['glc', 'glc']} x={360} y={150} />
        <Row kinds={['glc']} x={360} y={192} />
        <line x1={360} y1={150} x2={360} y2={192} stroke={INK} strokeWidth={3} />
        <SvgText x={444} y={157} text="dextrina" size={18} />
        <SvgText x={444} y={180} text="ramificada" size={18} />
    </Svg>
);

export const BrushBorder = () => (
    <Svg label="Enzimas da borda em escova soltam os monossacarídeos">
        <Row kinds={['glc', 'glc']} x={60} y={70} />
        <SvgText x={76} y={118} text="maltose" size={18} anchor="middle" />
        <Row kinds={['glc', 'fru']} x={60} y={170} />
        <SvgText x={76} y={218} text="sacarose" size={18} anchor="middle" />
        <Arrow x={220} y={120} />
        <P k="glc" x={350} y={70} /><P k="glc" x={410} y={70} />
        <P k="glc" x={350} y={170} /><P k="fru" x={410} y={170} />
        <SvgText x={470} y={77} text="livres" size={18} />
    </Svg>
);

/** Membrana apical com as duas portas: SGLT1 (glicose e galactose, com Na⁺) e GLUT5 (frutose). */
export const ApicalDoors = () => (
    <Svg label="SGLT1 e GLUT5 na membrana apical">
        <rect x={20} y={110} width={520} height={20} rx={6} fill={C.co2} />
        <rect x={120} y={96} width={70} height={48} rx={10} fill={C.co2} />
        <SvgText x={155} y={176} text="SGLT1" size={22} color={C.co2} anchor="middle" />
        <P k="glc" x={135} y={60} /><P k="gal" x={175} y={60} />
        <circle cx={100} cy={70} r={11} fill={C.stone} />
        <SvgText x={100} y={36} text="Na⁺" size={18} color={C.stone} anchor="middle" />
        <rect x={360} y={96} width={70} height={48} rx={10} fill={C.fructose} />
        <SvgText x={395} y={176} text="GLUT5" size={22} color={C.fructoseSoft} anchor="middle" />
        <P k="fru" x={395} y={60} />
        <SvgText x={20} y={226} text="luz do intestino em cima · célula embaixo" size={18} color="#D1D5DB" />
    </Svg>
);

/** Saída basolateral pelo GLUT2 para a veia porta, rumo ao fígado. */
export const PortalExit = () => (
    <Svg label="GLUT2 basolateral, veia porta e fígado">
        <rect x={20} y={30} width={200} height={170} rx={18} fill="none" stroke={INK} strokeWidth={3} />
        <SvgText x={120} y={22} text="enterócito" size={18} anchor="middle" />
        <P k="glc" x={70} y={100} /><P k="gal" x={120} y={100} /><P k="fru" x={170} y={100} />
        <rect x={196} y={130} width={48} height={50} rx={10} fill={C.stone} />
        <SvgText x={220} y={226} text="GLUT2" size={22} color={C.stone} anchor="middle" />
        <Arrow x={260} y={155} />
        <path d="M350 150 C350 110 420 100 470 104 C520 108 540 126 530 152 C520 178 470 196 430 192 C380 188 350 176 350 150 Z" fill={C.glycogen} />
        <SvgText x={444} y={157} text="fígado" size={20} anchor="middle" />
        <SvgText x={292} y={136} text="veia porta" size={18} color="#D1D5DB" anchor="middle" />
    </Svg>
);
