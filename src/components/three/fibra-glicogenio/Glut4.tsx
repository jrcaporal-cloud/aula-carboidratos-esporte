import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { FIBER_R, PATCHES, VESICLES } from './layout';
import { TRANSPORT, transportOf, type Keys } from './steps';

/*
 * O GLUT4: vesículas na face cortada que sobem até a membrana e placas que aparecem na parede da
 * fibra, em número proporcional ao transporte medido (LUND1995: valor / 11,5). Insulina (azul) pousa
 * nos receptores quando a chave da insulina está ligada; com wortmanina ela pousa, mas o GLUT4 quase
 * não sobe (a via da PI3K está bloqueada). Os valores perseguem o alvo com amortecimento por quadro
 * e o quadro só é pedido enquanto não convergiram.
 */

const MAX = TRANSPORT.ambas.off;
const INSULIN_N = 9;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();

interface Live { f: number; ins: number; vis: number }
interface Props { keys: Keys | null; ramp: THREE.Texture }

const approach = (cur: number, goal: number, dt: number) => goal + (cur - goal) * Math.exp(-dt * 3.2);

export const Glut4 = ({ keys, ramp }: Props) => {
    const invalidate = useThree(s => s.invalidate);
    const goal = useMemo(() => ({
        f: keys ? transportOf(keys) / MAX : 0,
        ins: keys && keys.mode !== 'contracao' ? 1 : 0,
        vis: keys ? 1 : 0,
    }), [keys]);
    useEffect(() => { invalidate(); }, [goal, invalidate]);

    const parts = useMemo(() => {
        const toon = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: ramp });
        const ves = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3, 14, 10), toon(C.insulinSoft), VESICLES.length);
        const pat = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 16), toon(C.insulinSoft), PATCHES.length);
        const ins = new THREE.InstancedMesh(new THREE.SphereGeometry(0.34, 14, 10), toon(C.insulin), INSULIN_N);
        const rec = new THREE.InstancedMesh(new THREE.BoxGeometry(0.28, 0.5, 0.28), toon('#1E3A8A'), INSULIN_N);
        for (const m of [ves, pat, ins, rec]) m.frustumCulled = false;
        return { ves, pat, ins, rec };
    }, [ramp]);
    useEffect(() => () => {
        for (const m of [parts.ves, parts.pat, parts.ins, parts.rec]) {
            m.geometry.dispose();
            (m.material as THREE.Material).dispose();
            m.dispose();
        }
    }, [parts]);
    const live = useRef<Live>({ f: 0, ins: 0, vis: 0 });
    const meshes = useRef(parts);
    useEffect(() => { meshes.current = parts; }, [parts]);

    useFrame((_, dt) => {
        const L = live.current;
        const step = Math.min(dt, 1 / 30);
        L.f = approach(L.f, goal.f, step);
        L.ins = approach(L.ins, goal.ins, step);
        L.vis = approach(L.vis, goal.vis, step * 2);
        if (Math.abs(L.f - goal.f) > 0.002 || Math.abs(L.ins - goal.ins) > 0.002 || Math.abs(L.vis - goal.vis) > 0.002) invalidate();
        // vesículas só nas etapas das chaves (fora delas não competem com o glicogênio)
        const vs = L.vis < 0.02 ? 0 : L.vis;
        const { ves, pat, ins, rec } = meshes.current;

        VESICLES.forEach((v, i) => {
            const k = Math.min(Math.max((L.f - v.seed) * 5, 0), 1);
            const r = v.r + (FIBER_R - 0.1 - v.r) * k;
            P.set(Math.cos(v.a) * r, Math.sin(v.a) * r, 0.25);
            Q.setFromEuler(E.set(0, 0, v.a));
            M.compose(P, Q, S.set((1 - 0.55 * k) * vs, (1 + 0.25 * k) * vs, vs));
            ves.setMatrixAt(i, M);
        });
        PATCHES.forEach((p, i) => {
            const k = Math.min(Math.max((L.f - p.seed) * 6, 0), 1);
            P.set(Math.cos(p.a) * (FIBER_R + 0.33), Math.sin(p.a) * (FIBER_R + 0.33), p.z);
            Q.setFromEuler(E.set(0, 0, p.a - Math.PI / 2));
            M.compose(P, Q, S.setScalar(k));
            pat.setMatrixAt(i, M);
        });
        for (let i = 0; i < INSULIN_N; i++) {
            const a = -0.4 + (i / (INSULIN_N - 1)) * 1.9;
            const z = -1.5 - ((i * 37) % 10);
            const on = L.ins > 0.01 ? 1 : 0;
            P.set(Math.cos(a) * (FIBER_R + 0.5), Math.sin(a) * (FIBER_R + 0.5), z);
            Q.setFromEuler(E.set(0, 0, a - Math.PI / 2));
            M.compose(P, Q, S.setScalar(on));
            rec.setMatrixAt(i, M);
            const d = FIBER_R + 1.05 + (1 - L.ins) * 3.5;
            P.set(Math.cos(a) * d, Math.sin(a) * d, z);
            M.compose(P, Q, S.setScalar(on));
            ins.setMatrixAt(i, M);
        }
        ves.instanceMatrix.needsUpdate = true;
        pat.instanceMatrix.needsUpdate = true;
        ins.instanceMatrix.needsUpdate = true;
        rec.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <primitive object={parts.ves} />
            <primitive object={parts.pat} />
            <primitive object={parts.ins} />
            <primitive object={parts.rec} />
        </>
    );
};
