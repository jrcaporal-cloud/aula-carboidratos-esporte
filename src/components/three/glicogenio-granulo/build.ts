import * as THREE from 'three';
import { rng } from '../shared/math';

/*
 * O grânulo no modelo de camadas (Roach 2012, "altamente estilizado" pelos próprios autores):
 * cada cadeia tem 13 glicoses; cada cadeia interna (B) abre 2 ramos; 12 camadas → 2¹² − 1 = 4.095
 * cadeias e 13 × 4.095 = 53.235 glicoses (o artigo arredonda para ~55.000). A camada 12 tem 2.048
 * cadeias externas (A), sem ramos: metade das glicoses. 1 unidade da cena = 1 nm; raio 22 nm.
 *
 * Para a esfera ficar cheia por igual, as direções das cadeias saem de uma divisão recursiva de
 * 2.048 pontos de Fibonacci na esfera: cada cadeia "cobre" um pedaço do céu e os seus dois ramos
 * dividem esse pedaço ao meio.
 */

export const TIERS = 12;
export const CHAIN = 13;
export const RADIUS = 22;
export const SHELL = RADIUS / TIERS;
/** Ramos saem destas posições da cadeia B (0 = ponta redutora). */
const BRANCH_AT = [3, 8] as const;
const STEP_HELIX = 0.95;
const HELIX_R = 0.42;

export interface Chain { tier: number; dir: THREE.Vector3; pts: THREE.Vector3[] }

export interface Granule {
    count: number;
    /** Centro de cada glicose (x, y, z). */
    pos: Float32Array;
    /** Camada, posição na cadeia, semente aleatória, índice da cadeia. */
    data: Float32Array;
    chains: Chain[];
}

const fibonacci = (n: number): THREE.Vector3[] => {
    const out: THREE.Vector3[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (2 * (i + 0.5)) / n;
        const r = Math.sqrt(1 - y * y);
        out.push(new THREE.Vector3(Math.cos(ga * i) * r, y, Math.sin(ga * i) * r));
    }
    return out;
};

/** Divide o conjunto pela mediana no eixo de maior espalhamento (árvore binária balanceada). */
const split = (pts: readonly THREE.Vector3[]): [THREE.Vector3[], THREE.Vector3[]] => {
    const spread = (k: 'x' | 'y' | 'z') => Math.max(...pts.map(p => p[k])) - Math.min(...pts.map(p => p[k]));
    const axis = (['x', 'y', 'z'] as const).reduce((a, b) => (spread(b) > spread(a) ? b : a));
    const sorted = [...pts].sort((a, b) => a[axis] - b[axis]);
    const half = sorted.length / 2;
    return [sorted.slice(0, half), sorted.slice(half)];
};

const mean = (pts: readonly THREE.Vector3[], fallback: THREE.Vector3) => {
    const m = pts.reduce((acc, p) => acc.add(p), new THREE.Vector3());
    return m.lengthSq() < 1e-4 ? fallback.clone() : m.normalize();
};

/** Primer: a cadeia da camada 1 sai da superfície da glicogenina e vai um pouco além da camada. */
const PRIMER_START = new THREE.Vector3(0.25, 0.75, 0.3);
const PRIMER_R = 3.2;

/** 13 glicoses da origem (ramo do pai) até o raio da camada, numa hélice que se fecha nas pontas. */
const makeChainPoints = (start: THREE.Vector3, end: THREE.Vector3, rand: () => number) => {
    const dir = end.clone().sub(start).normalize();
    const u = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    const v = new THREE.Vector3().crossVectors(dir, u);
    const phase = rand() * Math.PI * 2;
    return Array.from({ length: CHAIN }, (_, k) => {
        const f = k / (CHAIN - 1);
        const a = phase + k * STEP_HELIX;
        const h = HELIX_R * Math.sin(Math.PI * f);
        return start.clone().lerp(end, f).addScaledVector(u, Math.cos(a) * h).addScaledVector(v, Math.sin(a) * h);
    });
};

export const buildGranule = (): Granule => {
    const rand = rng(20120763);
    const chains: Chain[] = [];
    const grow = (tier: number, sky: readonly THREE.Vector3[], start: THREE.Vector3, parentDir: THREE.Vector3) => {
        const dir = tier === 1 ? new THREE.Vector3(0.3, 0.9, 0.3).normalize() : mean(sky, parentDir);
        const end = dir.clone().multiplyScalar(tier === 1 ? PRIMER_R : tier * SHELL);
        const pts = makeChainPoints(start, end, rand);
        chains.push({ tier, dir, pts });
        if (tier === TIERS) return;
        const [a, b] = split(sky);
        grow(tier + 1, a, pts[BRANCH_AT[0]], dir);
        grow(tier + 1, b, pts[BRANCH_AT[1]], dir);
    };
    grow(1, fibonacci(2 ** (TIERS - 1)), PRIMER_START, new THREE.Vector3(0, 1, 0));

    const count = chains.length * CHAIN;
    const pos = new Float32Array(count * 3);
    const data = new Float32Array(count * 4);
    chains.forEach((c, ci) => c.pts.forEach((p, k) => {
        const i = ci * CHAIN + k;
        pos.set([p.x, p.y, p.z], i * 3);
        data.set([c.tier, k, rand(), ci], i * 4);
    }));
    return { count, pos, data, chains };
};

/** Glicoses do modelo com n camadas completas: 13 × (2ⁿ − 1). */
export const glucoseIn = (tiers: number): number => CHAIN * (2 ** tiers - 1);
