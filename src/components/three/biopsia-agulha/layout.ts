import * as THREE from 'three';

/*
 * Geometria da biópsia (unidades da cena, fora de escala). A coxa está em corte no plano z = 0, a
 * fatia vai para z < 0. Eixos da face cortada: +x = lado de fora (lateral), +y = frente (anterior).
 * A agulha corre no eixo x, logo à frente da face (z = NEEDLE.z), e entra pelo lado de fora.
 */

export type XY = readonly [number, number];

export const SKIN = { rx: 8.3, ry: 7.5, t: 0.22 } as const;
export const FAT = { rx: SKIN.rx - SKIN.t, ry: SKIN.ry - SKIN.t } as const;
export const FASCIA = { rx: 7.2, ry: 6.45, t: 0.13 } as const;
/** Leito dos músculos (dentro da fáscia): a cor que sobra entre eles vira os septos. */
export const BED = { rx: FASCIA.rx - FASCIA.t, ry: FASCIA.ry - FASCIA.t } as const;
export const SLAB_DEPTH = 8;
export const FEMUR = { c: [0.6, -0.3] as XY, r: 1.35, marrow: 0.72 } as const;

export const TISSUE = {
    skin: '#D8B4A0',
    fat: '#BCC08A',
    fascia: '#E2E8F0',
    septum: '#5E6779',
    vl: '#BE7C7E',
    vlLabel: '#F0B3B5',
    muscle: '#7E585C',
    bone: '#E7E5E4',
    marrow: '#6B5B4B',
} as const;

/** Distância de c até a elipse (rx, ry) na direção θ (c dentro da elipse). */
const ellipseHit = (c: XY, th: number, rx: number, ry: number): number => {
    const cs = Math.cos(th);
    const sn = Math.sin(th);
    const a = (cs * cs) / (rx * rx) + (sn * sn) / (ry * ry);
    const b = 2 * ((c[0] * cs) / (rx * rx) + (c[1] * sn) / (ry * ry));
    const k = (c[0] * c[0]) / (rx * rx) + (c[1] * c[1]) / (ry * ry) - 1;
    return (-b + Math.sqrt(b * b - 4 * a * k)) / (2 * a);
};

/** Arredonda os cantos de um polígono fechado (Chaikin). */
const chaikin = (pts: readonly XY[], iterations: number): XY[] => {
    let out: XY[] = [...pts];
    for (let it = 0; it < iterations; it++) {
        out = out.flatMap((p, i) => {
            const q = out[(i + 1) % out.length];
            return [[p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25], [p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]] as XY[];
        });
    }
    return out;
};

const DEG = Math.PI / 180;
/** Vasto intermédio: crescente colado ao fêmur, afinando nas pontas (graus em volta do fêmur). */
const VI = { from: -35, to: 210, thick: 1.45 } as const;
const BONE_GAP = 0.1;
const viOuter = (deg: number): number => {
    const u = (deg - VI.from) / (VI.to - VI.from);
    if (u <= 0 || u >= 1) return FEMUR.r + BONE_GAP;
    return FEMUR.r + BONE_GAP + VI.thick * Math.pow(Math.sin(Math.PI * u), 0.6);
};
/** Raio interno dos músculos em volta: encostam no intermédio (ou no osso, onde ele acaba). */
const innerR = (deg: number) => viOuter(deg) + 0.12;
const outerR = (th: number) => ellipseHit(FEMUR.c, th, BED.rx, BED.ry) - 0.07;

interface Sector { from: number; to: number; inner: (deg: number) => number; outer: (th: number) => number; twist?: number }

const at = (deg: number, r: number): XY => [FEMUR.c[0] + Math.cos(deg * DEG) * r, FEMUR.c[1] + Math.sin(deg * DEG) * r];
const span = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

/**
 * Setor em volta do fêmur com septos curvos: o ângulo da borda gira `twist` graus por unidade de raio
 * (septos retos davam cara de pizza).
 */
const sectorPolygon = ({ from, to, inner, outer, twist = 0 }: Sector): XY[] => {
    const n = Math.max(10, Math.round((to - from) / 3));
    /** Borda radial curva: do raio interno até a fáscia; devolve os pontos e o ângulo onde chega lá fora. */
    const edge = (base: number) => {
        const rIn = inner(base);
        const rOut = outer((base + twist * 4) * DEG);
        const pts = span(rIn, rOut, 8).map(r => at(base + twist * (r - rIn), r));
        return { pts, outDeg: base + twist * (rOut - rIn) };
    };
    const a = edge(from);
    const b = edge(to);
    const outerArc = span(a.outDeg, b.outDeg, n).map(d => at(d, outer(d * DEG)));
    const innerArc = span(to, from, n).map(d => at(d, inner(d)));
    return chaikin([...a.pts.slice(0, -1), ...outerArc, ...[...b.pts].reverse().slice(1, -1), ...innerArc], 3);
};

/** Músculo oval (reto femoral, sartório): centro, raios e giro. */
const ovalPolygon = (c: XY, rx: number, ry: number, rot: number): XY[] =>
    span(0, 360, 64).slice(0, -1).map(d => {
        const x = Math.cos(d * DEG) * rx;
        const y = Math.sin(d * DEG) * ry;
        return [c[0] + x * Math.cos(rot * DEG) - y * Math.sin(rot * DEG), c[1] + x * Math.sin(rot * DEG) + y * Math.cos(rot * DEG)];
    });

export type MuscleId = 'vl' | 'vi' | 'vm' | 'add' | 'bf' | 'semi' | 'rf' | 'sart';

/** Músculos da face cortada (ângulos em graus em volta do fêmur, 0 = lado de fora, 90 = frente). */
export const MUSCLES: Readonly<Record<MuscleId, readonly XY[]>> = {
    vi: chaikin([...span(VI.from, VI.to, 60).map(d => at(d, viOuter(d))), ...span(VI.to, VI.from, 60).map(d => at(d, FEMUR.r + BONE_GAP + 0.02))], 2),
    vl: sectorPolygon({ from: -72, to: 80, inner: innerR, outer: outerR }),
    vm: sectorPolygon({ from: 100, to: 198, inner: innerR, outer: outerR, twist: -3 }),
    add: sectorPolygon({ from: 199.5, to: 243, inner: innerR, outer: outerR, twist: -2 }),
    semi: sectorPolygon({ from: 244.5, to: 265, inner: innerR, outer: outerR }),
    bf: sectorPolygon({ from: 266.5, to: 286.5, inner: innerR, outer: outerR }),
    rf: ovalPolygon([0.55, 4.55], 1.75, 1.25, 8),
    sart: ovalPolygon([-5.1, -2.15], 0.8, 0.5, 112),
};
/** Ovais desenhados por cima, com uma borda de septo em volta. */
export const OVALS: readonly MuscleId[] = ['rf', 'sart'];

/** Polígono inflado a partir do centroide (borda de septo dos ovais). */
export const grow = (pts: readonly XY[], d: number): XY[] => {
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    return pts.map(([x, y]) => {
        const n = Math.hypot(x - cx, y - cy) || 1;
        return [x + ((x - cx) / n) * d, y + ((y - cy) / n) * d];
    });
};

export const shapeOf = (pts: readonly XY[]): THREE.Shape => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
export const ellipseShape = (rx: number, ry: number): THREE.Shape => {
    const s = new THREE.Shape();
    s.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
    return s;
};

/** Ponto da face cortada na direção θ (graus, a partir do centro da coxa) sobre a elipse (rx, ry). */
export const onEllipse = (deg: number, rx: number, ry: number, z = 0.05): readonly [number, number, number] => {
    const r = ellipseHit([0, 0], deg * DEG, rx, ry);
    return [Math.cos(deg * DEG) * r, Math.sin(deg * DEG) * r, z];
};
/** Ponto em volta do fêmur (graus, raio). */
export const aroundFemur = (deg: number, r: number, z = 0.05): readonly [number, number, number] =>
    [FEMUR.c[0] + Math.cos(deg * DEG) * r, FEMUR.c[1] + Math.sin(deg * DEG) * r, z];

/* ---------- a agulha (eixo local x: 0 = ponta; a cânula cresce para +x) ---------- */

export const NEEDLE = {
    y: 1.2,
    z: 0.42,
    r: 0.33,
    rIn: 0.25,
    tipLen: 0.6,
    len: 6.4,
    win: [1.0, 2.1] as readonly [number, number],
    /** Abertura da janela (graus, centrada na frente, voltada para a câmera). */
    winArc: 110,
    cutterR: 0.23,
    cutterLen: 7.0,
    /** Frente do cilindro cortante: fechado (passa da janela) e aberto (atrás da janela). */
    cutClosed: 0.72,
    cutOpen: 2.3,
    collar: { x: 7.0, len: 0.5, r: 0.7 },
    knob: { len: 0.32, r: 0.5 },
} as const;

export const WIN_C = (NEEDLE.win[0] + NEEDLE.win[1]) / 2;
/** Ponta da agulha (x do mundo) com a janela no meio do vasto lateral. */
export const TIP_IN = 4.9 - WIN_C;
/** Antes de entrar: a ponta logo fora da pele. */
export const PRE = SKIN.rx + 0.9 - TIP_IN;
/** Depois de sair: a janela fora da coxa. */
export const PULL = 10.6 - (TIP_IN + WIN_C);

/** Onde o fragmento descansa depois de sair da agulha, e o feixe ampliado. */
export const FRAG_OUT = [10.9, 3.0, 1.2] as const;
export const BUNDLE = { c: [15.0, 7.4, -0.6] as const, fiberR: 0.5, gap: 1.1, len: 4.5, granR: 0.08, perFiber: 18 } as const;
