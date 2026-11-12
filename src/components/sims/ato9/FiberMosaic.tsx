import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { hash01 } from './hash';

/**
 * Corte transversal do vasto lateral, em mosaico chapado de 100 fibras (hexágonos com vértices tremidos,
 * para parecer tecido e não favo). Cada fibra = 1%: quando `emptied` liga, exatamente `emptyCount` fibras esvaziam.
 * A disposição é ilustrativa; a proporção é a do estudo.
 */

const COLS = 10;
const ROWS = 10;
const R = 24;
const W = Math.sqrt(3) * R;
const PAD = 6;
export const MOSAIC_W = Math.ceil(COLS * W + W / 2 + PAD * 2);
export const MOSAIC_H = Math.ceil(2 * R + (ROWS - 1) * 1.5 * R + PAD * 2);

interface Cell {
    id: number;
    points: string;
    cx: number;
    cy: number;
    col: number;
    /** Ordem de esvaziamento (0 = primeira); só as `emptyCount` primeiras esvaziam. */
    rank: number;
    /** Nível antes do jogo: quase todas cheias, algumas um pouco abaixo (variação natural). */
    start: number;
}

/** O mesmo vértice, vindo de hexágonos vizinhos, recebe o mesmo tremor: o mosaico continua fechado. */
const jitter = (x: number, y: number): [number, number] => {
    const key = Math.round(x * 10) * 7919 + Math.round(y * 10);
    return [x + (hash01(key) - 0.5) * 9, y + (hash01(key + 17) - 0.5) * 9];
};

const buildCells = (): Cell[] => {
    const raw = Array.from({ length: COLS * ROWS }, (_, id) => {
        const row = Math.floor(id / COLS);
        const col = id % COLS;
        const cx = PAD + W / 2 + col * W + (row % 2 ? W / 2 : 0);
        const cy = PAD + R + row * 1.5 * R;
        const points = [-90, -30, 30, 90, 150, 210]
            .map(a => jitter(cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)))
            .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
            .join(' ');
        return { id, points, cx, cy, col, order: hash01(id + 1000), start: hash01(id + 50) < 0.14 ? 0.72 : 1 };
    });
    const ranked = [...raw].sort((a, b) => a.order - b.order).map(c => c.id);
    return raw.map(({ id, points, cx, cy, col, start }) => ({ id, points, cx, cy, col, start, rank: ranked.indexOf(id) }));
};

/** O mosaico é fixo: calculado uma vez, quando o módulo carrega. */
const CELLS = buildCells();

/** A fibra que o slide 160 amplia: uma das que esvaziam, na borda direita, perto do meio (coordenadas do viewBox). */
const ZOOM_EMPTY = 47;
export const ZOOM_CELL = [...CELLS]
    .filter(c => c.col >= 8 && c.rank < ZOOM_EMPTY)
    .sort((a, b) => Math.abs(a.cy - MOSAIC_H / 2) - Math.abs(b.cy - MOSAIC_H / 2))[0];

interface FiberMosaicProps {
    emptied: boolean;
    emptyCount: number;
    /** Largura de exibição (o mosaico não tem texto: pode encolher). */
    width?: number;
    /** Contorna a fibra ampliada (ZOOM_CELL). */
    highlight?: boolean;
}

export const FiberMosaic = ({ emptied, emptyCount, width = MOSAIC_W, highlight = false }: FiberMosaicProps) => {
    const reduce = useReducedMotion();
    return (
        <svg viewBox={`0 0 ${MOSAIC_W} ${MOSAIC_H}`} width={width} height={(width * MOSAIC_H) / MOSAIC_W} role="img"
            aria-label={emptied ? `${emptyCount} de 100 fibras vazias ou quase vazias` : '100 fibras cheias de glicogênio'}>
            {/* base: a fibra sem glicogênio (ardósia escura) */}
            {CELLS.map(c => (
                <polygon key={`b${c.id}`} points={c.points} fill="#1E293B" stroke="#04080F" strokeWidth={4} strokeLinejoin="round" />
            ))}
            {/* glicogênio: a camada violeta apaga fibra a fibra */}
            {CELLS.map(c => {
                const empty = emptied && c.rank < emptyCount;
                return (
                    <motion.polygon key={`g${c.id}`} points={c.points} fill={C.glycogen} stroke="#04080F" strokeWidth={4} strokeLinejoin="round"
                        initial={false}
                        animate={{ opacity: empty ? 0 : c.start }}
                        transition={{ delay: empty && !reduce ? c.rank * 0.014 : 0, duration: reduce ? 0 : 0.4, ease: EASE_OUT }} />
                );
            })}
            {ZOOM_CELL && (
                <motion.polygon points={ZOOM_CELL.points} fill="none" stroke="#F9FAFB" strokeWidth={5} strokeLinejoin="round"
                    initial={false} animate={{ opacity: highlight ? 1 : 0 }} transition={{ duration: DUR.enter }} />
            )}
        </svg>
    );
};
