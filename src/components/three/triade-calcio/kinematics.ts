import * as THREE from 'three';
import { ACTIN_YZ, FRONT_Z, JUNCTIONS, LONG_R, LONG_TUBE, SERCA_ANGLES, SERCA_X, TROPONIN, Z_REST, Z_SHIFT } from './layout';

/*
 * Posições que mudam com a contração (con: 0 repouso → 1 contraído) e os trajetos dos íons de Ca²⁺.
 * Funções puras que escrevem num vetor de saída (nada de alocação por quadro).
 */

/** x da linha Z do lado s (−1 esquerda, +1 direita). */
export const zLineX = (s: number, con: number): number => s * (Z_REST - con * Z_SHIFT);

/** Íons: 4 por tríade (esquerda 0–3, direita 4–7). */
export const ION_COUNT = TROPONIN.length * 2;
export const sideOf = (i: number): number => (i < TROPONIN.length ? -1 : 1);

/** Troponina C do íon i (na actina, que anda com a linha Z). Com `lift`, o ponto um pouco para fora da haste. */
export const troponinPos = (i: number, con: number, out: THREE.Vector3, lift = 0): THREE.Vector3 => {
    const s = sideOf(i);
    const t = TROPONIN[i % TROPONIN.length];
    const [y, z] = ACTIN_YZ[t.rod];
    const r = Math.hypot(y, z) || 1;
    const k = 1 + lift / r;
    return out.set(zLineX(s, con) - s * t.fromZ, y * k, FRONT_Z + z * k);
};

/** Os RyR1 de onde saem os íons: cisterna de dentro da tríade (lado do sarcômero), arco da frente. */
const RYR_FOR_ION: readonly number[] = (() => {
    const inner = (j: (typeof JUNCTIONS)[number]) => Math.sign(j.side) === -Math.sign(j.x);
    const pick = (x: number) => JUNCTIONS.map((j, k) => ({ j, k })).filter(({ j }) => j.x === x && inner(j)).slice(0, TROPONIN.length).map(({ k }) => k);
    return [...pick(JUNCTIONS[0].x), ...pick(-JUNCTIONS[0].x)];
})();

/** Boca do RyR1 do íon i (no vão entre a cisterna e o túbulo T, já do lado de fora do RS). */
export const ryrMouth = (i: number, out: THREE.Vector3, r = 1.25): THREE.Vector3 => {
    const j = JUNCTIONS[RYR_FOR_ION[i]];
    return out.set(j.x + j.side * 0.41, r * Math.sin(j.a), FRONT_Z + r * Math.cos(j.a));
};

/** SERCA que recolhe o íon i (duas bombas por lado, dois íons por bomba). */
export const sercaPos = (i: number, out: THREE.Vector3, r = LONG_R - LONG_TUBE - 0.25): THREE.Vector3 => {
    const s = sideOf(i);
    const k = i % TROPONIN.length;
    const x = s * SERCA_X[k % SERCA_X.length];
    const a = SERCA_ANGLES[Math.floor(k / SERCA_X.length) % SERCA_ANGLES.length];
    return out.set(x, r * Math.sin(a), FRONT_Z + r * Math.cos(a));
};

const A = new THREE.Vector3();
const B = new THREE.Vector3();

/** Saída: boca do RyR1 → para dentro da miofibrila → troponina. u de 0 a 1. */
export const releasePath = (i: number, u: number, con: number, out: THREE.Vector3): THREE.Vector3 => {
    if (u < 0.35) return out.lerpVectors(ryrMouth(i, A), ryrMouth(i, B, 0.95), u / 0.35);
    return out.lerpVectors(ryrMouth(i, A, 0.95), troponinPos(i, con, B, 0.17), (u - 0.35) / 0.65);
};

/** Volta: troponina → frente da SERCA → para dentro da bomba. */
export const uptakePath = (i: number, u: number, con: number, out: THREE.Vector3): THREE.Vector3 => {
    if (u < 0.75) return out.lerpVectors(troponinPos(i, con, A, 0.17), sercaPos(i, B), u / 0.75);
    return out.lerpVectors(sercaPos(i, A), sercaPos(i, B, LONG_R), (u - 0.75) / 0.25);
};

/** Tamanho dos íons (raio, unidades da cena): ≥ 10 px no quadro aberto. */
export const ION_R = 0.2;

/** Ordem fixa de saída: com menos Ca²⁺, quem fica no RS é um íon da tríade da esquerda (a que a câmera olha). */
const RANK: readonly number[] = [0, 2, 4, 7, 1, 3, 5, 6];

/** O íon i sai quando a fração `share` cobre a sua vez (8 íons: 85% → 7 saem). */
export const ionOut = (i: number, share: number): boolean => (RANK[i] + 0.5) / ION_COUNT <= share;
