import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { phase, rng, seg } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import type { Params } from '../shared/tween';
import { capShape, domeGeometry, domePoint, touch } from './geometry';
import { CAVITY, COLORS, LIPS, TONGUE } from './layout';
import { toon, useOwned } from './materials';
import { STEP, SWISH, type RinseKey } from './steps';

/*
 * A boca: a língua (meia língua, face cortada mais escura) com as papilas do dorso, o líquido do
 * bochecho (gotas âmbar: carboidrato) que vai e volta na cavidade e depois sai pelos lábios, e a
 * seta do "cuspido". Gotas: duas InstancedMesh (gota chapada + contorno escuro), sem alocar por quadro.
 */

const DROPS = 30;
const DROP_R = 0.2;
const RIM = 1.3;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();

interface Drop { x: number; y: number; z: number; ph: number; ps: number; delay: number; spread: number; drop: number }

const DROP_DATA: readonly Drop[] = (() => {
    const r = rng(640);
    const pad = 0.25;
    return Array.from({ length: DROPS }, () => ({
        x: CAVITY.x[0] + pad + r() * (CAVITY.x[1] - CAVITY.x[0] - 2 * pad - 0.9),
        y: CAVITY.y[0] + r() * (CAVITY.y[1] - CAVITY.y[0]),
        z: CAVITY.z[0] + pad + r() * (CAVITY.z[1] - CAVITY.z[0] - 2 * pad),
        ph: r() * Math.PI * 2, ps: r() * Math.PI * 2, delay: r() * 0.45, spread: (r() - 0.5) * 1.2, drop: 0.6 + r() * 0.8,
    }));
})();

const OMEGA = Math.PI * 2 * 0.85;
/** Vaivém do bochecho (de frente para trás e de um lado para o outro), dentro da cavidade. */
const swishAt = (d: Drop, t: number, out: THREE.Vector3) => {
    const k = phase(t, SWISH.from, SWISH.from + 0.4) * (1 - phase(t, SWISH.to - 0.3, SWISH.to));
    return out.set(d.x + 0.45 + 0.75 * k * Math.sin(OMEGA * t + d.ph), d.y, d.z + 0.45 * k * Math.sin(OMEGA * 1.3 * t + d.ps));
};

/** Posição e tamanho da gota i no tempo t da etapa da boca. */
const placeDrop = (d: Drop, t: number, out: THREE.Vector3): number => {
    const a = SWISH.spitFrom + d.delay;
    if (t < a) { swishAt(d, t, out); return 1; }
    const u = seg(t, a, a + 0.75);
    swishAt(d, SWISH.to, out);
    if (u < 0.45) {
        const k = phase(u, 0, 0.45);
        out.set(out.x + (LIPS[0] - out.x) * k, out.y + (LIPS[1] - out.y) * k, out.z + (LIPS[2] - out.z) * k);
        return 1;
    }
    const v = (u - 0.45) / 0.55;
    out.set(LIPS[0] + v * 2.6, LIPS[1] - v * d.drop - v * v * 1.4, LIPS[2] + v * d.spread);
    return 1 - phase(v, 0.55, 1);
};

/** Papilas: pontos da meia cúpula da língua no alto do dorso. */
const PAPILLAE: readonly (readonly [number, number, number])[] = (() => {
    const r = rng(1957);
    const out: [number, number, number][] = [];
    const n = TONGUE.outline.length;
    for (let i = 0; i < n; i += 2) {
        const [ox, oy] = TONGUE.outline[i];
        if (ox < 3.7 || ox > 8.5 || oy < -1.8) continue;
        for (let j = 0; j < 6; j++) {
            const phi = 0.12 + j * 0.2 + r() * 0.08;
            const p = domePoint(TONGUE, i + Math.round(r()), phi);
            if (p[1] > oy - 0.4) out.push(p);
        }
    }
    return out;
})();

const TONGUE_GEO = () => domeGeometry(TONGUE, { rings: 14 });
const TONGUE_CAP = capShape(TONGUE.outline);

const useDrops = () => {
    const parts = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(DROP_R, 2);
        const fill = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: COLORS.lit }), DROPS);
        const rim = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: COLORS.hull, side: THREE.BackSide }), DROPS);
        for (const m of [fill, rim]) m.frustumCulled = false;
        return { fill, rim, geo };
    }, []);
    useEffect(() => () => {
        for (const m of [parts.fill, parts.rim]) { (m.material as THREE.Material).dispose(); m.dispose(); }
        parts.geo.dispose();
    }, [parts]);
    return parts;
};

const SpitArrow = ({ params }: { params: Params<RinseKey> }) => {
    const ref = useRef<THREE.Group>(null);
    useFrame(() => {
        const g = ref.current;
        if (!g) return;
        g.visible = params.spit > 0.01;
        g.scale.setScalar(Math.max(params.spit, 0.001));
    });
    return (
        <group ref={ref} position={[LIPS[0] + 0.45, LIPS[1] - 0.1, LIPS[2] + 0.4]} rotation={[0, 0, -0.42]} visible={false}>
            <mesh position={[0.65, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 1.3, 12]} />
                <meshBasicMaterial color={COLORS.lit} />
            </mesh>
            <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <coneGeometry args={[0.3, 0.6, 20]} />
                <meshBasicMaterial color={COLORS.lit} />
            </mesh>
        </group>
    );
};

interface Props { clock: ClockRef; params: Params<RinseKey>; ramp: THREE.Texture }

export const Mouth = ({ clock, params, ramp }: Props) => {
    const tongueGeo = useOwned(TONGUE_GEO, []);
    const tongueMat = useOwned(() => toon(COLORS.tongue, ramp), [ramp]);
    const papRef = useRef<THREE.InstancedMesh>(null);
    const drops = useDrops();

    useEffect(() => {
        const m = papRef.current;
        if (!m) return;
        PAPILLAE.forEach((p, i) => m.setMatrixAt(i, M.compose(P.set(p[0], p[1], p[2]), Q, S.setScalar(1))));
        m.instanceMatrix.needsUpdate = true;
        m.computeBoundingSphere();
    }, []);

    useFrame(() => {
        const on = clock.step === STEP.mouth;
        for (let i = 0; i < DROPS; i++) {
            const s = on ? placeDrop(DROP_DATA[i], clock.t, P) : 0;
            drops.fill.setMatrixAt(i, M.compose(P, Q, S.setScalar(s)));
            drops.rim.setMatrixAt(i, M.compose(P, Q, S.setScalar(s * RIM)));
        }
        touch(drops.fill);
        touch(drops.rim);
    });

    return (
        <group>
            <mesh geometry={tongueGeo} material={tongueMat} />
            <mesh position={[0, 0, 0.008]}>
                <shapeGeometry args={[TONGUE_CAP, 8]} />
                <meshBasicMaterial color={COLORS.tongueCut} />
            </mesh>
            <instancedMesh ref={papRef} args={[undefined, undefined, PAPILLAE.length]}>
                <sphereGeometry args={[0.1, 10, 8]} />
                <meshToonMaterial color={COLORS.papilla} gradientMap={ramp} />
            </instancedMesh>
            <primitive object={drops.fill} />
            <primitive object={drops.rim} />
            <SpitArrow params={params} />
        </group>
    );
};
