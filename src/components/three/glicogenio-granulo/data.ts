import * as THREE from 'three';
import { buildGranule, TIERS } from './build';

/*
 * O grânulo é montado uma vez, quando o modelo é baixado (o mesmo para toda a aula), e as enzimas
 * escolhem as cadeias externas que a câmera das etapas 5 e 6 enxerga.
 */

export const GRANULE = buildGranule();

/** Normal do plano de corte (o que fica do lado positivo some na etapa 4 em diante). */
export const CUT_N = new THREE.Vector3(-0.35, 0.3, 1).normalize();
/** Lado do grânulo que a câmera das enzimas olha. */
export const ENZYME_SIDE = new THREE.Vector3(1, 0.42, -0.25).normalize();
export const ENZYME_COUNT = 14;

/** Cadeias externas (camada 12) onde as enzimas trabalham: viradas para a câmera e fora do corte. */
export const ENZYME_CHAINS: readonly number[] = (() => {
    const picked: number[] = [];
    const used: THREE.Vector3[] = [];
    GRANULE.chains.forEach((c, i) => {
        if (picked.length >= ENZYME_COUNT || c.tier !== TIERS) return;
        if (c.dir.dot(ENZYME_SIDE) < 0.8 || c.dir.dot(CUT_N) > -0.05) return;
        // espaçadas: uma enzima não encosta na outra
        if (used.some(d => d.dot(c.dir) > 0.96)) return;
        picked.push(i);
        used.push(c.dir);
    });
    return picked;
})();

const chain = (i: number) => GRANULE.chains[i];
const toVec3 = (v: THREE.Vector3) => [v.x, v.y, v.z] as const;
const along = (i: number, k: number, out = 0) => toVec3(chain(i).pts[k].clone().addScaledVector(chain(i).dir, out));

/** Pontos de ancoragem dos rótulos (todos saem do grânulo construído). */
export const ANCHOR = {
    glycogenin: [-0.9, -0.2, 0.55] as const,
    primerTip: along(0, 12),
    alpha14: along(1, 6),
    alpha16: along(1, 0),
    shell12: toVec3(ENZYME_SIDE.clone().multiplyScalar(22)),
    enzyme: along(ENZYME_CHAINS[0], 12, 1.8),
    stump: along(ENZYME_CHAINS[3] ?? ENZYME_CHAINS[0], 3),
} as const;
