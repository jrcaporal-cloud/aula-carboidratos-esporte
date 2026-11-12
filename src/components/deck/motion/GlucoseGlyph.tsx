import { C } from '../../sims/kit/palette';

/** Desenho 2D da glicose (caixa de 100 × 100; quem usa escala por transform). */
export const GLYPH_PX = 100;

/** `free` = glicose solta; `stored` = um elo do glicogênio (ligações α-1,4 para os dois lados). */
export type GlucoseForm = 'free' | 'stored';

const R = 34;
/** Vértice do anel no ângulo `deg` (0° = direita, sentido horário na tela). */
const vertex = (deg: number, r = R): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [Math.cos(a) * r, Math.sin(a) * r];
};
const RING = [30, 90, 150, 210, 270, 330].map(d => vertex(d).join(',')).join(' ');
const [OX, OY] = vertex(330);
const [C5X, C5Y] = vertex(270);
const [C1X, C1Y] = vertex(30);
const [C4X, C4Y] = vertex(210);
const BOND = 24;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

interface GlucoseGlyphProps {
    form: GlucoseForm;
}

/**
 * Glicose em anel (piranose), chapada: hexágono âmbar com o oxigênio do anel em branco e o CH₂OH
 * no carbono 5. No glicogênio ganha as duas ligações (C1 e C4) na cor do estoque — troca por opacidade.
 * Sem brilho nem giro: o codec da videochamada borra brilho e o giro sem sentido distrai.
 */
export const GlucoseGlyph = ({ form }: GlucoseGlyphProps) => {
    const stored = form === 'stored';
    const bondStyle = { opacity: stored ? 1 : 0, transition: `opacity 360ms ${EASE}` };
    return (
        <svg viewBox="-50 -50 100 100" width={GLYPH_PX} height={GLYPH_PX} className="overflow-visible">
            <g style={bondStyle}>
                <line x1={C1X} y1={C1Y} x2={C1X + BOND} y2={C1Y} stroke={C.glycogen} strokeWidth={7} strokeLinecap="round" />
                <circle cx={C1X + BOND + 4} cy={C1Y} r={8} fill={C.glycogen} />
                <line x1={C4X} y1={C4Y} x2={C4X - BOND} y2={C4Y} stroke={C.glycogen} strokeWidth={7} strokeLinecap="round" />
                <circle cx={C4X - BOND - 4} cy={C4Y} r={8} fill={C.glycogen} />
            </g>
            <line x1={C5X} y1={C5Y} x2={C5X} y2={C5Y - 16} stroke={C.glucoseDeep} strokeWidth={6} strokeLinecap="round" />
            <circle cx={C5X} cy={C5Y - 20} r={7} fill={C.glucoseSoft} stroke={C.glucoseDeep} strokeWidth={4} />
            <polygon points={RING} fill={C.glucose} stroke={C.glucoseDeep} strokeWidth={6} strokeLinejoin="round" />
            <circle cx={OX} cy={OY} r={9} fill={C.text} stroke={C.glucoseDeep} strokeWidth={4} />
        </svg>
    );
};
