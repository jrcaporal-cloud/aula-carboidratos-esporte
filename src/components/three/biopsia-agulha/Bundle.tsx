import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng } from '../shared/math';
import type { Params } from '../shared/tween';
import { BUNDLE, FRAG_OUT } from './layout';
import type { BiopsyKey } from './steps';

/*
 * O fragmento ampliado: um feixe de 19 fibras (cilindros em rede hexagonal) com a face de frente
 * cortada e, nela, os grânulos de glicogênio em violeta (os mesmos do modelo "Árvore de Glicose").
 * Uma lupa em volta do fragmento e duas linhas-guia de 3 px ligam o pedaço pequeno ao ampliado.
 * Duas InstancedMesh (fibras, grânulos), criadas uma vez e liberadas ao fechar.
 */

const AXIS = new THREE.Vector3(-0.5, 0.35, 1).normalize();
const QUAT = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), AXIS);
const FIBER_SIDE = '#C98F86';
const FIBER_CUT = '#4A2E3A';

interface Fiber { x: number; z: number; dy: number }

/** 19 fibras: centro + dois anéis hexagonais, com pequeno desalinhamento fixo. */
const FIBERS: readonly Fiber[] = (() => {
    const rand = rng(1967);
    const out: Fiber[] = [];
    for (let q = -2; q <= 2; q++) {
        for (let r = -2; r <= 2; r++) {
            if (Math.abs(q + r) > 2) continue;
            out.push({
                x: BUNDLE.gap * (q + r / 2) + (rand() - 0.5) * 0.12,
                z: BUNDLE.gap * (r * Math.sqrt(3) / 2) + (rand() - 0.5) * 0.12,
                dy: (rand() - 0.5) * 0.5,
            });
        }
    }
    return out;
})();

/** Grânulos na face cortada de cada fibra (disco), um pouco à frente do corte. */
const GRANULES: readonly (readonly [number, number, number])[] = (() => {
    const rand = rng(5584523);
    return FIBERS.flatMap(f => Array.from({ length: BUNDLE.perFiber }, () => {
        const a = rand() * Math.PI * 2;
        const d = Math.sqrt(rand()) * (BUNDLE.fiberR - BUNDLE.granR * 1.6);
        return [f.x + Math.cos(a) * d, BUNDLE.len / 2 + f.dy + 0.02, f.z + Math.sin(a) * d] as const;
    }));
})();

const useBundleMeshes = (ramp: THREE.Texture) => {
    const built = useMemo(() => {
        const fiberGeo = new THREE.CylinderGeometry(BUNDLE.fiberR, BUNDLE.fiberR, BUNDLE.len, 32);
        const side = new THREE.MeshToonMaterial({ color: FIBER_SIDE, gradientMap: ramp });
        const cut = new THREE.MeshBasicMaterial({ color: FIBER_CUT });
        const fibers = new THREE.InstancedMesh(fiberGeo, [side, cut, cut], FIBERS.length);
        const m = new THREE.Matrix4();
        FIBERS.forEach((f, i) => fibers.setMatrixAt(i, m.makeTranslation(f.x, f.dy, f.z)));
        const granGeo = new THREE.IcosahedronGeometry(BUNDLE.granR, 1);
        const granMat = new THREE.MeshToonMaterial({ color: C.glycogenSoft, gradientMap: ramp });
        const granules = new THREE.InstancedMesh(granGeo, granMat, GRANULES.length);
        GRANULES.forEach((g, i) => granules.setMatrixAt(i, m.makeTranslation(g[0], g[1], g[2])));
        return { fibers, granules, owned: { geos: [fiberGeo, granGeo], mats: [side, cut, granMat] } };
    }, [ramp]);
    useEffect(() => () => {
        built.owned.geos.forEach(g => g.dispose());
        built.owned.mats.forEach(mt => mt.dispose());
        built.fibers.dispose();
        built.granules.dispose();
    }, [built]);
    return built;
};

/** Linhas da lupa: tangentes do fragmento ao feixe (perpendicular à direção entre os dois). */
const ZOOM_LINES = (() => {
    const dx = BUNDLE.c[0] - FRAG_OUT[0];
    const dy = BUNDLE.c[1] - FRAG_OUT[1];
    const n = Math.hypot(dx, dy);
    const px = -dy / n;
    const py = dx / n;
    const from = 0.95;
    const to = 3.3;
    const zTo = BUNDLE.c[2] + 1.2;
    return [1, -1].map(s => [
        [FRAG_OUT[0] + px * from * s, FRAG_OUT[1] + py * from * s, FRAG_OUT[2]],
        [BUNDLE.c[0] + px * to * s, BUNDLE.c[1] + py * to * s, zTo],
    ] as [number, number, number][]);
})();

export const Bundle = ({ params, ramp }: { params: Params<BiopsyKey>; ramp: THREE.Texture }) => {
    const { fibers, granules } = useBundleMeshes(ramp);
    const feixe = useRef<THREE.Group>(null);
    const lupa = useRef<THREE.Group>(null);
    useFrame(() => {
        const z = params.zoom;
        const f = feixe.current;
        const l = lupa.current;
        if (!f || !l) return;
        f.visible = z > 0.01;
        f.scale.setScalar(Math.max(z, 0.001));
        l.visible = z > 0.15;
    });
    return (
        <>
            <group ref={feixe} position={[...BUNDLE.c]} quaternion={QUAT} visible={false}>
                <primitive object={fibers} />
                <primitive object={granules} />
            </group>
            <group ref={lupa} visible={false}>
                <mesh position={[...FRAG_OUT]}>
                    <ringGeometry args={[0.85, 0.95, 48]} />
                    <meshBasicMaterial color={C.caveat} side={THREE.DoubleSide} />
                </mesh>
                {ZOOM_LINES.map((pts, i) => <Line key={i} points={pts} color={C.caveat} lineWidth={3} />)}
            </group>
        </>
    );
};
